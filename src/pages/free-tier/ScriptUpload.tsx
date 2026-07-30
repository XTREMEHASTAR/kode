import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FreeTierLayout } from '../../components/free-tier/FreeTierLayout';
import { freeTierService } from '../../services/freeTierService';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { entitlementService } from '../../services/entitlementService';
import { DailyQuotaBanner } from '../../components/free-tier/DailyQuotaBanner';

export const ScriptUpload: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const { user } = useAuth();

  const isPro = entitlementService.canAccessFeature(user, 'predictive_retention').allowed || user?.plan === 'pro' || freeTierService.isProActive();

  const [scriptText, setScriptText] = useState('');
  const [scriptTitle, setScriptTitle] = useState('');
  const [selectedChip, setSelectedChip] = useState('Instagram Reel');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [serverQuotaState, setServerQuotaState] = useState<{ remaining: number; resetAt: string; used: number } | null>(null);

  useEffect(() => {
    freeTierService.syncBackendUsage().then((usage) => {
      setServerQuotaState(usage);
    }).catch(err => {
      console.warn("Backend usage sync warning:", err);
    });
  }, []);

  // Remaining analyses quota check (PostgreSQL backend source of truth)
  const quotaRemaining = isPro ? 99999 : (serverQuotaState ? serverQuotaState.remaining : freeTierService.getRemainingQuota());
  const hasQuota = isPro || quotaRemaining > 0;

  const steps = [
    'Reading your script...',
    'Examining the opening...',
    'Checking clarity and curiosity...',
    'Evaluating emotional impact...',
    'Building recommendations...'
  ];

  const chips = [
    'Instagram Reel',
    'TikTok',
    'YouTube Short',
    'Product Ad',
    'UGC',
    'Storytelling',
    'Other'
  ];

  useEffect(() => {
    if (!isAnalyzing) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnalyzing, steps.length]);

  useEffect(() => {
    if (!isAnalyzing) return;
    
    if (currentStep === steps.length - 1) {
      const finalTimer = setTimeout(async () => {
        try {
          const finalTitle = scriptTitle.trim();
          const newScript = await freeTierService.createScriptAsync(finalTitle, scriptText, selectedChip);
          setIsAnalyzing(false);
          showToast('Analysis completed successfully!', 'success');
          navigate(`/script-intelligence/${newScript.id}/results`);
        } catch (err: any) {
          setIsAnalyzing(false);
          setErrorMsg(err.message || 'An error occurred during analysis.');
          showToast(err.message || 'Analysis failed', 'error');
          freeTierService.syncBackendUsage().then(setServerQuotaState).catch(() => {});
        }
      }, 1000);
      return () => clearTimeout(finalTimer);
    }
  }, [currentStep, isAnalyzing, scriptText, scriptTitle, selectedChip, steps.length, navigate, showToast]);

  const handleAnalyze = () => {
    setErrorMsg(null);
    if (!hasQuota) {
      setErrorMsg("You've used today's 3 free analyses. Upgrade to continue analyzing, or come back when your free analyses reset.");
      showToast("No remaining quota.", "error");
      return;
    }
    if (!scriptText.trim()) {
      setErrorMsg('Please enter or upload a script to analyze.');
      showToast('Script content cannot be empty.', 'error');
      return;
    }
    
    setIsAnalyzing(true);
    setCurrentStep(0);
  };

  const handleTextUpload = (text: string, title?: string) => {
    if (!hasQuota) {
      setErrorMsg("You've used today's 3 free analyses. Upgrade to continue analyzing.");
      showToast("Cannot upload script: quota limit reached.", "error");
      return;
    }
    setErrorMsg(null);
    setScriptText(text);
    if (title) {
      setScriptTitle(title);
    }
    showToast('Script imported successfully!', 'info');
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.txt')) {
      setErrorMsg('Only .txt files are supported.');
      showToast('Only .txt files are supported.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 2MB limit.');
      showToast('File size exceeds the 2MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
        handleTextUpload(text, cleanTitle);
      } else {
        setErrorMsg('Could not read file contents.');
        showToast('Could not read file contents.', 'error');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Error reading file.');
      showToast('Error reading file.', 'error');
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (hasQuota) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!hasQuota) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const loadExampleScript = () => {
    if (!hasQuota) {
      setErrorMsg("You've used today's 3 free analyses. Upgrade to continue analyzing.");
      showToast("Cannot load example script: quota limit reached.", "error");
      return;
    }
    const example = `Stop scrolling — you're making this mistake every time you edit your videos. Most creators spend 5 hours on their content only to ruin it in the first 3 seconds with a boring hello. If you want to double your retention, cut the intro and start with the payoff. Hit follow for more scroll-stopping tips!`;
    setScriptText(example);
    setScriptTitle('Example Video Script');
    showToast('Example script loaded!', 'info');
  };

  // Deterministic Text Parsing for Live Preview
  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount = getWordCount(scriptText);
  const charCount = scriptText.length;
  
  // Avg speaking speed is roughly 150 words per minute
  const estSpeakingTime = wordCount > 0 ? Math.max(1, Math.round((wordCount / 150) * 60)) : 0;
  
  const hasOpening = wordCount > 0;
  const hasQuestion = /\?|^(why|how|what|who|when|where|are|do|can|is|will|should|would|could)/i.test(scriptText.trim());
  
  const ctaKeywords = /\b(click|link|follow|subscribe|comment|share|buy|shop|check|try|download|save|watch|more)\b/i;
  const hasCTA = ctaKeywords.test(scriptText);

  // Progressive CTA states
  const isCtaActive = wordCount > 0 && hasQuota;
  const isCtaProminent = charCount >= 100 && hasQuota;

  return (
    <FreeTierLayout>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 className="text-4xl font-extrabold text-[#173247] tracking-tight mb-3">
          Will your hook stop the scroll?
        </h1>
        <p className="text-lg text-[#3D5A73] max-w-[600px] mx-auto">
          Paste your script and see how strongly it can capture attention — before you post.
        </p>
      </div>

      {/* Quota Banner when limit reached */}
      {!hasQuota && (
        <div style={{
          backgroundColor: '#FFFBF9',
          border: '1px solid #FFDCD2',
          color: '#162A3B',
          padding: '18px 22px',
          borderRadius: '12px',
          fontSize: '14px',
          marginBottom: '28px',
          lineHeight: '1.5',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 4px 12px rgba(255, 107, 61, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#162A3B' }}>
            <svg width="20" height="20" fill="none" stroke="#FF6B3D" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span style={{ fontSize: '15px' }}>Daily Quota Reached</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ color: '#3D5A73', fontWeight: 450, flex: 1, minWidth: '280px' }}>
              You've used today's 3 free analyses. Upgrade to continue analyzing, or come back when your free analyses reset. Your library and existing results remain fully accessible.
            </span>
            <button
              onClick={() => {
                freeTierService.resetQuotaForTest();
                setErrorMsg(null);
                showToast('Daily quota reset for testing!', 'success');
                window.location.reload();
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#FF6B3D',
                border: 'none',
                padding: '4px 8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              title="Development/Test helper to reset quota"
            >
              <span>🛠</span>
              <span>Reset Quota (Test)</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/pricing?source=quota_banner')}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#162A3B',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '13.5px',
              cursor: 'pointer',
              marginTop: '4px',
              transition: 'background-color 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FF6B3D'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#162A3B'}
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {errorMsg && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#B91C1C',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {isAnalyzing ? (
        <div className="script-workspace-grid">
          <div style={{ gridColumn: 'span 2' }}>
            <div className="script-studio-card" style={{ position: 'relative', overflow: 'hidden', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {/* Faint script background */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                bottom: '20px',
                opacity: 0.12,
                color: '#162A3B',
                fontSize: '14.5px',
                lineHeight: '1.6',
                textAlign: 'left',
                overflow: 'hidden',
                userSelect: 'none',
                pointerEvents: 'none'
              }}>
                {scriptText}
              </div>
              
              {/* Vertical scanning line */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, rgba(255, 107, 61, 0) 0%, #FF6B3D 50%, rgba(255, 107, 61, 0) 100%)',
                boxShadow: '0 0 8px #FF6B3D',
                animation: 'scanning-line 2s infinite ease-in-out',
                zIndex: 10
              }} />
              
              <style>{`
                @keyframes scanning-line {
                  0% { top: 10%; }
                  50% { top: 90%; }
                  100% { top: 10%; }
                }
              `}</style>
              
              {/* Scanning UI */}
              <div style={{ zIndex: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="scanning-pulse-circle">
                  <svg className="scanning-icon" width="36" height="36" fill="none" stroke="#FF6B3D" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="scanning-status-title" style={{ color: '#162A3B', fontWeight: 800, fontSize: '20px', marginBottom: '8px' }}>Analyzing Your Script</h3>
                <p className="scanning-status-subtitle" style={{ color: '#475467', fontWeight: 600, fontSize: '14.5px', marginBottom: '20px' }}>{steps[currentStep]}</p>
                
                <div className="scanning-progress-bar" style={{ backgroundColor: '#E8E3DA', width: '260px', height: '5px', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div 
                    className="scanning-progress-fill" 
                    style={{ 
                      width: `${((currentStep + 1) / steps.length) * 100}%`,
                      backgroundColor: '#FF6B3D',
                      height: '100%',
                      borderRadius: '9999px',
                      boxShadow: '0 0 10px rgba(255, 107, 61, 0.4)',
                      transition: 'width 0.4s ease'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="script-workspace-grid">
            {/* Left Column: SCRIPT STUDIO */}
            <div 
              className="aura-card"
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* File Drag and Drop Overlay */}
              <div className={`script-studio-drag-overlay ${isDragging ? 'active' : ''}`}>
                <div className="drag-overlay-content">
                  <svg className="drag-overlay-icon" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>DROP YOUR SCRIPT</h3>
                  <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>Only .txt files are supported</p>
                </div>
              </div>

              {/* Card Header */}
              <div className="script-studio-header">
                <span className="script-studio-header-title">Script Studio</span>
                <div className="script-studio-header-actions">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept=".txt"
                    onChange={handleFileChange}
                    disabled={!hasQuota}
                  />
                  <button 
                    className="txt-upload-action" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!hasQuota}
                    style={{
                      opacity: hasQuota ? 1 : 0.5,
                      cursor: hasQuota ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload .TXT
                  </button>
                  <span className={`script-studio-counter ${wordCount > 0 ? 'has-content' : ''}`}>
                    {wordCount} words • {charCount} characters
                  </span>
                </div>
              </div>

              {/* Textarea Workspace Container */}
              <div className="studio-textarea-container">
                {/* Empty State Custom Hints */}
                {scriptText.length === 0 && (
                  <div className="studio-empty-backdrop">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div className="kontagi-orb-core" style={{ width: '8px', height: '8px', boxShadow: '0 0 6px rgba(241, 58, 30, 0.8)', flexShrink: 0 }}></div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
                        {hasQuota ? 'Start typing to wake up KONTAGI...' : 'Daily quota reached. Check your library below.'}
                      </span>
                    </div>
                    {hasQuota && (
                      <div style={{ opacity: 0.5, fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        Paste your Reel, Short or TikTok script here...
                        <span className="animated-cursor"></span>
                      </div>
                    )}
                  </div>
                )}
                
                <textarea
                  className={`studio-textarea ${scriptText.length === 0 ? 'is-empty' : ''}`}
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  placeholder=""
                  disabled={!hasQuota}
                  maxLength={10000}
                />
              </div>

              {/* Title input field */}
              {hasQuota && (
                <div style={{ padding: '0 24px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Enter script title (optional - auto generated if empty)"
                    value={scriptTitle}
                    onChange={(e) => setScriptTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--aura-border-medium, rgba(23, 50, 71, 0.18))',
                      fontSize: '13.5px',
                      color: 'var(--aura-navy-primary, #173247)',
                      backgroundColor: 'var(--aura-card-solid, #FCF9F3)',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              {/* Content Type Chips */}
              <div>
                <div className="chips-label">What are you creating?</div>
                <div className="chips-container" style={{ opacity: hasQuota ? 1 : 0.5, pointerEvents: hasQuota ? 'auto' : 'none' }}>
                  {chips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className={`content-chip ${selectedChip === chip ? 'active' : ''}`}
                      onClick={() => setSelectedChip(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Try an Example */}
              <div className="example-trigger-row">
                <button 
                  type="button" 
                  className="example-trigger-btn"
                  onClick={loadExampleScript}
                  disabled={!hasQuota}
                  style={{
                    opacity: hasQuota ? 1 : 0.5,
                    cursor: hasQuota ? 'pointer' : 'not-allowed'
                  }}
                >
                  Not sure what to test? <span style={{ color: '#F13A1E', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: '700' }}>Try an example <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span>
                </button>
              </div>
            </div>

            {/* Right Column: LIVE ANALYSIS PREVIEW */}
            <div className="aura-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '24px' }}>Live Analysis Preview</h3>
              
              {wordCount === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', gap: '32px' }}>
                  <div className="aura-gradient-orb">
                    <div className="orb-core"></div>
                    <div className="orb-ring"></div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500, textAlign: 'center' }}>
                    {hasQuota ? 'Your next high-performing script starts here.' : 'Daily analysis quota exhausted.'}
                  </p>
                </div>
              ) : (
                <div className="live-preview-active-content">
                  <div className="live-signal-item">
                    <span className="live-signal-label">Words</span>
                    <span className="live-signal-val">{wordCount}</span>
                  </div>
                  
                  <div className="live-signal-item">
                    <span className="live-signal-label">Estimated speaking time</span>
                    <span className="live-signal-val">~{estSpeakingTime} sec</span>
                  </div>

                  <div className="live-signal-item">
                    <span className="live-signal-label">Opening detected</span>
                    <span className={`live-signal-val ${hasOpening ? 'highlight-yes' : 'highlight-no'}`}>
                      {hasOpening ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="live-signal-item">
                    <span className="live-signal-label">Question detected</span>
                    <span className={`live-signal-val ${hasQuestion ? 'highlight-yes' : 'highlight-no'}`}>
                      {hasQuestion ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="live-signal-item">
                    <span className="live-signal-label">CTA detected</span>
                    <span className={`live-signal-val ${hasCTA ? 'highlight-yes' : 'highlight-no'}`}>
                      {hasCTA ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Primary CTA and Journey Block */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', marginBottom: '32px' }}>
            <div className="script-cta-wrapper">
              <button 
                type="button"
                onClick={handleAnalyze} 
                disabled={!isCtaActive}
                className="aura-btn-primary"
                style={{
                  backgroundColor: '#173247',
                  color: '#FCF9F3',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '16px 36px',
                  fontSize: '15px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 20px rgba(23, 50, 71, 0.25)',
                  transition: 'all 0.2s',
                  opacity: isCtaActive ? 1 : 0.5,
                  cursor: isCtaActive ? 'pointer' : 'not-allowed'
                }}
              >
                Analyze My Script
                <svg width="18" height="18" fill="none" stroke="#F13A1E" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <span className="premium-cta-subtext" style={{ display: 'block', marginTop: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
                {isPro
                  ? '⚡ KONTAGI Pro Active — Unlimited Script Analyses'
                  : hasQuota 
                  ? `${quotaRemaining} of 3 free analyses remaining today` 
                  : "0 of 3 free analyses remaining today. Upgrade to Pro."
                }
              </span>
            </div>

            {/* Subtle Analysis Journey Stepper */}
            <div className="analysis-journey-container">
              <span className={`analysis-journey-step ${scriptText.length > 0 ? 'active' : ''}`}>YOUR SCRIPT</span>
              <span className="analysis-journey-arrow">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className={`analysis-journey-step ${scriptText.length > 0 ? 'active' : ''}`}>KONTAGI AI</span>
              <span className="analysis-journey-arrow">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="analysis-journey-step">HOOK SCORE + INSIGHTS</span>
            </div>
          </div>
        </>
      )}

      {/* What we'll analyze strip */}
      <div style={{ marginTop: '16px', marginBottom: '24px' }}>
        <div className="analyze-strip-label">KONTAGI WILL ANALYZE</div>
        <div className="analyze-strip-container">
          <div className="analyze-strip-item">
            <div className="analyze-strip-icon-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="analyze-strip-info">
              <span className="analyze-strip-title">HOOK STRENGTH</span>
              <span className="analyze-strip-desc">Can it stop attention?</span>
            </div>
          </div>

          <div className="analyze-strip-item">
            <div className="analyze-strip-icon-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 113.536 0V21h2v-2.757" />
              </svg>
            </div>
            <div className="analyze-strip-info">
              <span className="analyze-strip-title">CURIOSITY</span>
              <span className="analyze-strip-desc">Does it make people want more?</span>
            </div>
          </div>

          <div className="analyze-strip-item">
            <div className="analyze-strip-icon-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="analyze-strip-info">
              <span className="analyze-strip-title">CLARITY</span>
              <span className="analyze-strip-desc">Is the message instantly understandable?</span>
            </div>
          </div>

          <div className="analyze-strip-item">
            <div className="analyze-strip-icon-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318z" />
              </svg>
            </div>
            <div className="analyze-strip-info">
              <span className="analyze-strip-title">EMOTIONAL IMPACT</span>
              <span className="analyze-strip-desc">Does it make the viewer feel something?</span>
            </div>
          </div>

          <div className="analyze-strip-item">
            <div className="analyze-strip-icon-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <div className="analyze-strip-info">
              <span className="analyze-strip-title">CTA</span>
              <span className="analyze-strip-desc">Does it drive action?</span>
            </div>
          </div>
        </div>
      </div>
    </FreeTierLayout>
  );
};
