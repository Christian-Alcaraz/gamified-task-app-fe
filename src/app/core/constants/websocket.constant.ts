export enum ESocketType {
  Error = 'error',
  Message = 'message',
  ChatMessage = 'chatMessage',
  Success = 'success',
  TokenExpired = 'token_expired',
  Reauthenticate = 'reauthenticate',
  Disconnect = 'disconnect',
}

export enum ESocketTargets {
  Chat = 'chat',
}

export enum EMessageSubTargets {
  Send = 'send',
  Get = 'get',
  Read = 'read',
  GetUnread = 'getUnread',
}
