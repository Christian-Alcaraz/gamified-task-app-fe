import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Token } from '@core/constants';
import { environment } from 'src/environments/environment';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_URL;

  private get headers() {
    const authToken = localStorage.getItem(Token.Auth);
    const headers = new HttpHeaders({
      authorization: `Bearer ${authToken}`,
    });
    return { headers };
  }

  start<T>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
    query?: Record<string, number | string | boolean>,
    options?: {
      headers?: Record<string, number | string | boolean>;
      responseType?: string;
      observe?: string;
    },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const option: Record<string, any> = this.headers;

    if (options) {
      if (options.headers) {
        const headers = { ...option['headers'], ...options.headers };
        option['headers'] = headers;
      }

      if (options.responseType) {
        option['responseType'] = options.responseType;
      }

      if (options.observe) {
        option['observe'] = options.observe;
      }
    }

    const url = `${this.baseUrl}${endpoint}`;

    const queryParams = new HttpParams({
      fromObject: query,
    });

    switch (method) {
      case 'get': // get
        return this.http.get<T>(url, { ...option, params: queryParams });

      case 'post': // insert
        return this.http.post<T>(url, body, option);

      case 'put': // update all
        return this.http.put<T>(url, body, option);

      case 'patch': // update some
        return this.http.patch<T>(url, body, option);

      case 'delete': // delete
        return this.http.delete<T>(url, option);

      default:
        return this.http.get<T>(url, option);
    }
  }
}
