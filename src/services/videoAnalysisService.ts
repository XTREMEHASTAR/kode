import { Video } from '../types';
import { getAuthHeaders } from './authService';

const isLocalFile = typeof window !== 'undefined' && window.location.protocol === 'file:';
const apiBase = isLocalFile ? '' : `${window.location.protocol}//${window.location.host}`;

export const videoAnalysisService = {
  /**
   * Uploads a real video file to the backend
   */
  async uploadVideoFile(
    file: File,
    projectId: string,
    title: string,
    onProgress?: (pct: number) => void
  ): Promise<{ success: boolean; video: Video }> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('project_id', projectId);
    formData.append('title', title);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${apiBase}/api/upload`);

      const authHeaders = getAuthHeaders();
      if (authHeaders['Authorization']) {
        xhr.setRequestHeader('Authorization', authHeaders['Authorization']);
      }

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
          try {
            const res = JSON.parse(xhr.responseText);
            resolve(res);
          } catch (e) {
            reject(new Error('Failed to parse upload response.'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload.'));
      xhr.send(formData);
    });
  },

  /**
   * Polls the analysis status from the backend until it is completed or failed
   */
  async pollAnalysisStatus(
    videoId: string,
    onStatusChange?: (video: Video) => void,
    intervalMs: number = 2000,
    timeoutMs: number = 180000
  ): Promise<Video> {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const res = await fetch(`${apiBase}/api/analysis/${videoId}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch analysis status: ${res.status}`);
          }
          const video: Video = await res.json();
          
          if (onStatusChange) {
            onStatusChange(video);
          }

          if (video.status === 'completed') {
            resolve(video);
          } else if (video.status === 'failed') {
            reject(new Error('Video processing pipeline failed on server.'));
          } else if (Date.now() - startTime > timeoutMs) {
            reject(new Error('Video processing timed out.'));
          } else {
            setTimeout(checkStatus, intervalMs);
          }
        } catch (err) {
          reject(err);
        }
      };

      setTimeout(checkStatus, 0);
    });
  },

  /**
   * Updates video record details in the DB
   */
  async updateVideoDetails(videoId: string, updates: Partial<Video>): Promise<void> {
    const res = await fetch(`${apiBase}/api/videos/${videoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!res.ok) {
      throw new Error(`Failed to update video: ${res.status}`);
    }
  }
};
