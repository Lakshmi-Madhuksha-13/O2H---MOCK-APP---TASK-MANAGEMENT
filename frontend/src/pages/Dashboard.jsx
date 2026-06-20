import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  CheckCircle, Clock, AlertTriangle, ListTodo, 
  ArrowUpRight, Users, Sparkles, TrendingUp, Calendar, AlertOctagon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksRes = await api.get('/tasks');
        setTasks(tasksRes.data);
        
        const teamRes = await api.get('/team');
        setTeamCount(teamRes.data.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
          <span className="text-sm font-semibold tracking-wider text-[#0ea5e9]">Loading workspace...</span>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'Todo' || t.status === 'Backlog').length;
  
  // Calculate Overdue
  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => {
    return t.dueDate && t.dueDate < today && t.status !== 'Completed';
  }).length;

  // Process data for Status Pie Chart
  const statusCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const COLORS = {
    'Completed': '#10b981',
    'In Progress': '#0ea5e9',
    'Review': '#a855f7',
    'Todo': '#f59e0b',
    'Backlog': '#64748b'
  };

  const DEFAULT_COLORS = ['#0ea5e9', '#f97316', '#10b981', '#a855f7', '#64748b'];

  // Process data for Priority Bar Chart
  const priorityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  tasks.forEach(t => {
    if (priorityCounts[t.priority] !== undefined) {
      priorityCounts[t.priority]++;
    }
  });

  const barData = Object.keys(priorityCounts).map(prio => ({
    priority: prio,
    Count: priorityCounts[prio]
  }));

  // Critical tasks list for dashboard
  const criticalTasks = tasks
    .filter(t => t.priority === 'Critical' && t.status !== 'Completed')
    .slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Top Banner section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glass-panel rounded-3xl bg-gradient-to-r from-sky-500/10 via-transparent to-orange-500/5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            {activeWorkspace?.type === 'Personal' 
              ? 'My Workspace' 
              : 'Organization Workspace'}
            <Sparkles className="h-6 w-6 text-[#f97316] animate-pulse" />
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeWorkspace?.type === 'Personal' 
              ? 'Manage your everyday workflows, goals, and personal habits.' 
              : `Enterprise overview of projects, sprints, and team activity for ${activeWorkspace?.name || 'Workspace'}.`}
          </p>
        </div>
        <Link 
          to="/add-task"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#0ea5e9]/90 hover:from-[#0ea5e9] hover:to-[#f97316] text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/10 hover:shadow-orange-500/10 hover:translate-y-[-1px] transition-all duration-300 cursor-pointer"
        >
          Add New Task
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {activeWorkspace?.type === 'Personal' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Personal KPIs */}
          <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today's Tasks</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 dark:text-white">{pendingTasks}</span>
              <span className="text-[10px] font-semibold text-sky-500">pending</span>
            </div>
          </div>
          <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Productivity Score</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 dark:text-white">85</span>
              <span className="text-[10px] font-semibold text-emerald-500">Excellent</span>
            </div>
          </div>
          <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daily Goals</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 dark:text-white">3/4</span>
              <span className="text-[10px] font-semibold text-amber-500">75%</span>
            </div>
          </div>
          <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Habit Completion</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 dark:text-white">92%</span>
              <span className="text-[10px] font-semibold text-emerald-500">On Fire!</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Projects</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 dark:text-white">3</span>
            </div>
          </div>
          <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ongoing Sprints</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 dark:text-white">2</span>
            </div>
          </div>
          <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Approvals</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 dark:text-white">7</span>
              <span className="text-[10px] font-semibold text-rose-500">action required</span>
            </div>
          </div>
          <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tasks Completed</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 dark:text-white">{completedTasks}</span>
            </div>
          </div>
          <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Health</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 dark:text-white">96%</span>
              <span className="text-[10px] font-semibold text-emerald-500">Optimal</span>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Status Distribution (Pie Chart) */}
        <div className="glass-panel p-6 rounded-3xl lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Status Distribution</h3>
            <p className="text-xs text-slate-400">Proportional representation of task stages.</p>
          </div>
          <div className="h-64 mt-4 flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(10, 15, 28, 0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-sm text-slate-400">No task statuses to analyze</span>
            )}
          </div>
        </div>

        {/* Priority Analysis (Bar Chart) */}
        <div className="glass-panel p-6 rounded-3xl lg:col-span-7 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Priority Breakdown</h3>
            <p className="text-xs text-slate-400">Total active task counts categorized by priority weight.</p>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="priority" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(10, 15, 28, 0.8)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                  cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
                />
                <Bar dataKey="Count" fill="url(#barGradient)" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => {
                    let fill = '#0ea5e9';
                    if (entry.priority === 'Critical') fill = '#ef4444';
                    else if (entry.priority === 'High') fill = '#f97316';
                    else if (entry.priority === 'Medium') fill = '#eab308';
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Critical Tasks Tracker Section */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              Critical Actions Watchlist
              <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase rounded-full">High Alert</span>
            </h3>
            <p className="text-xs text-slate-400">Tasks marked Critical that are outstanding.</p>
          </div>
          <Link to="/tasks" className="text-xs font-bold text-[#0ea5e9] hover:underline flex items-center gap-0.5">
            Full Kanban Board <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {criticalTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalTasks.map(task => (
              <div 
                key={task.id}
                className="flex items-center justify-between p-4 bg-white/20 dark:bg-slate-900/20 border border-white/10 dark:border-white/5 rounded-2xl hover:border-[#0ea5e9]/30 transition-all duration-300"
              >
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[9px] font-bold uppercase rounded-md">
                    {task.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">{task.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {task.dueDate || 'No due date'}</span>
                    <span>Assignee: <span className="text-[#0ea5e9] font-semibold">{task.assignee}</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold rounded-lg uppercase">
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-white/10 dark:bg-slate-900/10 rounded-2xl">
            <CheckCircle className="h-10 w-10 text-emerald-500 mb-2" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Critical Risks Checked</h4>
            <p className="text-xs text-slate-400 mt-0.5">All highly critical issues are completed or unassigned.</p>
          </div>
        )}
      </div>

    </div>
  );
}
