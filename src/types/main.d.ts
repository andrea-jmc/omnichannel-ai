export interface IncomingMessage {
  chatId: string;
  from: string;
  messageId: string;
  timestamp: string;
  content: string;
}

export interface SaveMessageResponse {
  takeover: boolean;
  threadId: string;
}
