import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { BellRing, Check, Info, ShieldAlert, Sparkles, Trash2, RefreshCw } from 'lucide-react';

export default function Notifications() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/logs');
      // Show only recent 15 notifications
      setLogs(response.data.slice(0, 15));
    } catch (error) {
      console.error('Failed to load activity logs for notification panel:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLogIcon = (action) => {
    if (action.includes('Login Failure') || action.includes('Deletion')) {
      return <ShieldAlert className="h-5 w-5 text-rose-500 animate-pulse" />;
    }
    if (action.includes('Success') || action.includes('Registration')) {
      return <Sparkles className="h-5 w-5 text-emerald-500" />;
    }
    return <Info className="h-5 w-5 text-[#0ea5e9]" />;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glass-panel rounded-3xl">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            Activity Alerts Center
            <BellRing className="h-6 w-6 text-[#f97316] animate-bounce" />
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse database transaction details, task audits, and authentication logging history.
          </p>
        </div>
        <button 
          onClick={fetchLogs}
          className="p-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/40 rounded-xl text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Activity List Container */}
      <div className="glass-panel p-6 rounded-3xl text-left space-y-4">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f97316]"></div>
          </div>
        ) : logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-start justify-between p-4 bg-white/20 dark:bg-slate-900/20 border border-white/10 dark:border-white/5 rounded-2xl hover:border-[#0ea5e9]/30 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl shrink-0 mt-0.5">
                    {getLogIcon(log.action)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{log.action}</span>
                      <span className="text-[9px] font-bold text-slate-400">ID #{log.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal font-semibold">
                      {log.details}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                      Author: <span className="text-[#0ea5e9] font-bold">{log.username}</span> • {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded uppercase select-none">
                  Live
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
            <Check className="h-10 w-10 text-emerald-500 mb-2" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300">All Caught Up!</h4>
            <p className="text-xs text-slate-400 mt-1">There are no new database audit activities logged.</p>
          </div>
        )}
      </div>

    </div>
  );
}
