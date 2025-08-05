import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, input } from '@angular/core';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { DialogOptions } from '@core/constants';
import { Task } from '@core/models/task.model';
import { UpsertTaskModalComponent } from '@features/portal/components/upsert-task-modal/upsert-task-modal.component';
import { TaskItemComponent } from '../task-item/task-item.component';

export interface TaskListFilter {
  title: string;
}

export interface TaskListProps {
  header: string;
  filters?: TaskListFilter[];
}

@Component({
  selector: 'app-task-list',
  imports: [TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent extends ThemeAwareComponent {
  private readonly _dialog = inject(Dialog);

  readonly tasks = input.required<Task[]>();
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

  //eslint-disable-next-line
  openTaskModal(task?: Task) {
    const dialog = this._dialog.open(UpsertTaskModalComponent, {
      ...DialogOptions,
      data: {
        props: 'panda',
      },
    });

    dialog.closed.subscribe({
      next: (value) => {
        console.log(value);
      },
    });
  }
}
