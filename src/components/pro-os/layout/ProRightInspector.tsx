import React from 'react';
import { ProCard } from '../shared/ProCard';
import { ProBadge } from '../shared/ProBadge';

interface ProRightInspectorProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
}

export const ProRightInspector: React.FC<ProRightInspectorProps> = ({
  open = true,
  onClose,
  title = 'Context Inspector',
  children
}) => {
  if (!open) return null;

  return (
    <aside
      style={{
        width: '300px',
        backgroundColor: '#070B14',
        borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
        overflowY: 'auto',
        userSelect: 'none'
      }}
    >
      {/* Inspector Header */}
      <div
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF' }}>
            ⚙️ {title}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Inspector Body Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {children || (
          <>
            <ProCard padding="14px">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase' }}>
                  ACTIVE SYSTEM ENVIRONMENT
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFF' }}>AuraCore Engine v3.0</span>
                  <ProBadge status="COMPLETE" label="READY" size="sm" />
                </div>
              </div>
            </ProCard>

            <ProCard padding="14px">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase' }}>
                  INSPECTED METRICS
                </span>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'monospace' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cluster Nodes:</span>
                    <span style={{ color: '#38BDF8', fontWeight: 800 }}>128 Active</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tick Frequency:</span>
                    <span style={{ color: '#FFFFFF' }}>1.0 Hz</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Stochastic Noise SDE:</span>
                    <span style={{ color: '#4ADE80' }}>Enabled</span>
                  </div>
                </div>
              </div>
            </ProCard>
          </>
        )}
      </div>
    </aside>
  );
};
