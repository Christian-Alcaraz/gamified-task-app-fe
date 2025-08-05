import { Component } from '@angular/core';
import { BaseDialog, BaseDialogData } from '@core/classes/base-dialog.class';
import { Task } from '@core/models/task.model';

export interface TaskDialogData extends BaseDialogData {
  task?: Task;
}

@Component({
  selector: 'app-upsert-task-modal',
  imports: [],
  templateUrl: './upsert-task-modal.component.html',
  styleUrl: './upsert-task-modal.component.scss',
})
export class UpsertTaskModalComponent extends BaseDialog<TaskDialogData> {}
