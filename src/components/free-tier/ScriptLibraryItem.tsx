import React, { useState, useEffect, useRef } from 'react';
import { FreeTierScript } from '../../types/freeTier';
import { HookScoreGauge } from './HookScoreGauge';
import { analyzeScriptText } from '../../services/scriptAnalysisEngine';

interface ScriptLibraryItemProps {
  script: FreeTierScript;
  onSelect: (id: string) => void;
  onRename: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onDownloadReport?: (id: string) => void;
}

export const ScriptLibraryItem: React.FC<ScriptLibraryItemProps> = ({
  script,
  onSelect,
  onRename,
  onToggleFavorite,
  onDelete,
  onDownloadReport
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayScore = script.hookScore || script.analysisResult?.hookScore || (script.scriptText ? analyzeScriptText(script.scriptText, script.contentType).hookScore : 0);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    setMenuOpen(false);
    action();
  };

  // Humanize timestamps relatively
  const getRelativeTimeString = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
      
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      const days = Math.floor(hours / 24);
      if (days === 1) return 'Yesterday';
      return `${days} days ago`;
    } catch {
      return 'Analyzed recently';
    }
  };

  return (
    <div className="ft-library-item" onClick={() => onSelect(script.id)}>
      <div className="ft-item-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h4 className="ft-item-title">{script.title}</h4>
          {script.isFavorite && (
            <svg style={{ color: '#F59E0B' }} width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
        </div>
        <p className="ft-item-meta">
          Analyzed {getRelativeTimeString(script.createdAt)}
        </p>
      </div>

      <div className="ft-item-right">
        {/* Compact Hook Score indicator */}
        <HookScoreGauge 
          score={displayScore} 
          status="" 
          supportingText="" 
          size="sm" 
        />

        {/* Three-dot Action Menu */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button className="ft-more-btn" onClick={handleMenuToggle}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {menuOpen && (
            <div className="ft-menu-popover">
              <button className="ft-menu-item" onClick={(e) => handleAction(e, () => onDownloadReport && onDownloadReport(script.id))}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Report
              </button>
              <button className="ft-menu-item" onClick={(e) => handleAction(e, () => onRename(script.id))}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Rename
              </button>
              <button className="ft-menu-item" onClick={(e) => handleAction(e, () => onToggleFavorite(script.id))}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.977-2.888a1 1 0 00-1.176 0l-3.977 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {script.isFavorite ? 'Unfavorite' : 'Favorite'}
              </button>
              <button className="ft-menu-item danger" onClick={(e) => handleAction(e, () => onDelete(script.id))}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
