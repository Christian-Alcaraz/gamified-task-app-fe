import { Injectable, signal } from '@angular/core';
import { NavItem } from '@core/interfaces/nav-item.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminPortalService {
  #showSidenavState = signal(true);
  #selectedNav = signal<NavItem | undefined>(undefined);

  getSidenavState() {
    return this.#showSidenavState();
  }

  setSidenavState(state: boolean) {
    this.#showSidenavState.set(state);
  }

  get selectedNav(): NavItem | undefined {
    return this.#selectedNav();
  }

  set selectedNav(nav: NavItem) {
    this.#selectedNav.set(nav);
  }
}
