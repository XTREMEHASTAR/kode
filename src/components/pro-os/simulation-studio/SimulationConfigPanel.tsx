import React from 'react';

export interface SimulationEnvParameters {
  platform: 'TIKTOK' | 'REELS' | 'YOUTUBE_SHORTS' | 'X_FEED';
  creatorProfile: 'MICRO_CREATOR' | 'ESTABLISHED_AUTHORITY' | 'BRAND_ACCOUNT' | 'VIRAL_DISRUPTOR';
  audiencePreset: 'ZOOMER_SKIMMER' | 'MILLENNIAL_FOUNDER' | 'SKEPTICAL_TECHIE' | 'BROAD_ENTERTAINMENT';
  region: 'US_NORTH_AMERICA' | 'EUROPE' | 'ASIA_PACIFIC' | 'GLOBAL';
  timeOfDay: 'MORNING_PEAK' | 'MIDDAY_BREAK' | 'EVENING_SCROLL' | 'LATE_NIGHT';
  dayOfWeek: 'MONDAY_FOCUS' | 'MIDWEEK_PLATEAU' | 'FRIDAY_HYPE' | 'SUNDAY_RESET';
  trendStrengthPct: number; // 0 - 100
  competitionLevel: 'LOW_MONOPOLIZED' | 'MODERATE' | 'INTENSE_PEAK' | 'EXTREME_ZERO_SUM';
  populationSize: number;
}

interface SimulationConfigPanelProps {
  config: SimulationEnvParameters;
  onChange: (updated: Partial<SimulationEnvParameters>) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
}

export const SimulationConfigPanel: React.FC<SimulationConfigPanelProps> = ({
  config,
  onChange,
  onRunSimulation,
  isSimulating
}) => {
  return (
    <div
      className="pro-glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        borderRadius: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 900, margin: 0, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            ⚙️ World Environment Matrix
          </h3>
          <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
            8-Dimensional Simulation Knobs
          </span>
        </div>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#F13A1E', backgroundColor: 'rgba(241, 58, 30, 0.15)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(241, 58, 30, 0.3)' }}>
          PRO ENGINE
        </span>
      </div>

      {/* 1. Target Platform */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
          Target Platform
        </label>
        <select
          value={config.platform}
          onChange={(e) => onChange({ platform: e.target.value as any })}
          style={selectStyle}
        >
          <option value="TIKTOK" style={optionStyle}>🎵 TikTok FYP Algorithm</option>
          <option value="REELS" style={optionStyle}>📸 Instagram Reels Explore</option>
          <option value="YOUTUBE_SHORTS" style={optionStyle}>▶️ YouTube Shorts Ranker</option>
          <option value="X_FEED" style={optionStyle}>𝕏 X/Twitter Algorithm</option>
        </select>
      </div>

      {/* 2. Creator Profile */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
          Creator Profile & Authority
        </label>
        <select
          value={config.creatorProfile}
          onChange={(e) => onChange({ creatorProfile: e.target.value as any })}
          style={selectStyle}
        >
          <option value="MICRO_CREATOR" style={optionStyle}>🌱 Micro-Creator (&lt;10k followers)</option>
          <option value="ESTABLISHED_AUTHORITY" style={optionStyle}>⚡ Established Niche Authority (100k+)</option>
          <option value="BRAND_ACCOUNT" style={optionStyle}>🏢 Corporate Brand Account</option>
          <option value="VIRAL_DISRUPTOR" style={optionStyle}>🚀 Viral Disruptor (High Velocity)</option>
        </select>
      </div>

      {/* 3. Audience Preset */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
          Audience Cohort Preset
        </label>
        <select
          value={config.audiencePreset}
          onChange={(e) => onChange({ audiencePreset: e.target.value as any })}
          style={selectStyle}
        >
          <option value="ZOOMER_SKIMMER" style={optionStyle}>⚡ Impatient Gen-Z Skimmers</option>
          <option value="MILLENNIAL_FOUNDER" style={optionStyle}>💼 High-Intent Millennial Founders</option>
          <option value="SKEPTICAL_TECHIE" style={optionStyle}>🧐 Skeptical Tech Enthusiasts</option>
          <option value="BROAD_ENTERTAINMENT" style={optionStyle}>🍿 Broad Entertainment Viewers</option>
        </select>
      </div>

      {/* Grid: 4. Region & 5. Time of Day */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
            Geographic Region
          </label>
          <select
            value={config.region}
            onChange={(e) => onChange({ region: e.target.value as any })}
            style={compactSelectStyle}
          >
            <option value="US_NORTH_AMERICA" style={optionStyle}>🇺🇸 US & N. America</option>
            <option value="EUROPE" style={optionStyle}>🇪🇺 Europe</option>
            <option value="ASIA_PACIFIC" style={optionStyle}>🌏 Asia-Pacific</option>
            <option value="GLOBAL" style={optionStyle}>🌐 Global Mix</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
            Time of Day
          </label>
          <select
            value={config.timeOfDay}
            onChange={(e) => onChange({ timeOfDay: e.target.value as any })}
            style={compactSelectStyle}
          >
            <option value="MORNING_PEAK" style={optionStyle}>🌅 Morning (08:00)</option>
            <option value="MIDDAY_BREAK" style={optionStyle}>☀️ Midday (12:30)</option>
            <option value="EVENING_SCROLL" style={optionStyle}>🌆 Evening (19:00)</option>
            <option value="LATE_NIGHT" style={optionStyle}>🌙 Late Night (23:30)</option>
          </select>
        </div>
      </div>

      {/* Grid: 6. Day of Week & 8. Competition */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
            Day of Week
          </label>
          <select
            value={config.dayOfWeek}
            onChange={(e) => onChange({ dayOfWeek: e.target.value as any })}
            style={compactSelectStyle}
          >
            <option value="MONDAY_FOCUS" style={optionStyle}>📅 Monday Focus</option>
            <option value="MIDWEEK_PLATEAU" style={optionStyle}>📅 Midweek</option>
            <option value="FRIDAY_HYPE" style={optionStyle}>📅 Friday Hype</option>
            <option value="SUNDAY_RESET" style={optionStyle}>📅 Sunday Reset</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
            Feed Competition
          </label>
          <select
            value={config.competitionLevel}
            onChange={(e) => onChange({ competitionLevel: e.target.value as any })}
            style={compactSelectStyle}
          >
            <option value="LOW_MONOPOLIZED" style={optionStyle}>🟢 Low Competition</option>
            <option value="MODERATE" style={optionStyle}>🟡 Moderate Density</option>
            <option value="INTENSE_PEAK" style={optionStyle}>🟠 Intense Peak</option>
            <option value="EXTREME_ZERO_SUM" style={optionStyle}>🔴 Extreme Zero-Sum</option>
          </select>
        </div>
      </div>

      {/* 7. Trend Strength Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase' }}>
            🔥 Trend & Audio Surge Factor
          </label>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace' }}>
            {config.trendStrengthPct}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={config.trendStrengthPct}
          onChange={(e) => onChange({ trendStrengthPct: Number(e.target.value) })}
          style={{ width: '100%', accentColor: '#38BDF8', cursor: 'pointer' }}
        />
      </div>

      {/* Synthetic Swarm Population Size */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
          Synthetic Viewer Swarm Cohort
        </label>
        <select
          value={config.populationSize}
          onChange={(e) => onChange({ populationSize: Number(e.target.value) })}
          style={selectStyle}
        >
          <option value={1000} style={optionStyle}>1,000 Synthetic Agents (Fast Sandbox)</option>
          <option value={10000} style={optionStyle}>10,000 Synthetic Agents (Standard Production)</option>
          <option value={100000} style={optionStyle}>100,000 Synthetic Agents (High Precision Swarm)</option>
        </select>
      </div>

      {/* Launch Execution Button */}
      <button
        onClick={onRunSimulation}
        disabled={isSimulating}
        style={{
          marginTop: '6px',
          width: '100%',
          padding: '14px 20px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: isSimulating ? '#475569' : '#F13A1E',
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: 900,
          cursor: isSimulating ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: isSimulating ? 'none' : '0 0 25px rgba(241, 58, 30, 0.45)',
          transition: 'all 0.2s ease'
        }}
      >
        <span style={{ fontSize: '16px' }}>{isSimulating ? '⏳' : '⚡'}</span>
        <span>{isSimulating ? 'SIMULATING SWARM RUN...' : 'RUN SIMULATION'}</span>
      </button>
    </div>
  );
};

const selectStyle: React.CSSProperties = {
  backgroundColor: 'rgba(0, 0, 0, 0.35)',
  color: '#FFFFFF',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '8px',
  padding: '10px 12px',
  fontSize: '12.5px',
  fontWeight: 700,
  outline: 'none',
  width: '100%'
};

const compactSelectStyle: React.CSSProperties = {
  ...selectStyle,
  padding: '8px 10px',
  fontSize: '11.5px'
};

const optionStyle: React.CSSProperties = {
  backgroundColor: '#0F172A',
  color: '#FFFFFF'
};
