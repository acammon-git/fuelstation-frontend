import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Verificación de soporte para Geolocation
if (!navigator.geolocation) {
  alert('Navegador no soporta la Geolocation');
  throw new Error('Navegador no soporta la Geolocation');
}

// Configuración de MapboxGL
const configureMapbox = async () => {
  const mapboxgl = await import('mapbox-gl');
  mapboxgl.default.accessToken = 'pk.eyJ1IjoiYWJ1Y2hpaGExMiIsImEiOiJjbHl5ZGplaW0xenJkMmlxdmYxaDVycHFnIn0.YUvQoO2Vey5-3t3lgyroLw';
};

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// Configura Mapbox después de que la aplicación se inicie
configureMapbox().catch(err => console.error('Error al configurar MapboxGL', err));
