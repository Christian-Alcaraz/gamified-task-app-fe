import { Injectable, signal, WritableSignal } from '@angular/core';
import { Item } from '@core/models/item.model';
import { IPaginatedResponse } from '@shared/services/api/base-api.class';
import { IItemTableQuery } from './items.component';

export interface IItemState {
  items: WritableSignal<IPaginatedResponse<Item>>;
  query: WritableSignal<IItemTableQuery>;
}

@Injectable({
  providedIn: 'root',
})
export class ItemsComponentService {
  items = signal<IPaginatedResponse<Item>>({
    records: [],
    total: 0,
  });

  query = signal<IItemTableQuery>({ pageSize: 10, pageIndex: 0 });

  state: IItemState = {
    items: this.items,
    query: this.query,
  };
}
