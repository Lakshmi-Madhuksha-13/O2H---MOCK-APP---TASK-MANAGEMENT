import React, { useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  LayoutDashboard, BarChart3, KanbanSquare, Table2, CheckCircle2, 
  AlertCircle, ShieldCheck, FileDown, Users2, BellRing, 
  CalendarDays, Settings2, LogOut, Sun, Moon, Sparkles, User2, PlusCircle, Compass, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function MegaHeader({ darkMode, toggleDarkMode }) {
  const { user, logout } = useAuth();
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Define navigation pills based on Workspace Type
  const isPersonal = activeWorkspace?.type === 'Personal';

  let navItems = [];
  if (isPersonal) {
    navItems = [
      { to: '/dashboard', label: 'My Workspace', icon: LayoutDashboard },
      { to: '/my-tasks', label: 'My Tasks', icon: User2 },
      { to: '/calendar', label: 'Calendar', icon: CalendarDays },
      { to: '/goals', label: 'Goals', icon: CheckCircle2 },
      { to: '/habits', label: 'Habits', icon: CheckCircle2 },
      { to: '/notes', label: 'Notes', icon: FileDown },
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/focus', label: 'Focus Mode', icon: Sparkles },
      { to: '/reports', label: 'Reports', icon: FileDown },
      { to: '/settings', label: 'Settings', icon: Settings2 }
    ];
  } else {
    navItems = [
      { to: '/dashboard', label: 'Org Dashboard', icon: LayoutDashboard },
      { to: '/projects', label: 'Projects', icon: KanbanSquare },
      { to: '/team', label: 'Teams', icon: Users2 },
      { to: '/tasks', label: 'Enterprise Tasks', icon: KanbanSquare },
      { to: '/sprints', label: 'Sprints', icon: Table2 },
      { to: '/meetings', label: 'Meetings', icon: CalendarDays },
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/reports', label: 'Reports', icon: FileDown },
      { to: '/notifications', label: 'Alerts', icon: BellRing },
      { to: '/settings', label: 'Settings', icon: Settings2 }
    ];
  }

  // If Admin, append admin panel route
  if (user && user.role === 'Admin') {
    navItems.push({ to: '/admin', label: 'Admin Portal', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 no-print">
      <div className="mx-auto max-w-7xl glass-nav rounded-2xl px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
        
        {/* Brand Logo & Switcher */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="relative">
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className="flex items-center gap-2 cursor-pointer group px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <div className="p-2 bg-gradient-to-tr from-[#0ea5e9] to-[#f97316] rounded-xl shadow-lg group-hover:scale-105 transition-all duration-300">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#0ea5e9] via-[#38bdf8] to-[#f97316] bg-clip-text text-transparent flex items-center gap-1">
                  Neptune Flow
                </span>
                <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-none mt-0.5 flex items-center gap-1">
                  ▼ {activeWorkspace ? activeWorkspace.name : 'Select Workspace'}
                </span>
              </div>
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400">Your Workspaces</div>
                {workspaces.map(w => (
                  <button
                    key={w.id}
                    onClick={() => {
                      switchWorkspace(w.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between
                      ${activeWorkspace?.id === w.id 
                        ? 'bg-sky-50 dark:bg-slate-800 text-[#0ea5e9]' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'}
                    `}
                  >
                    {w.name}
                    {w.type === 'Personal' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-600">Personal</span>}
                    {w.type === 'Organization' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900 text-sky-600">Org</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Mobile Dark Mode and Logout controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-600" />}
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 rounded-xl"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Pills Container */}
        <div className="relative flex items-center w-full md:max-w-[65%] xl:max-w-[70%]">
          {/* Scroll Left Button */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 z-10 p-1.5 bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-800/50 rounded-full shadow hover:scale-105 transition-transform"
          >
            <ChevronLeft className="h-3 w-3 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Horizontally Scrollable Bar */}
          <div 
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto w-full px-7 py-1 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#0ea5e9] to-[#0ea5e9]/90 text-white shadow-md shadow-sky-500/20 translate-y-[-1px]' 
                      : 'bg-white/40 dark:bg-slate-800/30 hover:bg-white/70 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-white/10 dark:border-white/5'
                    }
                  `}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'animate-pulse' : 'text-[#0ea5e9] group-hover:text-[#f97316]'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button 
            onClick={scrollRight}
            className="absolute right-0 z-10 p-1.5 bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-800/50 rounded-full shadow hover:scale-105 transition-transform"
          >
            <ChevronRight className="h-3 w-3 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* User profile card & control buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* User Widget */}
          {user && (
            <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-white/30 dark:bg-slate-900/30 border border-white/10 dark:border-white/5 rounded-full">
              <img 
                src={user.avatar} 
                alt={user.username} 
                className="h-7 w-7 rounded-full bg-slate-200 border border-white/20"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-none">{user.username}</span>
                <span className="text-[9px] font-medium text-slate-400 mt-0.5">{user.role}</span>
              </div>
            </div>
          )}

          {/* Theme toggler */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 border border-white/10 dark:border-white/5 rounded-full transition-colors"
            title="Toggle Theme Mode"
          >
            {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-slate-400" />}
          </button>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-full transition-all duration-300 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>

      </div>
    </header>
  );
}
