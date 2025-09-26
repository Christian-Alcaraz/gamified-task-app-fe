import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  createAngularTable,
  FlexRenderDirective,
} from '@tanstack/angular-table';
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/table-core';
import { NgpButton } from 'ng-primitives/button';
import { NgpMenuTrigger } from 'ng-primitives/menu';
import { environment } from 'src/environments/environment';
import { TableDropMenuComponent } from './table-drop-menu/table-drop-menu.component';

interface Person {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status?: string;
  progress: number;
}

@Component({
  selector: 'app-table',
  imports: [
    FlexRenderDirective,
    CommonModule,
    TableDropMenuComponent,
    NgpMenuTrigger,
    NgpButton,
    NgIcon,
  ],
  standalone: true,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
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

  /**
   *     accessorFn: row => row.lastName,
    id: 'lastName',
    cell: info => `<i>${info.getValue<string>()}</i>`,
   */

  data = signal<Person[]>(this.defaultData);

  readonly columnFilters = signal<ColumnFiltersState>([]);

  table = createAngularTable(() => ({
    data: this.data(),
    columns: this.defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters: this.columnFilters(),
    },
    onColumnFiltersChange: (updater) => {
      if (updater instanceof Function) {
        return this.columnFilters.update(updater);
      }
      return this.columnFilters.set(updater);
    },
    debugTable: !environment.PRODUCTION,
  }));

  columnCount = this.table.getAllColumns().length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewMenuItems!: any;

  rerender() {
    this.data.set([...this.defaultData.sort(() => -1)]);
  }

  constructor() {
    this.viewMenuItems = this.table.getAllLeafColumns().map((column) => ({
      label: column.columnDef.header,
      column,
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewMenuItemSelected(column: Column<any>) {
    column.toggleVisibility();
  }

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortColumnByHeader(column: Column<any>) {
    if (!column.getCanSort()) return;
    column.toggleSorting();
  }
}
