import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Coffee, Zap } from 'lucide-react';

const MODES = {
  focus: { label: 'Focus', minutes: 25, color: 'text-[#0ea5e9]', bg: 'bg-[#0ea5e9]' },
  short: { label: 'Short Break', minutes: 5, color: 'text-emerald-500', bg: 'bg-emerald-500' },
  long: { label: 'Long Break', minutes: 15, color: 'text-purple-500', bg: 'bg-purple-500' },
};

export default function PomodoroTimer({ onClose }) {
  const [mode, setMode] = useState('focus');
  const [secondsLeft, setSecondsLeft] = useState(MODES['focus'].minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const current = MODES[mode];
  const totalSeconds = current.minutes * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const switchMode = (newMode) => {
    setMode(newMode);
    setSecondsLeft(MODES[newMode].minutes * 60);
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === 'focus') setSessions(n => n + 1);
            // Browser notification
            if (Notification.permission === 'granted') {
              new Notification('Neptune TaskFlow Timer', {
                body: mode === 'focus' ? '🎉 Focus session done! Take a break.' : '⚡ Break over! Time to focus.',
                icon: '/favicon.ico'
              });
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const requestNotifPermission = () => {
    if (Notification.permission === 'default') Notification.requestPermission();
  };

  const pad = (n) => String(n).padStart(2, '0');
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  // Circular SVG progress ring
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-72 glass-panel rounded-3xl shadow-2xl p-5 text-center animate-float">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
          <Timer className="h-4.5 w-4.5 text-[#0ea5e9]" />
          <span className="text-sm font-bold">Focus Timer</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-orange-500 px-2 py-0.5 bg-orange-500/10 rounded-full">
            {sessions} 🍅
          </span>
          <button onClick={onClose} className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-1 mb-4 bg-white/20 dark:bg-slate-900/20 p-1 rounded-xl">
        {Object.entries(MODES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer
              ${mode === key ? 'bg-white dark:bg-slate-800 shadow text-slate-800 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}
            `}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Circular countdown clock */}
      <div className="relative flex items-center justify-center my-2">
        <svg width="130" height="130" className="-rotate-90">
          <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="8" />
          <circle
            cx="65" cy="65" r={radius}
            fill="none"
            stroke={mode === 'focus' ? '#0ea5e9' : mode === 'short' ? '#10b981' : '#a855f7'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-3xl font-black tabular-nums ${current.color}`}>
            {pad(mins)}:{pad(secs)}
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            {current.label}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={() => { setSecondsLeft(current.minutes * 60); setRunning(false); }}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          onClick={() => { setRunning(r => !r); requestNotifPermission(); }}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-white font-bold text-sm shadow-lg transition-all cursor-pointer
            ${running ? 'bg-slate-500 hover:bg-slate-600' : 'bg-gradient-to-r from-[#0ea5e9] to-[#0ea5e9]/90 hover:from-[#0ea5e9] hover:to-[#f97316]'}
          `}
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  );
}
