import { Dialog } from '@angular/cdk/dialog';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { DIALOG_OPTIONS } from '@core/constants';
import { User } from '@core/models';
import { ToastService } from '@shared/components/toast/toast.service';
import { UserStateService } from '@shared/services/state/user.state.service';
import { CreateCharacterModalComponent } from './components/create-character-modal/create-character-modal.component';
import { HeaderComponent } from './components/header/header.component';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-portal',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
  providers: [WebsocketService],
})
export class PortalComponent extends ThemeAwareComponent {
  private readonly _dialog = inject(Dialog);
  private readonly _scrollStrategy = inject(ScrollStrategyOptions);
  private readonly _userStateService = inject(UserStateService);
  private readonly _wsService = inject(WebsocketService);
  private readonly _toastService = inject(ToastService);

  readonly userState = this._userStateService.userState();

  constructor() {
    super();
    this._initializeWebsocket();
    this._userCharacterCheck();
  }

  private _initializeWebsocket() {
    this._wsService.init();
  }

  private _userCharacterCheck() {
    if (!this.userState?.flags?.hasCreatedCharacter) {
      setTimeout(() => {
        this._openCharacterCreationDialog();
      }, 100);
    }
  }

  private _openCharacterCreationDialog() {
    const dialogRef = this._dialog.open(CreateCharacterModalComponent, {
      ...DIALOG_OPTIONS,
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
