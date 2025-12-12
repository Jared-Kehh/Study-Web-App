import React, { useState, useEffect } from 'react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={currentUser!} onLogout={handleLogout} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'timer' && <StudyTimer />}

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
    </div>
  );
}
