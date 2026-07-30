import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { entitlementService } from '../../services/entitlementService';
import { freeTierService } from '../../services/freeTierService';
import { AuraLogo } from './AuraBackground';

interface FreeTierSidebarProps {
  currentPath?: string;
}

export const FreeTierSidebar: React.FC<FreeTierSidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const path = currentPath || location.pathname;

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('kontagi_sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('kontagi_sidebar_collapsed', String(next));
      return next;
    });
  };

  const isScriptActive = path.startsWith('/script-intelligence') || path.startsWith('/upload');
  const isLibraryActive = path.startsWith('/script-library');
  const isBillingActive = path.startsWith('/settings/billing') || path.startsWith('/pricing');
  const isSettingsActive = path === '/settings';
  const isSupportActive = path.startsWith('/support') || path.startsWith('/help');

  const sub = entitlementService.getSubscription(user);
  const isPro = (sub.plan === 'pro' && sub.status === 'active') || freeTierService.isProActive();

  const handleUpgradeClick = () => {
    navigate('/pricing?source=sidebar');
  };

  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (clickTimerRef.current) {
      // Fast second click detected! Clear timer and redirect to home page
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      navigate('/script-intelligence');
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickTimerRef.current = null;
      toggleCollapse();
    }, 250);
  };

  const handleLogoDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    navigate('/script-intelligence');
  };

  return (
    <aside 
      className={`hidden md:flex flex-col justify-between sticky top-0 h-screen bg-[#162A3B] text-white transition-all duration-220 ease-in-out flex-shrink-0 z-20 overflow-x-hidden ${
        isCollapsed ? 'w-[72px] px-2 py-6' : 'w-[280px] px-0 pt-6 pb-0'
      }`}
    >
      <div className="flex flex-col gap-6 px-4">
        {/* Header with Kontagi Logo (Single click toggles collapse, double click redirects to Home Page) */}
        <div className={`pt-1 pb-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
          <button
            type="button"
            onClick={handleLogoClick}
            onDoubleClick={handleLogoDoubleClick}
            className={`flex items-center gap-3 p-2 rounded-xl text-white hover:bg-white/10 transition-all duration-200 focus:outline-none cursor-pointer select-none group ${
              isCollapsed ? 'w-11 h-11 justify-center mx-auto' : 'w-full justify-start'
            }`}
            title="Single click to toggle sidebar • Double click to go to Home Page"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <AuraLogo size="lg" darkBackground={true} showText={!isCollapsed} />
          </button>
        </div>

        {/* Navigation Group */}
        <div className="flex flex-col gap-1.5">
          {/* Section Label (Visible in Expanded Mode) */}
          {!isCollapsed ? (
            <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest px-3 mb-1 flex items-center justify-between transition-opacity duration-150">
              <span>WORKSPACE</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${isPro ? 'bg-[#D4A24C] text-white' : 'bg-white/10 text-white/80'}`}>
                {isPro ? 'PRO' : 'FREE'}
              </span>
            </div>
          ) : (
            <div className="flex justify-center mb-1">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${isPro ? 'bg-[#D4A24C] text-white' : 'bg-white/10 text-white/80'}`}>
                {isPro ? 'PRO' : 'FREE'}
              </span>
            </div>
          )}

          {/* WORKSPACE SECTION */}
          {/* Script Studio */}
          <button 
            className={`flex items-center rounded-lg font-medium text-sm transition-all text-left ${
              isCollapsed ? 'justify-center p-2.5 mx-auto w-11 h-11' : 'gap-3 px-3.5 py-2.5 w-full'
            } ${
              isScriptActive && !path.includes('results') && !path.includes('review')
                ? 'bg-white/10 text-white font-semibold border-l-[3px] border-[#FF6B3D] rounded-l-none'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => navigate('/script-intelligence')}
            title="Script Studio"
          >
            <svg className="w-4 h-4 text-[#FF6B3D] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
            </svg>
            {!isCollapsed && <span className="truncate">Script Studio</span>}
          </button>

          {/* My Library */}
          <button 
            className={`flex items-center rounded-lg font-medium text-sm transition-all text-left ${
              isCollapsed ? 'justify-center p-2.5 mx-auto w-11 h-11' : 'gap-3 px-3.5 py-2.5 w-full'
            } ${
              isLibraryActive
                ? 'bg-white/10 text-white font-semibold border-l-[3px] border-[#FF6B3D] rounded-l-none'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => navigate('/script-library')}
            title="My Library"
          >
            <svg className="w-4 h-4 text-white/75 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {!isCollapsed && <span className="truncate">My Library</span>}
          </button>

          {/* Plans & Billing */}
          <button 
            className={`flex items-center rounded-lg font-medium text-sm transition-all text-left ${
              isCollapsed ? 'justify-center p-2.5 mx-auto w-11 h-11' : 'gap-3 px-3.5 py-2.5 w-full'
            } ${
              isBillingActive
                ? 'bg-white/10 text-white font-semibold border-l-[3px] border-[#FF6B3D] rounded-l-none'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => navigate('/settings/billing')}
            title="Plans & Billing"
          >
            <svg className="w-4 h-4 text-[#D4A24C] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {!isCollapsed && <span className="truncate">Plans & Billing</span>}
          </button>

          {/* PRO LABORATORY SECTION */}
          {!isCollapsed ? (
            <div className="text-[10px] font-bold text-[#D4A24C] uppercase tracking-widest px-3 mt-4 mb-1">
              PRO LABORATORY
            </div>
          ) : (
            <div className="my-2 border-t border-white/10" />
          )}

          {[
            { label: 'Simulation Studio', icon: '⚡', path: '/pro/simulation' },
            { label: 'Content DNA', icon: '🧬', path: '/pro/content-dna' },
            { label: 'AI Viewer Swarm', icon: '👥', path: '/pro/viewers' },
            { label: 'AuraWorld OS', icon: '🌐', path: '/pro/world' },
            { label: 'Recommendation Engine', icon: '⚙️', path: '/pro/recommendation' },
            { label: 'Trend Intelligence', icon: '📈', path: '/pro/trends' },
            { label: 'Audience Intelligence', icon: '🎯', path: '/pro/audience' },
            { label: 'Behavior Engine', icon: '🧠', path: '/pro/behavior' },
            { label: 'Community Graph', icon: '🕸️', path: '/pro/community' },
            { label: 'Reports', icon: '📊', path: '/pro/reports' }
          ].map(item => {
            const isActive = path === item.path;
            return (
              <button
                key={item.path}
                className={`flex items-center rounded-lg font-medium text-sm transition-all text-left ${
                  isCollapsed ? 'justify-center p-2.5 mx-auto w-11 h-11' : 'gap-3 px-3.5 py-2 w-full'
                } ${
                  isActive
                    ? 'bg-[#FF6B3D]/20 text-white font-bold border-l-[3px] border-[#FF6B3D] rounded-l-none'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => navigate(item.path)}
                title={item.label}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col mt-auto w-full">
        {/* Settings button */}
        <div className={isCollapsed ? 'px-2 pb-2' : 'px-4 pb-2'}>
          <button 
            className={`flex items-center rounded-lg text-xs font-medium transition-all text-left w-full ${
              isCollapsed ? 'justify-center p-2.5 mx-auto w-11 h-11' : 'gap-3 px-3.5 py-2'
            } ${
              isSettingsActive
                ? 'bg-white/10 text-white font-semibold border-l-[3px] border-[#FF6B3D] rounded-l-none'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => navigate('/settings')}
            title="Settings"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {!isCollapsed && <span className="truncate">Settings</span>}
          </button>
        </div>

        {/* Integrated 56px Single-Row Navigation Card (Expanded) */}
        {!isPro && !isCollapsed && (
          <div className="px-4 pb-6 mt-auto w-full">
            <div 
              onClick={handleUpgradeClick}
              className="kontagi-pro-nav-card"
              title="Upgrade to KONTAGI Pro"
            >
              <div className="kontagi-pro-nav-brand-container">
                <img 
                  src="/assets/branding/kontagi-k-mark.svg" 
                  alt="KONTAGI Mark" 
                  className="w-[24px] h-[24px] object-contain flex-shrink-0"
                />
                <div className="kontagi-pro-nav-text-group">
                  <span className="kontagi-pro-nav-brand">KONTAGI</span>
                  <span className="kontagi-pro-nav-accent">PRO</span>
                </div>
              </div>
              <span className="kontagi-pro-nav-arrow">
                →
              </span>
            </div>
          </div>
        )}

        {/* Collapsed Upgrade Trigger (When collapsed & non-Pro) */}
        {!isPro && isCollapsed && (
          <div className="pb-6 pt-2">
            <button
              onClick={handleUpgradeClick}
              className="mx-auto w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Upgrade to KONTAGI Pro"
            >
              <img 
                src="/assets/branding/kontagi-k-mark.svg" 
                alt="KONTAGI Pro K Mark" 
                className="w-[22px] h-[22px] object-contain flex-shrink-0"
              />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
