import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { TaskType } from '@core/models/task.model';
import { StatBarComponent } from '@features/portal/components/stat-bar/stat-bar.component';
import {
  DailiesTaskStateFactory,
  DailiesTaskStateInstance,
  TaskStateService,
  TodoTaskStateFactory,
  TodoTaskStateInstance,
} from '@shared/services/state/task.state.service';
import {
  StatKey,
  UserState,
  UserStateService,
} from '@shared/services/state/user.state.service';
import { TaskListComponent } from './task-list/task-list.component';

@Component({
  selector: 'app-tasks',
  imports: [StatBarComponent, DialogModule, TaskListComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  providers: [
    {
      provide: DailiesTaskStateInstance,
      useFactory: DailiesTaskStateFactory,
    },
    {
      provide: TodoTaskStateInstance,
      useFactory: TodoTaskStateFactory,
    },
  ],
})
export class TasksComponent extends ThemeAwareComponent {
  private readonly _userStateService = inject(UserStateService);

  readonly dailiesStateService = inject(DailiesTaskStateInstance);
  readonly todoStateService = inject(TodoTaskStateInstance);

  readonly user = this._userStateService.userState();
  readonly taskType = TaskType;

  tempUserState: UserState = {
    hpCurrent: 98,
    hpTotal: 100,
    manaCurrent: 59,
    manaTotal: 100,
  };

  constructor() {
    super();
    this._userStateService.setUserState(this.tempUserState);
  }

  refreshList(service: TaskStateService) {
    service.retry$.next();
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
