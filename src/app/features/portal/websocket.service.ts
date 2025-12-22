import { inject, Injectable } from '@angular/core';
import { AuthService } from '@shared/services/api/auth/auth.service';
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

  init(): void {
    this.socket = io(this._env.WS_URL, {
      retries: RETRIES,
      ackTimeout: ACK_TIMEOUT,
      // auth: (callback) =>
      //   callback({
      //     authToken: this._authService.getAuthToken(),
      //   }),
    }); // Replace with your server URL

    this.socket.emit('hello', 'Hello, server!');
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
