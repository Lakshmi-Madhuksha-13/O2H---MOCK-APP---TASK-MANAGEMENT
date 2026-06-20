import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f0f9ff] text-slate-800 dark:bg-[#0a0f1c] dark:text-white transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
          <span className="text-sm font-medium tracking-wide text-[#0ea5e9]">Checking Permissions...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'Admin') {
    // Standard users are redirected to dashboard if they try to access admin pages
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
