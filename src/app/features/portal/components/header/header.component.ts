import { Dialog } from '@angular/cdk/dialog';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import {
  DIALOG_OPTIONS,
  EPortalNavTitles,
  EPortalSetting,
  PORTAL_NAV_HEADER_ITEMS,
} from '@core/constants';
import { INavItem } from '@core/interfaces/nav-item.interface';
import { User } from '@core/models';
import { PortalService } from '@features/portal/portal.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { AuthService } from '@shared/services/api/auth/auth.service';
import { UserStateService } from '@shared/services/state/user.state.service';
import { CreateCharacterModalComponent } from '../create-character-modal/create-character-modal.component';
import { PartyOptionDialogComponent } from '../party-option-dialog/party-option-dialog.component';
import { StatBarComponent } from '../stat-bar/stat-bar.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, TitleCasePipe, StatBarComponent],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    class: 'flex flex-col justify-center',
  },
})
export class HeaderComponent extends ThemeAwareComponent {
  private readonly _dialog = inject(Dialog);
  private readonly _scrollStrategy = inject(ScrollStrategyOptions);
  private readonly _userStateService = inject(UserStateService);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastService);
  private readonly _portalService = inject(PortalService);
  readonly userState = this._userStateService.userState;
  readonly navItems = PORTAL_NAV_HEADER_ITEMS;

  selectedNavItem: INavItem = this.navItems[0];
  imgUrl = signal('images/avatar_placeholder.png');

  constructor() {
    super();
    this._checkActivePortalRoute();
  }

  selectNav(navItem: INavItem) {
    const { title } = navItem;

    if (title === EPortalNavTitles.Party) {
      this._handlePartyMenuClick(navItem);
    } else {
      this._assignActiveRoute(navItem);
    }
  }

  openCharacterCreationDialog() {
    setTimeout(() => {
      const dialogRef = this._dialog.open(CreateCharacterModalComponent, {
        ...DIALOG_OPTIONS,
        scrollStrategy: this._scrollStrategy.block(),
        data: {
          disableBackdropClose: false,
        },
      });

      dialogRef.closed.subscribe({
        next: (user) => {
          if (user) {
            this._userStateService.setUserState(user as User);
          }
        },
      });
    }, 100);
  }

  toggleTheme() {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.themeService.setTheme(newTheme);
  }

  me() {
    this._authService.me().subscribe({
      next: (user) => {
        console.log(user);
      },
    });
  }

  refreshToken() {
    this._authService.refreshToken().subscribe({
      next: () => {
        console.log('Should be redirected to auth/login');
      },
    });
  }

  logout() {
    this._authService.logout().subscribe();
  }

  private _assignActiveRoute(nav: INavItem) {
    localStorage.setItem(EPortalSetting, nav.route);
    this._portalService.activeRoute = nav;
    this.selectedNavItem = nav;
    this._router.navigate([nav.route]);
  }

  private _checkActivePortalRoute() {
    const storedActiveRoute = localStorage.getItem(EPortalSetting);
    const foundNavItem = PORTAL_NAV_HEADER_ITEMS.find(
      (item) => item.route === storedActiveRoute,
    );

    const option = foundNavItem ?? PORTAL_NAV_HEADER_ITEMS[0];
    this._portalService.activeRoute = option;
    this.selectNav(option);
  }

  private _handlePartyMenuClick(nav: INavItem) {
    if (!this.userState()) {
      console.error(
        'Client clicked Party route and userState is empty, THIS SHOULD NOT HAPPEN',
      );
      return;
    }
    const isUserAtleastLevel5 = this.userState()!.stats!.level >= 5; //Todo: Get config from api
    const isUserPartyMember = !!this.userState()?._partyId;

    if (isUserPartyMember) {
      this.selectedNavItem = nav;
      //router to party screen
    } else if (isUserAtleastLevel5) {
      // this._openPartyOptionDialog();
      this._assignActiveRoute(nav);
    } else {
      this._assignActiveRoute(nav);
    }
  }

  private _openPartyOptionDialog() {
    const dialog = this._dialog.open(PartyOptionDialogComponent, {
      ...DIALOG_OPTIONS,
      data: {
        disableBackdropClose: false,
      },
      width: '35vw',
      scrollStrategy: this._scrollStrategy.block(),
    });

    dialog.closed.subscribe({
      next: (response) => {
        if (!response) return;
      },
    });
  }
}
