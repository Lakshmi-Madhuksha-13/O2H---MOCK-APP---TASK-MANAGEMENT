import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, BarChart3, KanbanSquare, Table2, PlusCircle, 
  Users2, BellRing, CalendarDays, Settings2, FileDown, ShieldCheck, User2,
  CheckCircle2, Sparkles, AlertCircle, Command, X } from 'lucide-react';

const allCommands = [
  { label: 'Go to Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
  { label: 'Go to Analytics', path: '/analytics', icon: BarChart3, category: 'Navigation' },
  { label: 'Open Kanban Board', path: '/tasks', icon: KanbanSquare, category: 'Navigation' },
  { label: 'View Data Table', path: '/tasks-table', icon: Table2, category: 'Navigation' },
  { label: 'Create New Task', path: '/add-task', icon: PlusCircle, category: 'Actions' },
  { label: 'My Assigned Tasks', path: '/my-tasks', icon: User2, category: 'Navigation' },
  { label: 'Completed Tasks', path: '/tasks-completed', icon: CheckCircle2, category: 'Filter' },
  { label: 'In Progress Tasks', path: '/tasks-progress', icon: Sparkles, category: 'Filter' },
  { label: 'Pending Tasks', path: '/tasks-pending', icon: AlertCircle, category: 'Filter' },
  { label: 'Team Space', path: '/team', icon: Users2, category: 'Navigation' },
  { label: 'Notifications & Alerts', path: '/notifications', icon: BellRing, category: 'Navigation' },
  { label: 'Calendar & Deadlines', path: '/calendar', icon: CalendarDays, category: 'Navigation' },
  { label: 'Reports & Export', path: '/reports', icon: FileDown, category: 'Navigation' },
  { label: 'Settings & Preferences', path: '/settings', icon: Settings2, category: 'Navigation' },
  { label: 'My Profile', path: '/profile', icon: User2, category: 'Navigation' },
  { label: 'Admin Portal', path: '/admin', icon: ShieldCheck, category: 'Admin' },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const filtered = allCommands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && filtered[selected]) {
        navigate(filtered[selected].path);
        onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, filtered, selected, navigate, onClose]);

  if (!isOpen) return null;

  const categoryColors = {
    Navigation: 'text-sky-500 bg-sky-500/10',
    Actions: 'text-orange-500 bg-orange-500/10',
    Filter: 'text-purple-500 bg-purple-500/10',
    Admin: 'text-rose-500 bg-rose-500/10',
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 bg-slate-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl glass-nav rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 dark:border-slate-800/50">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, actions, filters..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            className="flex-1 bg-transparent text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
            <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">ESC</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length > 0 ? (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              const isActive = i === selected;
              return (
                <button
                  key={cmd.path}
                  onClick={() => { navigate(cmd.path); onClose(); }}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer
                    ${isActive ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]' : 'text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/30'}
                  `}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#0ea5e9]' : 'text-slate-400'}`} />
                  <span className="flex-1 text-sm font-semibold">{cmd.label}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${categoryColors[cmd.category] || 'text-slate-400'}`}>
                    {cmd.category}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center text-sm text-slate-400 font-semibold">
              No commands matching "<span className="text-[#0ea5e9]">{query}</span>"
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-950/30">
          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <Command className="h-3 w-3" /> K to open · ↑↓ to navigate · ↵ to select
          </span>
          <span className="text-[10px] font-semibold text-slate-400">{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
}
