import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { CheckCircle2, Calendar, User, Search, RefreshCw, MessageSquare } from 'lucide-react';
import TaskDetailsModal from '../components/TaskDetailsModal';

export default function CompletedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tasks');
      const completed = response.data.filter(t => t.status === 'Completed');
      setTasks(completed);
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glass-panel rounded-3xl bg-gradient-to-r from-emerald-500/10 to-transparent">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            Completed Tasks
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Archived logs of all finalized deliverables and tasks in this workspace.
          </p>
        </div>
        <button 
          onClick={fetchCompletedTasks}
          className="p-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Filter completed tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
        />
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(task => (
            <div 
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="glass-panel p-5 rounded-2xl flex flex-col border-t-4 border-t-emerald-500 hover:translate-y-[-2px] hover:border-emerald-500/30 transition-all duration-300 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase rounded">
                  {task.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">#{task.id}</span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{task.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed flex-grow">
                {task.description || 'No description provided.'}
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {task.dueDate || 'No Due Date'}</span>
                  {task.comments?.length > 0 && (
                    <span className="flex items-center gap-0.5 text-emerald-500 font-bold"><MessageSquare className="h-3.5 w-3.5" /> {task.comments.length}</span>
                  )}
                </div>
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-emerald-500" /> {task.assignee}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/10 dark:bg-slate-900/10 rounded-2xl p-6">
          <CheckCircle2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700 dark:text-slate-300">No Completed Items Found</h4>
          <p className="text-xs text-slate-400 mt-1">Keep working on active tickets to close them!</p>
        </div>
      )}
      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onUpdate={() => {
            fetchCompletedTasks();
            // Refresh local selected task to show new comments
            api.get('/tasks').then(res => {
              const updated = res.data.find(t => t.id === selectedTask.id);
              if (updated) setSelectedTask(updated);
            });
          }}
        />
      )}
    </div>
  );
}
