import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { DIALOG_OPTIONS, UI_STATE } from '@core/constants';
import { ETaskType } from '@core/models/task.model';
import { NgIcon } from '@ng-icons/core';
import { TextFieldComponent } from '@shared/components/inputs';
import {
  IMenuItem,
  MenuComponent,
} from '@shared/components/menu/menu.component';
import { ToastService } from '@shared/components/toast/toast.service';
import {
  DailiesTaskStateFactory,
  DailiesTaskStateInstance,
  TaskStateService,
  TodoTaskStateFactory,
  TodoTaskStateInstance,
} from '@shared/services/state/task.state.service';
import { UserStateService } from '@shared/services/state/user.state.service';
import { UtilService } from '@shared/services/util/util.service';
import { NgpButton } from 'ng-primitives/button';
import { NgpMenuTrigger } from 'ng-primitives/menu';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import {
  ITaskListFilter,
  TaskListComponent,
} from './task-list/task-list.component';
import { UpsertTaskDialogComponent } from './upsert-task-dialog/upsert-task-dialog.component';

@Component({
  selector: 'app-tasks',
  imports: [
    DialogModule,
    TaskListComponent,
    TextFieldComponent,
    ReactiveFormsModule,
    MenuComponent,
    NgpMenuTrigger,
    NgpButton,
    NgIcon,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  providers: [
    {
      provide: DailiesTaskStateInstance,
      useFactory: DailiesTaskStateFactory,
    },
    {
      provide: TodoTaskStateInstance,
      useFactory: TodoTaskStateFactory,
    },
  ],
})
export class TasksComponent extends ThemeAwareComponent implements OnDestroy {
  private readonly userStateService = inject(UserStateService);
  private readonly dialog = inject(Dialog);
  private readonly scrollStrategy = inject(ScrollStrategyOptions);
  private readonly toast = inject(ToastService);
  private readonly stringUtil = inject(UtilService).string;

  readonly dailiesStateService = inject(DailiesTaskStateInstance);
  readonly todoStateService = inject(TodoTaskStateInstance);

  readonly user = this.userStateService.userState();
  readonly taskType = ETaskType;

  readonly searchTaskForm = new FormGroup({
    text: new FormControl(''),
  });

  private readonly destroyed$ = new Subject<void>();

  get searchTextControl() {
    return this.searchTaskForm.get('text');
  }

  menuItems: IMenuItem[] = [
    {
      label: 'Add Dailies',
      action: 'add_dailies',
      icon: 'saxCalendar1Outline',
    },
    {
      label: 'Add Todo',
      action: 'add_todo',
      icon: 'saxCheckbox1Outline',
    },
  ];

  todoFilters: ITaskListFilter[] = [
    {
      label: 'Active',
      query: { completed: false },
    },
    {
      label: 'Scheduled',
      query: { completed: false, deadlineDate: 'exists' },
    },
    {
      label: 'Completed',
      query: { completed: true },
    },
  ];

  dailiesFilters: ITaskListFilter[] = [
    {
      label: 'All',
      query: null,
    },
    {
      label: 'Pending',
      query: { completed: false },
    },
    {
      label: 'Completed',
      query: { completed: true },
    },
  ];

  constructor() {
    super();

    this.searchTextControl?.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroyed$))
      .subscribe((text) => {
        this.dailiesStateService.filterControl.setValue(text);
        this.todoStateService.filterControl.setValue(text);
      });
  }

  refreshList(service: TaskStateService) {
    service.retry$.next();
  }

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeQuery(query: Record<string, any>, service: TaskStateService) {
    service.query$.next(query);
  }

  promptAction(action: string) {
    const type = action === 'add_dailies' ? ETaskType.Dailies : ETaskType.Todo;
    setTimeout(() => {
      this._openUpsertTaskDialog(type);
    }, 100);
  }

  private _openUpsertTaskDialog(taskType: ETaskType) {
    const service =
      taskType === ETaskType.Dailies
        ? this.dailiesStateService
        : this.todoStateService;

    const dialogRef = this.dialog.open(UpsertTaskDialogComponent, {
      ...DIALOG_OPTIONS,
      width: '55vw',
      scrollStrategy: this.scrollStrategy.block(),
      data: {
        taskType,
      },
    });

    dialogRef.closed.subscribe({
      next: (task) => {
        if (task) {
          this.toast.showToast(
            'Success',
            `${this.stringUtil.toTitleCase(taskType)} Task has been created`,
            UI_STATE.Success,
          );
          service.retry$.next();
        }
      },
      error: ({ error }) => {
        this.toast.showToast(
          'Error: ' + error.code,
          error.message,
          UI_STATE.Error,
        );
      },
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
