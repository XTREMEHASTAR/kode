import React, { useState } from 'react';

// Interfaces for 13 DNA Sections
interface DnaSectionDetail {
  id: string;
  name: string;
  category: string;
  score: number;
  confidence: number;
  icon: string;
  explanation: string;
  technicalAnalysis: {
    astFeatures: string[];
    tensorShape: string;
    modelVariance: string;
    mathFormula: string;
  };
  suggestions: string[];
}

export const ProContentDnaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('hook');
  const [expandedTech, setExpandedTech] = useState<boolean>(false);
  const [currentTimecode, setCurrentTimecode] = useState<number>(1.2); // seconds into video

  // 13 Mandatory DNA Sections Data
  const dnaSections: Record<string, DnaSectionDetail> = {
    hook: {
      id: 'hook',
      name: 'Hook DNA',
      category: 'Tension & Retention',
      score: 94,
      confidence: 98.4,
      icon: '🪝',
      explanation: 'The opening 3 seconds exhibit high optical motion velocity combined with an aggressive pattern interrupt word choice ("Stop wasting your..."), arresting viewer scroll impulse instantly.',
      technicalAnalysis: {
        astFeatures: ['OpticalFlowVelocity: 8.42m/s', 'WordEntropy: 4.92 bits', 'FacialGazeTension: 0.94', 'VisualSurpriseDelta: +48.2%'],
        tensorShape: '[1, 90, 1024] float32 tensor',
        modelVariance: '±0.62% @ 99% CI (ResNet-3D + AudioSpectrogramTransformer)',
        mathFormula: 'H_{hook} = \\int_{0}^{3.0} (V_{opt}(t) \\cdot W_{surprise}(t)) dt'
      },
      suggestions: [
        'Maintain high contrast text overlay during the 0.0s-1.2s window.',
        'Increase initial audio attack transient by +2dB at 0.1s to maximize shock value.'
      ]
    },
    visual: {
      id: 'visual',
      name: 'Visual DNA',
      category: 'Optics & Aesthetics',
      score: 89,
      confidence: 96.1,
      icon: '👁️',
      explanation: 'High color entropy across dominant keyframes (HSL 210° vs 24°) with zero motion blur artifacts during key subject cuts.',
      technicalAnalysis: {
        astFeatures: ['ColorEntropy: 0.812', 'ShotDurationMean: 1.84s', 'DynamicRangeRatio: 14.2 EV', 'FocalShiftVelocity: 3.1 px/frame'],
        tensorShape: '[1, 1024, 768] uint8 spatial matrix',
        modelVariance: '±0.85% @ 95% CI (CLIP-ViT-L/14 + OpenCV)',
        mathFormula: 'V_{dna} = \\sum_{i=1}^{N} S_{entropy}(F_i) \\cdot \\gamma_{lighting}'
      },
      suggestions: [
        'Apply color grading lock on scene transitions at 12.4s to prevent tint shift.',
        'Add motion blur compensation on rapid pan transitions at 18.2s.'
      ]
    },
    audio: {
      id: 'audio',
      name: 'Audio DNA',
      category: 'Acoustics & Frequency',
      score: 82,
      confidence: 95.8,
      icon: '🔊',
      explanation: 'Speech-to-music energy ratio is optimal at 0.84, with dynamic ducking suppressing backing music whenever vocal formants exceed 1.2kHz.',
      technicalAnalysis: {
        astFeatures: ['SpectralCentroid: 2450Hz', 'BPMVariance: 1.2%', 'DynamicDuckingDepth: -14.2dB', 'LUFSIntegrated: -13.8 LUFS'],
        tensorShape: '[2, 44100, 45] float32 audio stream',
        modelVariance: '±0.45% @ 99% CI (Whisper-v3 + Essentia DSP)',
        mathFormula: 'A_{dna} = \\frac{E_{vocal}(f)}{E_{vocal}(f) + E_{music}(f)} \\times (1 - D_{ducking})'
      },
      suggestions: [
        'Boost vocal warmth EQ at 250Hz by +1.5dB for deeper authority perception.',
        'Smooth out music fade-in transition between 14.0s and 15.5s.'
      ]
    },
    narrative: {
      id: 'narrative',
      name: 'Narrative DNA',
      category: 'Structure & Story',
      score: 91,
      confidence: 97.2,
      icon: '📜',
      explanation: 'Clear 5-act narrative curve: Hook (0s) -> Conflict Setup (4s) -> Rising Tension (12s) -> Climax (28s) -> Resolution & CTA (38s).',
      technicalAnalysis: {
        astFeatures: ['AsymmetryIndex: 0.89', 'PayoffDelta: +64%', 'SemanticCoherence: 0.93', 'ActTransitionPacing: 4.2s interval'],
        tensorShape: '[1, 5, 512] semantic story embedding',
        modelVariance: '±0.78% @ 98% CI (GPT-4o AST + Llama-3-70B)',
        mathFormula: 'N_{dna} = \\max(T_{tension}) - \\min(T_{baseline}) \\times \\text{Coherence}'
      },
      suggestions: [
        'Shorten the transition between Rising Tension and Climax by 1.5s to keep momentum.',
        'Inject a secondary curiosity micro-hook at 22.0s.'
      ]
    },
    emotion: {
      id: 'emotion',
      name: 'Emotion DNA',
      category: 'Affection & Sentiment',
      score: 87,
      confidence: 94.6,
      icon: '❤️',
      explanation: 'Sentiment surge reaches a peak at 75% video mark, transitioning from initial skepticism to triumphant resolution.',
      technicalAnalysis: {
        astFeatures: ['ValenceTrajectory: -0.4 -> +0.82', 'ArousalPeak: 0.91 @ 32.5s', 'MicroExpressionDensity: 4.2/sec'],
        tensorShape: '[1, 100, 2] valence-arousal manifold',
        modelVariance: '±1.12% @ 95% CI (DeepFace-v4 + AffectNet)',
        mathFormula: 'E(t) = \\sqrt{\\text{Valence}(t)^2 + \\text{Arousal}(t)^2}'
      },
      suggestions: [
        'Amplify facial expression lighting during the emotional reveal at 31.0s.',
        'Use minor key musical shift right before the resolution.'
      ]
    },
    curiosity: {
      id: 'curiosity',
      name: 'Curiosity Gap',
      category: 'Cognitive Drive',
      score: 95,
      confidence: 99.1,
      icon: '🧠',
      explanation: 'High information asymmetry established in opening sentence ("Why 99% of creators fail this simple test"), triggering dopamine-driven completion intent.',
      technicalAnalysis: {
        astFeatures: ['InformationAsymmetry: 0.96', 'OpenLoopCount: 3', 'CognitiveDissonanceScore: 0.88'],
        tensorShape: '[1, 3, 256] cognitive gap vector',
        modelVariance: '±0.38% @ 99% CI (Aura-Curiosity-Engine-v2)',
        mathFormula: 'C_{gap} = I_{\\text{perceived}} - I_{\\text{revealed}}'
      },
      suggestions: [
        'Delay the reveal of loop #2 by 3 seconds to stretch retention curve peak.',
        'Use visual teaser text at 18.0s.'
      ]
    },
    rhythm: {
      id: 'rhythm',
      name: 'Editing Rhythm',
      category: 'Temporal Pacing',
      score: 86,
      confidence: 93.9,
      icon: '⚡',
      explanation: 'Dynamic cut cadence averaging 1.84s per shot, syncing perfectly with backing track transient peaks every 4 beats.',
      technicalAnalysis: {
        astFeatures: ['BeatSyncAccuracy: 98.4%', 'ShotEntropy: 0.74', 'CutFrequency: 0.54 cuts/sec'],
        tensorShape: '[1, 45, 128] shot duration vector',
        modelVariance: '±0.94% @ 95% CI (PySceneDetect + BeatNet)',
        mathFormula: 'R_{rhythm} = 1 - \\text{StdDev}(\\text{ShotLengths}) / \\text{Mean}(\\text{ShotLengths})'
      },
      suggestions: [
        'Speed up cuts during the 15s-20s section by 20% to build urgency.',
        'Add J-cut audio lead 0.3s before the scene transition at 24s.'
      ]
    },
    pacing: {
      id: 'pacing',
      name: 'Speech Pacing',
      category: 'Temporal Pacing',
      score: 90,
      confidence: 97.8,
      icon: '⏱️',
      explanation: 'Speech rate averages 3.84 syllables/sec with micro-rests (0.4s) strategically placed before key value drops.',
      technicalAnalysis: {
        astFeatures: ['SyllablesPerSec: 3.84', 'PauseRatio: 12.4%', 'ArticulationRate: 4.22 syl/sec'],
        tensorShape: '[1, 120, 64] prosody vector',
        modelVariance: '±0.51% @ 99% CI (Parselmouth + Praat)',
        mathFormula: 'P_{speed} = \\frac{N_{\\text{syllables}}}{T_{\\text{speech}}}'
      },
      suggestions: [
        'Extend pause after the key stat at 11.2s to let information sink in.',
        'Reduce filler word pauses at 27.4s.'
      ]
    },
    motion: {
      id: 'motion',
      name: 'Motion Energy',
      category: 'Optics & Aesthetics',
      score: 88,
      confidence: 95.2,
      icon: '🏃',
      explanation: 'High dynamic range of motion vectors (0.4m/s to 9.2m/s), maintaining visual stimulation without triggering disorienting optical fatigue.',
      technicalAnalysis: {
        astFeatures: ['FarnebackFlowMagnitude: 5.82', 'CameraTurbulence: 0.12', 'FocalDepthShift: 2.1 shifts/min'],
        tensorShape: '[1, 30, 4] motion vector tensor',
        modelVariance: '±0.72% @ 95% CI (RAFT Optical Flow)',
        mathFormula: 'M_{energy} = \\iint ||\\vec{u}(x,y,t)|| dx dy dt'
      },
      suggestions: [
        'Stabilize micro camera jitter between 8.0s and 9.5s.',
        'Add subtle zoom-in push during the climax statement.'
      ]
    },
    cta: {
      id: 'cta',
      name: 'CTA Strength',
      category: 'Conversion & Action',
      score: 93,
      confidence: 98.7,
      icon: '🎯',
      explanation: 'End-scene CTA presents a zero-friction action prompt ("Save this checklist for your next launch") paired with visual screen pointer UI.',
      technicalAnalysis: {
        astFeatures: ['FrictionIndex: 0.08', 'ConversionIntentScore: 0.94', 'GraphicPointerPresence: True'],
        tensorShape: '[1, 15, 128] cta vector',
        modelVariance: '±0.41% @ 99% CI (Aura-CTA-Classifier-v3)',
        mathFormula: 'CTA_{\\text{strength}} = \\frac{\\text{Clarity} \\times \\text{Relevance}}{\\text{Friction} + 0.1}'
      },
      suggestions: [
        'Display save icon visual overlay 1.0s before verbal CTA prompt.',
        'Keep CTA duration at exact 4.0s to avoid drop-off tail.'
      ]
    },
    music: {
      id: 'music',
      name: 'Music Analysis',
      category: 'Acoustics & Frequency',
      score: 85,
      confidence: 96.4,
      icon: '🎵',
      explanation: 'Cinematic synth-wave track aligns 94% with modern tech-business creator persona, with harmonic key shift matching the resolution.',
      technicalAnalysis: {
        astFeatures: ['KeySignature: A-Minor -> C-Major', 'ResonanceScore: 0.91', 'DuckingDepth: -12.4dB'],
        tensorShape: '[1, 1024, 12] chromagram matrix',
        modelVariance: '±0.68% @ 98% CI (Librosa + Spotipy API)',
        mathFormula: 'M_{align} = \\text{CosineSimilarity}(V_{\\text{music}}, V_{\\text{brand}})'
      },
      suggestions: [
        'Increase sub-bass kick at 28.0s climax by +2dB.',
        'Fade out music tail cleanly 0.5s before final frame.'
      ]
    },
    brand: {
      id: 'brand',
      name: 'Brand Voice Fit',
      category: 'Identity & Resonance',
      score: 92,
      confidence: 97.9,
      icon: '🏷️',
      explanation: 'Tone exhibits high authority-to-warmth ratio (70:30), adhering 96% to your configured creator persona guidelines.',
      technicalAnalysis: {
        astFeatures: ['VocabularyArchetypeFit: 0.95', 'AuthorityVector: 0.72', 'WarmthVector: 0.28'],
        tensorShape: '[1, 768] BERT brand embedding',
        modelVariance: '±0.52% @ 99% CI (Custom Fine-tuned DeBERTa-v3)',
        mathFormula: 'B_{fit} = \\cos(\\theta_{content}, \\theta_{brand\\_archetype})'
      },
      suggestions: [
        'Maintain direct eye contact with lens during intro.',
        'Use consistent brand hex color (#F13A1E) for lower-third graphics.'
      ]
    },
    audience: {
      id: 'audience',
      name: 'Audience Match',
      category: 'Identity & Resonance',
      score: 96,
      confidence: 99.4,
      icon: '📈',
      explanation: 'Content DNA matches 96.4% with Tech-Savvy Founders & Digital Creators (Aura Audience Cluster #04).',
      technicalAnalysis: {
        astFeatures: ['DemographicResonance: 0.964', 'ViralSpreadCoeff: 1.42', 'ShareIntentProbability: 78.4%'],
        tensorShape: '[1, 50, 1000] audience graph node embedding',
        modelVariance: '±0.29% @ 99.5% CI (GraphSAGE + LightGCN)',
        mathFormula: 'A_{match} = P(\\text{Share} | \\text{Cluster}_{04}) \\times R_{\\text{retention}}'
      },
      suggestions: [
        'Cross-post on LinkedIn with short-form native video snippet.',
        'Pin commentary question regarding creator workflow tools.'
      ]
    }
  };

  const currentSection = dnaSections[selectedSectionId] || dnaSections.hook;

  // Radar Chart coordinates mapping (8 axes)
  const radarDimensions = [
    { label: 'Hook', score: 94 },
    { label: 'Visual', score: 89 },
    { label: 'Audio', score: 82 },
    { label: 'Curiosity', score: 95 },
    { label: 'Emotion', score: 87 },
    { label: 'Pacing', score: 90 },
    { label: 'Narrative', score: 91 },
    { label: 'CTA', score: 93 }
  ];

  // Helper to generate SVG radar polygon points
  const getRadarPoints = (dimList: { score: number }[], scale = 1) => {
    const total = dimList.length;
    const center = 120;
    const maxRadius = 90 * scale;

    return dimList.map((d, i) => {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const r = (d.score / 100) * maxRadius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  // Frame-by-frame hook cards (0.0s to 3.0s)
  const hookFrames = [
    { time: '0.0s - 0.5s', score: 96, label: 'Pattern Interrupt', detail: 'High optical motion + bold text overlay', status: 'CRITICAL HOOK' },
    { time: '0.5s - 1.2s', score: 92, label: 'Face Tension Peak', detail: 'Direct eye gaze + 1.4kHz vocal transient', status: 'ENGAGED' },
    { time: '1.2s - 2.0s', score: 95, label: 'Curiosity Lock', detail: 'Information gap statement introduced', status: 'LOCKED' },
    { time: '2.0s - 3.0s', score: 93, label: 'Payload Transition', detail: 'Smooth cut to main story demonstration', status: 'RETAINED' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      
      {/* ── 1. MRI SCAN HEADER & METADATA BAR ────────────────────────────────────── */}
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
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#F13A1E', backgroundColor: 'rgba(241, 58, 30, 0.15)', border: '1px solid rgba(241, 58, 30, 0.3)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
              🔬 MULTIMODAL CONTENT MRI SCAN
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Fingerprint Vector: <span style={{ color: '#38BDF8', fontFamily: 'monospace' }}>1024D-VEC-9982</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Reel_Launch_v3.mp4 Structural Deconstruction
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            <span>Duration: <strong style={{ color: '#FFFFFF' }}>45.2s</strong></span>
            <span>•</span>
            <span>FPS: <strong style={{ color: '#FFFFFF' }}>60 fps</strong></span>
            <span>•</span>
            <span>Resolution: <strong style={{ color: '#FFFFFF' }}>1080x1920 (9:16)</strong></span>
            <span>•</span>
            <span>Confidence: <strong style={{ color: '#10B981' }}>98.4% (±0.62%)</strong></span>
          </div>
        </div>

        {/* DNA Index Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              DNA Virality Score
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4ADE80', fontFamily: 'monospace', lineHeight: 1 }}>
                94.2
              </span>
              <span style={{ fontSize: '1rem', color: '#94A3B8', fontWeight: 700 }}>/100</span>
            </div>
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>
              Top 2% Virality Percentile
            </span>
          </div>

          <div 
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              border: '3px solid #10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
            }}
          >
            🧬
          </div>
        </div>
      </div>

      {/* ── 2. VISUALIZATION GRID (DNA Radar + Frame Breakdown + Emotion Graph) ──────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        
        {/* DNA Radar Chart (8-Axis SVG) */}
        <div 
          style={{ 
            backgroundColor: '#0F172A', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: '16px', 
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              DNA Radar Topology
            </span>
            <span style={{ fontSize: '10px', color: '#38BDF8', fontWeight: 700, backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
              8-AXIS MANIFOLD
            </span>
          </div>

          <svg width="240" height="240" viewBox="0 0 240 240" style={{ overflow: 'visible' }}>
            {/* Background Radar Rings */}
            <circle cx="120" cy="120" r="90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <circle cx="120" cy="120" r="67.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <circle cx="120" cy="120" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <circle cx="120" cy="120" r="22.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            {/* Radar Spoke Axes */}
            {radarDimensions.map((d, i) => {
              const angle = (Math.PI * 2 / radarDimensions.length) * i - Math.PI / 2;
              const x2 = 120 + 90 * Math.cos(angle);
              const y2 = 120 + 90 * Math.sin(angle);
              const labelX = 120 + 108 * Math.cos(angle);
              const labelY = 120 + 108 * Math.sin(angle);

              return (
                <g key={i}>
                  <line x1="120" y1="120" x2={x2} y2={y2} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <text 
                    x={labelX} 
                    y={labelY + 4} 
                    fill="#94A3B8" 
                    fontSize="9.5" 
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}

            {/* Filled Polygon for DNA Profile */}
            <polygon 
              points={getRadarPoints(radarDimensions)} 
              fill="rgba(241, 58, 30, 0.35)" 
              stroke="#F13A1E" 
              strokeWidth="2.5" 
            />

            {/* Point Markers */}
            {radarDimensions.map((d, i) => {
              const angle = (Math.PI * 2 / radarDimensions.length) * i - Math.PI / 2;
              const r = (d.score / 100) * 90;
              const x = 120 + r * Math.cos(angle);
              const y = 120 + r * Math.sin(angle);
              return <circle key={i} cx={x} cy={y} r="4" fill="#FFFFFF" stroke="#F13A1E" strokeWidth="2" />;
            })}
          </svg>

          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '11px', color: '#94A3B8' }}>
            Balanced high-retention topology across all 8 vectors
          </div>
        </div>

        {/* Frame-by-Frame Hook Deconstruction (0.0s - 3.0s) */}
        <div 
          style={{ 
            backgroundColor: '#0F172A', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: '16px', 
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Frame-by-Frame Hook Deconstruction
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                Opening 3.0-Second Attention Window
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 700, backgroundColor: 'rgba(74, 222, 128, 0.12)', padding: '4px 10px', borderRadius: '6px' }}>
                Hook Retention Rate: 94.8%
              </span>
            </div>
          </div>

          {/* Frame Cards Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {hookFrames.map((f, idx) => (
              <div 
                key={idx}
                style={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '10px', 
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#38BDF8', fontFamily: 'monospace' }}>
                    {f.time}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#4ADE80', fontFamily: 'monospace' }}>
                    {f.score}
                  </span>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>
                  {f.label}
                </div>

                <div style={{ fontSize: '10.5px', color: '#94A3B8', lineHeight: 1.35 }}>
                  {f.detail}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 900, color: '#F13A1E', backgroundColor: 'rgba(241, 58, 30, 0.15)', padding: '2px 6px', borderRadius: '3px' }}>
                    {f.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Heatmap & Scrubber Track */}
          <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>
              <span>Timeline Multi-Track Heatmap (0.0s – 45.2s)</span>
              <span>Scrubbed Position: <strong style={{ color: '#38BDF8', fontFamily: 'monospace' }}>{currentTimecode.toFixed(1)}s</strong></span>
            </div>

            <div 
              style={{ 
                height: '36px', 
                backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                borderRadius: '8px', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center'
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                setCurrentTimecode(ratio * 45.2);
              }}
            >
              {/* Heatmap background bars */}
              {Array.from({ length: 45 }).map((_, i) => {
                const intensity = Math.sin((i / 45) * Math.PI) * 0.8 + 0.2;
                return (
                  <div 
                    key={i} 
                    style={{ 
                      flex: 1, 
                      height: '100%', 
                      backgroundColor: i < 5 ? '#F13A1E' : (i > 30 && i < 36 ? '#38BDF8' : '#10B981'),
                      opacity: intensity,
                      marginRight: '1px'
                    }} 
                  />
                );
              })}

              {/* Scrubber line */}
              <div 
                style={{ 
                  position: 'absolute', 
                  left: `${(currentTimecode / 45.2) * 100}%`, 
                  top: 0, 
                  bottom: 0, 
                  width: '3px', 
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 0 10px #FFFFFF',
                  zIndex: 5
                }} 
              />
            </div>
          </div>
        </div>

      </div>

      {/* ── 3. EMOTIONAL CURVE & ATTENTION DECAY GRAPHS ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Emotional Curve & Narrative Story Arc */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Emotional Valence vs Arousal Trajectory
            </span>
            <span style={{ fontSize: '11px', color: '#F13A1E', fontWeight: 700 }}>
              Peak Arousal at 32.5s (Climax)
            </span>
          </div>

          <svg width="100%" height="160" viewBox="0 0 400 160" style={{ overflow: 'visible' }}>
            {/* Grid Lines */}
            <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(255,255,255,0.05)" />
            <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(255,255,255,0.05)" />

            {/* Valence Line (Green) */}
            <path 
              d="M 0 110 Q 50 130, 100 80 T 200 60 T 300 30 T 400 45" 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="2.5" 
            />

            {/* Arousal Line (Red) */}
            <path 
              d="M 0 50 Q 60 20, 120 70 T 240 50 T 330 20 T 400 70" 
              fill="none" 
              stroke="#F13A1E" 
              strokeWidth="2.5" 
            />

            {/* Act Markers */}
            <text x="20" y="150" fill="#94A3B8" fontSize="9" fontWeight="700">ACT I: HOOK</text>
            <text x="120" y="150" fill="#94A3B8" fontSize="9" fontWeight="700">ACT II: CONFLICT</text>
            <text x="260" y="150" fill="#94A3B8" fontSize="9" fontWeight="700">ACT III: CLIMAX</text>
            <text x="350" y="150" fill="#94A3B8" fontSize="9" fontWeight="700">CTA</text>
          </svg>

          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%' }}></span> Emotional Valence
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#F13A1E', borderRadius: '50%' }}></span> Emotional Arousal
            </span>
          </div>
        </div>

        {/* Attention Decay Graph */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Predicted Viewer Retention Decay
            </span>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>
              +22.4% Retention vs Benchmark
            </span>
          </div>

          <svg width="100%" height="160" viewBox="0 0 400 160" style={{ overflow: 'visible' }}>
            {/* Industry Benchmark Curve (Dashed Grey) */}
            <path 
              d="M 0 20 C 50 80, 150 110, 400 130" 
              fill="none" 
              stroke="#64748B" 
              strokeWidth="2" 
              strokeDasharray="4 4" 
            />

            {/* Aura Model Predicted Retention Curve (Cyan) */}
            <path 
              d="M 0 20 C 60 30, 180 40, 300 45 L 400 65" 
              fill="none" 
              stroke="#38BDF8" 
              strokeWidth="3" 
            />

            {/* Benchmark Legend */}
            <text x="280" y="120" fill="#64748B" fontSize="9" fontWeight="700">Niche Avg Benchmark</text>
            <text x="260" y="38" fill="#38BDF8" fontSize="9" fontWeight="800">Aura Predicted Retention</text>
          </svg>

          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
            Predicted completion rate: <strong style={{ color: '#FFFFFF' }}>78.4%</strong> at 45.2s duration mark.
          </div>
        </div>

      </div>

      {/* ── 4. 13 MANDATORY DNA INTELLIGENCE SECTIONS INTERACTIVE INSPECTOR ─────── */}
      <div 
        style={{ 
          backgroundColor: '#0F172A', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '16px', 
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
              13-SECTION DECONSTRUCTION MANIFOLD
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '4px 0 0 0', color: '#FFFFFF' }}>
              Deep Multimodal DNA Feature Inspector
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'Tension & Retention', 'Optics & Aesthetics', 'Acoustics & Frequency', 'Structure & Story', 'Conversion & Action'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: activeTab === cat ? '1px solid #F13A1E' : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: activeTab === cat ? 'rgba(241, 58, 30, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: activeTab === cat ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 13 DNA Section Selector Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {Object.values(dnaSections)
            .filter(sec => activeTab === 'all' || sec.category === activeTab)
            .map((sec) => {
              const isSelected = selectedSectionId === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(241, 58, 30, 0.12)' : 'rgba(15, 23, 42, 0.8)',
                    border: isSelected ? '2px solid #F13A1E' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px' }}>{sec.icon}</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: sec.score >= 88 ? '#10B981' : '#F13A1E', fontFamily: 'monospace' }}>
                      {sec.score}
                    </span>
                  </div>
                  
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                    {sec.name}
                  </span>
                  
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                    Confidence: <strong style={{ color: '#38BDF8' }}>{sec.confidence}%</strong>
                  </span>
                </div>
              );
            })}
        </div>

        {/* Selected Section Detailed Inspection Panel */}
        <div 
          style={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.95)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '14px', 
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {/* Header of Detail */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>{currentSection.icon}</span>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                  {currentSection.name} Analysis
                </h3>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                  Category: <strong style={{ color: '#38BDF8' }}>{currentSection.category}</strong>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '6px', fontWeight: 800 }}>
                Confidence Indicator: {currentSection.confidence}%
              </span>

              <button
                onClick={() => setExpandedTech(!expandedTech)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: expandedTech ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: '#38BDF8',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {expandedTech ? 'Hide Technical AST' : 'Expand Technical AST'}
              </button>
            </div>
          </div>

          {/* AI Plain-Language Explanation */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px 0' }}>
              🤖 AI Plain-Language Synthesis
            </h4>
            <p style={{ fontSize: '14px', color: '#E2E8F0', margin: 0, lineHeight: '1.5', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '14px 18px', borderRadius: '8px', borderLeft: '3px solid #38BDF8' }}>
              {currentSection.explanation}
            </p>
          </div>

          {/* Expandable Technical Analysis Drawer */}
          {expandedTech && (
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                🔬 Deep Mathematical & Vector AST Inspection
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Extracted AST Features:</span>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#4ADE80', fontFamily: 'monospace' }}>
                    {currentSection.technicalAnalysis.astFeatures.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <span style={{ color: '#94A3B8' }}>Tensor Shape: </span>
                    <strong style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{currentSection.technicalAnalysis.tensorShape}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8' }}>Model Uncertainty: </span>
                    <strong style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{currentSection.technicalAnalysis.modelVariance}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8' }}>Mathematical Formula: </span>
                    <div style={{ color: '#38BDF8', fontFamily: 'monospace', fontSize: '12px', marginTop: '2px', backgroundColor: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '4px' }}>
                      {currentSection.technicalAnalysis.mathFormula}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actionable Suggestions to Boost Retention */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#F13A1E', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px 0' }}>
              💡 Actionable AI Retention Suggestions
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentSection.suggestions.map((sug, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(241, 58, 30, 0.08)', border: '1px solid rgba(241, 58, 30, 0.2)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF' }}>
                  <span style={{ color: '#F13A1E', fontWeight: 900 }}>→</span>
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
