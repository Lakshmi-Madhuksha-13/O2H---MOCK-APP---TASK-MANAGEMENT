import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, LayoutDashboard, CheckCircle2, Play, 
  Command, Timer, MessageSquare, Users, ShieldCheck, ArrowRight,
  Target, Zap, BarChart3, Kanban, Brain, Globe
} from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "Neptune AI Assistant",
      desc: "Type naturally — AI converts your sentence into a full list of tasks, subtasks, priorities, and deadlines automatically.",
      color: "text-sky-700",
      bg: "bg-sky-100"
    },
    {
      icon: Kanban,
      title: "Kanban & Sprint Boards",
      desc: "Visualize personal tasks on Kanban or manage enterprise sprints, backlogs, and agile workflows in one view.",
      color: "text-orange-700",
      bg: "bg-orange-100"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      desc: "Invite members, assign roles (Admin, Project Manager, Team Lead, Employee), and collaborate in real-time with comments.",
      color: "text-purple-700",
      bg: "bg-purple-100"
    },
    {
      icon: Target,
      title: "Goals & Habit Tracker",
      desc: "Set daily, weekly, and monthly goals. Track habits, streaks, and your personal productivity score every day.",
      color: "text-emerald-700",
      bg: "bg-emerald-100"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      desc: "Rich dashboards with completion trends, team performance, sprint burndown charts, and project health scores.",
      color: "text-rose-700",
      bg: "bg-rose-100"
    },
    {
      icon: ShieldCheck,
      title: "Dual Workspace System",
      desc: "Switch between a private Personal Workspace and a shared Organization Workspace without logging out.",
      color: "text-amber-700",
      bg: "bg-amber-100"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20 relative overflow-hidden">
      {/* Subtle background only - no floating blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-orange-50 dark:from-[#0a0f1c] dark:via-[#0c162d] dark:to-[#0a0f1c] pointer-events-none"></div>

      {/* Header / Navbar */}
      <nav className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-gradient-to-tr from-[#0ea5e9] to-[#f97316] rounded-xl shadow-lg">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Neptune Flow</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#0ea5e9]/95 hover:from-[#0ea5e9] hover:to-[#f97316] text-white text-sm font-black rounded-xl shadow-md transition-all cursor-pointer"
            >
              Go to Dashboard
              <LayoutDashboard className="h-4.5 w-4.5" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-black text-slate-800 dark:text-slate-200 hover:text-[#0ea5e9] dark:hover:text-[#0ea5e9] transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-black rounded-xl shadow hover:opacity-90 transition-opacity cursor-pointer"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-bold rounded-full mb-6 border border-sky-200 dark:border-sky-700">
          <Zap className="h-3.5 w-3.5" />
          AI-Powered Dual Workspace Platform
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          The Task Platform for
          <span className="block mt-2 bg-gradient-to-r from-[#0ea5e9] to-[#f97316] bg-clip-text text-transparent">
            Everyone &amp; Every Team
          </span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          Neptune Flow is a dual-workspace platform. Use the <strong>Personal Workspace</strong> for your own goals, habits, and focus sessions — or switch to the <strong>Organization Workspace</strong> for enterprise project management, sprints, and team collaboration.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to={user ? "/dashboard" : "/register"}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0ea5e9] to-[#f97316] text-white font-black rounded-2xl shadow-xl hover:opacity-90 hover:translate-y-[-1px] transition-all cursor-pointer"
          >
            {user ? 'Go to Dashboard' : 'Get Started Free'}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-black rounded-2xl hover:border-[#0ea5e9] transition-all cursor-pointer"
          >
            Sign In
            <Play className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl px-6 py-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Everything You Need</h2>
          <p className="text-sm font-semibold text-[#0ea5e9] uppercase tracking-widest mt-2">Personal productivity meets enterprise power</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-3xl hover:border-[#0ea5e9] hover:shadow-lg transition-all duration-300 flex flex-col items-start text-left group"
              >
                <div className={`p-3 rounded-2xl mb-4 ${feat.bg} ${feat.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mt-2 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-8 relative z-10">
        <p>© 2026 <strong>Neptune Flow</strong> — AI-Powered Dual Workspace Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
