import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as enums from '@core/constants';
import {
  ISocketGetMessageBody,
  ISocketInMessage,
  ISocketSendMessageBody,
} from '@core/interfaces/websocket.interface';
import { WebsocketService } from '@features/portal/websocket.service';
import { NgIcon } from '@ng-icons/core';
import { TextFieldComponent } from '@shared/components/inputs';

@Component({
  selector: 'app-chat-view',
  imports: [CommonModule, TextFieldComponent, ReactiveFormsModule, NgIcon],
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.scss',
})
export class ChatViewComponent {
  private _wsService = inject(WebsocketService);

  fGroup = new FormGroup({
    message: new FormControl(''),
  });

  submit() {
    this._sendMessage();
  }

  getMessages() {
    this._getMessages();
  }

  private _getMessages() {
    const payload: ISocketGetMessageBody = {
      conversationId: '65aa7377ede4267890abc124',
      page: 1,
    };

    this._wsService.sendMessage({
      target: enums.ESocketTargets.Chat,
      subTarget: enums.EMessageSubTargets.Get,
      payload,
    });
  }

  private _sendMessage() {
    const message = this.fGroup.value.message as string;

    const payload: ISocketSendMessageBody = {
      target: '65aa7377ede4267890abc123', //receipent id
      message,
      conversationId: '65aa7377ede4267890abc124',
    };

    const socketInMessage: ISocketInMessage = {
      target: enums.ESocketTargets.Chat,
      subTarget: enums.EMessageSubTargets.Send,
      payload,
    };

    this.fGroup.reset();

    this._wsService.sendMessage(socketInMessage);
  }
}
