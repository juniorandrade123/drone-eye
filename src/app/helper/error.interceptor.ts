import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/auth.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthenticationService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Ocorreu um erro inesperado';
            console.error('Erro capturado no interceptor:', error);

            if (error.error instanceof ErrorEvent) {
                // Erro do lado do cliente
                errorMessage = `Erro: ${error.error.message}`;
            } else {
                switch (error.status) {
                    case 401:
                    case 403:
                        authService.logout();
                        router.navigate(['/auth/signin']);
                        break;
                }
            }

            return throwError(() => new Error(errorMessage));
        })
    );
};