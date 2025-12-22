import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EToken } from '@core/constants';
import {
  ToastType,
  ToastTyping,
} from '@shared/components/toast/toast.component';
import { ToastService } from '@shared/components/toast/toast.service';
import { AuthService } from '@shared/services/api/auth/auth.service';
import { catchError, of, Subject, switchMap, tap, throwError } from 'rxjs';

@Injectable()
export class ApiErrorInterceptorDI implements HttpInterceptor {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly authService = inject(AuthService);

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _refreshSubject$: Subject<any> = new Subject<any>();

  private _checkTokenExpiryError(error: HttpErrorResponse): boolean {
    return (
      error.status &&
      error.status === 401 &&
      error.error &&
      error.error.message === 'Token Expired'
    );
  }

  private _ifTokenExpired() {
    this._refreshSubject$.subscribe({
      complete: () => {
        this._refreshSubject$ = new Subject<any>(); //eslint-disable-line @typescript-eslint/no-explicit-any
      },
    });
    if (this._refreshSubject$.observers.length === 1) {
      // Hit refresh-token API passing the refresh token stored into the request
      // to get new access token and refresh token pair
      this.authService
        .refreshToken()
        .pipe(
          tap({
            next: (response) => {
              const { token } = response;
              this.authService.setAuthToken(token);
            },
          }),
        )
        .subscribe(this._refreshSubject$);
    }
    return this._refreshSubject$;
  }

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _updateHeader(req: HttpRequest<any>) {
    return req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${this.authService.getAuthToken()}`,
      ),
    });
  }

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, handler: HttpHandler): any {
    const showToast = (
      message: string,
      header = 'Error',
      type: ToastTyping = 'error',
    ) => {
      this.toast.showToast(header, message, type);
    };

    if (req.url.endsWith('/logout')) {
      return handler.handle(req);
    }

    if (req.url.endsWith('/refresh-token')) {
      return handler.handle(req).pipe(
        catchError((error) => {
          if (
            error instanceof HttpErrorResponse &&
            error.status === HttpStatusCode.Unauthorized
          ) {
            showToast(
              error.error.message,
              '',
              ToastType.Warning as ToastTyping,
            );
            if (this.router.url.includes('hub')) {
              localStorage.removeItem(EToken.Auth);
              this.router.navigate(['auth']);
            }
          }

          return throwError(() => error);
        }),
      );
    }

    return handler.handle(req).pipe(
      catchError((error) => {
        let isServerError = false;

        if (error.statusText === 'Unknown Error') {
          isServerError = true;
          showToast(
            'No internet connection. Please check your internet connection and try again.',
          );
        } else if (error.status === 500) {
          isServerError = true;
          showToast('Internal server error. Please contact the administrator.');
        } else if (this._checkTokenExpiryError(error)) {
          return this._ifTokenExpired().pipe(
            switchMap(() => handler.handle(this._updateHeader(req))),
          );
        }

        return isServerError ? of(error) : throwError(() => error);
      }),
    );
  }
}
