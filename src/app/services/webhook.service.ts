import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interfaces para o sistema de WebHooks
export interface WebHookEvent {
  id: string;
  event: string;
  timestamp: number;
  user_id?: string;
  session_id: string;
  data: any;
  app_version: string;
  platform: string;
}

export interface WebHookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  enabled: boolean;
  headers?: { [key: string]: string };
  retry_attempts: number;
  timeout_ms: number;
}

export interface WebHookResponse {
  success: boolean;
  status: number;
  endpoint_id: string;
  event_id: string;
  timestamp: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebHookService implements OnDestroy {
  private events$ = new Subject<WebHookEvent>();
  private responses$ = new Subject<WebHookResponse>();
  private endpoints: WebHookEndpoint[] = [];
  private isEnabled = true;
  private sessionId: string;
  private userId?: string;

  // Queue para eventos que falharam na primeira tentativa
  private eventQueue: { event: WebHookEvent; attempt: number }[] = [];
  private queueProcessor?: any;

  // Estatísticas
  private stats = {
    events_sent: 0,
    events_success: 0,
    events_failed: 0,
    endpoints_active: 0
  };

  private statsSubject = new BehaviorSubject(this.stats);
  public stats$ = this.statsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.sessionId = this.generateSessionId();
    this.loadConfiguration();
    this.startEventProcessor();
    this.startQueueProcessor();
    
    console.log('🔗 WebHook Service iniciado com Session ID:', this.sessionId);
  }

  /**
   * Configurar endpoints de webhook
   */
  addEndpoint(endpoint: WebHookEndpoint): void {
    this.endpoints.push(endpoint);
    this.updateStats();
    console.log('🔗 Endpoint adicionado:', endpoint.name);
  }

  removeEndpoint(endpointId: string): void {
    this.endpoints = this.endpoints.filter(ep => ep.id !== endpointId);
    this.updateStats();
    console.log('🔗 Endpoint removido:', endpointId);
  }

  getEndpoints(): WebHookEndpoint[] {
    return [...this.endpoints];
  }

  /**
   * Configurar usuário para tracking
   */
  setUserId(userId: string): void {
    this.userId = userId;
    this.sendEvent('user_identified', { user_id: userId });
  }

  /**
   * Ativar/desativar o serviço
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log('🔗 WebHook Service', enabled ? 'ativado' : 'desativado');
  }

  /**
   * Enviar evento para webhooks
   */
  sendEvent(eventName: string, data: any = {}): void {
    if (!this.isEnabled || !environment.enableWebhooks) {
      console.log('🔗 WebHooks desabilitados (desenvolvimento)', { eventName, data });
      return;
    }

    const event: WebHookEvent = {
      id: this.generateEventId(),
      event: eventName,
      timestamp: Date.now(),
      user_id: this.userId,
      session_id: this.sessionId,
      data: data,
      app_version: '1.0.0', // Poderia vir do package.json
      platform: this.getPlatform()
    };

    this.events$.next(event);
    this.processEvent(event);
  }

  /**
   * Eventos específicos para Pokédex
   */
  trackPokemonViewed(pokemonId: number, pokemonName: string): void {
    this.sendEvent('pokemon_viewed', {
      pokemon_id: pokemonId,
      pokemon_name: pokemonName,
      view_timestamp: Date.now()
    });
  }

  trackPokemonFavorited(pokemonId: number, pokemonName: string, action: 'added' | 'removed'): void {
    this.sendEvent('pokemon_favorited', {
      pokemon_id: pokemonId,
      pokemon_name: pokemonName,
      action: action,
      favorite_timestamp: Date.now()
    });
  }

  trackSearchPerformed(searchTerm: string, resultsCount: number, searchType: string = 'name'): void {
    this.sendEvent('pokemon_searched', {
      search_term: searchTerm,
      search_type: searchType,
      results_count: resultsCount,
      search_timestamp: Date.now()
    });
  }

  trackPageVisited(pageName: string, additionalData: any = {}): void {
    this.sendEvent('page_visited', {
      page_name: pageName,
      visit_timestamp: Date.now(),
      ...additionalData
    });
  }

  trackUserInteraction(interactionType: string, data: any = {}): void {
    this.sendEvent('user_interaction', {
      interaction_type: interactionType,
      interaction_timestamp: Date.now(),
      ...data
    });
  }

  trackError(errorType: string, errorMessage: string, additionalData: any = {}): void {
    this.sendEvent('app_error', {
      error_type: errorType,
      error_message: errorMessage,
      error_timestamp: Date.now(),
      ...additionalData
    });
  }

  /**
   * Observables para monitoramento
   */
  getEventStream(): Observable<WebHookEvent> {
    return this.events$.asObservable();
  }

  getResponseStream(): Observable<WebHookResponse> {
    return this.responses$.asObservable();
  }

  getStats(): any {
    return { ...this.stats };
  }

  /**
   * Processar evento enviando para todos os endpoints compatíveis
   */
  private processEvent(event: WebHookEvent): void {
    const compatibleEndpoints = this.endpoints.filter(
      endpoint => endpoint.enabled && 
      (endpoint.events.includes(event.event) || endpoint.events.includes('*'))
    );

    if (compatibleEndpoints.length === 0) {
      console.log('🔗 Nenhum endpoint compatível para evento:', event.event);
      return;
    }

    compatibleEndpoints.forEach(endpoint => {
      this.sendToEndpoint(event, endpoint, 1);
    });

    this.stats.events_sent++;
    this.updateStats();
  }

  /**
   * Enviar evento para endpoint específico
   */
  private sendToEndpoint(event: WebHookEvent, endpoint: WebHookEndpoint, attempt: number): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Webhook-Event': event.event,
      'X-Webhook-Signature': this.generateSignature(event),
      'X-Session-ID': this.sessionId,
      ...endpoint.headers
    });

    console.log(`🔗 Enviando evento ${event.event} para ${endpoint.name} (tentativa ${attempt})`);

    this.http.post(endpoint.url, event, { 
      headers,
      observe: 'response',
      responseType: 'text'
    })
    .pipe(
      timeout(endpoint.timeout_ms),
      retry(0),
      catchError(error => {
        console.error(`🔗 Erro ao enviar para ${endpoint.name}:`, error);
        return of({ status: error.status || 500, statusText: error.message });
      })
    )
    .subscribe({
      next: (response: any) => {
        const webhookResponse: WebHookResponse = {
          success: response.status >= 200 && response.status < 300,
          status: response.status,
          endpoint_id: endpoint.id,
          event_id: event.id,
          timestamp: Date.now()
        };

        if (webhookResponse.success) {
          this.stats.events_success++;
          console.log(`✅ Evento enviado com sucesso para ${endpoint.name}`);
        } else {
          this.stats.events_failed++;
          webhookResponse.error = response.statusText;
          
          // Retry se não excedeu o limite
          if (attempt < endpoint.retry_attempts) {
            console.log(`🔄 Reagendando evento para retry (${attempt + 1}/${endpoint.retry_attempts})`);
            this.queueEventForRetry(event, endpoint, attempt + 1);
          } else {
            console.error(`❌ Falha definitiva ao enviar para ${endpoint.name} após ${attempt} tentativas`);
          }
        }

        this.responses$.next(webhookResponse);
        this.updateStats();
      },
      error: (error) => {
        console.error(`🔗 Erro de rede para ${endpoint.name}:`, error);
        this.stats.events_failed++;
        
        if (attempt < endpoint.retry_attempts) {
          this.queueEventForRetry(event, endpoint, attempt + 1);
        }
        
        this.updateStats();
      }
    });
  }

  /**
   * Adicionar evento à fila de retry
   */
  private queueEventForRetry(event: WebHookEvent, endpoint: WebHookEndpoint, nextAttempt: number): void {
    const delay = Math.pow(2, nextAttempt) * 1000;
    setTimeout(() => {
      this.sendToEndpoint(event, endpoint, nextAttempt);
    }, delay);
  }

  /**
   * Configuração inicial dos endpoints
   */
  private loadConfiguration(): void {
    const defaultEndpoints: WebHookEndpoint[] = [
      {
        id: 'analytics_endpoint',
        name: 'Analytics Tracker',
        url: 'https://webhook.site/unique-id-analytics',
        events: ['pokemon_viewed', 'pokemon_favorited', 'pokemon_searched', 'page_visited'],
        enabled: true,
        retry_attempts: 3,
        timeout_ms: 5000,
        headers: {
          'Authorization': 'Bearer your-analytics-token',
          'X-Source': 'pokeapp'
        }
      },
      {
        id: 'error_tracking',
        name: 'Error Tracker',
        url: 'https://webhook.site/unique-id-errors',
        events: ['app_error'],
        enabled: true,
        retry_attempts: 5,
        timeout_ms: 3000,
        headers: {
          'Authorization': 'Bearer your-error-token'
        }
      },
      {
        id: 'user_behavior',
        name: 'User Behavior Analytics',
        url: 'https://webhook.site/unique-id-behavior',
        events: ['*'],
        enabled: false,
        retry_attempts: 2,
        timeout_ms: 4000
      }
    ];

    const savedConfig = localStorage.getItem('webhook_config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        this.endpoints = config.endpoints || defaultEndpoints;
        this.isEnabled = config.enabled !== false;
      } catch (error) {
        console.warn('🔗 Erro ao carregar configuração salva, usando padrão');
        this.endpoints = defaultEndpoints;
      }
    } else {
      this.endpoints = defaultEndpoints;
    }

    this.updateStats();
  }

  /**
   * Salvar configuração
   */
  saveConfiguration(): void {
    const config = {
      endpoints: this.endpoints,
      enabled: this.isEnabled
    };
    localStorage.setItem('webhook_config', JSON.stringify(config));
  }

  /**
   * Processador de eventos
   */
  private startEventProcessor(): void {
    this.events$.subscribe(event => {
      console.log('🔗 Novo evento:', event.event, event.data);
    });
  }

  /**
   * Processador da fila de retry
   */
  private startQueueProcessor(): void {
    this.queueProcessor = setInterval(() => {
      if (this.eventQueue.length > 0) {
        console.log(`🔗 Processando fila de retry: ${this.eventQueue.length} eventos`);
      }
    }, 30000);
  }

  /**
   * Utilitários
   */
  private generateSessionId(): string {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateEventId(): string {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateSignature(event: WebHookEvent): string {
    return btoa(JSON.stringify(event)).substr(0, 32);
  }

  private getPlatform(): string {
    if (typeof window !== 'undefined') {
      return navigator.userAgent.includes('Mobile') ? 'mobile' : 'web';
    }
    return 'unknown';
  }

  private updateStats(): void {
    this.stats.endpoints_active = this.endpoints.filter(ep => ep.enabled).length;
    this.statsSubject.next({ ...this.stats });
  }

  /**
   * Cleanup ao destruir o serviço
   */
  ngOnDestroy(): void {
    if (this.queueProcessor) {
      clearInterval(this.queueProcessor);
    }
    this.saveConfiguration();
  }
} 