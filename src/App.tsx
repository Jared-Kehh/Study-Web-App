import { useState, useEffect } from 'react';
import { User, Note, Message, TabType } from './types';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { StudyTimer } from './components/Timer/StudyTimer';
import { NoteEditor } from './components/Notes/NoteEditor';
import { NotesList } from './components/Notes/NotesList';
import { ChatInterface } from './components/Chatbot/ChatInterface';
import { authService } from './services/authService';
import { notesService } from './services/notesService';
import { chatService } from './services/chatService';

// Timer state interface
interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isBreak: boolean;
  studyMinutes: number;
  breakMinutes: number;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('timer');
  const [isLoading, setIsLoading] = useState(true);

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Chatbot state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  // ✅ PERSISTENT TIMER STATE - Always runs in App
  const [timerState, setTimerState] = useState<TimerState>({
    timeLeft: 25 * 60,
    isRunning: false,
    isBreak: false,
    studyMinutes: 25,
    breakMinutes: 5
  });

  // ✅ TIMER LOGIC - Runs in App, not in component
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerState.isRunning && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (timerState.timeLeft === 0 && timerState.isRunning) {
      setTimerState(prev => ({ ...prev, isRunning: false }));
      
      if (!timerState.isBreak) {
        alert('Study session complete! Time for a break.');
        setTimerState(prev => ({
          ...prev,
          isBreak: true,
          timeLeft: prev.breakMinutes * 60
        }));
      } else {
        alert('Break time is over! Ready for another study session?');
        setTimerState(prev => ({
          ...prev,
          isBreak: false,
          timeLeft: prev.studyMinutes * 60
        }));
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isRunning, timerState.timeLeft, timerState.isBreak]);

  // ✅ Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const user = authService.getCurrentUser();
      const token = authService.getToken();
      
      if (user && token) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        await loadNotes();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // ✅ Load notes from MongoDB backend
  const loadNotes = async () => {
    const fetchedNotes = await notesService.getNotes();
    setNotes(fetchedNotes);
  };

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    await loadNotes();
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setNotes([]);
    setMessages([]);
    // Reset timer on logout
    setTimerState({
      timeLeft: 25 * 60,
      isRunning: false,
      isBreak: false,
      studyMinutes: 25,
      breakMinutes: 5
    });
  };

  // ✅ Save note to MongoDB backend
  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    if (editingNote) {
      const noteId = editingNote._id || editingNote.id;
      if (!noteId) return;

      const updatedNote = await notesService.updateNote(noteId, noteTitle, noteContent);
      if (updatedNote) {
        setNotes(notes.map(note => 
          (note._id || note.id) === noteId ? updatedNote : note
        ));
      }
      setEditingNote(null);
    } else {
      const newNote = await notesService.createNote(noteTitle, noteContent);
      if (newNote) {
        setNotes([newNote, ...notes]);
      }
    }

    setNoteTitle('');
    setNoteContent('');
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  // ✅ Delete note from MongoDB backend
  const handleDeleteNote = async (id: string) => {
    const success = await notesService.deleteNote(id);
    if (success) {
      setNotes(notes.filter(note => (note._id || note.id) !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoadingResponse) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoadingResponse(true);

    try {
      const response = await chatService.sendMessage(updatedMessages);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };
      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <Header user={currentUser!} onLogout={handleLogout} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'timer' && (
          <StudyTimer 
            timerState={timerState} 
            setTimerState={setTimerState} 
          />
        )}

        {activeTab === 'notes' && (
          <div className="notes-grid">
            <NoteEditor
              editingNote={editingNote}
              noteTitle={noteTitle}
              noteContent={noteContent}
              onTitleChange={setNoteTitle}
              onContentChange={setNoteContent}
              onSave={handleSaveNote}
              onCancel={handleCancelEdit}
            />
            <NotesList
              notes={notes}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          </div>
        )}

        {activeTab === 'chatbot' && (
          <ChatInterface
            messages={messages}
            inputMessage={inputMessage}
            isLoading={isLoadingResponse}
            onInputChange={setInputMessage}
            onSend={handleSendMessage}
          />
        )}
      </main>

      {/* ✅ MINI TIMER WIDGET - Shows on all tabs when running */}
      {activeTab !== 'timer' && timerState.isRunning && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'linear-gradient(135deg, #0B2E33 0%, #4F7C82 100%)',
          color: '#ffffff',
          padding: '1rem 1.5rem',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(11, 46, 51, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 1000,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: '2px solid rgba(184, 227, 233, 0.3)'
        }}
        onClick={() => setActiveTab('timer')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(11, 46, 51, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(11, 46, 51, 0.4)';
        }}
        title="Click to view timer"
        >
          <div style={{
            width: '10px',
            height: '10px',
            background: '#10b981',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></div>
          <div style={{ fontWeight: '700', fontSize: '1.25rem', fontFamily: 'monospace' }}>
            {Math.floor(timerState.timeLeft / 60).toString().padStart(2, '0')}:
            {(timerState.timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            {timerState.isBreak ? 'Break' : 'Study'}
          </div>
        </div>
      )}
    </div>
  );
}