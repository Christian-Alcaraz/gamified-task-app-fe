import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { Const } from '@core/constants';
import { provideIcons } from '@ng-icons/core';
import * as heroIconsMicro from '@ng-icons/heroicons/micro';
import * as heroIconsMini from '@ng-icons/heroicons/mini';
import * as heroIconsOutline from '@ng-icons/heroicons/outline';
import * as heroIconsSolid from '@ng-icons/heroicons/solid';
import * as iconSaxBold from '@ng-icons/iconsax/bold';
import * as iconSaxBulk from '@ng-icons/iconsax/bulk';
import * as iconSaxOutline from '@ng-icons/iconsax/outline';

const compiledIcons = {
  ...iconSaxBold,
  ...iconSaxOutline,
  ...iconSaxBulk,
  ...heroIconsMicro,
  ...heroIconsMini,
  ...heroIconsOutline,
  ...heroIconsSolid,
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  viewProviders: [provideIcons(compiledIcons)],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App extends ThemeAwareComponent {
  protected readonly title = signal('gamified-task-app');

  constructor() {
    super();
    const themeSavedOption = localStorage[Const.AppTheme] ?? 'dark';
    this.setTheme(themeSavedOption);
  }

  setTheme = (theme: 'light' | 'dark') => this.themeService.setTheme(theme);
}
