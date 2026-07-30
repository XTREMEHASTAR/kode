import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  width?: string | number;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  disabled = false,
  style,
  className = '',
  width = '100%',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left select-none ${className}`}
      style={{ width, ...style }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        style={{
          height: '44px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: isOpen ? '1.5px solid #FF6B3D' : '1px solid #E8E3DA',
          boxShadow: '0 2px 8px rgba(22, 42, 59, 0.04)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 150ms ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isOpen) {
            e.currentTarget.style.borderColor = '#FF6B3D';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isOpen) {
            e.currentTarget.style.borderColor = '#E8E3DA';
          }
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#162A3B' }}>
          {selectedOption?.icon}
          {selectedOption ? selectedOption.label : <span style={{ color: '#98A2B3' }}>{placeholder}</span>}
        </span>

        <svg
          style={{
            width: '16px',
            height: '16px',
            color: '#667085',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E3DA',
            boxShadow: '0 10px 30px rgba(22, 42, 59, 0.12)',
            padding: '8px',
            maxHeight: '260px',
            overflowY: 'auto',
            animation: 'customSelectFadeIn 180ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                style={{
                  height: '40px',
                  borderRadius: '10px',
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: isSelected ? 700 : 500,
                  color: '#162A3B',
                  backgroundColor: isSelected ? 'rgba(255, 107, 61, 0.06)' : 'transparent',
                  transition: 'background-color 120ms ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#F5F3EF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Selected Orange Dot */}
                  {isSelected ? (
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#FF6B3D', flexShrink: 0 }} />
                  ) : (
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'transparent', flexShrink: 0 }} />
                  )}

                  {opt.icon}
                  <span>{opt.label}</span>
                </div>

                {/* Checkmark Indicator */}
                {isSelected && (
                  <svg style={{ width: '15px', height: '15px', color: '#FF6B3D' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Embedded Animation Keyframes */}
      <style>{`
        @keyframes customSelectFadeIn {
          from {
            opacity: 0;
            transform: scale(0.98) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
