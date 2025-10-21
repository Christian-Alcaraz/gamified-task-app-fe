import { Injectable } from '@angular/core';
import { User } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  getGoldExpDifference(oldUserData: User, newUserData: User) {
    const oldGold = oldUserData.stats?.gold ?? 0;
    const newGold = newUserData.stats?.gold ?? 0;

    const oldExp = oldUserData.stats?.experience ?? 0;
    const newExp = newUserData.stats?.experience ?? 0;

    return {
      gold: newGold - oldGold,
      experience: newExp - oldExp,
    };
  }
}
