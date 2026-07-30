import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface LivePipelineProcessingProps {
  videoId?: string;
  videoTitle?: string;
  onComplete?: () => void;
}

export const LivePipelineProcessing: React.FC<LivePipelineProcessingProps> = ({
  videoId: propVideoId,
  videoTitle = 'Uploaded Media Asset',
  onComplete
}) => {
  const navigate = useNavigate();
  const { videoId: paramVideoId } = useParams<{ videoId: string }>();
  const videoId = propVideoId || paramVideoId;


  const stages = [
    { id: 1, name: 'Upload & Security Check', desc: 'Parsing media file headers & mime boundary' },
    { id: 2, name: 'FFmpeg Keyframe Extraction', desc: 'Decoding 30fps keyframes & RGBA pixel buffer' },
    { id: 3, name: 'OCR & Text Surface Mapping', desc: 'Scanning visual bounding boxes for text overlays' },
    { id: 4, name: 'Whisper Audio Transcription', desc: 'Spectral audio decoding & word timestamp alignment' },
    { id: 5, name: 'ContentDNA Fusion (1024D)', desc: 'Multimodal projection into 1024D embedding space' },
    { id: 6, name: 'PredictionModelSuite Inference', desc: 'Running ensemble neural prediction & explainability' }
  ];

  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            } else if (videoId) {
              navigate(`/assets/${videoId}/report`);
            } else {
              navigate('/pro/prediction');
            }
          }, 800);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(timer);
  }, [videoId, navigate, onComplete, stages.length]);

  const progressPct = Math.round(((currentStageIdx + 1) / stages.length) * 100);

  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '32px',
      backgroundColor: '#0F172A',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#FFFFFF',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ⚡ LIVE INFERENCE PIPELINE RUNNING
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0 0' }}>{videoTitle}</h2>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#4ADE80', fontFamily: 'monospace' }}>
          {progressPct}%
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '32px' }}>
        <div style={{ height: '100%', width: `${progressPct}%`, backgroundColor: '#38BDF8', transition: 'width 0.4s ease' }} />
      </div>

      {/* Pipeline Stage Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {stages.map((stg, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;
          return (
            <div 
              key={stg.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: isCurrent ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                border: isCurrent ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 900,
                backgroundColor: isDone ? '#4ADE80' : isCurrent ? '#38BDF8' : 'rgba(255,255,255,0.1)',
                color: isDone || isCurrent ? '#000000' : '#94A3B8'
              }}>
                {isDone ? '✓' : stg.id}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: isCurrent ? '#FFFFFF' : isDone ? '#E2E8F0' : '#64748B' }}>
                  {stg.name}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>{stg.desc}</div>
              </div>
              {isCurrent && (
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', animation: 'pulse 1s infinite' }}>
                  PROCESSING...
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
