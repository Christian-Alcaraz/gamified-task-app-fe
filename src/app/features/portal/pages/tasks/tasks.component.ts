import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { Task } from '@core/models/task.model';
import { StatBarComponent } from '@features/portal/components/stat-bar/stat-bar.component';
import {
  StatKey,
  UserState,
  UserStateService,
} from '@shared/services/state/user-state.service';
import { TaskListComponent } from './task-list/task-list.component';
import { sampleTasks } from './tasks.config';

@Component({
  selector: 'app-tasks',
  imports: [StatBarComponent, DialogModule, TaskListComponent],
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
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-emerald-500',
    Cancelled:
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-rose-500',
    Completed:
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-sky-500',
    Paused:
      'block border text-xs px-2 py-1 rounded-sm w-fit shadow-sm text-foreground bg-amber-500',
  };

  constructor() {
    super();
    this._userStateService.setUserState(this.tempUserState);
  }

  toggleTheme() {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.themeService.setTheme(newTheme);
  }

  increaseStat = (stat: StatKey, amount: number) =>
    this._userStateService.increaseStat(stat, amount);

  decreaseStat = (stat: StatKey, amount: number) =>
    this._userStateService.decreaseStat(stat, amount);
}
