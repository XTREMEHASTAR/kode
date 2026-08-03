import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Workspace, Project, Video, SystemSettings, SystemNotification } from '../types';
import { auraDb } from '../services/auraDb';
import { useAuth } from './AuthContext';

interface AppContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  projects: Project[];
  currentProject: Project | null;
  videos: Video[];
  selectedVideoId: string | null;
  currentVideo: Video | null;
  theme: 'light' | 'dark' | 'system';
  borderRadius: number;
  loadingState: boolean;
  auraAiActive: boolean;
  viewport: 'desktop' | 'tablet' | 'mobile';
  notifications: SystemNotification[];
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error'; visible: boolean };
  setWorkspace: (workspaceId: string) => void;
  setProject: (projectId: string) => void;
  setSelectedVideoId: (id: string | null) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  updateBorderRadius: (radius: number) => void;
  setViewport: (v: 'desktop' | 'tablet' | 'mobile') => void;
  setLoadingState: (loading: boolean) => void;
  setAuraAiActive: (active: boolean) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  hideToast: () => void;
  refreshData: () => Promise<void>;
  updateVideo: (videoId: string, updates: Partial<Video>) => Promise<void>;
  addVideo: (video: Video) => void;
  addNotification: (notification: Omit<SystemNotification, 'id' | 'timestamp' | 'unread'>) => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideoId, setSelectedVideoIdState] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('dark');
  const [borderRadius, setBorderRadius] = useState<number>(12);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [auraAiActive, setAuraAiActive] = useState<boolean>(false);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    { id: '1', title: 'Creative Upload Success', message: 'Campaign video uploaded and queued for processing.', timestamp: new Date().toISOString(), type: 'success', unread: true },
    { id: '2', title: 'Hook Score Trigger', message: 'KONTAGI Hook Intelligence flags a low initial retention probability.', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'warning', unread: true }
  ]);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error'; visible: boolean; duration?: number }>({
    message: '',
    type: 'success',
    visible: false,
    duration: 4000
  });

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', duration: number = 4000) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type, visible: true, duration });

    toastTimerRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, [hideToast]);

  // Fetch all basic settings/data on mount
  const refreshData = useCallback(async () => {
    try {
      let workspacesList = await auraDb.getWorkspaces();
      if (!workspacesList || workspacesList.length === 0) {
        workspacesList = [
          { id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', name: "Pulse Energy", slug: "pulse-energy", avatar_text: "PE", avatar_bg: "var(--brand-primary-glow)", avatar_color: "var(--brand-primary)", tagline: "Charging clean Gen-Z visual focus states with zero additives." }
        ];
      }
      setWorkspaces(workspacesList);
      
      // Load current workspace from localStorage or default
      const savedWsId = localStorage.getItem('kontagi-active-workspace-id');
      const ws = workspacesList.find(w => w.id === savedWsId) || workspacesList[0];
      if (ws) {
        setCurrentWorkspace(ws);
        localStorage.setItem('kontagi-active-workspace-id', ws.id);
        
        // Fetch projects for this workspace
        let projList = await auraDb.getProjects(ws.id);
        if (!projList || projList.length === 0) {
          const defaultProj: Project = {
            id: 'd4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
            workspace_id: ws.id,
            name: `${ws.name} Campaign 2026`,
            description: `Visual assets promoting ${ws.name}`
          };
          projList = [defaultProj];
        }
        setProjects(projList);
        
        const savedProjId = localStorage.getItem('kontagi-active-project-id');
        const proj = projList.find(p => p.id === savedProjId) || projList[0];
        if (proj) {
          setCurrentProject(proj);
          localStorage.setItem('kontagi-active-project-id', proj.id);
          
          // Fetch videos for this project
          const vids = await auraDb.getVideos(proj.id);
          setVideos(vids);
        }
      }
      
      // Load settings
      const settings = await auraDb.getSettings();
      setThemeState(settings.theme as 'light' | 'dark' | 'system');
      setBorderRadius(parseInt(settings.border_radius) || 12);
      
    } catch (err) {
      console.error("Error fetching workspaces/projects:", err);
    }
  }, []);

  // Init theme & border-radius on start, always refresh workspace/project context
  useEffect(() => {
    // Read theme from localStorage
    const savedTheme = localStorage.getItem('kontagi-theme') || 'dark';
    setThemeState(savedTheme as 'light' | 'dark' | 'system');
    
    // Read border radius
    const savedRadius = localStorage.getItem('kontagi-border-radius') || '12';
    setBorderRadius(parseInt(savedRadius) || 12);

    refreshData();
  }, [refreshData]);

  // Sync theme changes to DOM
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
    }
    localStorage.setItem('kontagi-theme', theme);
  }, [theme]);

  // Sync border-radius changes to root variables
  useEffect(() => {
    document.documentElement.style.setProperty('--radius-lg', `${borderRadius}px`);
    document.documentElement.style.setProperty('--radius-xl', `${borderRadius + 4}px`);
    localStorage.setItem('kontagi-border-radius', borderRadius.toString());
  }, [borderRadius]);

  // Fetch active video analysis when selected video changes
  useEffect(() => {
    const savedVideoId = localStorage.getItem('kontagi-selected-video-id');
    if (savedVideoId && !selectedVideoId) {
      setSelectedVideoIdState(savedVideoId);
    }
  }, [selectedVideoId]);

  const setSelectedVideoId = useCallback((id: string | null) => {
    setSelectedVideoIdState(id);
    if (id) {
      localStorage.setItem('kontagi-selected-video-id', id);
      // Fetch full analysis object
      setLoadingState(true);
      auraDb.getAnalysis(id)
        .then(vid => {
          setCurrentVideo(vid);
          setLoadingState(false);
        })
        .catch(err => {
          console.error("Error loading analysis:", err);
          setCurrentVideo(null);
          setLoadingState(false);
        });
    } else {
      localStorage.removeItem('kontagi-selected-video-id');
      setCurrentVideo(null);
    }
  }, []);

  // Update context states on workspace switch
  const setWorkspace = useCallback((workspaceId: string) => {
    const ws = workspaces.find(w => w.id === workspaceId);
    if (ws) {
      setCurrentWorkspace(ws);
      localStorage.setItem('kontagi-active-workspace-id', ws.id);
      showToast(`Switched workspace to ${ws.name}`, 'info');
      
      // Reload projects and select first
      auraDb.getProjects(ws.id).then(projList => {
        setProjects(projList);
        const proj = projList[0] || null;
        setCurrentProject(proj);
        if (proj) {
          localStorage.setItem('kontagi-active-project-id', proj.id);
          auraDb.getVideos(proj.id).then(setVideos);
        } else {
          localStorage.removeItem('kontagi-active-project-id');
          setVideos([]);
        }
      });
    }
  }, [workspaces, showToast]);

  const setProject = useCallback((projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      setCurrentProject(proj);
      localStorage.setItem('kontagi-active-project-id', proj.id);
      showToast(`Selected project: ${proj.name}`, 'info');
      auraDb.getVideos(proj.id).then(setVideos);
    }
  }, [projects, showToast]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((t: 'light' | 'dark' | 'system') => {
    setThemeState(t);
  }, []);

  const updateBorderRadius = useCallback((radius: number) => {
    setBorderRadius(radius);
  }, []);

  const updateVideo = useCallback(async (videoId: string, updates: Partial<Video>) => {
    try {
      const res = await auraDb.updateVideo(videoId, updates);
      if (res.success) {
        setVideos(prev => prev.map(v => v.id === videoId ? { ...v, ...updates } : v));
        if (selectedVideoId === videoId) {
          setCurrentVideo(prev => prev ? { ...prev, ...updates } : null);
        }
      }
    } catch (err) {
      console.error("Failed to update video:", err);
    }
  }, [selectedVideoId]);

  const addVideo = useCallback((newVid: Video) => {
    setVideos(prev => [newVid, ...prev]);
  }, []);

  const addNotification = useCallback((notif: Omit<SystemNotification, 'id' | 'timestamp' | 'unread'>) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  }, []);

  // Expose global showToast to window so standard design-system helper calls still work if any
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showToast = showToast;
    }
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        projects,
        currentProject,
        videos,
        selectedVideoId,
        currentVideo,
        theme,
        borderRadius,
        loadingState,
        auraAiActive,
        viewport,
        notifications,
        toast,
        setWorkspace,
        setProject,
        setSelectedVideoId,
        setTheme,
        toggleTheme,
        updateBorderRadius,
        setViewport,
        setLoadingState,
        setAuraAiActive,
        showToast,
        hideToast,
        refreshData,
        updateVideo,
        addVideo,
        addNotification,
        markNotificationRead
      }}
    >
      {children}
      {toast.visible && (
        <div
          key={`${toast.message}-${Date.now()}`}
          className={`kontagi-theme-toast ${toast.type}`}
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: '#F8FAFC',
            padding: '12px 18px',
            borderRadius: '12px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.12)',
            fontSize: '13.5px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            animation: 'toastSlideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            maxWidth: '420px',
            overflow: 'hidden'
          }}
        >
          {/* Status Indicator Icon */}
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
              flexShrink: 0,
              background:
                toast.type === 'success'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : toast.type === 'error'
                  ? 'rgba(239, 68, 68, 0.2)'
                  : toast.type === 'warning'
                  ? 'rgba(245, 158, 11, 0.2)'
                  : 'rgba(59, 130, 246, 0.2)',
              color:
                toast.type === 'success'
                  ? '#34D399'
                  : toast.type === 'error'
                  ? '#FCA5A5'
                  : toast.type === 'warning'
                  ? '#FCD34D'
                  : '#93C5FD'
            }}
          >
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✕'}
            {toast.type === 'warning' && '⚠️'}
            {toast.type === 'info' && 'ℹ'}
          </div>

          <span style={{ flex: 1, lineHeight: '1.4' }}>{toast.message}</span>

          {/* Dismiss button */}
          <button
            onClick={hideToast}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              marginLeft: '6px',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              lineHeight: 1,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#F8FAFC';
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#94A3B8';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            ✕
          </button>

          {/* Toast Auto-Dismiss Progress Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              width: '100%',
              background:
                toast.type === 'success'
                  ? '#10B981'
                  : toast.type === 'error'
                  ? '#EF4444'
                  : toast.type === 'warning'
                  ? '#F59E0B'
                  : '#3B82F6',
              animation: `toastProgressBar ${toast.duration || 4000}ms linear forwards`
            }}
          />
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
