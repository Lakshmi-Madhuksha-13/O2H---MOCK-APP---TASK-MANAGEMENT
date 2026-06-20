import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, HardDrive, Users, CheckCircle, Clock, Server, 
  Terminal, RefreshCw, Trash2, Edit2, Check, X, ShieldAlert, KeyRound
} from 'lucide-react';

export default function Admin() {
  const { user: currentAdmin } = useAuth();
  
  // System Health States
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  
  // User Management States
  const [usersList, setUsersList] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState('User');
  const [editDept, setEditDept] = useState('Engineering');
  const [editUsername, setEditUsername] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setActionError('');
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      const logsRes = await api.get('/admin/logs');
      setLogs(logsRes.data);

      const usersRes = await api.get('/admin/users');
      setUsersList(usersRes.data);
    } catch (error) {
      console.error('Failed to load admin stats, logs or users roster:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setActionError('');

    try {
      const response = await api.put(`/admin/users/${editingUser.id}?updatedBy=${currentAdmin?.username || 'Admin'}`, {
        role: editRole,
        department: editDept,
        username: editUsername
      });

      // Update local state
      setUsersList(prev => prev.map(u => u.id === editingUser.id ? response.data : u));
      setEditingUser(null);
      
      // Refresh logs
      const logsRes = await api.get('/admin/logs');
      setLogs(logsRes.data);
    } catch (err) {
      setActionError(err.response?.data?.error || 'Failed to update user account details.');
    }
  };

  const handleDeleteUser = async (userId, username, isFixed) => {
    if (isFixed) {
      alert('System demo accounts are fixed and cannot be deleted.');
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete the account for "${username}"?`)) {
      return;
    }

    setActionError('');
    try {
      await api.delete(`/admin/users/${userId}?deletedBy=${currentAdmin?.username || 'Admin'}`);
      
      // Update local state
      setUsersList(prev => prev.filter(u => u.id !== userId));
      
      // Refresh stats & logs
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
      const logsRes = await api.get('/admin/logs');
      setLogs(logsRes.data);
    } catch (err) {
      setActionError(err.response?.data?.error || 'Failed to delete user account.');
    }
  };

  const formatUptime = (seconds) => {
    if (!seconds) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const formatMemory = (bytes) => {
    if (!bytes) return '0 MB';
    return `${Math.round(bytes / 1024 / 1024)} MB`;
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const roleColors = {
    Admin: 'bg-rose-500/10 border-rose-500/20 text-rose-500',
    Developer: 'bg-sky-500/10 border-sky-500/20 text-[#0ea5e9]',
    User: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glass-panel rounded-3xl bg-gradient-to-r from-orange-500/10 to-transparent">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            Admin Portal & System Control
            <ShieldCheck className="h-6 w-6 text-orange-500" />
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage user roles, check active profiles, monitor uptime, and view audit trails.
          </p>
        </div>
        <button 
          onClick={fetchAdminData}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#f97316] to-[#f97316]/90 text-white text-xs font-bold rounded-xl shadow hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Portal
        </button>
      </div>

      {/* Action Error Alert */}
      {actionError && (
        <div className="flex items-center gap-2.5 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-sm font-medium">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-sky-500/10 text-sky-500 rounded-xl">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Server Uptime</span>
              <span className="text-lg font-bold text-slate-800 dark:text-white mt-1 block">
                {formatUptime(stats.uptime)}
              </span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
              <HardDrive className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Server Heap</span>
              <span className="text-lg font-bold text-slate-800 dark:text-white mt-1 block">
                {formatMemory(stats.memoryUsage?.heapUsed)}
              </span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Profiles</span>
              <span className="text-lg font-bold text-slate-800 dark:text-white mt-1 block">
                {usersList.length} Accounts
              </span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tasks Database</span>
              <span className="text-lg font-bold text-slate-800 dark:text-white mt-1 block">
                {stats.counts?.tasks} Tasks / {stats.counts?.logs} Logs
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Left - User Account Management, Right - Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* User Account Management (Admin & Developer Control) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl text-left space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 dark:border-slate-800/50">
            <Users className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Roster & Profile Administration</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 dark:divide-slate-850">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} alt={u.username} className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-white/10" />
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                            {u.username}
                            {u.fixed && <span className="text-[8px] bg-slate-200 dark:bg-slate-800 text-slate-500 font-extrabold px-1 py-0.2 rounded">DEMO</span>}
                          </div>
                          <div className="text-[10px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${roleColors[u.role] || 'text-slate-400 bg-slate-100/10'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-600 dark:text-slate-300">
                      {u.department}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setEditRole(u.role);
                            setEditDept(u.department);
                            setEditUsername(u.username);
                            setActionError('');
                          }}
                          className="p-1.5 hover:bg-sky-500/10 text-slate-400 hover:text-sky-500 rounded-lg transition-colors cursor-pointer"
                          title="Edit role/department"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.username, u.fixed)}
                          disabled={u.fixed}
                          className={`p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer
                            ${u.fixed ? 'opacity-30 cursor-not-allowed' : ''}
                          `}
                          title={u.fixed ? 'Demo accounts are protected' : 'Delete user profile'}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs Sidebar */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl text-left space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 dark:border-slate-800/50">
            <Terminal className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Database Audits</h3>
          </div>

          <div className="max-h-[350px] overflow-y-auto rounded-2xl border border-white/5 dark:border-slate-800/30 divide-y divide-white/5 dark:divide-slate-800/10 bg-slate-950/20 pr-1">
            {logs.length > 0 ? (
              logs.map(log => (
                <div key={log.id} className="p-3.5 hover:bg-white/5 dark:hover:bg-slate-900/5 transition-colors flex flex-col gap-1.5 text-[11px]">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`px-2 py-0.2 rounded font-extrabold uppercase text-[8px]
                      ${log.action.includes('Failure') ? 'bg-rose-500/10 text-rose-500' : 'bg-[#0ea5e9]/10 text-[#0ea5e9]'}
                    `}>
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-slate-600 dark:text-slate-350 font-bold flex-1 leading-normal">{log.details}</p>
                    <span className="text-slate-500 font-extrabold">@{log.username}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 font-semibold">
                No active audit logs.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl animate-float text-left">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-slate-800/50 mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <KeyRound className="h-4.5 w-4.5 text-orange-500" />
                Manage Profile Roles
              </h3>
              <button 
                onClick={() => setEditingUser(null)}
                className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="h-4.5 w-4.5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              
              {/* Username displaying/editing */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  disabled={editingUser.fixed}
                  className="w-full mt-1.5 px-3 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-850 dark:text-white disabled:opacity-40"
                  required
                />
              </div>

              {/* Role updates */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Account Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  disabled={editingUser.fixed}
                  className="w-full mt-1.5 px-3 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <option value="Admin">Admin</option>
                  <option value="Developer">Developer</option>
                  <option value="User">User</option>
                </select>
                {editingUser.fixed && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">This demo account role is locked to prevent login lockout.</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Department</label>
                <select
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Operations">Operations</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Product">Product</option>
                  <option value="Sales">Sales</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Save & Cancel buttons */}
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#f97316] to-[#f97316]/90 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow cursor-pointer hover:opacity-90"
                >
                  <Check className="h-3.5 w-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
