import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  KanbanSquare, Calendar, User, AlertTriangle, ArrowUpRight, 
  Trash2, Edit, ChevronDown, Check, Eye, EyeOff, LayoutGrid, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TaskDetailsModal from '../components/TaskDetailsModal';

export default function Kanban() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Available swimlanes
  const allLanes = ['Backlog', 'Todo', 'In Progress', 'Review', 'Completed'];
  
  // Dynamic column visibility settings
  const [visibleLanes, setVisibleLanes] = useState({
    'Backlog': true,
    'Todo': true,
    'In Progress': true,
    'Review': true,
    'Completed': true
  });

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  
  // Details Modal state
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks for Kanban:', error);
    } finally {
      setLoading(false);
    }
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (!taskIdStr) return;
    
    const taskId = parseInt(taskIdStr);
    
    // Find task
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === targetStatus) return;

    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: targetStatus } : t));

    try {
      await api.put(`/tasks/${taskId}`, {
        status: targetStatus,
        updatedBy: user?.username || 'System'
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
      // Revert on failure
      fetchTasks();
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== taskId));

    try {
      await api.delete(`/tasks/${taskId}?deletedBy=${user?.username || 'System'}`);
    } catch (error) {
      console.error('Failed to delete task:', error);
      fetchTasks();
    }
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditPriority(task.priority);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle) return;

    const taskId = editingTask.id;
    // Optimistic UI
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, title: editTitle, description: editDesc, priority: editPriority } : t));
    setEditingTask(null);

    try {
      await api.put(`/tasks/${taskId}`, {
        title: editTitle,
        description: editDesc,
        priority: editPriority,
        updatedBy: user?.username || 'System'
      });
    } catch (error) {
      console.error('Failed to save task modifications:', error);
      fetchTasks();
    }
  };

  // Toggle lane visibility
  const toggleLane = (lane) => {
    setVisibleLanes(prev => ({ ...prev, [lane]: !prev[lane] }));
  };

  // Count active visible lanes
  const activeLanesCount = Object.values(visibleLanes).filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
      </div>
    );
  }

  // Priority color maps
  const getPriorityStyle = (priority) => {
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

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glass-panel rounded-3xl">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            Kanban Task Board
            <KanbanSquare className="h-6 w-6 text-[#0ea5e9]" />
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Drag and drop card columns to update live task states, customize visible lanes.
          </p>
        </div>
        <Link 
          to="/add-task"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#0ea5e9]/90 hover:from-[#0ea5e9] hover:to-[#f97316] text-white text-sm font-bold rounded-xl shadow-lg cursor-pointer"
        >
          Create Task
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Dynamic Column Selectors Bar */}
      <div className="p-4 bg-white/30 dark:bg-slate-900/30 border border-white/10 dark:border-white/5 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <LayoutGrid className="h-4 w-4 text-[#0ea5e9]" />
            <span>Customize Visible Columns ({activeLanesCount}/5)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allLanes.map(lane => {
              const isVisible = visibleLanes[lane];
              return (
                <button
                  key={lane}
                  onClick={() => toggleLane(lane)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer
                    ${isVisible 
                      ? 'bg-[#0ea5e9]/10 border-[#0ea5e9]/20 text-[#0ea5e9]' 
                      : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                    }
                  `}
                >
                  {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span>{lane}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Board Layout */}
      <div className={`grid gap-4 overflow-x-auto pb-4 transition-all duration-300`} 
           style={{ gridTemplateColumns: `repeat(${activeLanesCount > 0 ? activeLanesCount : 1}, minmax(260px, 1fr))` }}>
        
        {allLanes.filter(lane => visibleLanes[lane]).map(lane => {
          const laneTasks = tasks.filter(t => t.status === lane);
          return (
            <div 
              key={lane} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, lane)}
              className="flex flex-col min-h-[500px] bg-white/20 dark:bg-slate-900/20 border border-white/10 dark:border-white/5 rounded-2xl p-4 transition-all duration-300"
            >
              
              {/* Lane Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-slate-800/50 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0ea5e9] animate-pulse"></span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{lane}</h3>
                </div>
                <span className="px-2 py-0.5 bg-slate-200/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 rounded-md">
                  {laneTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex flex-col gap-3 flex-grow">
                {laneTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="group relative flex flex-col p-4 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/30 rounded-xl hover:border-[#0ea5e9]/40 hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-300 animate-float-slow"
                  >
                    
                    {/* Action buttons visible on hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-opacity">
                      <button 
                        onClick={() => setSelectedTask(task)}
                        className="p-1 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 rounded-lg transition-colors cursor-pointer"
                        title="View details & comments"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => startEdit(task)}
                        className="p-1 hover:bg-[#0ea5e9]/10 text-slate-400 hover:text-[#0ea5e9] rounded-lg transition-colors cursor-pointer"
                        title="Edit inline"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="px-1.5 py-0.5 bg-[#0ea5e9]/10 text-[#0ea5e9] text-[9px] font-bold uppercase rounded">
                        {task.category}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase border rounded ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1 line-clamp-2">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-xs text-slate-400 dark:text-slate-400 line-clamp-2 mb-4 leading-normal">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold uppercase">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{task.dueDate || 'No Due Date'}</span>
                        </div>
                        {task.comments?.length > 0 && (
                          <div className="flex items-center gap-0.5 text-[9px] text-[#0ea5e9] font-bold">
                            <MessageSquare className="h-3 w-3" />
                            <span>{task.comments.length}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Assignee pill */}
                      <div className="flex items-center gap-1 bg-white/20 dark:bg-slate-800/30 pl-1.5 pr-2 py-0.5 rounded-full border border-white/10 text-[10px] font-medium">
                        <User className="h-2.5 w-2.5 text-[#0ea5e9]" />
                        <span className="text-slate-600 dark:text-slate-300">{task.assignee.split('_')[0]}</span>
                      </div>
                    </div>

                  </div>
                ))}

                {laneTasks.length === 0 && (
                  <div className="flex-grow border-2 border-dashed border-slate-200/40 dark:border-slate-800/30 rounded-xl flex items-center justify-center p-6 text-center text-xs text-slate-400 font-medium">
                    Drag items here
                  </div>
                )}
              </div>

            </div>
          );
        })}

        {activeLanesCount === 0 && (
          <div className="glass-panel p-12 rounded-3xl text-center w-full col-span-5 flex flex-col items-center">
            <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
            <h4 className="font-bold text-slate-800 dark:text-white">All Columns Hidden</h4>
            <p className="text-xs text-slate-400 mt-1">Please select at least one column from the customization bar above to track tasks.</p>
          </div>
        )}

      </div>

      {/* Inline Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl animate-float text-left">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Edit Task (Inline)</h3>
            <form onSubmit={saveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Task Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Description</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white h-20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0ea5e9] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="h-4 w-4" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Task Details Modal */}
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
