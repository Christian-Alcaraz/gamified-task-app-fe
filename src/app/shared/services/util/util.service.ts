import { inject, Injectable } from '@angular/core';
import { CharacterService } from './character.service';
import { CookieService } from './cookie.service';
import { DateService } from './date.service';
import { StringService } from './string.service';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  public cookie = inject(CookieService);
  public string = inject(StringService);
  public date = inject(DateService);
  public character = inject(CharacterService);
}
