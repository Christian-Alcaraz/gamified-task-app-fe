import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  OnDestroy,
  OnInit,
  output,
  Signal,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import {
  createAngularTable,
  FlexRenderDirective,
} from '@tanstack/angular-table';
import {
  Column,
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  Row,
  SortingState,
  Table,
  Updater,
} from '@tanstack/table-core';
import { isEqual } from 'lodash';
import { NgpButton } from 'ng-primitives/button';
import { NgpMenuTrigger } from 'ng-primitives/menu';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MenuComponent } from '../menu/menu.component';
import { TableDropMenuComponent } from './table-drop-menu/table-drop-menu.component';
export interface TableQuery {
  search?: string;
  sort?: string;
  pageSize: number;
  pageIndex: number;
}
@Component({
  selector: 'app-table',
  imports: [
    FlexRenderDirective,
    CommonModule,
    TableDropMenuComponent,
    MenuComponent,
    NgpMenuTrigger,
    NgpButton,
    NgIcon,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<TData, TQueryState extends TableQuery>
  implements OnInit, OnDestroy
{
  //** States
  private _destroyed = new Subject<void>();
  readonly sorting = signal<SortingState>([]);
  readonly pageSizes = [10, 25, 50, 100];
  readonly searchControl = new FormControl('');
  table!: Table<TData> & Signal<Table<TData>>;
  viewMenuItems!: Record<string, string | Column<TData>>[];

  //** Inputs
  canAddNewItem = input<boolean>(true);
  enableRowSelection = input<boolean>(false);
  searchPlaceholder = input<string>('Search in table...'); //Todo: Maybe use props????
  title = input<string>('Data');
  data = input.required<TData[]>();
  columns = input.required<ColumnDef<TData>[]>();
  pageCount = input.required<number>();
  query = input.required<TQueryState>();

  //** Outputs
  addItem = output<void>();
  selectedRow = output<TData>();
  tableQueryChange = output<TableQuery>();

  private onSortingChange = (updater: Updater<SortingState>) => {
    const next =
      typeof updater === 'function' ? updater(this.sorting()) : updater;
    const query = {
      ...this.query(),
      sort: this._fromSortingState(next),
    };

    if (!this._isQueryEqual(query, this.query())) {
      this.tableQueryChange.emit(query);
    }
  };

  private onPaginationChange = (updater: Updater<PaginationState>) => {
    const next =
      typeof updater === 'function' ? updater(this.query()) : updater;

    const query = {
      ...this.query(),
      pageSize: next.pageSize,
      pageIndex: next.pageIndex,
    };

    if (!this._isQueryEqual(query, this.query())) {
      this.tableQueryChange.emit(query);
    }
  };

  //Todo: Action Columns with Menu Options

  ngOnInit(): void {
    this.table = createAngularTable(() => ({
      data: this.data(),
      columns: this.columns(),
      getCoreRowModel: getCoreRowModel(),
      manualSorting: true,
      manualPagination: true,
      sortDescFirst: true,
      enableSortingRemoval: false, //Todo: This needs to be true so that loop is false -> desc -> asc -> false;
      autoResetPageIndex: false,
      pageCount: this.pageCount(),
      debugTable: !environment.PRODUCTION,
      state: {
        pagination: {
          pageSize: this.query().pageSize,
          pageIndex: this.query().pageIndex,
        },
        sorting: this._toSortingState(this.query().sort as string),
      },
      onSortingChange: this.onSortingChange,
      onPaginationChange: this.onPaginationChange,
    }));

    this.viewMenuItems = this.table.getAllLeafColumns().map((column) => ({
      label: column.columnDef.header as string,
      column,
    }));

    this.searchControl.valueChanges
      .pipe(debounceTime(300), takeUntil(this._destroyed))
      .subscribe((search) => {
        const query = {
          ...this.query(),
          search,
        };

        if (!this._isQueryEqual(query, this.query())) {
          this.tableQueryChange.emit(query);
        }
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  rowClick(row: Row<TData>) {
    if (!this.enableRowSelection()) return;
    this.selectedRow.emit(row.original);
  }

  toggleColumnVisibility(column: Column<TData>) {
    column.toggleVisibility();
  }

  toggleColumnSorting(column: Column<TData>) {
    if (!column.getCanSort()) return;
    column.toggleSorting();
  }

  changePageSize(size: number) {
    this.table.setPageSize(size);
  }

  getSortIcon(column: Column<TData>) {
    if (!column.getCanSort()) return;
    const sortState = column.getIsSorted();
    const isSortStateFalse = sortState === false;
    return isSortStateFalse ? 'heroChevronUpDown' : 'heroChevronUp';
  }

  private _isQueryEqual(query: TQueryState, prevQuery: TQueryState) {
    return isEqual(query, prevQuery);
  }

  private _fromSortingState(sorting: SortingState): string {
    if (sorting.length === 0) return '';
    const { id, desc } = sorting[0];
    return `${id}:${desc === true ? 'desc' : 'asc'}`;
  }

  private _toSortingState(sortStr: string): SortingState {
    if (!sortStr) return [];
    try {
      const [id, descStr] = sortStr.split(':');
      return [{ id, desc: descStr === 'desc' }];
    } catch {
      return [];
    }
  }
}
