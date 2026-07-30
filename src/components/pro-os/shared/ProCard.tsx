import React from 'react';

interface ProCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
  padding?: string;
}

export const ProCard: React.FC<ProCardProps> = ({
  children,
  className = '',
  style = {},
  glow = false,
  padding = '20px'
}) => {
  return (
    <div
      className={`pro-glass-card ${glow ? 'pro-glow-card' : ''} ${className}`}
      style={{
        padding,
        borderRadius: '14px',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: glow ? '0 0 25px rgba(56, 189, 248, 0.12)' : '0 10px 30px rgba(0, 0, 0, 0.3)',
        ...style
      }}
    >
      {children}
    </div>
  );
};
