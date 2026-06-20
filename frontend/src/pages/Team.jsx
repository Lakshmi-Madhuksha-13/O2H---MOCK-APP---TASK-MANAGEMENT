import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Users2, UserPlus2, Trash2, Mail, ShieldAlert, Sparkles, Building } from 'lucide-react';

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Roster registration form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Developer');
  const [department, setDepartment] = useState('Engineering');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await api.get('/team');
      setTeam(response.data);
    } catch (error) {
      console.error('Failed to load team roster:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!username || !email) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await api.post(`/team?requestedBy=${user?.username || 'Admin'}`, {
        username,
        email,
        role,
        department
      });
      
      setTeam(prev => [...prev, response.data]);
      setUsername('');
      setEmail('');
      setSuccess(`Successfully added ${username} to the workspace roster.`);
    } catch (error) {
      console.error('Failed to register member:', error);
      setError(error.response?.data?.error || 'Failed to add workspace user.');
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (user?.username === memberName) {
      alert('You cannot delete your own account from settings.');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove ${memberName} from this workspace?`)) return;

    try {
      await api.delete(`/team/${memberId}?requestedBy=${user?.username || 'Admin'}`);
      setTeam(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
      </div>
    );
  }

  // Check if current user is Admin or Manager to show team insertion form
  const isAuthorized = user && (user.role === 'Admin' || user.role === 'Manager');

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="p-6 glass-panel rounded-3xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          Workspace Team Space
          <Users2 className="h-6 w-6 text-[#0ea5e9]" />
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review details of registered accounts, assign departments, and manage access parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Roster Cards Listing */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.map(member => (
            <div 
              key={member.id}
              className="glass-panel p-5 rounded-2xl flex items-start justify-between border-t-2 border-t-sky-500/30 hover:translate-y-[-2px] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={member.avatar} 
                  alt={member.username} 
                  className="h-12 w-12 rounded-full border-2 border-[#0ea5e9]/20 bg-slate-100"
                />
                <div className="text-left space-y-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">{member.username}</h4>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold"><Mail className="h-3 w-3" /> {member.email}</span>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 bg-[#0ea5e9]/10 text-[#0ea5e9] text-[8px] font-extrabold uppercase rounded">
                      {member.role}
                    </span>
                    <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[8px] font-extrabold uppercase rounded">
                      {member.department}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Delete button (Visible to Admin/Manager only, and cannot delete self) */}
              {isAuthorized && member.username !== user?.username && (
                <button
                  onClick={() => handleRemoveMember(member.id, member.username)}
                  className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                  title="Remove from roster"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Team Member (Visible to Admin/Manager only) */}
        {isAuthorized ? (
          <div className="lg:col-span-4 glass-panel p-6 rounded-3xl text-left space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              Invite Team Member
              <UserPlus2 className="h-5 w-5 text-[#f97316]" />
            </h3>
            <p className="text-xs text-slate-400">Invite a colleague directly by creating their credentials.</p>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-semibold">
                {success}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Username *</label>
                <input
                  type="text"
                  placeholder="e.g. mark_anthony"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email Address *</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Workspace Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="Developer">Developer</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Operations">Operations</option>
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#0ea5e9]/90 hover:from-[#0ea5e9] hover:to-[#f97316] text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
              >
                Register Workspace Roster
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-4 glass-panel p-6 rounded-3xl text-left bg-slate-500/5 text-slate-500 text-xs">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="h-4.5 w-4.5 text-amber-500" /> Administrative Access Only
            </h4>
            <p>You must have the role of Admin or Manager to register or delete team members.</p>
          </div>
        )}

      </div>

    </div>
  );
}
