import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { 
  heart, 
  search, 
  home, 
  menu,
  arrowBack,
  warning,
  refresh,
  colorPalette,
  statsChart
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Registrar apenas os ícones essenciais
addIcons({
  heart,
  search,
  home,
  menu,
  'arrow-back': arrowBack,
  warning,
  refresh,
  'color-palette': colorPalette,
  'stats-chart': statsChart
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});
