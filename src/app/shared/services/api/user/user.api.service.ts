import { inject, Injectable } from '@angular/core';
import { User, UserCharacter } from '@core/models';
import { HttpService } from '@shared/services/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly httpService = inject(HttpService);
  private readonly url = '/users';

  //*** Character APIs ***/
  private readonly characterUrl = '/character';

  isCharacterNameTaken(name: string) {
    return this.httpService.start<boolean>(
      'post',
      `${this.url}${this.characterUrl}/verify-name`,
      { name },
    );
  }

  patchCreateCharacter(character: UserCharacter) {
    return this.httpService.start<User>(
      'patch',
      `${this.url}${this.characterUrl}/create`,
      { character },
    );
  }

  updateUserCharacter(character: UserCharacter) {
    return this.httpService.start<User>(
      'put',
      `${this.url}${this.characterUrl}`,
      { character },
    );
  }
}
