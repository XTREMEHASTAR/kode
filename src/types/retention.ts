/**
 * KONTAGI Predictive Retention Types
 */

export type SegmentType = 'HOOK' | 'SETUP' | 'PROBLEM' | 'VALUE' | 'EXPLANATION' | 'EXAMPLE' | 'PAYOFF' | 'CTA';

export type DropSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface RetentionRiskSignal {
  id: string;
  code: string;
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  penalty: number;
  recommendation: string;
}

export interface RetentionProtectingSignal {
  id: string;
  code: string;
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  protection: number;
}

export interface DropOffPoint {
  second: number;
  severity: DropSeverity;
  retentionBefore: number;
  retentionAfter: number;
  segmentId: string;
  segmentText: string;
  reason: string;
  recommendation: string;
}

export interface StrongestMoment {
  startSecond: number;
  endSecond: number;
  peakRetention: number;
  segmentText: string;
  reason: string;
}

export interface RetentionSegmentScores {
  attention: number;
  clarity: number;
  curiosity: number;
  relevance: number;
  emotionalImpact: number;
  informationDensity: number;
  pacing: number;
  specificity: number;
}

export interface RetentionSegment {
  id: string;
  startSecond: number;
  endSecond: number;
  text: string;
  type: SegmentType;
  scores: RetentionSegmentScores;
  predictedEntryRetention: number;
  predictedExitRetention: number;
  dropRisk: DropSeverity;
  risks: RetentionRiskSignal[];
  protections: RetentionProtectingSignal[];
  reasons: string[];
  recommendations: string[];
}

export interface RetentionTimelinePoint {
  second: number;
  retention: number;
  risk: DropSeverity | 'NONE' | 'STRONG';
  segmentId: string;
  sentenceText: string;
  reasons: string[];
}

export interface TopRetentionRisk {
  rank: number;
  title: string;
  predictedImpact: 'HIGH' | 'MEDIUM' | 'LOW';
  secondRange: string;
  description: string;
  suggestedFix: string;
  potentialBenefit: string;
}

export interface RetentionSummary {
  predictedAverageRetention: number;
  predictedCompletionRate: number;
  hookRetention: number; // At 3s
  strongestMoment: string;
  highestRiskMoment: string;
  highestRiskRange: string;
  totalEstimatedSeconds: number;
}

export interface RetentionPredictionResult {
  version: string;
  generatedAt: string;
  inputFingerprint: string;
  confidence: ConfidenceLevel;
  confidenceReason: string;
  status: 'READY' | 'INSUFFICIENT_DATA' | 'ERROR';
  statusMessage?: string;
  estimatedDuration: number;
  summary: RetentionSummary;
  timeline: RetentionTimelinePoint[];
  segments: RetentionSegment[];
  dropOffPoints: DropOffPoint[];
  strongestMoments: StrongestMoment[];
  topRisks: TopRetentionRisk[];
  recommendations: string[];
  disclaimer: string;
}

export interface ComparativeRetentionCurve {
  original: RetentionPredictionResult;
  optimized: RetentionPredictionResult;
  avgRetentionDelta: number;
  completionRateDelta: number;
  hookRetentionDelta: number;
  isImproved: boolean;
  improvementSummary: string;
}
