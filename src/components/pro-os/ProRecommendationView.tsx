import React, { useState, useEffect } from 'react';

interface PipelineStage {
  stepNumber: number;
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  input: string;
  output: string;
  latency: string;
  confidence: string;
  processing: string;
  currentDecision: string;
  status: 'QUALIFIED' | 'PROCESSING' | 'PENDING';
  schema: {
    tensorShape: string;
    algorithm: string;
    threshold: string;
  };
}

export const ProRecommendationView: React.FC = () => {
  const [activeStageStep, setActiveStageStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // 9 Mandatory Sequential Pipeline Stages
  const pipelineStages: PipelineStage[] = [
    {
      stepNumber: 1,
      id: 'candidate-gen',
      name: 'Candidate Generation',
      category: 'Corpus Ingestion',
      icon: '📥',
      color: '#38BDF8',
      input: '10,000,000 Global Video Corpus',
      output: '100,000 Candidate Embeddings',
      latency: '1.2ms',
      confidence: '99.1%',
      processing: 'Multi-query vector hashing across 1024D HNSW index.',
      currentDecision: 'PASS — Filtered 99% non-relevant corpus items.',
      status: 'QUALIFIED',
      schema: {
        tensorShape: '[10M, 1024] fp16 matrix',
        algorithm: 'Faiss HNSW ANN Index',
        threshold: 'Cosine Sim >= 0.54'
      }
    },
    {
      stepNumber: 2,
      id: 'retrieval',
      name: 'Retrieval',
      category: 'Two-Tower Match',
      icon: '🔍',
      color: '#4ADE80',
      input: '100,000 Candidate Embeddings',
      output: '10,000 Two-Tower Matches',
      latency: '2.8ms',
      confidence: '97.8%',
      processing: 'Dual ScaNN Neural Retrieval (User Tower x Item Tower dot product).',
      currentDecision: 'QUALIFIED — User-Item dot product affinity score >= 0.68.',
      status: 'QUALIFIED',
      schema: {
        tensorShape: '[100K, 256] embedding vector',
        algorithm: 'Google ScaNN Two-Tower DNN',
        threshold: 'Dot Product >= 0.68'
      }
    },
    {
      stepNumber: 3,
      id: 'scoring',
      name: 'Scoring',
      category: 'Engagement Model',
      icon: '📊',
      color: '#FACC15',
      input: '10,000 Candidate Items',
      output: '10,000 Scored Candidates (0.00 - 1.00)',
      latency: '4.5ms',
      confidence: '96.4%',
      processing: 'Predicted Watch-time (pWatch) & Share Intent (pShare) weighted sum.',
      currentDecision: 'SCORE COMPUTED — Mean score 0.842 for active video.',
      status: 'QUALIFIED',
      schema: {
        tensorShape: '[10K, 4] multi-task prediction',
        algorithm: 'Multi-Task Deep & Cross Net (DCN-v2)',
        threshold: 'Score = 0.4*pWatch + 0.4*pShare + 0.2*pComment'
      }
    },
    {
      stepNumber: 4,
      id: 'filtering',
      name: 'Filtering',
      category: 'Safety & Fatigue',
      icon: '🛡️',
      color: '#F13A1E',
      input: '10,000 Scored Candidates',
      output: '2,500 Clean Candidates',
      latency: '1.1ms',
      confidence: '99.8%',
      processing: 'Duplicate removal, creator collision cap (max 2/session), & fatigue decay.',
      currentDecision: 'CLEARED — Zero community guideline violations detected.',
      status: 'QUALIFIED',
      schema: {
        tensorShape: '[2.5K] filtered array',
        algorithm: 'Bloom Filter + Fatigue Decay Mask',
        threshold: 'Creator Frequency <= 2 / 24h'
      }
    },
    {
      stepNumber: 5,
      id: 'ranking',
      name: 'Ranking',
      category: 'Heavy Reranker',
      icon: '⚡',
      color: '#A855F7',
      input: '2,500 Clean Candidates',
      output: 'Top 500 Ranked Queue',
      latency: '6.8ms',
      confidence: '95.2%',
      processing: 'Heavy Transformer Reranker with dynamic diversity penalty.',
      currentDecision: 'PROMOTED — Target video ranked #1 in candidate queue.',
      status: 'QUALIFIED',
      schema: {
        tensorShape: '[500, 1024] ranked sequence',
        algorithm: 'Transformer-based Reranker (DLRM-v2)',
        threshold: 'Rank Position <= 5'
      }
    },
    {
      stepNumber: 6,
      id: 'seed-audience',
      name: 'Seed Audience Push',
      category: 'Wave 1 Dispatch',
      icon: '🌱',
      color: '#4ADE80',
      input: 'Top 500 Ranked Queue',
      output: '1,000 Seed Viewer Push',
      latency: '120ms',
      confidence: '98.1%',
      processing: 'Real-time dispatch to 1,000 high-intent seed viewers.',
      currentDecision: 'PASSED — Seed retention rate 92.4% (>85% threshold).',
      status: 'QUALIFIED',
      schema: {
        tensorShape: '[1000] agent swarm feedback',
        algorithm: 'Seed Swarm Telemetry Collector',
        threshold: 'Seed Retention >= 85.0%'
      }
    },
    {
      stepNumber: 7,
      id: 'expansion',
      name: 'Niche Expansion',
      category: 'Wave 2 Dispatch',
      icon: '🚀',
      color: '#38BDF8',
      input: '1,000 Seed Viewers',
      output: '10,000 Niche Viewers',
      latency: '450ms',
      confidence: '96.8%',
      processing: 'Algorithmic expansion across adjacent niche clusters.',
      currentDecision: 'QUALIFIED — Niche qualification rate 84.2% (>75% threshold).',
      status: 'QUALIFIED',
      schema: {
        tensorShape: '[10K] viewer cluster graph',
        algorithm: 'GraphSAGE Neighbor Expansion',
        threshold: 'Niche Pass Rate >= 75.0%'
      }
    },
    {
      stepNumber: 8,
      id: 'mainstream',
      name: 'Mainstream Feed',
      category: 'Wave 3 Global Push',
      icon: '🌊',
      color: '#FACC15',
      input: '10,000 Niche Viewers',
      output: '100,000+ Mainstream Viewers',
      latency: '1.2s',
      confidence: '94.2%',
      processing: 'Global feed recommendation dispatch to broad audience.',
      currentDecision: 'UNLOCKED — Mainstream qualification pass rate 76.5%.',
      status: 'QUALIFIED',
      schema: {
        tensorShape: '[100K] global feed batch',
        algorithm: 'Hawkes Point-Process Broad Pusher',
        threshold: 'Completion Rate >= 60.0%'
      }
    },
    {
      stepNumber: 9,
      id: 'decay',
      name: 'Saturation & Decay',
      category: 'Lifecycle Management',
      icon: '⏳',
      color: '#64748B',
      input: '1,000,000+ Impressions',
      output: 'Fatigue Alpha 0.82',
      latency: '2.4s',
      confidence: '99.0%',
      processing: 'Viewer fatigue decay calculation & shelf-life adjustment.',
      currentDecision: 'ACTIVE DECAY — Half-life remaining: 36.4 hours.',
      status: 'QUALIFIED',
      schema: {
        tensorShape: 'Scalar decay coefficient',
        algorithm: 'Exponential Fatigue Decay Model',
        threshold: 'Alpha = e^(-lambda * t)'
      }
    }
  ];

  // Auto Step Advance Loop
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStageStep((prev) => (prev % 9) + 1);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentStage = pipelineStages.find((s) => s.stepNumber === activeStageStep) || pipelineStages[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      
      {/* ── 1. UNREAL BLUEPRINT & LINEAR HEADER CONTROL BAR ────────────────────── */}
      <div 
        style={{ 
          backgroundColor: '#0F172A', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '16px', 
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
              ⚙️ RECOMMENDATION ENGINE BLUEPRINT EXPLORER
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Active Pipeline: <span style={{ color: '#4ADE80', fontFamily: 'monospace' }}>9-STAGE SEQUENTIAL PIPELINE</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Live Algorithmic Candidate Generation & Ranking Pipeline
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            <span>Target: <strong style={{ color: '#FFFFFF' }}>Reel_Launch_v3.mp4</strong></span>
            <span>•</span>
            <span>Active Stage: <strong style={{ color: '#38BDF8' }}>#{currentStage.stepNumber} {currentStage.name}</strong></span>
            <span>•</span>
            <span>Total End-to-End Latency: <strong style={{ color: '#4ADE80' }}>22.4ms</strong></span>
          </div>
        </div>

        {/* Step Execution Player Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: isPlaying ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
              backgroundColor: isPlaying ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
              color: isPlaying ? '#10B981' : '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isPlaying ? '⏸ PAUSE EXECUTION STREAM' : '▶ PLAY PIPELINE STREAM'}
          </button>

          <button
            onClick={() => setActiveStageStep((prev) => (prev % 9) + 1)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#38BDF8',
              color: '#0F172A',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
            }}
          >
            ⏭ STEP NEXT STAGE
          </button>
        </div>
      </div>

      {/* ── 2. UNREAL BLUEPRINT EDITOR STYLE SEQUENTIAL STAGE DIAGRAM (SVG) ─────── */}
      <div 
        style={{ 
          backgroundColor: '#0B0F19', 
          border: '1px solid rgba(56, 189, 248, 0.2)', 
          borderRadius: '16px', 
          padding: '28px',
          backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflowX: 'auto',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            UNREAL BLUEPRINT GRAPH • 9-STAGE PIPELINE FLOW
          </span>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
            Click any node to inspect tensors & decision log
          </span>
        </div>

        {/* 9 Stage Nodes Sequential Flow Strip */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', minWidth: '1100px', paddingBottom: '10px' }}>
          {pipelineStages.map((stage) => {
            const isActive = stage.stepNumber === activeStageStep;
            return (
              <React.Fragment key={stage.id}>
                {/* Node Box */}
                <div
                  onClick={() => {
                    setActiveStageStep(stage.stepNumber);
                    setIsPlaying(false);
                  }}
                  style={{
                    backgroundColor: isActive ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.75)',
                    border: isActive ? `2px solid ${stage.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    width: '180px',
                    flexShrink: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: isActive ? `0 0 20px ${stage.color}40` : 'none',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  {/* Step Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 900, color: stage.color, fontFamily: 'monospace' }}>
                      STAGE 0{stage.stepNumber}
                    </span>
                    <span style={{ fontSize: '16px' }}>{stage.icon}</span>
                  </div>

                  {/* Title */}
                  <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25 }}>
                    {stage.name}
                  </div>

                  {/* Category */}
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                    {stage.category}
                  </div>

                  {/* Latency & Confidence */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#CBD5E1', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px', marginTop: '4px' }}>
                    <span>⏱ {stage.latency}</span>
                    <span style={{ color: '#4ADE80', fontWeight: 800 }}>{stage.confidence}</span>
                  </div>
                </div>

                {/* Arrow Connector (if not last) */}
                {stage.stepNumber < 9 && (
                  <div style={{ color: isActive ? stage.color : '#64748B', fontWeight: 900, fontSize: '16px', flexShrink: 0 }}>
                    →
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── 3. DEEP BLUEPRINT NODE INSPECTOR PANEL ───────────────────────────────── */}
      <div 
        style={{ 
          backgroundColor: '#0F172A', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '16px', 
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Node Inspector Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '32px' }}>{currentStage.icon}</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: currentStage.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                STAGE 0{currentStage.stepNumber} • {currentStage.category}
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                {currentStage.name} Node Inspector
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', color: '#4ADE80', backgroundColor: 'rgba(74, 222, 128, 0.15)', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '4px 10px', borderRadius: '6px', fontWeight: 800 }}>
              Confidence: {currentStage.confidence}
            </span>
            <span style={{ fontSize: '11px', color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 10px', borderRadius: '6px', fontWeight: 800 }}>
              Latency: {currentStage.latency}
            </span>
          </div>
        </div>

        {/* 6 Mandatory Display Metrics for Selected Stage */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {/* Input */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>INPUT</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'monospace' }}>{currentStage.input}</span>
          </div>

          {/* Output */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>OUTPUT</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: currentStage.color, fontFamily: 'monospace' }}>{currentStage.output}</span>
          </div>

          {/* Latency */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>LATENCY</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace' }}>{currentStage.latency}</span>
          </div>
        </div>

        {/* Processing Details */}
        <div>
          <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px 0' }}>
            ⚙️ ACTIVE ALGORITHM PROCESSING OPERATION
          </h4>
          <p style={{ fontSize: '14px', color: '#E2E8F0', margin: 0, lineHeight: '1.5', backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '14px 18px', borderRadius: '8px', borderLeft: `3px solid ${currentStage.color}` }}>
            {currentStage.processing}
          </p>
        </div>

        {/* Current Decision Logic */}
        <div>
          <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px 0' }}>
            ✅ CURRENT QUALIFICATION DECISION
          </h4>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px 16px', borderRadius: '8px', fontSize: '13.5px', color: '#FFFFFF', fontWeight: 700 }}>
            {currentStage.currentDecision}
          </div>
        </div>

        {/* Technical AST & Tensor Schema */}
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', margin: 0 }}>
            🔬 UNREAL BLUEPRINT NODE TENSOR SCHEMA
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#94A3B8' }}>Tensor Shape: </span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{currentStage.schema.tensorShape}</strong>
            </div>
            <div>
              <span style={{ color: '#94A3B8' }}>Underlying Algorithm: </span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{currentStage.schema.algorithm}</strong>
            </div>
            <div>
              <span style={{ color: '#94A3B8' }}>Pass Threshold: </span>
              <strong style={{ color: '#4ADE80', fontFamily: 'monospace' }}>{currentStage.schema.threshold}</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
