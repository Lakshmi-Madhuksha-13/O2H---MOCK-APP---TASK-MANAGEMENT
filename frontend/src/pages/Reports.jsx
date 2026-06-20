import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FileDown, FileJson, FileSpreadsheet, Printer, Calendar, ShieldCheck, CheckSquare, Layers } from 'lucide-react';

export default function Reports() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks for report export:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToJson = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `zenithtasks-tasks-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportToCsv = () => {
    if (tasks.length === 0) return;
    
    // Define headers
    const headers = ['ID', 'Title', 'Description', 'Priority', 'Status', 'Category', 'Assignee', 'DueDate', 'CreatedAt'];
    
    // Map tasks to CSV rows
    const rows = tasks.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.priority,
      t.status,
      t.category,
      t.assignee,
      t.dueDate || '',
      t.createdAt || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', `zenithtasks-tasks-${new Date().toISOString().split('T')[0]}.csv`);
    linkElement.click();
  };

  const triggerPrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
      </div>
    );
  }

  // Analytics for the report print preview
  const criticalCount = tasks.filter(t => t.priority === 'Critical').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div className="space-y-6">
      
      {/* Title Header - Hidden on Print */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glass-panel rounded-3xl no-print">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            Reports & Live Exporters
            <FileDown className="h-6 w-6 text-[#0ea5e9]" />
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Export active database structures to raw JSON/CSV format, or preview printable PDF reports.
          </p>
        </div>
      </div>

      {/* Export Options Grid - Hidden on Print */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        
        {/* Export JSON */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between items-start text-left">
          <div className="space-y-2">
            <div className="p-3 bg-sky-500/10 text-[#0ea5e9] rounded-2xl w-fit">
              <FileJson className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Export to JSON</h3>
            <p className="text-xs text-slate-400">Download the entire database task records array as a formatted JSON document.</p>
          </div>
          <button 
            onClick={exportToJson}
            className="w-full mt-6 py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#0ea5e9]/90 hover:from-[#0ea5e9] hover:to-[#f97316] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            Download JSON
          </button>
        </div>

        {/* Export CSV */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between items-start text-left">
          <div className="space-y-2">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Export to CSV</h3>
            <p className="text-xs text-slate-400">Download the workspace deliverables sheet as a comma-separated values spreadsheet.</p>
          </div>
          <button 
            onClick={exportToCsv}
            className="w-full mt-6 py-2.5 bg-gradient-to-r from-[#10b981] to-[#10b981]/90 hover:from-[#10b981] hover:to-[#0ea5e9] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            Download CSV
          </button>
        </div>

        {/* Print Summary */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between items-start text-left">
          <div className="space-y-2">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl w-fit">
              <Printer className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Print Execution Report</h3>
            <p className="text-xs text-slate-400">Compile the structured workspace report below and open print preview to save as PDF.</p>
          </div>
          <button 
            onClick={triggerPrint}
            className="w-full mt-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-[#0ea5e9] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            Print Summary
          </button>
        </div>

      </div>

      {/* Structured Report Preview */}
      <div className="glass-panel p-8 rounded-3xl text-left bg-white dark:bg-slate-900/60 print:bg-white print:text-black">
        
        {/* Printable Header */}
        <div className="flex justify-between items-start pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white print:text-black">Neptune TaskFlow Workspace Summary</h3>
            <span className="text-xs text-slate-400 block mt-1">Generated: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="text-right text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>SaaS Task Logs</span>
          </div>
        </div>

        {/* Printable metrics grids */}
        <div className="grid grid-cols-3 gap-4 py-6 border-b border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center gap-3">
            <Layers className="h-5 w-5 text-[#0ea5e9]" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Items</span>
              <span className="text-base font-black text-slate-800 dark:text-white print:text-black">{tasks.length} tasks</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center gap-3">
            <CheckSquare className="h-5 w-5 text-emerald-500" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Completed</span>
              <span className="text-base font-black text-slate-800 dark:text-white print:text-black">{completedCount} tasks</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-rose-500" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Critical Warnings</span>
              <span className="text-base font-black text-slate-800 dark:text-white print:text-black">{criticalCount} tasks</span>
            </div>
          </div>
        </div>

        {/* Report Task Listing Table */}
        <div className="mt-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Workspace Deliverables Index</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="py-2">ID</th>
                  <th className="py-2">Task Title</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Priority</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Target Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {tasks.map(t => (
                  <tr key={t.id} className="text-slate-600 dark:text-slate-300 print:text-black">
                    <td className="py-3 font-semibold text-slate-400">#{t.id}</td>
                    <td className="py-3 font-bold">{t.title}</td>
                    <td className="py-3">{t.category}</td>
                    <td className="py-3 font-semibold">{t.priority}</td>
                    <td className="py-3">{t.status}</td>
                    <td className="py-3 text-right font-medium">{t.dueDate || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
