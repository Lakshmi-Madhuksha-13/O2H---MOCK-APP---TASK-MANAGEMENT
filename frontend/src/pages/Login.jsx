import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, User, Lock, ArrowRight, ShieldAlert, Shield, Code, UserCircle } from 'lucide-react';

const ROLE_TABS = [
  { key: 'Admin', label: 'Admin', icon: Shield, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', 
    desc: 'Full platform control. System-managed account.',
    creds: [{ username: 'admin', password: 'Admin@2026', label: 'System Admin' }]
  },
  { key: 'Developer', label: 'Developer', icon: Code, color: 'text-[#0ea5e9]', bg: 'bg-sky-500/10', border: 'border-sky-500/30',
    desc: 'Task management and collaboration. System-managed account.',
    creds: [
      { username: 'jane_doe', password: 'Dev@2026', label: 'Jane Doe (Frontend)' },
      { username: 'john_smith', password: 'Dev@2026', label: 'John Smith (Backend)' }
    ]
  },
  { key: 'User', label: 'User', icon: UserCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30',
    desc: 'Collaborate, view and comment on tasks. Self-registerable.',
    creds: [{ username: 'alice', password: 'User@2026', label: 'Alice (Sample User)' }]
  },
];

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Admin');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('Please fill in all fields.'); return; }
    setError(''); setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  const fillCreds = (uname, pwd) => {
    setUsername(uname);
    setPassword(pwd);
    setError('');
  };

  const activeRole = ROLE_TABS.find(t => t.key === activeTab);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#fed7aa] dark:from-[#0a0f1c] dark:via-[#0c162d] dark:to-[#1e1b4b] p-4">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl animate-float pointer-events-none"></div>

      <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 text-center animate-float">

        {/* Logo */}
        <div className="flex flex-col items-center mb-5">
          <div className="p-3 bg-gradient-to-tr from-[#0ea5e9] to-[#f97316] rounded-2xl shadow-xl mb-3">
            <Compass className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Neptune TaskFlow</h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Enterprise Portal</p>
        </div>

        {/* Role selector tabs */}
        <div className="flex gap-1 p-1 bg-white/20 dark:bg-slate-900/20 rounded-2xl mb-5">
          {ROLE_TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setError(''); }}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
                  ${activeTab === tab.key ? `${tab.bg} ${tab.color} shadow border ${tab.border}` : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Role description */}
        <p className="text-xs text-slate-400 font-medium mb-4 px-2">{activeRole.desc}</p>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-medium text-left">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Username</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Enter username" value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input type="password" placeholder="Enter password" value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-gradient-to-r from-[#0ea5e9] to-[#0ea5e9]/90 hover:from-[#0ea5e9] hover:to-[#f97316] text-white rounded-xl font-bold shadow-md hover:translate-y-[-1px] transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Quick-Fill Credentials */}
        <div className="mt-5 p-4 bg-white/30 dark:bg-slate-900/30 border border-white/10 rounded-2xl text-left">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
            Quick Access — {activeRole.label} Accounts
          </p>
          <div className="flex flex-wrap gap-2">
            {activeRole.creds.map(c => (
              <button key={c.username} onClick={() => fillCreds(c.username, c.password)}
                className={`px-2.5 py-1.5 ${activeRole.bg} ${activeRole.color} border ${activeRole.border} rounded-lg text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Register link for Users */}
        <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
          New user?{' '}
          <Link to="/register" className="text-emerald-500 hover:text-[#f97316] font-bold underline transition-colors">
            Create a User account
          </Link>
        </p>
      </div>
    </div>
  );
}
