import React, { useState, useEffect } from 'react';
import { User, Note, Message, TabType } from './types';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { StudyTimer } from './components/Timer/StudyTimer';
import { NoteEditor } from './components/Notes/NoteEditor';
import { NotesList } from './components/Notes/NotesList';
import { ChatInterface } from './components/Chatbot/ChatInterface';
import { notesService } from './services/notesService';
import { chatService } from './services/chatService.ts';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('timer');

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Chatbot state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setNotes(notesService.getNotes(user.username));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setNotes(notesService.getNotes(user.username));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setNotes([]);
    setMessages([]);
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim() || !currentUser) return;

    if (editingNote) {
      const updatedNotes = notesService.updateNote(
        editingNote.id,
        noteTitle,
        noteContent,
        currentUser.username
      );
      setNotes(updatedNotes);
      setEditingNote(null);
    } else {
      const updatedNotes = notesService.createNote(
        noteTitle,
        noteContent,
        currentUser.username
      );
      setNotes(updatedNotes);
    }

    setNoteTitle('');
    setNoteContent('');
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  const handleDeleteNote = (id: string) => {
    if (!currentUser) return;
    const updatedNotes = notesService.deleteNote(id, currentUser.username);
    setNotes(updatedNotes);
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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