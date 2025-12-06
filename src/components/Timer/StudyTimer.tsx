import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const StudyTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (!isBreak) {
        alert('Study session complete! Time for a 5-minute break.');
        setIsBreak(true);
        setTimeLeft(5 * 60);
      } else {
        alert('Break time is over! Ready for another study session?');
        setIsBreak(false);
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isBreak ? 'Break Time' : 'Study Session'}
          </h2>
          <div className="text-7xl font-bold text-indigo-600 mb-8">
            {formatTime(timeLeft)}
          </div>
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={handleStartPause}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              {isBreak
                ? 'Take a short break to refresh your mind'
                : 'Focus on your studies without distractions'}
            </p>
            <p className="text-xs text-gray-500">
              Using the Pomodoro Technique: 25 min study / 5 min break
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};