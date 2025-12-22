import { Injectable, signal } from '@angular/core';
import { INavItem } from '@core/interfaces/nav-item.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminPortalService {
  #showSidenavState = signal(true);
  #selectedNav = signal<INavItem | undefined>(undefined);

  getSidenavState() {
    return this.#showSidenavState();
  }

  setSidenavState(state: boolean) {
    this.#showSidenavState.set(state);
  }

  get selectedNav(): INavItem | undefined {
    return this.#selectedNav();
  }

  set selectedNav(nav: INavItem) {
    this.#selectedNav.set(nav);
  }
}
