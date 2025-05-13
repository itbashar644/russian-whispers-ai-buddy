
export interface ChatMessage {
  id: number;
  chat_id: string;
  message: string;
  is_from_admin: boolean;
  is_read: boolean;
  created_at: string;
}

export interface ChatSession {
  id: string;
  customer_name: string;
  customer_email: string | null;
  created_at: string;
  updated_at: string;
}
