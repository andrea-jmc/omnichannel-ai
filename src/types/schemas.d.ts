export interface Conversation {
  chat_id: string;
  thread_id: string;
  user_id: string;
  takeover: boolean;
  assigned_agent_id: string | null;
  messages: ConversationMessage[];
  created_at: Date;
  updated_at: Date;
}

export interface ConversationMessage {
  timestamp: string;
  author: "user" | "assistant" | "agent";
  content: string;
  media?: string;
  takeover: boolean;
}

export interface User {
  name: string;
  id: string;
  phone: string;
  email: string;
}

export interface OutgoingChat {
  chat_id: string;
  userId: string;
  takeover: boolean;
  messages: ConversationMessage[];
  lastMessage: string;
}
