import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Token } from '@core/constants';
import { BaseApiService } from '../base-api.class';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  private readonly url = `${this.baseUrl}/auth`;
  private readonly http = inject(HttpClient);
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
  /* eslint-enable */
}
