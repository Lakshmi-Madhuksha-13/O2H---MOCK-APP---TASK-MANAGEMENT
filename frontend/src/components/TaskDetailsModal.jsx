import React, { useState } from 'react';
import { 
  X, Calendar, User, Tag, Shield, 
  MessageSquare, Send, CheckCircle, Clock, Plus
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function TaskDetailsModal({ task, onClose, onUpdate }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/tasks/${task.id}/comments`, {
        author: user?.username || 'Anonymous',
        text: commentText.trim()
      });
      
      // Clear input and trigger parent reload/update
      setCommentText('');
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
      case 'High': return 'bg-orange-500/10 border-orange-500/20 text-orange-500';
      case 'Medium': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'Low':
      default: return 'bg-slate-500/10 border-slate-500/20 text-slate-500';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
      case 'In Progress': return 'bg-sky-500/10 border-sky-500/20 text-sky-500';
      case 'Review': return 'bg-purple-500/10 border-purple-500/20 text-purple-500';
      case 'Todo': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'Backlog':
      default: return 'bg-slate-500/10 border-slate-500/20 text-slate-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl animate-float text-left flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Task Details</span>
            <span className="text-xs font-bold text-[#0ea5e9]">#{task.id}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Status Bar */}
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-2 py-0.5 bg-[#0ea5e9]/10 text-[#0ea5e9] text-[10px] font-bold uppercase rounded-md border border-[#0ea5e9]/20">
                {task.category}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border rounded-md ${getPriorityStyle(task.priority)}`}>
                {task.priority} Priority
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border rounded-md ${getStatusStyle(task.status)}`}>
                {task.status}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">
              {task.title}
            </h2>
          </div>

          {/* Description */}
          {task.description && (
            <div className="p-4 bg-white/20 dark:bg-slate-900/20 border border-white/10 dark:border-white/5 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Description</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          {/* Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white/10 dark:bg-slate-900/10 rounded-2xl border border-white/5">
              <User className="h-5 w-5 text-[#0ea5e9] shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Assignee</div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{task.assignee}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/10 dark:bg-slate-900/10 rounded-2xl border border-white/5">
              <Calendar className="h-5 w-5 text-orange-500 shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Due Date</div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{task.dueDate || 'No Deadline'}</div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5 dark:border-slate-800/30">
              <MessageSquare className="h-4.5 w-4.5 text-[#0ea5e9]" />
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Comments & Discussion ({task.comments?.length || 0})
              </h3>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-white/20 dark:bg-slate-900/40 rounded-2xl border border-white/10 dark:border-slate-800/40 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0ea5e9]">{comment.author}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(comment.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-normal">{comment.text}</p>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400 font-medium">
                  No comments yet. Start the conversation!
                </div>
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a message..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-slate-800 dark:text-white"
                required
              />
              <button 
                type="submit" 
                disabled={submitting || !commentText.trim()}
                className="px-4 py-2.5 bg-[#0ea5e9] hover:bg-[#f97316] text-white rounded-xl font-bold flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] text-slate-400 font-medium flex justify-between border-t border-white/10 dark:border-slate-800/50">
          <span>Created by: {task.createdBy}</span>
          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
