import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  error,
  leftIcon,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

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
          className={`input ${leftIcon ? 'input-with-icon' : ''} ${
            error ? 'input-error' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="error-helper-text">{error}</span>}
    </div>
  );
};
