import React from 'react';

interface ScriptInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export const ScriptInput: React.FC<ScriptInputProps> = ({
  value,
  onChange,
  placeholder = 'Start typing or paste your script...',
  maxLength = 10000
}) => {
  return (
    <div className="ft-textarea-wrapper">
      <label className="ft-label">Paste your script here...</label>
      <textarea
        className="ft-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      <div className="ft-char-counter">
        {value.length.toLocaleString()} / {maxLength.toLocaleString()}
      </div>
    </div>
  );
};
