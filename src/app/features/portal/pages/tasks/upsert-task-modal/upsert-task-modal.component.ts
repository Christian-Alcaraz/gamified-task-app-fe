import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task, TaskTypes } from '@core/models/task.model';
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
  SelectFieldComponent,
  TextFieldComponent,
} from '@shared/components/inputs';

export interface TaskDialogData extends BaseDialogData {
  task?: Task;
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

  taskForm!: FormGroup;

  taskTypes = TaskTypes;

  /**
   * Todo: Add Select Field for Difficulty
   * Todo: Add Number +- for User Limit; with Max Limit | Min Limit
   */

  constructor() {
    super();

    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      subtaskIds: ['', Validators.required],
      status: ['', Validators.required],
      userLimit: [1, Validators.required],
      userIds: [''],
      // deadlineDatetime: ['', Validators.required],
      // difficulty: ['', Validators.required],
      // stat: ['', Validators.required],
    });

    if (this.data.task) {
      this.taskForm.patchValue(this.data.task);
    }
  }
}
