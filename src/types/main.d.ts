export interface IncomingMessage {
  chatId: string;
  from: string;
  messageId: string;
  timestamp: string;
  content: string;
  mediaId: string | null;
}

export interface SaveMessageResponse {
  takeover: boolean;
  threadId: string;
}

export interface AgentMessage {
  chat_id: string;
  content: string;
  userId: string;
}

export interface TakeoverRequest {
  takeover: boolean;
  userId: string;
}

export interface CloseRequest {
  userId: string;
}
