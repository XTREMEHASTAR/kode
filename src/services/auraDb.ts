import { Workspace, Project, Video, SystemSettings } from '../types';
import { getAuthHeaders } from './authService';

const isLocalFile = typeof window !== 'undefined' && window.location.protocol === 'file:';
const apiBase = isLocalFile ? '' : `${window.location.protocol}//${window.location.host}`;

// Local storage helper functions
function hasAuthHeader(): boolean {
  const headers = getAuthHeaders();
  return Boolean(headers['Authorization'] || headers['x-user-id']);
}

function getLocalStorageWorkspaces(): Workspace[] {
  const saved = localStorage.getItem('kontagi-workspaces-data-list');
  if (!saved) {
    const defaultList: Workspace[] = [
      { id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', name: "Pulse Energy", slug: "pulse-energy", avatar_text: "PE", avatar_bg: "var(--brand-primary-glow)", avatar_color: "var(--brand-primary)", tagline: "Charging clean Gen-Z visual focus states with zero additives.", prohibited_terms: "tired, old-fashioned, slow, additives" },
      { id: 'b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e', name: "Retro Denim", slug: "retro-denim", avatar_text: "RD", avatar_bg: "rgba(245, 158, 11, 0.15)", avatar_color: "var(--accent-orange)", tagline: "Sleek retro-streetwear visual aesthetics built for long-duration wear.", prohibited_terms: "hyper-futuristic, synthetic, neon glow, glitch" },
      { id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', name: "AuraSmart IoT", slug: "smart-home", avatar_text: "AS", avatar_bg: "rgba(16, 185, 129, 0.15)", avatar_color: "var(--accent-green)", tagline: "AuraSmart IoT assistant systems integrating seamlessly with family flow.", prohibited_terms: "cluttered, complex setup, loud sounds, intrusive" }
    ];
    localStorage.setItem('kontagi-workspaces-data-list', JSON.stringify(defaultList));
    return defaultList;
  }
  return JSON.parse(saved);
}

function getLocalStorageProjects(): Project[] {
  const saved = localStorage.getItem('kontagi-projects-data-list');
  if (!saved) {
    const defaultProj: Project[] = [
      { id: 'd4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', workspace_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', name: "Pulse Energy Campaign 2026", description: "Visual assets promoting Pulse Energy drinks." }
    ];
    localStorage.setItem('kontagi-projects-data-list', JSON.stringify(defaultProj));
    return defaultProj;
  }
  return JSON.parse(saved);
}

function getLocalStorageVideos(): Video[] {
  const saved = localStorage.getItem('kontagi-videos-data-list');
  if (!saved) {
    const defaultVid: Video[] = [];
    localStorage.setItem('kontagi-videos-data-list', JSON.stringify(defaultVid));
    return defaultVid;
  }
  return JSON.parse(saved);
}

function getLocalStorageSettings(): SystemSettings {
  const saved = localStorage.getItem('kontagi-system-settings');
  if (!saved) {
    const defaultSet: SystemSettings = {
      theme: 'dark',
      border_radius: '12',
      language: 'en',
      timezone: 'ist',
      date_format: 'ddmmyyyy',
      user_email: 'jaiveer@company.com'
    };
    localStorage.setItem('kontagi-system-settings', JSON.stringify(defaultSet));
    return defaultSet;
  }
  return JSON.parse(saved);
}

export const auraDb = {
  // 1. WORKSPACES
  async getWorkspaces(): Promise<Workspace[]> {
    if (!isLocalFile && hasAuthHeader()) {
      try {
        const res = await fetch(`${apiBase}/api/workspaces`, { headers: getAuthHeaders(), credentials: 'include' });
        if (res.ok) {
          const body = await res.json();
          return body.data || body;
        }
      } catch (e) {
        console.warn("Backend API unreachable, falling back to local storage.", e);
      }
    }
    return getLocalStorageWorkspaces();
  },

  async createWorkspace(workspaceData: Partial<Workspace>): Promise<Workspace> {
    if (!isLocalFile && hasAuthHeader()) {
      try {
        const res = await fetch(`${apiBase}/api/workspaces`, {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify(workspaceData)
        });
        if (res.ok) {
          const body = await res.json();
          return body.data || body;
        }
      } catch (e) {
        console.warn("Backend API error, falling back to local storage.", e);
      }
    }
    const workspaces = getLocalStorageWorkspaces();
    const newWs: Workspace = {
      id: Math.random().toString(36).substring(2, 11),
      name: workspaceData.name || 'Untitled Workspace',
      slug: workspaceData.slug || 'untitled-workspace',
      avatar_text: workspaceData.avatar_text || 'UW',
      avatar_bg: workspaceData.avatar_bg || 'var(--brand-primary-glow)',
      avatar_color: workspaceData.avatar_color || 'var(--brand-primary)',
      tagline: workspaceData.tagline || '',
      prohibited_terms: workspaceData.prohibited_terms || '',
      created_at: new Date().toISOString()
    };
    workspaces.push(newWs);
    localStorage.setItem('kontagi-workspaces-data-list', JSON.stringify(workspaces));
    return newWs;
  },

  // 2. PROJECTS
  async getProjects(workspaceId?: string): Promise<Project[]> {
    if (!isLocalFile && hasAuthHeader()) {
      try {
        const url = workspaceId ? `${apiBase}/api/projects?workspace_id=${workspaceId}` : `${apiBase}/api/projects`;
        const res = await fetch(url, { headers: getAuthHeaders(), credentials: 'include' });
        if (res.ok) {
          const body = await res.json();
          return body.data || body;
        }
      } catch (e) {
        console.warn("Backend API error, falling back to local storage.", e);
      }
    }
    let projects = getLocalStorageProjects();
    if (workspaceId) {
      projects = projects.filter(p => p.workspace_id === workspaceId);
    }
    return projects;
  },

  async createProject(projectData: Partial<Project>): Promise<Project> {
    if (!isLocalFile && hasAuthHeader()) {
      try {
        const res = await fetch(`${apiBase}/api/projects`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(projectData)
        });
        if (res.ok) {
          const body = await res.json();
          return body.data || body;
        }
      } catch (e) {
        console.warn("Backend API error, falling back to local storage.", e);
      }
    }
    const projects = getLocalStorageProjects();
    const newProj: Project = {
      id: Math.random().toString(36).substring(2, 11),
      workspace_id: projectData.workspace_id || '',
      name: projectData.name || 'Untitled Project',
      description: projectData.description || '',
      created_at: new Date().toISOString()
    };
    projects.push(newProj);
    localStorage.setItem('kontagi-projects-data-list', JSON.stringify(projects));
    return newProj;
  },

  // 3. VIDEOS (ASSETS)
  async getVideos(projectId?: string): Promise<Video[]> {
    if (!isLocalFile && hasAuthHeader()) {
      try {
        const url = projectId ? `${apiBase}/api/videos?project_id=${projectId}` : `${apiBase}/api/videos`;
        const res = await fetch(url, { headers: getAuthHeaders() });
        if (res.ok) {
          const body = await res.json();
          return body.data || body;
        }
      } catch (e) {
        console.warn("Backend API error, falling back to local storage.", e);
      }
    }
    let videos = getLocalStorageVideos();
    if (projectId) {
      videos = videos.filter(v => v.project_id === projectId);
    }
    return videos;
  },

  async uploadVideo(formData: FormData, onProgress?: (pct: number) => void): Promise<{ success: boolean; video: Video }> {
    if (!isLocalFile) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${apiBase}/api/upload`);
        
        if (onProgress) {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              onProgress(percent);
            }
          };
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload.'));
        xhr.send(formData);
      });
    } else {
      // Local File System simulation
      return new Promise((resolve) => {
        const videoFile = formData.get('video') as File | null;
        const projectId = formData.get('project_id') as string;
        const title = (formData.get('title') as string) || (videoFile ? videoFile.name : 'Simulated Video');
        
        let pct = 0;
        const interval = setInterval(() => {
          pct += 10;
          if (onProgress) onProgress(pct);
          
          if (pct >= 100) {
            clearInterval(interval);
            const newVid: Video = {
              id: Math.random().toString(36).substring(2, 11),
              project_id: projectId,
              title: title,
              filename: title,
              storage_path: 'local-mock-path',
              status: 'pending',
              score: 0,
              transcript: '',
              caption: '',
              tags: [],
              poster_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
              retention_profile: [],
              hook_score: 0,
              hook_analysis: '',
              visual_score: 0,
              visual_analysis: '',
              audio_score: 0,
              audio_analysis: '',
              thumbnail_suggestions: [],
              created_at: new Date().toISOString()
            };
            
            const videos = getLocalStorageVideos();
            videos.push(newVid);
            localStorage.setItem('kontagi-videos-data-list', JSON.stringify(videos));
            resolve({ success: true, video: newVid });
          }
        }, 200);
      });
    }
  },

  async getAnalysis(videoId: string): Promise<Video> {
    if (!isLocalFile) {
      try {
        const res = await fetch(`${apiBase}/api/analysis/${videoId}`, { headers: getAuthHeaders() });
        if (res.ok) {
          const body = await res.json();
          return body.data || body;
        }
      } catch (e) {
        console.warn("Backend API error, falling back to local storage.", e);
      }
    }
    const videos = getLocalStorageVideos();
    const video = videos.find(v => v.id === videoId);
    if (video) return video;
    throw new Error(`Video ID ${videoId} not found`);
  },

  async updateVideo(videoId: string, updates: Partial<Video>): Promise<{ success: boolean; video: Video }> {
    if (!isLocalFile) {
      try {
        const res = await fetch(`${apiBase}/api/videos/${videoId}`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          const body = await res.json();
          return body.data || body;
        }
      } catch (e) {
        console.warn("Backend API error, falling back to local storage.", e);
      }
    }
    const videos = getLocalStorageVideos();
    const idx = videos.findIndex(v => v.id === videoId);
    if (idx !== -1) {
      videos[idx] = { ...videos[idx], ...updates };
      localStorage.setItem('kontagi-videos-data-list', JSON.stringify(videos));
      return { success: true, video: videos[idx] };
    }
    throw new Error(`Video ID ${videoId} not found in local storage`);
  },

  // 4. SETTINGS
  async getSettings(): Promise<SystemSettings> {
    if (!isLocalFile && hasAuthHeader()) {
      try {
        const res = await fetch(`${apiBase}/api/settings`, { headers: getAuthHeaders() });
        if (res.ok) {
          const body = await res.json();
          return body.data || body;
        }
      } catch (e) {
        console.warn("Backend API error, falling back to local storage.", e);
      }
    }
    return getLocalStorageSettings();
  },

  async saveSettings(settingsData: Partial<SystemSettings>): Promise<SystemSettings> {
    if (!isLocalFile && hasAuthHeader()) {
      try {
        const res = await fetch(`${apiBase}/api/settings`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(settingsData)
        });
        if (res.ok) {
          const body = await res.json();
          return body.data || body;
        }
      } catch (e) {
        console.warn("Backend API error, falling back to local storage.", e);
      }
    }
    const settings = { ...getLocalStorageSettings(), ...settingsData };
    localStorage.setItem('kontagi-system-settings', JSON.stringify(settings));
    return settings;
  }
};
