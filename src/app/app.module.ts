import { NgModule, isDevMode,APP_INITIALIZER  } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptor } from './demo/auth.interceptor';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CookieService } from 'ngx-cookie-service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StrapiService } from './demo/service/strapi.service';

// export function initializeApp(strapiService: StrapiService): () => Promise<void> {
//     return async (): Promise<void> => {
//         await strapiService.clearDatabase(); // Execute clearDatabase before cacheAllTables
//         return strapiService.cacheAllTables(); // Then execute cacheAllTables
//     };
// }
export function initializeApp(strapiService: StrapiService): () => Promise<void> {
  return (): Promise<void> => strapiService.cacheAllTables();
}
  @NgModule({
    declarations: [AppComponent],
    imports: [
      AppRoutingModule,
      AppLayoutModule,
      BrowserAnimationsModule,
      BrowserModule,
      HttpClientModule,
      AutoCompleteModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
      })
    ],
    providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy },
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      CookieService,
      {
        provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [StrapiService],
        multi: true
      }
    ],
    bootstrap: [AppComponent]
  })
export class AppModule {}
