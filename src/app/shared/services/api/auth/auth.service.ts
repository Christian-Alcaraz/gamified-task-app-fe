import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from '@core/constants';
import { UserStateService } from '@shared/services/state/user.state.service';
import { finalize } from 'rxjs';
import { BaseApiService } from '../base-api.class';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  private readonly url = `${this.baseUrl}/auth`;
  private readonly http = inject(HttpClient);
  private readonly userStateService = inject(UserStateService);
  private readonly router = inject(Router);

  /* eslint-disable */
  login(email: string, password: string) {
    return this.http.post<any>(`${this.url}/login`, {
      email,
      password,
    });
  }

  register(email: string, password: string) {
    return this.http.post<any>(`${this.url}/register`, {
      email,
      password,
    });
  }

  me() {
    const authToken = localStorage.getItem(Token.Auth);
    const headers = new HttpHeaders({
      authorization: `Bearer ${authToken}`,
    });
    return this.http.get<any>(`${this.url}/me`, {
      headers,
    });
  }

  logout() {
    const authToken = localStorage.getItem(Token.Auth);
    const headers = new HttpHeaders({
      authorization: `Bearer ${authToken}`,
    });

    return this.http.post<any>(`${this.url}/logout`, {}, { headers }).pipe(
      finalize(() => {
        this.userStateService.clearUserState();
        this.removeAuthToken();
        this.router.navigate(['/auth/login']);
      }),
    );
  }

  refreshToken() {
    return this.http.post<any>(`${this.url}/refresh-token`, null);
  }

  setAuthToken(token: string) {
    localStorage.setItem(Token.Auth, token);
  }

  getAuthToken() {
    return localStorage.getItem(Token.Auth);
  }

  removeAuthToken() {
    localStorage.removeItem(Token.Auth);
  }

  /* eslint-enable */
}
