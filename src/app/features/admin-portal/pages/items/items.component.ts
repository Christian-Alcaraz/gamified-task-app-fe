import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { DialogOptions } from '@core/constants';
import { TableComponent } from '@shared/components/table/table.component';
import { ColumnDef } from '@tanstack/angular-table';
import { UpsertItemDialogComponent } from './upsert-item-dialog/upsert-item-dialog.component';

export interface Person {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status?: string;
  progress: number;
}

@Component({
  selector: 'app-items',
  imports: [TableComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
})
export class ItemsComponent {
  private readonly dialog = inject(Dialog);
  defaultData: Person[] = [
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50,
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      progress: 80,
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10,
    },
  ];

  defaultColumns: ColumnDef<Person>[] = [
    {
      accessorKey: 'firstName',
      header: 'First Name',
      sortingFn: 'alphanumeric',
    },
    {
      accessorKey: 'lastName',
      header: `Last Name`,
      sortingFn: 'alphanumeric',
    },
    {
      accessorKey: 'age',
      header: 'Age',
      sortingFn: 'alphanumeric',
    },
    {
      accessorKey: 'visits',
      header: `Visits`,
      sortingFn: 'alphanumeric',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      sortingFn: 'alphanumeric',
    },
    {
      accessorKey: 'progress',
      header: 'Profile Progress',
      enableSorting: false,
    },
    // {
    //   id: 'actions',
    //   accessorFn: (row) => flexRenderComponent(),
    //   header: 'Actions',
    // },
  ];

  openItemUpsertModal() {
    const dialogRef = this.dialog.open(UpsertItemDialogComponent, {
      ...DialogOptions,
      width: '75vw',
      data: {
        disableBackdropClose: true,
      },
    });

    dialogRef.closed.subscribe({
      next: (result) => {
        console.log('Dialog closed', result);
      },
      error: (error) => {
        console.error('Error closing dialog:', error);
      },
    });
  }
}
