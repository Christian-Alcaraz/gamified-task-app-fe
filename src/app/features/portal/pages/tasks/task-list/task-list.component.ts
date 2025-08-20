import { Dialog } from '@angular/cdk/dialog';
import { TitleCasePipe } from '@angular/common';
import { Component, inject, input, model, output } from '@angular/core';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { DialogOptions } from '@core/constants';
import { Task, TaskTyping } from '@core/models/task.model';
import { BaseDialogData } from '@shared/components/dialog';
import { TaskApiService } from '@shared/services/api/task/task.api.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { formatTaskRequestBody } from '../tasks.util';
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
  imports: [TaskItemComponent, TitleCasePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent extends ThemeAwareComponent {
  private readonly _dialog = inject(Dialog);
  private readonly _taskApiService = inject(TaskApiService);

  readonly listChange = output();

  readonly tasks = model.required<Task[]>();
  readonly taskType = input.required<TaskTyping>();
  readonly props = input<TaskListProps>();

  tempStatusBadgeConfig = {
    active:
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-emerald-500',
    cancelled:
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-rose-500',
    completed:
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-sky-500',
    paused:
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

    dialog.closed.subscribe({
      next: (task) => {
        if (task) {
          console.log('called api method so refresh the list');
          this.listChange.emit();
        }
      },
    });
  }

  updateTaskCompletion(task: Task, completed: boolean, index: number) {
    console.assert(!!task._id, 'task._id must be provided');

    const body = formatTaskRequestBody({ ...task, completed });
    this._taskApiService.updateTask(body, task._id!).subscribe({
      next: (updatedTask) => {
        if (updatedTask) {
          this.tasks.update((tasks) => {
            tasks[index] = updatedTask;
            return tasks;
          });
        }
      },
      error: (error) => {
        console.error('Error updating task:', error);
      },
    });
  }
}
