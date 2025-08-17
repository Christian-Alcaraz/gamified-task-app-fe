import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import {
  StatKey,
  UserState,
  UserStateService,
} from '@shared/services/state/user.state.service';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-portal',
  imports: [RouterOutlet, HeaderComponent],
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

  private readonly _userStateService = inject(UserStateService);
  readonly userState = this._userStateService.userState;

  constructor() {
    super();
    this._userStateService.setUserState(this.tempUserState);
  }

  increaseStat = (stat: StatKey, amount: number) =>
    this._userStateService.increaseStat(stat, amount);

  decreaseStat = (stat: StatKey, amount: number) =>
    this._userStateService.decreaseStat(stat, amount);
}
