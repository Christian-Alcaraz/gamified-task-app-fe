import { inject, Injectable } from '@angular/core';
import { Item } from '@core/models/item.model';
import { IItemTableQuery } from '@features/admin-portal/pages/items/items.component';
import { HttpService } from '@shared/services/http/http.service';
import { IPaginatedResponse } from '../base-api.class';

@Injectable({
  providedIn: 'root',
})
export class ItemApiService {
  private readonly httpService = inject(HttpService);
  private readonly url = '/items';

  createItem(item: Item) {
    return this.httpService.start<Item>('post', this.url, item);
  }

  updateItem(item: Item, itemId: string) {
    return this.httpService.start<Item>('put', `${this.url}/${itemId}`, item);
  }

  getTask(itemId: string) {
    return this.httpService.start<Item>('get', `${this.url}/${itemId}`);
  }

  getItems(query?: IItemTableQuery) {
    query = (query ?? {}) as IItemTableQuery;

    return this.httpService.start<IPaginatedResponse<Item>>(
      'get',
      this.url,
      {},
      query as Record<string, any>, //eslint-disable-line @typescript-eslint/no-explicit-any
    );
  }
}
