import { Dialog } from '@angular/cdk/dialog';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { DialogOptions } from '@core/constants';
import { User } from '@core/models';
import { UserStateService } from '@shared/services/state/user.state.service';
import { CreateCharacterModalComponent } from '../create-character-modal/create-character-modal.component';
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
  private readonly _dialog = inject(Dialog);
  private readonly _scrollStrategy = inject(ScrollStrategyOptions);
  private readonly _userStateService = inject(UserStateService);
  readonly userState = this._userStateService.userState;
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
  imgUrl = signal('images/avatar_placeholder.png');

  selectNav(navItem: Record<string, string>) {
    this.selectedNavItem = navItem;
  }

  openCharacterCreationDialog() {
    setTimeout(() => {
      const dialogRef = this._dialog.open(CreateCharacterModalComponent, {
        ...DialogOptions,
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
}
