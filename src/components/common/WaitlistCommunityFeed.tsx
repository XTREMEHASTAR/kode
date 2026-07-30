import React, { useEffect, useState } from 'react';

interface WaitlistCommunityFeedProps {
  waitingCount?: number;
  companiesCount?: number;
  countriesCount?: number;
  theme?: 'off-white' | 'dark-cyber' | 'nothing-glass' | 'stripe-neon';
}

interface RecentJoiner {
  id: string;
  name: string;
  location: string;
  timeAgo: string;
  avatarBg: string;
}

export const WaitlistCommunityFeed: React.FC<WaitlistCommunityFeedProps> = ({
  waitingCount = 14892,
  companiesCount = 342,
  countriesCount = 68,
  theme = 'off-white'
}) => {
  const [currentCount, setCurrentCount] = useState(waitingCount);
  const [recentJoiners, setRecentJoiners] = useState<RecentJoiner[]>([
    { id: '1', name: 'Elena R.', location: 'San Francisco, US', timeAgo: 'Just now', avatarBg: '#FF6B3D' },
    { id: '2', name: 'Marcus K.', location: 'Berlin, DE', timeAgo: '2m ago', avatarBg: '#3B82F6' },
    { id: '3', name: 'Aarav P.', location: 'Bengaluru, IN', timeAgo: '5m ago', avatarBg: '#10B981' },
    { id: '4', name: 'Chloe M.', location: 'London, UK', timeAgo: '12m ago', avatarBg: '#8B5CF6' }
  ]);

  // Simulate subtle realtime counter ticks & new community members joining
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setCurrentCount((prev) => prev + 1);

        const names = ['David W.', 'Yuki T.', 'Camille B.', 'Liam O.', 'Sofia G.', 'Hassan A.'];
        const locs = ['Tokyo, JP', 'Paris, FR', 'Toronto, CA', 'Sydney, AU', 'Dubai, AE'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomLoc = locs[Math.floor(Math.random() * locs.length)];
        const colors = ['#FF6B3D', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

        setRecentJoiners((prev) => [
          {
            id: Date.now().toString(),
            name: randomName,
            location: randomLoc,
            timeAgo: 'Just now',
            avatarBg: colors[Math.floor(Math.random() * colors.length)]
          },
          ...prev.slice(0, 3)
        ]);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const cardBg = theme === 'dark-cyber' ? '#162A3B' : '#FFFBF7';
  const borderColor = theme === 'dark-cyber' ? 'rgba(255, 107, 61, 0.3)' : '#E8E3DA';
  const textColor = theme === 'dark-cyber' ? '#F8FAFC' : '#162A3B';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '840px',
        backgroundColor: cardBg,
        borderRadius: '24px',
        border: `1px solid ${borderColor}`,
        boxShadow: '0 20px 40px -10px rgba(255, 107, 61, 0.1), 0 4px 16px rgba(22, 42, 59, 0.04)',
        padding: '32px',
        boxSizing: 'border-box',
        color: textColor
      }}
    >
      {/* 3 STAT CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        {/* PEOPLE WAITING */}
        <div
          style={{
            backgroundColor: 'rgba(255, 107, 61, 0.08)',
            border: '1px solid rgba(255, 107, 61, 0.2)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#FF6B3D', letterSpacing: '0.08em' }}>
            PEOPLE ON WAITLIST
          </span>
          <div style={{ fontSize: '32px', fontWeight: 900, color: textColor, margin: '4px 0 0 0', fontFamily: 'monospace' }}>
            {currentCount.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>
            ↑ +128 joined today
          </span>
        </div>

        {/* COMPANIES */}
        <div
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#3B82F6', letterSpacing: '0.08em' }}>
            ENTERPRISE TEAMS
          </span>
          <div style={{ fontSize: '32px', fontWeight: 900, color: textColor, margin: '4px 0 0 0', fontFamily: 'monospace' }}>
            {companiesCount.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: '#64748B' }}>
            Agencies & Studios
          </span>
        </div>

        {/* COUNTRIES */}
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', letterSpacing: '0.08em' }}>
            GLOBAL REACH
          </span>
          <div style={{ fontSize: '32px', fontWeight: 900, color: textColor, margin: '4px 0 0 0', fontFamily: 'monospace' }}>
            {countriesCount}
          </div>
          <span style={{ fontSize: '11px', color: '#64748B' }}>
            Countries Represented
          </span>
        </div>
      </div>

      {/* RECENTLY JOINED TICKER & DISCORD ACTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '8px' }}>
            RECENTLY JOINED CREATORS
          </span>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {recentJoiners.map((j) => (
              <div
                key={j.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid #E8E3DA',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  animation: 'joinerFadeIn 0.3s ease forwards'
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: j.avatarBg,
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {j.name.charAt(0)}
                </div>
                <span>{j.name}</span>
                <span style={{ color: '#94A3B8', fontSize: '10px' }}>({j.timeAgo})</span>
              </div>
            ))}
          </div>
        </div>

        {/* DISCORD COMMUNITY BUTTON */}
        <a
          href="https://discord.gg/kontagi-ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '12px',
            backgroundColor: '#5865F2',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(88, 101, 242, 0.3)',
            transition: 'transform 0.15s ease'
          }}
        >
          <span>👾 Join Discord Lab</span>
          <span style={{ fontSize: '11px', opacity: 0.8 }}>(12,400+ online)</span>
        </a>
      </div>

      <style>{`
        @keyframes joinerFadeIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
