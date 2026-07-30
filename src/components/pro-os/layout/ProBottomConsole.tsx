import React, { useRef, useEffect } from 'react';
import { ProBadge, ProBadgeStatus } from '../shared/ProBadge';

export interface ProConsoleLog {
  id: string;
  timestamp: string;
  topic: string;
  message: string;
  level?: 'info' | 'success' | 'warn' | 'error';
}

interface ProBottomConsoleProps {
  open?: boolean;
  onClose?: () => void;
  logs?: ProConsoleLog[];
  engineStatuses?: Record<string, ProBadgeStatus>;
}

export const ProBottomConsole: React.FC<ProBottomConsoleProps> = ({
  open = true,
  onClose,
  logs = [],
  engineStatuses = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  if (!open) return null;

  const defaultEngines = [
    { name: 'Content DNA', key: 'dna' },
    { name: 'Viewer Swarm', key: 'swarm' },
    { name: 'Recommender', key: 'recommender' },
    { name: 'Trend Engine', key: 'trend' },
    { name: 'Competition', key: 'competition' },
    { name: 'Telemetry', key: 'telemetry' }
  ];

  return (
    <div
      style={{
        height: '170px',
        backgroundColor: '#050811',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        userSelect: 'none'
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: '6px 16px',
          backgroundColor: '#0B1120',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          fontFamily: 'monospace'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 900, color: '#F13A1E' }}>BLOOMBERG/LINEAR CONSOLE</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {defaultEngines.map(e => (
              <ProBadge key={e.key} status={engineStatuses[e.key] || 'COMPLETE'} label={e.name} size="sm" />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>10,000 Agents Active</span>
          {onClose && (
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.4)', cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Log Output Stream */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          padding: '10px 16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: '11.5px',
          lineHeight: '1.45'
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: 'rgba(255, 255, 255, 0.35)', fontStyle: 'italic' }}>
            [00:00:00] AuraCore Simulation Console initialized. 12-Engine cluster standing by...
          </div>
        ) : (
          logs.map(log => (
            <div key={log.id} style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.35)', flexShrink: 0 }}>[{log.timestamp}]</span>
              <span style={{ color: '#38BDF8', fontWeight: 700, flexShrink: 0 }}>[{log.topic}]</span>
              <span style={{ color: '#E2E8F0' }}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
