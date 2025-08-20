import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { StatBarComponent } from '../stat-bar/stat-bar.component';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    TitleCasePipe,
    RouterLink,
    RouterLinkActive,
    StatBarComponent,
  ],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    class: 'flex flex-col justify-center w-[inherit]',
  },
})
export class HeaderComponent extends ThemeAwareComponent {
  readonly navItems = [
    {
      label: 'Tasks',
      route: '/hub/tasks',
    },
    {
      label: 'Party',
      route: '/hub/party',
    },
  ];

  selectedNavItem: Record<string, string> = this.navItems[0];
  private readonly router = inject(Router);

  selectNav(navItem: Record<string, string>) {
    this.selectedNavItem = navItem;
  }

  toggleTheme() {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.themeService.setTheme(newTheme);
  }
}
