import { useEffect } from 'react';
import { useTimer } from './hooks/useTimer';
import { useNotes } from './hooks/useNotes';
import { useChat } from './hooks/useChat';
import { processChatMessage } from './services/chatService';
import { 
  formatTime, 
  formatDate, 
  requestNotificationPermission, 
  handleSelectChange, 
  handleInputChange 
} from './utils/helpers';
import TimerDisplay from './components/TimerDisplay';
import Controls from './components/Controls';
import Settings from './components/Settings';
import ChatBot from './components/ChatBot';
import NotesPanel from './components/NotesPanel';
import './App.css';

function App() {
  const timer = useTimer();
  const notes = useNotes();
  const chat = useChat((message: string) => 
    processChatMessage(message, {
      mode: timer.mode,
      isRunning: timer.isRunning,
      completedSessions: timer.completedSessions,
      timeLeft: timer.timeLeft,
      notesCount: notes.allNotes.length,
      addBotMessage: chat.addBotMessage,
      createNewNote: notes.createNewNote,
      openNotes: () => notes.clearCurrentNote(),
      startTimer: timer.startTimer,
      pauseTimer: timer.pauseTimer,
      resetTimer: timer.resetTimer,
      setStudyTime: timer.setStudyTime,
      setBreakTime: timer.setBreakTime,
    })
  );

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className={`app ${timer.mode}`}>
      <div className="timer-container">
        <TimerDisplay 
          timeLeft={timer.timeLeft}
          mode={timer.mode}
          completedSessions={timer.completedSessions}
          notesCount={notes.allNotes.length}
          error={notes.error}
        />
        
        <Controls
          isRunning={timer.isRunning}
          mode={timer.mode}
          chatOpen={chat.isOpen}
          notesOpen={notes.currentNote !== null}
          onStartTimer={timer.startTimer}
          onPauseTimer={timer.pauseTimer}
          onResetTimer={timer.resetTimer}
          onSkipSession={timer.skipSession}
          onToggleChat={chat.toggleChat}
          onToggleNotes={notes.clearCurrentNote}
        />
        
        <Settings
          onStudyTimeChange={timer.setStudyTime}
          onBreakTimeChange={timer.setBreakTime}
        />
        
        <button className="btn notification" onClick={requestNotificationPermission}>
          Enable Notifications
        </button>
      </div>

      <ChatBot
  isOpen={chat.isOpen}
  messages={chat.messages}
  inputMessage={chat.inputMessage}
  chatEndRef={chat.chatEndRef}
  onClose={() => chat.setIsOpen(false)}
  onInputChange={(e) => handleInputChange(e, chat.setInputMessage)}
  onSendMessage={chat.handleSendMessage}
/>

      <NotesPanel
        isOpen={notes.currentNote !== null}
        notes={notes.notes}
        allNotesCount={notes.allNotes.length}
        currentNote={notes.currentNote}
        noteTitle={notes.noteTitle}
        noteContent={notes.noteContent}
        noteTags={notes.noteTags}
        searchTerm={notes.searchTerm}
        loading={notes.loading}
        onClose={notes.clearCurrentNote}
        onSearchChange={(e) => handleInputChange(e, notes.setSearchTerm)}
        onNewNote={notes.createNewNote}
        onRefreshNotes={notes.loadNotes}
        onSaveNote={notes.saveNote}
        onEditNote={notes.editNote}
        onDeleteNote={notes.deleteNote}
        onTitleChange={(e) => handleInputChange(e, notes.setNoteTitle)}
        onContentChange={(e) => handleInputChange(e, notes.setNoteContent)}
        onTagsChange={(e) => handleInputChange(e, notes.setNoteTags)}
        onCancelEdit={notes.clearCurrentNote}
      />
    </div>
  );
}

export default App;