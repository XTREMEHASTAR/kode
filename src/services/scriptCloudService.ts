import { FreeTierScript } from '../types/freeTier';
import { getAuthHeaders as getSharedAuthHeaders } from './authService';

const isLocalFile = typeof window !== 'undefined' && window.location.protocol === 'file:';
const apiBase = isLocalFile ? '' : `${window.location.protocol}//${window.location.host}`;

function getAuthHeaders(): Record<string, string> {
  const headers = getSharedAuthHeaders();
  try {
    const raw = localStorage.getItem('kontagi_auth_session');
    if (raw) {
      const session = JSON.parse(raw);
      if (session?.user?.id) {
        headers['x-user-id'] = session.user.id;
      }
    }
  } catch (e) {
    console.warn("Failed to read auth session from localStorage", e);
  }
  return headers;
}

// Convert DB snake_case to frontend camelCase if DB returned raw snake_case
function normalizeScript(data: any): FreeTierScript {
  if (!data) return data;
  return {
    id: data.id,
    userId: data.userId || data.user_id,
    title: data.title,
    scriptText: data.scriptText || data.script_text,
    originalScriptText: data.originalScriptText || data.original_script_text || data.scriptText || data.script_text,
    versions: data.versions || [],
    contentType: data.contentType || data.content_type || 'Other',
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
    hookScore: data.hookScore !== undefined ? data.hookScore : data.hook_score,
    isFavorite: data.isFavorite !== undefined ? data.isFavorite : data.is_favorite,
    wordCount: data.wordCount !== undefined ? data.wordCount : data.word_count,
    characterCount: data.characterCount !== undefined ? data.characterCount : data.character_count,
    estimatedSpeakingTime: data.estimatedSpeakingTime !== undefined ? data.estimatedSpeakingTime : data.estimated_speaking_time,
    hookText: data.hookText || data.hook_text || '',
    signals: data.signals || [],
    engineVersion: data.engineVersion || data.engine_version || '1.0.0',
    analysisMode: data.analysisMode || data.analysis_mode || 'Rule-Based Analysis',
    analysisConfidence: data.analysisConfidence || data.analysis_confidence || 'High',
    analysisResult: data.analysisResult || data.analysis_result
  };
}

export const scriptCloudService = {
  async fetchScripts(): Promise<FreeTierScript[]> {
    const authHeaders = getAuthHeaders();
    if (!authHeaders['Authorization'] && !authHeaders['x-user-id']) {
      return [];
    }
    const res = await fetch(`${apiBase}/api/scripts`, {
      method: 'GET',
      headers: authHeaders,
      credentials: 'include'
    });
    if (!res.ok) {
      throw new Error(`Cloud fetch failed with status ${res.status}`);
    }
    const body = await res.json();
    const list = Array.isArray(body) ? body : (body.data || []);
    return list.map(normalizeScript);
  },

  async fetchScriptById(id: string): Promise<FreeTierScript | undefined> {
    const res = await fetch(`${apiBase}/api/scripts/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    if (res.status === 404) return undefined;
    if (!res.ok) {
      throw new Error(`Cloud fetch script ${id} failed with status ${res.status}`);
    }
    const body = await res.json();
    return normalizeScript(body.data || body);
  },

  async saveScript(script: Partial<FreeTierScript>): Promise<FreeTierScript> {
    const res = await fetch(`${apiBase}/api/scripts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(script)
    });
    if (!res.ok) {
      throw new Error(`Cloud save script failed with status ${res.status}`);
    }
    const body = await res.json();
    return normalizeScript(body.data || body);
  },

  async updateScript(id: string, updates: Partial<FreeTierScript>): Promise<FreeTierScript> {
    const res = await fetch(`${apiBase}/api/scripts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      throw new Error(`Cloud update script ${id} failed with status ${res.status}`);
    }
    const body = await res.json();
    return normalizeScript(body.data || body);
  },

  async deleteScript(id: string): Promise<void> {
    const res = await fetch(`${apiBase}/api/scripts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    if (!res.ok) {
      throw new Error(`Cloud delete script ${id} failed with status ${res.status}`);
    }
  },

  async toggleFavorite(id: string, isFavorite: boolean): Promise<FreeTierScript> {
    return this.updateScript(id, { isFavorite });
  },

  async renameScript(id: string, title: string): Promise<FreeTierScript> {
    return this.updateScript(id, { title });
  }
};
