import { ContentDNA, SyntheticViewerProfile, Tier1MicroDecision, Tier2MacroDecision } from './types.js';

export class AgentBrainService {
  /**
   * Tier 1 Fast Decision Path: Evaluates utility at a given second t for a synthetic viewer.
   * Runs frame-by-frame per viewer in <0.5ms.
   */
  public evaluateMicroStep(
    viewer: SyntheticViewerProfile,
    dna: ContentDNA,
    second: number,
    currentAttention: number
  ): Tier1MicroDecision {
    const isOpeningHook = second <= 3;
    
    // 1. Hook Impact Factor
    let hookSatisfaction = 1.0;
    if (isOpeningHook) {
      hookSatisfaction = (dna.hookScore * 0.6 + dna.pacingScore * 0.4) / (viewer.traits.patienceFactor + 0.1);
    }

    // 2. Emotion Surge Factor from Sentiment & Pacing
    const sentimentStep = dna.sentimentVelocity[Math.min(second * 2, dna.sentimentVelocity.length - 1)] || 0.1;
    const emotionalSurge = (sentimentStep * viewer.traits.emotionalReactivity.curiosity) + (dna.pacingScore * 0.3);

    // 3. Boredom Accumulation (Exponential Attention Decay)
    const decayRate = 1.0 / (viewer.traits.attentionSpanSec * 1.5);
    const boredom = Math.exp(second * decayRate * 0.15) - 1.0;

    // 4. Utility Score Equation: U(t)
    const utilityScore = Number(
      Math.max(-1.0, Math.min(1.0, hookSatisfaction * 0.4 + emotionalSurge * 0.5 - boredom * 0.3 - viewer.memoryState.sessionFatigue * 0.2)).toFixed(3)
    );

    // Decision Logic
    let action: 'WATCH' | 'SKIP' | 'REPLAY' = 'WATCH';

    if (currentAttention <= 0 || utilityScore < -0.25) {
      action = 'SKIP';
    } else if (second >= dna.durationSec - 1 && utilityScore > 0.6) {
      // Replay if satisfied at end of video
      action = Math.random() < 0.25 ? 'REPLAY' : 'WATCH';
    }

    const attentionRemaining = Number(Math.max(0, currentAttention - (1.0 - utilityScore * 0.3)).toFixed(2));

    return {
      second,
      utilityScore,
      action,
      attentionRemaining
    };
  }

  /**
   * Tier 2 Macro Decision Path: Triggered post-watch to evaluate Likes, Comments, Shares, Saves, and Follows.
   * Generates realistic synthetic comments with cognitive justification.
   */
  public evaluateMacroPostWatch(
    viewer: SyntheticViewerProfile,
    dna: ContentDNA,
    totalWatchedSec: number,
    replayed: boolean
  ): Tier2MacroDecision {
    const watchPct = totalWatchedSec / dna.durationSec;
    const triggeredActions: ('LIKE' | 'COMMENT' | 'SHARE' | 'SAVE' | 'FOLLOW')[] = [];

    // Like Threshold
    if (watchPct >= 0.7 && Math.random() < viewer.traits.socialPropensity.likeProb * (replayed ? 1.8 : 1.2)) {
      triggeredActions.push('LIKE');
    }

    // Save Threshold (High value / high curiosity content)
    if (watchPct >= 0.8 && dna.curiosityGapScore > 0.6 && Math.random() < viewer.traits.socialPropensity.saveProb * 1.5) {
      triggeredActions.push('SAVE');
    }

    // Share Threshold (High pacing / emotional / controversial)
    if (watchPct >= 0.85 && Math.random() < viewer.traits.socialPropensity.shareProb * 1.4) {
      triggeredActions.push('SHARE');
    }

    // Comment Threshold
    let generatedComment: string | undefined;
    let qualitativeReason: string | undefined;

    if (watchPct >= 0.5 && Math.random() < viewer.traits.socialPropensity.commentProb * 1.3) {
      triggeredActions.push('COMMENT');
      const commentData = this.generateSyntheticComment(viewer, dna, watchPct);
      generatedComment = commentData.commentText;
      qualitativeReason = commentData.reason;
    }

    // Follow Threshold
    if (watchPct >= 0.95 && triggeredActions.length >= 2 && Math.random() < viewer.traits.socialPropensity.followProb * 2.0) {
      triggeredActions.push('FOLLOW');
    }

    return {
      viewerId: viewer.id,
      triggeredActions,
      generatedComment,
      qualitativeReason,
      memoryUpdate: {
        interestDelta: Number((watchPct * 0.1).toFixed(3)),
        fatigueDelta: Number((0.05).toFixed(3))
      }
    };
  }

  /**
   * Generates synthetic viewer comment based on archetype & content DNA
   */
  private generateSyntheticComment(
    viewer: SyntheticViewerProfile,
    dna: ContentDNA,
    watchPct: number
  ): { commentText: string; reason: string } {
    const archetype = viewer.archetypeName;
    const watchPctStr = Math.round(watchPct * 100);

    if (archetype === 'Impatient Zoomer') {
      const comments = [
        "no way bro actually said this 💀",
        "bro cooked with this one 🔥",
        "needed to see this today ngl",
        "wait hold up replay that first part 👀",
        "the pacing is insane haha"
      ];
      return {
        commentText: comments[Math.floor(Math.random() * comments.length)],
        reason: `Fast pacing (${dna.pacingScore}) and hook score (${dna.hookScore}) triggered zoomer reaction at ${watchPctStr}% completion.`
      };
    }

    if (archetype === 'High-Intent Millennial Founder') {
      const comments = [
        `Saving this for later. The breakdown on ${dna.title.slice(0, 20)}... is spot on.`,
        "Valid point. Most creators miss this step entirely.",
        "Quality breakdown! What tool are you using for this?",
        "100% true. Implemented this last month and saw a 3x lift."
      ];
      return {
        commentText: comments[Math.floor(Math.random() * comments.length)],
        reason: `High curiosity gap (${dna.curiosityGapScore}) and educational utility resonance.`
      };
    }

    if (archetype === 'Skeptical Tech Enthusiast') {
      const comments = [
        "Big claims. Is there any real data backing this up?",
        "Interesting point, but this only works in specific niches.",
        "Not fully convinced on second 5, but overall decent take.",
        "Show the retention metrics behind this!"
      ];
      return {
        commentText: comments[Math.floor(Math.random() * comments.length)],
        reason: `Skepticism trait activated by bold claims in '${dna.title}'.`
      };
    }

    const genericComments = [
      "This is so accurate! 🙌",
      "Sending this to my team right now.",
      "Part 2 please!!",
      "Underrated video honestly."
    ];
    return {
      commentText: genericComments[Math.floor(Math.random() * genericComments.length)],
      reason: `High completion rate (${watchPctStr}%) and strong CTA resonance.`
    };
  }
}
