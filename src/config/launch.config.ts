// ──────────────────────────────────────────────
// KONTAGI Production Launch Edition Configuration
// ──────────────────────────────────────────────

export interface LaunchConfig {
  editionName: string;
  version: string;
  isLaunchEdition: boolean;
  activeFeatures: {
    scriptIntelligence: boolean;
    scriptLibrary: boolean;
    aiCopilot: boolean;
    hookScore: boolean;
    billing: boolean;
    settings: boolean;
  };
  labsFeatures: {
    creativeLibrary: boolean;
    performanceMemory: boolean;
    retentionSimulator: boolean;
    thumbnailIntel: boolean;
    captionIntel: boolean;
    audioIntel: boolean;
    visualIntel: boolean;
    targetAudience: boolean;
    uploadCenter: boolean;
    aiCreativeLab: boolean;
    aiReports: boolean;
    auraAiChat: boolean;
  };
}

export const LAUNCH_CONFIG: LaunchConfig = {
  editionName: 'KONTAGI Launch Edition',
  version: '1.0.0',
  isLaunchEdition: true, // Production Launch Mode
  activeFeatures: {
    scriptIntelligence: true,
    scriptLibrary: true,
    aiCopilot: true,
    hookScore: true,
    billing: true,
    settings: true,
  },
  labsFeatures: {
    creativeLibrary: false,      // Preserved in Labs Architecture (v1.1)
    performanceMemory: false,    // Preserved in Labs Architecture (v1.1)
    retentionSimulator: false,   // Preserved in Labs Architecture (v1.1)
    thumbnailIntel: false,       // Preserved in Labs Architecture (v1.1)
    captionIntel: false,         // Preserved in Labs Architecture (v1.1)
    audioIntel: false,           // Preserved in Labs Architecture (v1.1)
    visualIntel: false,          // Preserved in Labs Architecture (v1.1)
    targetAudience: false,       // Preserved in Labs Architecture (v1.1)
    uploadCenter: false,         // Preserved in Labs Architecture (v1.1)
    aiCreativeLab: false,        // Preserved in Labs Architecture (v1.1)
    aiReports: false,            // Preserved in Labs Architecture (v1.1)
    auraAiChat: false,           // Preserved in Labs Architecture (v1.1)
  },
};

export function isFeatureLaunchReady(featureKey: string): boolean {
  if (!LAUNCH_CONFIG.isLaunchEdition) return true; // Full dev mode
  if (featureKey in LAUNCH_CONFIG.activeFeatures) {
    return (LAUNCH_CONFIG.activeFeatures as any)[featureKey];
  }
  return false;
}
