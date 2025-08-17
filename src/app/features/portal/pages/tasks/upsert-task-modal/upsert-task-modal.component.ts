import { ScrollingModule } from '@angular/cdk/scrolling';
import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Task,
  TaskDifficulties,
  TaskFrequencies,
  TaskStatus,
  TaskStatuses,
  TaskType,
  TaskTypes,
  TaskTyping,
} from '@core/models/task.model';
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
import { TaskApiService } from '@shared/services/api/task/task.api.service';

export interface TaskDialogData extends BaseDialogData {
  task?: Task;
  taskType?: TaskTyping;
}

@Component({
  selector: 'app-upsert-task-modal',
  imports: [
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
  ],
  providers: [provideBaseDialogToken(UpsertTaskModalComponent)],
  templateUrl: './upsert-task-modal.component.html',
  styleUrl: './upsert-task-modal.component.scss',
})
export class UpsertTaskModalComponent extends BaseDialog<TaskDialogData> {
  private readonly formBuilder = inject(FormBuilder);
  private readonly inputService = inject(InputService);
  private readonly taskApiService = inject(TaskApiService);

  taskForm!: FormGroup;
  taskType = TaskType;
  types = TaskTypes;
  statuses = TaskStatuses;
  difficulties = TaskDifficulties;
  frequncies = TaskFrequencies;

  /**
   * Todo: Add Number +- for User Limit; with Max Limit | Min Limit
   */

  constructor() {
    super();

    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      type: [this.data.taskType ?? '', Validators.required],
      status: [TaskStatus.Active],
      difficulty: ['', Validators.required],
      deadlineDate: [''],
      frequency: [''],
      // subtaskIds: [''],
      // userLimit: [1],
      // userIds: [''],
      // stat: ['', Validators.required],
    });

    if (this.data.task?.type === TaskType.Dailies) {
      this.taskForm.get('frequency')?.setValidators(Validators.required);
      this.taskForm.updateValueAndValidity();
    }

    if (this.data.task) {
      const statusControl = this.taskForm.get('status') as FormControl;
      statusControl.setValidators(Validators.required);
      this.taskForm.patchValue(this.data.task, { emitEvent: false });
      this.taskForm.updateValueAndValidity();
    }
  }

  submit() {
    this._updateStateToDirty();
    if (this.taskForm.invalid) return;

    const task = this._formatTaskRequestBody(this.taskForm.getRawValue());

    if (this.data.task) {
      this._updateTask(task);
    } else {
      this._createTask(task);
    }
  }

  private _updateStateToDirty() {
    this.taskForm.markAllAsTouched();
    this.taskForm.markAllAsDirty();
    this.taskForm.updateValueAndValidity();
    this.inputService.triggerManualValidation();
  }

  private _formatTaskRequestBody(task: Task) {
    const body = task;

    if (task.type === TaskType.Dailies) {
      delete body.deadlineDate;
    } else {
      delete body.frequency;
    }

    return body;
  }

  private _createTask(task: Task) {
    this.taskApiService.createTask(task).subscribe({
      next: (createdTask) => {
        this.closeDialog(createdTask);
      },
      error: (error) => {
        console.error('Error creating task:', error);
      },
    });
  }

  private _updateTask(task: Task) {
    if (!this.data.task) return;

    const taskId = this.data.task!._id as string;

    this.taskApiService.updateTask(task, taskId).subscribe({
      next: (updatedTask) => {
        this.closeDialog(updatedTask);
      },
      error: (error) => {
        console.error('Error updating task:', error);
      },
    });
  }
}
