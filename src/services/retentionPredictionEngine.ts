/**
 * KONTAGI Predictive Retention Engine
 * 
 * Fully functional, 100% deterministic audience retention prediction engine.
 * Computes predicted retention timeline, risk markers, drop-off points, and strongest moments
 * based strictly on script structure, hook strength, pacing, information density, and engagement signals.
 */

import { ScriptAnalysisResult } from './scriptAnalysisEngine';
import {
  RetentionPredictionResult,
  RetentionTimelinePoint,
  RetentionSegment,
  DropOffPoint,
  StrongestMoment,
  TopRetentionRisk,
  RetentionRiskSignal,
  RetentionProtectingSignal,
  SegmentType,
  DropSeverity,
  ConfidenceLevel
} from '../types/retention';

const ENGINE_VERSION = '1.0.0-deterministic';
const DISCLAIMER_TEXT = 'Prediction based on script structure, hook strength, pacing, information density, and engagement signals. Actual performance may vary.';

// --- Helper: Deterministic Input Hash / Fingerprint ---
export function computeScriptFingerprint(text: string): string {
  let hash = 0;
  const clean = text.trim().toLowerCase();
  for (let i = 0; i < clean.length; i++) {
    const char = clean.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `fp_${Math.abs(hash).toString(36)}_${clean.length}`;
}

// --- Timing Estimation Interface ---
interface SentenceTiming {
  index: number;
  text: string;
  wordCount: number;
  startSecond: number;
  endSecond: number;
  durationSeconds: number;
}

/**
 * Estimate timing for each sentence based on word count & punctuation pauses
 * Baseline speaking rate: 150 WPM (~2.5 words per second)
 */
export function estimateScriptTiming(scriptText: string): { sentences: SentenceTiming[]; totalDuration: number } {
  const rawSentences = scriptText
    .split(/(?<=[.!?\n])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (rawSentences.length === 0) {
    return { sentences: [], totalDuration: 0 };
  }

  const sentences: SentenceTiming[] = [];
  let currentSecond = 0;

  rawSentences.forEach((text, index) => {
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Base speaking duration (150 WPM = 0.4s per word)
    let duration = wordCount * 0.4;

    // Punctuation and structural pause weights
    if (/[.!?]$/.test(text)) {
      duration += 0.35; // End-of-sentence pause
    } else if (/[,;—:-]$/.test(text)) {
      duration += 0.20; // Clause pause
    }

    if (/\?/.test(text)) {
      duration += 0.2;
    }

    if (wordCount <= 5 && wordCount > 0) {
      duration += 0.2;
    }

    duration = Math.max(0.6, Math.round(duration * 10) / 10);

    const startSecond = Math.round(currentSecond * 10) / 10;
    currentSecond += duration;
    const endSecond = Math.round(currentSecond * 10) / 10;

    sentences.push({
      index,
      text,
      wordCount,
      startSecond,
      endSecond,
      durationSeconds: Math.round((endSecond - startSecond) * 10) / 10
    });
  });

  return {
    sentences,
    totalDuration: Math.max(1, Math.round(currentSecond * 10) / 10)
  };
}

/**
 * Deterministic Risk Signals Detector
 */
function detectRiskSignals(text: string, startSecond: number, endSecond: number, isFirstSegment: boolean, totalDuration: number): RetentionRiskSignal[] {
  const risks: RetentionRiskSignal[] = [];
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // 1. GENERIC_OPENING
  if (isFirstSegment && /^(hello|hi|hey|welcome|good morning|good evening|what's up|greetings)/i.test(lower)) {
    risks.push({
      id: 'risk_generic_opening',
      code: 'GENERIC_OPENING',
      name: 'Generic Greeting Opening',
      description: 'Opening with a generic greeting delays the curiosity hook.',
      impact: 'critical',
      penalty: 35,
      recommendation: 'Replace greeting with a direct problem statement or contrarian claim.'
    });
  }

  // 2. META_INTRODUCTION
  if (isFirstSegment && /\b(today i|in this video|welcome back|my channel|my name is|i wanted to talk|some things that)\b/i.test(lower)) {
    risks.push({
      id: 'risk_meta_intro',
      code: 'META_INTRODUCTION',
      name: 'Meta Video Introduction',
      description: 'Explaining what the video will be about instead of hooking viewers immediately.',
      impact: 'high',
      penalty: 25,
      recommendation: 'Cut the meta intro; state the viewer payoff in line 1.'
    });
  }

  // 3. LONG_SENTENCE
  if (wordCount > 32) {
    risks.push({
      id: `risk_long_sentence_${startSecond}`,
      code: 'LONG_SENTENCE',
      name: 'Overloaded Long Sentence',
      description: 'Sentence exceeds 32 words without breaking, causing cognitive fatigue.',
      impact: 'medium',
      penalty: 12,
      recommendation: 'Split this sentence into 2-3 shorter, punchier statements.'
    });
  }

  // 4. LOW_INFORMATION_DENSITY
  if (/\b(very popular|lots of people|many things|just keep trying|so many|stuff|things|lots of)\b/i.test(lower)) {
    risks.push({
      id: `risk_low_density_${startSecond}`,
      code: 'LOW_INFORMATION_DENSITY',
      name: 'Vague / Low Information Density',
      description: 'Uses filler terms without concrete facts, data, or specific examples.',
      impact: 'high',
      penalty: 22,
      recommendation: 'Replace generic words with specific metrics, tools, or real-world cases.'
    });
  }

  // 5. REPETITION
  if (/\b(keep trying|regularly|post regularly|many things)\b/i.test(lower) && !isFirstSegment) {
    risks.push({
      id: `risk_repetition_${startSecond}`,
      code: 'REPETITION',
      name: 'Generic Advice Repetition',
      description: 'Repeats obvious advice without adding new depth or tactical guidance.',
      impact: 'high',
      penalty: 20,
      recommendation: 'Replace repetitive advice with step-by-step action items.'
    });
  }

  // 6. CTA_TOO_EARLY
  if (startSecond < 10 && /\b(follow|subscribe|link in bio|click|comment|save)\b/i.test(lower)) {
    risks.push({
      id: `risk_cta_early_${startSecond}`,
      code: 'CTA_TOO_EARLY',
      name: 'Premature Call to Action',
      description: 'Asking for value (follow/click) before delivering value creates friction.',
      impact: 'high',
      penalty: 20,
      recommendation: 'Move call to action to after delivering core insight.'
    });
  }

  // 7. DELAYED_VALUE
  if (startSecond >= 5 && startSecond <= 15 && /\b(platform|lots of people|social media|help you)\b/i.test(lower)) {
    risks.push({
      id: `risk_delayed_value_${startSecond}`,
      code: 'DELAYED_VALUE',
      name: 'Delayed Main Value',
      description: 'Core insight is delayed after the opening setup.',
      impact: 'medium',
      penalty: 18,
      recommendation: 'Introduce the core problem or solution immediately after the hook.'
    });
  }

  return risks;
}

/**
 * Deterministic Protecting Signals Detector
 */
function detectProtectingSignals(text: string, isFirstSegment: boolean): RetentionProtectingSignal[] {
  const protections: RetentionProtectingSignal[] = [];
  const lower = text.toLowerCase();

  // 1. CONTRARIAN_CLAIM
  if (/\b(stop (doing|blaming|using|making|buying)|don't|mistake|wrong|nobody|myth|never)\b/i.test(lower)) {
    protections.push({
      id: 'prot_contrarian',
      code: 'CONTRARIAN_CLAIM',
      name: 'Contrarian / Pattern Interrupt Claim',
      description: 'Challenges viewer assumptions to trigger immediate curiosity.',
      impact: 'high',
      protection: 24
    });
  }

  // 2. NUMBER_ANCHOR
  if (/\b(\d+|three|four|five|10x|500|three mistakes|3 steps|3 tips|3 ways|500 views)\b/i.test(lower)) {
    protections.push({
      id: 'prot_number_anchor',
      code: 'NUMBER_ANCHOR',
      name: 'Concrete Number / Structural Anchor',
      description: 'Gives the viewer a clear expectations framework.',
      impact: 'high',
      protection: 20
    });
  }

  // 3. CURIOSITY_GAP
  if (/\b(why|secret|real reason|hidden|before you|if your|losing|dying|biggest mistake)\b/i.test(lower)) {
    protections.push({
      id: 'prot_curiosity_gap',
      code: 'CURIOSITY_GAP',
      name: 'Curiosity Gap / Open Loop',
      description: 'Creates a psychological need for resolution.',
      impact: 'high',
      protection: 22
    });
  }

  // 4. CONTRAST_EXAMPLE
  if (/\b(instead of|try:|same topic|completely different|save this structure)\b/i.test(lower)) {
    protections.push({
      id: 'prot_contrast_example',
      code: 'CONTRAST_EXAMPLE',
      name: 'Side-by-Side Contrast Example',
      description: 'Demonstrates value clearly through before-vs-after contrast.',
      impact: 'high',
      protection: 22
    });
  }

  // 5. DIRECT_AUDIENCE_ADDRESS
  if (/\b(you|your|you're|creators|if your reels|if you)\b/i.test(lower)) {
    protections.push({
      id: 'prot_direct_address',
      code: 'DIRECT_AUDIENCE_ADDRESS',
      name: 'Direct Audience Address',
      description: 'Speaks directly to a specific target viewer profile.',
      impact: 'medium',
      protection: 14
    });
  }

  // 6. SPECIFIC_OUTCOME
  if (/\b(double|growth|views|retention|convert|save this|instead of|try:)\b/i.test(lower)) {
    protections.push({
      id: 'prot_specific_outcome',
      code: 'SPECIFIC_OUTCOME',
      name: 'Specific Outcome / Concrete Value',
      description: 'Promises tangible, actionable value.',
      impact: 'medium',
      protection: 16
    });
  }

  return protections;
}

/**
 * Core Deterministic Retention Prediction Function
 */
export function predictRetention(
  scriptText: string,
  analysisResult?: ScriptAnalysisResult,
  contentType: string = 'Instagram Reel'
): RetentionPredictionResult {
  const cleanScript = scriptText ? scriptText.trim() : '';
  const fingerprint = computeScriptFingerprint(cleanScript);
  const words = cleanScript.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Short / Invalid script check (< 15 words)
  if (wordCount < 15) {
    return {
      version: ENGINE_VERSION,
      generatedAt: new Date().toISOString(),
      inputFingerprint: fingerprint,
      confidence: 'Low',
      confidenceReason: 'Script contains under 15 words. Insufficient context for simulation.',
      status: 'INSUFFICIENT_DATA',
      statusMessage: 'NOT ENOUGH CONTENT TO PREDICT RETENTION. Add at least 15-20 words including a hook, value, and CTA to generate a predictive retention map.',
      estimatedDuration: Math.max(1, Math.round(wordCount * 0.4)),
      summary: {
        predictedAverageRetention: 0,
        predictedCompletionRate: 0,
        hookRetention: 0,
        strongestMoment: 'N/A',
        highestRiskMoment: 'N/A',
        highestRiskRange: '0s',
        totalEstimatedSeconds: Math.max(1, Math.round(wordCount * 0.4))
      },
      timeline: [],
      segments: [],
      dropOffPoints: [],
      strongestMoments: [],
      topRisks: [],
      recommendations: [
        'Add a strong 3-second hook to grab attention.',
        'Expand on the main problem or value.',
        'Include a clear call to action.'
      ],
      disclaimer: DISCLAIMER_TEXT
    };
  }

  // 1. Timing Estimation
  const { sentences, totalDuration } = estimateScriptTiming(cleanScript);

  // 2. Build Segments
  const segments: RetentionSegment[] = [];
  let prevExitRetention = 100;

  sentences.forEach((st, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === sentences.length - 1;
    const lower = st.text.toLowerCase();

    // Determine segment type
    let type: SegmentType = 'VALUE';
    if (isFirst || st.startSecond <= 3.5) {
      type = 'HOOK';
    } else if (isLast || /\b(follow|save|subscribe|click|link|comment)\b/i.test(lower)) {
      type = 'CTA';
    } else if (/\b(mistake|problem|issue|losing|dying|fail|wrong)\b/i.test(lower)) {
      type = 'PROBLEM';
    } else if (/\b(instead|try|example|here is|such as)\b/i.test(lower)) {
      type = 'EXAMPLE';
    } else if (st.startSecond <= 9) {
      type = 'SETUP';
    }

    // Detect Signals
    const risks = detectRiskSignals(st.text, st.startSecond, st.endSecond, isFirst, totalDuration);
    const protections = detectProtectingSignals(st.text, isFirst);

    // Compute Base Component Scores (0-100)
    let attention = 70;
    let curiosity = 65;
    let clarity = 75;
    let relevance = 70;
    let emotionalImpact = 60;
    let informationDensity = 65;
    let pacing = 75;
    let specificity = 65;

    if (isFirst) {
      if (risks.some((r) => r.code === 'GENERIC_OPENING')) attention -= 40;
      if (risks.some((r) => r.code === 'META_INTRODUCTION')) attention -= 30;
      if (protections.some((p) => p.code === 'CONTRARIAN_CLAIM')) attention += 25;
      if (protections.some((p) => p.code === 'CURIOSITY_GAP')) curiosity += 25;
      if (protections.some((p) => p.code === 'NUMBER_ANCHOR')) specificity += 20;
    }

    attention = Math.max(10, Math.min(100, attention));
    curiosity = Math.max(10, Math.min(100, curiosity));
    clarity = Math.max(10, Math.min(100, clarity));
    relevance = Math.max(10, Math.min(100, relevance));
    emotionalImpact = Math.max(10, Math.min(100, emotionalImpact));
    informationDensity = Math.max(10, Math.min(100, informationDensity));
    pacing = Math.max(10, Math.min(100, pacing));
    specificity = Math.max(10, Math.min(100, specificity));

    // Weighted Segment Quality Score (0-100)
    const segmentQualityScore =
      attention * 0.22 +
      curiosity * 0.18 +
      clarity * 0.18 +
      relevance * 0.16 +
      specificity * 0.14 +
      pacing * 0.12;

    const totalPenalties = risks.reduce((sum, r) => sum + r.penalty, 0);
    const totalProtections = protections.reduce((sum, p) => sum + p.protection, 0);

    // Base drop rate (% per sec)
    let baseDropRatePerSec = 1.0;
    if (segmentQualityScore < 45) baseDropRatePerSec = 3.6;
    else if (segmentQualityScore < 58) baseDropRatePerSec = 2.2;
    else if (segmentQualityScore > 78) baseDropRatePerSec = 0.2;

    // Modifiers
    const penaltyDrop = (totalPenalties / 100) * 2.5;
    const protectionSave = (totalProtections / 100) * 1.8;
    
    // Net drop rate bounded safely
    let netDropRatePerSec = Math.max(0.05, baseDropRatePerSec + penaltyDrop - protectionSave);

    // Micro-stabilization / Plateau if strong protections exist
    if (totalProtections >= 30 && totalPenalties === 0) {
      netDropRatePerSec = 0.05; // Virtual plateau
    }

    const entryRetention = prevExitRetention;
    const segmentDuration = Math.max(0.5, st.endSecond - st.startSecond);
    const totalSegmentDrop = netDropRatePerSec * segmentDuration;

    let exitRetention = Math.round(Math.max(5, entryRetention - totalSegmentDrop) * 10) / 10;
    prevExitRetention = exitRetention;

    // Determine Drop Risk Severity
    let dropRisk: DropSeverity = 'LOW';
    if (totalPenalties >= 25 || netDropRatePerSec > 2.2) dropRisk = 'CRITICAL';
    else if (totalPenalties >= 15 || netDropRatePerSec > 1.5) dropRisk = 'HIGH';
    else if (totalPenalties >= 8 || netDropRatePerSec > 0.9) dropRisk = 'MEDIUM';

    const reasons = [
      ...risks.map((r) => r.description),
      ...protections.map((p) => p.description)
    ];

    const recommendations = risks.map((r) => r.recommendation);

    segments.push({
      id: `seg_${idx}_${st.startSecond}`,
      startSecond: st.startSecond,
      endSecond: st.endSecond,
      text: st.text,
      type,
      scores: {
        attention,
        clarity,
        curiosity,
        relevance,
        emotionalImpact,
        informationDensity,
        pacing,
        specificity
      },
      predictedEntryRetention: entryRetention,
      predictedExitRetention: exitRetention,
      dropRisk,
      risks,
      protections,
      reasons,
      recommendations
    });
  });

  // 3. Build Timeline (Second-by-Second Points)
  const timeline: RetentionTimelinePoint[] = [];
  const integerDuration = Math.ceil(totalDuration);

  for (let sec = 0; sec <= integerDuration; sec++) {
    const activeSeg =
      segments.find((seg) => sec >= seg.startSecond && sec <= seg.endSecond) ||
      segments[segments.length - 1];

    let currentRetention = 100;
    if (sec === 0) {
      currentRetention = 100;
    } else if (activeSeg) {
      const segSpan = Math.max(0.1, activeSeg.endSecond - activeSeg.startSecond);
      const progress = Math.min(1, Math.max(0, (sec - activeSeg.startSecond) / segSpan));
      currentRetention = Math.round(
        (activeSeg.predictedEntryRetention -
          progress * (activeSeg.predictedEntryRetention - activeSeg.predictedExitRetention)) * 10
      ) / 10;
    }

    let pointRisk: DropSeverity | 'NONE' | 'STRONG' = activeSeg ? activeSeg.dropRisk : 'NONE';
    if (activeSeg && activeSeg.protections.length > 0 && activeSeg.risks.length === 0) {
      pointRisk = 'STRONG';
    }

    timeline.push({
      second: sec,
      retention: Math.max(5, Math.min(100, currentRetention)),
      risk: pointRisk,
      segmentId: activeSeg ? activeSeg.id : 'seg_0',
      sentenceText: activeSeg ? activeSeg.text : '',
      reasons: activeSeg ? activeSeg.reasons : []
    });
  }

  // 4. Extract Key Metrics
  const hookRetentionPoint = timeline.find((pt) => pt.second === 3) || timeline[Math.min(3, timeline.length - 1)];
  const hookRetention = hookRetentionPoint ? hookRetentionPoint.retention : 75;

  const avgRetention =
    timeline.length > 0
      ? Math.round((timeline.reduce((sum, pt) => sum + pt.retention, 0) / timeline.length) * 10) / 10
      : 50;

  const completionRate = timeline.length > 0 ? timeline[timeline.length - 1].retention : 30;

  // 5. Extract Drop-Off Points
  const dropOffPoints: DropOffPoint[] = [];
  segments.forEach((seg) => {
    const dropAmount = seg.predictedEntryRetention - seg.predictedExitRetention;
    if (dropAmount >= 4 || seg.dropRisk === 'HIGH' || seg.dropRisk === 'CRITICAL') {
      const primaryRisk = seg.risks[0];
      dropOffPoints.push({
        second: Math.round(((seg.startSecond + seg.endSecond) / 2) * 10) / 10,
        severity: seg.dropRisk,
        retentionBefore: seg.predictedEntryRetention,
        retentionAfter: seg.predictedExitRetention,
        segmentId: seg.id,
        segmentText: seg.text,
        reason: primaryRisk ? primaryRisk.description : 'Decay in viewer curiosity during explanation.',
        recommendation: primaryRisk ? primaryRisk.recommendation : 'Add a pattern interrupt or specific example.'
      });
    }
  });

  // 6. Extract Strongest Moments
  const strongestMoments: StrongestMoment[] = [];
  segments.forEach((seg) => {
    if (seg.protections.length > 0 || seg.predictedExitRetention >= seg.predictedEntryRetention - 2) {
      const primaryProtection = seg.protections[0];
      strongestMoments.push({
        startSecond: seg.startSecond,
        endSecond: seg.endSecond,
        peakRetention: seg.predictedEntryRetention,
        segmentText: seg.text,
        reason: primaryProtection
          ? primaryProtection.description
          : 'Clear structure and concise delivery maintain steady audience attention.'
      });
    }
  });

  // 7. Generate Top Risks Summary
  const topRisks: TopRetentionRisk[] = [];
  const highestRiskSegs = [...segments]
    .filter((s) => s.risks.length > 0)
    .sort((a, b) => b.risks.reduce((sum, r) => sum + r.penalty, 0) - a.risks.reduce((sum, r) => sum + r.penalty, 0))
    .slice(0, 3);

  highestRiskSegs.forEach((seg, idx) => {
    const r = seg.risks[0];
    topRisks.push({
      rank: idx + 1,
      title: r.name,
      predictedImpact: r.impact === 'critical' || r.impact === 'high' ? 'HIGH' : 'MEDIUM',
      secondRange: `${seg.startSecond}s–${seg.endSecond}s`,
      description: r.description,
      suggestedFix: r.recommendation,
      potentialBenefit: 'Potentially improves predicted retention by 10-25%.'
    });
  });

  // 8. Highest Risk Zone
  const highestRiskSeg = highestRiskSegs[0];
  const highestRiskMoment = highestRiskSeg
    ? `${highestRiskSeg.startSecond}s–${highestRiskSeg.endSecond}s (${highestRiskSeg.risks[0]?.name || 'Pacing Risk'})`
    : 'None detected';
  const highestRiskRange = highestRiskSeg ? `${highestRiskSeg.startSecond}s–${highestRiskSeg.endSecond}s` : '0s';

  // 9. Confidence Rating
  let confidence: ConfidenceLevel = 'High';
  let confidenceReason = 'Based on clear sentence structure, hook signals, and timing estimation.';
  if (wordCount < 30) {
    confidence = 'Medium';
    confidenceReason = 'Short script length (under 30 words) provides moderate structural signals.';
  } else if (wordCount > 250) {
    confidence = 'Medium';
    confidenceReason = 'Long script format; simulation assumes standard 150 WPM pacing.';
  }

  // 10. General Recommendations
  const globalRecommendations: string[] = [];
  if (hookRetention < 70) {
    globalRecommendations.push('Hook Refactor: Replace generic intro with a contrarian statement or curiosity gap.');
  }
  if (topRisks.length > 0) {
    globalRecommendations.push(`Fix Top Risk: Address ${topRisks[0].title} in the ${topRisks[0].secondRange} window.`);
  }
  globalRecommendations.push('Maintain information density by replacing general statements with numbers and concrete examples.');

  return {
    version: ENGINE_VERSION,
    generatedAt: new Date().toISOString(),
    inputFingerprint: fingerprint,
    confidence,
    confidenceReason,
    status: 'READY',
    estimatedDuration: totalDuration,
    summary: {
      predictedAverageRetention: avgRetention,
      predictedCompletionRate: completionRate,
      hookRetention,
      strongestMoment: strongestMoments[0] ? `${strongestMoments[0].startSecond}s–${strongestMoments[0].endSecond}s` : '0s–3s',
      highestRiskMoment,
      highestRiskRange,
      totalEstimatedSeconds: totalDuration
    },
    timeline,
    segments,
    dropOffPoints,
    strongestMoments,
    topRisks,
    recommendations: globalRecommendations,
    disclaimer: DISCLAIMER_TEXT
  };
}
