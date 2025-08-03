import { inject } from '@angular/core';
import { ThemeService } from '@shared/services/theme/theme.service';

export abstract class ThemeAwareComponent {
  protected themeService = inject(ThemeService);
  theme = this.themeService.theme;
  setTheme = (theme: 'light' | 'dark') => this.themeService.setTheme(theme);
}
