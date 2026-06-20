import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import MegaHeader from './components/MegaHeader';
import CommandPalette from './components/CommandPalette';
import PomodoroTimer from './components/PomodoroTimer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Kanban from './pages/Kanban';
import TasksTable from './pages/TasksTable';
import CompletedTasks from './pages/CompletedTasks';
import PendingTasks from './pages/PendingTasks';
import ProgressTasks from './pages/ProgressTasks';
import MyTasks from './pages/MyTasks';
import AddTask from './pages/AddTask';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Reports from './pages/Reports';
import Team from './pages/Team';
import Notifications from './pages/Notifications';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';

import { PlusCircle, Timer, Command, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Floating Action Buttons (FABs) ──────────────────────────────────────────
function FloatingActions({ onPalette, onPomodoro, showPomodoro }) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Quick-Add Task FAB */}
      <Link
        to="/add-task"
        className="group flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#f97316] to-[#f97316]/90 hover:from-[#f97316] hover:to-[#0ea5e9] text-white rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-sky-500/20 font-bold text-sm hover:translate-y-[-2px] transition-all duration-300"
      >
        <PlusCircle className="h-5 w-5" />
        <span className="hidden group-hover:block transition-all">Quick Add Task</span>
      </Link>

      {/* Focus Timer FAB */}
      <button
        onClick={onPomodoro}
        className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl font-bold text-sm hover:translate-y-[-2px] transition-all duration-300 cursor-pointer
          ${showPomodoro
            ? 'bg-slate-700 text-white hover:bg-slate-600'
            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }
        `}
        title="Focus Timer"
      >
        <Timer className="h-5 w-5" />
      </button>

      {/* Command Palette FAB */}
      <button
        onClick={onPalette}
        className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-xl font-bold text-sm hover:translate-y-[-2px] transition-all duration-300 cursor-pointer"
        title="Command Palette (Ctrl+K)"
      >
        <Command className="h-5 w-5" />
      </button>
    </div>
  );
}

// ─── Main Protected Layout ────────────────────────────────────────────────────
function MainLayout({ darkMode, toggleDarkMode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pomodoroOpen, setPomodoroOpen] = useState(false);

  // Global Ctrl+K keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(p => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-20 relative overflow-x-hidden">
      <MegaHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} onOpenPalette={() => setPaletteOpen(true)} />

      <main className="mx-auto max-w-7xl px-4 py-6 relative">
        <Outlet />
      </main>

      {/* Command Palette */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Pomodoro Timer */}
      {pomodoroOpen && <PomodoroTimer onClose={() => setPomodoroOpen(false)} />}

      {/* Floating Action Buttons */}
      <FloatingActions
        onPalette={() => setPaletteOpen(p => !p)}
        onPomodoro={() => setPomodoroOpen(p => !p)}
        showPomodoro={pomodoroOpen}
      />
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('neptune_theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('neptune_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('neptune_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(d => !d);

  return (
    <AuthProvider>
      <WorkspaceProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Layout routes */}
            <Route element={
              <ProtectedRoute>
                <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/tasks" element={<Kanban />} />
              <Route path="/tasks-table" element={<TasksTable />} />
              <Route path="/tasks-completed" element={<CompletedTasks />} />
              <Route path="/tasks-pending" element={<PendingTasks />} />
              <Route path="/tasks-progress" element={<ProgressTasks />} />
              <Route path="/my-tasks" element={<MyTasks />} />
              <Route path="/add-task" element={<AddTask />} />
              <Route path="/settings" element={<Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/team" element={<Team />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
