export interface Workspace {
  id: string;
  name: string;
  slug: string;
  avatar_text: string;
  avatar_bg: string;
  avatar_color: string;
  tagline: string;
  prohibited_terms?: string;
  created_at?: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  created_at?: string;
}

export interface RetentionPoint {
  second: number;
  score: number;
  action: string;
}

export interface Video {
  id: string;
  project_id: string;
  title: string;
  filename: string;
  storage_path: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  score?: number;
  mean_volume_db?: number;
  duration?: number;
  transcript?: string;
  caption?: string;
  tags?: string[];
  poster_url?: string;
  retention_profile?: RetentionPoint[];
  hook_score?: number;
  hook_analysis?: string;
  visual_score?: number;
  visual_analysis?: string;
  audio_score?: number;
  audio_analysis?: string;
  thumbnail_suggestions?: string[];
  created_at: string;
  // Hook Intelligence metrics
  first_3s_score?: number;
  attention_level?: 'low' | 'medium' | 'high';
  cognitive_load?: number;
  scroll_stop_prob?: {
    tiktok: number;
    instagram: number;
    youtube: number;
  };
  hook_suggestions?: string[];
  // Script Intelligence metrics
  script_analysis?: {
    hook_strength: number;
    body_engagement: number;
    call_to_action: number;
    sentiment_flow: string;
    flow_distribution: { positive: number; neutral: number; negative: number };
    compliance_flags: string[];
    suggestions: string[];
  };
  // Visual Intelligence metrics
  visual_analysis_details?: {
    clutter_density: number;
    color_harmony: string;
    object_count: number;
    detected_faces: number;
    luminance: number;
    brand_logo_seconds: number[];
    critical_errors: string[];
    safe_zones_pass: boolean;
  };
  // Audio Intelligence metrics
  audio_analysis_details?: {
    voice_music_balance: string;
    peak_db: number;
    rms_db: number;
    speech_rate_wpm: number;
    voice_pleasantness_score: number;
    dynamic_range_db: number;
    bg_music_matching_score: number;
    critical_noise_events: number;
    suggestions: string[];
  };
  // Target Audience metrics
  audience_analysis?: {
    segments: Array<{ name: string; match_score: number; explanation: string }>;
    demographics: { age: string; gender: string; geography: string };
    psychographics: string[];
    behavioral_triggers: string[];
  };
}

export interface SystemSettings {
  theme: 'light' | 'dark' | 'system';
  border_radius: string;
  language: string;
  timezone: string;
  date_format: string;
  user_email: string;
}

export interface PredictionResult {
  predictedViews: number;
  predictedLikes: number;
  predictedComments: number;
  predictedShares: number;
  predictedSaves?: number;
  predictedFollowers?: number;
  hookScore: number;
  retentionRate: number;
  viralityProbability: number;
  confidence: number | string;
  retentionCurve?: Array<{ second: number; pct: number }> | number[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  unread: boolean;
}
