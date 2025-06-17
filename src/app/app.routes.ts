import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'search',
        loadComponent: () => import('./pages/search/search.page').then(m => m.SearchPage)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./pages/favorites/favorites.page').then(m => m.FavoritesPage)
      },
      {
        path: 'types',
        loadComponent: () => import('./pages/types/types.page').then(m => m.TypesPage)
      },
      {
        path: 'stats',
        loadComponent: () => import('./pages/stats/stats.page').then(m => m.StatsPage)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'pokemon/:id',
    loadComponent: () => import('./pages/pokemon-details/pokemon-details.page').then(m => m.PokemonDetailsPage)
  },
  {
    path: 'webhook-admin',
    loadComponent: () => import('./pages/webhook-admin/webhook-admin.page').then(m => m.WebHookAdminPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then(m => m.AboutPage)
  }
];
