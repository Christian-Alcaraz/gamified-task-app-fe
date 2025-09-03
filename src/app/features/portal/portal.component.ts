import { Dialog } from '@angular/cdk/dialog';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { DialogOptions } from '@core/constants';
import { User } from '@core/models';
import { UserStateService } from '@shared/services/state/user.state.service';
import { CreateCharacterModalComponent } from './components/create-character-modal/create-character-modal.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-portal',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
})
export class PortalComponent extends ThemeAwareComponent {
  private readonly _dialog = inject(Dialog);
  private readonly _scrollStrategy = inject(ScrollStrategyOptions);
  private readonly _userStateService = inject(UserStateService);
  readonly userState = this._userStateService.userState();

  constructor() {
    super();

    if (!this.userState?.flags?.hasCreatedCharacter) {
      setTimeout(() => {
        this._openCharacterCreationDialog();
      }, 100);
    }
  }

  private _openCharacterCreationDialog() {
    const dialogRef = this._dialog.open(CreateCharacterModalComponent, {
      ...DialogOptions,
      scrollStrategy: this._scrollStrategy.block(),
      data: {
        disableBackdropClose: true,
      },
    });

    dialogRef.closed.subscribe({
      next: (user) => {
        if (user) {
          this._userStateService.setUserState(user as User);
        }
      },
    });
  }
}
