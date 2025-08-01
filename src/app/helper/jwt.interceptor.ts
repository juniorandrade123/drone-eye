import { inject } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptorFn,
    HttpHandlerFn,
    HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'
import { environment } from '@environment/environment';

export const jwtInterceptor: HttpInterceptorFn = (
    request: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const authSessionKey = '_AMC_AUTH_SESSION_KEY_';
    const cookieService = inject(CookieService);

    const session = cookieService.get(authSessionKey);
    if (!session || session === '') return next(request);

    if (session && request.url.includes(environment.api)) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${session}`,
            },
        });
    }

    return next(request);
};