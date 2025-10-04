import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  OnInit,
  output,
  Signal,
  signal,
} from '@angular/core';
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
  Table,
} from '@tanstack/table-core';
import { NgpButton } from 'ng-primitives/button';
import { NgpMenuTrigger } from 'ng-primitives/menu';
import { environment } from 'src/environments/environment';
import { TableDropMenuComponent } from './table-drop-menu/table-drop-menu.component';

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
export class TableComponent<TData> implements OnInit {
  title = input.required<string>();
  data = input.required<TData[]>();
  columns = input.required<ColumnDef<TData>[]>();
  addItem = output<void>();

  readonly columnFilters = signal<ColumnFiltersState>([]);

  table!: Table<TData> & Signal<Table<TData>>;
  columnCount!: number;
  viewMenuItems!: Record<string, string | Column<TData>>[];

  ngOnInit(): void {
    this.table = createAngularTable(() => ({
      data: this.data(),
      columns: this.columns(),
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

    this.columnCount = this.table.getAllColumns().length;
    this.viewMenuItems = this.table.getAllLeafColumns().map((column) => ({
      label: column.columnDef.header as string,
      column,
    }));
  }

  viewMenuItemSelected(column: Column<TData>) {
    column.toggleVisibility();
  }

  sortColumnByHeader(column: Column<TData>) {
    if (!column.getCanSort()) return;
    column.toggleSorting();
  }
}
/**
   *     accessorFn: row => row.lastName,
    id: 'lastName',
    cell: info => `<i>${info.getValue<string>()}</i>`,
   */

// {
//   id: 'actions',
//   accessorFn: (row) => flexRenderComponent(),
//   header: 'Actions',
// },
