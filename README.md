# 🎮 PokéApp - Pokédx Completa & Profissional

<div align="center">
  <img src="./docs/screenshots/app-icon.png" alt="PokéApp Logo" width="128" height="128">
  
  **Uma aplicação Pokédex moderna e completa construída com Ionic 8 + Angular 19**
  
  [![Ionic](https://img.shields.io/badge/Ionic-8.0-blue.svg)](https://ionicframework.com/)
  [![Angular](https://img.shields.io/badge/Angular-19.0-red.svg)](https://angular.io/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
  [![Tests](https://img.shields.io/badge/Tests-70+-green.svg)](#-testes-automatizados)
</div>

---

## 📖 Índice

- [📱 Sobre o Projeto](#-sobre-o-projeto)
- [🚀 Funcionalidades](#-funcionalidades)
- [📸 Screenshots](#-screenshots)
- [🎯 Funcionalidades Principais](#-funcionalidades-principais)
- [🔧 Funcionalidades Técnicas](#-funcionalidades-técnicas)
- [🏗️ Arquitetura](#️-arquitetura)
- [🚀 Como Executar](#-como-executar)
- [🧪 Testes](#-testes-automatizados)
- [📊 Performance](#-performance)
- [🤝 Contribuição](#-contribuição)

---

## 📱 Sobre o Projeto

**PokéApp** é uma **Pokédex profissional e completa** desenvolvida como demonstração de habilidades em **desenvolvimento mobile multiplataforma**. A aplicação consome a [PokéAPI](https://pokeapi.co/) e oferece uma experiência rica e interativa com o universo Pokémon.

### 🎯 **Objetivo**
Demonstrar competências em desenvolvimento de aplicações mobile modernas, incluindo:
- **Desenvolvimento Full-Stack Mobile** (Ionic + Angular)
- **Integração com APIs REST** (PokéAPI)
- **Testes Automatizados** (Unit Testing)
- **Monitoramento e Analytics** (Sistema de WebHooks)
- **Padrões de Desenvolvimento** (Clean Code, SOLID)

---

## 🚀 Funcionalidades

### ✅ **Funcionalidades Implementadas**

| **Categoria** | **Funcionalidade** | **Status** |
|---|---|---|
| 🏠 **Core** | Pokédex principal com lista completa | ✅ Completo |
| 🔍 **Busca** | Sistema de busca avançado (4 tipos) | ✅ Completo |
| ❤️ **Favoritos** | Sistema completo de favoritos | ✅ Completo |
| 🎨 **Tipos** | Enciclopédia de tipos Pokémon | ✅ Completo |
| 📊 **Stats** | Central de estatísticas analíticas | ✅ Completo |
| 🔍 **Detalhes** | Página completa com 15+ informações | ✅ Completo |
| 🧪 **Testes** | 70+ testes unitários automatizados | ✅ **NOVO** |
| 🔗 **WebHooks** | Sistema de monitoramento e analytics | ✅ **NOVO** |
| 📱 **Mobile** | Design responsivo otimizado | ✅ Completo |
| ⚡ **Performance** | Otimizações e lazy loading | ✅ Completo |

---

## 📸 Screenshots

> **📝 Nota**: Screenshots serão adicionados em breve

### 🏠 **Tela Principal**
<!-- Adicionar screenshot da tela principal aqui -->
*Screenshot da Pokédx principal*

### 🔍 **Sistema de Busca**
<!-- Adicionar screenshot da busca aqui -->
*Screenshot do sistema de busca avançado*

### ❤️ **Favoritos**
<!-- Adicionar screenshot dos favoritos aqui -->
*Screenshot da página de favoritos*

### 🎨 **Tipos Pokémon**
<!-- Adicionar screenshot dos tipos aqui -->
*Screenshot da enciclopédia de tipos*

### 📊 **Estatísticas**
<!-- Adicionar screenshot das estatísticas aqui -->
*Screenshot da central de estatísticas*

### 🔍 **Detalhes do Pokémon**
<!-- Adicionar screenshot dos detalhes aqui -->
*Screenshot da página de detalhes completa*

### 🧪 **Testes Automatizados**
<!-- Adicionar screenshot dos testes aqui -->
*Screenshot dos testes unitários rodando*

### 🔗 **WebHook Admin**
<!-- Adicionar screenshot do webhook admin aqui -->
*Screenshot do painel de administração de webhooks*

---

## 🎯 Funcionalidades Principais

### 🏠 **Pokédex Principal**
- **Lista completa** com 1010+ Pokémons
- **Paginação infinita** otimizada para performance
- **Cards responsivos** com gradientes baseados nos tipos
- **Sistema de favoritos** integrado com feedback visual
- **Pull-to-refresh** para atualização em tempo real
- **Loading states** elegantes e informativos

### 🔍 **Sistema de Busca Avançado**
- **4 modalidades de busca**:
  - 🔤 **Por Nome**: Busca direta e rápida
  - 🎨 **Por Tipo**: Filtro por elementos (Fire, Water, etc.)
  - ⚡ **Por Habilidade**: Busca por skills específicas
  - 🔬 **Busca Avançada**: Múltiplos filtros combinados
- **Filtros inteligentes**: Geração, altura, peso, status lendário
- **Histórico de buscas** com persistência local

### ❤️ **Sistema de Favoritos Completo**
- **Persistência local** com LocalStorage
- **Múltiplas visualizações**: Grid e lista detalhada
- **Sistema de ordenação**: Nome, número, tipo, data
- **Funcionalidades avançadas**:
  - Busca dentro dos favoritos
  - Exportação de lista completa
  - Estatísticas detalhadas
  - Limpeza em massa

### 🎨 **Enciclopédia de Tipos**
- **18 tipos Pokémon** com informações completas
- **Matriz de efetividade** interativa
- **Design temático** com cores e gradientes
- **Informações detalhadas** sobre forças e fraquezas

### 📊 **Central de Estatísticas**
- **Visão geral** com métricas principais
- **Distribuição por tipos** com gráficos visuais
- **Análise por gerações** (I-IX)
- **Recordes e rankings** dinâmicos

### 🔍 **Detalhes Completos**
- **15+ informações** por Pokémon organizadas em tabs:
  - 📝 **Visão Geral**: Dados básicos e características
  - 📊 **Estatísticas**: Stats base com visualizações
  - 🖼️ **Galeria**: Múltiplas variações visuais
- **Navegação fluida** com transições suaves

---

## 🔧 Funcionalidades Técnicas

### 🧪 **Testes Automatizados** *(NOVO)*
- **70+ testes unitários** com Jasmine + Karma
- **Cobertura completa** de serviços e componentes
- **Testes de integração** com HTTP mocking
- **Execução automatizada** no pipeline de desenvolvimento

```bash
# Executar todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

### 🔗 **Sistema de WebHooks** *(NOVO)*
- **Monitoramento em tempo real** de ações do usuário
- **7 tipos de eventos** rastreados:
  - `pokemon_viewed` - Visualizações de Pokémon
  - `pokemon_favorited` - Ações de favoritos
  - `pokemon_searched` - Buscas realizadas
  - `page_visited` - Navegação entre páginas
  - `user_interaction` - Interações gerais
  - `app_error` - Erros da aplicação
  - `user_identified` - Identificação de usuários

#### **Painel de Administração WebHooks**
- **Interface completa** para gerenciamento
- **Configuração de endpoints** personalizados
- **Monitoramento em tempo real** de eventos
- **Sistema de retry** com backoff exponencial
- **Estatísticas detalhadas** de envio
- **Headers customizados** por endpoint

```typescript
// Exemplo de configuração de webhook
{
  name: "Analytics Tracker",
  url: "https://your-analytics.com/webhook",
  events: ["pokemon_viewed", "pokemon_favorited"],
  headers: {
    "Authorization": "Bearer your-token",
    "Content-Type": "application/json"
  },
  retry_attempts: 3,
  timeout_ms: 5000
}
```

### ⚡ **Performance & Otimização**
- **Bundle splitting** por rotas (código sob demanda)
- **Lazy loading** de imagens com IntersectionObserver
- **Virtual scrolling** para listas grandes
- **HTTP caching** inteligente
- **OnPush Change Detection** para Angular
- **TrackBy functions** otimizadas

---

## 🏗️ Arquitetura

### **Stack Tecnológico**
```typescript
{
  "frontend": {
    "framework": "Ionic 8 + Angular 19",
    "language": "TypeScript 5.0",
    "styling": "SCSS + CSS Variables",
    "state": "RxJS + Services",
    "routing": "Angular Router + Lazy Loading"
  },
  "testing": {
    "unit": "Jasmine + Karma",
    "mocking": "HttpClientTestingModule",
    "coverage": "Istanbul"
  },
  "monitoring": {
    "analytics": "WebHooks personalizados",
    "errors": "Sistema de tracking integrado",
    "performance": "Métricas automáticas"
  },
  "build": {
    "bundler": "Angular CLI + Webpack",
    "deployment": "Capacitor + Cordova"
  }
}
```

### **Padrões Arquiteturais**
- **🎯 Standalone Components** (Angular 17+)
- **🔄 Observer Pattern** com RxJS
- **📦 Service Layer** para lógica de negócio  
- **🛡️ Dependency Injection** nativo do Angular
- **🧩 Interface Segregation** com TypeScript
- **🔒 Environment Configuration** para diferentes ambientes

### **Estrutura de Pastas**
```
src/app/
├── 📁 components/          # Componentes reutilizáveis
├── 📁 pages/              # Páginas da aplicação
│   ├── 🏠 home/           # Pokédex principal
│   ├── 🔍 search/         # Sistema de busca
│   ├── ❤️ favorites/      # Favoritos
│   ├── 🎨 types/          # Tipos Pokémon
│   ├── 📊 stats/          # Estatísticas
│   ├── 🔍 pokemon-details/ # Detalhes
│   └── 🔗 webhook-admin/   # Admin WebHooks (NOVO)
├── 📁 services/           # Serviços e lógica
│   ├── pokemon.service.ts  # API e dados
│   └── webhook.service.ts  # WebHooks (NOVO)
├── 📁 models/             # Interfaces TypeScript
├── 📁 environments/       # Configurações de ambiente
└── 📁 assets/            # Recursos estáticos
```

---

## 🚀 Como Executar

### **📋 Pré-requisitos**
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **Ionic CLI**: `npm install -g @ionic/cli`
- **Git** para clonagem

### **⚡ Instalação Rápida**
```bash
# 1. Clonar o repositório
git clone <repository-url>
cd pokeapp

# 2. Instalar dependências
npm install

# 3. Executar em desenvolvimento
ionic serve

# 4. Acessar no navegador
# http://localhost:8100
```

### **📱 Build para Produção**
```bash
# Build otimizado
ionic build --prod

# Deploy em plataforma mobile
ionic capacitor add android
ionic capacitor run android

# Gerar APK
ionic capacitor build android
```

### **🔧 Scripts Disponíveis**
```bash
npm start          # Servidor de desenvolvimento
npm test           # Executar testes unitários
npm run build      # Build de produção
npm run lint       # Verificar código
npm run test:coverage  # Testes com coverage
```

---

## 🧪 Testes Automatizados

### **📊 Cobertura de Testes**
- **✅ 70+ testes unitários** implementados
- **🎯 Cobertura principal**: Serviços, Componentes, Pipes
- **🔧 Framework**: Jasmine + Karma
- **📈 Execução**: Automatizada no desenvolvimento

### **🧪 Tipos de Teste**

#### **🔧 Testes de Serviços**
```typescript
// PokemonService - 25+ testes
✅ Busca de Pokémons (API)
✅ Sistema de favoritos
✅ Cache e performance  
✅ Error handling
✅ Utilitários (formatação, cores)

// WebHookService - 30+ testes  
✅ Configuração de endpoints
✅ Envio de eventos
✅ Sistema de retry
✅ Estatísticas
✅ Persistência de configuração
```

#### **🎨 Testes de Componentes**
```typescript
// HomePage - 20+ testes
✅ Carregamento de dados
✅ Sistema de busca
✅ Infinite scroll
✅ Interações do usuário
✅ Navegação

// PokemonDetailsPage - 25+ testes
✅ Carregamento de detalhes
✅ Cálculos derivados
✅ Sistema de favoritos
✅ Navegação entre seções
```

### **▶️ Executar Testes**
```bash
# Todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Com coverage detalhado
npm run test:coverage

# Apenas um arquivo
npm test -- --include="**/pokemon.service.spec.ts"
```

---

## 📊 Performance

### **⚡ Métricas de Performance**
| **Métrica** | **Valor** | **Status** |
|---|---|---|
| **Bundle Size** | ~139KB (inicial) | ✅ Otimizado |
| **First Contentful Paint** | <2s | ✅ Excelente |
| **Time to Interactive** | <3s | ✅ Rápido |
| **Lighthouse Score** | 90+ | ✅ Profissional |

### **🔧 Otimizações Implementadas**
- **📦 Code Splitting**: Carregamento sob demanda por rota
- **🖼️ Image Lazy Loading**: Carregamento inteligente de imagens
- **💾 HTTP Caching**: Cache automático de requisições
- **🔄 Virtual Scrolling**: Listas virtualizadas para performance
- **⚡ OnPush Strategy**: Detecção de mudanças otimizada
- **🎯 TrackBy Functions**: Renderização eficiente de listas

### **📈 Melhorias Futuras**
- **🏗️ Service Worker**: Cache offline e PWA
- **📊 Performance Monitoring**: Métricas em tempo real
- **🔧 Bundle Analyzer**: Otimização avançada de bundle
- **📱 Capacitor Plugins**: Funcionalidades nativas

---

## 🌐 API e Integrações

### **🔗 PokéAPI Integration**
```typescript
// Endpoints utilizados
const API_BASE = "https://pokeapi.co/api/v2"

📡 /pokemon/{id}           # Dados do Pokémon
📡 /pokemon-species/{id}   # Informações da espécie  
📡 /type/{id}              # Dados dos tipos
📡 /ability/{id}           # Informações de habilidades
📡 /pokemon?limit=20       # Lista paginada
```

### **🔗 Sistema de WebHooks**
```typescript
// Eventos rastreados automaticamente
{
  pokemon_viewed: "Visualização de Pokémon",
  pokemon_favorited: "Ação de favoritar/desfavoritar", 
  pokemon_searched: "Busca realizada",
  page_visited: "Navegação entre páginas",
  user_interaction: "Interações gerais",
  app_error: "Erros da aplicação",
  user_identified: "Identificação de usuário"
}
```

---

## 📄 Licença

Este projeto foi desenvolvido como **demonstração técnica** para uma vaga de emprego pela BSN Tecnologia e está disponível sob a licença MIT.

---

## 👨‍💻 Desenvolvedor

<div align="center">
  
**🎯 Projeto desenvolvido por Leonardo Henrique**

*Demonstração de habilidades em desenvolvimento mobile moderno*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue)](https://www.linkedin.com/in/leonardohenriquedejesussilva/)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-black)](https://github.com/teecoleonard)
[![Portfolio](https://img.shields.io/badge/Portfolio-Website-green)](https://teecoleonard.github.io/react-portfolio/)

---

</div>