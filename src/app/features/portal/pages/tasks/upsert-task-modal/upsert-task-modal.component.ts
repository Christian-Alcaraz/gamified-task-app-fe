import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '@core/models/task.model';
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
import { TextFieldComponent } from '@shared/components/inputs';

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
  ],
  templateUrl: './upsert-task-modal.component.html',
  styleUrl: './upsert-task-modal.component.scss',
})
export class UpsertTaskModalComponent extends BaseDialog<TaskDialogData> {
  private readonly formBuilder = inject(FormBuilder);

  public taskForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    type: ['', Validators.required],
    subtaskIds: [''],
    status: ['', Validators.required],
    userLimit: ['', Validators.required],
    userIds: [''],
    deadlineDatetime: [''],
    difficulty: ['', Validators.required],
    stat: [''],
  });
}
