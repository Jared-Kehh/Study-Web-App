export interface Note {
  _id?: string;
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface User {
  username: string;
}

export type TabType = 'timer' | 'notes' | 'chatbot';