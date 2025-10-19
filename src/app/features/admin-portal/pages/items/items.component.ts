import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { DialogOptions, StatusTyping } from '@core/constants';
import { ItemTyping } from '@core/constants/item.constant';
import { Item } from '@core/models/item.model';
import { BaseDialogData } from '@shared/components/dialog';
import {
  TableComponent,
  TableQuery,
} from '@shared/components/table/table.component';
import { ToastService } from '@shared/components/toast/toast.service';
import { ApiService } from '@shared/services/api';
import { ColumnDef } from '@tanstack/angular-table';
import { ItemsComponentService } from './items-component.service';
import { UpsertItemDialogComponent } from './upsert-item-dialog/upsert-item-dialog.component';

export interface ItemTableQuery extends TableQuery {
  name?: string | null;
  description?: string | null;
  type?: ItemTyping | null;
  tags?: string[] | null;
  status?: StatusTyping;
}

export interface ItemDialogData extends BaseDialogData {
  item?: Item;
}

@Component({
  selector: 'app-items',
  imports: [TableComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
})
export class ItemsComponent {
  private readonly dialog = inject(Dialog);
  private readonly apiService = inject(ApiService).item;
  private readonly toastService = inject(ToastService);

  itemColumns: ColumnDef<Item>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      sortingFn: 'alphanumeric',
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: `Description`,
      sortingFn: 'alphanumeric',
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Type',
      sortingFn: 'alphanumeric',
    },
    {
      id: 'sources',
      accessorKey: 'sources',
      header: `Sources`,
      sortingFn: 'alphanumeric',
      cell: ({ row }) => {
        const sources = row.getValue('sources') as string[];

        if (!sources.length) return '';
        return sources.join(', ');
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      sortingFn: 'alphanumeric',
    },
    // {
    //   id: 'actions',
    //   accessorFn: (row) => flexRenderComponent(),
    //   header: 'Actions',
    // },
  ];

  readonly state = inject(ItemsComponentService).state;

  constructor() {
    this.getItems(this.state.query());
  }

  openItemUpsertModal(item?: Item) {
    const data: ItemDialogData = {
      disableBackdropClose: true,
      ...(item ? { item } : {}),
    };
    const dialogRef = this.dialog.open(UpsertItemDialogComponent, {
      ...DialogOptions,
      width: '75vw',
      ...(item ? { autoFocus: false } : {}),
      data,
    });

    dialogRef.closed.subscribe({
      next: (result) => {
        if (!result) return;
        this.getItems(this.state.query());
      },
      error: (error) => {
        console.error('Error closing dialog:', error);
      },
    });
  }

  handleQueryChange(query: ItemTableQuery) {
    this.state.query.set(query);
    this.getItems(query);
  }
  private getItems(state: ItemTableQuery) {
    this.apiService.getItems(state).subscribe({
      next: (response) => {
        this.state.items.set(response);
      },
      error: (error) => {
        console.error('Error getting items:', error);
      },
    });
    // this.itemStateService.query$.next(state);
  }
}
