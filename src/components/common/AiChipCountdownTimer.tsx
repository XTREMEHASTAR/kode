import React, { useEffect, useState } from 'react';

export interface AiChipCountdownProps {
  targetDate: string; // ISO String
  onReachZero?: () => void;
  onClick?: () => void;
  theme?: 'off-white' | 'dark-cyber';
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isZero: boolean;
}

export const AiChipCountdownTimer: React.FC<AiChipCountdownProps> = ({
  targetDate,
  onReachZero,
  onClick,
  className = ''
}) => {
  const calculateTimeLeft = (): TimeLeft => {
    const diff = +new Date(targetDate) - +new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isZero: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60) % 60)),
      seconds: Math.floor((diff / 1000) % 60),
      isZero: false
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [pulse, setPulse] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
      setPulse(true);
      setTimeout(() => setPulse(false), 300);

      if (updated.isZero && onReachZero) {
        onReachZero();
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onReachZero]);

  const format2 = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className={`ring-timer-stage-light ${className}`}>
      {/* ── LIGHT MODE TIMER CARD CONTAINER ───────────────────────────── */}
      <div
        className={`ring-timer-card-light ${pulse ? 'ring-pulse-light' : ''}`}
        onClick={handleCardClick}
        title="Click to claim Early Access Credentials"
      >
        {/* CORE LAYOUT: LEFT CIRCULAR DAYS RING + RIGHT HORIZONTAL TIME READOUT */}
        <div className="ring-timer-content-light">
          {/* LEFT CIRCULAR DAYS GAUGE */}
          <div className="days-ring-wrapper">
            <svg className="days-ring-svg" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="ringGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B3D" />
                  <stop offset="60%" stopColor="#FF8F6B" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <circle className="ring-track-light" cx="60" cy="60" r="50" />
              <circle className="ring-progress-light" cx="60" cy="60" r="50" stroke="url(#ringGradientLight)" />
            </svg>

            <div className="days-ring-center">
              <span className="days-value-light">{timeLeft.days}</span>
              <span className="days-label-light">DAYS</span>
            </div>
          </div>

          {/* RIGHT HORIZONTAL TIME READOUT (HOURS : MINUTES : SECONDS) */}
          <div className="time-readout-group-light">
            {/* HOURS */}
            <div className="time-col-light">
              <span className="col-label-light">HOURS</span>
              <span className="col-value-light">{format2(timeLeft.hours)}</span>
            </div>

            <span className="readout-colon-light">:</span>

            {/* MINUTES */}
            <div className="time-col-light">
              <span className="col-label-light">MINUTES</span>
              <span className="col-value-light">{format2(timeLeft.minutes)}</span>
            </div>

            <span className="readout-colon-light">:</span>

            {/* SECONDS */}
            <div className="time-col-light">
              <span className="col-label-light">SECONDS</span>
              <span className="col-value-light seconds-value-light">{format2(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── EXPANDABLE CLICK DIAGNOSTICS MODAL ───────────────────────── */}
      {isModalOpen && (
        <div className="chip-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="chip-modal-card-light" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-light">
              <div className="modal-title-row">
                <span className="modal-icon">🤖</span>
                <h3>KONTAGI Neural Cluster Diagnostics</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="diag-section">
                <h4>System Readiness Matrix</h4>
                <div className="diag-grid">
                  <div className="diag-item-light">
                    <span className="diag-label-light">Research & Model Architecture</span>
                    <span className="diag-badge badge-green">100% COMPLETE</span>
                  </div>
                  <div className="diag-item-light">
                    <span className="diag-label-light">Simulation Engine</span>
                    <span className="diag-badge badge-green">99.8% READY</span>
                  </div>
                  <div className="diag-item-light">
                    <span className="diag-label-light">Prediction Neural Swarm</span>
                    <span className="diag-badge badge-orange">CALIBRATING</span>
                  </div>
                  <div className="diag-item-light">
                    <span className="diag-label-light">GPU Cluster Nodes</span>
                    <span className="diag-badge badge-green">128 / 128 ONLINE</span>
                  </div>
                </div>
              </div>

              <div className="diag-section">
                <h4>Overall Initialization</h4>
                <div className="diag-bar-track-light">
                  <div className="diag-bar-fill" style={{ width: '92%' }} />
                </div>
                <div className="diag-bar-caption">92% Core Systems Operational • Target Launch Q3 2026</div>
              </div>
            </div>

            <div className="modal-footer-light">
              <button className="modal-action-btn" onClick={() => setIsModalOpen(false)}>Close Diagnostics</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIGHT MODE STYLES ────────────────────────────────────────── */}
      <style>{`
        .ring-timer-stage-light {
          width: 100%;
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          user-select: none;
        }

        .ring-timer-card-light {
          width: 100%;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border-radius: 36px;
          border: 1px solid #E8E3DA;
          box-shadow:
            0 28px 70px -10px rgba(22, 42, 59, 0.12),
            0 10px 36px rgba(255, 107, 61, 0.1);
          padding: 44px 56px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .ring-timer-card-light:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 107, 61, 0.55);
          box-shadow:
            0 36px 80px -8px rgba(22, 42, 59, 0.16),
            0 12px 40px rgba(255, 107, 61, 0.18);
        }

        .ring-pulse-light {
          border-color: rgba(255, 107, 61, 0.45);
        }

        /* CONTENT ROW */
        .ring-timer-content-light {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 52px;
          width: 100%;
        }

        /* DAYS RING */
        .days-ring-wrapper {
          position: relative;
          width: 170px;
          height: 170px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .days-ring-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .ring-track-light {
          fill: none;
          stroke: rgba(22, 42, 59, 0.07);
          stroke-width: 9;
        }

        .ring-progress-light {
          fill: none;
          stroke-width: 9;
          stroke-linecap: round;
          stroke-dasharray: 314;
          stroke-dashoffset: 60;
          animation: ringPulseGlowLight 2s infinite alternate;
        }

        .days-ring-center {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .days-value-light {
          font-family: 'JetBrains Mono', 'Inter', monospace;
          font-size: 58px;
          font-weight: 900;
          color: #162A3B;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .days-label-light {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #64748B;
          margin-top: 4px;
        }

        /* TIME READOUT */
        .time-readout-group-light {
          display: flex;
          align-items: flex-end;
          gap: 28px;
        }

        .time-col-light {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .col-label-light {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #64748B;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .col-value-light {
          font-family: 'JetBrains Mono', 'SF Mono', monospace;
          font-size: 68px;
          font-weight: 900;
          color: #162A3B;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }

        .seconds-value-light {
          color: #FF6B3D;
          animation: secGlowPulseLight 1s ease-in-out infinite alternate;
        }

        .readout-colon-light {
          font-size: 54px;
          font-weight: 700;
          color: #FF6B3D;
          opacity: 0.85;
          margin-bottom: 6px;
        }

        /* MODAL STYLES */
        .chip-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(22, 42, 59, 0.4);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .chip-modal-card-light {
          width: 100%;
          max-width: 540px;
          background: #FFFFFF;
          border-radius: 24px;
          border: 1px solid #E8E3DA;
          box-shadow: 0 24px 60px rgba(22, 42, 59, 0.18);
          overflow: hidden;
          padding: 24px;
          color: #162A3B;
        }

        .modal-header-light {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #E8E3DA;
        }

        .modal-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-title-row h3 {
          font-size: 16px;
          font-weight: 800;
          margin: 0;
          color: #162A3B;
        }

        .modal-close-btn {
          background: none;
          border: none;
          font-size: 18px;
          color: #94A3B8;
          cursor: pointer;
        }

        .diag-section {
          margin-bottom: 20px;
        }

        .diag-section h4 {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          color: #FF6B3D;
          letter-spacing: 0.05em;
          margin: 0 0 12px 0;
        }

        .diag-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .diag-item-light {
          padding: 12px;
          border-radius: 12px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .diag-label-light {
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
        }

        .diag-badge {
          font-size: 11px;
          font-weight: 800;
        }

        .badge-green { color: #10B981; }
        .badge-orange { color: #F59E0B; }

        .diag-bar-track-light {
          width: 100%;
          height: 8px;
          border-radius: 9999px;
          background: #E2E8F0;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .diag-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF6B3D, #10B981);
          border-radius: 9999px;
        }

        .diag-bar-caption {
          font-size: 11px;
          color: #64748B;
          font-weight: 600;
        }

        .modal-footer-light {
          display: flex;
          justify-content: flex-end;
          padding-top: 16px;
          border-top: 1px solid #E8E3DA;
        }

        .modal-action-btn {
          padding: 10px 20px;
          border-radius: 12px;
          background: #FF6B3D;
          color: #FFFFFF;
          border: none;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }

        @keyframes ringPulseGlowLight {
          0% { filter: drop-shadow(0 0 2px rgba(255, 107, 61, 0.2)); }
          100% { filter: drop-shadow(0 0 6px rgba(255, 107, 61, 0.6)); }
        }

        @keyframes secGlowPulseLight {
          0% { text-shadow: 0 0 0px rgba(255, 107, 61, 0); }
          100% { text-shadow: 0 0 8px rgba(255, 107, 61, 0.4); }
        }

        @media (max-width: 540px) {
          .ring-timer-content-light {
            gap: 16px;
          }
          .days-ring-wrapper {
            width: 86px;
            height: 86px;
          }
          .days-value-light {
            font-size: 28px;
          }
          .col-value-light {
            font-size: 30px;
          }
          .col-label-light {
            font-size: 9.5px;
          }
        }
      `}</style>
    </div>
  );
};
