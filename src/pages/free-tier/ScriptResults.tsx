import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FreeTierLayout } from '../../components/free-tier/FreeTierLayout';
import { HookScoreGauge } from '../../components/free-tier/HookScoreGauge';
import { ScoreBreakdown } from '../../components/free-tier/ScoreBreakdown';
import { InsightCard } from '../../components/free-tier/InsightCard';
import { SuggestionCard } from '../../components/free-tier/SuggestionCard';
import { FreeTierUpgradeBanner } from '../../components/free-tier/FreeTierUpgradeBanner';
import { FreeTierScript } from '../../types/freeTier';
import { freeTierService } from '../../services/freeTierService';
import { analyzeScriptText } from '../../services/scriptAnalysisEngine';
import { useApp } from '../../context/AppContext';
import { AICopilotView } from '../../components/free-tier/AICopilotView';
import { PredictiveRetentionPreview } from '../../components/free-tier/PredictiveRetentionPreview';
import { PredictiveRetentionView } from '../../components/free-tier/PredictiveRetentionView';
import { entitlementService } from '../../services/entitlementService';
import { useAuth } from '../../context/AuthContext';
import { downloadScriptReport, downloadScriptText } from '../../utils/reportExporter';

export const ScriptResults: React.FC = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useApp();
  const { user } = useAuth();

  const [script, setScript] = useState<FreeTierScript | null>(null);

  // Sync tab status with React Router route / query parameters
  const isReviewPage = location.pathname.endsWith('/review');
  const queryParams = new URLSearchParams(location.search);
  const showRetention = queryParams.get('tab') === 'retention';
  const showAICopilot = queryParams.get('tab') === 'ai-copilot';
  const activeTab = showRetention ? 'retention' : (showAICopilot ? 'ai-copilot' : (isReviewPage ? 'review' : 'insights'));

  useEffect(() => {
    if (analysisId) {
      const found = freeTierService.getScript(analysisId);
      if (found) {
        if (!found.analysisResult || !found.analysisResult.scoreBreakdown) {
          found.analysisResult = analyzeScriptText(found.scriptText, found.contentType);
        }
        setScript(found);
      }
      freeTierService.getScriptAsync(analysisId).then(cloudScript => {
        if (cloudScript) {
          if (!cloudScript.analysisResult || !cloudScript.analysisResult.scoreBreakdown) {
            cloudScript.analysisResult = analyzeScriptText(cloudScript.scriptText, cloudScript.contentType);
          }
          setScript(cloudScript);
        }
      }).catch(err => {
        console.warn("Cloud script fetch warning:", err);
      });
    }
  }, [analysisId]);

  const handleToggleFavorite = () => {
    if (!script) return;
    const updated = freeTierService.toggleFavorite(script.id);
    if (updated) {
      setScript(updated);
      showToast(updated.isFavorite ? 'Script added to favorites.' : 'Script removed from favorites.', 'success');
    }
  };

  if (!script) {
    return (
      <FreeTierLayout>
        <div className="ft-card" style={{ textAlign: 'center', padding: '48px' }}>
          <h3 className="ft-empty-title">Analysis Not Found</h3>
          <p className="ft-empty-desc">The requested script analysis could not be found or may have been deleted.</p>
          <button className="ft-btn" onClick={() => navigate('/script-library')}>
            Back to Library
          </button>
        </div>
      </FreeTierLayout>
    );
  }

  // Format creation date
  const formattedDate = new Date(script.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleRestoreOriginal = () => {
    if (!script || !script.originalScriptText) return;
    if (!window.confirm('Are you sure you want to restore your original script? AI optimizations will be reverted.')) return;

    const originalText = script.originalScriptText;
    const newAnalysis = analyzeScriptText(originalText, script.contentType);
    const updated = freeTierService.updateScript(script.id, {
      scriptText: originalText,
      hookScore: newAnalysis.hookScore,
      hookText: newAnalysis.hookText,
      signals: newAnalysis.signals,
      wordCount: newAnalysis.wordCount,
      characterCount: newAnalysis.characterCount,
      estimatedSpeakingTime: newAnalysis.estimatedSpeakingTime,
      analysisResult: newAnalysis
    });
    setScript(updated);
    showToast('Original script restored successfully!', 'success');
  };

  const handleDownloadReport = () => {
    if (!script) return;
    downloadScriptReport(script);
    showToast('Analysis report downloaded successfully!', 'success');
  };

  const isModifiedByAI = Boolean(script.originalScriptText && script.originalScriptText.trim() !== script.scriptText.trim());

  return (
    <FreeTierLayout>
      {/* Navigation Toolbar */}
      <div className="ft-back-row" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button className="ft-btn-link" onClick={() => navigate('/script-library')}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Library
        </button>
        <span style={{ color: '#E8E3DA' }}>|</span>
        <button className="ft-btn-link" onClick={() => navigate('/script-intelligence')}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Analyze Another Script (Main Page)
        </button>
      </div>

      {/* Premium Header and Metadata Block */}
      <div className="aura-card" style={{ marginBottom: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            {/* Badges strip */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="ft-badge" style={{ backgroundColor: '#EEF2FF', color: '#2563EB', fontWeight: 700 }}>
                {script.contentType || 'Script'}
              </span>
              {isModifiedByAI && (
                <span className="ft-badge" style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: 700 }}>
                  ✨ AI Optimized
                </span>
              )}
            </div>

            <h2 className="ft-page-title" style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 800 }}>{script.title}</h2>
            <div className="ft-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6B7280', fontSize: '13px', flexWrap: 'wrap' }}>
              <span>Analyzed on {formattedDate}</span>
              <div className="ft-meta-dot" style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#D1D5DB' }} />
              <span>{script.wordCount} words</span>
              <div className="ft-meta-dot" style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#D1D5DB' }} />
              <span>{script.characterCount || script.scriptText.length} characters</span>
              <div className="ft-meta-dot" style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#D1D5DB' }} />
              <span>~{script.estimatedSpeakingTime && script.estimatedSpeakingTime > 1 ? script.estimatedSpeakingTime : Math.round((script.wordCount || 0) * 0.4)}s speaking time</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Download Script Button */}
            <button
              onClick={() => {
                downloadScriptText(script.scriptText, script.title);
                showToast('Script downloaded as TXT file!', 'success');
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#FF6B3D',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(255, 107, 61, 0.25)',
                transition: 'all 0.15s ease'
              }}
              title="Download script text (.txt)"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Script
            </button>

            {/* Download Report Button */}
            <button
              onClick={handleDownloadReport}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid #162A3B',
                backgroundColor: '#162A3B',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(22, 42, 59, 0.2)',
                transition: 'all 0.15s ease'
              }}
              title="Download full analysis report (.txt)"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Report
            </button>

            {isModifiedByAI && (
              <button
                onClick={handleRestoreOriginal}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
                title="Restore to original pre-AI script"
              >
                🔄 Restore Original Script
              </button>
            )}
            
            {/* Favorite Toggle Button */}
            <button 
              className={`ft-icon-btn favorite ${script.isFavorite ? 'active' : ''}`}
              onClick={handleToggleFavorite}
              title={script.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: script.isFavorite ? '#EFF6FF' : '#FFFFFF',
                color: script.isFavorite ? '#3B82F6' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="20" height="20" fill={script.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.977-2.888a1 1 0 00-1.176 0l-3.977 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Results Grid columns */}
      <div className="ft-results-columns" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Gauges, breakdown and signals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <HookScoreGauge 
            score={script.hookScore || script.analysisResult?.hookScore || 0}
            status={script.analysisResult?.hookStatus || 'Needs Improvement'}
            supportingText={script.analysisResult?.hookSupportingText || 'Script analysis complete.'}
          />

          {/* Attention Signals Card */}
          <div className="aura-card" style={{ padding: '20px' }}>
            <h3 className="ft-card-title" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
              Detected Signals
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {script.signals && script.signals.length > 0 ? (
                script.signals.map(sig => (
                  <span key={sig} style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: sig.includes('Weak') ? '#FEF2F2' : '#EFF6FF',
                    color: sig.includes('Weak') ? '#EF4444' : '#2563EB',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${sig.includes('Weak') ? '#FEE2E2' : '#DBEAFE'}`
                  }}>
                    {sig}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No hooks detected</span>
              )}
            </div>
          </div>

          <ScoreBreakdown data={script.analysisResult?.scoreBreakdown} />
        </div>

        {/* Right Column: Tab container */}
        <div className="aura-card" style={{ margin: 0, padding: '24px' }}>
          <div className="ft-tabs" style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '24px' }}>
            <button 
              className={`ft-tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => navigate(`/script-intelligence/${script.id}/results`)}
              style={{
                border: 'none',
                background: 'none',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 600,
                color: activeTab === 'insights' ? '#2563EB' : 'var(--text-muted)',
                borderBottom: activeTab === 'insights' ? '2px solid #2563EB' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Results & Insights
            </button>
            
            <button 
              className={`ft-tab-btn ${activeTab === 'review' ? 'active' : ''}`}
              onClick={() => navigate(`/script-intelligence/${script.id}/review`)}
              style={{
                border: 'none',
                background: 'none',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 600,
                color: activeTab === 'review' ? '#2563EB' : 'var(--text-muted)',
                borderBottom: activeTab === 'review' ? '2px solid #2563EB' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Script Review
            </button>

            <button 
              className={`ft-tab-btn ${activeTab === 'ai-copilot' ? 'active' : ''}`}
              onClick={() => navigate(`/script-intelligence/${script.id}/results?tab=ai-copilot`)}
              style={{
                border: 'none',
                background: 'none',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 600,
                color: activeTab === 'ai-copilot' ? '#2563EB' : 'var(--text-muted)',
                borderBottom: activeTab === 'ai-copilot' ? '2px solid #2563EB' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-1.81-5.096L2 14l5.096-1.81L9 7l1.81 5.19L16 14l-6.187 1.904z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929a10 10 0 00-14.142 0M21 3L17.5 6.5M3 3l3.5 3.5" />
              </svg>
              AI Copilot
            </button>
            
            <button 
              className={`ft-tab-btn locked-tab ${activeTab === 'retention' ? 'active' : ''}`}
              onClick={() => navigate(`/script-intelligence/${script.id}/results?tab=retention`)}
              style={{
                border: 'none',
                background: 'none',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 600,
                color: activeTab === 'retention' ? '#2563EB' : 'var(--text-muted)',
                borderBottom: activeTab === 'retention' ? '2px solid #2563EB' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Predictive Retention Map
            </button>
          </div>

          {activeTab === 'review' ? (
            <div>
              {/* Hook Section */}
              <div className="ft-review-section">
                <div className="ft-review-header">
                  <span className="ft-section-badge hook" style={{ backgroundColor: 'rgba(241, 58, 30, 0.12)', color: '#F13A1E', fontWeight: 800, padding: '4px 8px', borderRadius: '4px' }}>HOOK</span>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--aura-navy-primary)' }}>Opening Hook</h4>
                </div>
                <div className="ft-review-grid">
                  <div className="ft-script-content" style={{ color: 'var(--aura-navy-primary)', fontSize: '14px', lineHeight: 1.6 }}>
                    {script.analysisResult.scriptReview.hook.text}
                  </div>
                  <div className="ft-review-feedback">
                    <div className="ft-feedback-row" style={{ color: 'var(--aura-navy-primary)', fontSize: '13px' }}>
                      <svg style={{ color: '#10B981', flexShrink: 0 }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong style={{ color: 'var(--aura-navy-primary)' }}>What works:</strong> {script.analysisResult.scriptReview.hook.works}</span>
                    </div>
                    <div className="ft-feedback-row" style={{ color: 'var(--aura-navy-primary)', fontSize: '13px' }}>
                      <svg style={{ color: '#F59E0B', flexShrink: 0 }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span><strong style={{ color: 'var(--aura-navy-primary)' }}>How to improve:</strong> {script.analysisResult.scriptReview.hook.improve}</span>
                    </div>
                    {script.analysisResult.scriptReview.hook.rewrite && (
                      <div className="ft-rewrite-box" style={{ borderRadius: '8px', padding: '14px' }}>
                        <div className="ft-rewrite-title" style={{ color: 'var(--aura-navy-primary)', fontWeight: 800, fontSize: '11px', letterSpacing: '0.05em' }}>REWRITE RECOMMENDATION</div>
                        <span style={{ color: 'var(--aura-navy-primary)', fontSize: '13.5px', fontStyle: 'italic', fontWeight: 600 }}>"{script.analysisResult.scriptReview.hook.rewrite}"</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Body Section */}
              <div className="ft-review-section">
                <div className="ft-review-header">
                  <span className="ft-section-badge body" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#059669', fontWeight: 800, padding: '4px 8px', borderRadius: '4px' }}>BODY</span>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--aura-navy-primary)' }}>Body & Pacing</h4>
                </div>
                <div className="ft-review-grid">
                  <div className="ft-script-content" style={{ color: 'var(--aura-navy-primary)', fontSize: '14px', lineHeight: 1.6 }}>
                    {script.analysisResult.scriptReview.body.text}
                  </div>
                  <div className="ft-review-feedback">
                    <div className="ft-feedback-row" style={{ color: 'var(--aura-navy-primary)', fontSize: '13px' }}>
                      <svg style={{ color: '#10B981', flexShrink: 0 }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong style={{ color: 'var(--aura-navy-primary)' }}>What works:</strong> {script.analysisResult.scriptReview.body.works}</span>
                    </div>
                    <div className="ft-feedback-row" style={{ color: 'var(--aura-navy-primary)', fontSize: '13px' }}>
                      <svg style={{ color: '#F59E0B', flexShrink: 0 }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span><strong style={{ color: 'var(--aura-navy-primary)' }}>How to improve:</strong> {script.analysisResult.scriptReview.body.improve}</span>
                    </div>
                    {script.analysisResult.scriptReview.body.rewrite && (
                      <div className="ft-rewrite-box" style={{ borderRadius: '8px', padding: '14px' }}>
                        <div className="ft-rewrite-title" style={{ color: 'var(--aura-navy-primary)', fontWeight: 800, fontSize: '11px', letterSpacing: '0.05em' }}>REWRITE RECOMMENDATION</div>
                        <span style={{ color: 'var(--aura-navy-primary)', fontSize: '13.5px', fontStyle: 'italic', fontWeight: 600 }}>"{script.analysisResult.scriptReview.body.rewrite}"</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="ft-review-section">
                <div className="ft-review-header">
                  <span className="ft-section-badge cta" style={{ backgroundColor: 'rgba(243, 106, 36, 0.12)', color: '#F36A24', fontWeight: 800, padding: '4px 8px', borderRadius: '4px' }}>CTA</span>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--aura-navy-primary)' }}>Call to Action</h4>
                </div>
                <div className="ft-review-grid">
                  <div className="ft-script-content" style={{ color: 'var(--aura-navy-primary)', fontSize: '14px', lineHeight: 1.6 }}>
                    {script.analysisResult.scriptReview.cta.text}
                  </div>
                  <div className="ft-review-feedback">
                    <div className="ft-feedback-row" style={{ color: 'var(--aura-navy-primary)', fontSize: '13px' }}>
                      <svg style={{ color: '#10B981', flexShrink: 0 }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong style={{ color: 'var(--aura-navy-primary)' }}>What works:</strong> {script.analysisResult.scriptReview.cta.works}</span>
                    </div>
                    <div className="ft-feedback-row" style={{ color: 'var(--aura-navy-primary)', fontSize: '13px' }}>
                      <svg style={{ color: '#F59E0B', flexShrink: 0 }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span><strong style={{ color: 'var(--aura-navy-primary)' }}>How to improve:</strong> {script.analysisResult.scriptReview.cta.improve}</span>
                    </div>
                    {script.analysisResult.scriptReview.cta.rewrite && (
                      <div className="ft-rewrite-box" style={{ borderRadius: '8px', padding: '14px' }}>
                        <div className="ft-rewrite-title" style={{ color: 'var(--aura-navy-primary)', fontWeight: 800, fontSize: '11px', letterSpacing: '0.05em' }}>REWRITE RECOMMENDATION</div>
                        <span style={{ color: 'var(--aura-navy-primary)', fontSize: '13.5px', fontStyle: 'italic', fontWeight: 600 }}>"{script.analysisResult.scriptReview.cta.rewrite}"</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'ai-copilot' ? (
            <AICopilotView script={script} onUpdateScript={(updated) => setScript(updated)} />
          ) : activeTab === 'insights' ? (
            <div>
              <InsightCard data={script.analysisResult?.insights || []} />
              <SuggestionCard suggestions={script.analysisResult?.suggestions || []} />
            </div>
          ) : (
            entitlementService.canAccessFeature(user, 'predictive_retention').allowed ? (
              <PredictiveRetentionView script={script} onUpdateScript={(updated) => setScript(updated)} />
            ) : (
              <PredictiveRetentionPreview />
            )
          )}
        </div>
      </div>

      {/* Upgrade CTA banner at bottom */}
      <FreeTierUpgradeBanner />
    </FreeTierLayout>
  );
};
