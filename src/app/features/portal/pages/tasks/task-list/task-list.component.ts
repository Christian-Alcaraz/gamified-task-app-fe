import { Dialog } from '@angular/cdk/dialog';
import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { DialogOptions } from '@core/constants';
import { Task, TaskTyping } from '@core/models/task.model';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { BaseDialogData } from '@shared/components/dialog';
import { TaskApiService } from '@shared/services/api/task/task.api.service';
import { TasksState } from '@shared/services/state/task.state.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { formatTaskRequestBody } from '../tasks.util';
import { UpsertTaskModalComponent } from '../upsert-task-modal/upsert-task-modal.component';

export interface TaskListQueryFilter {
  completed?: boolean;
  deadlineDate?: 'exists';
  type?: TaskTyping;
}
export interface TaskListFilter {
  label: string;
  query: TaskListQueryFilter | null | undefined;
}

export interface TaskListProps {
  header: string;
  filters?: TaskListFilter[];
  dialogProps?: BaseDialogData;
}

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskItemComponent, TitleCasePipe, BadgeComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent extends ThemeAwareComponent {
  private readonly _dialog = inject(Dialog);
  private readonly _taskApiService = inject(TaskApiService);

  readonly listChanged = output();
  readonly refreshRequested = output();
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly queryChanged = output<Record<string, any>>();

  readonly tasks = model.required<Task[]>();
  readonly state = input.required<TasksState>();
  readonly taskType = input.required<TaskTyping>();
  readonly props = input<TaskListProps>();

  tempStatusBadgeConfig = {
    trivial:
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-lime-500',
    easy: 'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-emerald-500',
    medium:
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-amber-500',
    hard: 'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-rose-500',
  };

  selectedFilter = 0;

  filters = computed(() => {
    return this.props()?.filters ?? [];
  });

  selectFilter(filter: TaskListFilter, index: number) {
    this.selectedFilter = index;
    this.queryChanged.emit(filter.query!);
  }

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
          this.listChanged.emit();
        }
      },
    });
  }

  updateTaskCompletion(task: Task, completed: boolean) {
    console.assert(!!task._id, 'task._id must be provided');

    const body = formatTaskRequestBody({ ...task, completed });
    this._taskApiService.updateTask(body, task._id!).subscribe({
      next: (updatedTask) => {
        if (updatedTask) {
          this.listChanged.emit();
        }
      },
      error: (error) => {
        console.error('Error updating task:', error);
      },
    });
  }
}
