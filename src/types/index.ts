export type TimerMode = 'study' | 'break';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Note {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  completedSessions: number;
}

export interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  noteTitle: string;
  noteContent: string;
  noteTags: string;
  searchTerm: string;
  loading: boolean;
  error: string;
}

export interface ChatState {
  messages: ChatMessage[];
  inputMessage: string;
  isOpen: boolean;
}

export interface ChatContext {
  mode: TimerMode;
  isRunning: boolean;
  completedSessions: number;
  timeLeft: number;
  notesCount: number;
  addBotMessage: (text: string) => void;
  createNewNote: () => void;
  openNotes: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setStudyTime: (minutes: number) => void;
  setBreakTime: (minutes: number) => void;
}