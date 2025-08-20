import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { DialogOptions } from '@core/constants';
import { TaskType, TaskTyping } from '@core/models/task.model';
import { NgIcon } from '@ng-icons/core';
import { TextFieldComponent } from '@shared/components/inputs';
import {
  MenuComponent,
  MenuItem,
} from '@shared/components/menu/menu.component';
import {
  DailiesTaskStateFactory,
  DailiesTaskStateInstance,
  TaskStateService,
  TodoTaskStateFactory,
  TodoTaskStateInstance,
} from '@shared/services/state/task.state.service';
import { UserStateService } from '@shared/services/state/user.state.service';
import { NgpButton } from 'ng-primitives/button';
import { NgpMenuTrigger } from 'ng-primitives/menu';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { TaskListComponent } from './task-list/task-list.component';
import { UpsertTaskModalComponent } from './upsert-task-modal/upsert-task-modal.component';

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
  private readonly _userStateService = inject(UserStateService);
  private readonly _dialog = inject(Dialog);

  readonly dailiesStateService = inject(DailiesTaskStateInstance);
  readonly todoStateService = inject(TodoTaskStateInstance);

  readonly user = this._userStateService.userState();
  readonly taskType = TaskType;

  readonly searchTaskForm = new FormGroup({
    text: new FormControl(''),
  });

  private readonly destroyed$ = new Subject<void>();

  get searchTextControl() {
    return this.searchTaskForm.get('text');
  }

  menuItems: MenuItem[] = [
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

  promptAction(action: string) {
    const type = action === 'add_dailies' ? TaskType.Dailies : TaskType.Todo;
    this._openUpsertTaskDialog(type);
  }

  private _openUpsertTaskDialog(taskType: TaskTyping) {
    const service =
      taskType === TaskType.Dailies
        ? this.dailiesStateService
        : this.todoStateService;

    const dialogRef = this._dialog.open(UpsertTaskModalComponent, {
      ...DialogOptions,
      data: {
        taskType,
      },
    });

    dialogRef.closed.subscribe({
      next: (task) => {
        if (task) {
          service.retry$.next();
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
