import { useState, useEffect, useRef } from 'react';
import './App.css';

// Type Definitions
type TimerMode = 'study' | 'break';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Note {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

// API Service Functions
const API_BASE_URL = 'http://localhost:3001/api';

const notesService = {
  async getNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes`);
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    return response.json();
  },

  async createNote(note: Omit<Note, '_id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    return response.json();
  },

  async updateNote(id: string, note: Partial<Note>): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    if (!response.ok) {
      throw new Error('Failed to update note');
    }
    return response.json();
  },

  async deleteNote(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
  },

  async searchNotes(query: string): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search notes');
    }
    return response.json();
  }
};

function App() {
  // State declarations with proper types
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<TimerMode>('study');
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [notesOpen, setNotesOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your Study Assistant. I can help you with timer settings, study techniques, and motivation!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteTags, setNoteTags] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Refs with proper types
  const studyTimeRef = useRef<number>(25 * 60);
  const breakTimeRef = useRef<number>(5 * 60);
  const intervalRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load notes from MongoDB on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const fetchedNotes = await notesService.getNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      setError('Failed to load notes');
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (mode === 'study') {
      setMode('break');
      setTimeLeft(breakTimeRef.current);
      setCompletedSessions(prev => prev + 1);
      addBotMessage("Great job! Study session completed. Time for a break! 🎉");
    } else {
      setMode('study');
      setTimeLeft(studyTimeRef.current);
      addBotMessage("Break's over! Ready for your next study session? 💪");
    }
    
    setIsRunning(false);
    
    if (Notification.permission === 'granted') {
      new Notification(`Time's up! ${mode === 'study' ? 'Take a break!' : 'Back to study!'}`);
    }
  };

  // Notes Functions
  const createNewNote = (): void => {
    const newNote: Note = {
      title: 'New Note',
      content: '',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCurrentNote(newNote);
    setNoteTitle('New Note');
    setNoteContent('');
    setNoteTags('');
  };

  const saveNote = async (): Promise<void> => {
    if (!noteTitle.trim()) {
      alert('Please add a title for your note');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (currentNote && currentNote._id) {
        // Update existing note
        const updatedNote = await notesService.updateNote(currentNote._id, {
          title: noteTitle,
          content: noteContent,
          tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag),
          updatedAt: new Date()
        });
        setNotes(prev => prev.map(note => 
          note._id === updatedNote._id ? updatedNote : note
        ));
        addBotMessage("Note updated successfully! 📝");
      } else {
        // Create new note
        const newNote = await notesService.createNote({
          title: noteTitle,
          content: noteContent,
          tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        });
        setNotes(prev => [...prev, newNote]);
        addBotMessage("New note created! 📝");
      }
      setCurrentNote(null);
      setNoteTitle('');
      setNoteContent('');
      setNoteTags('');
    } catch (err) {
      setError('Failed to save note');
      console.error('Error saving note:', err);
    } finally {
      setLoading(false);
    }
  };

  const editNote = (note: Note): void => {
    setCurrentNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTags(note.tags.join(', '));
  };

  const deleteNote = async (noteId: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    setLoading(true);
    setError('');
    try {
      await notesService.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note._id !== noteId));
      if (currentNote?._id === noteId) {
        setCurrentNote(null);
        setNoteTitle('');
        setNoteContent('');
        setNoteTags('');
      }
      addBotMessage("Note deleted! 🗑️");
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Chat Functions
  const addBotMessage = (text: string): void => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Process and respond
    processMessage(inputMessage.toLowerCase());
    setInputMessage('');
  };

  const processMessage = (message: string): void => {
    // Simulate typing delay
    setTimeout(() => {
      if (message.includes('note') || message.includes('write')) {
        if (message.includes('new') || message.includes('create')) {
          createNewNote();
          setNotesOpen(true);
          addBotMessage("Created a new note for you! Start writing your thoughts. 📝");
        } else {
          addBotMessage(`I can help you with notes! You can:
• Create new notes
• Search through your notes
• Add tags to organize them
• Save important study information

You have ${notes.length} notes saved. Want to create a new one?`);
        }
      } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        addBotMessage("Hello! How can I help you with your study session today?");
      } else if (message.includes('help')) {
        addBotMessage(`I can help you with:
• Starting/pausing the timer
• Changing study/break durations
• Study techniques (Pomodoro, etc.)
• Motivation and tips
• Session statistics
• Taking notes and organizing them

What would you like to know?`);
      } else if (message.includes('start') || message.includes('begin')) {
        if (!isRunning) {
          startTimer();
          addBotMessage("Starting your study timer! Focus time! 🚀");
        } else {
          addBotMessage("Timer is already running! Keep going! 💪");
        }
      } else if (message.includes('pause') || message.includes('stop')) {
        if (isRunning) {
          pauseTimer();
          addBotMessage("Timer paused. Ready when you are! ⏸️");
        } else {
          addBotMessage("Timer is already paused.");
        }
      } else if (message.includes('reset')) {
        resetTimer();
        addBotMessage("Timer reset! Ready for a fresh start? 🔄");
      } else if (message.includes('study time') || message.includes('study duration')) {
        addBotMessage(`Current study time is ${studyTimeRef.current / 60} minutes. You can change it in the settings!`);
      } else if (message.includes('break time') || message.includes('break duration')) {
        addBotMessage(`Current break time is ${breakTimeRef.current / 60} minutes. You can change it in the settings!`);
      } else if (message.includes('technique') || message.includes('pomodoro')) {
        addBotMessage(`The Pomodoro Technique:
• Study for 25 minutes
• Take a 5-minute break
• After 4 sessions, take a longer break (15-30 min)
• This helps maintain focus and prevent burnout!

Want to try it?`);
      } else if (message.includes('motivation') || message.includes('tired') || message.includes('bored')) {
        const motivations = [
          "You're doing great! Every minute of study brings you closer to your goals! 🌟",
          "Remember why you started! You've got this! 💫",
          "Take a deep breath. Progress, not perfection! 🎯",
          "The expert in anything was once a beginner. Keep going! 🚀",
          "Your future self will thank you for this effort! 🙏"
        ];
        addBotMessage(motivations[Math.floor(Math.random() * motivations.length)]);
      } else if (message.includes('stat') || message.includes('progress') || message.includes('session')) {
        addBotMessage(`Session Stats:
• Completed sessions: ${completedSessions}
• Current mode: ${mode}
• Time left: ${formatTime(timeLeft)}
• Notes saved: ${notes.length}
• Next: ${mode === 'study' ? 'Break' : 'Study'} time

Keep up the great work! 📊`);
      } else if (message.includes('thank') || message.includes('thanks')) {
        addBotMessage("You're welcome! Happy studying! 😊");
      } else {
        addBotMessage("I'm here to help with your study sessions! You can ask me about:\n• Starting/pausing timer\n• Study techniques\n• Motivation\n• Session stats\n• Taking notes\n\nWhat would you like to know?");
      }
    }, 1000);
  };

  // Timer control functions
  const startTimer = (): void => {
    setIsRunning(true);
  };

  const pauseTimer = (): void => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = (): void => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeLeft(mode === 'study' ? studyTimeRef.current : breakTimeRef.current);
  };

  const skipSession = (): void => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (mode === 'study') {
      setMode('break');
      setTimeLeft(breakTimeRef.current);
      addBotMessage("Skipped to break time! Relax for a bit! ☕");
    } else {
      setMode('study');
      setTimeLeft(studyTimeRef.current);
      addBotMessage("Back to studying! Let's focus! 📚");
    }
  };

  // Utility functions
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const requestNotificationPermission = (): void => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const setStudyTime = (minutes: number): void => {
    studyTimeRef.current = minutes * 60;
    if (mode === 'study' && !isRunning) {
      setTimeLeft(studyTimeRef.current);
    }
    addBotMessage(`Study time set to ${minutes} minutes! 📚`);
  };

  const setBreakTime = (minutes: number): void => {
    breakTimeRef.current = minutes * 60;
    if (mode === 'break' && !isRunning) {
      setTimeLeft(breakTimeRef.current);
    }
    addBotMessage(`Break time set to ${minutes} minutes! ☕`);
  };

  // Event handler types
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, setter: (value: number) => void): void => {
    setter(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setter: (value: string) => void): void => {
    setter(e.target.value);
  };

  return (
    <div className={`app ${mode}`}>
      <div className="timer-container">
        <h1>Study Timer</h1>
        
        <div className={`timer-display ${mode}`}>
          {formatTime(timeLeft)}
        </div>
        
        <div className={`status ${mode}`}>
          {mode === 'study' ? 'Study Time' : 'Break Time'}
        </div>
        
        <div className="session-info">
          Completed Sessions: {completedSessions} | Notes: {notes.length}
        </div>
        
        {/* Error display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="controls">
          {!isRunning ? (
            <button className="btn start" onClick={startTimer}>
              Start
            </button>
          ) : (
            <button className="btn pause" onClick={pauseTimer}>
              Pause
            </button>
          )}
          
          <button className="btn reset" onClick={resetTimer}>
            Reset
          </button>
          
          <button className="btn skip" onClick={skipSession}>
            Skip
          </button>

          <button 
            className={`btn chat-toggle ${chatOpen ? 'active' : ''}`}
            onClick={() => setChatOpen(!chatOpen)}
          >
            {chatOpen ? 'Close Chat' : 'Study Assistant'}
          </button>

          <button 
            className={`btn notes-toggle ${notesOpen ? 'active' : ''}`}
            onClick={() => setNotesOpen(!notesOpen)}
          >
            {notesOpen ? 'Close Notes' : 'My Notes'}
          </button>
        </div>
        
        <div className="settings">
          <div className="time-setting">
            <label>Study Time (minutes): </label>
            <select 
              onChange={(e) => handleSelectChange(e, setStudyTime)}
              defaultValue="25"
            >
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="45">45</option>
              <option value="60">60</option>
            </select>
          </div>
          
          <div className="time-setting">
            <label>Break Time (minutes): </label>
            <select 
              onChange={(e) => handleSelectChange(e, setBreakTime)}
              defaultValue="5"
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
        </div>
        
        <button className="btn notification" onClick={requestNotificationPermission}>
          Enable Notifications
        </button>
      </div>

      {/* Chat Bot */}
      {chatOpen && (
        <div className="chatbot">
          <div className="chat-header">
            <h3>Study Assistant</h3>
            <button 
              className="close-chat"
              onClick={() => setChatOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {message.text.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => handleInputChange(e, setInputMessage)}
              placeholder="Ask about study techniques, timer help, or motivation..."
              className="chat-input"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>
      )}

      {/* Notes Panel */}
      {notesOpen && (
        <div className="notes-panel">
          <div className="notes-header">
            <h3>My Study Notes ({notes.length})</h3>
            <button 
              className="close-notes"
              onClick={() => setNotesOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="notes-toolbar">
            <button className="btn new-note" onClick={createNewNote}>
              + New Note
            </button>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => handleInputChange(e, setSearchTerm)}
              className="search-notes"
            />
            <button 
              className="btn refresh-notes" 
              onClick={loadNotes}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <div className="notes-content">
            {loading && !currentNote ? (
              <div className="loading">Loading notes...</div>
            ) : currentNote ? (
              <div className="note-editor">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => handleInputChange(e, setNoteTitle)}
                  placeholder="Note title..."
                  className="note-title-input"
                />
                <textarea
                  value={noteContent}
                  onChange={(e) => handleInputChange(e, setNoteContent)}
                  placeholder="Write your notes here..."
                  className="note-content-input"
                  rows={15}
                />
                <input
                  type="text"
                  value={noteTags}
                  onChange={(e) => handleInputChange(e, setNoteTags)}
                  placeholder="Tags (comma separated)..."
                  className="note-tags-input"
                />
                <div className="note-actions">
                  <button 
                    className="btn save-note" 
                    onClick={saveNote}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Note'}
                  </button>
                  <button 
                    className="btn cancel-note" 
                    onClick={() => {
                      setCurrentNote(null);
                      setNoteTitle('');
                      setNoteContent('');
                      setNoteTags('');
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="notes-list">
                {filteredNotes.length === 0 ? (
                  <div className="empty-notes">
                    {notes.length === 0 ? (
                      <>
                        <h4>No notes yet</h4>
                        <p>Create your first note to get started!</p>
                        <button className="btn new-note" onClick={createNewNote}>
                          Create First Note
                        </button>
                      </>
                    ) : (
                      <p>No notes match your search.</p>
                    )}
                  </div>
                ) : (
                  filteredNotes.map(note => (
                    <div key={note._id} className="note-card">
                      <div className="note-card-header">
                        <h4>{note.title}</h4>
                        <div className="note-actions">
                          <button 
                            className="btn edit-note"
                            onClick={() => editNote(note)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn delete-note"
                            onClick={() => note._id && deleteNote(note._id)}
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="note-preview">
                        {note.content.substring(0, 150)}
                        {note.content.length > 150 ? '...' : ''}
                      </p>
                      <div className="note-tags">
                        {note.tags.map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                      <div className="note-date">
                        Updated: {formatDate(note.updatedAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;