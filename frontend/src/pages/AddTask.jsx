import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, FileText, Sparkles, User, Calendar, CheckSquare, XCircle } from 'lucide-react';

export default function AddTask() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Todo');
  const [category, setCategory] = useState('Engineering');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [team, setTeam] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get('/team');
        setTeam(response.data);
        if (response.data.length > 0) {
          setAssignee(response.data[0].username);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };
    fetchTeam();
  }, []);

  const validate = () => {
    const tempErrors = {};
    if (!title.trim()) tempErrors.title = 'Task title is required.';
    else if (title.length < 5) tempErrors.title = 'Title must be at least 5 characters long.';
    
    if (!description.trim()) tempErrors.description = 'Task description is required.';
    if (!category) tempErrors.category = 'Task category is required.';
    if (!dueDate) tempErrors.dueDate = 'A target completion date is required.';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    
    // Find assignee details
    const selectedMember = team.find(member => member.username === assignee);

    const taskPayload = {
      title,
      description,
      priority,
      status,
      category,
      assignee,
      assigneeId: selectedMember ? selectedMember.id : null,
      dueDate,
      createdBy: user?.username || 'System'
    };

    try {
      await api.post('/tasks', taskPayload);
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      setErrors({ server: 'Failed to create task on the database server. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="p-6 glass-panel rounded-3xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          Create New Workspace Task
          <PlusCircle className="h-6 w-6 text-[#0ea5e9]" />
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure details, priority levels, categories, team assignments, and due timelines.
        </p>
      </div>

      {errors.server && (
        <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-semibold text-left">
          <XCircle className="h-5 w-5 shrink-0" />
          <span>{errors.server}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="glass-panel p-8 rounded-3xl text-left">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-[#0ea5e9]" /> Task Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Implement Oauth authentication workflows"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full mt-1.5 px-4 py-3 bg-white/40 dark:bg-slate-900/40 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white transition-all
                ${errors.title ? 'border-rose-500/40' : 'border-white/20 dark:border-slate-800/40'}
              `}
            />
            {errors.title && <span className="text-rose-500 text-[10px] font-semibold mt-1 ml-1 block">{errors.title}</span>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-[#0ea5e9]" /> Detailed Description *
            </label>
            <textarea
              placeholder="Provide a thorough overview of the task deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full mt-1.5 px-4 py-3 bg-white/40 dark:bg-slate-900/40 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white h-28 transition-all
                ${errors.description ? 'border-rose-500/40' : 'border-white/20 dark:border-slate-800/40'}
              `}
            />
            {errors.description && <span className="text-rose-500 text-[10px] font-semibold mt-1 ml-1 block">{errors.description}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-[#f97316]" /> Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full mt-1.5 px-4 py-3 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white appearance-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1">
                <CheckSquare className="h-3.5 w-3.5 text-[#0ea5e9]" /> Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-1.5 px-4 py-3 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white appearance-none cursor-pointer"
              >
                <option value="Backlog">Backlog</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1">
                <PlusCircle className="h-3.5 w-3.5 text-[#f97316]" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1.5 px-4 py-3 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white appearance-none cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Operations">Operations</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assignee */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-[#0ea5e9]" /> Workspace Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full mt-1.5 px-4 py-3 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white appearance-none cursor-pointer"
              >
                {team.map(member => (
                  <option key={member.id} value={member.username}>
                    {member.username} ({member.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#f97316]" /> Target Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full mt-1.5 px-4 py-2.5 bg-white/40 dark:bg-slate-900/40 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white transition-all
                  ${errors.dueDate ? 'border-rose-500/40' : 'border-white/20 dark:border-slate-800/40'}
                `}
              />
              {errors.dueDate && <span className="text-rose-500 text-[10px] font-semibold mt-1 ml-1 block">{errors.dueDate}</span>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#0ea5e9] to-[#0ea5e9]/90 hover:from-[#0ea5e9] hover:to-[#f97316] text-white text-sm font-bold rounded-xl shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Submitting...' : 'Register Task'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
