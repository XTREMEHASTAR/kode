import React, { useState } from 'react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  leftIcon,
  id,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `password-${Math.random().toString(36).substring(2, 9)}`;

  const toggleVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className={`form-group ${error ? 'error-state-active' : ''}`}>
      <label htmlFor={inputId} className="form-label">
        {label}
      </label>
      <div className="input-container">
        {leftIcon && (
          <span className="input-icon-left flex-center">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          className={`input ${leftIcon ? 'input-with-icon' : ''} ${
            error ? 'input-error' : ''
          } ${className}`}
          style={{ paddingRight: '2.5rem' }}
          {...props}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="btn-ghost flex-center"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            padding: '6px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm)'
          }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.895 7.895L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
      {error && <span className="error-helper-text">{error}</span>}
    </div>
  );
};
