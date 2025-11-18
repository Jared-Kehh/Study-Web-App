import { TimerMode } from '../types';

interface ChatContext {
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

export const processChatMessage = (message: string, context: ChatContext): void => {
  const { 
    mode, 
    isRunning, 
    completedSessions, 
    timeLeft, 
    notesCount,
    addBotMessage,
    createNewNote,
    openNotes,
    startTimer,
    pauseTimer,
    resetTimer,
    setStudyTime,
    setBreakTime
  } = context;

  // Simulate typing delay
  setTimeout(() => {
    if (message.includes('note') || message.includes('write')) {
      if (message.includes('new') || message.includes('create')) {
        createNewNote();
        openNotes();
        addBotMessage("Created a new note for you! Start writing your thoughts. 📝");
      } else {
        addBotMessage(`I can help you with notes! You can:
• Create new notes
• Search through your notes
• Add tags to organize them
• Save important study information

You have ${notesCount} notes saved. Want to create a new one?`);
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
      const studyMinutes = message.match(/\d+/)?.[0];
      if (studyMinutes) {
        setStudyTime(Number(studyMinutes));
        addBotMessage(`Study time set to ${studyMinutes} minutes! 📚`);
      } else {
        addBotMessage("Current study time is 25 minutes. You can change it in the settings or tell me 'set study time to X minutes'!");
      }
    } else if (message.includes('break time') || message.includes('break duration')) {
      const breakMinutes = message.match(/\d+/)?.[0];
      if (breakMinutes) {
        setBreakTime(Number(breakMinutes));
        addBotMessage(`Break time set to ${breakMinutes} minutes! ☕`);
      } else {
        addBotMessage("Current break time is 5 minutes. You can change it in the settings or tell me 'set break time to X minutes'!");
      }
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
• Notes saved: ${notesCount}
• Next: ${mode === 'study' ? 'Break' : 'Study'} time

Keep up the great work! 📊`);
    } else if (message.includes('thank') || message.includes('thanks')) {
      addBotMessage("You're welcome! Happy studying! 😊");
    } else {
      addBotMessage("I'm here to help with your study sessions! You can ask me about:\n• Starting/pausing timer\n• Study techniques\n• Motivation\n• Session stats\n• Taking notes\n\nWhat would you like to know?");
    }
  }, 1000);
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};