import { Injectable, signal } from '@angular/core';

// Todo: Transfer these to core folder
export const StatDictionary = {
  hp: {
    current: 'hpCurrent',
    total: 'hpTotal',
  },
  mana: {
    current: 'manaCurrent',
    total: 'manaTotal',
  },
};

export type StatKey = 'hp' | 'mana';

export interface UserState {
  hpCurrent: number;
  hpTotal: number;
  manaCurrent: number;
  manaTotal: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private _userState = signal<UserState | null>(null);
  readonly userState = this._userState.asReadonly();

  setUserState(newState: UserState) {
    this._userState.update((state) => ({ ...state, ...newState }));
  }

  clearUserState() {
    this._userState.set(null);
  }

  increaseStat(stat: StatKey, amount: number) {
    const pointerCurrent = StatDictionary[stat].current;
    const pointerTotal = StatDictionary[stat].total;

    this._userState.update(
      //eslint-disable-next-line
      (user: any) =>
        ({
          ...user,
          [pointerCurrent]: Math.min(
            user[pointerCurrent]! + amount,
            user[pointerTotal]!,
          ),
        }) as UserState,
    );
  }

  decreaseStat(stat: StatKey, amount: number) {
    const pointerCurrent = StatDictionary[stat].current;

    this._userState.update(
      //eslint-disable-next-line
      (user: any) =>
        ({
          ...user,
          [pointerCurrent]: Math.max(user[pointerCurrent]! - amount, 0),
        }) as UserState,
    );
  }
}
