import React, { useEffect, useState } from 'react';

interface SecretLabEasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerType: 'orb_5x' | 'konami_code' | 'countdown_zero' | 'manual';
}

export const SecretLabEasterEggModal: React.FC<SecretLabEasterEggModalProps> = ({
  isOpen,
  onClose,
  triggerType
}) => {
  const [matrixText, setMatrixText] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'console' | 'jokes' | 'cheats'>('console');

  useEffect(() => {
    if (!isOpen) return;

    // Generate Matrix style system logs
    const logs = [
      "[SYSTEM_INIT] Secret AI Laboratory Protocol Activated...",
      "[AUTH_OVERRIDE] Konami / 5x Orb Multi-click token validated.",
      "[NEURAL_NET] Loading hidden weights... 100% complete.",
      "[GPU_METRICS] H100 Cluster temperature: 68°C. Fan RPM: 9400.",
      "[ETHICS_GUARD] Sarcasm limits temporarily bypassed.",
      "[DEVELOPER_NOTE] If QA asks, you didn't see this console."
    ];

    setMatrixText(logs);

    const interval = setInterval(() => {
      const randomHex = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      setMatrixText(prev => [
        ...prev.slice(-12),
        `[QUANTUM_MEM_${Math.floor(Math.random() * 900 + 100)}] 0x${randomHex} - Neural convergence optimal.`
      ]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const titleMap = {
    orb_5x: '⚡ SECRET AI LABORATORY CONSOLE UNLOCKED (5x Orb Multi-Click)',
    konami_code: '🎮 KONAMI CODE DETECTED: DEVELOPER CHEAT MODE ACTIVE',
    countdown_zero: '🎉 COUNTDOWN COMPLETE: AI SIMULATION ENGINE LAUNCHED!',
    manual: '🧪 TOP SECRET AI RESEARCH PORTAL'
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 28, 40, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'modalFadeIn 0.25s ease forwards'
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: '680px',
          width: '100%',
          backgroundColor: '#0F1C28',
          borderRadius: '24px',
          border: '1px solid rgba(255, 107, 61, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(255, 107, 61, 0.35), 0 0 30px rgba(0, 255, 150, 0.1)',
          color: '#F8FAFC',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#162A3B',
            borderBottom: '1px solid rgba(255, 107, 61, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FF6B3D', marginLeft: '8px', fontFamily: 'monospace' }}>
              kontagi_secret_lab.sh
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              fontSize: '18px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10B981',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '14px'
            }}
          >
            <span>🏆 EASTER EGG UNLOCKED</span>
            <span>•</span>
            <span>MEMBER ID #007</span>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px 0', lineHeight: 1.3 }}>
            {titleMap[triggerType]}
          </h2>

          {/* Navigation Tabs inside modal */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
            <button
              onClick={() => setActiveTab('console')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'console' ? 'rgba(255, 107, 61, 0.2)' : 'transparent',
                color: activeTab === 'console' ? '#FF6B3D' : '#94A3B8',
                border: '1px solid ' + (activeTab === 'console' ? '#FF6B3D' : 'transparent'),
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              💻 Live Neural Logs
            </button>

            <button
              onClick={() => setActiveTab('jokes')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'jokes' ? 'rgba(255, 107, 61, 0.2)' : 'transparent',
                color: activeTab === 'jokes' ? '#FF6B3D' : '#94A3B8',
                border: '1px solid ' + (activeTab === 'jokes' ? '#FF6B3D' : 'transparent'),
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🤖 Developer Jokes
            </button>

            <button
              onClick={() => setActiveTab('cheats')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'cheats' ? 'rgba(255, 107, 61, 0.2)' : 'transparent',
                color: activeTab === 'cheats' ? '#FF6B3D' : '#94A3B8',
                border: '1px solid ' + (activeTab === 'cheats' ? '#FF6B3D' : 'transparent'),
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🔑 Secret Passcodes
            </button>
          </div>

          {/* TAB 1: CONSOLE */}
          {activeTab === 'console' && (
            <div
              style={{
                backgroundColor: '#050B11',
                borderRadius: '12px',
                padding: '16px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '12px',
                color: '#38BDF8',
                maxHeight: '220px',
                overflowY: 'auto',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                lineHeight: '1.6'
              }}
            >
              {matrixText.map((line, idx) => (
                <div key={idx} style={{ color: idx % 2 === 0 ? '#38BDF8' : '#4ADE80' }}>
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: JOKES */}
          {activeTab === 'jokes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ backgroundColor: 'rgba(255, 107, 61, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 107, 61, 0.2)', fontSize: '13px' }}>
                💡 <strong>Why did the AI cross the road?</strong><br />
                To optimize the loss function on the other side!
              </div>

              <div style={{ backgroundColor: 'rgba(255, 107, 61, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 107, 61, 0.2)', fontSize: '13px' }}>
                💡 <strong>Developer Creed:</strong><br />
                It's not a bug, it's an undocumented AI feature with attitude.
              </div>
            </div>
          )}

          {/* TAB 3: CHEATS */}
          {activeTab === 'cheats' && (
            <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#CBD5E1' }}>
              <p>You have unlocked <strong>Secret VIP Status</strong>! Your pre-registration rank is automatically boosted by 1,000 positions.</p>
              <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '10px' }}>
                <code>VIP_ACCESS_CODE: KONTAGI_LAB_SECRET_2026</code>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#162A3B',
            borderTop: '1px solid rgba(255, 107, 61, 0.2)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#FF6B3D',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(255, 107, 61, 0.3)'
            }}
          >
            Close Developer Portal
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
