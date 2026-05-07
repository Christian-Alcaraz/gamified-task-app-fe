import { inject, Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class ConversationApiService {
  private http = inject(HttpService);
  private readonly baseUrl = '/conversation';
}
