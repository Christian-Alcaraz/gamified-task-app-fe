import { Injectable } from '@angular/core';
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

  init(): void {
    this.socket = io(this._env.WS_URL, {
      retries: RETRIES,
      ackTimeout: ACK_TIMEOUT,
    }); // Replace with your server URL

    this.socket.emit('hello', 'Hello, server!');
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
