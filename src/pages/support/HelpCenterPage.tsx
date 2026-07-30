import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FreeTierHeader } from '../../components/free-tier/FreeTierHeader';
import { FreeTierSidebar } from '../../components/free-tier/FreeTierSidebar';
import { FreeTierUpgradeBanner } from '../../components/free-tier/FreeTierUpgradeBanner';

// Category Cards Definition
interface CategoryCard {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  path?: string;
  badge?: string;
}

// Article Definition
interface PopularArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
}

// Release Note Definition
interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  tag: 'Feature' | 'Improvement' | 'Fix' | 'AI Model';
  highlights: string[];
}

const CATEGORY_CARDS: CategoryCard[] = [
  {
    id: 'support',
    title: 'Support',
    desc: 'Direct priority assistance, FAQs, and human support channels.',
    path: '/support',
    icon: (
      <svg style={{ width: '22px', height: '22px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: 'documentation',
    title: 'Documentation',
    desc: 'Step-by-step creator guides, workflow tutorials, and script optimization.',
    path: '/support',
    icon: (
      <svg style={{ width: '22px', height: '22px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    id: 'privacy',
    title: 'Privacy',
    desc: 'Data protection policies, zero script monetization, and GDPR controls.',
    path: '/privacy',
    icon: (
      <svg style={{ width: '22px', height: '22px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    id: 'terms',
    title: 'Terms',
    desc: 'Workspace licensing agreement, subscription rights, and acceptable use.',
    path: '/terms',
    icon: (
      <svg style={{ width: '22px', height: '22px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: 'release-notes',
    title: 'Release Notes',
    desc: 'Platform changelog, new feature announcements, and performance upgrades.',
    badge: 'v2.4.0',
    icon: (
      <svg style={{ width: '22px', height: '22px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    )
  },
  {
    id: 'api-docs',
    title: 'API Docs',
    desc: 'Developer API endpoints, JSON schemas, webhooks, and rate limit specs.',
    badge: 'REST & SDK',
    icon: (
      <svg style={{ width: '22px', height: '22px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  }
];

const POPULAR_ARTICLES: PopularArticle[] = [
  {
    id: 'how-script-analysis-works',
    title: 'How Script Analysis Works',
    category: 'Core Engine',
    readTime: '3 min read',
    summary: 'Detailed explanation of hook detection, pacing scores, and retention prediction models.',
    content: [
      'Kontagi evaluates your short-form script across three distinct time windows:',
      '1. Hook Pacing (0–3 Seconds): Analyzes curiosity gap, visual trigger potential, and opening clarity.',
      '2. Core Narrative Arc (3–30 Seconds): Evaluates message density, engagement decay, and flow.',
      '3. Resolution & Call to Action (End): Evaluates ending impact and conversion trigger probability.',
      'Every analysis delivers immediate line-by-line rewrite suggestions to increase completion rates.'
    ]
  },
  {
    id: 'how-ai-rewrite-works',
    title: 'How AI Rewrite Works',
    category: 'AI Copilot',
    readTime: '3 min read',
    summary: 'Transform low-performing opening lines into viral hook variations in 1-click.',
    content: [
      'The AI Rewrite engine takes your script premise and generates 3 high-converting angles:',
      '• Pattern Interrupt: Subverts viewer expectations to stop scrolling instantly.',
      '• Direct Problem-Solution: Clear, authoritative hook for educational and product videos.',
      '• Storytelling & Empathy: Relatable narrative hook engineered for high shares.',
      'Select any variation to instantly replace or benchmark your script draft.'
    ]
  },
  {
    id: 'understanding-hook-score',
    title: 'Understanding Hook Score',
    category: 'Scoring Metrics',
    readTime: '4 min read',
    summary: 'A complete breakdown of our 0–100 hook rating scale and retention correlations.',
    content: [
      'Hook Score measures the probability that a viewer will watch past the 3-second mark.',
      '• 85 – 100 (Exceptional): Top 5% viral potential with immediate curiosity trigger.',
      '• 70 – 84 (Strong): Solid opening with clear value proposition.',
      '• Below 70 (Needs Work): High risk of drop-off due to slow intro or passive wording.'
    ]
  },
  {
    id: 'daily-usage-limits',
    title: 'Daily Usage Limits',
    category: 'Quota & Tier',
    readTime: '2 min read',
    summary: 'How 24-hour analysis quotas refresh and how to monitor your usage.',
    content: [
      'Free workspace accounts receive 3 script analyses every 24 hours.',
      'Quotas automatically refresh at 00:00 UTC daily. Pro subscribers enjoy unlimited analyses.'
    ]
  },
  {
    id: 'upgrade-to-pro',
    title: 'Upgrade to Pro',
    category: 'Subscription',
    readTime: '2 min read',
    summary: 'Unlock retention heatmaps, unlimited AI rewrites, and priority AI processing.',
    content: [
      'Upgrading to Kontagi Pro unlocks:',
      '• Unlimited Script Analyses',
      '• Retention Heatmap Predictions',
      '• Unlimited AI Rewrites & Hook Variations',
      '• Priority Execution Queue (<2s latency)'
    ]
  }
];

const RECENT_UPDATES: ReleaseNote[] = [
  {
    version: 'v2.4.0',
    date: 'July 24, 2026',
    title: 'AI Copilot Model Upgrade & High-Speed Analysis',
    tag: 'AI Model',
    highlights: [
      'Upgraded underlying natural language model for 40% faster script processing.',
      'Improved hook score accuracy based on 2026 short-form video retention benchmarks.',
      'Enhanced AI Rewrite engine with 3 distinct creator narrative styles.'
    ]
  },
  {
    version: 'v2.3.5',
    date: 'July 18, 2026',
    title: 'Workspace Data Sovereignty & JSON Export',
    tag: 'Feature',
    highlights: [
      'Added 1-click JSON data export across all workspace settings.',
      'Enhanced local storage cache management and privacy telemetry toggles.',
      'New Stripe & Linear styled legal documentation portals.'
    ]
  },
  {
    version: 'v2.3.0',
    date: 'July 10, 2026',
    title: 'Compact High-Density UI & Custom Micro-Transitions',
    tag: 'Improvement',
    highlights: [
      'Introduced compact mode layout option for power creators.',
      'Added border-radius customization controls.',
      'Fixed minor theme synchronization edge cases.'
    ]
  }
];

export const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<PopularArticle | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Listen for '/' keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered Items
  const filteredCategories = CATEGORY_CARDS.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = POPULAR_ARTICLES.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUpdates = RECENT_UPDATES.filter((u) =>
    u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCategoryClick = (card: CategoryCard) => {
    if (card.path) {
      navigate(card.path);
    } else if (card.id === 'release-notes') {
      const el = document.getElementById('recent-updates-section');
      el?.scrollIntoView({ behavior: 'smooth' });
      showToast('Scrolled to Release Notes');
    } else if (card.id === 'api-docs') {
      showToast('Kontagi REST API Documentation v2.4 coming soon!');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F3', fontFamily: "'Satoshi', 'General Sans', sans-serif", color: '#162A3B' }}>
      {/* Workspace Sidebar Navigation */}
      <FreeTierSidebar currentPath="/help" />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <FreeTierHeader title="Help Center" />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
            backgroundColor: '#162A3B',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            fontSize: '13.5px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#FF6B3D', fontWeight: 800 }}>✓</span>
            {toastMessage}
          </div>
        )}

        {/* Content Body */}
        <main style={{ flex: 1, maxWidth: '1040px', width: '100%', margin: '0 auto', padding: '40px 32px 90px', boxSizing: 'border-box' }}>
          
          {/* Top Back Navigation */}
          <button
            type="button"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate(-1);
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
            ← Back
          </button>

          {/* HERO SECTION */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#162A3B', margin: '0 0 10px 0', letterSpacing: '-0.03em' }}>
              Help Center
            </h1>
            <p style={{ fontSize: '16px', color: '#667085', margin: 0, fontWeight: 400 }}>
              Documentation, guides, privacy, and support for Kontagi creators.
            </p>
          </div>

          {/* GLOBAL SEARCH BAR */}
          <div style={{ maxWidth: '640px', margin: '0 auto 56px auto', position: 'relative' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E3DA',
              borderRadius: '16px',
              padding: '4px 16px',
              boxShadow: '0 4px 20px rgba(22, 42, 59, 0.04)',
              transition: 'border-color 200ms ease, box-shadow 200ms ease'
            }}>
              <svg style={{ width: '20px', height: '20px', color: '#98A2B3', marginRight: '12px', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation, guides, legal policies..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#162A3B',
                  backgroundColor: 'transparent',
                  padding: '12px 0'
                }}
              />

              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#98A2B3', cursor: 'pointer', fontSize: '14px', padding: '4px' }}
                >
                  ✕
                </button>
              ) : (
                <kbd style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(22, 42, 59, 0.05)',
                  border: '1px solid rgba(22, 42, 59, 0.12)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#667085',
                  fontFamily: 'monospace'
                }}>
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* CATEGORY CARDS GRID (6 Cards) */}
          <div style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Explore Categories
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredCategories.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCategoryClick(card)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E3DA',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(22, 42, 59, 0.03)',
                    transition: 'all 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#162A3B';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E8E3DA';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(22, 42, 59, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {card.icon}
                      </div>

                      {card.badge && (
                        <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '3px 9px', borderRadius: '9999px', backgroundColor: 'rgba(255, 107, 61, 0.1)', color: '#FF6B3D', border: '1px solid rgba(255, 107, 61, 0.25)' }}>
                          {card.badge}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#162A3B', margin: '0 0 6px 0' }}>
                      {card.title}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#667085', margin: 0, lineHeight: 1.5 }}>
                      {card.desc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#162A3B', marginTop: '20px' }}>
                    Open {card.title} <span style={{ transition: 'transform 150ms ease' }}>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* POPULAR ARTICLES SECTION */}
          <div style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Popular Articles
              </h2>
              <span style={{ fontSize: '12.5px', color: '#667085' }}>
                Showing {filteredArticles.length} guides
              </span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E3DA', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(22, 42, 59, 0.03)' }}>
              {filteredArticles.map((article, idx) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: idx === filteredArticles.length - 1 ? 'none' : '1px solid #EFE9E1',
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(22, 42, 59, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#162A3B', margin: 0 }}>
                        {article.title}
                      </h3>
                      <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'rgba(22, 42, 59, 0.05)', color: '#667085' }}>
                        {article.category}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#667085', margin: 0 }}>
                      {article.summary}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '16px' }}>
                    <span style={{ fontSize: '12px', color: '#98A2B3', fontWeight: 500 }}>
                      {article.readTime}
                    </span>
                    <span style={{ fontSize: '16px', color: '#162A3B', fontWeight: 600 }}>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT UPDATES & CHANGELOG */}
          <div id="recent-updates-section" style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Recent Updates & Version History
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredUpdates.map((update) => (
                <div
                  key={update.version}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E3DA',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 12px rgba(22, 42, 59, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#162A3B', fontFamily: 'monospace' }}>
                        {update.version}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'rgba(255, 107, 61, 0.1)', color: '#FF6B3D', border: '1px solid rgba(255, 107, 61, 0.2)' }}>
                        {update.tag}
                      </span>
                    </div>

                    <span style={{ fontSize: '12.5px', color: '#98A2B3', fontWeight: 500 }}>
                      {update.date}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#162A3B', margin: '0 0 10px 0' }}>
                    {update.title}
                  </h3>

                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13.5px', color: '#475467', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {update.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* FREE PLAN UPGRADE ANNOUNCEMENT BANNER */}
          <div>
            <FreeTierUpgradeBanner />
          </div>

        </main>
      </div>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div style={modalBackdropStyle} onClick={() => setSelectedArticle(null)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #EFE9E1', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'rgba(255, 107, 61, 0.1)', color: '#FF6B3D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {selectedArticle.category}
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#162A3B', margin: '8px 0 0 0' }}>
                  {selectedArticle.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', color: '#667085', cursor: 'pointer', padding: '4px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '14.5px', color: '#162A3B', lineHeight: 1.7 }}>
              {selectedArticle.content.map((paragraph, i) => (
                <p key={i} style={{ marginBottom: '14px' }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #EFE9E1', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#162A3B', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(22, 42, 59, 0.5)',
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  maxWidth: '580px',
  width: '100%',
  padding: '32px',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
  maxHeight: '90vh',
  overflowY: 'auto'
};
