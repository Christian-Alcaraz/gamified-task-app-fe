import { inject, Injectable } from '@angular/core';
import { EToken, UI_STATE } from '@core/constants';
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
        [EToken.Auth]: this._authService.getAuthToken(),
      },
    }); // Replace with your server URL

    this.startListeners();
  }

  startListeners() {
    if (!this.socket) {
      console.error('This must not happen');
      return;
    }

    this.socket.on('hello', (data) => {
      console.log('Received hello', JSON.stringify(data));
    });

    this.socket.on('error', (data) => {
      const { message, name, code } = JSON.parse(data);
      this._toastService.showToast(`${name} ${code}`, message, UI_STATE.Error);
    });

    this.socket.on('disconnect', (reason) => {
      if (this.socket?.active) {
        // temporary disconnection, the socket will automatically try to reconnect
        console.log('Will reconnect');
      } else {
        // the connection was forcefully closed by the server or the client itself
        // in that case, `socket.connect()` must be manually called in order to reconnect
        console.log('Must manually reconnect', reason);
      }
    });

    this.socket.on('token_expired', () => {
      this._authService.refreshToken().subscribe((res) => {
        this._authService.setAuthToken(res.token);
        const message = {
          userId: this._userState!._id,
          [EToken.Auth]: this._authService.getAuthToken(),
        };
        this.socket!.emit('reauthenticate', JSON.stringify(message));
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
