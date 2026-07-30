import { ScoreBreakdownData, InsightData, SuggestionItem, ScriptReviewData, CanonicalSignals } from '../types/freeTier';

export interface CTAMatch {
  type: string; // 'SAVE CTA' | 'FOLLOW CTA' | 'COMMENT CTA' | 'CLICK CTA' | 'ACTION CTA' | 'SHARE CTA'
  label: string;
  text: string;
}

export interface DiagnosticsData {
  componentScores: {
    attention: number;
    curiosity: number;
    relevance: number;
    specificity: number;
    contrarian: number;
    continuation: number;
  };
  positiveSignals: string[];
  penalties: string[];
  finalHookScore: number;
  ctaClassification: string[];
}

export interface ScriptAnalysisResult {
  hookScore: number;
  scriptScore?: number;
  hookStatus: 'Excellent Hook' | 'Strong Hook' | 'Good Foundation' | 'Needs Improvement' | 'Weak Hook';
  hookSupportingText: string;
  scoreBreakdown: ScoreBreakdownData;
  insights: InsightData;
  suggestions: SuggestionItem[];
  scriptReview: ScriptReviewData;
  
  contentType: string;
  wordCount: number;
  characterCount: number;
  estimatedSpeakingTime: number;
  hookText: string;
  hookWordCount: number;
  ctaDetected: boolean;
  ctaText: string;
  ctaType: string;
  ctaMatches: CTAMatch[];
  ctaStrength: number;
  analysisConfidence: 'High' | 'Limited';
  signals: string[];
  structure: {
    hook: string;
    body: string;
    cta: string;
  };
  diagnostics: DiagnosticsData;
  canonicalSignals: CanonicalSignals;
}

// Configurable speaking rate (WPM)
const DEFAULT_WPM = 150;

// Centralized Component Weights (Must sum to 1.0)
export const COMPONENT_WEIGHTS = {
  attention: 0.25,
  curiosity: 0.20,
  relevance: 0.20,
  specificity: 0.15,
  contrarian: 0.10,
  continuation: 0.10
};

/**
 * Detect CTA types in text with strict follow intent requirements
 */
export function detectCTAs(text: string): CTAMatch[] {
  const matches: CTAMatch[] = [];
  const lower = text.toLowerCase();

  // 1. SAVE CTA
  if (/\b(save|bookmark)\b/i.test(lower)) {
    matches.push({ type: 'SAVE CTA', label: 'Save/Bookmark', text });
  }

  // 2. FOLLOW CTA (Requires genuine follow/subscription intent phrases)
  const isFollowIntent = /\b(follow (me|for|my|this|us|page|channel|account)|hit follow|please follow|subscribe|follow for part)\b/i.test(lower) ||
    (/^\s*follow\b/i.test(lower) && !/\bfollow(ing)? (before|them)\b/i.test(lower));

  if (isFollowIntent) {
    matches.push({ type: 'FOLLOW CTA', label: 'Follow/Subscribe', text });
  }

  // 3. COMMENT CTA
  if (/\b(comment|reply|drop|type)\b/i.test(lower)) {
    matches.push({ type: 'COMMENT CTA', label: 'Comment/Engagement', text });
  }

  // 4. CLICK CTA
  if (/\b(click|link|bio|visit|download|sign up)\b/i.test(lower)) {
    matches.push({ type: 'CLICK CTA', label: 'Click/Direct Action', text });
  }

  // 5. ACTION CTA
  if (/\b(try|test|check|compare|apply|start|use)\b/i.test(lower)) {
    matches.push({ type: 'ACTION CTA', label: 'Action/Implementation', text });
  }

  // 6. SHARE CTA
  if (/\b(share (this|with)|send to|share reel)\b/i.test(lower)) {
    matches.push({ type: 'SHARE CTA', label: 'Share', text });
  }

  return matches;
}

/**
 * Segment opening hook window (first 1–3 sentences / up to ~35 words)
 */
function extractHookWindow(text: string): { hookText: string; rawSentences: string[]; remainingText: string } {
  const rawSentences = text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  if (rawSentences.length === 0) {
    return { hookText: text, rawSentences: [], remainingText: '' };
  }
  
  let hookSentences: string[] = [];
  let currentWords = 0;
  for (const s of rawSentences) {
    const count = s.split(/\s+/).length;
    if (hookSentences.length > 0 && currentWords + count > 35 && hookSentences.length >= 1) {
      break;
    }
    hookSentences.push(s);
    currentWords += count;
    if (hookSentences.length >= 3) break;
  }
  
  const hookText = hookSentences.join(' ');
  const remainingText = rawSentences.slice(hookSentences.length).join(' ');
  return { hookText, rawSentences, remainingText };
}

/**
 * Detect contrarian framing & expectation violation
 */
function detectExpectationViolation(text: string): { isViolation: boolean; label?: string } {
  const lower = text.toLowerCase();

  const expectationPatterns = [
    { pattern: /\b(might not be|is not|isn't|are not|aren't) (failing|losing|working|dying|broken) because of\b/i, label: "Rejection of Common Cause" },
    { pattern: /\bnot because of\b/i, label: "Not Because of X" },
    { pattern: /\bit's not\b.+\b(it's|they're)\b/i, label: "It's Not X — It's Y" },
    { pattern: /\bstop (blaming|doing|using|making)\b/i, label: "Stop Blaming/Doing X" },
    { pattern: /\byou think\b.+\bbut\b/i, label: "You Think X, But Y" },
    { pattern: /\bthe problem isn't\b/i, label: "Problem Isn't X" },
    { pattern: /\bwon't fix\b/i, label: "X Won't Fix Y" },
    { pattern: /\beveryone is wrong about\b/i, label: "Everyone Is Wrong About X" },
    { pattern: /\bcontrary to\b/i, label: "Contrary to Belief" },
    // Semantic expectations:
    { pattern: /\bfix(ing)? the wrong (part|thing|problem)\b/i, label: "Wrong Focus Frame" },
    { pattern: /\bfocus(ing)? on the wrong (part|thing|problem)\b/i, label: "Wrong Focus Frame" },
    { pattern: /\bsolving the wrong problem\b/i, label: "Wrong Focus Frame" },
    { pattern: /\bthink(ing)? is (helping|working) (may|might|could) be (hurting|failing|killing)\b/i, label: "Assumption Challenge" },
    { pattern: /\bwhat you're doing isn't the real problem\b/i, label: "Misdirection Reveal" },
    { pattern: /\bthe obvious solution isn't\b/i, label: "Misdirection Reveal" },
    { pattern: /\bmost creators focus on.+when\b/i, label: "Common Belief Reversal" },
    { pattern: /\bbefore you change.+check\b/i, label: "Misdirection Reveal" },
    { pattern: /\b(may not be|might not be) the reason\b/i, label: "Rejection of Common Cause" }
  ];

  for (const item of expectationPatterns) {
    if (item.pattern.test(lower)) {
      return { isViolation: true, label: item.label };
    }
  }

  return { isViolation: false };
}

/**
 * Detect curiosity gap
 */
function detectCuriosityGap(text: string): { hasGap: boolean } {
  const lower = text.toLowerCase();
  
  if (/\?/.test(text)) return { hasGap: true };
  
  const curiosityPatterns = [
    /\b(wrong part|wrong thing|wrong problem)\b/i,
    /\bwhat nobody tells you about\b/i,
    /\bthe reason isn't what you think\b/i,
    /\bone (part|mistake|thing) is (killing|ruining|quietly)\b/i,
    /\b(reasons why|here's why|check these|before uploading|before your next)\b/i,
    /\b(secret|reveal|hide|hack|trick|confession)\b/i,
    /\bthe real reason\b/i,
    /\bwhat happens in the\b/i
  ];
  
  for (const pattern of curiosityPatterns) {
    if (pattern.test(lower)) {
      return { hasGap: true };
    }
  }
  
  return { hasGap: false };
}

/**
 * Detect opening penalties (greetings, meta-introductions, passive fluff)
 */
function detectOpeningPenalties(hookWindowText: string): { hasGreeting: boolean; hasMetaIntro: boolean; hasFluffIntro: boolean; penaltyList: string[] } {
  const lower = hookWindowText.toLowerCase();
  const penaltyList: string[] = [];

  const greetingPattern = /^(hello|hi|hey|good morning|good evening|welcome|what's up|greetings)\b/i;
  const hasGreeting = greetingPattern.test(lower) || /\bwelcome to my (video|channel|reel|tiktok)\b/i.test(lower);
  if (hasGreeting) {
    penaltyList.push("Generic Greeting Penalty (-35 Attention)");
  }

  const metaIntroPattern = /\b(today (i am going to|i'll|we will|i want to)|in this video (i am|i'll|we're)|i'm going to talk about|let's talk about|today's video is about|how you can grow your)\b/i;
  const hasMetaIntro = metaIntroPattern.test(lower);
  if (hasMetaIntro) {
    penaltyList.push("Meta-Introduction Penalty (-35 Attention)");
  }

  const fluffIntroPattern = /\b(is a very useful platform|many people use|posting regularly|making good content|there are many different things)\b/i;
  const hasFluffIntro = fluffIntroPattern.test(lower) && (hasGreeting || hasMetaIntro);
  if (hasFluffIntro) {
    penaltyList.push("Passive Fluff Intro Penalty (-15 Attention)");
  }

  return { hasGreeting, hasMetaIntro, hasFluffIntro, penaltyList };
}

/**
 * Detect concrete specificity signals and vague terminology penalties
 */
function detectSpecificitySignals(hookWindowText: string): { score: number; signals: string[]; penalties: string[] } {
  const lower = hookWindowText.toLowerCase();
  const signals: string[] = [];
  const penalties: string[] = [];
  let score = 25; // base

  // Concrete timeframes
  if (/\b(first \d+ (seconds|secs|mins|minutes)|in \d+ (days|hours|weeks)|10-second|\d+-second)\b/i.test(lower)) {
    signals.push("Concrete Timeframe Anchor");
    score += 35;
  }

  // Numbered count + concrete noun
  if (/\b\d+\s+(mistakes|reasons|steps|changes|hacks|ways|rules|tips|examples)\b/i.test(lower)) {
    signals.push("Numbered Noun Specificity");
    score += 35;
  }

  // Specific context anchors
  if (/\b(before (uploading|your next|you)|on your next reel|first sentence|retention|viewers|algorithm)\b/i.test(lower)) {
    signals.push("Contextual Action Anchor");
    score += 25;
  }

  // Exact figures / prices / metrics
  if (/(\$|₹|€|\b\d+%\b|\b\d+k\b)/i.test(hookWindowText)) {
    signals.push("Exact Metric/Price");
    score += 25;
  }

  // Generic fluff penalties
  if (/\b(some tips|many different things|good content|grow your account|useful platform|posting regularly)\b/i.test(lower)) {
    penalties.push("Vague Generic Terminology");
    score -= 25;
  }

  score = Math.max(10, Math.min(100, score));
  return { score, signals, penalties };
}

/**
 * Main script analysis entry point
 */
export function analyzeScriptText(text: string, contentType: string): ScriptAnalysisResult {
  const normalizedText = text.trim();
  const characterCount = normalizedText.length;
  const wordList = normalizedText.split(/\s+/).filter(Boolean);
  const wordCount = wordList.length;
  const estimatedSpeakingTime = Math.ceil((wordCount / DEFAULT_WPM) * 60);

  // 1. Extract Opening Hook Window & Sentences
  const { hookText, rawSentences, remainingText } = extractHookWindow(normalizedText);
  const hookWordCount = hookText.split(/\s+/).filter(Boolean).length;
  const hookTextLower = hookText.toLowerCase();

  // 2. Detect CTAs (Prioritizing closing/action sentences)
  const allCTAMatches: CTAMatch[] = [];
  let ctaDetected = false;
  let ctaText = '';
  let ctaSentenceIdx = -1;

  // Scan sentences for CTAs
  rawSentences.forEach((sentence, idx) => {
    const matches = detectCTAs(sentence);
    if (matches.length > 0) {
      ctaDetected = true;
      if (!ctaText) {
        ctaText = sentence;
        ctaSentenceIdx = idx;
      }
      matches.forEach(m => {
        if (!allCTAMatches.some(existing => existing.type === m.type)) {
          allCTAMatches.push(m);
        }
      });
    }
  });

  const ctaType = allCTAMatches.map(m => m.type).join(', ') || 'None';
  const ctaStrength = ctaDetected ? (allCTAMatches.some(m => m.type === 'SAVE CTA' || m.type === 'ACTION CTA') ? 90 : 75) : 0;

  // Segment Body
  const bodySentences = rawSentences.filter((_, idx) => idx > 0 && idx !== ctaSentenceIdx);
  const bodyText = bodySentences.join('. ') || remainingText || wordList.slice(hookWordCount).join(' ') || 'Script content.';

  // 3. Signals & Feature Extraction (Strictly from Hook Window for Hook Score)
  const signals: string[] = [];
  const positiveSignals: string[] = [];
  const penaltyList: string[] = [];
  
  const canonicalSignals: CanonicalSignals = {
    contrarian: false,
    expectationViolation: false,
    curiosityGap: false,
    directAddress: false,
    specificity: false,
    concreteTimeframe: false,
    numberAnchor: false,
    patternInterrupt: false,
    problemPain: false,
    benefitPromise: false,
    question: false,
    ctaTypes: allCTAMatches.map(m => m.type)
  };

  // Opening Penalties
  const openingPenalties = detectOpeningPenalties(hookText);
  openingPenalties.penaltyList.forEach(p => penaltyList.push(p));

  // Contrarian / Expectation Violation Framing
  const violationResult = detectExpectationViolation(hookText);
  if (violationResult.isViolation) {
    canonicalSignals.expectationViolation = true;
    canonicalSignals.contrarian = true; // For backwards compatibility in scoring weights
    signals.push('Contrarian Framing');
    positiveSignals.push(`Expectation Violation (${violationResult.label})`);
  }

  // Pattern Interrupts
  if (/^(stop|wait|listen|warning|alert)\b/i.test(hookTextLower)) {
    canonicalSignals.patternInterrupt = true;
    signals.push('Pattern Interrupt');
    positiveSignals.push('Pattern Interrupt Command');
  }

  // Direct Address & Pain
  if (/\b(you|your|yours|creators|marketers)\b/i.test(hookTextLower)) {
    canonicalSignals.directAddress = true;
    signals.push('Direct Address');
    positiveSignals.push('Direct Audience Address');
  }
  if (/\b(failing|losing|dying|ruining|killing|waste|error|mistakes)\b/i.test(hookTextLower)) {
    canonicalSignals.problemPain = true;
    signals.push('Pain Point Address');
    positiveSignals.push('Specific Pain Point');
  }

  // Curiosity & Open Loop
  const curiosityResult = detectCuriosityGap(hookText);
  if (curiosityResult.hasGap) {
    canonicalSignals.curiosityGap = true;
    signals.push('Curiosity Gap');
    positiveSignals.push('Structural Open Loop');
  }
  if (/\b(secret|reveal|hide|hack|trick|mistake|confession)\b/i.test(hookTextLower)) {
    canonicalSignals.curiosityGap = true;
    if (!signals.includes('Curiosity Gap')) signals.push('Curiosity Gap');
    positiveSignals.push('Curiosity Trigger Word');
  }
  if (/\?/.test(hookText)) {
    canonicalSignals.question = true;
    signals.push('Question Hook');
    positiveSignals.push('Question Hook');
  }

  // Specificity
  const specificityResult = detectSpecificitySignals(hookText);
  specificityResult.signals.forEach(s => {
    positiveSignals.push(s);
    if (!signals.includes('High Specificity')) signals.push('High Specificity');
  });
  if (specificityResult.signals.includes('Concrete Timeframe Anchor')) {
    canonicalSignals.concreteTimeframe = true;
    canonicalSignals.specificity = true;
  }
  if (specificityResult.signals.includes('Numbered Noun Specificity')) {
    canonicalSignals.numberAnchor = true;
    canonicalSignals.specificity = true;
  }
  if (specificityResult.score > 40) {
    canonicalSignals.specificity = true;
  }
  specificityResult.penalties.forEach(p => penaltyList.push(p));

  // Continuation Incentive
  let hasContinuationIncentive = false;
  if (/\b(check these|before uploading|before your next|test these|read this)\b/i.test(hookTextLower)) {
    hasContinuationIncentive = true;
    positiveSignals.push('Actionable Continuation Prompt');
    canonicalSignals.benefitPromise = true;
  }

  if (openingPenalties.hasGreeting || openingPenalties.hasMetaIntro) {
    signals.push('Weak Generic Opening');
  }

  // 4. COMPONENT SCORES (0–100 Scale)
  
  // A. Attention Score (0.25)
  let attention = 35; // base
  if (canonicalSignals.patternInterrupt) attention += 35;
  if (canonicalSignals.expectationViolation) attention += 30;
  if (canonicalSignals.directAddress) attention += 20;
  if (canonicalSignals.specificity) attention += 15;
  if (openingPenalties.hasGreeting) attention -= 35;
  if (openingPenalties.hasMetaIntro) attention -= 35;
  if (openingPenalties.hasFluffIntro) attention -= 15;
  attention = Math.max(10, Math.min(100, attention));

  // B. Curiosity Score (0.20)
  let curiosity = 30; // base
  if (canonicalSignals.expectationViolation) curiosity += 35;
  if (canonicalSignals.curiosityGap) curiosity += 30;
  if (canonicalSignals.question) curiosity += 20;
  if (openingPenalties.hasMetaIntro) curiosity -= 20;
  curiosity = Math.max(10, Math.min(100, curiosity));

  // C. Relevance & Pain Score (0.20)
  let relevance = 40; // base
  if (canonicalSignals.directAddress) relevance += 25;
  if (canonicalSignals.problemPain) relevance += 30;
  if (/\b(reels|algorithm|viewers|views|instagram|video|content|sales|grow)\b/i.test(normalizedText)) relevance += 20;
  if (contentType !== 'Other') relevance += 10;
  relevance = Math.max(10, Math.min(100, relevance));

  // D. Specificity Score (0.15)
  const specificity = specificityResult.score;

  // E. Contrarian Score (0.10)
  let contrarianScore = 20; // base
  if (canonicalSignals.expectationViolation) contrarianScore += 65;
  if (canonicalSignals.problemPain) contrarianScore += 15;
  contrarianScore = Math.max(10, Math.min(100, contrarianScore));

  // F. Continuation Incentive Score (0.10)
  let continuationScore = 25; // base
  if (hasContinuationIncentive) continuationScore += 55;
  if (signals.includes('Curiosity Gap')) continuationScore += 25;
  if (openingPenalties.hasMetaIntro) continuationScore -= 20;
  continuationScore = Math.max(10, Math.min(100, continuationScore));

  // 5. WEIGHTED HOOK SCORE CALCULATION
  let rawHookScore = Math.round(
    attention * COMPONENT_WEIGHTS.attention +
    curiosity * COMPONENT_WEIGHTS.curiosity +
    relevance * COMPONENT_WEIGHTS.relevance +
    specificity * COMPONENT_WEIGHTS.specificity +
    contrarianScore * COMPONENT_WEIGHTS.contrarian +
    continuationScore * COMPONENT_WEIGHTS.continuation
  );

  // Cumulative opening penalty deduction
  if (openingPenalties.hasGreeting && openingPenalties.hasMetaIntro) {
    rawHookScore -= 15;
  }
  const hookScore = Math.max(10, Math.min(99, rawHookScore));

  // Hook Status & Supporting Text
  let hookStatus: 'Excellent Hook' | 'Strong Hook' | 'Good Foundation' | 'Needs Improvement' | 'Weak Hook' = 'Good Foundation';
  
  // Deterministic summary generation based on canonicalSignals
  const summaryParts = [];
  if (hookScore >= 85) {
    hookStatus = 'Excellent Hook';
    summaryParts.push('Outstanding scroll-stopping hook.');
  } else if (hookScore >= 75) {
    hookStatus = 'Strong Hook';
    summaryParts.push('Strong hook with clear target audience relevance.');
  } else if (hookScore >= 55) {
    hookStatus = 'Good Foundation';
    summaryParts.push('Good foundation.');
  } else if (hookScore >= 35) {
    hookStatus = 'Needs Improvement';
    summaryParts.push('Opening hook is somewhat slow or generic.');
  } else {
    hookStatus = 'Weak Hook';
    summaryParts.push('Very weak/passive opening.');
  }

  // Add specific feedback
  if (openingPenalties.hasGreeting || openingPenalties.hasMetaIntro) {
    summaryParts.push('Remove greetings and meta-introductions to capture focus faster.');
  } else {
    if (canonicalSignals.expectationViolation && canonicalSignals.curiosityGap) {
      summaryParts.push('Great use of expectation violation to create a curiosity gap.');
    } else if (canonicalSignals.expectationViolation) {
      summaryParts.push('Expectation violation effectively challenges assumptions.');
    } else if (canonicalSignals.curiosityGap) {
      summaryParts.push('Good curiosity-driven setup.');
    } else if (!canonicalSignals.expectationViolation && !canonicalSignals.curiosityGap) {
      summaryParts.push('Introduce a contrarian angle or strong curiosity gap.');
    }
    
    if (canonicalSignals.concreteTimeframe) {
      summaryParts.push('Concrete timeframe anchors expectations well.');
    } else if (canonicalSignals.numberAnchor) {
      summaryParts.push('Numbered specificity sets clear expectations.');
    } else {
      summaryParts.push('Add a concrete timeframe or number to strengthen the immediate payoff.');
    }
  }

  const hookSupportingText = summaryParts.join(' ');

  // 6. Evidence-Based Insights (Text-Only Script Claims)
  const positiveInsights: string[] = [];
  const improvementInsights: string[] = [];

  if (canonicalSignals.expectationViolation) {
    positiveInsights.push(`Expectation violation ("${violationResult.label}") challenges audience assumptions.`);
  }
  if (canonicalSignals.concreteTimeframe) {
    positiveInsights.push('Concrete timeframe anchor detected, anchoring viewer expectations quickly.');
  }
  if (canonicalSignals.numberAnchor) {
    positiveInsights.push('Numbered specificity provides clear, structured value expectations.');
  }
  if (canonicalSignals.curiosityGap) {
    positiveInsights.push('Curiosity gap creates an unresolved question that keeps viewers watching.');
  }
  if (canonicalSignals.directAddress) {
    positiveInsights.push('Direct audience address ("you", "your") establishes immediate relevance.');
  }
  if (ctaDetected) {
    positiveInsights.push(`Clear Call-to-Action detected: ${ctaType}.`);
  }

  if (openingPenalties.hasGreeting) {
    improvementInsights.push('Generic greeting detected ("Hello/Welcome"). Cut intro greetings to save the first 2 seconds.');
  }
  if (openingPenalties.hasMetaIntro) {
    improvementInsights.push('Meta-introduction detected ("Today I will talk about..."). Frontload value instead of explaining the video.');
  }
  if (!canonicalSignals.specificity) {
    improvementInsights.push('Lacks concrete specificity. Replace generic phrases with numbers, timeframes, or exact steps.');
  }
  if (!ctaDetected) {
    improvementInsights.push('No clear CTA detected in script body. Add a direct command like "Save this Reel".');
  }

  if (positiveInsights.length === 0) {
    positiveInsights.push('Script text is legible and structured.');
  }
  if (improvementInsights.length === 0) {
    improvementInsights.push('Keep each explanation concise to maintain script pacing and momentum.');
  }

  // 7. RECOMMENDATION DEDUPLICATION
  // Never suggest something that is already strongly present!
  const suggestions: SuggestionItem[] = [];

  // Check 1: Opening Hook Frontloading (If greeting or meta-intro present)
  if (openingPenalties.hasGreeting || openingPenalties.hasMetaIntro) {
    suggestions.push({
      title: 'Remove greetings and meta-introductions from the first sentence.',
      explanation: 'Viewers decide to stay in 1.5 seconds. Replace "Hello everyone..." with the core outcome or problem.',
      example: 'Instead of: "Hello everyone, today I want to talk about...", try: "Your Reels might be losing viewers in the first 3 seconds."'
    });
  }

  // Check 2: Contrarian Claim (Only if NOT already expectationViolation)
  if (!canonicalSignals.expectationViolation) {
    suggestions.push({
      title: 'Add a contrarian claim or expectation violation.',
      explanation: 'Reframe a common belief to trigger an instant curiosity gap.',
      example: 'Example: "Posting every day might actually be ruining your reach."'
    });
  }

  // Check 3: Specificity / Numbers (Only if NOT already highly specific or has concrete timeframe)
  if (!canonicalSignals.specificity && !canonicalSignals.concreteTimeframe && !canonicalSignals.numberAnchor) {
    suggestions.push({
      title: 'Inject concrete numbers and timeframes.',
      explanation: 'Specific figures build immediate credibility and set expectations.',
      example: 'Example: "3 changes that doubled retention in 7 days."'
    });
  }

  // Check 4: CTA (Only if CTA is missing)
  if (!ctaDetected) {
    suggestions.push({
      title: 'Add a single, specific Call-to-Action.',
      explanation: 'Tell the viewer exactly what action to take before scrolling away.',
      example: 'Example: "Save this checklist and test it on your next Reel."'
    });
  }

  // 8. Script Review Breakdown
  const scriptReview: ScriptReviewData = {
    hook: {
      text: hookText,
      works: canonicalSignals.expectationViolation 
        ? `Uses expectation violation (${violationResult.label}) to disrupt scrolling.`
        : (canonicalSignals.directAddress ? 'Directly addresses target audience.' : 'Identifies core topic.'),
      improve: openingPenalties.hasGreeting || openingPenalties.hasMetaIntro
        ? 'Cut passive greetings and meta-introductions immediately.'
        : 'Ensure visual text on screen matches the first 3 words spoken.',
      rewrite: canonicalSignals.expectationViolation
        ? hookText
        : `Your Reels might not be failing because of the algorithm. You could be losing viewers in the first 3 seconds.`
    },
    body: {
      text: bodyText,
      works: bodyText.length > 50 ? 'Structured body content presenting actionable points.' : 'Concise body text.',
      improve: bodyText.includes('first') || bodyText.includes('1.') || bodyText.includes('Second')
        ? 'Support each point with an immediate outcome.'
        : 'Use numbered steps or bullet points for faster pacing.',
      rewrite: bodyText.substring(0, 100) + '...'
    },
    cta: {
      text: ctaDetected ? ctaText : 'No CTA detected in script.',
      works: ctaDetected ? `Classified as ${ctaType}. Directs viewer action.` : 'N/A',
      improve: ctaDetected 
        ? 'Ensure CTA connects directly to the benefit delivered.' 
        : 'Add a clear CTA such as "Save this Reel for your next upload".',
      rewrite: ctaDetected 
        ? ctaText 
        : 'Save this and test these changes on your next Reel.'
    }
  };

  const diagnostics: DiagnosticsData = {
    componentScores: {
      attention,
      curiosity,
      relevance,
      specificity,
      contrarian: contrarianScore,
      continuation: continuationScore
    },
    positiveSignals,
    penalties: penaltyList,
    finalHookScore: hookScore,
    ctaClassification: allCTAMatches.map(m => m.type)
  };

  const analysisConfidence = wordCount < 20 ? 'Limited' : 'High';

  // 9. Overall Script Score Calculation
  let bodyScore = 50; // base score
  if (bodyText.length > 50) bodyScore += 15;
  if (canonicalSignals.directAddress) bodyScore += 10;
  if (canonicalSignals.problemPain) bodyScore += 10;
  if (canonicalSignals.specificity) bodyScore += 15;
  bodyScore = Math.min(100, Math.max(10, bodyScore));

  const scriptScore = Math.round((hookScore * 0.4) + (bodyScore * 0.4) + (ctaStrength * 0.2));

  return {
    hookScore,
    scriptScore,
    hookStatus,
    hookSupportingText,
    scoreBreakdown: {
      attention,
      interest: curiosity,
      clarity: specificity,
      relevance,
      emotionalImpact: contrarianScore
    },
    insights: {
      positive: positiveInsights,
      improvement: improvementInsights
    },
    suggestions,
    scriptReview,
    contentType,
    wordCount,
    characterCount,
    estimatedSpeakingTime,
    hookText,
    hookWordCount,
    ctaDetected,
    ctaText,
    ctaType,
    ctaMatches: allCTAMatches,
    ctaStrength,
    analysisConfidence,
    signals,
    structure: {
      hook: hookText,
      body: bodyText,
      cta: ctaDetected ? ctaText : ''
    },
    diagnostics,
    canonicalSignals
  };
}
