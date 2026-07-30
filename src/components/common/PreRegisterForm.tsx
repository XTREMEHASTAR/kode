import React, { useState } from 'react';
import { ComingSoonService, WaitlistEntry } from '../../services/comingSoonService';

interface PreRegisterFormProps {
  onSuccess?: (ticket: WaitlistEntry) => void;
  theme?: 'off-white' | 'dark-cyber' | 'nothing-glass' | 'stripe-neon';
}

export const PreRegisterForm: React.FC<PreRegisterFormProps> = ({
  onSuccess,
  theme = 'off-white'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    useCase: 'Content Creator'
  });

  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<WaitlistEntry | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('KONTAGI_USER_VIP_TICKET');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await ComingSoonService.registerWaitlist({
        ...formData,
        referralSource: 'VIP Direct Access Pass'
      });
      if (res.success) {
        setTicket(res.ticket);
        if (typeof window !== 'undefined') {
          localStorage.setItem('KONTAGI_USER_VIP_TICKET', JSON.stringify(res.ticket));
        }
        if (onSuccess) onSuccess(res.ticket);
      }
    } catch (err) {
      setErrorMsg('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPass = () => {
    if (!ticket) return;
    const text = `I just reserved VIP Early Access Pass #${ticket.ticketNumber} for Kontagi Secret AI Lab! Claim yours: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="ticket-container">
      {/* TICKET LEFT & RIGHT NOTCH CUTOUTS */}
      <div className="ticket-notch notch-left" />
      <div className="ticket-notch notch-right" />

      {!ticket ? (
        <form onSubmit={handleSubmit} className="ticket-form">
          {/* TICKET STUB HEADER */}
          <div className="ticket-header">
            <div className="ticket-badge-row">
              <span className="ticket-vip-tag">🎟️ ADMIT ONE</span>
              <span className="ticket-serial-tag">NO. 8820-VIP</span>
            </div>
            <h3 className="ticket-title">KONTAGI SECRET AI LAB</h3>
            <p className="ticket-subtitle">EARLY ACCESS BOARDING PASS</p>
          </div>

          {/* PERFORATED DASHED TEAR LINE */}
          <div className="ticket-perforation">
            <div className="perforated-dots" />
          </div>

          {/* TICKET BODY: MINIMAL FIELDS */}
          <div className="ticket-body">
            {errorMsg && <div className="ticket-error">⚠️ {errorMsg}</div>}

            {/* FIELD 1: FULL NAME */}
            <div className="ticket-field">
              <label className="ticket-label">PASS HOLDER NAME *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Rivera"
                className="ticket-input"
              />
            </div>

            {/* FIELD 2: EMAIL ADDRESS */}
            <div className="ticket-field">
              <label className="ticket-label">REGISTRATION EMAIL *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@company.com"
                className="ticket-input"
              />
            </div>

            {/* FIELD 3: PRIMARY ROLE / USE CASE */}
            <div className="ticket-field">
              <label className="ticket-label">PRIMARY ROLE *</label>
              <select
                value={formData.useCase}
                onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                className="ticket-input ticket-select"
              >
                <option value="Content Creator">🎥 Content Creator</option>
                <option value="Agency & Production">🎬 Agency & Production</option>
                <option value="Brand Marketer">🎯 Brand Marketer</option>
                <option value="AI Researcher">🔬 AI Researcher</option>
                <option value="Developer & API">💻 Developer & API</option>
                <option value="Enterprise Team">🏢 Enterprise Team</option>
              </select>
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" disabled={loading} className="ticket-claim-btn">
              {loading ? (
                <span>ISSUING PASS...</span>
              ) : (
                <>
                  <span>🎟️ CLAIM VIP TICKET PASS</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>

          {/* FOOTER BARCODE ACCENT */}
          <div className="ticket-barcode-row">
            <div className="barcode-lines">
              {Array.from({ length: 22 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i % 3 === 0 ? '3px' : '1.5px',
                    height: '20px',
                    backgroundColor: i % 4 === 0 ? '#FF6B3D' : '#475569'
                  }}
                />
              ))}
            </div>
            <span className="barcode-code">PASS-2026-VIP</span>
          </div>
        </form>
      ) : (
        /* CLAIMED ISSUED TICKET PASS */
        <div className="claimed-ticket-pass">
          <div className="ticket-header">
            <div className="ticket-badge-row">
              <span className="ticket-vip-tag success">✓ ISSUED & CONFIRMED</span>
              <span className="ticket-serial-tag">#{ticket.ticketNumber}</span>
            </div>
            <h3 className="ticket-title">KONTAGI VIP ACCESS TICKET</h3>
            <p className="ticket-subtitle">PRESENT THIS PASS UPON LAUNCH</p>
            <div style={{ marginTop: '8px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontSize: '11.5px', fontWeight: 700 }}>
              📧 VIP Pass Confirmation sent to <strong>{ticket.email}</strong>
            </div>
          </div>

          <div className="ticket-perforation">
            <div className="perforated-dots" />
          </div>

          <div className="ticket-claimed-body">
            <div className="claimed-grid">
              <div>
                <span className="claimed-label">PASS HOLDER</span>
                <strong className="claimed-val">{ticket.name}</strong>
              </div>
              <div>
                <span className="claimed-label">PRIMARY ROLE</span>
                <strong className="claimed-val">{ticket.useCase}</strong>
              </div>
              <div>
                <span className="claimed-label">EMAIL</span>
                <span className="claimed-subval">{ticket.email}</span>
              </div>
              <div>
                <span className="claimed-label">BONUS CREDITS</span>
                <span className="claimed-subval highlight">🎁 100 AI CREDITS</span>
              </div>
            </div>

            {/* BARCODE WATERMARK */}
            <div className="claimed-barcode">
              <div className="barcode-lines">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i % 2 === 0 ? '3px' : '1.5px',
                      height: '28px',
                      backgroundColor: i % 3 === 0 ? '#FF6B3D' : '#0F172A'
                    }}
                  />
                ))}
              </div>
              <span className="claimed-pass-id">ID: {ticket.id}</span>
            </div>

            <div className="claimed-actions">
              <button onClick={handleCopyPass} className="claimed-share-btn">
                {copied ? '✓ PASS LINK COPIED!' : '📋 SHARE PASS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES FOR AUTHENTIC TICKET STUB */}
      <style>{`
        .ticket-container {
          position: relative;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          background: #FFFFFF;
          border-radius: 20px;
          border: 1.5px solid #E2E8F0;
          box-shadow: 
            0 24px 48px -12px rgba(255, 107, 61, 0.16),
            0 8px 24px -4px rgba(15, 23, 42, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          overflow: hidden;
          box-sizing: border-box;
        }

        /* NOTCH CUTOUTS ON SIDES */
        .ticket-notch {
          position: absolute;
          top: 86px;
          width: 20px;
          height: 20px;
          background-color: #FAF7F2;
          border-radius: 50%;
          z-index: 20;
          border: 1.5px solid #CBD5E1;
        }
        .notch-left { left: -11px; }
        .notch-right { right: -11px; }

        .ticket-form, .claimed-ticket-pass {
          padding: 28px 28px 24px 28px;
        }

        .ticket-header {
          text-align: center;
          margin-bottom: 16px;
        }

        .ticket-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .ticket-vip-tag {
          padding: 4px 10px;
          border-radius: 6px;
          background-color: rgba(255, 107, 61, 0.12);
          color: '#FF6B3D';
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #FF6B3D;
        }

        .ticket-vip-tag.success {
          background-color: rgba(16, 185, 129, 0.12);
          color: #10B981;
        }

        .ticket-serial-tag {
          font-family: monospace;
          font-size: 11px;
          font-weight: 800;
          color: #64748B;
          letter-spacing: 0.08em;
        }

        .ticket-title {
          font-size: 19px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 2px 0;
          letter-spacing: -0.01em;
        }

        .ticket-subtitle {
          font-size: 11px;
          font-weight: 700;
          color: #FF6B3D;
          letter-spacing: 0.12em;
          margin: 0;
        }

        /* PERFORATED LINE */
        .ticket-perforation {
          margin: 16px 0;
          height: 1px;
          border-bottom: 2px dashed #CBD5E1;
          position: relative;
        }

        .ticket-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .ticket-error {
          padding: 8px 12px;
          border-radius: 8px;
          background-color: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
          font-size: 12px;
          font-weight: 600;
        }

        .ticket-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ticket-label {
          font-size: 10px;
          font-weight: 800;
          color: #64748B;
          letter-spacing: 0.08em;
        }

        .ticket-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1.5px solid #E2E8F0;
          background-color: #F8FAFC;
          color: #0F172A;
          font-size: 13.5px;
          font-weight: 600;
          outline: none;
          box-sizing: border-box;
          transition: all 0.15s ease;
        }

        .ticket-input:focus {
          border-color: #FF6B3D;
          background-color: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(255, 107, 61, 0.15);
        }

        .ticket-select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23FF6B3D' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 14px 14px;
          padding-right: 36px;
          cursor: pointer;
        }

        .ticket-claim-btn {
          margin-top: 6px;
          padding: 13px 20px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #FF6B3D 0%, #FF855D 100%);
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.04em;
          cursor: pointer;
          box-shadow: 0 8px 20px -4px rgba(255, 107, 61, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .ticket-claim-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px -4px rgba(255, 107, 61, 0.5);
        }

        .ticket-barcode-row {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .barcode-lines {
          display: flex;
          gap: 3px;
          align-items: center;
        }

        .barcode-code {
          font-family: monospace;
          font-size: 10px;
          font-weight: 800;
          color: #94A3B8;
          letter-spacing: 0.1em;
        }

        /* CLAIMED PASS STATE */
        .claimed-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background-color: #F8FAFC;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          margin-bottom: 16px;
          text-align: left;
        }

        .claimed-label {
          display: block;
          font-size: 9px;
          font-weight: 800;
          color: #64748B;
          letter-spacing: 0.08em;
        }

        .claimed-val {
          font-size: 13px;
          font-weight: 800;
          color: #0F172A;
        }

        .claimed-subval {
          font-size: 12px;
          color: #475569;
          font-weight: 600;
        }

        .claimed-subval.highlight {
          color: #FF6B3D;
          font-weight: 800;
        }

        .claimed-barcode {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background-color: #F1F5F9;
          border-radius: 10px;
          margin-bottom: 16px;
        }

        .claimed-pass-id {
          font-family: monospace;
          font-size: 10px;
          font-weight: 800;
          color: #0F172A;
        }

        .claimed-actions {
          display: flex;
          gap: 10px;
        }

        .claimed-share-btn {
          flex: 1;
          padding: 11px;
          border-radius: 8px;
          background-color: #FF6B3D;
          color: #FFFFFF;
          border: none;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .claimed-reset-btn {
          padding: 11px 16px;
          border-radius: 8px;
          background-color: transparent;
          color: #64748B;
          border: 1px solid #CBD5E1;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
