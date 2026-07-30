import React, { useRef, useEffect } from 'react';

export interface ConsoleLogEntry {
  id: string;
  timestamp: string;
  topic: string;
  message: string;
  level: 'info' | 'success' | 'warn' | 'error';
}

interface ExecutionConsoleProps {
  logs: ConsoleLogEntry[];
  gpuLoadPct: number;
  memoryUsedMb: number;
  activeThreads: number;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({
  logs,
  gpuLoadPct,
  memoryUsedMb,
  activeThreads
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelColor = (level: ConsoleLogEntry['level']) => {
    switch (level) {
      case 'success': return '#4ADE80';
      case 'warn': return '#FACC15';
      case 'error': return '#F87171';
      default: return '#38BDF8';
    }
  };

  return (
    <div
      className="pro-glass-card"
      style={{
        borderRadius: '12px',
        backgroundColor: '#050811',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        height: '180px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
      }}
    >
      {/* Console Top Info Header Bar */}
      <div
        style={{
          backgroundColor: '#0B1120',
          padding: '6px 14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          fontFamily: 'monospace'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 900, color: '#F13A1E' }}>BLOOMBERG/LINEAR EVENT CONSOLE</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Pub/Sub Async Stream</span>
        </div>

        {/* Telemetry System Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(255, 255, 255, 0.6)' }}>
          <span>Threads: <strong style={{ color: '#FFFFFF' }}>{activeThreads} Workers</strong></span>
          <span>RAM: <strong style={{ color: '#FFFFFF' }}>{memoryUsedMb} MB</strong></span>
          <span>GPU Load: <strong style={{ color: gpuLoadPct > 75 ? '#F87171' : '#4ADE80' }}>{gpuLoadPct}%</strong></span>
        </div>
      </div>

      {/* Log Output Stream */}
      <div
        ref={logContainerRef}
        style={{
          flex: 1,
          padding: '10px 14px',
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
          <div style={{ color: 'rgba(255, 255, 255, 0.3)', fontStyle: 'italic' }}>
            Console ready. Click "RUN SIMULATION" to launch multi-engine event stream...
          </div>
        ) : (
          logs.map(log => (
            <div key={log.id} style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.35)', flexShrink: 0 }}>[{log.timestamp}]</span>
              <span style={{ color: getLevelColor(log.level), fontWeight: 700, flexShrink: 0 }}>[{log.topic}]</span>
              <span style={{ color: '#E2E8F0' }}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
