import React from 'react';
import { SuggestionItem } from '../../types/freeTier';

interface SuggestionCardProps {
  suggestions: SuggestionItem[];
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="aura-card" style={{ borderLeft: '4px solid #10B981', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '18px' }}>✨</span>
          <h3 className="ft-card-title" style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px', fontWeight: 700 }}>
            No critical hook issues detected
          </h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.5', margin: 0 }}>
          Your opening already uses strong attention, specificity and relevance signals. You can still explore alternative creative angles with AI Copilot.
        </p>
      </div>
    );
  }

  return (
    <div className="aura-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <h3 className="ft-card-title" style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>Suggestions</h3>
      <div className="ft-suggestion-list">
        {suggestions.map((sug, idx) => (
          <div key={idx} className="ft-suggestion-item">
            <div className="ft-suggestion-number">{idx + 1}</div>
            <div className="ft-suggestion-details">
              <h4 className="ft-suggestion-title">{sug.title}</h4>
              <p className="ft-suggestion-explanation">{sug.explanation}</p>
              {sug.example && (
                <p className="ft-suggestion-example">{sug.example}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
