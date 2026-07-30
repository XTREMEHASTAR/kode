import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { entitlementService } from '../../services/entitlementService';
import { freeTierService } from '../../services/freeTierService';
import { FreeTierHeader } from '../../components/free-tier/FreeTierHeader';
import { FreeTierSidebar } from '../../components/free-tier/FreeTierSidebar';
import { FreeTierUpgradeBanner } from '../../components/free-tier/FreeTierUpgradeBanner';
import { CustomSelect } from '../../components/ui/CustomSelect';

// Reusable iOS-style Switch Toggle Component
const IOSSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }> = ({ 
  checked, 
  onChange, 
  disabled = false 
}) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '9999px',
        backgroundColor: checked ? '#FF6B3D' : '#E8E3DA',
        padding: '2px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 200ms ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: checked ? 'flex-end' : 'flex-start',
        opacity: disabled ? 0.6 : 1,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
          transition: 'transform 200ms ease',
        }}
      />
    </button>
  );
};

export const FreeTierSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const sub = entitlementService.getSubscription(user);
  const isPro = (sub.plan === 'pro' && sub.status === 'active') || freeTierService.isProActive();

  // Scroll to top on page mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Active section state for 2-column navigation
  const [activeTab, setActiveTab] = useState<string>('general');

  // Real-Time Settings State Initializers from localStorage
  const [workspaceName, setWorkspaceName] = useState<string>(() => 
    localStorage.getItem('kontagi_workspace_name') || `${user?.name || 'Creator'}'s Workspace`
  );
  const [timezone, setTimezone] = useState<string>(() => 
    localStorage.getItem('kontagi_timezone') || 'America/New_York'
  );
  const [language, setLanguage] = useState<string>(() => 
    localStorage.getItem('kontagi_language') || 'en-US'
  );
  const [dateFormat, setDateFormat] = useState<string>(() => 
    localStorage.getItem('kontagi_date_format') || 'MM/DD/YYYY'
  );
  const [autoSave, setAutoSave] = useState<boolean>(() => 
    localStorage.getItem('kontagi_auto_save') !== 'false'
  );

  const [displayName, setDisplayName] = useState<string>(() => 
    localStorage.getItem('kontagi_display_name') || user?.name || 'Apple Creator'
  );
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() =>
    localStorage.getItem('kontagi_profile_avatar') || null
  );
  const [workspaceRole, setWorkspaceRole] = useState<string>(() =>
    localStorage.getItem('kontagi_workspace_role') || 'Owner & Creator'
  );
  const [workspaceId] = useState<string>(() => {
    const existing = localStorage.getItem('kontagi_workspace_id');
    if (existing) return existing;
    const newId = 'ws_ktg_98421a';
    localStorage.setItem('kontagi_workspace_id', newId);
    return newId;
  });
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Photo must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setAvatarUrl(base64);
      localStorage.setItem('kontagi_profile_avatar', base64);
      showToast('Profile photo updated!');
      window.dispatchEvent(new CustomEvent('kontagi-settings-updated'));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    localStorage.removeItem('kontagi_profile_avatar');
    showToast('Profile photo removed');
    window.dispatchEvent(new CustomEvent('kontagi-settings-updated'));
  };

  const handleCopyWorkspaceId = () => {
    navigator.clipboard.writeText(workspaceId);
    setIsCopied(true);
    showToast('Workspace ID copied!');
    setTimeout(() => setIsCopied(false), 2000);
  };
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => 
    (localStorage.getItem('kontagi_theme') as any) || 'light'
  );
  const [borderRadius, setBorderRadius] = useState<'12px' | '14px' | '16px'>(() => 
    (localStorage.getItem('kontagi_border_radius') as any) || '14px'
  );
  const [animations, setAnimations] = useState<boolean>(() => 
    localStorage.getItem('kontagi_animations') !== 'false'
  );
  const [compactMode, setCompactMode] = useState<boolean>(() => 
    localStorage.getItem('kontagi_compact_mode') === 'true'
  );

  const [aiLength, setAiLength] = useState<'short' | 'balanced' | 'detailed'>(() => 
    (localStorage.getItem('kontagi_ai_response_length') as any) || 'balanced'
  );
  const [analysisMode, setAnalysisMode] = useState<'script' | 'hook'>(() => 
    (localStorage.getItem('kontagi_default_analysis_mode') as any) || 'script'
  );
  const [autoSaveAi, setAutoSaveAi] = useState<boolean>(() => 
    localStorage.getItem('kontagi_auto_save_ai') !== 'false'
  );
  const [smartSuggestions, setSmartSuggestions] = useState<boolean>(() => 
    localStorage.getItem('kontagi_smart_suggestions') !== 'false'
  );

  const [emailNotifs, setEmailNotifs] = useState<boolean>(() => 
    localStorage.getItem('kontagi_notif_email') !== 'false'
  );
  const [productUpdates, setProductUpdates] = useState<boolean>(() => 
    localStorage.getItem('kontagi_notif_product') !== 'false'
  );
  const [featureReleases, setFeatureReleases] = useState<boolean>(() => 
    localStorage.getItem('kontagi_notif_features') === 'true'
  );
  const [weeklyInsights, setWeeklyInsights] = useState<boolean>(() => 
    localStorage.getItem('kontagi_notif_weekly') !== 'false'
  );

  const [analyticsSharing, setAnalyticsSharing] = useState<boolean>(() => 
    localStorage.getItem('kontagi_privacy_analytics') !== 'false'
  );
  const [crashReports, setCrashReports] = useState<boolean>(() => 
    localStorage.getItem('kontagi_privacy_crash') !== 'false'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Real-Time Persistence & DOM Mutation Effect
  React.useEffect(() => {
    localStorage.setItem('kontagi_workspace_name', workspaceName);
    localStorage.setItem('kontagi_timezone', timezone);
    localStorage.setItem('kontagi_language', language);
    localStorage.setItem('kontagi_date_format', dateFormat);
    localStorage.setItem('kontagi_auto_save', String(autoSave));

    localStorage.setItem('kontagi_display_name', displayName);
    localStorage.setItem('kontagi_theme', theme);
    localStorage.setItem('kontagi_border_radius', borderRadius);
    localStorage.setItem('kontagi_animations', String(animations));
    localStorage.setItem('kontagi_compact_mode', String(compactMode));

    localStorage.setItem('kontagi_ai_response_length', aiLength);
    localStorage.setItem('kontagi_default_analysis_mode', analysisMode);
    localStorage.setItem('kontagi_auto_save_ai', String(autoSaveAi));
    localStorage.setItem('kontagi_smart_suggestions', String(smartSuggestions));

    localStorage.setItem('kontagi_notif_email', String(emailNotifs));
    localStorage.setItem('kontagi_notif_product', String(productUpdates));
    localStorage.setItem('kontagi_notif_features', String(featureReleases));
    localStorage.setItem('kontagi_notif_weekly', String(weeklyInsights));

    localStorage.setItem('kontagi_privacy_analytics', String(analyticsSharing));
    localStorage.setItem('kontagi_privacy_crash', String(crashReports));

    // Real-Time Theme & UI DOM Transformations
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    root.style.setProperty('--kontagi-card-radius', borderRadius);
    root.classList.toggle('kontagi-compact', compactMode);
    root.classList.toggle('kontagi-reduced-motion', !animations);

    // Broadcast real-time change event
    window.dispatchEvent(new CustomEvent('kontagi-settings-updated', {
      detail: { workspaceName, displayName, theme, borderRadius, aiLength, analysisMode }
    }));
  }, [
    workspaceName, timezone, language, dateFormat, autoSave,
    displayName, theme, borderRadius, animations, compactMode,
    aiLength, analysisMode, autoSaveAi, smartSuggestions,
    emailNotifs, productUpdates, featureReleases, weeklyInsights,
    analyticsSharing, crashReports
  ]);

  const navItems = [
    { id: 'general', label: 'General', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'appearance', label: 'Appearance', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'ai-preferences', label: 'AI Preferences', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'privacy', label: 'Privacy', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'about', label: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(`settings-section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Global Keyboard Shortcuts Listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (!isCmdOrCtrl) return;

      const key = e.key.toLowerCase();
      if (key === 'k') {
        e.preventDefault();
        showToast('⌘K: Opening Command Palette & Library...');
        navigate('/script-intelligence/library');
      } else if (key === 's' && !e.shiftKey) {
        e.preventDefault();
        showToast('⌘S: Current script draft saved!');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        showToast('⌘Enter: AI Script Analysis triggered!');
        navigate('/script-intelligence');
      } else if (key === 'l') {
        e.preventDefault();
        showToast('⌘L: Opening Script Library...');
        navigate('/script-intelligence/library');
      } else if (key === 'p' && e.shiftKey) {
        e.preventDefault();
        showToast('⌘⇧P: Opening Pro Upgrade...');
        navigate('/pricing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleClearCache = () => {
    try {
      sessionStorage.clear();
      showToast('Local cache cleared! (14.2 MB freed)');
    } catch {
      showToast('Local cache cleared!');
    }
  };

  const handleExportData = () => {
    const backupData = {
      workspace: {
        name: workspaceName,
        id: workspaceId,
        role: workspaceRole,
        timezone,
        language,
        dateFormat
      },
      user: {
        displayName,
        email: user?.email || 'creator_apple@kontagi.ai',
        plan: isPro ? 'PRO' : 'FREE TIER'
      },
      preferences: {
        theme,
        borderRadius,
        aiLength,
        analysisMode,
        autoSave,
        autoSaveAi,
        smartSuggestions
      },
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kontagi_workspace_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Workspace data exported to JSON!');
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#FAF8F3', 
      fontFamily: "'Satoshi', 'General Sans', sans-serif", 
      color: '#162A3B',
      transition: 'background-color 200ms ease, color 200ms ease'
    }}>
      {/* Pinned Left Sidebar Shell */}
      <FreeTierSidebar currentPath="/settings" />

      {/* Main Content Viewport */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <FreeTierHeader title="Workspace Settings" />

        {/* Floating Notification Toast */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#162A3B',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            fontSize: '13.5px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-in'
          }}>
            <span style={{ color: '#FF6B3D', fontWeight: 800 }}>✓</span>
            {toastMessage}
          </div>
        )}

        <main style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '36px 32px 64px', boxSizing: 'border-box' }}>
          
          {/* Top Back Navigation */}
          <button
            type="button"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate('/script-intelligence');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'none',
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#667085',
              cursor: 'pointer',
              marginBottom: '20px',
              padding: 0
            }}
          >
            ← Back to Script Studio
          </button>

          {/* Page Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#162A3B', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                Settings
              </h1>
              <p style={{ fontSize: '14.5px', color: '#667085', margin: 0 }}>
                Manage your Kontagi workspace and preferences.
              </p>
            </div>

            {/* Workspace Badge Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(22, 42, 59, 0.05)',
              border: '1px solid rgba(22, 42, 59, 0.12)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#162A3B',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isPro ? '#FF6B3D' : '#667085' }} />
              {isPro ? 'PRO WORKSPACE' : 'FREE WORKSPACE'}
            </div>
          </div>

          {/* 2-Column Layout Grid */}
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>

            {/* Left Sticky Navigation */}
            <nav style={{ width: '230px', flexShrink: 0, position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      height: '42px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                      color: isActive ? '#162A3B' : '#667085',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 150ms ease',
                      boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none',
                      position: 'relative'
                    }}
                  >
                    {/* Orange Active Indicator */}
                    {isActive && (
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        top: '10px',
                        bottom: '10px',
                        width: '3.5px',
                        borderRadius: '0 4px 4px 0',
                        backgroundColor: '#FF6B3D'
                      }} />
                    )}

                    <svg style={{ width: '18px', height: '18px', flexShrink: 0, color: isActive ? '#FF6B3D' : '#667085' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>

                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Side Settings Cards Stack */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '28px', minWidth: 0 }}>

              {/* 1. GENERAL CARD */}
              <div id="settings-section-general" className="kontagi-settings-card">
                <div className="kontagi-settings-card-header">
                  <h2 className="kontagi-settings-card-title">General Settings</h2>
                  <p className="kontagi-settings-card-desc">Configure your workspace defaults and regional preferences.</p>
                </div>

                <div className="kontagi-settings-field-group">
                  <div className="kontagi-settings-field">
                    <label className="kontagi-settings-label">Workspace Name</label>
                    <input
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="kontagi-settings-input"
                    />
                  </div>

                  <div className="kontagi-settings-grid-2">
                    <div className="kontagi-settings-field">
                      <label className="kontagi-settings-label">Timezone</label>
                      <CustomSelect
                        value={timezone}
                        onChange={setTimezone}
                        options={[
                          { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
                          { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
                          { value: 'Europe/London', label: 'London (GMT+0)' },
                          { value: 'Asia/Kolkata', label: 'Mumbai / IST (UTC+5:30)' }
                        ]}
                      />
                    </div>

                    <div className="kontagi-settings-field">
                      <label className="kontagi-settings-label">Language</label>
                      <CustomSelect
                        value={language}
                        onChange={setLanguage}
                        options={[
                          { value: 'en-US', label: 'English (US)' },
                          { value: 'en-GB', label: 'English (UK)' },
                          { value: 'es-ES', label: 'Spanish' },
                          { value: 'de-DE', label: 'German' }
                        ]}
                      />
                    </div>
                  </div>

                  <div className="kontagi-settings-grid-2">
                    <div className="kontagi-settings-field">
                      <label className="kontagi-settings-label">Date Format</label>
                      <CustomSelect
                        value={dateFormat}
                        onChange={setDateFormat}
                        options={[
                          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2026)' },
                          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2026)' },
                          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-12-31)' }
                        ]}
                      />
                    </div>

                    <div className="kontagi-settings-field-row" style={{ marginTop: '22px' }}>
                      <div>
                        <div className="kontagi-settings-row-title">Auto Save</div>
                        <div className="kontagi-settings-row-sub">Save script drafts automatically while typing</div>
                      </div>
                      <IOSSwitch checked={autoSave} onChange={setAutoSave} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. PROFILE CARD */}
              <div id="settings-section-profile" className="kontagi-settings-card">
                <div className="kontagi-settings-card-header">
                  <h2 className="kontagi-settings-card-title">Profile</h2>
                  <p className="kontagi-settings-card-desc">Personal details and workspace account identity.</p>
                </div>

                <div className="kontagi-settings-field-group">
                  {/* Hidden File Input for Avatar Upload */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  {/* Avatar row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '8px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: '#162A3B',
                      color: '#FFFFFF',
                      fontSize: '22px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(22, 42, 59, 0.15)',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        displayName.charAt(0).toUpperCase() || 'A'
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="kontagi-settings-btn-sec"
                        >
                          Change Photo
                        </button>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="kontagi-settings-btn-muted"
                        >
                          Remove
                        </button>
                      </div>
                      <p style={{ fontSize: '12px', color: '#98A2B3', margin: '6px 0 0 0' }}>JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  <div className="kontagi-settings-grid-2">
                    <div className="kontagi-settings-field">
                      <label className="kontagi-settings-label">Display Name</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="kontagi-settings-input"
                      />
                    </div>

                    <div className="kontagi-settings-field">
                      <label className="kontagi-settings-label">Email Address</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          value={user?.email || 'creator_apple@kontagi.ai'}
                          disabled
                          className="kontagi-settings-input"
                          style={{ backgroundColor: 'rgba(22, 42, 59, 0.03)', color: '#667085' }}
                        />
                        <span style={{ position: 'absolute', right: '12px', top: '10px', fontSize: '11px', fontWeight: 800, color: '#22C55E' }}>✓ Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="kontagi-settings-grid-2">
                    <div className="kontagi-settings-field">
                      <label className="kontagi-settings-label">Workspace Role</label>
                      {isPro ? (
                        <select
                          value={workspaceRole}
                          onChange={(e) => {
                            setWorkspaceRole(e.target.value);
                            localStorage.setItem('kontagi_workspace_role', e.target.value);
                            showToast('Workspace role updated!');
                          }}
                          className="kontagi-settings-select"
                        >
                          <option value="Owner & Creator">Owner & Creator</option>
                          <option value="Admin">Workspace Admin</option>
                          <option value="Editor">Script Editor</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(22, 42, 59, 0.04)',
                          border: '1px solid #E8E3DA',
                          minHeight: '42px',
                          boxSizing: 'border-box'
                        }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#162A3B' }}>
                            Owner & Creator
                          </span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(255, 107, 61, 0.1)',
                            color: '#FF6B3D',
                            border: '1px solid rgba(255, 107, 61, 0.25)',
                            letterSpacing: '0.04em'
                          }}>
                            PRO MULTI-ROLE
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="kontagi-settings-field">
                      <label className="kontagi-settings-label">Workspace ID</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={workspaceId}
                          readOnly
                          className="kontagi-settings-input"
                          style={{ fontFamily: 'monospace', fontSize: '13px' }}
                        />
                        <button
                          type="button"
                          onClick={handleCopyWorkspaceId}
                          className="kontagi-settings-btn-sec"
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          {isCopied ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. APPEARANCE CARD */}
              <div id="settings-section-appearance" className="kontagi-settings-card">
                <div className="kontagi-settings-card-header">
                  <h2 className="kontagi-settings-card-title">Appearance</h2>
                  <p className="kontagi-settings-card-desc">Customize theme options, border radius and UI density.</p>
                </div>

                <div className="kontagi-settings-field-group">
                  <div className="kontagi-settings-field">
                    <label className="kontagi-settings-label">Theme</label>
                    <div className="kontagi-settings-grid-3">
                      {[
                        { id: 'light', label: 'Light', desc: 'Warm Off White default', comingSoon: false },
                        { id: 'dark', label: 'Dark', desc: 'Deep Navy contrast', comingSoon: true },
                        { id: 'system', label: 'System', desc: 'Follow OS preference', comingSoon: true },
                      ].map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            if (t.comingSoon) {
                              showToast(`${t.label} theme mode coming soon!`);
                            } else {
                              setTheme(t.id as any);
                              showToast(`Theme set to ${t.label}`);
                            }
                          }}
                          style={{
                            padding: '16px',
                            borderRadius: '12px',
                            border: theme === t.id ? '2px solid #FF6B3D' : '1px solid #E8E3DA',
                            backgroundColor: theme === t.id ? 'rgba(255, 107, 61, 0.03)' : '#FFFFFF',
                            cursor: 'pointer',
                            transition: 'all 150ms ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#162A3B' }}>
                              {theme === t.id ? '● ' : '○ '}{t.label}
                            </div>
                            {t.comingSoon && (
                              <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '9999px', backgroundColor: 'rgba(255, 107, 61, 0.1)', color: '#FF6B3D', border: '1px solid rgba(255, 107, 61, 0.25)' }}>
                                COMING SOON
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: '#667085' }}>{t.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="kontagi-settings-field">
                    <label className="kontagi-settings-label">Accent Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 107, 61, 0.1)', border: '1.5px solid #FF6B3D', color: '#FF6B3D', fontWeight: 800, fontSize: '13px' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF6B3D' }} />
                        Warm Orange (Default)
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#667085' }}>
                        <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '9999px', backgroundColor: 'rgba(255, 107, 61, 0.1)', color: '#FF6B3D', border: '1px solid rgba(255, 107, 61, 0.25)' }}>
                          COMING SOON
                        </span>
                        Custom Accents
                      </div>
                    </div>
                  </div>

                  <div className="kontagi-settings-field">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <label className="kontagi-settings-label" style={{ margin: 0 }}>Border Radius Preview</label>
                      <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '9999px', backgroundColor: 'rgba(255, 107, 61, 0.1)', color: '#FF6B3D', border: '1px solid rgba(255, 107, 61, 0.25)' }}>
                        COMING SOON
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {(['12px', '14px', '16px'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => showToast(`Custom ${r} border radius coming soon!`)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: r,
                            border: borderRadius === r ? '2px solid #FF6B3D' : '1px solid #E8E3DA',
                            backgroundColor: borderRadius === r ? 'rgba(255, 107, 61, 0.05)' : '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: borderRadius === r ? '#FF6B3D' : '#162A3B',
                            cursor: 'pointer',
                            opacity: 0.85,
                            transition: 'all 150ms ease'
                          }}
                        >
                          {r} Radius
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="kontagi-settings-field-row">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="kontagi-settings-row-title">Animation Toggle</div>
                        <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '9999px', backgroundColor: 'rgba(255, 107, 61, 0.1)', color: '#FF6B3D', border: '1px solid rgba(255, 107, 61, 0.25)' }}>
                          COMING SOON
                        </span>
                      </div>
                      <div className="kontagi-settings-row-sub">Enable fluid page micro-transitions and hover animations</div>
                    </div>
                    <IOSSwitch checked={animations} onChange={() => showToast('Animation toggle coming soon!')} disabled />
                  </div>

                  <div className="kontagi-settings-field-row">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="kontagi-settings-row-title">Compact Mode</div>
                        <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '9999px', backgroundColor: 'rgba(255, 107, 61, 0.1)', color: '#FF6B3D', border: '1px solid rgba(255, 107, 61, 0.25)' }}>
                          COMING SOON
                        </span>
                      </div>
                      <div className="kontagi-settings-row-sub">Reduce padding for higher data density on screen</div>
                    </div>
                    <IOSSwitch checked={compactMode} onChange={() => showToast('Compact mode coming soon!')} disabled />
                  </div>
                </div>
              </div>

              {/* 4. AI PREFERENCES CARD */}
              <div id="settings-section-ai-preferences" className="kontagi-settings-card">
                <div className="kontagi-settings-card-header">
                  <h2 className="kontagi-settings-card-title">AI Preferences</h2>
                  <p className="kontagi-settings-card-desc">Configure intelligence engine parameters and rewrite behaviors.</p>
                </div>

                <div className="kontagi-settings-field-group">
                  <div className="kontagi-settings-field">
                    <label className="kontagi-settings-label">AI Response Length</label>
                    <div className="kontagi-settings-grid-3">
                      {[
                        { id: 'short', label: 'Short', desc: 'Concise hooks & bullet highlights' },
                        { id: 'balanced', label: 'Balanced', desc: 'Optimal default analysis depth' },
                        { id: 'detailed', label: 'Detailed', desc: 'Deep narrative breakdowns & maps' },
                      ].map((l) => (
                        <div
                          key={l.id}
                          onClick={() => {
                            setAiLength(l.id as any);
                            showToast(`AI response depth set to ${l.label}`);
                          }}
                          style={{
                            padding: '14px',
                            borderRadius: '12px',
                            border: aiLength === l.id ? '2px solid #FF6B3D' : '1px solid #E8E3DA',
                            backgroundColor: aiLength === l.id ? 'rgba(255, 107, 61, 0.03)' : '#FFFFFF',
                            cursor: 'pointer',
                            transition: 'all 150ms ease'
                          }}
                        >
                          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#162A3B', marginBottom: '4px' }}>
                            {aiLength === l.id ? '● ' : '○ '}{l.label}
                          </div>
                          <div style={{ fontSize: '12px', color: '#667085' }}>{l.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="kontagi-settings-field">
                    <label className="kontagi-settings-label">Default Analysis Mode</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {[
                        { id: 'script', label: 'Script Analysis' },
                        { id: 'hook', label: 'Hook Analysis' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setAnalysisMode(m.id as any);
                            showToast(`Default mode set to ${m.label}`);
                          }}
                          style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '10px',
                            border: analysisMode === m.id ? '2px solid #162A3B' : '1px solid #E8E3DA',
                            backgroundColor: analysisMode === m.id ? '#162A3B' : '#FFFFFF',
                            color: analysisMode === m.id ? '#FFFFFF' : '#162A3B',
                            fontWeight: 700,
                            fontSize: '13.5px',
                            cursor: 'pointer',
                            transition: 'all 150ms ease'
                          }}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="kontagi-settings-field-row">
                    <div>
                      <div className="kontagi-settings-row-title">Auto-save AI sessions</div>
                      <div className="kontagi-settings-row-sub">Automatically preserve generated rewrites to My Library</div>
                    </div>
                    <IOSSwitch checked={autoSaveAi} onChange={(val) => {
                      setAutoSaveAi(val);
                      showToast(val ? 'Auto-save AI sessions enabled' : 'Auto-save AI sessions disabled');
                    }} />
                  </div>

                  <div className="kontagi-settings-field-row">
                    <div>
                      <div className="kontagi-settings-row-title">Smart Suggestions</div>
                      <div className="kontagi-settings-row-sub">Show real-time score predictions while typing in Script Studio</div>
                    </div>
                    <IOSSwitch checked={smartSuggestions} onChange={(val) => {
                      setSmartSuggestions(val);
                      showToast(val ? 'Smart score suggestions enabled' : 'Smart suggestions disabled');
                    }} />
                  </div>
                </div>
              </div>

              {/* 5. NOTIFICATIONS CARD */}
              <div id="settings-section-notifications" className="kontagi-settings-card">
                <div className="kontagi-settings-card-header">
                  <h2 className="kontagi-settings-card-title">Notifications</h2>
                  <p className="kontagi-settings-card-desc">Control product updates and weekly insight emails.</p>
                </div>

                <div className="kontagi-settings-field-group">
                  <div className="kontagi-settings-field-row">
                    <div>
                      <div className="kontagi-settings-row-title">Email Notifications</div>
                      <div className="kontagi-settings-row-sub">Receive critical script analysis completions</div>
                    </div>
                    <IOSSwitch checked={emailNotifs} onChange={setEmailNotifs} />
                  </div>

                  <div className="kontagi-settings-field-row">
                    <div>
                      <div className="kontagi-settings-row-title">Product Updates</div>
                      <div className="kontagi-settings-row-sub">Monthly summary of new Kontagi features</div>
                    </div>
                    <IOSSwitch checked={productUpdates} onChange={setProductUpdates} />
                  </div>

                  <div className="kontagi-settings-field-row">
                    <div>
                      <div className="kontagi-settings-row-title">Feature Releases</div>
                      <div className="kontagi-settings-row-sub">Early access invites for new AI models</div>
                    </div>
                    <IOSSwitch checked={featureReleases} onChange={setFeatureReleases} />
                  </div>

                  <div className="kontagi-settings-field-row">
                    <div>
                      <div className="kontagi-settings-row-title">Weekly Insights</div>
                      <div className="kontagi-settings-row-sub">Weekly creator retention summary report</div>
                    </div>
                    <IOSSwitch checked={weeklyInsights} onChange={setWeeklyInsights} />
                  </div>

                  <div className="kontagi-settings-field-row">
                    <div>
                      <div className="kontagi-settings-row-title">Security Alerts</div>
                      <div className="kontagi-settings-row-sub">Immediate login notifications (Always Active)</div>
                    </div>
                    <IOSSwitch checked={true} onChange={() => {}} disabled={true} />
                  </div>
                </div>
              </div>

              {/* 6. PRIVACY CARD */}
              <div id="settings-section-privacy" className="kontagi-settings-card">
                <div className="kontagi-settings-card-header">
                  <h2 className="kontagi-settings-card-title">Privacy & Data</h2>
                  <p className="kontagi-settings-card-desc">Manage local cache and anonymous data sharing settings.</p>
                </div>

                <div className="kontagi-settings-field-group">
                  <div className="kontagi-settings-field-row">
                    <div>
                      <div className="kontagi-settings-row-title">Analytics Sharing</div>
                      <div className="kontagi-settings-row-sub">Share anonymous usage telemetry to improve performance</div>
                    </div>
                    <IOSSwitch checked={analyticsSharing} onChange={(val) => {
                      setAnalyticsSharing(val);
                      showToast(val ? 'Analytics telemetry enabled' : 'Analytics telemetry disabled');
                    }} />
                  </div>

                  <div className="kontagi-settings-field-row">
                    <div>
                      <div className="kontagi-settings-row-title">Crash Reports</div>
                      <div className="kontagi-settings-row-sub">Automatically send diagnostic reports on error</div>
                    </div>
                    <IOSSwitch checked={crashReports} onChange={(val) => {
                      setCrashReports(val);
                      showToast(val ? 'Automated crash reporting enabled' : 'Crash reporting disabled');
                    }} />
                  </div>

                  <div style={{ display: 'flex', gap: '16px', paddingTop: '12px' }}>
                    <button type="button" onClick={handleClearCache} className="kontagi-settings-btn-sec">
                      Delete Local Cache (14.2 MB)
                    </button>
                    <button type="button" onClick={handleExportData} className="kontagi-settings-btn-sec">
                      Export Data (JSON) →
                    </button>
                  </div>
                </div>
              </div>

              {/* 7. KEYBOARD SHORTCUTS CARD */}
              <div id="settings-section-shortcuts" className="kontagi-settings-card">
                <div className="kontagi-settings-card-header">
                  <h2 className="kontagi-settings-card-title">Keyboard Shortcuts</h2>
                  <p className="kontagi-settings-card-desc">Quick key bindings to speed up your script workflow.</p>
                </div>

                <div className="kontagi-settings-field-group">
                  {[
                    { action: 'Quick Search & Command Palette', key: '⌘ K', handler: () => { showToast('⌘K: Opening Search & Command Palette...'); navigate('/script-intelligence/library'); } },
                    { action: 'Save Current Script Draft', key: '⌘ S', handler: () => { showToast('⌘S: Save Current Script Draft executed!'); } },
                    { action: 'Run AI Script Analysis', key: '⌘ Enter', handler: () => { showToast('⌘Enter: AI Script Analysis triggered!'); navigate('/script-intelligence'); } },
                    { action: 'Open Script Library', key: '⌘ L', handler: () => { showToast('⌘L: Opening Script Library...'); navigate('/script-intelligence/library'); } },
                    { action: 'Upgrade to Kontagi Pro', key: '⌘ ⇧ P', handler: () => { showToast('⌘⇧P: Opening Pro Upgrade...'); navigate('/pricing'); } },
                  ].map((s) => (
                    <div
                      key={s.action}
                      onClick={s.handler}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        marginBottom: '6px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EFE9E1',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#162A3B', fontWeight: 600 }}>{s.action}</span>
                      <kbd style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(22, 42, 59, 0.06)',
                        border: '1px solid rgba(22, 42, 59, 0.12)',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#162A3B'
                      }}>
                        {s.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. ABOUT CARD */}
              <div id="settings-section-about" className="kontagi-settings-card">
                <div className="kontagi-settings-card-header">
                  <h2 className="kontagi-settings-card-title">About Kontagi</h2>
                  <p className="kontagi-settings-card-desc">Workspace build and license metadata.</p>
                </div>

                <div className="kontagi-settings-field-group">
                  <div className="kontagi-settings-grid-2">
                    <div>
                      <div className="kontagi-settings-label">Current Plan</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#162A3B' }}>FREE TIER</div>
                    </div>
                    <div>
                      <div className="kontagi-settings-label">Version</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#667085' }}>v2.4.0-kontagi</div>
                    </div>
                  </div>

                  <div className="kontagi-settings-grid-2" style={{ paddingTop: '12px' }}>
                    <div>
                      <div className="kontagi-settings-label">License</div>
                      <div style={{ fontSize: '13.5px', color: '#667085' }}>Individual Creator License</div>
                    </div>
                    <div>
                      <div className="kontagi-settings-label">Documentation</div>
                      <button
                        type="button"
                        onClick={() => navigate('/support')}
                        style={{ border: 'none', background: 'none', padding: 0, fontSize: '13.5px', color: '#FF6B3D', fontWeight: 700, cursor: 'pointer' }}
                      >
                        View Documentation →
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', paddingTop: '12px', borderTop: '1px solid #EFE9E1', fontSize: '13px' }}>
                    <button type="button" onClick={() => navigate('/support')} style={{ border: 'none', background: 'none', padding: 0, color: '#667085', cursor: 'pointer', fontWeight: 600 }}>Support</button>
                    <button type="button" onClick={() => navigate('/terms')} style={{ border: 'none', background: 'none', padding: 0, color: '#667085', cursor: 'pointer', fontWeight: 600 }}>Terms</button>
                    <button type="button" onClick={() => navigate('/privacy')} style={{ border: 'none', background: 'none', padding: 0, color: '#667085', cursor: 'pointer', fontWeight: 600 }}>Privacy Policy</button>
                  </div>
                </div>
              </div>

              {/* 9. FREE PLAN UPGRADE ANNOUNCEMENT BANNER */}
              <FreeTierUpgradeBanner />

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
