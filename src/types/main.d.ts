export interface IncomingMessage {
  chatId: string;
  from: string;
  messageId: string;
  timestamp: string;
  content: string;
  imageId: string | null;
}

export interface SaveMessageResponse {
  takeover: boolean;
  threadId: string;
}
