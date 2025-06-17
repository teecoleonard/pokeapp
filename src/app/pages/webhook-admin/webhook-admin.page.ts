import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebHookService, WebHookEndpoint, WebHookEvent, WebHookResponse } from '../../services/webhook.service';

@Component({
  selector: 'app-webhook-admin',
  templateUrl: './webhook-admin.page.html',
  styleUrls: ['./webhook-admin.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class WebHookAdminPage implements OnInit, OnDestroy {
  endpoints: WebHookEndpoint[] = [];
  stats: any = {};
  recentEvents: WebHookEvent[] = [];
  recentResponses: WebHookResponse[] = [];
  isWebHookEnabled = true;
  
  // Form para novo endpoint
  newEndpoint: Partial<WebHookEndpoint> = {
    name: '',
    url: '',
    events: [],
    enabled: true,
    retry_attempts: 3,
    timeout_ms: 5000,
    headers: {}
  };

  availableEvents = [
    'pokemon_viewed',
    'pokemon_favorited', 
    'pokemon_searched',
    'page_visited',
    'user_interaction',
    'app_error',
    'user_identified',
    '*' // Wildcard
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private webhookService: WebHookService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
    this.subscribeToStreams();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData() {
    this.endpoints = this.webhookService.getEndpoints();
    this.stats = this.webhookService.getStats();
  }

  private subscribeToStreams() {
    // Monitorar estatísticas
    this.webhookService.stats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.stats = stats;
      });

    // Monitorar eventos
    this.webhookService.getEventStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.recentEvents.unshift(event);
        if (this.recentEvents.length > 10) {
          this.recentEvents = this.recentEvents.slice(0, 10);
        }
      });

    // Monitorar respostas
    this.webhookService.getResponseStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.recentResponses.unshift(response);
        if (this.recentResponses.length > 10) {
          this.recentResponses = this.recentResponses.slice(0, 10);
        }
      });
  }

  addEndpoint() {
    if (!this.newEndpoint.name || !this.newEndpoint.url) {
      return;
    }

    const endpoint: WebHookEndpoint = {
      id: 'custom_' + Date.now(),
      name: this.newEndpoint.name,
      url: this.newEndpoint.url,
      events: this.newEndpoint.events || [],
      enabled: this.newEndpoint.enabled || true,
      retry_attempts: this.newEndpoint.retry_attempts || 3,
      timeout_ms: this.newEndpoint.timeout_ms || 5000,
      headers: this.newEndpoint.headers || {}
    };

    this.webhookService.addEndpoint(endpoint);
    this.loadData();
    this.resetForm();
  }

  removeEndpoint(endpointId: string) {
    this.webhookService.removeEndpoint(endpointId);
    this.loadData();
  }

  toggleEndpoint(endpoint: WebHookEndpoint) {
    endpoint.enabled = !endpoint.enabled;
    this.webhookService.saveConfiguration();
    this.loadData();
  }

  toggleWebHookService() {
    this.isWebHookEnabled = !this.isWebHookEnabled;
    this.webhookService.setEnabled(this.isWebHookEnabled);
  }

  testEndpoint(endpoint: WebHookEndpoint) {
    this.webhookService.sendEvent('test_event', {
      message: 'Este é um evento de teste',
      endpoint_name: endpoint.name,
      test_timestamp: Date.now()
    });
  }

  addEventToNewEndpoint(event: string) {
    if (!this.newEndpoint.events) {
      this.newEndpoint.events = [];
    }
    
    if (!this.newEndpoint.events.includes(event)) {
      this.newEndpoint.events.push(event);
    }
  }

  removeEventFromNewEndpoint(event: string) {
    if (this.newEndpoint.events) {
      this.newEndpoint.events = this.newEndpoint.events.filter(e => e !== event);
    }
  }

  isEventSelected(event: string): boolean {
    return this.newEndpoint.events?.includes(event) || false;
  }

  addHeader() {
    if (!this.newEndpoint.headers) {
      this.newEndpoint.headers = {};
    }
    
    this.newEndpoint.headers[''] = '';
  }

  removeHeader(key: string) {
    if (this.newEndpoint.headers) {
      delete this.newEndpoint.headers[key];
    }
  }

  trackHeaderByKey(index: number, item: any): string {
    return item.key;
  }

  getHeaderKeys(): string[] {
    return Object.keys(this.newEndpoint.headers || {});
  }

  updateHeaderKey(oldKey: string, newKey: string) {
    if (this.newEndpoint.headers && oldKey !== newKey) {
      const value = this.newEndpoint.headers[oldKey];
      delete this.newEndpoint.headers[oldKey];
      this.newEndpoint.headers[newKey] = value;
    }
  }

  updateHeaderValue(key: string, value: string) {
    if (this.newEndpoint.headers) {
      this.newEndpoint.headers[key] = value;
    }
  }

  private resetForm() {
    this.newEndpoint = {
      name: '',
      url: '',
      events: [],
      enabled: true,
      retry_attempts: 3,
      timeout_ms: 5000,
      headers: {}
    };
  }

  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString('pt-BR');
  }

  getStatusIcon(success: boolean): string {
    return success ? 'checkmark-circle' : 'alert-circle';
  }

  getStatusColor(success: boolean): string {
    return success ? 'success' : 'danger';
  }

  // Métodos para demonstração
  triggerTestEvents() {
    // Simular alguns eventos para demonstração
    this.webhookService.trackPageVisited('webhook-admin', { 
      demo: true,
      user_action: 'manual_test' 
    });

    setTimeout(() => {
      this.webhookService.trackPokemonViewed(25, 'pikachu');
    }, 1000);

    setTimeout(() => {
      this.webhookService.trackPokemonFavorited(1, 'bulbasaur', 'added');
    }, 2000);

    setTimeout(() => {
      this.webhookService.trackSearchPerformed('charizard', 1, 'name');
    }, 3000);

    setTimeout(() => {
      this.webhookService.trackUserInteraction('button_click', { 
        button: 'test_events',
        page: 'webhook-admin' 
      });
    }, 4000);
  }

  exportConfiguration() {
    const config = {
      endpoints: this.endpoints,
      enabled: this.isWebHookEnabled,
      exported_at: new Date().toISOString(),
      stats: this.stats
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webhook-config-${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  clearStats() {
    // Resetar estatísticas (isso seria implementado no service)
    this.recentEvents = [];
    this.recentResponses = [];
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }
} 