import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, User, Mail, Lock, ArrowRight, ShieldAlert, UserCircle, Info, Landmark, UserCheck } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [category, setCategory] = useState('Personal'); // 'Personal' or 'Company'
  const [department, setDepartment] = useState('General');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) { setError('Please fill all required fields.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setError(''); setLoading(true);
    // If Personal Category selected, set department automatically to 'Personal'
    const finalDepartment = category === 'Personal' ? 'Personal' : department;
    
    // Register accepts additional fields (like category) automatically via body payload
    const result = await register(username, email, password, 'User', finalDepartment, category);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#fed7aa] dark:from-[#0a0f1c] dark:via-[#0c162d] dark:to-[#1e1b4b] p-4">
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl animate-float pointer-events-none"></div>

      <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 text-center animate-float">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-5">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-[#0ea5e9] rounded-2xl shadow-xl mb-3">
            <UserCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Join Neptune TaskFlow</h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Workspace Portal Registration</p>
        </div>

        {/* Category selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-white/20 dark:bg-slate-900/20 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => setCategory('Personal')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1
              ${category === 'Personal' 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 shadow' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}
            `}
          >
            <UserCheck className="h-4 w-4" />
            <span>Personal User</span>
          </button>
          
          <button
            type="button"
            onClick={() => setCategory('Company')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1
              ${category === 'Company' 
                ? 'bg-sky-500/10 border border-sky-500/30 text-[#0ea5e9] shadow' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}
            `}
          >
            <Landmark className="h-4 w-4" />
            <span>Company / Industry</span>
          </button>
        </div>

        {/* Category Info Banner */}
        <div className="mb-4 flex items-start gap-2 p-3 bg-white/30 dark:bg-slate-900/30 border border-white/10 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-350 text-left">
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-[#0ea5e9]" />
          <span>
            {category === 'Personal' 
              ? "Personal Mode: Create a private workspace. None of the default system tasks will populate your dashboard." 
              : "Company Mode: Map your account to an engineering department to collaborate with team developers and admins."}
          </span>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-medium text-left">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          
          {/* Username */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Username *</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input type="text" placeholder="e.g. mark_james" value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Email Address *</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Password *</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input type="password" placeholder="Min 6 chars" value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Confirm *</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input type="password" placeholder="Repeat" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Department - Only shown for Company & Industry members */}
          {category === 'Company' && (
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Company Department</label>
              <select value={department} onChange={e => setDepartment(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white appearance-none cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 mt-4 bg-gradient-to-r from-emerald-500 to-emerald-500/90 hover:from-emerald-500 hover:to-[#0ea5e9] text-white rounded-xl font-bold shadow-md hover:translate-y-[-1px] transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Creating Profile...' : 'Complete Registration'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0ea5e9] hover:text-[#f97316] font-bold underline transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
