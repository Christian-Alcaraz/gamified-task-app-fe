import { inject, Injectable } from '@angular/core';
import * as enums from '@core/constants';
import { ToastService } from '@shared/components/toast/toast.service';
import { AuthService } from '@shared/services/api/auth/auth.service';
import { UserStateService } from '@shared/services/state/user.state.service';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

const RETRIES = 3;
const ACK_TIMEOUT = 60 * 1000;

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: Socket | null = null;
  private readonly _env = environment;
  private readonly _authService = inject(AuthService);
  private readonly _userState = inject(UserStateService).userState();
  private readonly _toastService = inject(ToastService);

  hasSocket() {
    return this.socket;
  }

  init(): void {
    this.socket = io(this._env.WS_URL, {
      retries: RETRIES,
      ackTimeout: ACK_TIMEOUT,
      query: {
        [enums.EToken.Auth]: this._authService.getAuthToken(),
      },
    });

    this.startListeners();
  }

  startListeners() {
    if (!this.socket) {
      console.error(
        'startListeners initiated without socket, THIS MUST NOT HAPPEN',
      );
      return;
    }

    this.socket.on(enums.ESocketType.Error, this._handleError);
    this.socket.on(enums.ESocketType.Disconnect, this._handleDisconnect);
    this.socket.on(enums.ESocketType.TokenExpired, this._handleTokenExpired);
    this.socket.on(enums.ESocketType.Success, this._handleSuccess);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private _handleSuccess(message: string) {
    console.log('Success', message);
  }

  private _handleError(error: string) {
    const { message, name, code } = JSON.parse(error);
    this._toastService.showToast(
      `${name} ${code}`,
      message,
      enums.UI_STATE.Error,
    );
  }

  private _handleDisconnect(reason: string) {
    if (this.socket?.active) {
      // temporary disconnection, the socket will automatically try to reconnect
      console.log('Will reconnect');
    } else {
      // the connection was forcefully closed by the server or the client itself
      // in that case, `socket.connect()` must be manually called in order to reconnect
      console.log('Must manually reconnect', reason);
    }
  }

  private _handleTokenExpired() {
    this._authService.refreshToken().subscribe((res) => {
      this._authService.setAuthToken(res.token);

      const message = {
        userId: this._userState!._id,
        [enums.EToken.Auth]: this._authService.getAuthToken(),
      };

      this.socket!.emit(
        enums.ESocketType.Reauthenticate,
        JSON.stringify(message),
      );
    });
  }
}
