import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class SettingsPage implements OnInit {
  
  // Configurações da aplicação
  settings = {
    theme: 'dark',
    notifications: true,
    soundEffects: false,
    autoCache: true,
    maxCacheSize: 100,
    showAnimations: true,
    language: 'pt-br',
    autoUpdate: true,
    debugMode: false
  };

  // Opções disponíveis
  themeOptions = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Escuro' },
    { value: 'auto', label: 'Automático' }
  ];

  languageOptions = [
    { value: 'pt-br', label: 'Português (Brasil)' },
    { value: 'en-us', label: 'English (US)' },
    { value: 'es-es', label: 'Español' }
  ];

  cacheSizeOptions = [
    { value: 50, label: '50 MB' },
    { value: 100, label: '100 MB' },
    { value: 200, label: '200 MB' },
    { value: 500, label: '500 MB' }
  ];

  // Estatísticas do cache
  cacheStats = {
    currentSize: 45.2,
    totalItems: 1250,
    lastCleared: new Date(Date.now() - 86400000 * 3) // 3 dias atrás
  };

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadSettings();
    this.showDevelopmentNotice();
  }

  loadSettings() {
    // Carregar configurações do localStorage
    const savedSettings = localStorage.getItem('pokemonapp-settings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }

  saveSettings() {
    // Salvar configurações no localStorage
    localStorage.setItem('pokemonapp-settings', JSON.stringify(this.settings));
    this.showToast('Configurações salvas com sucesso!');
  }

  onThemeChange() {
    this.saveSettings();
    // Aplicar tema imediatamente (implementação futura)
    console.log('Tema alterado para:', this.settings.theme);
  }

  onLanguageChange() {
    this.saveSettings();
    this.showToast('Idioma alterado. Reinicie a aplicação para aplicar.');
  }

  clearCache() {
    // Limpar cache da aplicação
    localStorage.removeItem('pokemon-cache');
    localStorage.removeItem('favorites-cache');
    this.cacheStats.currentSize = 0;
    this.cacheStats.totalItems = 0;
    this.cacheStats.lastCleared = new Date();
    this.showToast('Cache limpo com sucesso!');
  }

  resetSettings() {
    // Resetar todas as configurações para padrão
    this.settings = {
      theme: 'dark',
      notifications: true,
      soundEffects: false,
      autoCache: true,
      maxCacheSize: 100,
      showAnimations: true,
      language: 'pt-br',
      autoUpdate: true,
      debugMode: false
    };
    this.saveSettings();
    this.showToast('Configurações resetadas para o padrão!');
  }

  exportSettings() {
    // Exportar configurações como JSON
    const config = {
      settings: this.settings,
      exported_at: new Date().toISOString(),
      app_version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pokemon-app-settings-${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'primary'
    });
    toast.present();
  }

  private async showDevelopmentNotice() {
    const toast = await this.toastController.create({
      message: 'Apenas ilustrativo, funções em desenvolvimento',
      duration: 4000,
      position: 'middle',
      color: 'warning',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  formatBytes(bytes: number): string {
    return `${bytes.toFixed(1)} MB`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }
} 