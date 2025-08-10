import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, input } from '@angular/core';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { DialogOptions } from '@core/constants';
import { Task, TaskTyping } from '@core/models/task.model';
import { NgIcon } from '@ng-icons/core';
import { BaseDialogData } from '@shared/components/dialog';
import { TaskItemComponent } from '../task-item/task-item.component';
import { UpsertTaskModalComponent } from '../upsert-task-modal/upsert-task-modal.component';

export interface TaskListFilter {
  title: string;
}

export interface TaskListProps {
  header: string;
  filters?: TaskListFilter[];
  dialogProps?: BaseDialogData;
}

@Component({
  selector: 'app-task-list',
  imports: [TaskItemComponent, NgIcon],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent extends ThemeAwareComponent {
  private readonly _dialog = inject(Dialog);

  readonly tasks = input.required<Task[]>();
  readonly taskType = input.required<TaskTyping>();
  readonly props = input<TaskListProps>();

  tempStatusBadgeConfig = {
    Active:
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-emerald-500',
    Cancelled:
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-rose-500',
    Completed:
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-sky-500',
    Paused:
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-amber-500',
  };

  openTaskModal(task?: Task) {
    const dialogProps = this.props()?.dialogProps ?? {};
    const dialog = this._dialog.open(UpsertTaskModalComponent, {
      ...DialogOptions,
      data: {
        task,
        taskType: this.taskType(),
        ...dialogProps,
      },
    });

    dialog.closed.subscribe({});
  }
}
