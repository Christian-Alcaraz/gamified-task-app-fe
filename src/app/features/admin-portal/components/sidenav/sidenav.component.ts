import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from '@core/interfaces/nav-item.interface';
import { AdminPortalService } from '@features/admin-portal/admin-portal.service';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-sidenav',
  imports: [NgIcon],
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  readonly #router = inject(Router);
  readonly #adminPortalService = inject(AdminPortalService);

  activeNav = computed(() => this.#adminPortalService.selectedNav?.route);

  sidenavItems = [
    {
      title: 'Dashboard',
      icon: 'heroChartBar',
      route: '/admin/dashboard',
    },
    {
      title: 'Item Management',
      icon: 'heroArchiveBox',
      route: '/admin/items',
    },
  ];

  constructor() {
    const foundNav = this.sidenavItems.find(
      (nav) => nav.route === this.#router.url,
    );
    this.#adminPortalService.selectedNav = foundNav as NavItem;
  }

  selectRoute(nav: NavItem) {
    this.#adminPortalService.selectedNav = nav;
    this.#router.navigateByUrl(nav.route);
  }

  navigateToApp() {
    this.#router.navigateByUrl('/hub');
  }
}
