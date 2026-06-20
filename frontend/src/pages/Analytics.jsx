import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid, AreaChart, Area
} from 'recharts';
import { 
  BarChart3, Sparkles, User, PieChart as PieIcon, LineChart as LineIcon,
  ShieldCheck, CheckSquare, Zap, Activity
} from 'lucide-react';

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error loading tasks for analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
      </div>
    );
  }

  // Workload analysis: Count of tasks per assignee
  const assigneeWorkload = tasks.reduce((acc, t) => {
    const name = t.assignee || 'Unassigned';
    if (!acc[name]) {
      acc[name] = { name, Completed: 0, Pending: 0, Total: 0 };
    }
    if (t.status === 'Completed') {
      acc[name].Completed++;
    } else {
      acc[name].Pending++;
    }
    acc[name].Total++;
    return acc;
  }, {});

  const workloadData = Object.values(assigneeWorkload);

  // Category breakdown
  const categoryCounts = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  // Trend Analysis: Task accumulation
  const tasksByDate = tasks.reduce((acc, t) => {
    const dateStr = t.createdAt ? t.createdAt.split('T')[0] : 'Prior';
    if (!acc[dateStr]) {
      acc[dateStr] = { date: dateStr, Created: 0, Completed: 0 };
    }
    acc[dateStr].Created++;
    if (t.status === 'Completed') {
      acc[dateStr].Completed++;
    }
    return acc;
  }, {});

  const trendData = Object.keys(tasksByDate)
    .sort()
    .map(date => ({
      date,
      Created: tasksByDate[date].Created,
      Completed: tasksByDate[date].Completed
    }));

  const COLORS = ['#0ea5e9', '#f97316', '#a855f7', '#10b981', '#f59e0b', '#64748b'];

  // Performance computations
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const efficiency = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="p-6 glass-panel rounded-3xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          Deep-Dive Reports & Analytics
          <BarChart3 className="h-6 w-6 text-[#0ea5e9]" />
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review structural workloads, sprint progression vectors, category breakdown, and team delivery efficiency rates.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3.5 bg-[#0ea5e9]/10 text-[#0ea5e9] rounded-2xl">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Workspace Efficiency</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white mt-1">{efficiency}% Completion Rate</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3.5 bg-purple-500/10 text-purple-500 rounded-2xl">
            <Activity className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sprint Velocity</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white mt-1">Stable (High-Frequency)</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sprint Closed Items</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white mt-1">{completedCount} tasks resolved</span>
          </div>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Workspace Delivery Trends */}
        <div className="glass-panel p-6 rounded-3xl lg:col-span-12">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-1.5">
            <LineIcon className="h-4.5 w-4.5 text-[#0ea5e9]" /> Delivery & Creation Trends
          </h3>
          <p className="text-xs text-slate-400 mb-6">Historical aggregation showing when tasks were created vs completed.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData.length > 0 ? trendData : [{ date: 'Today', Created: 0, Completed: 0 }]}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(10, 15, 28, 0.8)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="Created" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorCreated)" strokeWidth={2} />
                <Area type="monotone" dataKey="Completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workload and Category analysis split */}
        <div className="glass-panel p-6 rounded-3xl lg:col-span-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-1.5">
            <User className="h-4.5 w-4.5 text-[#f97316]" /> Workspace Workload Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-6">Compare completed vs pending tasks for each assignee.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.05)" />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(10, 15, 28, 0.8)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Pending" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl lg:col-span-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-1.5">
            <PieIcon className="h-4.5 w-4.5 text-purple-500" /> Category Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-6">Distribution of tasks across departments and categories.</p>
          <div className="h-64 flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              <span className="text-sm text-slate-400">No categories tracked yet</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
