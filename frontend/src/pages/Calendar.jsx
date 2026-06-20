import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { CalendarDays, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedDayStr, setSelectedDayStr] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks for calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedTasks([]);
    setSelectedDayStr('');
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedTasks([]);
    setSelectedDayStr('');
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to format Date: YYYY-MM-DD
  const formatDateStr = (day) => {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${year}-${pad(month + 1)}-${pad(day)}`;
  };

  const handleDayClick = (day) => {
    const dateStr = formatDateStr(day);
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    setSelectedTasks(dayTasks);
    setSelectedDayStr(dateStr);
  };

  // Build grid items
  const calendarCells = [];
  // Empty slots for offsets
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-24 bg-white/5 dark:bg-slate-900/5 border border-white/5 dark:border-slate-800/10 rounded-xl opacity-20"></div>);
  }

  // Active month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateStr(day);
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    const hasCritical = dayTasks.some(t => t.priority === 'Critical');
    const isSelected = selectedDayStr === dateStr;

    calendarCells.push(
      <div 
        key={`day-${day}`}
        onClick={() => handleDayClick(day)}
        className={`h-24 p-2 border rounded-xl flex flex-col justify-between cursor-pointer transition-all duration-300 text-left
          ${isSelected 
            ? 'bg-[#0ea5e9]/10 border-[#0ea5e9] shadow-md shadow-sky-500/10' 
            : 'bg-white/40 dark:bg-slate-900/40 border-white/20 dark:border-slate-800/40 hover:border-[#0ea5e9]/50 hover:bg-white/60 dark:hover:bg-slate-900/60'
          }
        `}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold ${isSelected ? 'text-[#0ea5e9]' : 'text-slate-500 dark:text-slate-400'}`}>
            {day}
          </span>
          {hasCritical && (
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" title="Critical items due!"></span>
          )}
        </div>
        
        {dayTasks.length > 0 && (
          <div className="space-y-1">
            <div className="text-[9px] font-bold text-slate-400 uppercase">
              {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
            </div>
            <div className="flex gap-0.5 max-w-full overflow-hidden">
              {dayTasks.map(t => (
                <span 
                  key={t.id} 
                  className={`h-1.5 w-1.5 rounded-full 
                    ${t.status === 'Completed' ? 'bg-emerald-500' : t.priority === 'Critical' ? 'bg-rose-500' : 'bg-[#0ea5e9]'}`}
                  title={t.title}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="p-6 glass-panel rounded-3xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          Deadlines & Calendar
          <CalendarDays className="h-6 w-6 text-[#0ea5e9]" />
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor upcoming task delivery bounds mapped on a monthly grid.
        </p>
      </div>

      {/* Calendar Controller Bar */}
      <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-slate-900/30 border border-white/10 dark:border-white/5 rounded-2xl">
        <button 
          onClick={prevMonth}
          className="p-2 hover:bg-white/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-black text-slate-850 dark:text-white uppercase tracking-wider">
          {monthNames[month]} {year}
        </h3>
        <button 
          onClick={nextMonth}
          className="p-2 hover:bg-white/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Main Grid View */}
      <div className="glass-panel p-6 rounded-3xl">
        {/* Days Names */}
        <div className="grid grid-cols-7 gap-4 mb-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Month Day Cells */}
        <div className="grid grid-cols-7 gap-3">
          {calendarCells}
        </div>
      </div>

      {/* Selected Day Agenda Drawer */}
      {selectedDayStr && (
        <div className="glass-panel p-6 rounded-3xl text-left space-y-4 animate-float">
          <div className="pb-3 border-b border-white/10 dark:border-slate-850 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800 dark:text-white">
              Agenda for: <span className="text-[#0ea5e9] font-black">{selectedDayStr}</span>
            </h4>
            <span className="px-2 py-0.5 bg-slate-200/50 dark:bg-slate-850 text-slate-500 rounded font-semibold text-[10px]">
              {selectedTasks.length} items scheduled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedTasks.length > 0 ? (
              selectedTasks.map(task => (
                <div 
                  key={task.id} 
                  className="p-4 bg-white/20 dark:bg-slate-900/20 border border-white/10 dark:border-white/5 rounded-2xl flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-sky-500/10 text-[#0ea5e9] text-[8px] font-bold uppercase rounded">
                      {task.category}
                    </span>
                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">{task.title}</h5>
                    <span className="text-[10px] text-slate-400 font-medium">Assignee: {task.assignee}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded
                    ${task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}
                  `}>
                    {task.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center text-slate-400 font-semibold text-xs">
                No items are due for delivery on this day.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
