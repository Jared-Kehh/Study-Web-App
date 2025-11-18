import React from 'react';
import { TimerMode } from '../types';

interface ControlsProps {
  isRunning: boolean;
  mode: TimerMode;
  chatOpen: boolean;
  notesOpen: boolean;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResetTimer: () => void;
  onSkipSession: () => void;
  onToggleChat: () => void;
  onToggleNotes: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  mode,
  chatOpen,
  notesOpen,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onSkipSession,
  onToggleChat,
  onToggleNotes
}) => (
  <div className="controls">
    {!isRunning ? (
      <button className="btn start" onClick={onStartTimer}>
        Start
      </button>
    ) : (
      <button className="btn pause" onClick={onPauseTimer}>
        Pause
      </button>
    )}
    
    <button className="btn reset" onClick={onResetTimer}>
      Reset
    </button>
    
    <button className="btn skip" onClick={onSkipSession}>
      Skip
    </button>

    <button 
      className={`btn chat-toggle ${chatOpen ? 'active' : ''}`}
      onClick={onToggleChat}
    >
      {chatOpen ? 'Close Chat' : 'Study Assistant'}
    </button>

    <button 
      className={`btn notes-toggle ${notesOpen ? 'active' : ''}`}
      onClick={onToggleNotes}
    >
      {notesOpen ? 'Close Notes' : 'My Notes'}
    </button>
  </div>
);

export default Controls;