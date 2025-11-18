import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerMode } from '../types';

const DEFAULT_STUDY_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;

export const useTimer = () => {
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_STUDY_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<TimerMode>('study');
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  
  const studyTimeRef = useRef<number>(DEFAULT_STUDY_TIME);
  const breakTimeRef = useRef<number>(DEFAULT_BREAK_TIME);
  const intervalRef = useRef<number | null>(null);

  const handleTimerComplete = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (mode === 'study') {
      setMode('break');
      setTimeLeft(breakTimeRef.current);
      setCompletedSessions(prev => prev + 1);
    } else {
      setMode('study');
      setTimeLeft(studyTimeRef.current);
    }
    
    setIsRunning(false);
    
    if (Notification.permission === 'granted') {
      new Notification(`Time's up! ${mode === 'study' ? 'Take a break!' : 'Back to study!'}`);
    }
  }, [mode]);

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
  }, [isRunning, timeLeft, handleTimerComplete]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeLeft(mode === 'study' ? studyTimeRef.current : breakTimeRef.current);
  }, [mode]);

  const skipSession = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (mode === 'study') {
      setMode('break');
      setTimeLeft(breakTimeRef.current);
    } else {
      setMode('study');
      setTimeLeft(studyTimeRef.current);
    }
  }, [mode]);

  const setStudyTime = useCallback((minutes: number) => {
    studyTimeRef.current = minutes * 60;
    if (mode === 'study' && !isRunning) {
      setTimeLeft(studyTimeRef.current);
    }
  }, [mode, isRunning]);

  const setBreakTime = useCallback((minutes: number) => {
    breakTimeRef.current = minutes * 60;
    if (mode === 'break' && !isRunning) {
      setTimeLeft(breakTimeRef.current);
    }
  }, [mode, isRunning]);

  return {
    timeLeft,
    isRunning,
    mode,
    completedSessions,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    setStudyTime,
    setBreakTime,
  };
};