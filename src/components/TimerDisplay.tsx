import React from 'react';
import { TimerMode } from '../types';

interface TimerDisplayProps {
  timeLeft: number;
  mode: TimerMode;
  completedSessions: number;
  notesCount: number;
  error: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  mode,
  completedSessions,
  notesCount,
  error
}) => (
  <>
    <h1>Study Timer</h1>
    
    <div className={`timer-display ${mode}`}>
      {formatTime(timeLeft)}
    </div>
    
    <div className={`status ${mode}`}>
      {mode === 'study' ? 'Study Time' : 'Break Time'}
    </div>
    
    <div className="session-info">
      Completed Sessions: {completedSessions} | Notes: {notesCount}
    </div>
    
    {error && (
      <div className="error-message">
        {error}
      </div>
    )}
  </>
);

// Add formatTime function
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default TimerDisplay;