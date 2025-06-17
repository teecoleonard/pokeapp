import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AboutPage implements OnInit {

  // Informações da aplicação
  appInfo = {
    name: 'PokéApp',
    version: '1.0.0',
    buildNumber: '2024.06.001',
    releaseDate: new Date('2025-06-17'),
    description: 'Uma Pokédex completa e moderna construída com Ionic 8 + Angular 19',
    developer: 'Leonardo Henrique',
    company: 'BSN Tecnologia',
    website: 'https://teecoleonard.github.io/react-portfolio/',
    email: 'leonardo4q@gmail.com'
  };

  // Tecnologias utilizadas
  technologies = [
    { name: 'Ionic', version: '8.0', icon: 'logo-ionic', color: 'primary' },
    { name: 'Angular', version: '19.0', icon: 'logo-angular', color: 'danger' },
    { name: 'TypeScript', version: '5.0', icon: 'code-slash', color: 'warning' },
    { name: 'Capacitor', version: '6.0', icon: 'phone-portrait', color: 'success' },
    { name: 'SCSS', version: '1.77', icon: 'color-palette', color: 'secondary' },
    { name: 'RxJS', version: '7.8', icon: 'sync', color: 'tertiary' }
  ];

  // Funcionalidades principais
  features = [
    {
      title: 'Pokédex Completa',
      description: 'Acesso a todos os 1010+ Pokémon com informações detalhadas',
      icon: 'library',
      color: 'primary'
    },
    {
      title: 'Sistema de Busca',
      description: 'Busca avançada por nome, tipo, habilidade e filtros personalizados',
      icon: 'search',
      color: 'secondary'
    },
    {
      title: 'Favoritos',
      description: 'Marque seus Pokémon favoritos e acesse rapidamente',
      icon: 'heart',
      color: 'danger'
    },
    {
      title: 'Tipos Pokémon',
      description: 'Explore todos os 18 tipos com efetividades e características',
      icon: 'grid',
      color: 'success'
    },
    {
      title: 'Estatísticas',
      description: 'Análises detalhadas com gráficos e dados organizados',
      icon: 'stats-chart',
      color: 'warning'
    },
    {
      title: 'WebHooks',
      description: 'Sistema de monitoramento e analytics em tempo real',
      icon: 'server',
      color: 'tertiary'
    }
  ];

  // Estatísticas da aplicação
  appStats = {
    totalPokemon: 1010,
    totalTypes: 18,
    totalGenerations: 9,
    totalAbilities: 350,
    cacheSize: '45.2 MB',
    lastUpdate: new Date()
  };

  // Links úteis
  links = [
    { 
      title: 'Código Fonte', 
      url: 'https://github.com/teecoleonard/pokemon-app', 
      icon: 'logo-github',
      color: 'dark'
    },
    { 
      title: 'Portfolio', 
      url: 'https://teecoleonard.github.io/react-portfolio/', 
      icon: 'person-circle',
      color: 'primary'
    },
    { 
      title: 'LinkedIn', 
      url: 'https://www.linkedin.com/in/leonardohenriquedejesussilva/', 
      icon: 'logo-linkedin',
      color: 'primary'
    },
    { 
      title: 'PokéAPI', 
      url: 'https://pokeapi.co/', 
      icon: 'planet',
      color: 'success'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('About page loaded');
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  shareApp() {
    if (navigator.share) {
      navigator.share({
        title: 'PokéApp - Pokédex Completa',
        text: 'Confira esta incrível Pokédex para explorar o mundo Pokémon!',
        url: window.location.origin
      });
    } else {
      // Fallback para navegadores que não suportam Web Share API
      this.copyToClipboard(window.location.origin);
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Link copiado para a área de transferência');
    });
  }

  sendFeedback() {
    const subject = encodeURIComponent('Feedback - PokéApp');
    const body = encodeURIComponent(`
Olá!

Gostaria de enviar um feedback sobre a PokéApp:

Versão: ${this.appInfo.version}
Build: ${this.appInfo.buildNumber}

Feedback:
[Escreva seu feedback aqui]

Obrigado!
    `);
    
    const mailtoUrl = `mailto:${this.appInfo.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  calculateAppAge(): string {
    const now = new Date();
    const release = this.appInfo.releaseDate;
    const diffTime = Math.abs(now.getTime() - release.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} dias`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
  }
} 