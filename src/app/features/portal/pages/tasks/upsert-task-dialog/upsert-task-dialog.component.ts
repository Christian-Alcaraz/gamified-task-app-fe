import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Task,
  TaskDifficulties,
  TaskFrequencies,
  TaskStatuses,
  TaskType,
  TaskTypes,
  TaskTyping,
} from '@core/models/task.model';
import { formatTaskRequestBody } from '@features/portal/pages/tasks/tasks.util';
import { NgIcon } from '@ng-icons/core';
import { DatePickerComponent } from '@shared/components/date-picker/date-picker-wrapper.component';
import {
  DialogActionsDirective,
  DialogContentDirective,
  DialogTitleDirective,
} from '@shared/components/dialog';
import {
  BaseDialog,
  BaseDialogData,
} from '@shared/components/dialog/base-dialog.class';
import { DialogCloseButtonComponent } from '@shared/components/dialog/dialog-close-button.component';
import { provideBaseDialogToken } from '@shared/components/dialog/dialog.provider';
import {
  InputService,
  SelectFieldComponent,
  TextFieldComponent,
} from '@shared/components/inputs';
import { ToastService } from '@shared/components/toast/toast.service';
import { TaskApiService } from '@shared/services/api/task/task.api.service';
import { finalize, Observable } from 'rxjs';

export interface TaskDialogData extends BaseDialogData {
  task?: Task;
  taskType?: TaskTyping;
}

@Component({
  selector: 'app-upsert-task-dialog',
  imports: [
    CommonModule,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    DialogCloseButtonComponent,
    ReactiveFormsModule,
    TextFieldComponent,
    SelectFieldComponent,
    DatePickerComponent,
    TitleCasePipe,
    ScrollingModule,
    NgIcon,
  ],
  providers: [provideBaseDialogToken(UpsertTaskDialogComponent)],
  templateUrl: './upsert-task-dialog.component.html',
  styleUrl: './upsert-task-dialog.component.scss',
})
export class UpsertTaskDialogComponent extends BaseDialog<TaskDialogData> {
  private readonly formBuilder = inject(FormBuilder);
  private readonly inputService = inject(InputService);
  private readonly taskApiService = inject(TaskApiService);
  private readonly toast = inject(ToastService);

  taskForm!: FormGroup;
  taskType = TaskType;
  types = TaskTypes;
  statuses = TaskStatuses;
  difficulties = TaskDifficulties;
  frequencies = TaskFrequencies;
  loading = signal(false);
  /**
   * Todo: Add Number +- for User Limit; with Max Limit | Min Limit
   */

  constructor() {
    super();

    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      type: [this.data.taskType ?? '', Validators.required],
      difficulty: ['', Validators.required],
      completed: [false],
      deadlineDate: [''],
      frequency: [''],
    });

    if (this.data.task?.type === TaskType.Dailies) {
      this.taskForm.get('frequency')?.setValidators(Validators.required);
      this.taskForm.updateValueAndValidity();
    }

    if (this.data.task) {
      let task = JSON.parse(JSON.stringify(this.data.task));
      task = {
        ...task,
        ...(task.deadlineDate
          ? { deadlineDate: new Date(task.deadlineDate) }
          : {}),
      };

      this.taskForm.patchValue(task, { emitEvent: false });
      this.taskForm.updateValueAndValidity();
    }
  }

  submit() {
    this._updateStateToDirty();
    if (this.taskForm.invalid) {
      this.toast.showToast(
        'Error',
        'Please fill out all required fields.',
        'error',
      );
      return;
    }

    if (this.data.task && this._isTaskSame()) {
      this.closeDialog();
      return;
    }

    const task = formatTaskRequestBody(this.taskForm.getRawValue());
    this.loading.update(() => true);
    try {
      const apiService = this.data.task
        ? this._updateTask(task)
        : this._createTask(task);

      apiService
        .pipe(finalize(() => this.loading.update(() => false)))
        .subscribe({
          next: (createdTask) => {
            this.loading.update(() => false);
            this.closeDialog(createdTask);
          },
          error: ({ error }) => {
            this.toast.showToast(
              'Error: ' + error.code,
              error.message,
              'error',
            );
          },
        });
    } catch (error) {
      console.error('Error', error);
      this.toast.showToast(
        'Error',
        'Check console for details. And contact your system administrator.',
        'error',
      );
    }
  }

  override closeDialog(data?: Task | undefined): void {
    if (this.loading()) return;
    super.closeDialog(data);
  }

  private _isTaskSame() {
    if (!this.data.task) return false;

    const task = formatTaskRequestBody(this.taskForm.getRawValue());
    const injectedTask = formatTaskRequestBody(
      JSON.parse(JSON.stringify(this.data.task)),
    );

    return Object.entries(task).every(
      ([key, value]) => injectedTask[key] === value,
    );
  }

  private _updateStateToDirty() {
    this.taskForm.markAllAsTouched();
    this.taskForm.markAllAsDirty();
    this.taskForm.updateValueAndValidity();
    this.inputService.triggerManualValidation();
  }

  private _createTask(task: Task): Observable<Task> {
    return this.taskApiService.createTask(task);
  }

  private _updateTask(task: Task): Observable<Task> {
    if (!this.data.task) {
      throw new Error('Task is required to update task');
    }

    const taskId = this.data.task!._id as string;
    return this.taskApiService.updateTask(task, taskId);
  }
}
