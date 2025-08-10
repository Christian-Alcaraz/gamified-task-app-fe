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
  TaskStatuses,
  TaskTypes,
  TaskTyping,
} from '@core/models/task.model';
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
    TitleCasePipe,
  ],
  providers: [provideBaseDialogToken(UpsertTaskModalComponent)],
  templateUrl: './upsert-task-modal.component.html',
  styleUrl: './upsert-task-modal.component.scss',
})
export class UpsertTaskModalComponent extends BaseDialog<TaskDialogData> {
  private readonly formBuilder = inject(FormBuilder);
  private readonly inputService = inject(InputService);

  taskForm!: FormGroup;
  taskTypes = TaskTypes;
  taskStatuses = TaskStatuses;

  /**
   * Todo: Add Select Field for Difficulty
   * Todo: Add Number +- for User Limit; with Max Limit | Min Limit
   */

  constructor() {
    super();

    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      type: [this.data.taskType ?? '', Validators.required],
      subtaskIds: [''],
      status: [''],
      userLimit: [1],
      userIds: [''],
      // deadlineDatetime: ['', Validators.required],
      // difficulty: ['', Validators.required],
      // stat: ['', Validators.required],
    });

    if (this.data.task) {
      const statusControl = this.taskForm.get('status') as FormControl;
      statusControl.addValidators(Validators.required);
      this.taskForm.patchValue(this.data.task, { emitEvent: false });
      this.taskForm.updateValueAndValidity();
    }
  }

  submit() {
    if (this.taskForm.valid && this.taskForm.dirty) {
      this.closeDialog();
    }
  }
}
