import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface ProPropertySelectProps {
  label: string;
  value: string | number;
  options: SelectOption[];
  onChange: (val: any) => void;
  subtitle?: string;
}

export const ProPropertySelect: React.FC<ProPropertySelectProps> = ({
  label,
  value,
  options,
  onChange,
  subtitle
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          padding: '9px 12px',
          fontSize: '12.5px',
          fontWeight: 700,
          outline: 'none',
          width: '100%'
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: '#0F172A', color: '#FFFFFF' }}>
            {opt.label}
          </option>
        ))}
      </select>
      {subtitle && <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)' }}>{subtitle}</span>}
    </div>
  );
};

interface ProPropertySliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export const ProPropertySlider: React.FC<ProPropertySliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
  onChange
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase' }}>
          {label}
        </label>
        <span style={{ fontSize: '12px', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace' }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#38BDF8', cursor: 'pointer' }}
      />
    </div>
  );
};
