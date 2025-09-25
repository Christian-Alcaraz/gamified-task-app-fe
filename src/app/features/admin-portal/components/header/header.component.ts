import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AdminPortalService } from '@features/admin-portal/admin-portal.service';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-header',
  imports: [NgIcon, TitleCasePipe],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: { class: 'flex w-full bg-background px-4 py-4 border-b' },
})
export class HeaderComponent {
  #adminPortalService = inject(AdminPortalService);
  #sidenavState = computed(() => this.#adminPortalService.getSidenavState());
  toggleIcon = computed(() =>
    this.#sidenavState()
      ? 'heroArrowLeftStartOnRectangle'
      : 'heroArrowRightStartOnRectangle',
  );

  routeTitle = computed(
    () => this.#adminPortalService.selectedNav?.title ?? '',
  );

  toggleSidenav() {
    this.#adminPortalService.setSidenavState(!this.#sidenavState());
  }
}
