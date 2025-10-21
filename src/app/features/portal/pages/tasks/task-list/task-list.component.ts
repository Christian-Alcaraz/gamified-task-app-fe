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
import { User } from '@core/models';
import { Task, TaskTyping } from '@core/models/task.model';
import { UpsertTaskDialogComponent } from '@features/portal/pages/tasks/upsert-task-dialog/upsert-task-dialog.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { BaseDialogData } from '@shared/components/dialog';
import { ToastService } from '@shared/components/toast/toast.service';
import { TaskApiService } from '@shared/services/api/task/task.api.service';
import { TasksState } from '@shared/services/state/task.state.service';
import { UserStateService } from '@shared/services/state/user.state.service';
import { UtilService } from '@shared/services/util/util.service';
import { TaskItemComponent } from '../task-item/task-item.component';

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
  //Todo: Instead of tasks.component handles the taskStateService, make state service DI component level
  private readonly dialog = inject(Dialog);
  private readonly userStateService = inject(UserStateService);
  private readonly taskApiService = inject(TaskApiService);
  private readonly characterUtil = inject(UtilService).character;
  private readonly toast = inject(ToastService);

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
    const dialog = this.dialog.open(UpsertTaskDialogComponent, {
      ...DialogOptions,
      data: {
        task,
        taskType: this.taskType(),
        ...dialogProps,
      },
    });

    const header = task ? 'Updated' : 'Created';
    const message = task ? 'Task has been updated.' : 'Task has been created.';

    dialog.closed.subscribe({
      next: (task) => {
        if (!task) return;
        this.toast.showToast(header, message, 'success');
        this.listChanged.emit();
      },
    });
  }

  updateTaskCompletion(task: Task, completed: boolean) {
    console.assert(!!task._id, 'task._id must be provided');
    if (!task._id) {
      this.toast.showToast(
        'Error',
        'Task ID is required to update task completion',
        'error',
      );
      return;
    }

    const taskId = task._id;
    this.taskApiService.putTaskCompletion(taskId, completed).subscribe({
      next: (updatedUser) => {
        if (!updatedUser) return;

        const reward = this.characterUtil.getGoldExpDifference(
          this.userStateService.userState() as User,
          updatedUser,
        );

        const header = completed ? 'Well Done!' : "It's okay.";
        const message = completed
          ? `+${reward.gold} Gold +${reward.experience} Exp`
          : `${reward.gold} Gold ${reward.experience} Exp`;
        const type = completed ? 'success' : 'error';

        this.toast.showToast(header, message, type);
        this.userStateService.setUserState(updatedUser);
        this.listChanged.emit();
      },
      error: ({ error }) => {
        this.toast.showToast('Error: ' + error.code, error.message, 'error');
      },
    });
  }
}
