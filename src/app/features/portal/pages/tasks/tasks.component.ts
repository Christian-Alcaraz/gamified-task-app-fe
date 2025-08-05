import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { Task } from '@core/models/task.model';
import { StatBarComponent } from '@features/portal/components/stat-bar/stat-bar.component';
import { UpsertTaskModalComponent } from '@features/portal/components/upsert-task-modal/upsert-task-modal.component';
import { NgIcon } from '@ng-icons/core';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import {
  StatKey,
  UserState,
  UserStateService,
} from '@shared/services/state/user-state.service';
import { sampleTasks } from '../hub/hub.config';

@Component({
  selector: 'app-tasks',
  imports: [StatBarComponent, DialogModule, BadgeComponent, NgIcon],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent extends ThemeAwareComponent {
  private readonly _userStateService = inject(UserStateService);
  private readonly _dialog = inject(Dialog);

  readonly userState = this._userStateService.userState;

  tempUserState: UserState = {
    hpCurrent: 98,
    hpTotal: 100,
    manaCurrent: 59,
    manaTotal: 100,
  };

  tempTaskList: Task[] = sampleTasks;

  tempStatusBadgeConfig = {
    Active:
      'block text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-emerald-500',
    Cancelled:
      'block text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-rose-500',
    Completed:
      'block text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-sky-500',
    Paused:
      'block text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-amber-500',
  };

  constructor() {
    super();
    this._userStateService.setUserState(this.tempUserState);
  }

  increaseStat = (stat: StatKey, amount: number) =>
    this._userStateService.increaseStat(stat, amount);

  decreaseStat = (stat: StatKey, amount: number) =>
    this._userStateService.decreaseStat(stat, amount);

  //eslint-disable-next-line
  openTaskModal(task?: Task) {
    const dialog = this._dialog.open(UpsertTaskModalComponent, {
      autoFocus: 'false',
      hasBackdrop: true,
      backdropClass: 'bg-neutral-950/75',
      disableClose: false,
      data: {
        props: 'panda',
        position: 'right',
      },
    });

    dialog.closed.subscribe({
      next: (value) => {
        console.log(value);
      },
    });
  }
}
