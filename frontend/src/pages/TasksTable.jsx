import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Table2, Search, ArrowUpDown, Calendar, User, ArrowUpRight,
  Filter, CheckSquare, Clock, AlertTriangle, Eye, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TaskDetailsModal from '../components/TaskDetailsModal';

export default function TasksTable() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);

  // Sorting state
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks for data grid:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  // Perform filtering
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          task.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Perform sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    // Handle null values
    if (aVal === null || aVal === undefined) aVal = '';
    if (bVal === null || bVal === undefined) bVal = '';

    // Convert string for case-insensitive sort
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
      case 'High':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-500';
      case 'Medium':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'Low':
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
      case 'In Progress':
        return 'bg-sky-500/10 border-sky-500/20 text-sky-500';
      case 'Review':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-500';
      case 'Todo':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'Backlog':
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glass-panel rounded-3xl">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            Workspace Data Grid
            <Table2 className="h-6 w-6 text-[#0ea5e9]" />
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Perform multi-column sort, quick-filtering, and search all tasks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchTasks}
            className="p-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-xl text-slate-600 dark:text-slate-300 cursor-pointer"
            title="Refresh database"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link 
            to="/add-task"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#0ea5e9]/90 hover:from-[#0ea5e9] hover:to-[#f97316] text-white text-sm font-bold rounded-xl shadow-lg cursor-pointer"
          >
            Create Task
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Filters Area */}
      <div className="p-5 bg-white/30 dark:bg-slate-900/30 border border-white/10 dark:border-white/5 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <Filter className="h-4 w-4 text-[#0ea5e9]" />
          <span>Active Search & Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search bar */}
          <div className="relative md:col-span-6">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks by title, summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
            />
          </div>

          {/* Status selector */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Backlog">Backlog</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority selector */}
          <div className="md:col-span-3">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white appearance-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Table Container */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0ea5e9]"></div>
              <span className="text-sm font-semibold tracking-wider text-slate-400">Loading details...</span>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider border-b border-white/10 dark:border-slate-800/50">
                <tr>
                  <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/30" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1.5">
                      <span>ID</span>
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/30" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-1.5">
                      <span>Title</span>
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/30" onClick={() => handleSort('category')}>
                    <div className="flex items-center gap-1.5">
                      <span>Category</span>
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/30" onClick={() => handleSort('priority')}>
                    <div className="flex items-center gap-1.5">
                      <span>Priority</span>
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/30" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1.5">
                      <span>Status</span>
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/30" onClick={() => handleSort('assignee')}>
                    <div className="flex items-center gap-1.5">
                      <span>Assignee</span>
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/30" onClick={() => handleSort('dueDate')}>
                    <div className="flex items-center gap-1.5">
                      <span>Due Date</span>
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 dark:divide-slate-800/20">
                {sortedTasks.length > 0 ? (
                  sortedTasks.map((task) => (
                    <tr 
                      key={task.id} 
                      className="hover:bg-white/10 dark:hover:bg-slate-900/10 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-slate-400">
                        #{task.id}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-slate-100">{task.title}</span>
                          <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">{task.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        {task.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase ${getStatusBadge(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                          <User className="h-3.5 w-3.5 text-[#0ea5e9]" />
                          <span>{task.assignee}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                        {task.dueDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{task.dueDate}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="px-3 py-1.5 bg-[#0ea5e9]/10 hover:bg-[#0ea5e9] text-[#0ea5e9] hover:text-white text-xs font-bold rounded-xl border border-[#0ea5e9]/20 transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                      No matching records found in database. Try updating your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Table summary stats footer */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-semibold text-slate-400 flex items-center justify-between border-t border-white/5 dark:border-slate-800/30">
          <span>Showing {sortedTasks.length} of {tasks.length} tasks</span>
          <span>Sorting active: {sortField} ({sortOrder})</span>
        </div>
      </div>

      {/* Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={() => {
            fetchTasks();
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
