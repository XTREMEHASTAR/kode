import React, { useEffect, useState, useRef, useCallback } from 'react';

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

// ─────────────────────────────────────────────────────────────────────────────
// INDIVIDUAL DIGIT ANIMATION COMPONENT
// Smoothly slides digits upward by ~8px with 250ms fade on value change
// ─────────────────────────────────────────────────────────────────────────────
const DigitCell: React.FC<{ value: string; className?: string }> = ({ value, className = '' }) => {
  const [currentVal, setCurrentVal] = useState(value);
  const [prevVal, setPrevVal] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (value !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(value);
      setAnimating(true);
      const t = setTimeout(() => {
        setAnimating(false);
        setPrevVal(null);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [value, currentVal]);

  return (
    <span className={`digit-cell-wrapper ${className}`}>
      {animating && prevVal !== null && (
        <span className="digit-val digit-val-exit">{prevVal}</span>
      )}
      <span className={`digit-val ${animating ? 'digit-val-enter' : ''}`}>{currentVal}</span>
    </span>
  );
};

export const AiChipCountdownTimer: React.FC<AiChipCountdownProps> = ({
  targetDate,
  onReachZero,
  onClick,
  className = ''
}) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const targetMs = Date.parse(targetDate);
    const nowMs = Date.now();
    const diff = targetMs - nowMs;

    if (isNaN(diff) || diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isZero: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isZero: false
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Parallax subtle tilt (4–6px translate)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);
    setMousePos({
      x: offsetX * 5,
      y: offsetY * 5
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);

      if (updated.isZero && onReachZero) {
        onReachZero();
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft, onReachZero]);

  const format2 = (n: number) => n.toString().padStart(2, '0');
  const daysStr = timeLeft.days.toString();
  const hoursStr = format2(timeLeft.hours);
  const minsStr = format2(timeLeft.minutes);
  const secsStr = format2(timeLeft.seconds);

  // Calculate Ring Stroke Offset based on Days remaining (assuming 30-day target cycle)
  const totalDaysCycle = 30;
  const clampedDays = Math.min(totalDaysCycle, Math.max(0, timeLeft.days));
  const progressRatio = clampedDays / totalDaysCycle;
  const strokeDashoffset = 314 * (1 - progressRatio);

  return (
    <div className={`ring-timer-stage-light ${className}`}>
      {/* ── LIGHT MODE TIMER CARD CONTAINER ───────────────────────────── */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`
        }}
        className="ring-timer-card-light"
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
              <circle
                className="ring-progress-light"
                cx="60"
                cy="60"
                r="50"
                stroke="url(#ringGradientLight)"
                style={{ strokeDashoffset }}
              />
            </svg>

            <div className="days-ring-center">
              <span className="days-value-light">
                {daysStr.split('').map((char, i) => (
                  <DigitCell key={`d-${i}`} value={char} />
                ))}
              </span>
              <span className="days-label-light">DAYS</span>
            </div>
          </div>

          {/* RIGHT HORIZONTAL TIME READOUT (HOURS : MINUTES : SECONDS) */}
          <div className="time-readout-group-light">
            {/* HOURS */}
            <div className="time-col-light">
              <span className="col-label-light">HOURS</span>
              <span className="col-value-light">
                <DigitCell value={hoursStr[0]} />
                <DigitCell value={hoursStr[1]} />
              </span>
            </div>

            <span className="readout-colon-light">:</span>

            {/* MINUTES */}
            <div className="time-col-light">
              <span className="col-label-light">MINUTES</span>
              <span className="col-value-light">
                <DigitCell value={minsStr[0]} />
                <DigitCell value={minsStr[1]} />
              </span>
            </div>

            <span className="readout-colon-light">:</span>

            {/* SECONDS */}
            <div className="time-col-light">
              <span className="col-label-light">SECONDS</span>
              <span className="col-value-light seconds-value-light">
                <DigitCell value={secsStr[0]} />
                <DigitCell value={secsStr[1]} />
              </span>
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

      {/* ── PREMIUM LIGHT MODE STYLES & MICRO-INTERACTIONS ─────────── */}
      <style>{`
        /* ── PAGE REVEAL & ENTRANCE STAGGER ───────────────────────────── */
        .ring-timer-stage-light {
          width: 100%;
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          user-select: none;
          perspective: 1000px;
        }

        .ring-timer-card-light {
          width: 100%;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border-radius: 36px;
          border: 1px solid #E8E3DA;
          box-shadow:
            0 28px 70px -10px rgba(22, 42, 59, 0.12),
            0 10px 36px rgba(255, 107, 61, 0.08);
          padding: 44px 56px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          will-change: transform, box-shadow;
          transition:
            transform 250ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 250ms cubic-bezier(0.16, 1, 0.3, 1),
            background-color 250ms ease,
            border-color 250ms ease;
          animation: cardSlideUpIn 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes cardSlideUpIn {
          0% {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        /* CARD HOVER EFFECT */
        .ring-timer-card-light:hover {
          transform: translate3d(0, -6px, 0) scale(1.01) !important;
          box-shadow:
            0 36px 80px -10px rgba(22, 42, 59, 0.18),
            0 14px 44px rgba(255, 107, 61, 0.16);
          border-color: rgba(255, 107, 61, 0.35);
          background: rgba(255, 255, 255, 0.98);
        }

        /* CONTENT STAGGER */
        .ring-timer-content-light {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 52px;
          width: 100%;
        }

        /* SECTION STAGGER ENTRANCES */
        .days-ring-wrapper {
          position: relative;
          width: 170px;
          height: 170px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
          animation: sectionFadeIn 800ms cubic-bezier(0.16, 1, 0.3, 1) 0ms forwards;
        }

        .days-ring-wrapper:hover {
          transform: rotate(5deg) scale(1.03);
        }

        .time-col-light:nth-child(1) { animation: sectionFadeIn 800ms cubic-bezier(0.16, 1, 0.3, 1) 80ms forwards; }
        .time-col-light:nth-child(3) { animation: sectionFadeIn 800ms cubic-bezier(0.16, 1, 0.3, 1) 160ms forwards; }
        .time-col-light:nth-child(5) { animation: sectionFadeIn 800ms cubic-bezier(0.16, 1, 0.3, 1) 240ms forwards; }

        @keyframes sectionFadeIn {
          0% { opacity: 0; transform: translate3d(0, 10px, 0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        /* CIRCULAR RING SVG & SMOOTH ARC TRANSITIONS */
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
          transition: stroke-dashoffset 700ms cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 0 4px rgba(255, 107, 61, 0.3));
        }

        .days-ring-wrapper:hover .ring-progress-light {
          filter: drop-shadow(0 0 8px rgba(255, 107, 61, 0.65));
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
          display: inline-flex;
        }

        .days-label-light {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #64748B;
          margin-top: 4px;
          opacity: 0.7;
          transition: opacity 200ms ease;
        }

        .days-ring-wrapper:hover .days-label-light {
          opacity: 1;
        }

        /* TIME READOUT GROUP & HOVER BLOCK SCALING */
        .time-readout-group-light {
          display: flex;
          align-items: flex-end;
          gap: 28px;
        }

        .time-col-light {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 12px;
          border-radius: 16px;
          transition:
            transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
            background-color 200ms ease;
        }

        .time-col-light:hover {
          transform: scale(1.05);
          background-color: rgba(255, 255, 255, 0.8);
        }

        .col-label-light {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #64748B;
          margin-bottom: 12px;
          text-transform: uppercase;
          opacity: 0.6;
          transition: opacity 200ms ease, color 200ms ease;
        }

        .time-col-light:hover .col-label-light {
          opacity: 1;
          color: #162A3B;
        }

        .col-value-light {
          font-family: 'JetBrains Mono', 'SF Mono', monospace;
          font-size: 68px;
          font-weight: 900;
          color: #162A3B;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
          display: inline-flex;
        }

        .seconds-value-light {
          color: #FF6B3D;
          transition: filter 200ms ease;
        }

        .time-col-light:hover .seconds-value-light {
          filter: drop-shadow(0 0 10px rgba(255, 107, 61, 0.6));
        }

        .readout-colon-light {
          font-size: 54px;
          font-weight: 700;
          color: #FF6B3D;
          opacity: 0.85;
          margin-bottom: 6px;
        }

        /* DIGIT SLIDE & FADE ANIMATION CELL */
        .digit-cell-wrapper {
          position: relative;
          display: inline-block;
          overflow: hidden;
          height: 1em;
          vertical-align: bottom;
        }

        .digit-val {
          display: inline-block;
          will-change: transform, opacity;
        }

        .digit-val-enter {
          animation: digitSlideIn 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .digit-val-exit {
          position: absolute;
          left: 0;
          top: 0;
          animation: digitSlideOut 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes digitSlideIn {
          0% {
            opacity: 0;
            transform: translate3d(0, 8px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes digitSlideOut {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
          100% {
            opacity: 0;
            transform: translate3d(0, -8px, 0);
          }
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
          transition: transform 200ms ease, box-shadow 200ms ease;
        }

        .modal-action-btn:hover {
          transform: translate3d(0, -2px, 0) scale(1.02);
          box-shadow: 0 4px 14px rgba(255, 107, 61, 0.4);
        }

        /* ── ACCESSIBILITY: PREFERS-REDUCED-MOTION ──────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .ring-timer-card-light,
          .days-ring-wrapper,
          .time-col-light,
          .digit-val,
          .ring-progress-light {
            animation: none !important;
            transition: opacity 250ms ease !important;
            transform: none !important;
          }
          .digit-val-enter {
            animation: fadeInSimple 250ms ease forwards !important;
          }
          @keyframes fadeInSimple {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        }

        @media (max-width: 640px) {
          .ring-timer-card-light {
            padding: 24px 18px;
            border-radius: 24px;
          }
          .ring-timer-content-light {
            gap: 20px;
          }
          .days-ring-wrapper {
            width: 110px;
            height: 110px;
          }
          .days-value-light {
            font-size: 38px;
          }
          .days-label-light {
            font-size: 11px;
          }
          .time-readout-group-light {
            gap: 12px;
          }
          .col-value-light {
            font-size: 38px;
          }
          .col-label-light {
            font-size: 10px;
            margin-bottom: 6px;
          }
          .readout-colon-light {
            font-size: 32px;
            margin-bottom: 2px;
          }
        }

        @media (max-width: 400px) {
          .ring-timer-card-light {
            padding: 20px 12px;
          }
          .ring-timer-content-light {
            flex-direction: column;
            gap: 16px;
          }
          .days-ring-wrapper {
            width: 100px;
            height: 100px;
          }
          .days-value-light {
            font-size: 34px;
          }
          .time-readout-group-light {
            gap: 10px;
          }
          .col-value-light {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
};

