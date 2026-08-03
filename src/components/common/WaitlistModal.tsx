import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, Sparkles, X, ShieldCheck } from 'lucide-react';
import { WaitlistService } from '../../services/waitlistService';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'off-white' | 'dark-cyber';
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  theme = 'off-white'
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusState, setStatusState] = useState<'idle' | 'success' | 'duplicate' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const isDark = theme === 'dark-cyber';

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setStatusState('idle');
      setMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setStatusState('idle');
    setMessage('');

    try {
      const res = await WaitlistService.submitEmail(email);
      if (res.success) {
        setStatusState('success');
        setMessage(res.message || "✅ You're on the waitlist!");
      } else {
        setStatusState('error');
        setMessage(res.message || 'Unable to submit. Please check your email.');
      }
    } catch (err) {
      setStatusState('error');
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="waitlist-modal-overlay" onClick={onClose}>
      <div
        className={`waitlist-modal-card ${isDark ? 'dark-theme' : 'light-theme'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {statusState === 'success' ? (
          /* SUCCESS STATE */
          <div className="state-container success-state">
            <div className="success-icon-badge">
              <CheckCircle2 size={36} color="#10B981" />
            </div>
            <h3 className="modal-title">✅ You're on the waitlist!</h3>
            <p className="modal-description">
              We'll notify you when <strong>KONTAGI</strong> launches.
            </p>

            <button className="done-btn" onClick={onClose}>
              Awesome, thanks!
            </button>
          </div>
        ) : (
          /* INPUT / ERROR FORM STATE */
          <div className="state-container">
            <div className="modal-badge-row">
              <span className="vip-badge">
                <Sparkles size={13} /> VIP Early Access
              </span>
            </div>

            <h3 className="modal-title">Join the KONTAGI Waitlist</h3>
            <p className="modal-description">
              Be the first to unlock AI retention analytics and script intelligence before public launch.
            </p>

            {statusState === 'error' && message && (
              <div className="alert-box error-alert">
                <AlertCircle size={16} />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="waitlist-form">
              <div className="input-group">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email..."
                  className="email-input"
                  disabled={loading}
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <>
                    <Loader2 size={18} className="spinner-icon" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Join Waitlist</span>
                )}
              </button>
            </form>

            <div className="privacy-notice">

              <ShieldCheck size={14} />
              <span>Zero spam. Unsubscribe anytime. Your data is secure.</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .waitlist-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
          animation: overlayFadeIn 250ms ease forwards;
        }

        .waitlist-modal-card {
          width: 100%;
          max-width: 440px;
          max-height: 90vh;
          overflow-y: auto;
          background: #FFFFFF;
          border-radius: 24px;
          padding: 32px 28px;
          box-sizing: border-box;
          position: relative;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8);
          animation: cardSlideUp 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }


        .dark-theme.waitlist-modal-card {
          background: #162A3B;
          color: #F8FAFC;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.05);
          border: none;
          color: #64748B;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 200ms ease;
        }

        .dark-theme .close-btn {
          background: rgba(255, 255, 255, 0.08);
          color: #94A3B8;
        }

        .close-btn:hover {
          background: rgba(15, 23, 42, 0.12);
          color: #0F172A;
        }

        .state-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .modal-badge-row {
          margin-bottom: 14px;
        }

        .vip-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 9999px;
          background: rgba(255, 107, 53, 0.1);
          color: #FF6B35;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid rgba(255, 107, 53, 0.2);
        }

        .modal-title {
          font-family: 'Satoshi', 'General Sans', system-ui, sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 8px 0;
          letter-spacing: -0.02em;
        }

        .dark-theme .modal-title {
          color: #F8FAFC;
        }

        .modal-description {
          font-size: 14px;
          line-height: 1.55;
          color: #64748B;
          margin: 0 0 24px 0;
        }

        .dark-theme .modal-description {
          color: #94A3B8;
        }

        .alert-box {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          box-sizing: border-box;
          animation: alertShake 300ms ease forwards;
        }

        .duplicate-alert {
          background: rgba(245, 158, 11, 0.1);
          color: #D97706;
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .error-alert {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        .waitlist-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .input-group {
          position: relative;
          width: 100%;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
          pointer-events: none;
        }

        .email-input {
          width: 100%;
          height: 48px;
          padding: 0 16px 0 42px;
          border-radius: 14px;
          border: 1.5px solid #E2E8F0;
          background: #F8FAFC;
          font-size: 14px;
          color: #0F172A;
          box-sizing: border-box;
          outline: none;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }

        .dark-theme .email-input {
          border-color: rgba(255, 255, 255, 0.15);
          background: rgba(15, 23, 42, 0.6);
          color: #F8FAFC;
        }

        .email-input:focus {
          border-color: #FF6B35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
        }

        .submit-btn {
          width: 100%;
          height: 48px;
          border-radius: 14px;
          background: #FF6B3D;
          color: #FFFFFF;
          border: none;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease, opacity 200ms ease;
          box-shadow: 0 4px 14px rgba(255, 107, 61, 0.35);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translate3d(0, -2px, 0);
          background: #E05523;
          box-shadow: 0 6px 20px rgba(255, 107, 61, 0.45);
        }

        .submit-btn:disabled {
          background: #FF6B3D;
          opacity: 0.85;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255, 107, 61, 0.2);
        }


        .spinner-icon {
          animation: spin 1s linear infinite;
        }

        .privacy-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: #94A3B8;
        }

        /* SUCCESS STATE STYLES */
        .success-icon-badge {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          animation: popScale 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .done-btn {
          width: 100%;
          height: 46px;
          border-radius: 14px;
          background: #0F172A;
          color: #FFFFFF;
          border: none;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          margin-top: 12px;
          transition: background-color 200ms ease;
        }

        .dark-theme .done-btn {
          background: #FF6B35;
        }

        .done-btn:hover {
          opacity: 0.9;
        }

        /* ANIMATIONS */
        @keyframes overlayFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes cardSlideUp {
          0% { opacity: 0; transform: translate3d(0, 24px, 0) scale(0.96); }
          100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes popScale {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes alertShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
