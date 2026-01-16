import { inject, Injectable } from '@angular/core';
import { Party } from '@core/models';
import { IItemTableQuery } from '@features/admin-portal/pages/items/items.component';
import { HttpService } from '@shared/services/http/http.service';
import { IPaginatedResponse } from '../base-api.class';

@Injectable({
  providedIn: 'root',
})
export class PartyApiService {
  private readonly httpService = inject(HttpService);
  private readonly url = '/parties';

  createParty(party: Party) {
    return this.httpService.start<Party>('post', this.url, party);
  }

  updateParty(party: Party, partyId: string) {
    return this.httpService.start<Party>(
      'put',
      `${this.url}/${partyId}`,
      party,
    );
  }

  getPartyById(partyId: string) {
    return this.httpService.start<Party>('get', `${this.url}/${partyId}`);
  }

  getParties(query?: IItemTableQuery) {
    query = (query ?? {}) as IItemTableQuery;
    return this.httpService.start<IPaginatedResponse<Party>>(
      'get',
      this.url,
      {},
      query as Record<string, any>, //eslint-disable-line @typescript-eslint/no-explicit-any
    );
  }
}
