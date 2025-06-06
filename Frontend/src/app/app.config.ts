import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MqttModule } from 'ngx-mqtt';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), provideClientHydration(), 
    provideAnimationsAsync(), 
    provideHttpClient(withFetch()),
    { provide: BrowserAnimationsModule, useValue: BrowserAnimationsModule },
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      tapToDismiss: true,
    }),    importProvidersFrom(MqttModule.forRoot({
      hostname: 'mqtt.dancs.org',
      port: 8084,
      path: '/mqtt',
      protocol: 'wss',
      connectOnCreate: false  // Prevent auto-connection during SSR
    })),
  ]
};
