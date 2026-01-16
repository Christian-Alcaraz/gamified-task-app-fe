import * as enums from '@core/constants';

export interface ISocketSendMessageBody {
  target: string;
  message: string;
}

export interface ISocketGetMessageBody {
  page: number;
}

export interface ISocketGetDetailedBody {
  page: number;
  target: string;
}

export interface ISocketReadMessageBody {
  chatId: string;
  userId: string;
}

export interface ISocketPayload {
  [enums.EMessageSubTargets.Send]: ISocketSendMessageBody;
  [enums.EMessageSubTargets.Get]: ISocketGetMessageBody;
  [enums.EMessageSubTargets.Read]: ISocketReadMessageBody;
  [enums.EMessageSubTargets.GetUnread]: ISocketGetMessageBody;
}

export interface ISocketSubTarget {
  [enums.ESocketTargets.Chat]: enums.EMessageSubTargets;
}

export interface ISocketInMessage {
  target: enums.ESocketTargets;
  subTarget: ISocketSubTarget[enums.ESocketTargets];
  payload: ISocketPayload[enums.EMessageSubTargets];
}

export interface ISocketOutMessage {
  target: enums.ESocketType;
  payload: unknown;
  state?: string;
}

export interface IFullChatMessageEntity {
  sender: string;
  receiver: string;
  read: boolean;
  chatId: string;
  message: string;
}
