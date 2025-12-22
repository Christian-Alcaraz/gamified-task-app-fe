import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { DIALOG_OPTIONS, EStatus, EUiState } from '@core/constants';
import { EItemType } from '@core/constants/item.constant';
import { Item } from '@core/models/item.model';
import { IBaseDialogData } from '@shared/components/dialog';
import {
  ITableQuery,
  TableComponent,
} from '@shared/components/table/table.component';
import { ToastService } from '@shared/components/toast/toast.service';
import { ApiService } from '@shared/services/api';
import { ColumnDef } from '@tanstack/angular-table';
import { ItemsComponentService } from './items-component.service';
import { UpsertItemDialogComponent } from './upsert-item-dialog/upsert-item-dialog.component';

export interface IItemTableQuery extends ITableQuery {
  name?: string | null;
  description?: string | null;
  type?: EItemType | null;
  tags?: string[] | null;
  status?: EStatus;
}

export interface IItemDialogData extends IBaseDialogData {
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
  private readonly toast = inject(ToastService);

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
    const data: IItemDialogData = {
      disableBackdropClose: true,
      ...(item ? { item } : {}),
    };
    const dialogRef = this.dialog.open(UpsertItemDialogComponent, {
      ...DIALOG_OPTIONS,
      width: '75vw',
      ...(item ? { autoFocus: false } : {}),
      data,
    });

    dialogRef.closed.subscribe({
      next: (result) => {
        if (!result) return;
        const header = item ? 'Updated' : 'Created';
        const message = item
          ? `Item has been updated.`
          : `Item has been created.`;

        this.toast.showToast(header, message, EUiState.Success);
        this.getItems(this.state.query());
      },
      error: ({ error }) => {
        this.toast.showToast('Error', error.message, EUiState.Error);
      },
    });
  }

  handleQueryChange(query: IItemTableQuery) {
    this.state.query.set(query);
    this.getItems(query);
  }

  private getItems(query: IItemTableQuery) {
    this.apiService.getItems(query).subscribe({
      next: (response) => {
        this.state.items.set(response);
      },
      error: ({ error }) => {
        console.error('Error getting items:', error.message);
      },
    });
  }
}
