import { Injectable, signal } from '@angular/core';
import { User } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private _userState = signal<User | null>(null);
  readonly userState = this._userState.asReadonly();

  setUserState(newState: User) {
    this._userState.update((state) => ({ ...state, ...newState }));
  }

  clearUserState() {
    this._userState.set(null);
  }
}
