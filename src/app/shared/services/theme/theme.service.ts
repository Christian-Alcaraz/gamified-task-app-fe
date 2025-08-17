import { Injectable, signal } from '@angular/core';
import { Const } from '@core/constants';

type AppThemeType = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _theme = signal<AppThemeType>('light');
  readonly theme = this._theme.asReadonly();

  setTheme(theme: AppThemeType) {
    this._theme.set(theme);

    if (theme !== localStorage.getItem(Const.AppTheme)) {
      localStorage.setItem(Const.AppTheme, theme);
    }
  }
}
