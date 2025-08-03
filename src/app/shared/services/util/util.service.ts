import { inject, Injectable } from '@angular/core';
import { CookieService } from './cookie.service';
import { StringService } from './string.service';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  public cookie = inject(CookieService);
  public string = inject(StringService);
}
