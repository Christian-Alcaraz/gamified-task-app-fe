import { Dialog } from '@angular/cdk/dialog';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import {
  DIALOG_OPTIONS,
  EPortalNavTitles,
  PORTAL_NAV_HEADER_ITEMS,
  UI_STATE,
} from '@core/constants';
import { INavItem } from '@core/interfaces/nav-item.interface';
import { User } from '@core/models';
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
    class: 'flex flex-col justify-center w-[inherit]',
  },
})
export class HeaderComponent extends ThemeAwareComponent {
  private readonly _dialog = inject(Dialog);
  private readonly _scrollStrategy = inject(ScrollStrategyOptions);
  private readonly _userStateService = inject(UserStateService);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastService);
  readonly userState = this._userStateService.userState;
  readonly navItems = PORTAL_NAV_HEADER_ITEMS;

  selectedNavItem: INavItem = this.navItems[0];
  imgUrl = signal('images/avatar_placeholder.png');

  selectNav(navItem: INavItem) {
    const { title } = navItem;

    if (title === EPortalNavTitles.Party) {
      this._handlePartyMenuClick(navItem);
    } else {
      this.selectedNavItem = navItem;
      this._router.navigate([navItem.route]);
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
      this._openPartyOptionDialog();
    } else {
      this._toast.showToast(
        'Feature Locked',
        'You need to be level 5+ to access the party menu.',
        UI_STATE.Info,
      );
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
