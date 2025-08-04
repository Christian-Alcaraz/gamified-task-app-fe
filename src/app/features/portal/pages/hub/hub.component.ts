import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { Task } from '@core/models/task.model';
import { StatBarComponent } from '@features/portal/components/stat-bar/stat-bar.component';
import { UpsertTaskModalComponent } from '@features/portal/components/upsert-task-modal/upsert-task-modal.component';
import { NgIcon } from '@ng-icons/core';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { BadgeDirective } from '@shared/directives';
import {
  StatKey,
  UserState,
  UserStateService,
} from '@shared/services/state/user-state.service';
import { sampleTasks } from './hub.config';

@Component({
  selector: 'app-hub',
  imports: [
    StatBarComponent,
    DialogModule,
    BadgeComponent,
    BadgeDirective,
    NgIcon,
  ],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
})
export class HubComponent extends ThemeAwareComponent {
  private readonly userStateService = inject(UserStateService);
  private readonly dialog = inject(Dialog);

  readonly userState = this.userStateService.userState;

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
    this.userStateService.setUserState(this.tempUserState);
  }

  increaseStat = (stat: StatKey, amount: number) =>
    this.userStateService.increaseStat(stat, amount);

  decreaseStat = (stat: StatKey, amount: number) =>
    this.userStateService.decreaseStat(stat, amount);

  openTaskModal(task?: Task) {
    this.dialog.open(UpsertTaskModalComponent, {
      minWidth: '55vw',
      maxWidth: '55vw',
      autoFocus: 'false',
      data: {
        animal: 'panda',
      },
    });

    console.log(task);
  }
}
