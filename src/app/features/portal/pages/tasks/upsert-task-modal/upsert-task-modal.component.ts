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
      subtaskIds: [''],
      status: [''],
      userLimit: [1],
      userIds: [''],
      difficulty: ['', Validators.required],
      deadlineDate: [''],
      frequency: [''],
      // stat: ['', Validators.required],
    });

    if (this.data.task?.type === TaskType.Dailies) {
      this.taskForm.get('frequency')?.setValidators(Validators.required);
      this.taskForm.updateValueAndValidity();
    }

    if (this.data.task?.type === TaskType.Todo) {
      this.taskForm.get('deadlineDate')?.setValidators(Validators.required);
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
    this.taskForm.markAllAsTouched();
    this.taskForm.markAllAsDirty();
    this.taskForm.updateValueAndValidity();
    this.inputService.triggerManualValidation();

    if (this.taskForm.valid) {
      this.closeDialog();
    }
  }
}
