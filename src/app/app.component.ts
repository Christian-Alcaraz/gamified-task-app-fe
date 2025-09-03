import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { Const } from '@core/constants';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
