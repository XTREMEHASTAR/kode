export interface ScoreBreakdownData {
  attention: number;
  interest: number;
  clarity: number;
  relevance: number;
  emotionalImpact: number;
}

export interface InsightData {
  positive: string[];
  improvement: string[];
}

export interface SuggestionItem {
  title: string;
  explanation: string;
  example?: string;
}

export interface SectionReview {
  text: string;
  works: string;
  improve: string;
  rewrite?: string;
}

export interface CanonicalSignals {
  contrarian: boolean;
  expectationViolation: boolean;
  curiosityGap: boolean;
  directAddress: boolean;
  specificity: boolean;
  concreteTimeframe: boolean;
  numberAnchor: boolean;
  patternInterrupt: boolean;
  problemPain: boolean;
  benefitPromise: boolean;
  question: boolean;
  ctaTypes: string[];
}

export interface ScriptReviewData {
  hook: SectionReview;
  body: SectionReview;
  cta: SectionReview;
}

export interface FreeTierScript {
  id: string;
  userId?: string;
  legacyLocal?: boolean;
  title: string;
  scriptText: string;
  originalScriptText?: string;
  versions?: Array<{
    id: string;
    name: string;
    scriptText: string;
    hookScore: number;
    createdAt: string;
    type: 'original' | 'ai-hook' | 'ai-script' | 'user-edit';
  }>;
  contentType: string;
  createdAt: string;
  hookScore: number;
  scriptScore?: number;
  isFavorite: boolean;
  wordCount: number;
  characterCount: number;
  estimatedSpeakingTime: number;
  hookText: string;
  signals: string[];
  engineVersion: string;
  analysisMode: string;
  analysisConfidence: 'High' | 'Limited';
  canonicalSignals?: CanonicalSignals;
  
  analysisResult: {
    hookScore: number;
    scriptScore?: number;
    hookStatus: 'Excellent Hook' | 'Strong Hook' | 'Good Foundation' | 'Needs Improvement' | 'Weak Hook';
    hookSupportingText: string;
    scoreBreakdown: ScoreBreakdownData;
    insights: InsightData;
    suggestions: SuggestionItem[];
    scriptReview: ScriptReviewData;
    structure: {
      hook: string;
      body: string;
      cta: string;
    };
    ctaDetected: boolean;
    canonicalSignals?: CanonicalSignals;
  };
}
