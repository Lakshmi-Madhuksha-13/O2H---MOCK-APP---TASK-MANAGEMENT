import React, { useState } from 'react';
import { Settings2, Moon, Sun, Bell, Shield, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

export default function Settings({ darkMode, toggleDarkMode }) {
  const [emailNotify, setEmailNotify] = useState(true);
  const [pushNotify, setPushNotify] = useState(true);
  const [digestNotify, setDigestNotify] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="p-6 glass-panel rounded-3xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          Global Core Settings
          <Settings2 className="h-6 w-6 text-[#0ea5e9]" />
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Control display theme, update alerts, and adjust workspace features.
        </p>
      </div>

      {/* Settings Options Card */}
      <div className="glass-panel p-8 rounded-3xl text-left space-y-6">
        
        {/* Dark Mode Theme Setting */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Moon className="h-4.5 w-4.5 text-[#0ea5e9]" /> Appearance Options
          </h3>
          <div className="flex items-center justify-between p-4 bg-white/20 dark:bg-slate-900/20 border border-white/10 dark:border-white/5 rounded-2xl">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Dark Mode Theme</h4>
              <p className="text-xs text-slate-400 mt-0.5">Toggle default system stylesheet variables to Deep Navy.</p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className="p-2 bg-gradient-to-tr from-[#0ea5e9] to-[#f97316] text-white rounded-xl hover:scale-105 transition-transform cursor-pointer"
            >
              {darkMode ? (
                <div className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-semibold">
                  <Sun className="h-4 w-4" /> <span>Light View</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-semibold">
                  <Moon className="h-4 w-4" /> <span>Dark View</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Notifications Setting */}
        <div className="pt-6 border-t border-white/5 dark:border-slate-800/40">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-[#f97316]" /> Workspace Alerts & Notifications
          </h3>
          
          <div className="space-y-3">
            {/* Email notification */}
            <div className="flex items-center justify-between p-4 bg-white/20 dark:bg-slate-900/20 border border-white/10 dark:border-white/5 rounded-2xl">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Email Notifications</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Receive direct reports when tasks are assigned to you.</p>
              </div>
              <button 
                onClick={() => setEmailNotify(!emailNotify)}
                className="text-slate-400 dark:text-slate-500 hover:text-[#0ea5e9] transition-colors cursor-pointer"
              >
                {emailNotify ? (
                  <ToggleRight className="h-9 w-9 text-emerald-500" />
                ) : (
                  <ToggleLeft className="h-9 w-9" />
                )}
              </button>
            </div>

            {/* Push notification */}
            <div className="flex items-center justify-between p-4 bg-white/20 dark:bg-slate-900/20 border border-white/10 dark:border-white/5 rounded-2xl">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">In-App Live Alerts</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Display floating bubbles in real-time on task audits.</p>
              </div>
              <button 
                onClick={() => setPushNotify(!pushNotify)}
                className="text-slate-400 dark:text-slate-500 hover:text-[#0ea5e9] transition-colors cursor-pointer"
              >
                {pushNotify ? (
                  <ToggleRight className="h-9 w-9 text-emerald-500" />
                ) : (
                  <ToggleLeft className="h-9 w-9" />
                )}
              </button>
            </div>

            {/* Weekly digests */}
            <div className="flex items-center justify-between p-4 bg-white/20 dark:bg-slate-900/20 border border-white/10 dark:border-white/5 rounded-2xl">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Weekly Performance Digests</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Get analytical insights on team closure rates every Friday.</p>
              </div>
              <button 
                onClick={() => setDigestNotify(!digestNotify)}
                className="text-slate-400 dark:text-slate-500 hover:text-[#0ea5e9] transition-colors cursor-pointer"
              >
                {digestNotify ? (
                  <ToggleRight className="h-9 w-9 text-emerald-500" />
                ) : (
                  <ToggleLeft className="h-9 w-9" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* System Physics Setting */}
        <div className="pt-6 border-t border-white/5 dark:border-slate-800/40">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Shield className="h-4.5 w-4.5 text-[#0ea5e9]" /> Physics & UI Dynamics
          </h3>
          <div className="flex items-center justify-between p-4 bg-white/20 dark:bg-slate-900/20 border border-white/10 dark:border-white/5 rounded-2xl">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Fluid Micro-Animations</h4>
              <p className="text-xs text-slate-400 mt-0.5">Enable Framer Motion page physics and hover gravity effects.</p>
            </div>
            <button 
              onClick={() => setAnimationsEnabled(!animationsEnabled)}
              className="text-slate-400 dark:text-slate-500 hover:text-[#0ea5e9] transition-colors cursor-pointer"
            >
              {animationsEnabled ? (
                <ToggleRight className="h-9 w-9 text-emerald-500" />
              ) : (
                <ToggleLeft className="h-9 w-9" />
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
