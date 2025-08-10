import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.class';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  private readonly url = `/auth`;
  private readonly http = inject(HttpClient);
  /* eslint-disable */
  login(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}${this.url}/login`, {
      email,
      password,
    });
  }

  me() {
    return this.http.get<any>(`${this.url}/me`);
  }
  /* eslint-enable */
}
