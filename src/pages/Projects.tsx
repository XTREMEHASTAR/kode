import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CustomSelect } from '../components/ui/CustomSelect';

interface ProjectItem {
  id: string;
  name: string;
  folder: string;
  status: 'completed' | 'running' | 'failed' | 'archived';
  confidence: number;
  description: string;
  version: string;
  timeAgo: string;
  videoId?: string;
  parameters: {
    cfgScale: number;
    steps: number;
    baseWeights: string;
  };
}

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, projects, videos, currentProject } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('recent');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  // Tabs for project details
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'versions' | 'comments'>('overview');
  
  // Comments state
  const [comments, setComments] = useState<Array<{ sender: string; avatar: string; text: string; time: string; color: string }>>([
    { sender: 'Sarah Jenkins', avatar: 'SJ', text: 'The video synthesis on Euler loop looks correct, but we should test SDXL base resolution settings for the mobile crop mockup.', time: '3 hours ago', color: 'var(--accent-blue-bg)' },
    { sender: 'Aura AI Agent', avatar: 'AI', text: 'Anomalies check complete. Average latency is within thresholds (14ms). Performance metrics score: 98.2%.', time: '2 hours ago', color: 'var(--brand-primary-glow)' }
  ]);
  const [commentInput, setCommentInput] = useState('');

  // Attachments state
  const [attachments, setAttachments] = useState<Array<{ name: string; size: string; type: string }>>([
    { name: 'hero_video_inference.mp4', size: '24.5 MB', type: 'Rendered' },
    { name: 'raw_asset_record.mov', size: '124.0 MB', type: 'Source Video' }
  ]);

  // Project Modal creation
  const [modalOpen, setModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjFolder, setNewProjFolder] = useState('Marketing Ads');
  const [newProjDesc, setNewProjDesc] = useState('');

  React.useEffect(() => {
    console.log("🔍 [LIFECYCLE] Projects component MOUNTED");
    return () => console.log("🔍 [LIFECYCLE] Projects component UNMOUNTED");
  }, []);

  React.useEffect(() => {
    console.log("🔍 [STATE] Projects render. modalOpen =", modalOpen);
  });

  React.useEffect(() => {
    console.log("🔍 [STATE] modalOpen changed to:", modalOpen);
  }, [modalOpen]);

  // Base list of projects
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([
    {
      id: '1',
      name: 'hero_video_inference.mp4',
      folder: 'Marketing Ads',
      status: 'completed',
      confidence: 98.2,
      description: 'Stable Video synthesis inference logs.',
      version: 'v2.4',
      timeAgo: '2 mins ago',
      parameters: { cfgScale: 7.5, steps: 50, baseWeights: 'SD-XL v1.0-refiner' }
    },
    {
      id: '2',
      name: 'banner_creative_ad.png',
      folder: 'Marketing Ads',
      status: 'completed',
      confidence: 96.8,
      description: 'Upscaled resolution promo billboard concept.',
      version: 'v1.0',
      timeAgo: '1 hour ago',
      parameters: { cfgScale: 6.0, steps: 30, baseWeights: 'SD-XL base' }
    },
    {
      id: '3',
      name: 'model_v5_test_loop.pt',
      folder: 'Core Pipelines',
      status: 'running',
      confidence: 0,
      description: 'Inference test loop running on cluster node-4.',
      version: 'v5.0-alpha',
      timeAgo: 'Just now',
      parameters: { cfgScale: 9.0, steps: 100, baseWeights: 'KONTAGI-Base-v5' }
    },
    {
      id: '4',
      name: 'voiceover_narrative.wav',
      folder: 'Audio Prompts',
      status: 'completed',
      confidence: 94.1,
      description: 'AI Voice synthesis output from text prompts.',
      version: 'v1.2',
      timeAgo: '4 hours ago',
      parameters: { cfgScale: 8.0, steps: 40, baseWeights: 'XTTS-v2' }
    },
    {
      id: '5',
      name: 'landing_page_concept.sketch',
      folder: 'Design Assets',
      status: 'archived',
      confidence: 0,
      description: 'Initial design prototype concepts and templates.',
      version: 'v0.9',
      timeAgo: 'Yesterday',
      parameters: { cfgScale: 5.0, steps: 20, baseWeights: 'StableDiffusion-Design' }
    },
    {
      id: '6',
      name: 'evaluation_metrics_v2.json',
      folder: 'Core Pipelines',
      status: 'failed',
      confidence: 0,
      description: 'Pipeline evaluation runs on validation sets.',
      version: 'v2.0',
      timeAgo: '2 days ago',
      parameters: { cfgScale: 7.0, steps: 50, baseWeights: 'KONTAGI-Eval-v2' }
    }
  ]);

  // Combine static demonstration items with real uploaded video assets from AppContext
  const realVideoItems: ProjectItem[] = videos.map(v => ({
    id: v.id,
    videoId: v.id,
    name: v.title || v.filename || 'Untitled Video Asset',
    folder: currentProject?.name || 'Uploaded Assets',
    status: v.status === 'completed' ? 'completed' : v.status === 'failed' ? 'failed' : 'running',
    confidence: v.score || v.hook_score || 0,
    description: v.caption || `Uploaded video asset (${v.filename || 'mp4'})`,
    version: 'v1.0-real',
    timeAgo: v.created_at ? new Date(v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
    parameters: { cfgScale: 7.5, steps: 50, baseWeights: 'ProductionInferencePipeline' }
  }));

  const combinedProjectsList = [...realVideoItems, ...projectsList];

  const activeProject = combinedProjectsList.find(p => p.id === activeProjectId) || null;

  // Folder Counts Helper
  const getFolderCount = (folder: string) => {
    if (folder === 'all') return combinedProjectsList.length;
    return combinedProjectsList.filter(p => p.folder === folder || (folder === 'Archived' && p.status === 'archived')).length;
  };

  const handleSearchFilter = () => {
    // Processed inside render filters below
  };

  const handleSort = () => {
    showToast("Sorted project list.", "success");
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const proj = projectsList.find(p => p.id === id);
    if (proj) {
      const newProj: ProjectItem = {
        ...proj,
        id: Math.random().toString(),
        name: `Copy of ${proj.name}`,
        timeAgo: 'Just now'
      };
      setProjectsList(prev => [...prev, newProj]);
      showToast('Project duplicated successfully.', 'success');
    }
  };

  const handleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectsList(prev => prev.map(p => p.id === id ? { ...p, status: 'archived' } : p));
    showToast('Project archived successfully.', 'success');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectsList(prev => prev.filter(p => p.id !== id));
    showToast('Project deleted.', 'warning');
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) {
      showToast('Please enter a project name', 'error');
      return;
    }

    const newProj: ProjectItem = {
      id: Math.random().toString(),
      name: newProjName,
      folder: newProjFolder,
      status: 'running',
      confidence: 0,
      description: newProjDesc || 'Inference pipeline scheduled.',
      version: 'v1.0',
      timeAgo: 'Just now',
      parameters: { cfgScale: 7.5, steps: 50, baseWeights: 'SD-XL v1.0' }
    };

    setProjectsList(prev => [newProj, ...prev]);
    setNewProjName('');
    setNewProjDesc('');
    setModalOpen(false);
    showToast(`Created project ${newProjName}`, 'success');
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    const newComment = {
      sender: 'Jaiveer Hastar',
      avatar: 'JH',
      text: commentInput,
      time: 'Just now',
      color: 'var(--brand-secondary)'
    };
    setComments(prev => [...prev, newComment]);
    setCommentInput('');
    showToast('Comment posted', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: 'Attachment'
      }));
      setAttachments(prev => [...prev, ...newFiles]);
      showToast(`Uploaded ${files.length} attachment(s)`, 'success');
    }
  };

  // Filter & Sort Pipeline
  const filteredProjects = combinedProjectsList
    .filter(p => {
      // Folder filter
      if (selectedFolder !== 'all') {
        if (selectedFolder === 'Archived') {
          return p.status === 'archived';
        }
        if (p.status === 'archived') return false; // exclude archived from regular folders
        if (p.folder !== selectedFolder) return false;
      } else {
        if (p.status === 'archived' && statusFilter !== 'archived') return false; // exclude archived unless specifically filtering status archived
      }
      
      // Status filter
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      // Search Query filter
      if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === 'confidence') {
        return b.confidence - a.confidence;
      }
      // default: recent
      return 0;
    });

  return (
    <>
      {/* 1. PROJECT LIST VIEW SCREEN */}
      {!activeProjectId ? (
        <div className="view-project-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', flex: 1 }}>
          
          {/* Sub Header Toolbar */}
          <div className="flex-between card" style={{ padding: 'var(--space-sm) var(--space-md)', flexDirection: 'row', gap: 'var(--space-md)' }}>
            <div className="flex-center" style={{ gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <span className="text-body-small font-bold text-secondary">Filters:</span>
              
              <CustomSelect
                value={statusFilter}
                onChange={(val) => { setStatusFilter(val); handleSort(); }}
                width="160px"
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'running', label: 'Running' },
                  { value: 'failed', label: 'Failed' },
                  { value: 'archived', label: 'Archived' }
                ]}
              />

              <CustomSelect
                value={sortOption}
                onChange={(val) => { setSortOption(val); handleSort(); }}
                width="160px"
                options={[
                  { value: 'recent', label: 'Sort: Recent' },
                  { value: 'name', label: 'Sort: Name' },
                  { value: 'confidence', label: 'Sort: Confidence' }
                ]}
              />

              <div className="input-container" style={{ marginBottom: 0, width: '180px' }}>
                <input 
                  type="text" 
                  className="input input-sm" 
                  placeholder="Filter by name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-center" style={{ gap: 'var(--space-md)' }}>
              <div className="flex-center" style={{ gap: 'var(--space-xs)' }}>
                <button 
                  className={`btn btn-tertiary btn-sm ${viewMode === 'grid' ? 'active' : ''}`} 
                  onClick={() => setViewMode('grid')}
                  style={{ padding: 'var(--space-xs)' }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                </button>
                <button 
                  className={`btn btn-tertiary btn-sm ${viewMode === 'list' ? 'active' : ''}`} 
                  onClick={() => setViewMode('list')}
                  style={{ padding: 'var(--space-xs)' }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '4px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                New Project
              </button>
            </div>
          </div>

          {/* Grid Layout Explorer */}
          <div className="projects-layout-container">
            {/* Left Folders Explorer */}
            <aside className="folders-sidebar">
              <span className="text-detail font-bold text-muted" style={{ textTransform: 'uppercase', marginBottom: 'var(--space-xxs)', display: 'block' }}>Folders</span>
              
              <div className={`folder-item ${selectedFolder === 'all' ? 'active' : ''}`} onClick={() => setSelectedFolder('all')}>
                <span>📁 All Projects</span>
                <span className="folder-count">{getFolderCount('all')}</span>
              </div>
              <div className={`folder-item ${selectedFolder === 'Marketing Ads' ? 'active' : ''}`} onClick={() => setSelectedFolder('Marketing Ads')}>
                <span>📁 Marketing Ads</span>
                <span className="folder-count">{getFolderCount('Marketing Ads')}</span>
              </div>
              <div className={`folder-item ${selectedFolder === 'Core Pipelines' ? 'active' : ''}`} onClick={() => setSelectedFolder('Core Pipelines')}>
                <span>📁 Core Pipelines</span>
                <span className="folder-count">{getFolderCount('Core Pipelines')}</span>
              </div>
              <div className={`folder-item ${selectedFolder === 'Audio Prompts' ? 'active' : ''}`} onClick={() => setSelectedFolder('Audio Prompts')}>
                <span>📁 Audio Prompts</span>
                <span className="folder-count">{getFolderCount('Audio Prompts')}</span>
              </div>
              <div className={`folder-item ${selectedFolder === 'Design Assets' ? 'active' : ''}`} onClick={() => setSelectedFolder('Design Assets')}>
                <span>📁 Design Assets</span>
                <span className="folder-count">{getFolderCount('Design Assets')}</span>
              </div>
              <div className={`folder-item ${selectedFolder === 'Archived' ? 'active' : ''}`} onClick={() => setSelectedFolder('Archived')}>
                <span>📥 Archived</span>
                <span className="folder-count">{getFolderCount('Archived')}</span>
              </div>
            </aside>

            {/* Right Pane List */}
            <div className="projects-list-pane">
              {viewMode === 'grid' ? (
                <div className="projects-grid">
                  {filteredProjects.map(proj => (
                    <div 
                      key={proj.id} 
                      className="project-card" 
                      onClick={() => setActiveProjectId(proj.id)}
                    >
                      <div className="project-thumbnail-wrapper">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: proj.status === 'completed' ? 'var(--brand-primary)' : proj.status === 'running' ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                          <rect x="2" y="2" width="20" height="20" rx="2" ry="2"/>
                          <line x1="7" y1="2" x2="7" y2="22"/>
                          <line x1="17" y1="2" x2="17" y2="22"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                        </svg>
                        <div className="project-card-actions" onClick={e => e.stopPropagation()}>
                          <button className="btn btn-primary btn-sm" style={{ padding: '2px 6px', fontSize: '0.625rem', marginRight: '4px' }} onClick={(e) => { e.stopPropagation(); navigate(`/assets/${proj.videoId || proj.id}/report`); }}>View Report</button>
                          <button className="btn btn-tertiary btn-sm" style={{ padding: '2px 6px', fontSize: '0.625rem' }} onClick={(e) => handleDuplicate(proj.id, e)}>Copy</button>
                          <button className="btn btn-tertiary btn-sm" style={{ padding: '2px 6px', fontSize: '0.625rem', marginLeft: '4px' }} onClick={(e) => handleArchive(proj.id, e)}>Archive</button>
                          <button className="btn btn-ghost btn-sm text-danger" style={{ padding: '2px 6px', fontSize: '0.625rem', marginLeft: '4px' }} onClick={(e) => handleDelete(proj.id, e)}>Delete</button>
                        </div>
                      </div>
                      <div className="project-card-body">
                        <div className="flex-between">
                          <span className={`badge badge-${proj.status === 'completed' ? 'success' : proj.status === 'running' ? 'info' : proj.status === 'failed' ? 'danger' : 'warning'} text-xxs`}>
                            {proj.status.toUpperCase()}
                          </span>
                          <span className="text-detail font-mono text-muted">{proj.version}</span>
                        </div>
                        <h4 className="text-body font-bold text-primary" style={{ marginTop: '4px' }}>{proj.name}</h4>
                        <p className="text-detail text-secondary">{proj.description}</p>
                        <div className="flex-between" style={{ marginTop: 'var(--space-xs)', borderTop: '1px solid var(--border-muted)', paddingTop: 'var(--space-xs)' }}>
                          <span className="text-detail text-muted">Confidence: <b className="font-mono text-primary">{proj.confidence > 0 ? `${proj.confidence}%` : '--'}</b></span>
                          <span className="text-detail text-secondary">{proj.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredProjects.length === 0 && (
                    <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-secondary)' }}>
                      No projects found matching the active criteria.
                    </div>
                  )}
                </div>
              ) : (
                <div className="table-container card">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Asset Name</th>
                        <th>Folder</th>
                        <th>Status</th>
                        <th>Confidence</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map(proj => (
                        <tr key={proj.id} style={{ cursor: 'pointer' }} onClick={() => setActiveProjectId(proj.id)}>
                          <td className="font-bold text-primary">{proj.name}</td>
                          <td className="text-secondary">{proj.folder}</td>
                          <td>
                            <span className={`badge badge-${proj.status === 'completed' ? 'success' : proj.status === 'running' ? 'info' : proj.status === 'failed' ? 'danger' : 'warning'}`}>
                              {proj.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="font-mono">{proj.confidence > 0 ? `${proj.confidence}%` : '--'}</td>
                          <td className="text-secondary">{proj.timeAgo}</td>
                          <td onClick={e => e.stopPropagation()}>
                            <button className="btn btn-primary btn-sm" style={{ marginRight: '6px' }} onClick={(e) => { e.stopPropagation(); navigate(`/assets/${proj.videoId || proj.id}/report`); }}>View Report</button>
                            <button className="btn btn-ghost btn-sm" onClick={(e) => handleDuplicate(proj.id, e)}>Duplicate</button>
                            <button className="btn btn-ghost btn-sm text-danger" onClick={(e) => handleDelete(proj.id, e)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* 2. PROJECT DETAILED SCREEN SUB-PANEL */
        <div className="view-project-details" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', flex: 1 }}>
          <div className="flex-between">
            <ul className="breadcrumbs" style={{ marginBottom: 0 }}>
              <li><a href="#projects" onClick={(e) => { e.preventDefault(); setActiveProjectId(null); }}>Projects</a></li>
              <li>{activeProject?.folder}</li>
              <li className="active">{activeProject?.name}</li>
            </ul>
            <button className="btn btn-tertiary btn-sm" onClick={() => setActiveProjectId(null)}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '4px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              Back to List
            </button>
          </div>

          <div className="project-details-grid">
            {/* Left Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="card" style={{ padding: 'var(--space-lg)' }}>
                <div className="flex-between" style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <h3 className="text-display-xs">{activeProject?.name}</h3>
                    <p className="text-body-small text-secondary">{activeProject?.description}</p>
                  </div>
                  <div className="flex-center" style={{ gap: 'var(--space-xs)' }}>
                    <span className={`badge badge-${activeProject?.status === 'completed' ? 'success' : activeProject?.status === 'running' ? 'info' : 'warning'}`}>
                      {activeProject?.status.toUpperCase()}
                    </span>
                    <button className="btn btn-primary btn-sm" onClick={() => showToast('Re-triggering pipeline run...', 'info')}>Run Pipeline</button>
                  </div>
                </div>

                {/* Tabs selection */}
                <div className="tabs-container">
                  <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                  <button className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>Activity Timeline</button>
                  <button className={`tab-btn ${activeTab === 'versions' ? 'active' : ''}`} onClick={() => setActiveTab('versions')}>Version History</button>
                  <button className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>Comments</button>
                </div>

                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)', overflow: 'hidden', padding: 0 }}>
                      <div className="flex-between" style={{ padding: 'var(--space-sm) var(--space-md)', borderBottom: '1px solid var(--border-default)' }}>
                        <span className="text-body-small font-bold text-primary">Reel Simulation Preview</span>
                        <span className="text-detail font-mono text-secondary">24.5 MB &bull; MP4 &bull; 60fps</span>
                      </div>
                      <div className="flex-center" style={{ height: '240px', background: 'linear-gradient(135deg, var(--bg-tertiary), var(--brand-primary-glow))', flexDirection: 'column', position: 'relative' }}>
                        <svg width="48" height="48" fill="var(--brand-primary)" viewBox="0 0 24 24" style={{ marginBottom: '12px', opacity: 0.85 }}><path d="M8 5v14l11-7z"/></svg>
                        <span className="text-body-small font-bold text-primary">{activeProject?.name}</span>
                        <span className="text-detail text-secondary" style={{ marginTop: '4px' }}>Click to view simulated Instagram Reel playback</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-body font-bold text-primary" style={{ marginBottom: 'var(--space-xs)' }}>AI Audience Simulation Metrics</h4>
                      <div className="grid-12" style={{ gap: 'var(--space-sm)' }}>
                        <div className="card col-span-4" style={{ padding: 'var(--space-sm)' }}>
                          <span className="text-detail text-secondary">Scroll Stop Score</span>
                          <p className="text-body-small font-bold font-mono text-primary" style={{ marginTop: '4px' }}>Hook Strength: {activeProject?.confidence || 88}%</p>
                        </div>
                        <div className="card col-span-4" style={{ padding: 'var(--space-sm)' }}>
                          <span className="text-detail text-secondary">Audience Retention</span>
                          <p className="text-body-small font-bold font-mono text-primary" style={{ marginTop: '4px' }}>Replay Rate &bull; {activeProject?.parameters.steps}% High</p>
                        </div>
                        <div className="card col-span-4" style={{ padding: 'var(--space-sm)' }}>
                          <span className="text-detail text-secondary">Viral Potential Engine</span>
                          <p className="text-body-small font-bold font-mono text-primary" style={{ marginTop: '4px' }}>AI Swarm Simulated</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: TIMELINE */}
                {activeTab === 'timeline' && (
                  <div className="timeline" style={{ marginTop: 'var(--space-sm)' }}>
                    <div className="timeline-item">
                      <div className="timeline-dot timeline-dot-success"></div>
                      <div className="timeline-content">
                        <div className="flex-between">
                          <span className="text-body-small font-bold text-primary">Inference run completed</span>
                          <span className="text-detail text-secondary">Today, 10:14 AM</span>
                        </div>
                        <p className="text-detail text-secondary">Aura AI pipeline synthesized {activeProject?.version} with {activeProject?.confidence || 98.2}% confidence.</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot timeline-dot-info"></div>
                      <div className="timeline-content">
                        <div className="flex-between">
                          <span className="text-body-small font-bold text-primary">Pipeline source file uploaded</span>
                          <span className="text-detail text-secondary">Today, 10:12 AM</span>
                        </div>
                        <p className="text-detail text-secondary">User <b>Jaiveer Hastar</b> attached draft source file `raw_asset_record.mov` (124 MB).</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: VERSIONS */}
                {activeTab === 'versions' && (
                  <table className="table" style={{ marginTop: 'var(--space-sm)' }}>
                    <thead>
                      <tr>
                        <th>Version</th>
                        <th>Status</th>
                        <th>Latency</th>
                        <th>Confidence</th>
                        <th>Compiled By</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-bold text-primary">{activeProject?.version} (Active)</td>
                        <td><span className="badge badge-success text-xxs">COMPLETED</span></td>
                        <td className="text-secondary font-mono">14ms</td>
                        <td className="font-mono">{activeProject?.confidence || '98.2'}%</td>
                        <td>Jaiveer Hastar</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-muted">v2.3</td>
                        <td><span className="badge badge-success text-xxs">COMPLETED</span></td>
                        <td className="text-secondary font-mono">16ms</td>
                        <td className="font-mono">97.1%</td>
                        <td>Sarah Jenkins</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {/* TAB 4: COMMENTS */}
                {activeTab === 'comments' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', maxHeight: '240px', overflowY: 'auto' }}>
                      {comments.map((c, i) => (
                        <div key={i} className="flex-start" style={{ gap: 'var(--space-sm)' }}>
                          <div className="avatar avatar-md font-bold" style={{ backgroundColor: c.color }}>{c.avatar}</div>
                          <div className="card" style={{ padding: '10px 14px', backgroundColor: 'var(--bg-secondary)', flex: 1, gap: '2px' }}>
                            <div className="flex-between">
                              <span className="text-body-small font-bold text-primary">{c.sender}</span>
                              <span className="text-detail text-secondary">{c.time}</span>
                            </div>
                            <p className="text-detail text-muted">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex-start" style={{ gap: 'var(--space-sm)', borderTop: '1px solid var(--border-default)', paddingTop: 'var(--space-md)' }}>
                      <div className="avatar avatar-md font-bold" style={{ backgroundColor: 'var(--brand-secondary)', color: 'var(--text-inverse)' }}>JH</div>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <input 
                          type="text" 
                          className="input" 
                          placeholder="Type a comment..." 
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                      </div>
                      <button className="btn btn-primary" onClick={handleAddComment}>Post</button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="card" style={{ padding: 'var(--space-lg)' }}>
                <h4 className="text-body font-bold text-primary" style={{ marginBottom: 'var(--space-md)' }}>Attachments</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {attachments.map((file, i) => (
                    <div key={i} className="file-preview-card">
                      <div className="file-icon">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <span className="text-body-small font-bold text-primary" style={{ wordBreak: 'break-all' }}>{file.name}</span>
                        <span className="text-detail text-secondary">{file.size} &bull; {file.type}</span>
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => showToast('Downloading attachment...', 'info')}>⬇️</button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'var(--space-md)' }}>
                  <label className="upload-dropzone" style={{ cursor: 'pointer' }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style={{ marginBottom: 'var(--space-xs)', color: 'var(--text-secondary)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                    <span className="text-body-small font-bold text-primary">Upload attachments</span>
                    <span className="text-detail text-secondary" style={{ marginTop: '2px' }}>Drag & drop files or click to browse</span>
                    <input type="file" style={{ display: 'none' }} multiple onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW PROJECT MODAL */}
      {modalOpen && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', inset: 0, zIndex: 1100, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-content" style={{ width: '480px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)' }}>
            <div className="modal-header flex-between" style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <h3 className="text-display-xs" style={{ margin: 0 }}>Create New Project</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            
            <form id="new-project-form" name="new-project-form" autoComplete="off" onSubmit={handleCreateProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="label">Project Name</label>
                <input 
                  id="newProjName"
                  name="newProjName"
                  type="text" 
                  className="input" 
                  placeholder="e.g. ad_variant_testing.mp4" 
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="label">Folder / Category</label>
                <CustomSelect
                  value={newProjFolder}
                  onChange={setNewProjFolder}
                  options={[
                    { value: 'Marketing Ads', label: 'Marketing Ads' },
                    { value: 'Core Pipelines', label: 'Core Pipelines' },
                    { value: 'Audio Prompts', label: 'Audio Prompts' },
                    { value: 'Design Assets', label: 'Design Assets' }
                  ]}
                />
              </div>

              <div className="form-group">
                <label className="label">Description</label>
                <textarea 
                  id="newProjDesc"
                  name="newProjDesc"
                  className="textarea" 
                  placeholder="Describe your model goals..." 
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  style={{ minHeight: '80px' }}
                  autoComplete="off"
                />
              </div>

              <div className="flex-end" style={{ gap: 'var(--space-sm)', borderTop: '1px solid var(--border-default)', paddingTop: 'var(--space-sm)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
