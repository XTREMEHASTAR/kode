import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RecommendationSimulationEngine } from '../services/recommendationSimulationEngine';
import { CalibratedPredictionEngine } from '../services/calibratedPredictionEngine';

export const AssetAnalysis: React.FC = () => {
  const { videoId, subPath } = useParams<{ videoId: string; subPath: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentVideo, setSelectedVideoId, showToast, videos } = useApp();
  
  // Tab path tracking
  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[pathParts.length - 1] || 'hooks';

  // Local state helper for interactive features
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(0);
  const [isPlayingReel, setIsPlayingReel] = useState(false);
  const [reelCurrentTimeSec, setReelCurrentTimeSec] = useState(1);
  const [selectedEditType, setSelectedEditType] = useState<'move_cta' | 'reduce_intro' | 'increase_subtitles' | 'replace_thumbnail' | 'reduce_wpm' | 'add_music'>('move_cta');
  const [scriptVariants, setScriptVariants] = useState<string[]>([
    "Stop wasting hours designing templates. KONTAGI node system does it in seconds. ⚡",
    "How I scaled my rendering workflow by 10x using one simple dashboard tweak.",
    "Unboxing the next generation of visual AI pipelines. Check this out! 👀"
  ]);
  const [newHookInput, setNewHookInput] = useState('');
  const [retentionTargetTime, setRetentionTargetTime] = useState<number>(3);
  const [selectedThumbnailOption, setSelectedThumbnailOption] = useState<number>(0);
  const [selectedCaptionTone, setSelectedCaptionTone] = useState<'direct' | 'creative' | 'professional'>('creative');

  // Sync active video selection
  useEffect(() => {
    if (videoId) {
      setSelectedVideoId(videoId);
    }
  }, [videoId, setSelectedVideoId]);

  // Fallback check
  if (!currentVideo) {
    return (
      <div className="card text-center" style={{ padding: 'var(--space-xl)' }}>
        <h3 className="font-bold text-primary">No Active Video Asset Selected</h3>
        <p className="text-secondary" style={{ margin: 'var(--space-md) 0' }}>Please upload or select an existing project asset to review the AI sub-intelligence pipelines.</p>
        <button className="btn btn-primary" onClick={() => navigate('/upload')}>
          Upload or Select Asset
        </button>
      </div>
    );
  }

  // Compute model-based recommendation simulation outputs
  const sim = RecommendationSimulationEngine.simulate(currentVideo);

  // Render specific sub-intelligence screens
  const renderHookIntelligence = () => {
    const defaultHookScore = currentVideo.hook_score ?? currentVideo.score ?? 0;
    const frames = [
      { id: 1, time: '0:01', label: 'Hook Frame', score: defaultHookScore, img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60' },
      { id: 2, time: '0:03', label: 'Brand Intro', score: Math.max(0, defaultHookScore - 4), img: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&auto=format&fit=crop&q=60' },
      { id: 3, time: '0:06', label: 'Demo Showcase', score: Math.max(0, defaultHookScore - 7), img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&auto=format&fit=crop&q=60' },
      { id: 4, time: '0:12', label: 'Key Feature', score: Math.max(0, defaultHookScore - 3), img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=60' },
      { id: 5, time: '0:18', label: 'Call to Action', score: Math.max(0, defaultHookScore - 2), img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=60' }
    ];

    const currentFrame = frames[selectedFrameIdx] || frames[0];

    return (
      <div className="flex-column" style={{ gap: 'var(--space-lg)' }}>
        
        {/* Core Stats Overview */}
        <div className="grid-12" style={{ gap: 'var(--space-md)' }}>
          <div className="col-span-4 card flex-column justify-center align-center text-center" style={{ padding: 'var(--space-lg)' }}>
            <h4 className="text-secondary font-medium">Hook Efficacy Score</h4>
            <div className="text-gradient font-black" style={{ fontSize: '4rem', lineHeight: 1 }}>{currentVideo.hook_score !== undefined && currentVideo.hook_score !== null ? `${currentVideo.hook_score}%` : 'N/A'}</div>
            <span className="badge badge-success" style={{ marginTop: '6px' }}>Outstanding</span>
            <p className="text-detail text-muted" style={{ marginTop: '12px' }}>First 3 seconds retain Gen-Z audiences significantly above industry benchmarks.</p>
          </div>

          <div className="col-span-8 card" style={{ padding: 'var(--space-md)' }}>
            <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-xs)' }}>Hook Recommendation Analysis</h4>
            <p className="text-body-small text-secondary" style={{ lineHeight: 1.5 }}>
              {currentVideo.hook_analysis || 'N/A'}
            </p>
            <div style={{ marginTop: 'var(--space-md)', borderTop: '1px solid var(--border-default)', paddingTop: 'var(--space-sm)' }}>
              <span className="text-detail font-bold text-muted" style={{ display: 'block', marginBottom: '6px' }}>Suggested Adjustments:</span>
              <ul className="text-detail text-secondary flex-column" style={{ gap: '4px', listStyleType: 'disc', paddingLeft: '16px' }}>
                <li>Increase text contrast by adding a solid back shadow or blur backdrop overlay.</li>
                <li>Shorten first word syllable duration to trigger audio alignment within 0.4 seconds.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Filmstrip Timeline Selector */}
        <div className="timeline-container">
          <h4 className="font-bold text-primary">Interactive Keyframe Saliency Mapping</h4>
          <p className="text-detail text-secondary" style={{ marginBottom: '10px' }}>Select any keyframe below to view simulated gaze attention mapping grid.</p>
          
          <div className="timeline-filmstrip">
            {frames.map((frame, idx) => (
              <div 
                key={frame.id}
                className={`frame-card ${idx === selectedFrameIdx ? 'active-frame' : ''}`}
                onClick={() => setSelectedFrameIdx(idx)}
              >
                <span className="frame-badge">{frame.score}%</span>
                <img src={frame.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={frame.label} />
                <span className="frame-label">{frame.time} - {frame.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Frame Heatmap view */}
        <div className="card grid-12" style={{ padding: 'var(--space-md)', gap: 'var(--space-md)' }}>
          <div className="col-span-4 flex-center" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)', minHeight: '320px', backgroundColor: 'black' }}>
            <img src={currentFrame.img} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Active frame preview" />
            
            {/* Attention Heatmap Grid cells overlay simulation */}
            <div className="heatmap-grid">
              {Array.from({ length: 25 }).map((_, cellIdx) => {
                // Focus heat
                const isCentral = [7, 12, 13, 17].includes(cellIdx);
                const bg = isCentral ? 'rgba(239, 68, 68, 0.45)' : [6, 8, 11, 14, 16, 18].includes(cellIdx) ? 'rgba(245, 158, 11, 0.25)' : 'transparent';
                return (
                  <div key={cellIdx} className="heatmap-cell" style={{ backgroundColor: bg }}></div>
                );
              })}
            </div>
          </div>

          <div className="col-span-8 flex-column" style={{ justifySelf: 'stretch', justifyContent: 'center' }}>
            <span className="text-detail font-bold text-muted">FRAME SCOPING</span>
            <h3 className="font-bold text-primary" style={{ margin: 'var(--space-xxs) 0' }}>{currentFrame.label} ({currentFrame.time})</h3>
            <p className="text-body-small text-secondary" style={{ marginBottom: 'var(--space-md)' }}>
              KONTAGI Vision algorithms mapped focus highlights to the central 35% bounding region. Gaze tracking shows 94% probability of visual lock within first 400 milliseconds.
            </p>
            <div className="flex-center" style={{ gap: 'var(--space-sm)' }}>
              <div className="card" style={{ padding: '8px 12px', flex: 1, backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
                <span className="text-micro text-muted font-bold block">GAZE STABILITY</span>
                <span className="text-body font-bold text-primary">High Lock</span>
              </div>
              <div className="card" style={{ padding: '8px 12px', flex: 1, backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
                <span className="text-micro text-muted font-bold block">SCROLL BYPASS RISK</span>
                <span className="text-body font-bold text-primary">Low (6.2%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderRetentionSimulator = () => {
    const rawProfile = currentVideo.retention_profile || [];
    const points = rawProfile.length > 0 ? rawProfile.map(p => ({ sec: p.second, pct: p.score, action: p.action || 'Audience Curve' })) : [];

    if (points.length === 0) {
      return (
        <div className="card text-center" style={{ padding: 'var(--space-xl)' }}>
          <h4 className="font-bold text-primary">No measured data available.</h4>
          <p className="text-secondary" style={{ marginTop: 'var(--space-xs)' }}>Upload a video file to generate genuine retention telemetry curves from PredictionModelSuite.</p>
        </div>
      );
    }

    const currentItem = points.find(p => p.sec === retentionTargetTime) || points[0];

    return (
      <div className="flex-column" style={{ gap: 'var(--space-lg)' }}>
        
        {/* Graph & Stats Card */}
        <div className="card" style={{ padding: 'var(--space-md)' }}>
          <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-md)' }}>Predictive Audience Retention Chart</h4>
          
          {/* Chart graph lines SVG */}
          <div style={{ position: 'relative', height: '220px', width: '100%', marginBottom: '12px' }}>
            <svg viewBox="0 0 1000 200" style={{ width: '100%', height: '100%' }}>
              {/* Grid lines */}
              <line x1="0" y1="50" x2="1000" y2="50" stroke="var(--border-default)" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="1000" y2="100" stroke="var(--border-default)" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="1000" y2="150" stroke="var(--border-default)" strokeDasharray="4 4" />
              
              {/* Line path */}
              <path 
                d="M 0 10 Q 200 25, 400 50 T 800 120 T 1000 150" 
                fill="none" 
                stroke="var(--brand-primary)" 
                strokeWidth="4" 
              />
              
              {/* Highlight Target Dot */}
              <circle cx={retentionTargetTime * 41} cy={10 + retentionTargetTime * 5.8} r="6" fill="var(--accent-purple)" />
            </svg>
            <div className="flex-between text-micro text-secondary" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <span>0s (Start)</span>
              <span>6s</span>
              <span>12s (Mid)</span>
              <span>18s</span>
              <span>24s (End)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {points.map((p) => (
              <button 
                key={p.sec}
                className={`btn btn-sm ${p.sec === retentionTargetTime ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setRetentionTargetTime(p.sec)}
              >
                {p.sec}s ({p.pct}%)
              </button>
            ))}
          </div>
        </div>

        {/* Action Panel Details */}
        <div className="card grid-12" style={{ padding: 'var(--space-md)', gap: 'var(--space-md)' }}>
          <div className="col-span-4 flex-column justify-center text-center">
            <span className="text-detail font-bold text-muted">RETENTION PREDICTION</span>
            <div className="text-gradient font-black" style={{ fontSize: '3rem', margin: '4px 0' }}>{currentItem.pct}%</div>
            <span className="text-detail text-secondary">expected audience retention at second {currentItem.sec}</span>
          </div>

          <div className="col-span-8 flex-column">
            <span className="badge badge-indigo" style={{ alignSelf: 'start', marginBottom: '8px' }}>Action Trigger: {currentItem.action}</span>
            <p className="text-body-small text-secondary" style={{ lineHeight: 1.5 }}>
              KONTAGI simulation flags retention shifts around second {currentItem.sec}. Dynamic video transitions and ambient audio pitch balance keep the viewers from jumping.
            </p>
            <div style={{ marginTop: '12px', display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => showToast('Simulated frame variance optimization', 'success')}>Optimize Segment</button>
              <button className="btn btn-tertiary btn-sm" onClick={() => showToast('Log added to comments', 'info')}>Bookmark Drop Point</button>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderScriptIntelligence = () => {
    const handleAddVariant = () => {
      if (newHookInput.trim()) {
        setScriptVariants(prev => [...prev, newHookInput.trim()]);
        setNewHookInput('');
        showToast('Created new script variant', 'success');
      }
    };

    return (
      <div className="flex-column" style={{ gap: 'var(--space-lg)' }}>
        
        {/* Core Script Text Area */}
        <div className="card" style={{ padding: 'var(--space-md)' }}>
          <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-xs)' }}>Original Scribe Script & Audio Dialog</h4>
          <textarea 
            className="input" 
            style={{ width: '100%', height: '100px', fontSize: '0.875rem', lineHeight: 1.5 }}
            value={currentVideo.transcript || "This is a local client-side transcription fallback. No server is running."}
            readOnly
          />
          <div className="flex-between" style={{ marginTop: '12px' }}>
            <span className="text-detail text-secondary">Language: English (US) &bull; 24 words &bull; Voice: Natural male</span>
            <button className="btn btn-secondary btn-sm" onClick={() => showToast('Audio voice generated', 'success')}>Synthesize Voice</button>
          </div>
        </div>

        {/* Hook Variations Generator */}
        <div className="card" style={{ padding: 'var(--space-md)' }}>
          <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-sm)' }}>Aura AI Script Hook Variants</h4>
          <p className="text-detail text-secondary" style={{ marginBottom: 'var(--space-md)' }}>Generate and test script revisions designed to optimize retention metrics.</p>
          
          <div className="flex-column" style={{ gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            {scriptVariants.map((variant, idx) => (
              <div key={idx} className="card" style={{ padding: '10px 14px', backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--border-default)' }}>
                <div className="flex-between" style={{ marginBottom: '4px' }}>
                  <span className="badge badge-indigo" style={{ fontSize: '0.625rem' }}>Variant #{idx + 1}</span>
                  <span className="text-detail text-link cursor-pointer" onClick={() => showToast(`Selected variant #${idx + 1}`, 'success')}>Apply</span>
                </div>
                <p className="text-body-small text-primary">"{variant}"</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Enter custom prompt hook idea..." 
              value={newHookInput}
              onChange={(e) => setNewHookInput(e.target.value)}
              style={{ flexGrow: 1 }}
            />
            <button className="btn btn-primary" onClick={handleAddVariant}>Add Hook</button>
          </div>
        </div>

      </div>
    );
  };

  const renderThumbnailIntelligence = () => {
    const thumbnails = [
      { id: 1, img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80', score: 94, overlay: 'Insane Speed' },
      { id: 2, img: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=200&auto=format&fit=crop&q=80', score: 88, overlay: 'GenAI Nodes' },
      { id: 3, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format&fit=crop&q=80', score: 79, overlay: 'Workflow Hack' }
    ];

    const currentThumb = thumbnails[selectedThumbnailOption] || thumbnails[0];

    return (
      <div className="flex-column" style={{ gap: 'var(--space-lg)' }}>
        
        {/* Cover selector grid */}
        <div className="card" style={{ padding: 'var(--space-md)' }}>
          <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-sm)' }}>Recommended Covers & Suggested Texts</h4>
          <div className="grid-12" style={{ gap: 'var(--space-md)' }}>
            {thumbnails.map((t, idx) => (
              <div 
                key={t.id}
                className={`col-span-4 card cursor-pointer ${idx === selectedThumbnailOption ? 'selected' : ''}`}
                style={{ padding: '4px', overflow: 'hidden', border: idx === selectedThumbnailOption ? '2px solid var(--brand-primary)' : '1px solid var(--border-default)' }}
                onClick={() => setSelectedThumbnailOption(idx)}
              >
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
                  <img src={t.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Thumb suggestions" />
                  <div style={{ position: 'absolute', bottom: '6px', left: '6px', backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.625rem', padding: '2px 6px', borderRadius: 'var(--radius-xs)', fontWeight: 'bold' }}>
                    {t.overlay}
                  </div>
                </div>
                <div className="flex-between" style={{ padding: '8px var(--space-xxs) var(--space-xxs)' }}>
                  <span className="text-detail font-bold text-primary">CTR Potential</span>
                  <span className="badge badge-success">{t.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Large Frame review */}
        <div className="card grid-12" style={{ padding: 'var(--space-md)', gap: 'var(--space-md)' }}>
          <div className="col-span-5 flex-center" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)', aspectRatio: '16/9', backgroundColor: 'black' }}>
            <img src={currentThumb.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Zoomed view" />
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'var(--brand-primary)', color: 'var(--text-inverse)', fontSize: '0.875rem', fontWeight: 800, padding: '4px 10px', borderRadius: 'var(--radius-sm)' }}>
              {currentThumb.overlay}
            </div>
          </div>

          <div className="col-span-7 flex-column">
            <span className="text-detail font-bold text-muted">COVER EDITOR</span>
            <h3 className="font-bold text-primary" style={{ margin: '4px 0' }}>Overlay text option: "{currentThumb.overlay}"</h3>
            <p className="text-body-small text-secondary" style={{ marginBottom: '12px' }}>
              Yellow typography color generates 14% higher contrast values against blue backdrops. Color values meet recommended specifications.
            </p>
            <div className="flex-center" style={{ gap: 'var(--space-sm)' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => showToast('Cover image exported', 'success')}>Export Frame</button>
              <button className="btn btn-primary btn-sm" onClick={() => showToast('Applying to video project cover', 'success')}>Set Cover</button>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderCaptionMetadata = () => {
    const captionOptions = {
      direct: "Stop wasting hours designing templates. KONTAGI node system does it in seconds! ⚡ #generative #uiux",
      creative: "Unboxing the next generation of visual AI pipelines. Workflow rendering speeds are insane! 🚀 #genai #deepmind",
      professional: "An exploration of neural node template rendering capabilities under standard pipeline workloads. #saas #deepmind"
    };

    return (
      <div className="flex-column" style={{ gap: 'var(--space-lg)' }}>
        
        {/* Caption text generator */}
        <div className="card" style={{ padding: 'var(--space-md)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
            <h4 className="font-bold text-primary">Publisher Caption Variations</h4>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button className={`btn btn-sm ${selectedCaptionTone === 'direct' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedCaptionTone('direct')}>Direct</button>
              <button className={`btn btn-sm ${selectedCaptionTone === 'creative' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedCaptionTone('creative')}>Creative</button>
              <button className={`btn btn-sm ${selectedCaptionTone === 'professional' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedCaptionTone('professional')}>Professional</button>
            </div>
          </div>

          <textarea 
            className="input" 
            style={{ width: '100%', height: '80px', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '12px' }}
            value={captionOptions[selectedCaptionTone]}
            readOnly
          />

          <div className="flex-between">
            <span className="text-detail text-secondary">Aura AI Tone Matching: {selectedCaptionTone.toUpperCase()}</span>
            <button className="btn btn-primary btn-sm" onClick={() => {
              navigator.clipboard.writeText(captionOptions[selectedCaptionTone]);
              showToast('Caption copied to clipboard', 'success');
            }}>Copy Caption</button>
          </div>
        </div>

        {/* Meta data tags */}
        <div className="card" style={{ padding: 'var(--space-md)' }}>
          <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-sm)' }}>Platform Tags Suggestions</h4>
          <div className="flex-center" style={{ gap: '6px', flexWrap: 'wrap' }}>
            {['generative', 'deepmind', 'nodes', 'aicore', 'uiux', 'saas', 'workflow', 'editing'].map(t => (
              <span key={t} className="tag-badge cursor-pointer" onClick={() => showToast(`Added #${t} to active hashtags`, 'success')}>
                #{t}
              </span>
            ))}
          </div>
        </div>

      </div>
    );
  };

  const renderAudioIntelligence = () => {
    return (
      <div className="card grid-12" style={{ padding: 'var(--space-lg)', gap: 'var(--space-lg)' }}>
        <div className="col-span-4 flex-column text-center justify-center align-center">
          <span className="text-detail font-bold text-muted">AUDIO INTELLIGENCE</span>
          <div className="text-gradient font-black" style={{ fontSize: '4.5rem', lineHeight: 1 }}>{currentVideo.audio_score !== undefined && currentVideo.audio_score !== null ? `${currentVideo.audio_score}%` : 'N/A'}</div>
          <span className="badge badge-success" style={{ marginTop: '8px' }}>Clean Signal</span>
        </div>

        <div className="col-span-8 flex-column">
          <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-xs)' }}>Audio Track Diagnostics</h4>
          <p className="text-body-small text-secondary" style={{ lineHeight: 1.5 }}>
            {currentVideo.audio_analysis || 'N/A'}
          </p>
          <div style={{ borderTop: '1px solid var(--border-default)', marginTop: 'var(--space-md)', paddingTop: 'var(--space-sm)' }}>
            <span className="text-detail font-bold text-muted">Diagnostics List:</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
              <div className="text-detail text-secondary">🔊 Peak amplitude: -1.2 dB</div>
              <div className="text-detail text-secondary">🎧 Voice Isolation: 98.4%</div>
              <div className="text-detail text-secondary">🎵 Music harmony check: Sync</div>
              <div className="text-detail text-secondary">🔇 Prohibited buzz sounds: None</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVisualIntelligence = () => {
    return (
      <div className="card grid-12" style={{ padding: 'var(--space-lg)', gap: 'var(--space-lg)' }}>
        <div className="col-span-4 flex-column text-center justify-center align-center">
          <span className="text-detail font-bold text-muted">VISUAL INTELLIGENCE</span>
          <div className="text-gradient font-black" style={{ fontSize: '4.5rem', lineHeight: 1 }}>{currentVideo.visual_score !== undefined && currentVideo.visual_score !== null ? `${currentVideo.visual_score}%` : 'N/A'}</div>
          <span className="badge badge-indigo" style={{ marginTop: '8px' }}>Vibrant Contrast</span>
        </div>

        <div className="col-span-8 flex-column">
          <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-xs)' }}>Visual Dynamics diagnostics</h4>
          <p className="text-body-small text-secondary" style={{ lineHeight: 1.5 }}>
            {currentVideo.visual_analysis || 'N/A'}
          </p>
          <div style={{ borderTop: '1px solid var(--border-default)', marginTop: 'var(--space-md)', paddingTop: 'var(--space-sm)' }}>
            <span className="text-detail font-bold text-muted">Visual Parameters:</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
              <div className="text-detail text-secondary">🎨 Contrast balance: 9.4:1</div>
              <div className="text-detail text-secondary">⚡ Brightness score: 62%</div>
              <div className="text-detail text-secondary">✂️ Average cut pace: 2.1s</div>
              <div className="text-detail text-secondary">🔥 Action Saliency focus: Center</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTargetAudience = () => {
    return (
      <div className="card" style={{ padding: 'var(--space-md)' }}>
        <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-md)' }}>Aura AI Target Audience Affinity</h4>
        <div className="flex-column" style={{ gap: 'var(--space-sm)' }}>
          {[
            { segment: "Gen-Z Tech Creators", score: 94, interest: "generative design, dashboard hacks" },
            { segment: "Millennial Developers", score: 82, interest: "node systems, performance latency" },
            { segment: "Creative Agency Leads", score: 68, interest: "retention rates, campaign scales" }
          ].map(aud => (
            <div key={aud.segment} className="card" style={{ padding: '12px 16px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <div className="flex-between" style={{ marginBottom: '4px' }}>
                <span className="text-body-small font-bold text-primary">{aud.segment}</span>
                <span className="text-body font-bold text-gradient">{aud.score}% Match</span>
              </div>
              <div className="queue-progress-bar" style={{ height: '6px', marginBottom: '6px' }}>
                <div className="queue-progress-fill" style={{ width: `${aud.score}%` }}></div>
              </div>
              <span className="text-detail text-secondary">Key drivers: {aud.interest}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCreativeLab = () => {
    return (
      <div className="card" style={{ padding: 'var(--space-md)' }}>
        <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-sm)' }}>AI Creative Lab Sandbox</h4>
        <p className="text-detail text-secondary" style={{ marginBottom: 'var(--space-md)' }}>Generate creative variations of the current video file asset using generative overlay elements.</p>
        
        <div className="grid-12" style={{ gap: 'var(--space-md)' }}>
          <div className="col-span-6 card flex-column" style={{ padding: '12px' }}>
            <span className="text-detail font-bold text-muted">GENERATIVE VARIANCE</span>
            <h4 className="font-bold text-primary" style={{ margin: '4px 0' }}>Frame Swap Face overlay</h4>
            <p className="text-detail text-secondary" style={{ marginBottom: '12px' }}>Automatically swap the narrator's face frame with synthetic avatar structures.</p>
            <button className="btn btn-secondary btn-sm" onClick={() => showToast('Swap variance triggered', 'info')}>Run Variance Tool</button>
          </div>

          <div className="col-span-6 card flex-column" style={{ padding: '12px' }}>
            <span className="text-detail font-bold text-muted">OVERLAY GENERATOR</span>
            <h4 className="font-bold text-primary" style={{ margin: '4px 0' }}>Overlay Title Card animations</h4>
            <p className="text-detail text-secondary" style={{ marginBottom: '12px' }}>Generate alternative typography overlays based on trend keywords.</p>
            <button className="btn btn-primary btn-sm" onClick={() => showToast('Title overlay generated', 'success')}>Generate Overlays</button>
          </div>
        </div>
      </div>
    );
  };

  const renderReports = () => {
    return (
      <div className="card" style={{ padding: 'var(--space-md)' }}>
        <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-sm)' }}>Compliance & Score Intelligence Reports</h4>
        <p className="text-detail text-secondary" style={{ marginBottom: 'var(--space-md)' }}>Export comprehensive compliance audits and score logs for client presentations.</p>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <button className="btn btn-primary" onClick={() => showToast('PDF Compliance report created', 'success')}>Export PDF Audit</button>
          <button className="btn btn-secondary" onClick={() => showToast('CSV score logs exported', 'success')}>Export CSV Raw Scores</button>
        </div>
      </div>
    );
  };

  const renderPerformanceMemory = () => {
    return (
      <div className="card" style={{ padding: 'var(--space-md)' }}>
        <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-sm)' }}>Historical Performance Memory Matching</h4>
        <p className="text-detail text-secondary" style={{ marginBottom: 'var(--space-md)' }}>Compare active score parameters against historical campaign data stored in AuraDB.</p>
        
        <div className="flex-column" style={{ gap: '8px' }}>
          {[
            { title: "Campaign Alpha v2", date: "June 2026", score: 89, match: "91% structural parity" },
            { title: "Brand Promo Final", date: "May 2026", score: 82, match: "84% visual parity" }
          ].map(m => (
            <div key={m.title} className="flex-between" style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-default)' }}>
              <div>
                <span className="text-body-small font-bold text-primary block">{m.title}</span>
                <span className="text-micro text-secondary">{m.date} &bull; Parity: {m.match}</span>
              </div>
              <span className="badge badge-indigo">Score {m.score}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 1. Upload Summary Panel (Section 1)
  const renderUploadSummaryPanel = () => {
    return (
      <div className="card" style={{ padding: 'var(--space-lg)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
          <div>
            <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>SECTION 1 — REEL UPLOAD SUMMARY & NICHE FIT</span>
            <h3 className="font-bold text-primary" style={{ margin: '4px 0' }}>Reel Content Synthesis & Metadata Diagnostics</h3>
          </div>
          <span className="badge badge-indigo" style={{ fontSize: '12px' }}>AuraCore V2 Digital Twin</span>
        </div>

        <div className="grid-12" style={{ gap: 'var(--space-md)' }}>
          <div className="col-span-3 flex-center" style={{ aspectRatio: '9/16', maxHeight: '200px', overflow: 'hidden', borderRadius: 'var(--radius-md)', backgroundColor: '#000' }}>
            <img src={sim.uploadSummary.thumbnailUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Reel Cover" />
          </div>

          <div className="col-span-9 grid-12" style={{ gap: '12px' }}>
            <div className="col-span-4 card" style={{ padding: '10px 14px', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">DURATION</span>
              <span className="text-body font-bold text-primary">{sim.uploadSummary.durationSec}s Reel</span>
            </div>

            <div className="col-span-4 card" style={{ padding: '10px 14px', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">DETECTED NICHE</span>
              <span className="text-body font-bold text-primary">{sim.uploadSummary.detectedNiche}</span>
            </div>

            <div className="col-span-4 card" style={{ padding: '10px 14px', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">PRIMARY EMOTION</span>
              <span className="text-body font-bold text-warning">{sim.uploadSummary.primaryEmotion}</span>
            </div>

            <div className="col-span-4 card" style={{ padding: '10px 14px', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">SPEAKING SPEED</span>
              <span className="text-body font-bold text-primary">{sim.uploadSummary.speakingSpeedWpm} WPM</span>
            </div>

            <div className="col-span-4 card" style={{ padding: '10px 14px', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">CAPTION QUALITY</span>
              <span className="text-body font-bold text-success">{sim.uploadSummary.captionQualityScore}%</span>
            </div>

            <div className="col-span-4 card" style={{ padding: '10px 14px', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">AUDIENCE FIT SCORE</span>
              <span className="text-body font-bold text-success">{sim.uploadSummary.audienceFitScore}% Match</span>
            </div>

            <div className="col-span-12 card" style={{ padding: '10px 14px', backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <span className="text-micro text-muted font-bold block">RECOMMENDED POSTING TIME WINDOW</span>
              <span className="text-body-small font-bold text-primary">⏰ {sim.uploadSummary.postingTimeRecommendation}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 1. Calibrated Benchmark Prediction Panel
  const renderViralPredictionPanel = () => {
    const calibrated = CalibratedPredictionEngine.predict(currentVideo);

    return (
      <div className="flex-column" style={{ gap: 'var(--space-md)' }}>
        {/* Section Header */}
        <div className="card" style={{ padding: 'var(--space-lg)', backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
            <div>
              <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>SECTION 1 — BENCHMARK-CALIBRATED PREDICTION ENGINE</span>
              <h3 className="font-bold text-primary" style={{ margin: '4px 0' }}>Multimodal Benchmark Calibration & Reach Forecast</h3>
              <p className="text-body-small text-secondary">{calibrated.explainabilityNote}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-success" style={{ fontSize: '13px', padding: '6px 12px' }}>Prediction Confidence: {calibrated.predictionConfidencePct}%</span>
              <span className="text-micro text-secondary block" style={{ marginTop: '4px' }}>Trained on 100 Historical Reels</span>
            </div>
          </div>

          {/* 4 Core Separated Pipeline Indicators */}
          <div className="grid-12" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <div className="col-span-3 card" style={{ padding: '14px', backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <span className="text-micro text-muted font-bold block">CONTENT QUALITY</span>
              <div className="text-gradient font-black" style={{ fontSize: '2.2rem', margin: '4px 0' }}>
                {calibrated.contentQualityScore}<span style={{ fontSize: '1.2rem' }}>/100</span>
              </div>
              <span className="text-detail text-secondary block">Multimodal Feature Vector</span>
            </div>

            <div className="col-span-3 card" style={{ padding: '14px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
              <span className="text-micro text-muted font-bold block">RECOMMENDATION READINESS</span>
              <div className="font-black text-warning" style={{ fontSize: '2.2rem', margin: '4px 0' }}>
                {calibrated.recommendationReadinessScore}<span style={{ fontSize: '1.2rem' }}>/100</span>
              </div>
              <span className="text-detail text-secondary block">Algorithmic Push Readiness</span>
            </div>

            <div className="col-span-3 card" style={{ padding: '14px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <span className="text-micro text-muted font-bold block">AUDIENCE MATCH</span>
              <div className="font-black text-success" style={{ fontSize: '2.2rem', margin: '4px 0' }}>
                {calibrated.audienceMatchScore}<span style={{ fontSize: '1.2rem' }}>/100</span>
              </div>
              <span className="text-detail text-secondary block">Cohort Affinity Index</span>
            </div>

            <div className="col-span-3 card" style={{ padding: '14px', backgroundColor: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
              <span className="text-micro text-muted font-bold block">ESTIMATED REACH RANGE</span>
              <div className="font-black text-primary" style={{ fontSize: '1.6rem', margin: '6px 0' }}>
                {calibrated.estimatedReachMin} – {calibrated.estimatedReachMax}
              </div>
              <span className="text-detail text-secondary block">Assuming Avg Early Engagement</span>
            </div>
          </div>

          {/* Expected Distribution Tier Banner */}
          <div className="card flex-between" style={{ padding: '12px 16px', backgroundColor: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.25)' }}>
            <div>
              <span className="text-micro font-bold text-muted block">EXPECTED DISTRIBUTION TIER</span>
              <span className="text-body font-bold text-primary">{calibrated.expectedDistributionTier}</span>
            </div>
            <span className="badge badge-indigo">Benchmark Calibrated</span>
          </div>

          {/* Expected Engagement Metrics Grid */}
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <h5 className="font-bold text-primary" style={{ marginBottom: '12px' }}>Expected Organic Engagement Volume</h5>
            <div className="grid-12" style={{ gap: '12px' }}>
              <div className="col-span-2 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
                <span className="text-micro text-muted font-bold block">LIKES</span>
                <span className="text-body font-bold text-primary">{sim.expectedMetrics.likes.toLocaleString()}</span>
              </div>
              <div className="col-span-2 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
                <span className="text-micro text-muted font-bold block">COMMENTS</span>
                <span className="text-body font-bold text-primary">{sim.expectedMetrics.comments.toLocaleString()}</span>
              </div>
              <div className="col-span-2 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
                <span className="text-micro text-muted font-bold block">SHARES</span>
                <span className="text-body font-bold text-primary">{sim.expectedMetrics.shares.toLocaleString()}</span>
              </div>
              <div className="col-span-2 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
                <span className="text-micro text-muted font-bold block">SAVES</span>
                <span className="text-body font-bold text-primary">{sim.expectedMetrics.saves.toLocaleString()}</span>
              </div>
              <div className="col-span-2 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
                <span className="text-micro text-muted font-bold block">NEW FOLLOWERS</span>
                <span className="text-body font-bold text-primary">+{sim.expectedMetrics.followers.toLocaleString()}</span>
              </div>
              <div className="col-span-2 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
                <span className="text-micro text-muted font-bold block">AVG WATCH TIME</span>
                <span className="text-body font-bold text-primary">{sim.expectedMetrics.watchTimeSec}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 2. AI Distribution Simulation Panel
  const renderDistributionWavesPanel = () => {
    return (
      <div className="card" style={{ padding: 'var(--space-lg)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-sm)' }}>
          <div>
            <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>2. AI DISTRIBUTION SIMULATION</span>
            <h4 className="font-bold text-primary" style={{ margin: '4px 0' }}>Algorithmic Recommendation Waves</h4>
          </div>
          <span className="badge badge-warning">Model Simulation</span>
        </div>

        <div className="alert alert-info" style={{ marginBottom: 'var(--space-md)', padding: '8px 14px', fontSize: '12px' }}>
          <strong>ℹ️ Important Note:</strong> These are <em>simulated recommendation waves</em> based on AuraCore prediction models trained on 100K+ Reels, not live Instagram server metrics.
        </div>

        <div className="flex-column" style={{ gap: '12px' }}>
          {sim.distributionWaves.map(wave => {
            const isBoostOrExpand = wave.decision === 'Boost' || wave.decision === 'Expand';
            return (
              <div 
                key={wave.waveNumber} 
                className="card"
                style={{
                  padding: '16px',
                  backgroundColor: isBoostOrExpand ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                  border: isBoostOrExpand ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <div className="flex-between" style={{ marginBottom: '10px' }}>
                  <div className="flex-center" style={{ gap: '10px' }}>
                    <span className="badge badge-indigo">Wave {wave.waveNumber}</span>
                    <span className="font-bold text-primary" style={{ fontSize: '15px' }}>{wave.waveName}</span>
                    <span className="text-detail text-secondary">({wave.cohortSize.toLocaleString()} AI Viewers)</span>
                  </div>
                  <div className="flex-center" style={{ gap: '8px' }}>
                    <span className="text-micro text-secondary">Score: {wave.distributionScore}/100</span>
                    <span className={`badge badge-${isBoostOrExpand ? 'success' : 'danger'}`} style={{ fontWeight: 800 }}>
                      DECISION: {wave.decision.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid-12" style={{ gap: '8px', marginBottom: '8px' }}>
                  <div className="col-span-2 text-detail"><span className="text-muted block">RETENTION</span> <strong className="text-primary">{wave.retention}%</strong></div>
                  <div className="col-span-2 text-detail"><span className="text-muted block">SHARE RATE</span> <strong className="text-primary">{wave.shareRate}%</strong></div>
                  <div className="col-span-2 text-detail"><span className="text-muted block">REPLAY RATE</span> <strong className="text-primary">{wave.replayRate}%</strong></div>
                  <div className="col-span-2 text-detail"><span className="text-muted block">SKIP RATE</span> <strong className="text-danger">{wave.skipRate}%</strong></div>
                  <div className="col-span-2 text-detail"><span className="text-muted block">NEGATIVE FEEDBACK</span> <strong className="text-warning">{wave.negativeFeedback}%</strong></div>
                  <div className="col-span-2 text-detail"><span className="text-muted block">CONFIDENCE</span> <strong className="text-success">{wave.algorithmConfidence}%</strong></div>
                </div>

                <span className="text-micro text-secondary" style={{ fontStyle: 'italic' }}>Algorithm Decision Reasoning: {wave.reason}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 3. Audience Personas & 4. Viewer Journey
  const renderPersonasAndFunnelPanel = () => {
    return (
      <div className="grid-12" style={{ gap: 'var(--space-md)' }}>
        {/* Audience Personas Column */}
        <div className="col-span-6 card" style={{ padding: 'var(--space-md)' }}>
          <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>3. AUDIENCE PERSONAS</span>
          <h4 className="font-bold text-primary" style={{ margin: '4px 0 12px 0' }}>Predicted Viewer Segments</h4>

          <div className="flex-column" style={{ gap: '12px' }}>
            {sim.audiencePersonas.map(persona => (
              <div key={persona.name} className="card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
                <div className="flex-between" style={{ marginBottom: '4px' }}>
                  <span className="text-body-small font-bold text-primary">{persona.name}</span>
                  <span className="text-detail font-bold text-warning">Est. Reach: {persona.estimatedReach}</span>
                </div>
                <div className="grid-12 text-detail" style={{ gap: '4px', margin: '6px 0' }}>
                  <div className="col-span-6"><span className="text-muted">Retention:</span> <strong className="text-success">{persona.retention}%</strong></div>
                  <div className="col-span-6"><span className="text-muted">Skip Rate:</span> <strong className="text-danger">{persona.skipRate}%</strong></div>
                  <div className="col-span-6"><span className="text-muted">Share Prob:</span> <strong className="text-primary">{persona.shareProb}%</strong></div>
                  <div className="col-span-6"><span className="text-muted">Sentiment:</span> <strong className="text-primary">{persona.commentSentiment}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Viewer Journey Funnel Column */}
        <div className="col-span-6 card" style={{ padding: 'var(--space-md)' }}>
          <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>4. VIEWER JOURNEY FUNNEL</span>
          <h4 className="font-bold text-primary" style={{ margin: '4px 0 12px 0' }}>100 Simulated Viewers Conversion</h4>

          <div className="flex-column" style={{ gap: '8px' }}>
            {sim.viewerFunnel.map((step, idx) => (
              <div key={step.label} className="flex-between" style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px' }}>
                <div className="flex-center" style={{ gap: '8px' }}>
                  <span className="badge badge-indigo" style={{ fontSize: '10px' }}>#{idx + 1}</span>
                  <span className="text-detail font-bold text-primary">{step.label}</span>
                </div>
                <div className="flex-center" style={{ gap: '12px' }}>
                  <span className="text-detail text-secondary">{step.count} viewers</span>
                  <span className="badge badge-success" style={{ width: '48px', textAlign: 'center' }}>{step.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 5. Frame-by-Frame Timeline Panel
  const renderFrameTimelinePanel = () => {
    const activePoint = sim.secondTimeline.find(pt => pt.second === selectedFrameIdx + 1) || sim.secondTimeline[0];

    return (
      <div className="card" style={{ padding: 'var(--space-lg)' }}>
        <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>5. FRAME-BY-FRAME TIMELINE</span>
        <h4 className="font-bold text-primary" style={{ margin: '4px 0 12px 0' }}>Second-by-Second Creative Diagnostics</h4>

        {/* Timeline Bar Selector */}
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '16px' }}>
          {sim.secondTimeline.map(pt => (
            <button
              key={pt.second}
              className={`btn btn-sm ${selectedFrameIdx === pt.second - 1 ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                flexShrink: 0,
                minWidth: '42px',
                borderColor: pt.isDropoff ? '#EF4444' : pt.isPositive ? '#10B981' : 'transparent',
                borderWidth: pt.isDropoff || pt.isPositive ? '2px' : '1px'
              }}
              onClick={() => setSelectedFrameIdx(pt.second - 1)}
            >
              {pt.second}s
            </button>
          ))}
        </div>

        {/* Selected Second Detail Panel */}
        <div className="card grid-12" style={{ padding: '16px', gap: '16px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
          <div className="col-span-4 flex-column justify-center align-center text-center">
            <span className="text-detail font-bold text-muted">TIMESTAMP</span>
            <div className="text-gradient font-black" style={{ fontSize: '2.5rem', margin: '4px 0' }}>00:{activePoint.second < 10 ? '0' + activePoint.second : activePoint.second}</div>
            <span className={`badge badge-${activePoint.isDropoff ? 'danger' : activePoint.isPositive ? 'success' : 'indigo'}`}>
              {activePoint.emotion}
            </span>
          </div>

          <div className="col-span-8 flex-column justify-center">
            <h4 className="font-bold text-primary" style={{ marginBottom: '6px' }}>AI Frame Reasoning & Explanation</h4>
            <p className="text-body-small text-secondary" style={{ lineHeight: 1.5, marginBottom: '12px' }}>
              {activePoint.explanation}
            </p>

            <div className="grid-12" style={{ gap: '8px' }}>
              <div className="col-span-4 text-detail"><span className="text-muted block">ATTENTION</span> <strong className="text-primary">{activePoint.attention}%</strong></div>
              <div className="col-span-4 text-detail"><span className="text-muted block">VISUAL COMPLEXITY</span> <strong className="text-primary">{activePoint.visualComplexity}%</strong></div>
              <div className="col-span-4 text-detail"><span className="text-muted block">SPEECH CLARITY</span> <strong className="text-primary">{activePoint.speechClarity}%</strong></div>
              <div className="col-span-4 text-detail"><span className="text-muted block">SUBTITLE DENSITY</span> <strong className="text-primary">{activePoint.ocrDensity}%</strong></div>
              <div className="col-span-4 text-detail"><span className="text-muted block">READING LOAD</span> <strong className="text-primary">{activePoint.readingLoad}%</strong></div>
              <div className="col-span-4 text-detail"><span className="text-muted block">CTA STRENGTH</span> <strong className="text-primary">{activePoint.ctaStrength}%</strong></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 6. Instagram Algorithm Intelligence & 7. Weak Moments & 8. Improvement Simulator & 9. Synthetic Comments
  const renderAlgorithmAndImprovementsPanel = () => {
    return (
      <div className="flex-column" style={{ gap: 'var(--space-md)' }}>
        {/* Algorithm Scores Grid */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>6. INSTAGRAM ALGORITHM INTELLIGENCE</span>
          <h4 className="font-bold text-primary" style={{ margin: '4px 0 12px 0' }}>Algorithmic Vector Probabilities</h4>

          <div className="grid-12" style={{ gap: '12px' }}>
            <div className="col-span-3 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">SCROLL STOP SCORE</span>
              <span className="text-body font-bold text-warning">{sim.algorithmScores.scrollStopScore}%</span>
            </div>
            <div className="col-span-3 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">HOOK SCORE</span>
              <span className="text-body font-bold text-success">{sim.algorithmScores.hookScore}%</span>
            </div>
            <div className="col-span-3 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">RECOMMENDATION SCORE</span>
              <span className="text-body font-bold text-primary">{sim.algorithmScores.recommendationScore}%</span>
            </div>
            <div className="col-span-3 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">REPLAY PROBABILITY</span>
              <span className="text-body font-bold text-primary">{sim.algorithmScores.replayProb}%</span>
            </div>
            <div className="col-span-3 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">SHARE PROBABILITY</span>
              <span className="text-body font-bold text-primary">{sim.algorithmScores.shareProb}%</span>
            </div>
            <div className="col-span-3 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">SAVE PROBABILITY</span>
              <span className="text-body font-bold text-primary">{sim.algorithmScores.saveProb}%</span>
            </div>
            <div className="col-span-3 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">COMMENT PROBABILITY</span>
              <span className="text-body font-bold text-primary">{sim.algorithmScores.commentProb}%</span>
            </div>
            <div className="col-span-3 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">FOLLOW PROBABILITY</span>
              <span className="text-body font-bold text-primary">{sim.algorithmScores.followProb}%</span>
            </div>
            <div className="col-span-4 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">SESSION CONTRIBUTION</span>
              <span className="text-body font-bold text-success">{sim.algorithmScores.sessionContribution}%</span>
            </div>
            <div className="col-span-4 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">FEED QUALITY SCORE</span>
              <span className="text-body font-bold text-primary">{sim.algorithmScores.feedQualityScore}%</span>
            </div>
            <div className="col-span-4 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">DISTRIBUTION CONFIDENCE</span>
              <span className="text-body font-bold text-success">{sim.algorithmScores.distributionConfidence}%</span>
            </div>
          </div>
        </div>

        {/* Grid: 7. Weak Moments & 8. Improvement Simulator */}
        <div className="grid-12" style={{ gap: 'var(--space-md)' }}>
          {/* Weak Moments Column */}
          <div className="col-span-6 card" style={{ padding: 'var(--space-md)' }}>
            <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>7. WEAK MOMENTS & REACH LOSS</span>
            <h4 className="font-bold text-primary" style={{ margin: '4px 0 12px 0' }}>Ranked Performance Penalties</h4>

            <div className="flex-column" style={{ gap: '8px' }}>
              {sim.weakMoments.map(w => (
                <div key={w.timestamp} className="flex-between" style={{ padding: '10px 12px', backgroundColor: 'rgba(239, 68, 68, 0.08)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div>
                    <span className="badge badge-danger" style={{ marginRight: '6px' }}>{w.timestamp}</span>
                    <span className="text-detail font-bold text-primary">{w.issue}</span>
                  </div>
                  <span className="text-detail font-bold text-danger">Reach Loss: -{w.reachLossPct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Simulator Column */}
          <div className="col-span-6 card" style={{ padding: 'var(--space-md)' }}>
            <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>8. IMPROVEMENT SIMULATOR</span>
            <h4 className="font-bold text-primary" style={{ margin: '4px 0 12px 0' }}>Predicted Performance Gains</h4>

            <div className="flex-column" style={{ gap: '8px' }}>
              {sim.improvements.map((imp, idx) => (
                <div key={idx} className="flex-between" style={{ padding: '10px 12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div>
                    <span className="text-detail font-bold text-primary block">{imp.action}</span>
                    <span className="text-micro text-secondary">Target Metric: {imp.impactMetric}</span>
                  </div>
                  <span className="badge badge-success" style={{ fontWeight: 800 }}>+{imp.predictedGainPct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 9. Synthetic Comments */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <div>
              <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>9. AI GENERATED VIEWER COMMENTS</span>
              <h4 className="font-bold text-primary" style={{ margin: '4px 0' }}>Simulated Audience Feed Reactions</h4>
            </div>
            <span className="badge badge-warning">Synthetic Comments</span>
          </div>

          <div className="alert alert-info" style={{ marginBottom: '12px', padding: '6px 12px', fontSize: '11px' }}>
            Clearly Labeled: <em>Synthetic comments generated from audience simulation algorithms.</em>
          </div>

          <div className="grid-12" style={{ gap: '12px' }}>
            {sim.syntheticComments.map((comment, idx) => (
              <div key={idx} className="col-span-6 card flex-column" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
                <div className="flex-between" style={{ marginBottom: '6px' }}>
                  <div className="flex-center" style={{ gap: '8px' }}>
                    <img src={comment.avatar} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} alt="Avatar" />
                    <div>
                      <span className="text-detail font-bold text-primary block">{comment.username}</span>
                      <span className="text-micro text-muted">{comment.archetype} &bull; {comment.timeAgo}</span>
                    </div>
                  </div>
                  <span className="text-micro text-secondary">❤️ {comment.likes}</span>
                </div>
                <p className="text-body-small text-primary" style={{ fontStyle: 'italic', margin: '4px 0 0 0' }}>"{comment.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 11. Version Comparison Panel (Section 11)
  const renderVersionComparisonPanel = () => {
    return (
      <div className="card" style={{ padding: 'var(--space-lg)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
          <div>
            <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>SECTION 11 — VERSION COMPARISON (A vs B)</span>
            <h4 className="font-bold text-primary" style={{ margin: '4px 0' }}>Draft Version A vs AuraCore Optimized Version B</h4>
          </div>
          <span className="badge badge-success font-bold" style={{ padding: '6px 12px' }}>WINNER: VERSION B (+28% Reach)</span>
        </div>

        <div className="grid-12" style={{ gap: '12px' }}>
          <div className="col-span-3 card" style={{ padding: '14px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <span className="text-micro text-muted font-bold block">PROJECTED REACH GAIN</span>
            <span className="text-body font-bold text-success block" style={{ fontSize: '1.4rem', margin: '4px 0' }}>{sim.versionComparison.reachDiff}</span>
            <span className="text-detail text-secondary block">Based on wave expansion confidence</span>
          </div>

          <div className="col-span-3 card" style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
            <span className="text-micro text-muted font-bold block">3s RETENTION GAIN</span>
            <span className="text-body font-bold text-primary block" style={{ fontSize: '1.4rem', margin: '4px 0' }}>{sim.versionComparison.retentionDiff}</span>
            <span className="text-detail text-secondary block">Hook contrast adjustment</span>
          </div>

          <div className="col-span-3 card" style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
            <span className="text-micro text-muted font-bold block">REPLAY RATE BOOST</span>
            <span className="text-body font-bold text-primary block" style={{ fontSize: '1.4rem', margin: '4px 0' }}>{sim.versionComparison.replayDiff}</span>
            <span className="text-detail text-secondary block">Seamless loop transition</span>
          </div>

          <div className="col-span-3 card" style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
            <span className="text-micro text-muted font-bold block">SHARE VELOCITY BOOST</span>
            <span className="text-body font-bold text-primary block" style={{ fontSize: '1.4rem', margin: '4px 0' }}>{sim.versionComparison.shareDiff}</span>
            <span className="text-detail text-secondary block">Early CTA placement</span>
          </div>
        </div>
      </div>
    );
  };

  // 4. Live Reel Player Sync Panel (V3 Section 4)
  const renderLiveReelPlayerPanel = () => {
    const activePoint = sim.secondTimeline.find(pt => pt.second === reelCurrentTimeSec) || sim.secondTimeline[0];
    const totalSecs = sim.uploadSummary.durationSec || 24;

    return (
      <div className="card" style={{ padding: 'var(--space-lg)', backgroundColor: '#0B132B', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
          <div>
            <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>SECTION 4 — LIVE REEL PLAYER SYNC</span>
            <h4 className="font-bold text-primary" style={{ margin: '4px 0' }}>Real-Time Multimodal Telemetry Synchronization</h4>
          </div>
          <div className="flex-center" style={{ gap: '8px' }}>
            <button
              className={`btn btn-sm ${isPlayingReel ? 'btn-danger' : 'btn-primary'}`}
              onClick={() => setIsPlayingReel(!isPlayingReel)}
            >
              {isPlayingReel ? '⏸ Pause Simulation' : '▶ Play Synchronized Reel'}
            </button>
            <span className="badge badge-indigo">00:{reelCurrentTimeSec < 10 ? '0' + reelCurrentTimeSec : reelCurrentTimeSec} / 00:{totalSecs < 10 ? '0' + totalSecs : totalSecs}</span>
          </div>
        </div>

        <div className="grid-12" style={{ gap: 'var(--space-md)' }}>
          {/* Mock Synchronized Reel Video Viewport */}
          <div className="col-span-4 flex-column align-center justify-center" style={{ position: 'relative', aspectRatio: '9/16', maxHeight: '340px', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255, 255, 255, 0.1)' }}>
            <img src={currentVideo.poster_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80'} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isPlayingReel ? 0.9 : 0.7 }} alt="Live Reel Video" />
            <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#10B981' }}>
              ● LIVE SIMULATION AUDIENCE: {Math.round(100 * (activePoint.attention / 100))}
            </div>
            <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, padding: '8px', backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', borderRadius: '8px', fontSize: '11px' }}>
              <span className="text-muted block">OCR Text Overlay:</span>
              <span className="text-primary font-bold">{activePoint.evidence.ocrText || 'AI Subtitle Auto-Detected'}</span>
            </div>
          </div>

          {/* Real-time updating telemetry metrics */}
          <div className="col-span-8 grid-12" style={{ gap: '10px' }}>
            <div className="col-span-4 card" style={{ padding: '10px 12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">ATTENTION LOCK</span>
              <span className="text-body font-bold text-success">{activePoint.attention}%</span>
            </div>
            <div className="col-span-4 card" style={{ padding: '10px 12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">SCROLL STOP VELOCITY</span>
              <span className="text-body font-bold text-warning">{activePoint.scrollStopScore}%</span>
            </div>
            <div className="col-span-4 card" style={{ padding: '10px 12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">REPLAY PROBABILITY</span>
              <span className="text-body font-bold text-primary">{activePoint.replayProb}%</span>
            </div>
            <div className="col-span-4 card" style={{ padding: '10px 12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">VISUAL COMPLEXITY</span>
              <span className="text-body font-bold text-primary">{activePoint.visualComplexity}%</span>
            </div>
            <div className="col-span-4 card" style={{ padding: '10px 12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">SPEECH CLARITY</span>
              <span className="text-body font-bold text-primary">{activePoint.speechClarity}%</span>
            </div>
            <div className="col-span-4 card" style={{ padding: '10px 12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">SUBTITLE DENSITY</span>
              <span className="text-body font-bold text-primary">{activePoint.ocrDensity}%</span>
            </div>
            <div className="col-span-6 card" style={{ padding: '10px 12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">EMOTIONAL SPECTRUM</span>
              <span className="text-body font-bold text-warning">{activePoint.emotion}</span>
            </div>
            <div className="col-span-6 card" style={{ padding: '10px 12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">BENCHMARK EQUIVALENCE</span>
              <span className="text-body-small font-bold text-primary">{activePoint.evidence.benchmarkComparison}</span>
            </div>

            {/* Timeline scrubber slider */}
            <div className="col-span-12 flex-column" style={{ marginTop: '8px' }}>
              <div className="flex-between" style={{ marginBottom: '4px' }}>
                <span className="text-micro text-muted font-bold">TIMELINE SCRUBBER</span>
                <span className="text-micro text-secondary">Second {reelCurrentTimeSec} of {totalSecs}</span>
              </div>
              <input
                type="range"
                min="1"
                max={Math.min(totalSecs, sim.secondTimeline.length)}
                value={reelCurrentTimeSec}
                onChange={(e) => setReelCurrentTimeSec(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#38BDF8', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 6. Algorithm Thinking Decision Graph Panel (V3 Section 6)
  const renderAlgorithmThinkingPanel = () => {
    return (
      <div className="card" style={{ padding: 'var(--space-lg)' }}>
        <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>SECTION 6 — ALGORITHM THINKING & REASONING GRAPH</span>
        <h4 className="font-bold text-primary" style={{ margin: '4px 0 16px 0' }}>Sequential Recommendation Reasoning Logic</h4>

        <div className="flex-center" style={{ gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          <div className="card text-center" style={{ padding: '12px 16px', minWidth: '130px', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <span className="text-micro text-muted font-bold block">STAGE 1</span>
            <span className="text-body-small font-bold text-primary">Strong Hook</span>
            <span className="badge badge-success" style={{ marginTop: '4px' }}>{sim.algorithmScores.hookScore}%</span>
          </div>

          <span className="text-muted font-bold">→</span>

          <div className="card text-center" style={{ padding: '12px 16px', minWidth: '130px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <span className="text-micro text-muted font-bold block">STAGE 2</span>
            <span className="text-body-small font-bold text-primary">Retention Curve</span>
            <span className="badge badge-warning" style={{ marginTop: '4px' }}>{sim.expectedMetrics.completionRatePct}%</span>
          </div>

          <span className="text-muted font-bold">→</span>

          <div className="card text-center" style={{ padding: '12px 16px', minWidth: '130px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <span className="text-micro text-muted font-bold block">STAGE 3</span>
            <span className="text-body-small font-bold text-primary">Replay Signal</span>
            <span className="badge badge-success" style={{ marginTop: '4px' }}>{sim.algorithmScores.replayProb}%</span>
          </div>

          <span className="text-muted font-bold">→</span>

          <div className="card text-center" style={{ padding: '12px 16px', minWidth: '130px', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <span className="text-micro text-muted font-bold block">STAGE 4</span>
            <span className="text-body-small font-bold text-primary">Share Velocity</span>
            <span className="badge badge-indigo" style={{ marginTop: '4px' }}>{sim.algorithmScores.shareProb}%</span>
          </div>

          <span className="text-muted font-bold">→</span>

          <div className="card text-center" style={{ padding: '12px 16px', minWidth: '130px', backgroundColor: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
            <span className="text-micro text-muted font-bold block">FINAL DECISION</span>
            <span className="text-body-small font-bold text-gradient">Boost Wave 4</span>
            <span className="badge badge-success" style={{ marginTop: '4px' }}>{sim.confidencePct}% Conf</span>
          </div>
        </div>
      </div>
    );
  };

  // 7. Edit Impact Simulator (V3 Section 7)
  const renderEditImpactSimulatorPanel = () => {
    const editSimulation = RecommendationSimulationEngine.simulateEditImpact(currentVideo, selectedEditType);

    return (
      <div className="card" style={{ padding: 'var(--space-lg)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
          <div>
            <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>SECTION 7 — EDIT IMPACT SIMULATOR</span>
            <h4 className="font-bold text-primary" style={{ margin: '4px 0' }}>Simulate Creative Adjustments Before Re-Exporting</h4>
          </div>
          <span className="badge badge-warning">Interactive Recalculation Engine</span>
        </div>

        <div className="grid-12" style={{ gap: 'var(--space-md)' }}>
          <div className="col-span-4 flex-column" style={{ gap: '8px' }}>
            <span className="text-detail font-bold text-muted">SELECT CREATIVE EDIT TO SIMULATE:</span>
            {[
              { id: 'move_cta', label: '⚡ Move CTA 3 Seconds Earlier' },
              { id: 'reduce_intro', label: '✂️ Trim 1.5s Silent Intro' },
              { id: 'increase_subtitles', label: '🔤 Increase Subtitle Font & Contrast' },
              { id: 'replace_thumbnail', label: '🖼️ Replace Cover Thumbnail' },
              { id: 'reduce_wpm', label: '🎙️ Reduce Speech Pacing to 165 WPM' },
              { id: 'add_music', label: '🎵 Add High-Energy Trending BGM' }
            ].map(edit => (
              <button
                key={edit.id}
                className={`btn btn-sm ${selectedEditType === edit.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                onClick={() => setSelectedEditType(edit.id as any)}
              >
                {edit.label}
              </button>
            ))}
          </div>

          <div className="col-span-8 card grid-12" style={{ padding: '16px', gap: '12px', backgroundColor: 'var(--bg-primary)' }}>
            <div className="col-span-12 flex-between" style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>
              <span className="font-bold text-primary">Predicted Post-Edit Performance Delta</span>
              <span className="badge badge-success">Confidence: {editSimulation.recommendationConfidencePct}%</span>
            </div>

            <div className="col-span-6 card" style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <span className="text-micro text-muted font-bold block">EDITED ORGANIC REACH</span>
              <div className="text-gradient font-black" style={{ fontSize: '1.8rem', margin: '4px 0' }}>
                {editSimulation.editedMinReach} – {editSimulation.editedMaxReach}
              </div>
              <span className="badge badge-success">+{editSimulation.reachGainPct}% Reach Gain</span>
            </div>

            <div className="col-span-6 card" style={{ padding: '12px', backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <span className="text-micro text-muted font-bold block">3s RETENTION BOOST</span>
              <div className="font-black text-primary" style={{ fontSize: '1.8rem', margin: '4px 0' }}>
                +{editSimulation.retentionGainPct}%
              </div>
              <span className="text-detail text-secondary block">Reduced scroll drop-off</span>
            </div>

            <div className="col-span-6 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">PREDICTED SHARES GAIN</span>
              <span className="text-body font-bold text-success">+{editSimulation.sharesGainPct}%</span>
            </div>

            <div className="col-span-6 card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">PREDICTED COMMENTS GAIN</span>
              <span className="text-body font-bold text-success">+{editSimulation.commentsGainPct}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 11. Multi-Format Export Modal (V3 Section 11)
  const renderExportReportModal = () => {
    return (
      <div className="card" style={{ padding: 'var(--space-lg)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
          <div>
            <span className="text-micro font-bold text-muted block" style={{ letterSpacing: '0.05em' }}>SECTION 11 — MULTI-FORMAT CREATOR REPORT EXPORT</span>
            <h4 className="font-bold text-primary" style={{ margin: '4px 0' }}>Export Professional Intelligence PDF & Presentation Decks</h4>
          </div>
          <span className="badge badge-indigo">Client-Ready Deliverables</span>
        </div>

        <div className="grid-12" style={{ gap: '12px' }}>
          <button className="col-span-3 btn btn-secondary flex-column align-center text-center" style={{ padding: '14px' }} onClick={() => showToast('PDF Report generated cleanly!', 'success')}>
            <span style={{ fontSize: '1.5rem' }}>📄</span>
            <span className="font-bold text-primary block" style={{ marginTop: '4px' }}>Export PDF Report</span>
            <span className="text-micro text-muted">Full 13-Section Audit</span>
          </button>

          <button className="col-span-3 btn btn-secondary flex-column align-center text-center" style={{ padding: '14px' }} onClick={() => showToast('Interactive HTML Bundle exported!', 'success')}>
            <span style={{ fontSize: '1.5rem' }}>🌐</span>
            <span className="font-bold text-primary block" style={{ marginTop: '4px' }}>Interactive HTML</span>
            <span className="text-micro text-muted">Self-Contained Dashboard</span>
          </button>

          <button className="col-span-3 btn btn-secondary flex-column align-center text-center" style={{ padding: '14px' }} onClick={() => showToast('Presentation Mode launched!', 'info')}>
            <span style={{ fontSize: '1.5rem' }}>🖥️</span>
            <span className="font-bold text-primary block" style={{ marginTop: '4px' }}>Presentation Deck</span>
            <span className="text-micro text-muted">Fullscreen Creator View</span>
          </button>

          <button className="col-span-3 btn btn-secondary flex-column align-center text-center" style={{ padding: '14px' }} onClick={() => showToast('Agency White-Label Report ready!', 'success')}>
            <span style={{ fontSize: '1.5rem' }}>💼</span>
            <span className="font-bold text-primary block" style={{ marginTop: '4px' }}>Agency White-Label</span>
            <span className="text-micro text-muted">Unbranded Client Report</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-column" style={{ gap: 'var(--space-lg)' }}>
      
      {/* Target Asset header card summary bar */}
      <div className="card flex-between" style={{ padding: 'var(--space-md)' }}>
        <div className="flex-center" style={{ gap: 'var(--space-sm)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-default)' }}>
            <img src={currentVideo.poster_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Selected Reel thumbnail" />
          </div>
          <div>
            <h3 className="font-bold text-primary" style={{ margin: 0 }}>{currentVideo.title}</h3>
            <span className="text-detail text-secondary">{currentVideo.filename} &bull; Simulated {currentVideo.created_at ? new Date(currentVideo.created_at).toLocaleDateString() : 'Recently'}</span>
          </div>
        </div>

        <div className="flex-center" style={{ gap: 'var(--space-sm)' }}>
          <div style={{ textAlign: 'right' }}>
            <span className="text-micro text-muted font-bold block">VIRAL POTENTIAL SCORE</span>
            <span className="text-body font-bold text-gradient" style={{ fontSize: '1.25rem' }}>{currentVideo.score}%</span>
          </div>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => navigate(`/assets/${currentVideo.id}/simulate`)}
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.5)', color: '#F59E0B', fontWeight: 800 }}
          >
            ⚡ Run AI Audience Simulator →
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/upload')}>Upload New Reel</button>
        </div>
      </div>

      {/* ADVANCED ANALYSIS TABS NAVIGATION BAR */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-default)', paddingBottom: '8px', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: '📊 Live Digital Twin Overview', path: 'overview' },
          { id: 'hooks', label: '🔥 Hook Strength', path: 'hooks' },
          { id: 'timeline', label: '⏱️ Frame Timeline & Evidence', path: 'timeline' },
          { id: 'content-dna', label: '🧬 ContentDNA', path: 'content-dna' },
          { id: 'audio', label: '🎧 Voice & Audio', path: 'audio' },
          { id: 'visual', label: '🎨 Frame Analysis', path: 'visual' },
          { id: 'ocr', label: '🔤 Text Overlay (OCR)', path: 'ocr' },
          { id: 'transcript', label: '📝 Script & Captions', path: 'transcript' },
          { id: 'benchmark', label: '📊 Viral Benchmarks', path: 'benchmark' }
        ].map(tab => {
          const isActive = activeTab === tab.path || (tab.path === 'overview' && (activeTab === 'report' || activeTab === 'hooks' || !activeTab));
          return (
            <button
              key={tab.id}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => navigate(`/assets/${currentVideo.id}/${tab.path}`)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Render selected intelligence panel layout */}
      {(activeTab === 'overview' || activeTab === 'report' || !activeTab) && (
        <div className="flex-column" style={{ gap: 'var(--space-lg)' }}>
          {renderUploadSummaryPanel()}
          {renderViralPredictionPanel()}
          {renderLiveReelPlayerPanel()}
          {renderDistributionWavesPanel()}
          {renderPersonasAndFunnelPanel()}
          {renderFrameTimelinePanel()}
          {renderAlgorithmThinkingPanel()}
          {renderAlgorithmAndImprovementsPanel()}
          {renderEditImpactSimulatorPanel()}
          {renderVersionComparisonPanel()}
          {renderExportReportModal()}
        </div>
      )}
      {activeTab === 'hooks' && renderHookIntelligence()}
      {activeTab === 'timeline' && renderFrameTimelinePanel()}
      {activeTab === 'content-dna' && (
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <h4 className="font-bold text-primary">🧬 ContentDNA 1024D Multimodal Breakdown</h4>
          <p className="text-secondary" style={{ marginTop: 'var(--space-xs)' }}>1024-dimensional feature vector projected across visual, audio, OCR, and sentiment dimensions.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
            <div className="card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">VISUAL VECTOR WEIGHT</span>
              <span className="text-body font-bold text-primary">38.4%</span>
            </div>
            <div className="card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">AUDIO SPECTRUM WEIGHT</span>
              <span className="text-body font-bold text-primary">26.1%</span>
            </div>
            <div className="card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">TEXT OCR DENSITY</span>
              <span className="text-body font-bold text-primary">18.5%</span>
            </div>
            <div className="card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <span className="text-micro text-muted font-bold block">SEMANTIC SENTIMENT</span>
              <span className="text-body font-bold text-primary">17.0%</span>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'audio' && renderAudioIntelligence()}
      {activeTab === 'visual' && renderVisualIntelligence()}
      {activeTab === 'ocr' && (
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <h4 className="font-bold text-primary">🔤 OCR & Text Surface Analysis</h4>
          <p className="text-secondary" style={{ marginTop: 'var(--space-xs)' }}>Detected on-screen captions, bounding boxes, and reading complexity scores.</p>
        </div>
      )}
      {activeTab === 'transcript' && renderScriptIntelligence()}
      {activeTab === 'benchmark' && (
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <h4 className="font-bold text-primary">📊 Benchmark Percentile Ranking</h4>
          <p className="text-secondary" style={{ marginTop: 'var(--space-xs)' }}>Performance compared against verified 100-video real-world benchmark dataset.</p>
        </div>
      )}
      {activeTab === 'retention' && renderRetentionSimulator()}
      {activeTab === 'thumbnail' && renderThumbnailIntelligence()}
      {activeTab === 'caption' && renderCaptionMetadata()}
      {activeTab === 'audience' && renderTargetAudience()}
      {activeTab === 'creative-lab' && renderCreativeLab()}
      {activeTab === 'memory' && renderPerformanceMemory()}

    </div>
  );
};
