import { Injectable, signal } from '@angular/core';
import { APP_THEME } from '@core/constants';

type AppThemeType = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _theme = signal<AppThemeType>('light');
  readonly theme = this._theme.asReadonly();

  setTheme(theme: AppThemeType) {
    this._theme.set(theme);

    if (theme !== localStorage.getItem(APP_THEME)) {
      localStorage.setItem(APP_THEME, theme);
    }
  }
}
