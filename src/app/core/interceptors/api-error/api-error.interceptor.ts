import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from '@core/constants';
import { ToastService } from '@shared/components/toast/toast.service';
import { AuthService } from '@shared/services/api/auth/auth.service';
import { HttpMethod, HttpService } from '@shared/services/http/http.service';
import { catchError, of, switchMap, throwError } from 'rxjs';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpService);

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, handler: HttpHandler): any {
    return handler
      .handle(req)
      .pipe(catchError((error) => this._handleError(error, req)));
  }

  private async _handleError(
    error: HttpErrorResponse,
    request: HttpRequest<any>, //eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    const showToastError = (message: string) => {
      this.toast.showToast('Error', message, 'error');
    };

    let isServerError = false;

    const isErrorUnauthorizedForbidden = [
      HttpStatusCode.Unauthorized,
      HttpStatusCode.Forbidden,
    ].includes(error.status);

    if (!error) {
      return of();
    }

    if (error.statusText === 'Unknown Error') {
      isServerError = true;
      showToastError(
        'No internet connection. Please check your internet connection and try again.',
      );
    } else if (error.status === 500) {
      isServerError = true;
      showToastError(
        'Internal server error. Please contact the administrator.',
      );
    } else if (isErrorUnauthorizedForbidden) {
      const isRequestUrlIncludesAuth = request.url.includes('auth');
      const isRequestUrlRefreshToken =
        request.url.includes('auth/refresh-token');

      if (!isRequestUrlIncludesAuth && !isRequestUrlRefreshToken) {
        /**
         * This means request tried to access a resource and the access token used is invalid/expired
         * So try to get new access token via refresh token and then retry the request again.
         */

        this.authService.refreshToken().pipe(
          switchMap((response) => {
            if (!response) {
              return of();
            }

            const { token } = response;
            this.authService.setAuthToken(token);

            const method = request.method as HttpMethod;
            const url = request.url;
            const body = request.body ?? {};
            const query = request.params;

            return this.http.start(method, url, body, query);
          }),
        );
        return of('Attempting to refresh token and retrying request');
      } else if (!isRequestUrlIncludesAuth && isRequestUrlRefreshToken) {
        /**
         * This means request tried to use refresh token to get new access token and failed.
         * So forced to reauthenticate user.
         */

        // this.authService.logout();
        showToastError(error.error.message);

        const routerUrlIncludesPortal = this.router.url.includes('portal');
        if (routerUrlIncludesPortal) {
          this.router.navigate(['/auth/login']);
          localStorage.removeItem(Token.Auth);
        }
      }
    }

    return isServerError ? of(error) : throwError(() => error);
  }
}
