import React from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

// Timer state interface
interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isBreak: boolean;
  studyMinutes: number;
  breakMinutes: number;
}

interface StudyTimerProps {
  timerState: TimerState;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ timerState, setTimerState }) => {
  const [showSettings, setShowSettings] = React.useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setTimerState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleReset = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.isBreak ? prev.breakMinutes * 60 : prev.studyMinutes * 60
    }));
  };

  const handleSaveSettings = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.isBreak ? prev.breakMinutes * 60 : prev.studyMinutes * 60
    }));
    setShowSettings(false);
  };

  const handleStudyMinutesChange = (value: string) => {
    const num = parseInt(value) || 1;
    setTimerState(prev => ({
      ...prev,
      studyMinutes: Math.max(1, Math.min(180, num))
    }));
  };

  const handleBreakMinutesChange = (value: string) => {
    const num = parseInt(value) || 1;
    setTimerState(prev => ({
      ...prev,
      breakMinutes: Math.max(1, Math.min(60, num))
    }));
  };

  return (
    <div className="timer-container">
      <div className="timer-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="timer-title" style={{ margin: 0 }}>
            {timerState.isBreak ? 'Break Time' : 'Study Session'}
          </h2>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: '0.75rem',
              background: 'rgba(79, 124, 130, 0.1)',
              color: '#4F7C82',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79, 124, 130, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(79, 124, 130, 0.1)'}
            title="Timer Settings"
          >
            <Settings className="icon-md" />
          </button>
        </div>

        {showSettings && (
          <div style={{
            background: 'rgba(184, 227, 233, 0.3)',
            padding: '1.5rem',
            borderRadius: '16px',
            marginBottom: '2rem',
            border: '2px solid rgba(79, 124, 130, 0.2)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              color: '#0B2E33', 
              marginBottom: '1rem' 
            }}>
              Timer Settings
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.9rem', 
                  fontWeight: '600', 
                  color: '#0B2E33', 
                  marginBottom: '0.5rem' 
                }}>
                  Study Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={timerState.studyMinutes}
                  onChange={(e) => handleStudyMinutesChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #B8E3E9',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    background: '#ffffff',
                    color: '#0B2E33'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.9rem', 
                  fontWeight: '600', 
                  color: '#0B2E33', 
                  marginBottom: '0.5rem' 
                }}>
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={timerState.breakMinutes}
                  onChange={(e) => handleBreakMinutesChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #B8E3E9',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    background: '#ffffff',
                    color: '#0B2E33'
                  }}
                />
              </div>
              <button
                onClick={handleSaveSettings}
                style={{
                  padding: '0.875rem 1.5rem',
                  background: 'linear-gradient(135deg, #0B2E33 0%, #4F7C82 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 15px rgba(79, 124, 130, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 124, 130, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 124, 130, 0.3)';
                }}
              >
                Apply Settings
              </button>
            </div>
          </div>
        )}

        <div className="timer-display">
          {formatTime(timerState.timeLeft)}
        </div>
        
        <div className="timer-controls">
          <button onClick={handleStartPause}>
            {timerState.isRunning ? (
              <>
                <Pause className="icon-md" />
                Pause
              </>
            ) : (
              <>
                <Play className="icon-md" />
                Start
              </>
            )}
          </button>
          <button onClick={handleReset}>
            <RotateCcw className="icon-md" />
            Reset
          </button>
        </div>
        
        <div className="timer-info">
          <p>
            {timerState.isBreak
              ? 'Take a short break to refresh your mind'
              : 'Focus on your studies without distractions'}
          </p>
          <p className="timer-info-small">
            Current: {timerState.studyMinutes} min study / {timerState.breakMinutes} min break
          </p>
          {timerState.isRunning && (
            <p className="timer-info-small">
              Next: {timerState.isBreak ? 'Study' : 'Break'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};