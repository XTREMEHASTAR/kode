import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { extractFramesFromVideo } from '../utils/frameExtractor';
import { videoAnalysisService } from '../services/videoAnalysisService';
import { useNavigate } from 'react-router-dom';
import { Video } from '../types';
import { CustomSelect } from '../components/ui/CustomSelect';


interface QueueItem {
  id: string;
  file?: File;
  name: string;
  size: string;
  totalSize: number;
  uploadedSize: number;
  progress: number;
  status: 'selected' | 'uploading' | 'processing' | 'success' | 'failed' | 'queued';
  speed: string;
  error?: string;
  version: string;
  caption: string;
  script: string;
  tags: string[];
  coverUrl: string;
  metadata?: {
    duration: number;
    width: number;
    height: number;
    aspectRatio: string;
    orientation: 'portrait' | 'landscape' | 'square';
  };
  frames?: Array<{
    timestamp: number;
    dataUrl: string;
  }>;
  selectedThumbnailIndex?: number;
  audience?: {
    ageRange: string;
    location: string;
    interests: string;
    goals: string;
    platforms: string[];
  };
}

export const Upload: React.FC = () => {
  const { showToast, currentProject, refreshData, videos } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'local' | 'instagram'>('local');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [scrapedReel, setScrapedReel] = useState<{
    id: string;
    thumbnail: string;
    caption: string;
    creator: string;
  } | null>(null);

  // Queue List
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [selectedQueueId, setSelectedQueueId] = useState<string>('');
  
  // Frame extraction progress indicator
  const [frameExtractionProgress, setFrameExtractionProgress] = useState<number | null>(null);

  // Sync existing videos from context into queue list
  useEffect(() => {
    if (videos) {
      const existingItems: QueueItem[] = videos.map(v => ({
        id: v.id,
        name: v.title || v.filename,
        size: v.duration ? `${(v.duration * 0.8).toFixed(1)} MB` : '12 MB',
        totalSize: v.duration ? parseFloat((v.duration * 0.8).toFixed(1)) : 12,
        uploadedSize: v.duration ? parseFloat((v.duration * 0.8).toFixed(1)) : 12,
        progress: 100,
        status: v.status === 'completed' ? 'success' : v.status === 'failed' ? 'failed' : 'processing',
        speed: '0 MB/s',
        version: '1.0',
        caption: v.caption || '',
        script: v.transcript || '',
        tags: v.tags || [],
        coverUrl: v.poster_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        audience: {
          ageRange: v.audience_analysis?.demographics?.age || 'All',
          location: v.audience_analysis?.demographics?.geography || 'Global',
          interests: v.audience_analysis?.psychographics?.join(', ') || '',
          goals: v.audience_analysis?.behavioral_triggers?.join(', ') || '',
          platforms: ['tiktok', 'instagram']
        }
      }));
      
      setQueue(existingItems);
      if (existingItems.length > 0 && !selectedQueueId) {
        setSelectedQueueId(existingItems[0].id);
      }
    }
  }, [videos]);

  const selectedItem = queue.find(item => item.id === selectedQueueId) || queue[0];

  // Video Preview States
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedItem?.file) {
      const url = URL.createObjectURL(selectedItem.file);
      setVideoObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (selectedItem && selectedItem.status === 'success') {
      const realVid = videos.find(v => v.id === selectedItem.id);
      if (realVid?.storage_path) {
        const apiBase = window.location.protocol === 'file:' ? '' : `${window.location.protocol}//${window.location.host}`;
        setVideoObjectUrl(`${apiBase}${realVid.storage_path}`);
      } else {
        setVideoObjectUrl(null);
      }
    } else {
      setVideoObjectUrl(null);
    }
  }, [selectedItem, videos]);

  // Form Fields Editor
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editScript, setEditScript] = useState('');
  const [editVersion, setEditVersion] = useState('1.0');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTagText, setNewTagText] = useState('');

  // Sync Form Editor state with selected item changes
  useEffect(() => {
    if (selectedItem) {
      setEditTitle(selectedItem.name);
      setEditCaption(selectedItem.caption);
      setEditScript(selectedItem.script || '');
      setEditVersion(selectedItem.version);
      setEditTags(selectedItem.tags);
    }
  }, [selectedQueueId, selectedItem]);

  // Form inputs modification handlers
  const handleTitleChange = (val: string) => {
    setEditTitle(val);
    setQueue(prev => prev.map(item => item.id === selectedQueueId ? { ...item, name: val } : item));
  };

  const handleCaptionChange = (val: string) => {
    setEditCaption(val);
    setQueue(prev => prev.map(item => item.id === selectedQueueId ? { ...item, caption: val } : item));
  };

  const handleScriptChange = (val: string) => {
    setEditScript(val);
    setQueue(prev => prev.map(item => item.id === selectedQueueId ? { ...item, script: val } : item));
  };

  const handleVersionChange = (val: string) => {
    setEditVersion(val);
    setQueue(prev => prev.map(item => item.id === selectedQueueId ? { ...item, version: val } : item));
  };

  const updateAudience = (updates: Partial<NonNullable<QueueItem['audience']>>) => {
    setQueue(prev => prev.map(item => {
      if (item.id === selectedQueueId) {
        const currentAudience = item.audience || { ageRange: 'All', location: 'Global', interests: '', goals: '', platforms: ['tiktok', 'instagram'] };
        return {
          ...item,
          audience: { ...currentAudience, ...updates }
        };
      }
      return item;
    }));
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Suggested Tags helper
  const addSuggestedTag = (tag: string) => {
    if (!editTags.includes(tag)) {
      const nextTags = [...editTags, tag];
      setEditTags(nextTags);
      setQueue(prev => prev.map(item => item.id === selectedQueueId ? { ...item, tags: nextTags } : item));
      showToast(`Added tag #${tag}`, 'success');
    }
  };

  const removeTag = (tag: string) => {
    const nextTags = editTags.filter(t => t !== tag);
    setEditTags(nextTags);
    setQueue(prev => prev.map(item => item.id === selectedQueueId ? { ...item, tags: nextTags } : item));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTagText.trim()) {
      e.preventDefault();
      const cleanTag = newTagText.trim().replace(/^#/, '');
      if (!editTags.includes(cleanTag)) {
        const nextTags = [...editTags, cleanTag];
        setEditTags(nextTags);
        setQueue(prev => prev.map(item => item.id === selectedQueueId ? { ...item, tags: nextTags } : item));
      }
      setNewTagText('');
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      addFilesToQueue(files);
    }
  };

  const handleFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(e.target.files);
    }
  };

  const addFilesToQueue = async (files: FileList) => {
    if (!currentProject) {
      showToast('Please select or create a project first.', 'error');
      return;
    }

    const file = files[0];
    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const tempId = `selected-${Math.random().toString(36).substr(2, 9)}`;

    const newItem: QueueItem = {
      id: tempId,
      file: file,
      name: file.name,
      size: `${sizeMB} MB`,
      totalSize: parseFloat(sizeMB),
      uploadedSize: 0,
      progress: 0,
      status: 'selected',
      speed: '0 MB/s',
      version: '1.0',
      caption: '',
      script: '',
      tags: ['uploaded', 'raw'],
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      audience: {
        ageRange: 'All',
        location: 'Global',
        interests: '',
        goals: '',
        platforms: ['tiktok', 'instagram']
      }
    };

    setQueue(prev => [newItem, ...prev]);
    setSelectedQueueId(tempId);
    showToast(`Parsing video metadata and frames...`, 'info');
    setFrameExtractionProgress(0);

    try {
      const result = await extractFramesFromVideo(file, (progress) => {
        setFrameExtractionProgress(progress);
      });

      setQueue(prev => prev.map(item => {
        if (item.id === tempId) {
          const firstFrame = result.frames[0]?.dataUrl || item.coverUrl;
          return {
            ...item,
            coverUrl: firstFrame,
            metadata: {
              duration: result.metadata.duration,
              width: result.metadata.width,
              height: result.metadata.height,
              aspectRatio: result.metadata.aspectRatio,
              orientation: result.metadata.orientation as 'portrait' | 'landscape' | 'square'
            },
            frames: result.frames.map(f => ({
              timestamp: f.timestamp,
              dataUrl: f.dataUrl
            })),
            selectedThumbnailIndex: 0
          };
        }
        return item;
      }));

      setFrameExtractionProgress(null);
      showToast(`Frame extraction completed successfully.`, 'success');
    } catch (err) {
      console.error("Frame extraction failed:", err);
      setFrameExtractionProgress(null);
      showToast(`Could not extract frames: ${(err as Error).message}`, 'warning');
    }
  };

  // Scrape Instagram URL Reels
  const handleImportInstagram = () => {
    if (!instagramUrl.trim()) {
      showToast('Please enter an Instagram Reel URL', 'error');
      return;
    }
    showToast('Scraping Instagram reel metadata...', 'info');
    setTimeout(() => {
      setScrapedReel({
        id: '3392817471928_insta.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150&auto=format&fit=crop&q=60',
        creator: 'creator_studio',
        caption: 'Unboxing the new generative design platform nodes. Workflow speeds are insane! 🚀 #genai #uiux'
      });
      showToast('Instagram reel scraped successfully', 'success');
    }, 1500);
  };

  const addInstagramReelToQueue = () => {
    if (!scrapedReel) return;
    const newItem: QueueItem = {
      id: `selected-${Math.random().toString(36).substr(2, 9)}`,
      name: scrapedReel.id,
      size: '14.2 MB',
      totalSize: 14.2,
      uploadedSize: 14.2,
      progress: 100,
      status: 'queued',
      speed: '0 MB/s',
      version: '1.0',
      caption: scrapedReel.caption,
      script: '',
      tags: ['instagram', 'scraped', 'unboxing'],
      coverUrl: scrapedReel.thumbnail,
      audience: {
        ageRange: 'All',
        location: 'Global',
        interests: '',
        goals: '',
        platforms: ['instagram']
      }
    };
    setQueue(prev => [newItem, ...prev]);
    setSelectedQueueId(newItem.id);
    setScrapedReel(null);
    setInstagramUrl('');
    showToast('Added Reel to queue', 'success');
  };

  const clearCompleted = () => {
    setQueue(prev => prev.filter(item => item.status !== 'success'));
    showToast('Cleared completed items', 'success');
  };

  const cancelQueueItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQueue(prev => prev.filter(item => item.id !== id));
    showToast('Cancelled item upload', 'warning');
  };

  const retryUploadItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'selected', progress: 0 } : item));
    showToast('Retrying file upload queue allocation', 'info');
  };

  const discardSelection = () => {
    setQueue(prev => prev.filter(item => item.id !== selectedQueueId));
    showToast('Discarded item', 'warning');
  };

  // Run Real Backend Pipeline & status polling
  const handleRunAIOrchestrator = async () => {
    if (!selectedItem) {
      showToast('No video selected.', 'error');
      return;
    }

    if (!currentProject) {
      showToast('No active project found.', 'error');
      return;
    }

    if (selectedItem.status === 'success') {
      showToast('Video already analyzed. Loading report...', 'success');
      navigate(`/assets/${selectedItem.id}/report`);
      return;
    }

    if (!selectedItem.file) {
      showToast('Cannot upload: File object missing.', 'error');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setTerminalLogs([
      '📂 [Media Engine] Intake Reel video stream: ' + selectedItem.name,
      '⚡ [AI Swarm Engine] Spawning 100,000 synthetic Instagram viewer personas...'
    ]);

    try {
      // 1. Upload Video
      setQueue(prev => prev.map(item => item.id === selectedQueueId ? { ...item, status: 'uploading', progress: 0 } : item));
      setTerminalLogs(prev => [...prev, `🚀 [Simulator] Distributing Reel payload: ${selectedItem.name} to AI Feed...`]);

      const uploadRes = await videoAnalysisService.uploadVideoFile(
        selectedItem.file,
        currentProject.id,
        editTitle,
        (progress) => {
          setQueue(prev => prev.map(item => {
            if (item.id === selectedQueueId) {
              return {
                ...item,
                progress: progress,
                uploadedSize: parseFloat(((item.totalSize * progress) / 100).toFixed(1))
              };
            }
            return item;
          }));
        }
      );

      if (!uploadRes.success || !uploadRes.video) {
        throw new Error('Upload failed. Server returned success = false');
      }

      const realVideoId = uploadRes.video.id;
      setActiveVideoId(realVideoId);
      setTerminalLogs(prev => [...prev, `✅ [Simulator] Feed distribution active. Assigned Simulation ID: ${realVideoId}`]);
      setTerminalLogs(prev => [...prev, `⏳ [AI Audience Swarm] Simulating viewer engagement, scroll stops, and retention...`]);

      setQueue(prev => prev.map(item => {
        if (item.id === selectedQueueId) {
          return {
            ...item,
            id: realVideoId,
            status: 'processing',
            progress: 100
          };
        }
        return item;
      }));
      setSelectedQueueId(realVideoId);

      // 2. Poll Status
      const finalVideo = await videoAnalysisService.pollAnalysisStatus(realVideoId, (polledVideo) => {
        setTerminalLogs(prev => {
          const logs = [...prev];
          const newMsg = `⚙️ [AI Audience] Swarm simulation progress: ${polledVideo.status.toUpperCase()}`;
          if (logs[logs.length - 1] !== newMsg) {
            logs.push(newMsg);
          }
          return logs;
        });
      });

      setTerminalLogs(prev => [
        ...prev,
        `📈 [Audience Retention] Computing frame-by-frame scroll stop probability and viewer drop-offs...`,
        `🏅 [Viral Potential] Calculating Viral Potential & Engagement Score...`,
        `✅ [Simulation Complete] AI Audience Swarm simulation finished successfully!`
      ]);

      // 3. Save manual inputs to backend
      setTerminalLogs(prev => [...prev, `💾 [Metadata] Syncing user options, tags, script, and thumbnail cover...`]);
      
      let posterUrl = finalVideo.poster_url;
      if (selectedItem.selectedThumbnailIndex !== undefined && selectedItem.frames) {
        const chosenFrame = selectedItem.frames[selectedItem.selectedThumbnailIndex];
        if (chosenFrame) {
          posterUrl = chosenFrame.dataUrl;
        }
      }

      const audienceDetails = selectedItem.audience || { ageRange: 'All', location: 'Global', interests: '', goals: '', platforms: ['tiktok', 'instagram'] };
      const updates: Partial<Video> = {
        title: editTitle,
        caption: editCaption,
        transcript: editScript,
        tags: editTags,
        poster_url: posterUrl,
        audience_analysis: {
          segments: [
            { name: audienceDetails.goals || 'Target Demographic', match_score: 95, explanation: `Matches specified interests: ${audienceDetails.interests || 'none'}` }
          ],
          demographics: {
            age: audienceDetails.ageRange,
            gender: 'All',
            geography: audienceDetails.location
          },
          psychographics: audienceDetails.interests.split(',').map(s => s.trim()).filter(Boolean),
          behavioral_triggers: [audienceDetails.goals].filter(Boolean)
        }
      };

      await videoAnalysisService.updateVideoDetails(realVideoId, updates);
      setTerminalLogs(prev => [...prev, `✨ [Complete] Score metadata sync completed. Ready for review!`]);

      await refreshData();

      setQueue(prev => prev.map(item => {
        if (item.id === realVideoId) {
          return {
            ...item,
            status: 'success',
            coverUrl: posterUrl || item.coverUrl
          };
        }
        return item;
      }));

      setAnalysisComplete(true);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
      showToast(`Orchestration failed: ${(err as Error).message}`, 'error');
      setQueue(prev => prev.map(item => item.id === selectedQueueId ? { ...item, status: 'failed', error: (err as Error).message } : item));
    }
  };

  const cancelAIAnalysis = () => {
    setIsAnalyzing(false);
    showToast('AI analysis view closed', 'warning');
  };

  const finishAIAnalysis = () => {
    setIsAnalyzing(false);
    showToast('Orchestration logs saved to Project details', 'success');
    const targetId = activeVideoId || selectedQueueId;
    if (targetId) {
      navigate(`/assets/${targetId}/report`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="dashboard-body" style={{ position: 'relative' }}>
      
      {/* 1. AI PROCESSING SCREEN OVERLAY */}
      {isAnalyzing && (
        <div className="ai-processing-overlay active">
          <div className="ai-radar-grid">
            <div className="ai-radar-circle"></div>
            <div className="ai-radar-circle"></div>
            <div className="ai-radar-circle"></div>
            <div className="ai-radar-core">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L3 15.094l5.096-.813L9 9.187l.813 5.094 5.096.813-5.096.813zM19.071 4.929l-1.414 1.414m0-1.414l1.414 1.414M12 3v1m0 16v1M3 12h1m16 0h1m-1.586-7.586l-1.414 1.414"/></svg>
            </div>
          </div>

          <h3 className="text-gradient font-bold" style={{ marginBottom: 'var(--space-xs)' }}>Aura AI Orchestrator</h3>
          <p className="text-body-small text-muted" style={{ marginBottom: 'var(--space-md)', maxWidth: '420px' }}>Analyzing creative hook elements, transcribing video dialog, and computing engagement readiness scoring...</p>

          {/* Terminal Console Logs */}
          <div className="ai-terminal-box">
            {terminalLogs.map((log, index) => (
              <div key={index} className="ai-terminal-line info" style={{ animationDelay: `${index * 50}ms` }}>
                {log}
              </div>
            ))}
          </div>

          <div className="flex-center" style={{ gap: 'var(--space-sm)' }}>
            {!analysisComplete ? (
              <button type="button" className="btn btn-tertiary" onClick={cancelAIAnalysis}>Cancel View</button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={finishAIAnalysis}>View Score Card</button>
            )}
          </div>
        </div>
      )}

      {/* 2. PRIMARY CONTENT LAYOUT */}
      <div className="grid-12 upload-grid-container" style={{ gap: 'var(--space-lg)', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: INTAKE & QUEUE */}
        <div className="col-span-7 flex-column" style={{ gap: 'var(--space-lg)' }}>
          
          {/* UPLOAD INTAKE PANEL */}
          <div className="card" style={{ padding: 'var(--space-md)' }}>
            <div className="intake-tabs">
              <button 
                className={`intake-tab-btn ${activeTab === 'local' ? 'active' : ''}`} 
                onClick={() => setActiveTab('local')}
              >
                Local File Intake
              </button>
              <button 
                className={`intake-tab-btn ${activeTab === 'instagram' ? 'active' : ''}`} 
                onClick={() => setActiveTab('instagram')}
              >
                Instagram Import
              </button>
            </div>

            {/* Local intake tab */}
            {activeTab === 'local' && (
              <div className="intake-tab-content active">
                <label 
                  className="dropzone-container"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{ display: 'block' }}
                >
                  <div className="dropzone-icon-wrapper">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                  </div>
                  <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-xxs)' }}>Drag & drop media files here</h4>
                  <p className="text-detail text-secondary" style={{ marginBottom: 'var(--space-sm)' }}>Supports MP4, MOV, WEBM up to 2 GB per file.</p>
                  <span className="btn btn-secondary btn-sm" style={{ display: 'inline-block' }}>Choose Files</span>
                  <input type="file" style={{ display: 'none' }} accept="video/*" onChange={handleFileSelectChange} />
                </label>
              </div>
            )}

            {/* Instagram intake tab */}
            {activeTab === 'instagram' && (
              <div className="intake-tab-content active">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  <label className="text-detail font-bold text-muted">Instagram Post / Reel URL</label>
                  <div className="instagram-input-group">
                    <input 
                      type="url" 
                      className="input" 
                      style={{ flexGrow: 1 }} 
                      placeholder="https://www.instagram.com/reel/C8..." 
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleImportInstagram}>
                      Fetch Reel
                    </button>
                  </div>
                  <p className="text-detail text-secondary">Aura AI will scrape metadata, tags, and fetch the video asset directly into your workspace.</p>
                </div>

                {/* Instagram Preview */}
                {scrapedReel && (
                  <div className="instagram-preview-card">
                    <img className="instagram-preview-thumbnail" src={scrapedReel.thumbnail} alt="Instagram Reel Poster" />
                    <div className="flex-column" style={{ flexGrow: 1, justifyContent: 'center', gap: '4px' }}>
                      <div className="flex-between">
                        <span className="text-detail font-bold text-primary">@{scrapedReel.creator}</span>
                        <span className="badge badge-success" style={{ fontSize: '0.625rem' }}>Reel Scraped</span>
                      </div>
                      <p className="text-detail text-muted font-mono" style={{ fontSize: '0.65rem', wordBreak: 'break-all' }}>ID: {scrapedReel.id}</p>
                      <p className="text-detail text-secondary" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                        {scrapedReel.caption}
                      </p>
                      <div style={{ marginTop: '4px' }}>
                        <button className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '0.6875rem' }} onClick={addInstagramReelToQueue}>
                          Add to Queue
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BATCH UPLOAD QUEUE PANEL */}
          <div className="card" style={{ padding: 'var(--space-md)', flex: 1 }}>
            <div className="flex-between" style={{ marginBottom: 'var(--space-sm)' }}>
              <div className="flex-center" style={{ gap: 'var(--space-xs)' }}>
                <h3 className="font-bold text-primary">Upload Queue</h3>
                <span className="badge badge-indigo">{queue.length} Items</span>
              </div>
              <button className="btn btn-tertiary btn-sm" onClick={clearCompleted}>Clear Finished</button>
            </div>

            <div className="queue-container">
              {queue.map(item => (
                <div 
                  key={item.id} 
                  className={`queue-item ${item.id === selectedQueueId ? 'selected' : ''}`}
                  onClick={() => setSelectedQueueId(item.id)}
                >
                  <div className="queue-item-thumbnail">
                    {item.coverUrl ? (
                      <img src={item.coverUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Poster frame preview" />
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
                    )}
                  </div>
                  
                  <div className="queue-item-details">
                    <div className="flex-between">
                      <span className="text-body-small font-bold text-primary truncate" style={{ maxWidth: '180px' }}>{item.name}</span>
                      {item.status === 'uploading' && <span className="text-detail text-secondary font-mono">{item.progress}% ({item.speed})</span>}
                      {item.status === 'selected' && <span className="badge badge-info" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>Ready</span>}
                      {item.status === 'queued' && <span className="text-detail text-muted font-medium">Queued</span>}
                      {item.status === 'processing' && <span className="badge badge-warning animate-pulse" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>Analyzing</span>}
                      {item.status === 'success' && <span className="badge badge-success" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>Success</span>}
                      {item.status === 'failed' && <span className="badge badge-error" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>Failed</span>}
                    </div>
                    <div className="queue-progress-bar">
                      <div className={`queue-progress-fill ${item.status === 'success' ? 'success' : item.status === 'failed' ? 'error' : item.status === 'processing' ? 'indigo' : ''}`} style={{ width: `${item.progress || (item.status === 'success' ? 100 : 0)}%` }}></div>
                    </div>
                    <span className="text-detail text-secondary" style={{ fontSize: '0.6875rem', marginTop: '2px', display: 'block' }}>
                      {item.status === 'failed' ? `Error: ${item.error}` : `${item.size} • Pipeline synced`}
                    </span>
                  </div>

                  <div onClick={e => e.stopPropagation()}>
                    {item.status === 'failed' ? (
                      <button className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '0.6875rem' }} onClick={(e) => retryUploadItem(item.id, e)}>Retry</button>
                    ) : (
                      <button className="btn btn-icon-only btn-tertiary btn-sm" onClick={(e) => cancelQueueItem(item.id, e)}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {queue.length === 0 && (
                <div className="text-center text-muted" style={{ padding: 'var(--space-lg)' }}>
                  No items in queue. Drag & drop a video file above to start!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VIDEO PLAYBACK & METADATA EDITOR */}
        <div className="col-span-5 flex-column" style={{ gap: 'var(--space-lg)' }}>
          <div className="card" style={{ padding: 'var(--space-md)' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
              <h3 className="font-bold text-primary">Metadata & Video Options</h3>
              <div className="flex-center" style={{ gap: 'var(--space-xxs)' }}>
                <label className="text-detail text-secondary font-medium">Version:</label>
                <CustomSelect
                  value={editVersion}
                  onChange={(val) => handleVersionChange(val)}
                  width="130px"
                  options={[
                    { value: '1.0', label: 'v1.0 (Init)' },
                    { value: '1.1', label: 'v1.1 (Hook)' },
                    { value: '2.0', label: 'v2.0 (Edit)' }
                  ]}
                />
              </div>
            </div>

            {/* Frame extraction progress banner */}
            {frameExtractionProgress !== null && (
              <div style={{ backgroundColor: 'var(--brand-primary-glow)', padding: 'var(--space-xs)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-sm)' }}>
                <span className="text-detail font-bold text-primary block">Extracting Frames & Metadata: {frameExtractionProgress}%</span>
                <div className="queue-progress-bar" style={{ marginTop: '4px' }}>
                  <div className="queue-progress-fill" style={{ width: `${frameExtractionProgress}%` }}></div>
                </div>
              </div>
            )}

            {/* Video preview player */}
            <div className="video-preview-wrapper" style={{ position: 'relative', overflow: 'hidden', minHeight: '200px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
              {videoObjectUrl ? (
                <video
                  key={videoObjectUrl}
                  src={videoObjectUrl}
                  className="video-preview-element"
                  style={{ width: '100%', maxHeight: '280px', objectFit: 'contain' }}
                  controls
                  poster={selectedItem?.coverUrl}
                />
              ) : selectedItem?.coverUrl ? (
                <img 
                  className="video-preview-element" 
                  src={selectedItem.coverUrl} 
                  alt="Selected cover preview poster frame" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="flex-center text-muted" style={{ padding: 'var(--space-lg)' }}>
                  No video selected
                </div>
              )}
            </div>

            {/* Video Metadata details banner */}
            {selectedItem?.metadata && (
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="flex-between">
                  <span className="text-muted">Duration:</span>
                  <span className="font-bold text-primary">{selectedItem.metadata.duration.toFixed(2)}s</span>
                </div>
                <div className="flex-between">
                  <span className="text-muted">Resolution:</span>
                  <span className="font-bold text-primary">{selectedItem.metadata.width}x{selectedItem.metadata.height} ({selectedItem.metadata.aspectRatio})</span>
                </div>
                <div className="flex-between">
                  <span className="text-muted">Orientation:</span>
                  <span className="font-bold text-primary" style={{ textTransform: 'capitalize' }}>{selectedItem.metadata.orientation}</span>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="flex-column" style={{ gap: 'var(--space-sm)' }}>
              <div className="form-group">
                <label className="form-label">Upload Asset Name</label>
                <input 
                  type="text" 
                  className="input" 
                  value={editTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Video Script / Transcript</label>
                <textarea 
                  className="input" 
                  value={editScript}
                  onChange={(e) => handleScriptChange(e.target.value)}
                  placeholder="Enter the spoken script or transcript of this video..."
                  style={{ height: '72px', resize: 'none' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Publisher Caption</label>
                <textarea 
                  className="input" 
                  value={editCaption}
                  onChange={(e) => handleCaptionChange(e.target.value)}
                  placeholder="Enter the post caption (e.g. for Instagram / TikTok)..."
                  style={{ height: '72px', resize: 'none' }}
                />
              </div>

              {/* Thumbnail Selector using extracted frames */}
              <div className="form-group">
                <label className="form-label">Select Thumbnail Cover Frame</label>
                {selectedItem?.frames && selectedItem.frames.length > 0 ? (
                  <div className="thumbnail-selector-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-xs)', marginTop: '6px' }}>
                    {selectedItem.frames.map((frame, index) => (
                      <div 
                        key={index} 
                        className={`thumbnail-option ${selectedItem.selectedThumbnailIndex === index ? 'selected' : ''}`}
                        onClick={() => {
                          setQueue(prev => prev.map(item => item.id === selectedQueueId ? { ...item, selectedThumbnailIndex: index, coverUrl: frame.dataUrl } : item));
                        }}
                        style={{ 
                          cursor: 'pointer', 
                          borderRadius: 'var(--radius-sm)', 
                          overflow: 'hidden', 
                          border: selectedItem.selectedThumbnailIndex === index ? '2px solid var(--brand-primary)' : '2px solid transparent',
                          aspectRatio: '16/9',
                          position: 'relative'
                        }}
                      >
                        <img src={frame.dataUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Frame ${index}`} />
                        <span style={{ position: 'absolute', bottom: '2px', right: '2px', fontSize: '10px', background: 'rgba(0,0,0,0.6)', padding: '1px 3px', borderRadius: '2px', color: '#fff' }}>
                          {frame.timestamp.toFixed(1)}s
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-detail text-muted">No frames extracted yet. Drag & drop a video file to view keyframe suggestions.</p>
                )}
              </div>

              {/* Tags Editor */}
              <div className="form-group">
                <label className="form-label">Optimized Hashtags</label>
                <div className="tag-badges-container">
                  {editTags.map(t => (
                    <div key={t} className="tag-badge">
                      #{t}
                      <span className="tag-badge-remove" onClick={() => removeTag(t)}>&times;</span>
                    </div>
                  ))}
                  <input 
                    type="text" 
                    className="tag-badge-input" 
                    placeholder="Type and hit Enter..." 
                    value={newTagText}
                    onChange={(e) => setNewTagText(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                  />
                </div>
                <div className="flex-center" style={{ gap: '4px', flexWrap: 'wrap' }}>
                  <span className="text-detail text-secondary">Suggestions:</span>
                  <button className="btn btn-tertiary" style={{ padding: '2px 6px', fontSize: '0.6875rem', borderRadius: 'var(--radius-full)' }} onClick={() => addSuggestedTag('saas')}>+ #saas</button>
                  <button className="btn btn-tertiary" style={{ padding: '2px 6px', fontSize: '0.6875rem', borderRadius: 'var(--radius-full)' }} onClick={() => addSuggestedTag('neuralnode')}>+ #neuralnode</button>
                  <button className="btn btn-tertiary" style={{ padding: '2px 6px', fontSize: '0.6875rem', borderRadius: 'var(--radius-full)' }} onClick={() => addSuggestedTag('creativeai')}>+ #creativeai</button>
                </div>
              </div>

              {/* Target Audience Preference Controls */}
              <div style={{ borderTop: '1px solid var(--border-default)', marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)' }}>
                <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-sm)', fontSize: '0.875rem' }}>Target Audience Settings</h4>
                
                <div className="form-group">
                  <label className="form-label">Target Platforms</label>
                  <div className="flex-center" style={{ gap: 'var(--space-md)', marginTop: '4px', justifyContent: 'flex-start' }}>
                    {['TikTok', 'Instagram', 'YouTube'].map(platform => {
                      const value = platform.toLowerCase();
                      const checked = selectedItem?.audience?.platforms.includes(value) || false;
                      return (
                        <label key={platform} className="flex-center" style={{ gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                          <input 
                            type="checkbox" 
                            checked={checked}
                            onChange={(e) => {
                              const currentPlatforms = selectedItem?.audience?.platforms || [];
                              const nextPlatforms = e.target.checked 
                                ? [...currentPlatforms, value]
                                : currentPlatforms.filter(p => p !== value);
                              updateAudience({ platforms: nextPlatforms });
                            }}
                          />
                          {platform}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                  <div className="form-group">
                    <label className="form-label">Age Range</label>
                    <CustomSelect
                      value={selectedItem?.audience?.ageRange || 'All'}
                      onChange={(val) => updateAudience({ ageRange: val })}
                      options={[
                        { value: 'All', label: 'All Ages' },
                        { value: '13-17', label: '13-17 (Gen Z Teens)' },
                        { value: '18-24', label: '18-24 (Gen Z Young Adults)' },
                        { value: '25-34', label: '25-34 (Millennials)' },
                        { value: '35-54', label: '35-54 (Gen X)' }
                      ]}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country / Location</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="e.g. United States, Global"
                      value={selectedItem?.audience?.location || ''}
                      onChange={(e) => updateAudience({ location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                  <div className="form-group">
                    <label className="form-label">Interests (Comma separated)</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="e.g. Fitness, Gaming, Tech"
                      value={selectedItem?.audience?.interests || ''}
                      onChange={(e) => updateAudience({ interests: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Campaign Goal</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="e.g. Conversions, Brand Awareness"
                      value={selectedItem?.audience?.goals || ''}
                      onChange={(e) => updateAudience({ goals: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xs)' }}>
                <button className="btn btn-tertiary" style={{ flex: 1 }} onClick={discardSelection}>Discard Item</button>
                <button className="btn btn-primary" style={{ flex: 2, gap: 'var(--space-xxs)' }} onClick={handleRunAIOrchestrator}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L3 15.094l5.096-.813L9 9.187l.813 5.094 5.096.813-5.096.813zM19.071 4.929l-1.414 1.414m0-1.414l1.414 1.414M12 3v1m0 16v1M3 12h1m16 0h1m-1.586-7.586l-1.414 1.414"/></svg>
                  Analyze & Score AI
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
