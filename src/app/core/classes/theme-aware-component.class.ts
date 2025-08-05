import { inject } from '@angular/core';
import { ThemeService } from '@shared/services/theme/theme.service';

//eslint-disable-next-line
export type Constructor<T = {}> = abstract new (...args: any[]) => T;
export abstract class ThemeAwareComponent {
  protected themeService = inject(ThemeService);
  theme = this.themeService.theme;
}

export function ThemeAwareMixin<TBase extends Constructor>(Base: TBase) {
  abstract class ThemeAware extends Base {
    protected themeService = inject(ThemeService);
    theme = this.themeService.theme;
  }

  return ThemeAware;
}
