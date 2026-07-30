import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SimulationContentAssets {
  title: string;
  scriptText: string;
  caption: string;
  videoFile: File | null;
  videoFileName?: string;
  videoDurationSec?: number;
  thumbnailFile: File | null;
  thumbnailUrl?: string;
}

interface ContentUploadAreaProps {
  assets: SimulationContentAssets;
  onChange: (updated: Partial<SimulationContentAssets>) => void;
}

export const ContentUploadArea: React.FC<ContentUploadAreaProps> = ({ assets, onChange }) => {
  const [activeTab, setActiveTab] = useState<'script' | 'video' | 'thumbnail' | 'caption'>('script');
  const [isDragging, setIsDragging] = useState(false);

  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        onChange({ videoFile: file, videoFileName: file.name, videoDurationSec: 30 });
      }
    }
  };

  const handleThumbnailDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        onChange({ thumbnailFile: file, thumbnailUrl: url });
      }
    }
  };

  const wordCount = assets.scriptText.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadingSec = Math.max(5, Math.ceil(wordCount / 2.5));

  return (
    <div
      className="pro-glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        borderRadius: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)'
      }}
    >
      {/* Workspace Header & Tab Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#38BDF8',
              boxShadow: '0 0 10px #38BDF8'
            }}
          />
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.8)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Multi-Asset Simulation Workspace
          </span>
        </div>

        {/* Tab Navigation Buttons */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {[
            { id: 'script', label: '📝 Script & Hook', badge: wordCount > 0 ? `${wordCount}w` : 'Empty' },
            { id: 'video', label: '🎬 Video Media', badge: assets.videoFileName ? 'Attached' : 'Optional' },
            { id: 'thumbnail', label: '🖼️ Thumbnail', badge: assets.thumbnailUrl ? 'Ready' : 'Optional' },
            { id: 'caption', label: '💬 Caption', badge: assets.caption ? 'Configured' : 'Optional' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '7px 14px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                color: activeTab === tab.id ? '#38BDF8' : 'rgba(255, 255, 255, 0.6)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '9px',
                padding: '2px 5px',
                borderRadius: '4px',
                backgroundColor: activeTab === tab.id ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                color: activeTab === tab.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)'
              }}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'script' && (
          <motion.div
            key="tab-script"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Content Title / Working Headline
              </label>
              <input
                type="text"
                value={assets.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="e.g. Stop Making This AI Marketing Mistake in 2026"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Spoken Script Text / Audio Storyboard
                </label>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600 }}>
                  Est. Duration: <span style={{ color: '#38BDF8', fontWeight: 800 }}>~{estimatedReadingSec}s</span> ({wordCount} words)
                </div>
              </div>
              <textarea
                value={assets.scriptText}
                onChange={(e) => onChange({ scriptText: e.target.value })}
                rows={6}
                placeholder="Paste your spoken script or audio storyboard..."
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  lineHeight: '1.6',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'video' && (
          <motion.div
            key="tab-video"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleVideoDrop}
              style={{
                border: isDragging ? '2px dashed #38BDF8' : '2px dashed rgba(255, 255, 255, 0.15)',
                backgroundColor: isDragging ? 'rgba(56, 189, 248, 0.08)' : 'rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                padding: '36px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'video/*';
                input.onchange = (e: any) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    onChange({ videoFile: file, videoFileName: file.name, videoDurationSec: 30 });
                  }
                };
                input.click();
              }}
            >
              <div style={{ fontSize: '2rem' }}>🎬</div>
              {assets.videoFileName ? (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>
                    {assets.videoFileName}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
                    Video file attached • Ready for multimodal frame extraction
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    Drag & Drop Video File (.mp4, .mov, .webm)
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>
                    or click to browse local files
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'thumbnail' && (
          <motion.div
            key="tab-thumbnail"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleThumbnailDrop}
              style={{
                border: isDragging ? '2px dashed #38BDF8' : '2px dashed rgba(255, 255, 255, 0.15)',
                backgroundColor: isDragging ? 'rgba(56, 189, 248, 0.08)' : 'rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                padding: '28px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const url = URL.createObjectURL(file);
                    onChange({ thumbnailFile: file, thumbnailUrl: url });
                  }
                };
                input.click();
              }}
            >
              {assets.thumbnailUrl ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={assets.thumbnailUrl}
                    alt="Thumbnail Preview"
                    style={{ maxHeight: '140px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                  />
                  <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 700 }}>
                    Thumbnail Attached • Click to replace
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '2rem' }}>🖼️</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    Upload Cover Thumbnail Image (.png, .jpg)
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>
                    Extracts visual contrast & CTR hook vectors
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'caption' && (
          <motion.div
            key="tab-caption"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Post Caption & Hashtags
            </label>
            <textarea
              value={assets.caption}
              onChange={(e) => onChange({ caption: e.target.value })}
              rows={4}
              placeholder="e.g. Scaling software startups is hard. Here's how top founders optimize organic distribution. #marketing #saas #ai"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
