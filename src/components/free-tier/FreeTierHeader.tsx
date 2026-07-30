import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { entitlementService } from '../../services/entitlementService';
import { AuraLogo } from './AuraBackground';

interface FreeTierHeaderProps {
  title?: string;
}

export const FreeTierHeader: React.FC<FreeTierHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sub = entitlementService.getSubscription(user);
  const isPro = sub.plan === 'pro' && sub.status === 'active';

  const [workspaceName, setWorkspaceName] = useState<string>('Workspace');

  // Sync workspace name live
  useEffect(() => {
    const syncWorkspaceName = () => {
      const savedName = localStorage.getItem('kontagi_workspace_name');
      if (savedName) {
        setWorkspaceName(savedName);
      } else if (user?.name) {
        setWorkspaceName(`${user.name}'s Workspace`);
      } else {
        setWorkspaceName('Workspace');
      }
    };

    syncWorkspaceName();
    window.addEventListener('kontagi-settings-updated', syncWorkspaceName);
    window.addEventListener('storage', syncWorkspaceName);
    return () => {
      window.removeEventListener('kontagi-settings-updated', syncWorkspaceName);
      window.removeEventListener('storage', syncWorkspaceName);
    };
  }, [user]);

  const displayTitle = title || workspaceName || 'Workspace';

  // Close dropdown when user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    signOut();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3DA] bg-[#FAF8F3]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center py-0.5">
          <h2 className="text-lg md:text-xl font-black text-[#162A3B] m-0 tracking-tight">{displayTitle}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          isPro 
            ? 'text-white bg-[#D4A24C] border border-[#D4A24C]/20'
            : 'text-[#FF6B3D] bg-[#FF6B3D]/10 border border-[#FF6B3D]/20'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isPro ? 'bg-white' : 'bg-[#FF6B3D] animate-pulse'}`} />
          {isPro ? 'Pro Workspace' : 'Free Tier Workspace'}
        </span>

        {/* Account Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            className={`group relative inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border shadow-sm active:scale-95 ${
              isOpen
                ? 'bg-white text-[#162A3B] border-[#162A3B]/30 shadow-md ring-2 ring-[#162A3B]/10'
                : 'bg-white hover:bg-[#FAF8F3] text-[#162A3B] border-[#E8E3DA] hover:border-[#162A3B]/30 hover:shadow-md'
            }`}
            onClick={() => setIsOpen(!isOpen)} 
            aria-expanded={isOpen}
            aria-haspopup="true"
            title="Account Options"
          >
            {/* Animated Avatar Icon Badge */}
            <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              isOpen 
                ? 'bg-[#FF6B3D] text-white scale-105 shadow-sm' 
                : 'bg-[#FF6B3D]/10 text-[#FF6B3D] group-hover:bg-[#FF6B3D] group-hover:text-white group-hover:scale-105'
            }`}>
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>

            <span>Account</span>

            {/* Animated Chevron */}
            <svg 
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isOpen ? 'rotate-180 text-[#FF6B3D]' : 'text-[#162A3B]/50 group-hover:text-[#162A3B] group-hover:translate-y-0.5'
              }`} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Animated Premium Dropdown Menu */}
          <div 
            className={`absolute right-0 mt-2.5 w-64 rounded-2xl bg-white border border-[#E8E3DA] shadow-2xl p-2 z-50 transition-all duration-250 ease-out transform origin-top-right ${
              isOpen 
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 scale-95 -translate-y-3 pointer-events-none'
            }`}
          >
            {/* User Profile Header Card */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl border border-[#E8E3DA] bg-[#FAF8F3] mb-1.5">
              <div className="w-9 h-9 rounded-full bg-[#162A3B] text-white flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0">
                {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-[#162A3B] truncate m-0">{user?.name || 'Apple Creator'}</p>
                <p className="text-[11px] font-medium text-[#667085] truncate m-0">{user?.email || 'creator_apple@kontagi.ai'}</p>
              </div>
            </div>

            <div className="space-y-0.5">
              {/* Account Info Option */}
              <button
                className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#162A3B] hover:bg-[#FAF8F3] transition-all text-left"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/settings');
                }}
              >
                <div className="w-7 h-7 rounded-lg bg-[#162A3B]/5 group-hover:bg-[#162A3B]/10 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-[#162A3B] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="flex-1 text-[#162A3B]">Account Info</span>
                <svg className="w-3.5 h-3.5 text-[#162A3B]/40 group-hover:text-[#162A3B] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Settings & Billing Option */}
              <button
                className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#162A3B] hover:bg-[#FAF8F3] transition-all text-left"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/settings/billing');
                }}
              >
                <div className="w-7 h-7 rounded-lg bg-[#162A3B]/5 group-hover:bg-[#162A3B]/10 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-[#162A3B] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="flex-1 text-[#162A3B]">Settings & Billing</span>
                <svg className="w-3.5 h-3.5 text-[#162A3B]/40 group-hover:text-[#162A3B] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="border-t border-[#E8E3DA] my-1.5" />

            {/* Logout Option */}
            <button
              className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#DC2626] hover:bg-[#FEF2F2] transition-all text-left"
              onClick={handleLogout}
            >
              <div className="w-7 h-7 rounded-lg bg-[#FF6B3D] text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="flex-1 text-[#DC2626]">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
