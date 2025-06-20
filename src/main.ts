import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { 
  home,
  search,
  heart,
  settings,
  statsChart,
  colorPalette,
  informationCircle,
  star,
  starOutline,
  arrowBack,
  refresh,
  warning,
  checkmark,
  add,
  remove,
  chevronDown,
  chevronUp,
  list,
  grid,
  filter,
  download,
  trash,
  shuffle,
  share,
  bookmarks,
  bookmark,
  bookmarkOutline,
  eye,
  eyeOff,
  camera,
  image,
  images,
  play,
  pause,
  stop,
  chatbubbles,
  notifications,
  moon,
  sunny,
  contrast,
  language,
  helpCircle,
  bug,
  construct,
  code,
  terminal,
  rocket,
  trophy,
  medal,
  flash,
  thunderstorm,
  flame,
  water,
  leaf,
  flower,
  snow,
  earth,
  diamond,
  skull,
  airplane,
  shield,
  fishOutline,
  bugOutline,
  flameOutline,
  leafOutline,
  waterOutline,
  thunderstormOutline,
  earthOutline,
  eyeOutline,
  skullOutline,
  diamondOutline,
  airplaneOutline,
  flowerOutline,
  snowOutline,
  shieldOutline,
  alertCircle,
  closeCircle,
  checkmarkCircle,
  radioButtonOff,
  radioButtonOn,
  square,
  squareOutline,
  analytics,
  link,
  sendOutline,
  statsChartOutline,
  apps,
  barChart,
  server,
  library,
  resize,
  ellipse,
  fitness,
  planet,
  paperPlane,
  close,
  searchOutline,
  calendar,
  person,
  business,
  open,
  mail,
  globeOutline,
  pulseOutline,
  radioOutline
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

addIcons({
  home,
  search,
  heart,
  settings,
  'stats-chart': statsChart,
  'color-palette': colorPalette,
  'information-circle': informationCircle,
  star,
  'star-outline': starOutline,
  'arrow-back': arrowBack,
  refresh,
  warning,
  checkmark,
  add,
  remove,
  'chevron-down': chevronDown,
  'chevron-up': chevronUp,
  list,
  grid,
  filter,
  download,
  trash,
  shuffle,
  share,
  bookmarks,
  bookmark,
  'bookmark-outline': bookmarkOutline,
  eye,
  'eye-off': eyeOff,
  camera,
  image,
  images,
  play,
  pause,
  stop,
  chatbubbles,
  notifications,
  moon,
  sunny,
  contrast,
  language,
  'help-circle': helpCircle,
  bug,
  construct,
  code,
  terminal,
  rocket,
  trophy,
  medal,
  flash,
  thunderstorm,
  flame,
  water,
  leaf,
  flower,
  snow,
  earth,
  diamond,
  skull,
  airplane,
  shield,
  'fish-outline': fishOutline,
  'bug-outline': bugOutline,
  'flame-outline': flameOutline,
  'leaf-outline': leafOutline,
  'water-outline': waterOutline,
  'thunderstorm-outline': thunderstormOutline,
  'earth-outline': earthOutline,
  'eye-outline': eyeOutline,
  'skull-outline': skullOutline,
  'diamond-outline': diamondOutline,
  'airplane-outline': airplaneOutline,
  'flower-outline': flowerOutline,
  'snow-outline': snowOutline,
  'shield-outline': shieldOutline,
  'alert-circle': alertCircle,
  'close-circle': closeCircle,
  'checkmark-circle': checkmarkCircle,
  'radio-button-off': radioButtonOff,
  'radio-button-on': radioButtonOn,
  square,
  'square-outline': squareOutline,
  analytics,
  link,
  'send-outline': sendOutline,
  'stats-chart-outline': statsChartOutline,
  apps,
  'bar-chart': barChart,
  server,
  library,
  resize,
  ellipse,
  fitness,
  planet,
  'paper-plane': paperPlane,
  close,
  'search-outline': searchOutline,
  calendar,
  person,
  business,
  open,
  mail,
  'globe-outline': globeOutline,
  'pulse-outline': pulseOutline,
  'radio-outline': radioOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});
