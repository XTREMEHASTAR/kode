import React from 'react';

interface AuthSuccessProps {
  title: string;
  description: string;
  actionText: string;
  onActionClick: () => void;
}

export const AuthSuccess: React.FC<AuthSuccessProps> = ({
  title,
  description,
  actionText,
  onActionClick
}) => {
  return (
    <div style={{ textAlign: 'center', padding: '12px 0' }}>
      <svg className="success-checkmark-svg" viewBox="0 0 52 52">
        <circle className="success-checkmark-circle" cx="26" cy="26" r="25" />
        <path className="success-checkmark-check" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
      </svg>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px', lineHeight: 1.5 }}>
        {description}
      </p>

      <button
        onClick={onActionClick}
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {actionText}
      </button>
    </div>
  );
};
