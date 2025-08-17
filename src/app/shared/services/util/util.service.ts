import { inject, Injectable } from '@angular/core';
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
}
