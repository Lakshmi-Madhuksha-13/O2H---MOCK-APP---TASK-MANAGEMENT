import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, Mail, Sparkles, Building, CheckCircle, Clock, Save, ShieldAlert, Award } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [avatar, setAvatar] = useState('');
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  // Mock list of beautiful avatars to select from
  const avatarList = [
    'https://api.dicebear.com/7.x/adventurer/svg?seed=admin',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=jane',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=john',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar4',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar5',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar6'
  ];

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setDepartment(user.department || 'Engineering');
      setAvatar(user.avatar || avatarList[0]);
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      // Filter tasks assigned to this user
      const userTasks = response.data.filter(t => 
        t.assignee && t.assignee.toLowerCase() === user.username.toLowerCase()
      );
      setTasks(userTasks);
    } catch (error) {
      console.error('Failed to load user tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!email) return;

    const updatedUser = {
      ...user,
      email,
      department,
      avatar
    };

    updateProfile(updatedUser);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!user) return null;

  // Calculate user metrics
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const pending = total - completed;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="p-6 glass-panel rounded-3xl bg-gradient-to-r from-sky-500/10 via-transparent to-orange-500/5">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          My Account Profile
          <Award className="h-6 w-6 text-[#f97316] animate-pulse" />
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize profile variables, track personal task analytics, and choose user avatars.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* User Card & Statistics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center space-y-3">
            <img 
              src={avatar} 
              alt={user.username} 
              className="h-24 w-24 rounded-full border-4 border-[#0ea5e9]/20 bg-slate-100 shadow-md animate-float-slow"
            />
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{user.username}</h3>
              <span className="text-xs text-slate-400 font-semibold">{user.email}</span>
            </div>
            
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-[#0ea5e9]/10 text-[#0ea5e9] text-xs font-bold uppercase rounded-full">
                {user.role}
              </span>
              <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-xs font-bold uppercase rounded-full">
                {user.department}
              </span>
            </div>
          </div>

          {/* User Metrics */}
          <div className="glass-panel p-6 rounded-3xl text-left">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">My Metric Statistics</h4>
            
            {loading ? (
              <div className="py-6 text-center text-slate-400">Loading metrics...</div>
            ) : (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-white/5 rounded-2xl">
                  <span className="text-2xl font-black text-slate-800 dark:text-white">{total}</span>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase mt-1">Assigned</span>
                </div>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <span className="text-2xl font-black text-slate-800 dark:text-white text-emerald-500">{completed}</span>
                  <span className="text-[10px] text-emerald-500 block font-bold uppercase mt-1">Closed</span>
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                  <span className="text-2xl font-black text-slate-800 dark:text-white text-amber-500">{pending}</span>
                  <span className="text-[10px] text-amber-500 block font-bold uppercase mt-1">Pending</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Fields Panel */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-3xl text-left space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white pb-3 border-b border-white/10 dark:border-slate-850">
            Edit User Profile
          </h3>

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-bold">
              {success}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-[#0ea5e9]" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-[#f97316]" /> Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Operations">Operations</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            {/* Avatar Selector Grid */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-[#0ea5e9]" /> Choose Avatar Style
              </label>
              <div className="grid grid-cols-6 gap-2">
                {avatarList.map((avUrl, index) => {
                  const isSelected = avatar === avUrl;
                  return (
                    <img
                      key={index}
                      src={avUrl}
                      alt={`avatar-${index}`}
                      onClick={() => setAvatar(avUrl)}
                      className={`h-11 w-11 rounded-full border-2 bg-slate-100 cursor-pointer p-0.5 transition-transform hover:scale-105
                        ${isSelected ? 'border-[#0ea5e9] ring-2 ring-sky-500/20' : 'border-transparent'}
                      `}
                    />
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#0ea5e9]/90 hover:from-[#0ea5e9] hover:to-[#f97316] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer ml-auto"
            >
              <Save className="h-4 w-4" /> Save Profile Details
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
