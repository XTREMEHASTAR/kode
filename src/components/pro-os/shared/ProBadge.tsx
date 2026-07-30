import React from 'react';

export type ProBadgeStatus = 'IDLE' | 'RUNNING' | 'COMPLETE' | 'WARNING' | 'SUCCESS' | 'INFO';

interface ProBadgeProps {
  status: ProBadgeStatus;
  label?: string;
  size?: 'sm' | 'md';
}

export const ProBadge: React.FC<ProBadgeProps> = ({ status, label, size = 'md' }) => {
  const getStyle = () => {
    switch (status) {
      case 'RUNNING':
        return { bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.4)', color: '#38BDF8', defaultText: 'RUNNING' };
      case 'COMPLETE':
      case 'SUCCESS':
        return { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)', color: '#4ADE80', defaultText: 'COMPLETE' };
      case 'WARNING':
        return { bg: 'rgba(234, 179, 8, 0.15)', border: 'rgba(234, 179, 8, 0.4)', color: '#FACC15', defaultText: 'WARNING' };
      case 'INFO':
        return { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)', color: '#C084FC', defaultText: 'INFO' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.15)', color: 'rgba(255, 255, 255, 0.5)', defaultText: 'IDLE' };
    }
  };

  const style = getStyle();
  const isSm = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: isSm ? '9px' : '10px',
        fontWeight: 900,
        fontFamily: 'monospace',
        padding: isSm ? '2px 6px' : '3px 8px',
        borderRadius: '5px',
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        letterSpacing: '0.04em'
      }}
    >
      <span style={{ width: isSm ? '5px' : '6px', height: isSm ? '5px' : '6px', borderRadius: '50%', backgroundColor: style.color }} />
      {label || style.defaultText}
    </span>
  );
};
