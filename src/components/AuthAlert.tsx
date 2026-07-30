import React from 'react';

interface AuthAlertProps {
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
}

export const AuthAlert: React.FC<AuthAlertProps> = ({ message, type = 'error' }) => {
  if (!message) return null;

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'var(--accent-green-bg)',
          border: 'var(--accent-green)',
          text: 'var(--accent-green)'
        };
      case 'warning':
        return {
          bg: 'var(--accent-orange-bg)',
          border: 'var(--accent-orange)',
          text: 'var(--accent-orange)'
        };
      case 'info':
        return {
          bg: 'var(--accent-blue-bg)',
          border: 'var(--accent-blue)',
          text: 'var(--accent-blue)'
        };
      case 'error':
      default:
        return {
          bg: 'var(--accent-red-bg)',
          border: 'var(--accent-red)',
          text: 'var(--accent-red)'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderLeftWidth: '4px',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.8125rem',
        fontWeight: 500,
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '12px 0',
        lineHeight: 1.4,
        animation: 'authFadeIn var(--transition-fast) forwards'
      }}
      role="alert"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={colors.text}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        {type === 'error' && (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </>
        )}
        {type === 'warning' && (
          <>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </>
        )}
        {type === 'info' && (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </>
        )}
        {type === 'success' && (
          <>
            <circle cx="12" cy="12" r="10" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </>
        )}
      </svg>
      <span style={{ flexGrow: 1 }}>{message}</span>
    </div>
  );
};
