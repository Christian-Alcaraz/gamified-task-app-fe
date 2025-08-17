import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, TitleCasePipe, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    class: 'flex items-center w-[inherit] bg-primary/80',
  },
})
export class HeaderComponent {
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
}
