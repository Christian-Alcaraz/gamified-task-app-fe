import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { AdminPortalService } from './admin-portal.service';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@Component({
  selector: 'app-admin-portal',
  imports: [CommonModule, HeaderComponent, SidenavComponent, RouterOutlet],
  templateUrl: './admin-portal.component.html',
  styleUrl: './admin-portal.component.scss',
})
export class AdminPortalComponent extends ThemeAwareComponent {
  #adminPortalService = inject(AdminPortalService);
  readonly showSidenav = computed(() =>
    this.#adminPortalService.getSidenavState(),
  );

  constructor() {
    super();

    if (!this.theme()) {
      this.themeService.setTheme('light');
    }
  }
}
