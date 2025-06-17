import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WebHookService, WebHookEndpoint, WebHookEvent } from './webhook.service';

describe('WebHookService', () => {
  let service: WebHookService;
  let httpMock: HttpTestingController;

  const mockEndpoint: WebHookEndpoint = {
    id: 'test_endpoint',
    name: 'Test Endpoint',
    url: 'https://test.webhook.com',
    events: ['pokemon_viewed', 'pokemon_favorited'],
    enabled: true,
    retry_attempts: 2,
    timeout_ms: 3000,
    headers: { 'Authorization': 'Bearer test-token' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WebHookService]
    });
    service = TestBed.inject(WebHookService);
    httpMock = TestBed.inject(HttpTestingController);

    // Limpar localStorage
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate unique session id on initialization', () => {
    const sessionId = service['sessionId'];
    expect(sessionId).toBeTruthy();
    expect(sessionId).toMatch(/^sess_\d+_[a-z0-9]+$/);
  });

  describe('Endpoint Management', () => {
    it('should add endpoint correctly', () => {
      service.addEndpoint(mockEndpoint);
      
      const endpoints = service.getEndpoints();
      expect(endpoints.length).toBe(4); // 3 default + 1 added
      expect(endpoints[3]).toEqual(mockEndpoint);
    });

    it('should remove endpoint correctly', () => {
      service.addEndpoint(mockEndpoint);
      const initialCount = service.getEndpoints().length;
      
      service.removeEndpoint(mockEndpoint.id);
      
      const endpoints = service.getEndpoints();
      expect(endpoints.length).toBe(initialCount - 1);
      expect(endpoints.find(ep => ep.id === mockEndpoint.id)).toBeUndefined();
    });

    it('should get copy of endpoints array', () => {
      const endpoints1 = service.getEndpoints();
      const endpoints2 = service.getEndpoints();
      
      expect(endpoints1).not.toBe(endpoints2); // Different references
      expect(endpoints1).toEqual(endpoints2); // Same content
    });
  });

  describe('User Management', () => {
    it('should set user id and send identification event', () => {
      spyOn(service, 'sendEvent');
      
      service.setUserId('user123');
      
      expect(service.sendEvent).toHaveBeenCalledWith('user_identified', { user_id: 'user123' });
    });
  });

  describe('Service Control', () => {
    it('should enable/disable service', () => {
      service.setEnabled(false);
      expect(service['isEnabled']).toBe(false);
      
      service.setEnabled(true);
      expect(service['isEnabled']).toBe(true);
    });

    it('should not send events when disabled', () => {
      service.setEnabled(false);
      spyOn(service, 'processEvent' as any);
      
      service.sendEvent('test_event', {});
      
      expect((service as any).processEvent).not.toHaveBeenCalled();
    });
  });

  describe('Event Sending', () => {
    beforeEach(() => {
      service.addEndpoint(mockEndpoint);
    });

    it('should send event with correct structure', () => {
      service.sendEvent('pokemon_viewed', { pokemon_id: 1 });

      const req = httpMock.expectOne(mockEndpoint.url);
      expect(req.request.method).toBe('POST');
      
      const body = req.request.body as WebHookEvent;
      expect(body.event).toBe('pokemon_viewed');
      expect(body.data).toEqual({ pokemon_id: 1 });
      expect(body.id).toMatch(/^evt_\d+_[a-z0-9]+$/);
      expect(body.timestamp).toBeGreaterThan(0);
      expect(body.session_id).toBeTruthy();
      expect(body.app_version).toBe('1.0.0');
      expect(body.platform).toBeTruthy();

      req.flush('OK', { status: 200, statusText: 'OK' });
    });

    it('should include correct headers', () => {
      service.sendEvent('pokemon_viewed', {});

      const req = httpMock.expectOne(mockEndpoint.url);
      
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('X-Webhook-Event')).toBe('pokemon_viewed');
      expect(req.request.headers.get('X-Session-ID')).toBeTruthy();
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');

      req.flush('OK', { status: 200, statusText: 'OK' });
    });

    it('should not send to disabled endpoints', () => {
      mockEndpoint.enabled = false;
      service.addEndpoint(mockEndpoint);
      
      service.sendEvent('pokemon_viewed', {});
      
      httpMock.expectNone(mockEndpoint.url);
    });

    it('should only send to endpoints that support the event', () => {
      const specificEndpoint = { ...mockEndpoint, events: ['pokemon_searched'] };
      service.addEndpoint(specificEndpoint);
      
      service.sendEvent('pokemon_viewed', {}); // Only mockEndpoint should receive this
      
      httpMock.expectOne(mockEndpoint.url).flush('OK', { status: 200, statusText: 'OK' });
      httpMock.expectNone(specificEndpoint.url);
    });

    it('should send to endpoints with wildcard event support', () => {
      const wildcardEndpoint = { ...mockEndpoint, id: 'wildcard', events: ['*'] };
      service.addEndpoint(wildcardEndpoint);
      
      service.sendEvent('any_event', {});
      
      // Should send to both endpoints
      httpMock.expectOne(mockEndpoint.url).flush('OK', { status: 200, statusText: 'OK' });
      httpMock.expectOne(wildcardEndpoint.url).flush('OK', { status: 200, statusText: 'OK' });
    });
  });

  describe('Specific Pokemon Events', () => {
    beforeEach(() => {
      service.addEndpoint(mockEndpoint);
    });

    it('should track pokemon viewed correctly', () => {
      service.trackPokemonViewed(25, 'pikachu');

      const req = httpMock.expectOne(mockEndpoint.url);
      const body = req.request.body;
      
      expect(body.event).toBe('pokemon_viewed');
      expect(body.data.pokemon_id).toBe(25);
      expect(body.data.pokemon_name).toBe('pikachu');
      expect(body.data.view_timestamp).toBeGreaterThan(0);

      req.flush('OK', { status: 200, statusText: 'OK' });
    });

    it('should track pokemon favorited correctly', () => {
      service.trackPokemonFavorited(1, 'bulbasaur', 'added');

      const req = httpMock.expectOne(mockEndpoint.url);
      const body = req.request.body;
      
      expect(body.event).toBe('pokemon_favorited');
      expect(body.data.pokemon_id).toBe(1);
      expect(body.data.pokemon_name).toBe('bulbasaur');
      expect(body.data.action).toBe('added');

      req.flush('OK', { status: 200, statusText: 'OK' });
    });

    it('should track search performed correctly', () => {
      service.trackSearchPerformed('pikachu', 1, 'name');

      const req = httpMock.expectOne(mockEndpoint.url);
      const body = req.request.body;
      
      expect(body.event).toBe('pokemon_searched');
      expect(body.data.search_term).toBe('pikachu');
      expect(body.data.results_count).toBe(1);
      expect(body.data.search_type).toBe('name');

      req.flush('OK', { status: 200, statusText: 'OK' });
    });

    it('should track page visited correctly', () => {
      service.trackPageVisited('home', { extra: 'data' });

      const req = httpMock.expectOne(mockEndpoint.url);
      const body = req.request.body;
      
      expect(body.event).toBe('page_visited');
      expect(body.data.page_name).toBe('home');
      expect(body.data.extra).toBe('data');

      req.flush('OK', { status: 200, statusText: 'OK' });
    });

    it('should track user interaction correctly', () => {
      service.trackUserInteraction('button_click', { button: 'favorite' });

      const req = httpMock.expectOne(mockEndpoint.url);
      const body = req.request.body;
      
      expect(body.event).toBe('user_interaction');
      expect(body.data.interaction_type).toBe('button_click');
      expect(body.data.button).toBe('favorite');

      req.flush('OK', { status: 200, statusText: 'OK' });
    });

    it('should track errors correctly', () => {
      service.trackError('api_error', 'Pokemon not found', { pokemon_id: 999 });

      const req = httpMock.expectOne(mockEndpoint.url);
      const body = req.request.body;
      
      expect(body.event).toBe('app_error');
      expect(body.data.error_type).toBe('api_error');
      expect(body.data.error_message).toBe('Pokemon not found');
      expect(body.data.pokemon_id).toBe(999);

      req.flush('OK', { status: 200, statusText: 'OK' });
    });
  });

  describe('Error Handling and Retry', () => {
    beforeEach(() => {
      service.addEndpoint(mockEndpoint);
    });

    it('should handle successful response', () => {
      service.sendEvent('pokemon_viewed', {});

      const req = httpMock.expectOne(mockEndpoint.url);
      req.flush('Success', { status: 200, statusText: 'OK' });

      const stats = service.getStats();
      expect(stats.events_sent).toBe(1);
      expect(stats.events_success).toBe(1);
      expect(stats.events_failed).toBe(0);
    });

    it('should handle failed response', () => {
      service.sendEvent('pokemon_viewed', {});

      const req = httpMock.expectOne(mockEndpoint.url);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      const stats = service.getStats();
      expect(stats.events_sent).toBe(1);
      expect(stats.events_failed).toBe(1);
    });

    it('should handle network error', () => {
      service.sendEvent('pokemon_viewed', {});

      const req = httpMock.expectOne(mockEndpoint.url);
      req.error(new ErrorEvent('Network error'));

      const stats = service.getStats();
      expect(stats.events_failed).toBe(1);
    });
  });

  describe('Statistics', () => {
    it('should track statistics correctly', () => {
      service.addEndpoint(mockEndpoint);
      const initialStats = service.getStats();
      
      expect(initialStats.events_sent).toBe(0);
      expect(initialStats.events_success).toBe(0);
      expect(initialStats.events_failed).toBe(0);
      expect(initialStats.endpoints_active).toBeGreaterThan(0);
    });

    it('should provide stats observable', (done) => {
      service.stats$.subscribe(stats => {
        expect(stats).toBeDefined();
        expect(typeof stats.events_sent).toBe('number');
        done();
      });
    });
  });

  describe('Configuration Persistence', () => {
    it('should save configuration to localStorage', () => {
      service.addEndpoint(mockEndpoint);
      service.setEnabled(false);
      
      service.saveConfiguration();
      
      const saved = localStorage.getItem('webhook_config');
      expect(saved).toBeTruthy();
      
      const config = JSON.parse(saved!);
      expect(config.enabled).toBe(false);
      expect(config.endpoints).toBeDefined();
    });

    it('should load configuration from localStorage', () => {
      const config = {
        enabled: false,
        endpoints: [mockEndpoint]
      };
      localStorage.setItem('webhook_config', JSON.stringify(config));
      
      // Create new service instance to test loading
      const newService = new WebHookService(TestBed.inject(HttpClientTestingModule) as any);
      
      expect(newService['isEnabled']).toBe(false);
      expect(newService.getEndpoints()).toContain(jasmine.objectContaining(mockEndpoint));
    });
  });

  describe('Utility Methods', () => {
    it('should generate unique event ids', () => {
      const id1 = service['generateEventId']();
      const id2 = service['generateEventId']();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^evt_\d+_[a-z0-9]+$/);
    });

    it('should generate signature for events', () => {
      const mockEvent: WebHookEvent = {
        id: 'test',
        event: 'test',
        timestamp: Date.now(),
        session_id: 'test',
        data: {},
        app_version: '1.0.0',
        platform: 'test'
      };
      
      const signature = service['generateSignature'](mockEvent);
      expect(signature).toBeTruthy();
      expect(signature.length).toBe(32);
    });

    it('should detect platform correctly', () => {
      const platform = service['getPlatform']();
      expect(['mobile', 'web', 'unknown']).toContain(platform);
    });
  });
}); 