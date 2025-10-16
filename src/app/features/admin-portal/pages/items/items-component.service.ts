import { Injectable, signal, WritableSignal } from '@angular/core';
import { Item } from '@core/models/item.model';
import { PaginatedResponse } from '@shared/services/api/base-api.class';
import { ItemTableQuery } from './items.component';

export interface ItemState {
  items: WritableSignal<PaginatedResponse<Item>>;
  query: WritableSignal<ItemTableQuery>;
}

@Injectable({
  providedIn: 'root',
})
export class ItemsComponentService {
  items = signal<PaginatedResponse<Item>>({
    records: [],
    total: 0,
  });

  query = signal<ItemTableQuery>({ pageSize: 10, pageIndex: 0 });

  state: ItemState = {
    items: this.items,
    query: this.query,
  };
}
