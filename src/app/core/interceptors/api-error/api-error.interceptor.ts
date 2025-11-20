import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@shared/components/toast/toast.service';
import { AuthService } from '@shared/services/api/auth/auth.service';
import { HttpService } from '@shared/services/http/http.service';
import { catchError, of, Subject, switchMap, tap, throwError } from 'rxjs';

@Injectable()
export class ApiErrorInterceptorDI implements HttpInterceptor {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpService);

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
    if (req.url.endsWith('/logout') || req.url.endsWith('/token-refresh')) {
      return handler.handle(req);
    }
    return handler.handle(req).pipe(
      catchError((error) => {
        const showToastError = (message: string) => {
          this.toast.showToast('Error', message, 'error');
        };
        let isServerError = false;

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
        } else if (this._checkTokenExpiryError(error)) {
          return this._ifTokenExpired().pipe(
            switchMap(() => handler.handle(this._updateHeader(req))),
          );
        }

        return isServerError ? of(error) : throwError(() => error);
      }),
    );
  }

  // private _handleError(
  //   error: HttpErrorResponse,
  //   request: HttpRequest<any>, //eslint-disable-line @typescript-eslint/no-explicit-any
  // ) {
  //   const showToastError = (message: string) => {
  //     this.toast.showToast('Error', message, 'error');
  //   };

  //   let isServerError = false;

  //   if (error.statusText === 'Unknown Error') {
  //     isServerError = true;
  //     showToastError(
  //       'No internet connection. Please check your internet connection and try again.',
  //     );
  //   } else if (error.status === 500) {
  //     isServerError = true;
  //     showToastError(
  //       'Internal server error. Please contact the administrator.',
  //     );
  //   } else if (this._checkTokenExpiryError(error)) {
  //   }

  //   return isServerError ? of(error) : throwError(() => error);
  // }
}

//  private _handleError(
//     error: HttpErrorResponse,
//     request: HttpRequest<any>, //eslint-disable-line @typescript-eslint/no-explicit-any
//   ) {
//     const showToastError = (message: string) => {
//       this.toast.showToast('Error', message, 'error');
//     };

//     let isServerError = false;

//     const isErrorUnauthorizedForbidden = [
//       HttpStatusCode.Unauthorized,
//       HttpStatusCode.Forbidden,
//     ].includes(error.status);

//     if (!error) {
//       return of();
//     }

//     if (error.statusText === 'Unknown Error') {
//       isServerError = true;
//       showToastError(
//         'No internet connection. Please check your internet connection and try again.',
//       );
//     } else if (error.status === 500) {
//       isServerError = true;
//       showToastError(
//         'Internal server error. Please contact the administrator.',
//       );
//     } else if (isErrorUnauthorizedForbidden) {
//       console.log('IT IS UNAUTHORIZED FORBIDDEN');

//       const isRequestUrlIncludesAuth = request.url.includes('auth');
//       const isRequestUrlRefreshToken = request.url.endsWith('/refresh-token');
//       console.log({
//         url: request.url,
//         '!isRequestUrlIncludesAuth && !isRequestUrlRefreshToken':
//           !isRequestUrlIncludesAuth && !isRequestUrlRefreshToken,
//         isRequestUrlIncludesAuth: isRequestUrlIncludesAuth,
//         isRequestUrlRefreshToken: isRequestUrlRefreshToken,
//       });
//       if (!isRequestUrlIncludesAuth || !isRequestUrlRefreshToken) {
//         /**
//          * This means request tried to access a resource and the auth token used is invalid/expired
//          * So try to get new auth token via refresh token and then retry the request again.
//          */

//         console.log('Refreshing Token');
//         this.authService.refreshToken().subscribe({
//           next: (response) => {
//             const { token } = response;
//             this.authService.setAuthToken(token);

//             const method = request.method as HttpMethod;
//             const url = request.url;
//             const body = request.body ?? {};
//             const query = request.params;

//             return this.http.start(method, url, body, query);
//           },
//         });
//       } else if (isRequestUrlRefreshToken) {
//         /**
//          * This means request tried to use refresh token to get new access token and failed.
//          * So forced to reauthenticate user.
//          */

//         // this.authService.logout();
//         showToastError(error.error.message);

//         const routerUrlIncludesPortal = this.router.url.includes('portal');
//         if (routerUrlIncludesPortal) {
//           this.router.navigate(['/auth/login']);
//           localStorage.removeItem(Token.Auth);
//         }
//       }
//     }

//     return isServerError ? of(error) : throwError(() => error);
//   }
