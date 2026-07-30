import { SyntheticComment, CommunityState } from '../contracts/engine.types.js';

/**
 * Community Engine Module
 * Models social network comment section dynamics, ratioing, and sentiment cascades.
 */
export class CommunityEngine {
  public generateSyntheticReactions(_scriptText: string, isGoodHook: boolean): {
    topSyntheticReactions: {
      viewerId: string;
      archetype: string;
      action: string;
      commentText: string;
      psychologicalReason: string;
    }[];
    communityState: CommunityState;
  } {
    const reactions = [
      {
        viewerId: 'v1',
        archetype: 'Impatient Zoomer',
        action: 'LIKE, SHARE, COMMENT',
        commentText: 'bro cooked with this one 🔥',
        psychologicalReason: 'Fast pacing and emotional curiosity triggered reaction.'
      },
      {
        viewerId: 'v2',
        archetype: 'High-Intent Millennial Founder',
        action: 'SAVE, LIKE',
        commentText: 'Saving this! Highly actionable hook strategy.',
        psychologicalReason: 'Resonated with high utility value.'
      },
      {
        viewerId: 'v3',
        archetype: 'Skeptical Tech Enthusiast',
        action: 'COMMENT',
        commentText: isGoodHook ? 'Solid claims, but what dataset are you basing this on?' : 'Seems exaggerated. Where is the proof?',
        psychologicalReason: 'Skepticism trait activated by script hook claims.'
      }
    ];

    const syntheticComments: SyntheticComment[] = reactions.map((r, idx) => ({
      commentId: `c_${idx + 1}`,
      contentDnaId: 'dna_active',
      agentId: r.viewerId,
      archetype: r.archetype,
      commentText: r.commentText,
      upvotes: Math.floor(Math.random() * 400) + 12,
      sentimentScore: r.commentText.includes('cooked') || r.commentText.includes('Saving') ? 0.8 : -0.2,
      psychologicalTrigger: r.psychologicalReason
    }));

    const communityState: CommunityState = {
      totalComments: syntheticComments.length,
      sentimentPolarity: isGoodHook ? 0.72 : 0.25,
      isRatioed: !isGoodHook,
      topComments: syntheticComments
    };

    return { topSyntheticReactions: reactions, communityState };
  }
}
