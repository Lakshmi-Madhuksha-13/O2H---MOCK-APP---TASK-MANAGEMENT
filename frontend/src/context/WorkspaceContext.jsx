import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const { user, token } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchWorkspaces();
    } else {
      setWorkspaces([]);
      setCurrentWorkspaceId(null);
      setLoading(false);
    }
  }, [user, token]);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const res = await api.get('/workspaces');
      setWorkspaces(res.data.workspaces || []);
      setCurrentWorkspaceId(res.data.currentWorkspaceId);
    } catch (err) {
      console.error('Failed to fetch workspaces', err);
    } finally {
      setLoading(false);
    }
  };

  const switchWorkspace = async (workspaceId) => {
    try {
      const res = await api.post('/workspaces/switch', { workspaceId });
      if (res.data.success) {
        setCurrentWorkspaceId(res.data.currentWorkspaceId);
        // Force a reload or update context to refresh the dashboard
        window.location.reload(); 
      }
    } catch (err) {
      console.error('Failed to switch workspace', err);
      alert('Failed to switch workspace');
    }
  };

  const activeWorkspace = workspaces.find(w => w.id === currentWorkspaceId) || null;

  return (
    <WorkspaceContext.Provider value={{
      workspaces,
      currentWorkspaceId,
      activeWorkspace,
      switchWorkspace,
      loading
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => useContext(WorkspaceContext);
