import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  badge,
  children
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            {title}
          </h1>
          {badge}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
          {subtitle}
        </p>
      </div>

      <div style={{ marginTop: 'var(--space-xs)' }}>
        {children}
      </div>
    </div>
  );
};
