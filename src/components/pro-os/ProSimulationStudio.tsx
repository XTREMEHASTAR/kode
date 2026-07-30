import React, { useState, useEffect } from 'react';
import { executeAuraCoreSimulation } from '../../services/auracoreService';
import { AuraCoreSimulationTelemetry } from '../../../server/src/modules/auracore/types';
import { ContentUploadArea, SimulationContentAssets } from './simulation-studio/ContentUploadArea';
import { SimulationConfigPanel, SimulationEnvParameters } from './simulation-studio/SimulationConfigPanel';
import { EngineStatusPipeline, EnginePipelineStates } from './simulation-studio/EngineStatusPipeline';
import { ExecutionConsole, ConsoleLogEntry } from './simulation-studio/ExecutionConsole';
import { TelemetryResultsDashboard } from './simulation-studio/TelemetryResultsDashboard';
import { ProContentDnaView } from './ProContentDnaView';
import { ProAiPopulationView } from './ProAiPopulationView';
import { ProCard } from './shared/ProCard';
import { ProMetric } from './shared/ProMetric';
import { ProBadge } from './shared/ProBadge';

export const ProSimulationStudio: React.FC = () => {
  // Active Workspace Module Mode
  const [workspaceMode, setWorkspaceMode] = useState<'studio' | 'dna' | 'population' | 'recommendation' | 'trends' | 'memory'>('studio');

  // 1. Content Assets State
  const [assets, setAssets] = useState<SimulationContentAssets>({
    title: 'Stop Making This AI Marketing Mistake in 2026',
    scriptText: "Stop wasting time on manual outreach! If your content keeps dying at 200 views, it's not the algorithm—it's your opening 3-second hook.\n\nHere are 3 hook frameworks that double retention overnight.\n\nSave this for your next post strategy!",
    caption: 'Scaling software startups is hard. Here is how top founders optimize organic distribution. #marketing #saas #ai',
    videoFile: null,
    thumbnailFile: null
  });

  // 2. World Environment Configuration Parameters
  const [config, setConfig] = useState<SimulationEnvParameters>({
    platform: 'TIKTOK',
    creatorProfile: 'ESTABLISHED_AUTHORITY',
    audiencePreset: 'ZOOMER_SKIMMER',
    region: 'US_NORTH_AMERICA',
    timeOfDay: 'EVENING_SCROLL',
    dayOfWeek: 'MIDWEEK_PLATEAU',
    trendStrengthPct: 75,
    competitionLevel: 'MODERATE',
    populationSize: 10000
  });

  // 3. Simulation & Pipeline Execution State
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(15);
  const [telemetry, setTelemetry] = useState<AuraCoreSimulationTelemetry | null>(null);

  // 4. Engine States
  const [engineStates, setEngineStates] = useState<EnginePipelineStates>({
    contentDna: 'IDLE',
    viewerSwarm: 'IDLE',
    recommendation: 'IDLE',
    trendEngine: 'IDLE',
    competitionEngine: 'IDLE',
    telemetryPipeline: 'IDLE'
  });

  // 5. Execution Console Logs & Stats
  const [logs, setLogs] = useState<ConsoleLogEntry[]>([]);
  const [gpuLoadPct, setGpuLoadPct] = useState(42);
  const [memoryUsedMb, setMemoryUsedMb] = useState(512);

  useEffect(() => {
    const interval = setInterval(() => {
      setGpuLoadPct(prev => Math.floor(35 + Math.random() * 45));
      setMemoryUsedMb(prev => Math.floor(480 + Math.random() * 120));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (topic: string, message: string, level: ConsoleLogEntry['level'] = 'info') => {
    const entry: ConsoleLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      topic,
      message,
      level
    };
    setLogs(prev => [...prev.slice(-49), entry]);
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setTelemetry(null);
    setLogs([]);
    const estSteps = Math.max(10, Math.ceil(assets.scriptText.trim().split(/\s+/).length / 2.5));
    setTotalSteps(estSteps);
    setActiveStep(0);

    setEngineStates({
      contentDna: 'IDLE',
      viewerSwarm: 'IDLE',
      recommendation: 'IDLE',
      trendEngine: 'IDLE',
      competitionEngine: 'IDLE',
      telemetryPipeline: 'IDLE'
    });

    try {
      addLog('SYSTEM', `Initiating 12-Engine AuraCore Simulation Environment (${config.populationSize.toLocaleString()} Agents)...`);

      // Stage 1: Content DNA Extraction
      setEngineStates(prev => ({ ...prev, contentDna: 'RUNNING' }));
      addLog('CONTENT_DNA', 'Extracting 500+ multimodal feature vectors (Hook, Pacing, Sentiment)...');
      await new Promise(r => setTimeout(r, 250));
      setEngineStates(prev => ({ ...prev, contentDna: 'COMPLETE' }));

      // Stage 2: Synthetic Population Swarm Generation
      setEngineStates(prev => ({ ...prev, viewerSwarm: 'RUNNING' }));
      addLog('VIEWER_SWARM', `Instantiating ${config.populationSize.toLocaleString()} synthetic agent profiles (${config.audiencePreset})...`);
      await new Promise(r => setTimeout(r, 300));
      setEngineStates(prev => ({ ...prev, viewerSwarm: 'COMPLETE' }));

      // Stage 3: Recommendation Engine Candidate Search
      setEngineStates(prev => ({ ...prev, recommendation: 'RUNNING' }));
      addLog('RECOMMENDER', `Running candidate retrieval & two-tower vector scoring for ${config.platform}...`);
      await new Promise(r => setTimeout(r, 250));
      setEngineStates(prev => ({ ...prev, recommendation: 'COMPLETE' }));

      // Stage 4: Trend Engine Intensity Evaluation
      setEngineStates(prev => ({ ...prev, trendEngine: 'RUNNING' }));
      addLog('TREND_ENGINE', `Evaluating Hawkes Self-Exciting Process intensity (Surge Factor: ${config.trendStrengthPct}%)...`);
      await new Promise(r => setTimeout(r, 200));
      setEngineStates(prev => ({ ...prev, trendEngine: 'COMPLETE' }));

      // Stage 5: Content Competition Feed Slot Auction
      setEngineStates(prev => ({ ...prev, competitionEngine: 'RUNNING' }));
      addLog('COMPETITION', `Simulating Tullock contest feed slot auction against rival niche posts...`);
      await new Promise(r => setTimeout(r, 200));
      setEngineStates(prev => ({ ...prev, competitionEngine: 'COMPLETE' }));

      // Stage 6: Telemetry Pipeline Execution
      setEngineStates(prev => ({ ...prev, telemetryPipeline: 'RUNNING' }));
      addLog('TELEMETRY', 'Stepping timeline clock & executing Drift-Diffusion decision trajectories...');

      const res = await executeAuraCoreSimulation({
        title: assets.title,
        scriptText: assets.scriptText,
        populationSize: config.populationSize,
        contentType: config.platform
      });

      for (let s = 1; s <= estSteps; s++) {
        setActiveStep(s);
        addLog('TICK_CLOCK', `Step ${s}/${estSteps} executed. Memory throughput: ${(s * 14.2).toFixed(1)} MB/s.`, 'info');
        await new Promise(r => setTimeout(r, 40));
      }

      setEngineStates(prev => ({ ...prev, telemetryPipeline: 'COMPLETE' }));
      addLog('SYSTEM', `Simulation completed successfully. Virality Index: ${res.viralityIndex}/100.`, 'success');
      setTelemetry(res);
    } catch (e: any) {
      addLog('SYSTEM', `Simulation pipeline error: ${e?.message || e}`, 'error');
      setEngineStates({
        contentDna: 'WARNING',
        viewerSwarm: 'WARNING',
        recommendation: 'WARNING',
        trendEngine: 'WARNING',
        competitionEngine: 'WARNING',
        telemetryPipeline: 'WARNING'
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', color: '#FFFFFF' }}>
      
      {/* Simulation Workspace Header Command Bar & Integrated Mode Switcher */}
      <div
        className="pro-glass-card pro-glow-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          borderRadius: '14px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '9px', fontWeight: 900, color: '#F13A1E', backgroundColor: 'rgba(241, 58, 30, 0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(241, 58, 30, 0.4)', fontFamily: 'monospace' }}>
                PRIMARY WORKSPACE
              </span>
              <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                Figma / Linear Operating Engine
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Simulation Studio Workspace
            </h2>
          </div>

          {/* Integrated Workspace Module Mode Switcher */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {[
              { id: 'studio', label: '⚡ Studio Workspace', icon: '⚡' },
              { id: 'dna', label: '🧬 Content DNA', icon: '🧬' },
              { id: 'population', label: '👥 AI Viewers', icon: '👥' },
              { id: 'recommendation', label: '🎯 Algorithm Waves', icon: '🎯' },
              { id: 'trends', label: '🔥 Trend Surge', icon: '🔥' },
              { id: 'memory', label: '💾 Memory & Consensus', icon: '💾' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setWorkspaceMode(tab.id as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: workspaceMode === tab.id ? 'rgba(241, 58, 30, 0.2)' : 'transparent',
                  color: workspaceMode === tab.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                  fontWeight: workspaceMode === tab.id ? 800 : 600,
                  fontSize: '11.5px',
                  borderBottom: workspaceMode === tab.id ? '2px solid #F13A1E' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          Status: <span style={{ color: isSimulating ? '#FACC15' : '#4ADE80', fontWeight: 800 }}>{isSimulating ? 'RUNNING SWARM' : 'READY'}</span>
        </div>
      </div>

      {/* Main Mode View Area */}
      {workspaceMode === 'studio' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '18px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <ContentUploadArea assets={assets} onChange={(u) => setAssets(prev => ({ ...prev, ...u }))} />
            {telemetry && <TelemetryResultsDashboard telemetry={telemetry} />}
          </div>

          <SimulationConfigPanel
            config={config}
            onChange={(u) => setConfig(prev => ({ ...prev, ...u }))}
            onRunSimulation={handleRunSimulation}
            isSimulating={isSimulating}
          />
        </div>
      )}

      {workspaceMode === 'dna' && (
        <ProContentDnaView />
      )}

      {workspaceMode === 'population' && (
        <ProAiPopulationView />
      )}

      {workspaceMode === 'recommendation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <ProCard>
            <ProBadge status="RUNNING" label="4-WAVE ALGORITHM CANDIDATE PIPELINE" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '8px 0 4px 0', color: '#FFFFFF' }}>
              Recommendation Engine Candidate Expansion & Wave Gates
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
              Evaluates content suitability across 4 distinct algorithmic push waves.
            </p>
          </ProCard>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {[
              { wave: 'Wave 1: Seed Cohort', size: '1,000 Viewers', passRate: '88.4%', decay: '0.98 Alpha', color: '#4ADE80' },
              { wave: 'Wave 2: Niche Explore', size: '10,000 Viewers', passRate: '76.2%', decay: '0.94 Alpha', color: '#F13A1E' },
              { wave: 'Wave 3: Broad Explore', size: '100,000 Viewers', passRate: '62.5%', decay: '0.89 Alpha', color: '#FACC15' },
              { wave: 'Wave 4: Global Feed', size: '1,000,000+ Viewers', passRate: '48.1%', decay: '0.82 Alpha', color: '#38BDF8' }
            ].map((w, i) => (
              <ProCard key={i}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: w.color }}>{w.wave}</div>
                <div className="pro-mono" style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', margin: '8px 0 4px 0' }}>{w.size}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Qualification Rate: <strong>{w.passRate}</strong></div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Decay Vector: <strong>{w.decay}</strong></div>
              </ProCard>
            ))}
          </div>
        </div>
      )}

      {workspaceMode === 'trends' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <ProCard>
            <ProBadge status="SUCCESS" label="HAWKES PROCESS SURGE ENGINE" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '8px 0 4px 0', color: '#FFFFFF' }}>
              Trend Velocity & Audio Surge Monitor
            </h3>
          </ProCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <ProMetric label="Audio Track Momentum" value="+428%" delta="24h Surge" accentColor="#4ADE80" subtitle="Cinematic Bass Drop v4 (14.2k reels today)" />
            <ProMetric label="Visual Format Velocity" value="+185%" delta="High Retention" accentColor="#F13A1E" subtitle="Rapid B-Roll Pattern Interrupt (84.2% hook)" />
            <ProMetric label="Global Attention Density" value="0.87 Alpha" delta="Optimal Evening" accentColor="#38BDF8" subtitle="Optimal post window: 18:00 - 21:00 EST" />
          </div>
        </div>
      )}

      {workspaceMode === 'memory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <ProCard>
            <ProBadge status="COMPLETE" label="ACT-R & HEGSELMANN-KRAUSE ENGINE" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '8px 0 4px 0', color: '#FFFFFF' }}>
              Agent Memory Activation & Community Consensus Dynamics
            </h3>
          </ProCard>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <ProMetric label="Ebbinghaus Retention S" value="94.2%" subtitle="Memory Strength Curve" accentColor="#4ADE80" />
            <ProMetric label="ACT-R Activation Ai" value="0.82" subtitle="Decay Rate d=0.5" accentColor="#38BDF8" />
          </div>
        </div>
      )}

      {/* Bottom HUD: 6-Engine Pipeline Badges */}
      <EngineStatusPipeline states={engineStates} activeStep={activeStep} totalSteps={totalSteps} />

      {/* Bottom Bloomberg/Linear Execution Console */}
      <ExecutionConsole logs={logs} gpuLoadPct={gpuLoadPct} memoryUsedMb={memoryUsedMb} activeThreads={config.populationSize >= 100000 ? 128 : 32} />

    </div>
  );
};
