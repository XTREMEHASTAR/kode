import React, { useState } from 'react';
import { executeAuraCoreSimulation } from '../../services/auracoreService';
import { AuraCoreSimulationTelemetry } from '../../../server/src/modules/auracore/types';

interface AuraCoreSimulationDashboardProps {
  initialTitle?: string;
  initialScriptText?: string;
  contentType?: string;
}

export const AuraCoreSimulationDashboard: React.FC<AuraCoreSimulationDashboardProps> = ({
  initialTitle = 'Unlocking 10x Reach on Instagram',
  initialScriptText = "Stop making this video mistake if you want to grow on social media.\n\nIf your content keeps dying at 200 views, it's not the algorithm—it's your opening 3-second hook.\n\nHere are 3 hook frameworks that double retention overnight.\n\nSave this before posting!",
  contentType = 'Instagram Reel'
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [scriptText, setScriptText] = useState(initialScriptText);
  const [populationSize, setPopulationSize] = useState<number>(1000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [telemetry, setTelemetry] = useState<AuraCoreSimulationTelemetry | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'waves' | 'reactions' | 'diagnostics'>('overview');

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await executeAuraCoreSimulation({
        title,
        scriptText,
        populationSize,
        contentType
      });
      setTelemetry(res);
    } catch (e) {
      console.error("Simulation failed:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '24px 0' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(23, 50, 71, 0.95) 0%, rgba(13, 31, 45, 0.98) 100%)',
        borderRadius: 'var(--aura-radius-lg, 16px)',
        padding: '32px',
        color: '#FFFFFF',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ zIndex: 2, maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(241, 58, 30, 0.2)',
              color: 'var(--aura-vermilion, #F13A1E)',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(241, 58, 30, 0.4)'
            }}>
              AURACORE SIMULATION ENGINE v2.5
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
              Flight Simulator for Short-Form Video
            </span>
          </div>

          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0 0 10px 0', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Pre-Publishing Social Media Simulator
          </h2>

          <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.8)', margin: 0, lineHeight: '1.6' }}>
            Simulate how <strong style={{ color: '#FFF' }}>{populationSize.toLocaleString()} autonomous AI viewers</strong>, candidate recommendation algorithms, and trend diffusion networks respond to your content before posting.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end', zIndex: 2 }}>
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            style={{
              backgroundColor: 'var(--aura-vermilion, #F13A1E)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 800,
              cursor: isSimulating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 16px rgba(241, 58, 30, 0.4)',
              transition: 'transform 0.2s ease'
            }}
          >
            {isSimulating ? (
              <>
                <span className="ft-spinner" style={{ width: '18px', height: '18px', border: '2px solid #FFF', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                Executing Monte Carlo Swarm...
              </>
            ) : (
              <>
                <span>⚡ Run Swarm Simulation</span>
              </>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
            <span>Swarm Cohort Size:</span>
            <select
              value={populationSize}
              onChange={(e) => setPopulationSize(Number(e.target.value))}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              <option value={1000} style={{ color: '#000' }}>1,000 Synthetic Viewers</option>
              <option value={10000} style={{ color: '#000' }}>10,000 Synthetic Viewers</option>
              <option value={100000} style={{ color: '#000' }}>100,000 Synthetic Viewers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Script & DNA Input Panel */}
      <div className="aura-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--aura-navy-primary)', margin: 0 }}>
            Content Candidate Input
          </h3>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--aura-navy-muted)' }}>
            Target Platform: {contentType}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--aura-navy-muted)', textTransform: 'uppercase' }}>Video Title / Working Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unlocking 10x Reach"
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--aura-border-medium)',
                backgroundColor: 'var(--aura-card-solid)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--aura-navy-primary)'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--aura-navy-muted)', textTransform: 'uppercase' }}>Spoken Script / Visual Storyboard Text</label>
            <textarea
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              rows={4}
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--aura-border-medium)',
                backgroundColor: 'var(--aura-card-solid)',
                fontSize: '13.5px',
                color: 'var(--aura-navy-primary)',
                fontFamily: 'inherit',
                lineHeight: '1.5'
              }}
            />
          </div>
        </div>
      </div>

      {/* Simulation Telemetry View */}
      {telemetry && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Telemetry Tabs Navigation */}
          <div style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--aura-border-subtle)',
            paddingBottom: '12px'
          }}>
            {[
              { id: 'overview', label: '📊 Predicted KPIs & Overview' },
              { id: 'waves', label: '🌊 Instagram Algorithm Waves' },
              { id: 'reactions', label: '💬 AI Viewer Reactions & Comments' },
              { id: 'diagnostics', label: '🎯 Drop-Off Risk Diagnostics' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? 'var(--aura-navy-primary)' : 'transparent',
                  color: activeTab === tab.id ? '#FFFFFF' : 'var(--aura-navy-secondary)',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Primary Top Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                
                <div className="aura-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--aura-navy-muted)', textTransform: 'uppercase' }}>
                    Predicted Total Views
                  </span>
                  <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--aura-navy-primary)' }}>
                    {telemetry.predictedTotalViews.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>
                    Based on {telemetry.populationSizeSimulated.toLocaleString()} Simulated Viewers
                  </span>
                </div>

                <div className="aura-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--aura-navy-muted)', textTransform: 'uppercase' }}>
                    Virality Index
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 900, color: telemetry.viralityIndex >= 75 ? 'var(--aura-vermilion)' : 'var(--aura-navy-primary)' }}>
                      {telemetry.viralityIndex}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--aura-navy-muted)' }}>/ 100</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--aura-navy-secondary)' }}>
                    {telemetry.viralityIndex >= 75 ? '🔥 High Exploration Potential' : 'Moderate Algorithm Reach'}
                  </span>
                </div>

                <div className="aura-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--aura-navy-muted)', textTransform: 'uppercase' }}>
                    3s Opening Hook Retention
                  </span>
                  <span style={{ fontSize: '2.25rem', fontWeight: 900, color: telemetry.predicted3sHookRetention >= 80 ? '#10B981' : 'var(--aura-vermilion)' }}>
                    {telemetry.predicted3sHookRetention}%
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--aura-navy-muted)' }}>
                    Target: &gt;80% for viral expansion
                  </span>
                </div>

                <div className="aura-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--aura-navy-muted)', textTransform: 'uppercase' }}>
                    Predicted Watch Time
                  </span>
                  <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--aura-navy-primary)' }}>
                    {telemetry.predictedWatchTimeSec}s
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--aura-navy-muted)' }}>
                    {telemetry.predictedCompletionRate}% Completion Rate
                  </span>
                </div>

              </div>

              {/* Interactions Breakdown Bar */}
              <div className="aura-card" style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', textAlign: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--aura-navy-muted)', textTransform: 'uppercase' }}>Likes</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--aura-navy-primary)', marginTop: '4px' }}>❤️ {telemetry.predictedLikes.toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--aura-navy-muted)', textTransform: 'uppercase' }}>Comments</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--aura-navy-primary)', marginTop: '4px' }}>💬 {telemetry.predictedComments.toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--aura-navy-muted)', textTransform: 'uppercase' }}>Shares</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--aura-navy-primary)', marginTop: '4px' }}>✈️ {telemetry.predictedShares.toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--aura-navy-muted)', textTransform: 'uppercase' }}>Saves</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--aura-navy-primary)', marginTop: '4px' }}>🔖 {telemetry.predictedSaves.toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--aura-navy-muted)', textTransform: 'uppercase' }}>Followers Gained</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>➕ {telemetry.predictedFollowersGained.toLocaleString()}</div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ALGORITHM WAVES */}
          {activeTab === 'waves' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--aura-navy-primary)', margin: 0 }}>
                Simulated Instagram Reels Candidate Expansion Waves
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {telemetry.distributionWaves.map((wave) => (
                  <div
                    key={wave.waveNumber}
                    className="aura-card"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      borderLeft: wave.qualifiedForNextWave ? '4px solid #10B981' : '4px solid var(--aura-vermilion)',
                      backgroundColor: wave.qualifiedForNextWave ? 'var(--aura-card-solid)' : 'rgba(241, 58, 30, 0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--aura-navy-muted)', textTransform: 'uppercase' }}>
                        Wave {wave.waveNumber}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        color: wave.qualifiedForNextWave ? '#10B981' : 'var(--aura-vermilion)',
                        backgroundColor: wave.qualifiedForNextWave ? 'rgba(16, 185, 129, 0.1)' : 'rgba(241, 58, 30, 0.1)'
                      }}>
                        {wave.qualifiedForNextWave ? 'PASSED' : 'CAPPED'}
                      </span>
                    </div>

                    <h5 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--aura-navy-primary)', margin: 0 }}>
                      {wave.waveName}
                    </h5>

                    <div style={{ fontSize: '13px', color: 'var(--aura-navy-secondary)' }}>
                      Cohort Size: <strong>{wave.cohortSize.toLocaleString()}</strong> viewers
                    </div>

                    <div style={{ fontSize: '12.5px', color: 'var(--aura-navy-muted)', lineHeight: '1.4' }}>
                      {wave.qualificationReason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SYNTHETIC REACTIONS */}
          {activeTab === 'reactions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--aura-navy-primary)', margin: 0 }}>
                Live Synthetic Viewer Reaction Stream & Cognitive Reasoning
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {telemetry.topSyntheticReactions.map((rx, idx) => (
                  <div key={idx} className="aura-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--aura-navy-primary)' }}>
                          Synthetic Agent #{rx.viewerId}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: 'rgba(23, 50, 71, 0.08)',
                          color: 'var(--aura-navy-primary)',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          {rx.archetype}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--aura-vermilion)', textTransform: 'uppercase' }}>
                        {rx.action}
                      </span>
                    </div>

                    {rx.commentText && (
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--aura-navy-primary)', margin: 0, fontStyle: 'italic' }}>
                        "{rx.commentText}"
                      </p>
                    )}

                    <div style={{ fontSize: '12px', color: 'var(--aura-navy-muted)' }}>
                      <strong>Cognitive Rationale:</strong> {rx.psychologicalReason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DROP-OFF DIAGNOSTICS */}
          {activeTab === 'diagnostics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--aura-navy-primary)', margin: 0 }}>
                Drop-Off Diagnostics & Actionable Script Fixes
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {telemetry.dropOffAnalysis.map((diag, idx) => (
                  <div key={idx} className="aura-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--aura-vermilion)', textTransform: 'uppercase' }}>
                        Second {diag.second}.0 • {diag.causeCategory}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--aura-vermilion)' }}>
                        -{diag.dropOffRatePct}% Drop Rate
                      </span>
                    </div>

                    <p style={{ fontSize: '13.5px', color: 'var(--aura-navy-secondary)', margin: 0 }}>
                      {diag.causeDescription}
                    </p>

                    <div style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '13px',
                      color: '#065F46',
                      fontWeight: 600
                    }}>
                      💡 <strong>Recommended Pre-Publish Fix:</strong> {diag.fixRecommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
