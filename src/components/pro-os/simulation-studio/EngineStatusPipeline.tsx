import React from 'react';
import { motion } from 'framer-motion';

export type EngineStatus = 'IDLE' | 'RUNNING' | 'COMPLETE' | 'WARNING';

export interface EnginePipelineStates {
  contentDna: EngineStatus;
  viewerSwarm: EngineStatus;
  recommendation: EngineStatus;
  trendEngine: EngineStatus;
  competitionEngine: EngineStatus;
  telemetryPipeline: EngineStatus;
}

interface EngineStatusPipelineProps {
  states: EnginePipelineStates;
  activeStep: number;
  totalSteps: number;
}

export const EngineStatusPipeline: React.FC<EngineStatusPipelineProps> = ({ states, activeStep, totalSteps }) => {
  const engines = [
    { id: 'contentDna', name: 'ContentDNA', state: states.contentDna, icon: '🧬' },
    { id: 'viewerSwarm', name: 'AI Viewer Personas', state: states.viewerSwarm, icon: '👥' },
    { id: 'recommendation', name: 'Algorithmic Distribution', state: states.recommendation, icon: '🎯' },
    { id: 'trendEngine', name: 'Scroll Stop Signals', state: states.trendEngine, icon: '🔥' },
    { id: 'competitionEngine', name: 'Feed Competition', state: states.competitionEngine, icon: '⚔️' },
    { id: 'telemetryPipeline', name: 'Performance Report', state: states.telemetryPipeline, icon: '📊' }
  ];

  const getBadgeStyle = (state: EngineStatus) => {
    switch (state) {
      case 'RUNNING':
        return {
          bg: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.5)',
          color: '#38BDF8',
          text: 'RUNNING'
        };
      case 'COMPLETE':
        return {
          bg: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.5)',
          color: '#4ADE80',
          text: 'COMPLETE'
        };
      case 'WARNING':
        return {
          bg: 'rgba(234, 179, 8, 0.15)',
          border: '1px solid rgba(234, 179, 8, 0.5)',
          color: '#FACC15',
          text: 'WARNING'
        };
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.4)',
          text: 'IDLE'
        };
    }
  };

  const progressPct = Math.round((activeStep / (totalSteps || 1)) * 100);

  return (
    <div
      className="pro-glass-card"
      style={{
        padding: '16px 20px',
        borderRadius: '12px',
        backgroundColor: 'rgba(9, 13, 22, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            NASA/UNREAL ENGINE PIPELINE HUD
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace' }}>
          Step Progress: <span style={{ color: '#38BDF8', fontWeight: 800 }}>{activeStep} / {totalSteps}</span> ({progressPct}%)
        </div>
      </div>

      {/* Progress Line */}
      <div style={{ height: '3px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3 }}
          style={{ height: '100%', backgroundColor: '#F13A1E', boxShadow: '0 0 10px #F13A1E' }}
        />
      </div>

      {/* 6 Engine Badges Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
        {engines.map(engine => {
          const style = getBadgeStyle(engine.state);
          return (
            <div
              key={engine.id}
              style={{
                backgroundColor: style.bg,
                border: style.border,
                borderRadius: '8px',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px' }}>{engine.icon}</span>
                <span style={{ fontSize: '9px', fontWeight: 900, color: style.color, fontFamily: 'monospace' }}>
                  {style.text}
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {engine.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
