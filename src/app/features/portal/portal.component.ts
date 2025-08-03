import { Component, inject } from '@angular/core';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import {
  StatKey,
  UserState,
  UserStateService,
} from '@shared/services/state/user-state.service';
import { StatBarComponent } from './components/stat-bar/stat-bar.component';

@Component({
  selector: 'app-portal',
  imports: [StatBarComponent],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
})
export class PortalComponent extends ThemeAwareComponent {
  tempUserState: UserState = {
    hpCurrent: 98,
    hpTotal: 100,
    manaCurrent: 59,
    manaTotal: 100,
  };

  private readonly userStateService = inject(UserStateService);
  readonly userState = this.userStateService.userState;

  constructor() {
    super();
    this.userStateService.setUserState(this.tempUserState);
  }

  increaseStat = (stat: StatKey, amount: number) =>
    this.userStateService.increaseStat(stat, amount);

  decreaseStat = (stat: StatKey, amount: number) =>
    this.userStateService.decreaseStat(stat, amount);
}
