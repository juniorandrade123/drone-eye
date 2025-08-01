import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter } from '@angular/router'

import { DecimalPipe, HashLocationStrategy, LocationStrategy } from '@angular/common'
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideEffects } from '@ngrx/effects'
import { provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { localStorageSyncReducer } from '@store/layout/layout-reducers'
import { provideToastr } from 'ngx-toastr'
import { routes } from './app.routes'
import { rootReducer } from './store'
import { AuthenticationEffects } from '@store/authentication/authentication.effects'
import { GlobalValuesService } from './core/services/global.values.service'
import { jwtInterceptor } from './helper/jwt.interceptor'
import { errorInterceptor } from './helper/error.interceptor'
import { headersInterceptor } from './helper/headers.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([headersInterceptor, errorInterceptor, jwtInterceptor])),
    GlobalValuesService,
    DecimalPipe,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(rootReducer, { metaReducers: [localStorageSyncReducer] }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(AuthenticationEffects),
    importProvidersFrom(BrowserAnimationsModule, BrowserModule),
    provideToastr({}),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
};
