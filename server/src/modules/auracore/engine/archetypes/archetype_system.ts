import { ViewerArchetype } from '../contracts/engine.types.js';

export interface DDMDecisionResult {
  decision: 'ACTION' | 'SKIP' | 'CONTINUE';
  accumulatedEvidence: number;
  timeToBoundarySec: number;
}

/**
 * Viewer Archetype System Module - Mathematically Grounded
 * Incorporates Cognitive Drift-Diffusion Models (DDM) for decision-making under uncertainty.
 */
export class ViewerArchetypeSystem {
  private archetypes: Map<string, ViewerArchetype> = new Map();

  constructor() {
    this.registerDefaultArchetypes();
  }

  private registerDefaultArchetypes(): void {
    const defaultList: ViewerArchetype[] = [
      {
        archetypeId: 'ZOOMER_SKIMMER',
        codeName: 'ZOOMER_SKIMMER',
        displayName: 'Impatient Gen-Z Skimmer',
        description: 'Ultra-short attention span, expects instant high visual dynamic within 1.5 seconds or skips.',
        traits: {
          openness: 0.85,
          curiositySensitivity: 0.90,
          cringeTolerance: 0.30,
          hookPatienceSec: 2.0,
          skepticismThreshold: 0.40
        },
        actionWeights: { like: 0.8, comment: 0.4, share: 0.9, save: 0.3, skip: 0.7 }
      },
      {
        archetypeId: 'MILLENNIAL_FOUNDER',
        codeName: 'MILLENNIAL_FOUNDER',
        displayName: 'High-Intent Millennial Founder',
        description: 'Seeks pragmatic utility, case studies, and actionable frameworks. Highly values saves and bookmarks.',
        traits: {
          openness: 0.70,
          curiositySensitivity: 0.75,
          cringeTolerance: 0.60,
          hookPatienceSec: 4.5,
          skepticismThreshold: 0.70
        },
        actionWeights: { like: 0.6, comment: 0.5, share: 0.4, save: 0.9, skip: 0.4 }
      },
      {
        archetypeId: 'SKEPTICAL_TECHIE',
        codeName: 'SKEPTICAL_TECHIE',
        displayName: 'Skeptical Tech Enthusiast',
        description: 'Critically analyzes claims, checks for clickbait, active in comment sections pointing out inconsistencies.',
        traits: {
          openness: 0.50,
          curiositySensitivity: 0.60,
          cringeTolerance: 0.20,
          hookPatienceSec: 3.0,
          skepticismThreshold: 0.90
        },
        actionWeights: { like: 0.3, comment: 0.8, share: 0.3, save: 0.5, skip: 0.5 }
      },
      {
        archetypeId: 'CASUAL_LIFESTYLE',
        codeName: 'CASUAL_LIFESTYLE',
        displayName: 'Casual Lifestyle Viewer',
        description: 'High aesthetic appreciation, enjoys relatable humor and trending sound tracks.',
        traits: {
          openness: 0.90,
          curiositySensitivity: 0.50,
          cringeTolerance: 0.75,
          hookPatienceSec: 3.5,
          skepticismThreshold: 0.25
        },
        actionWeights: { like: 0.9, comment: 0.3, share: 0.6, save: 0.4, skip: 0.3 }
      }
    ];

    defaultList.forEach(arch => this.archetypes.set(arch.archetypeId, arch));
  }

  /**
   * Drift-Diffusion Model (DDM) Simulator for Agent Choice Trajectories
   * dx = v*dt + sigma*dW
   */
  public simulateDDMDecision(
    archetypeId: string,
    contentHookQuality: number, // 0.0 - 1.0
    elapsedSec: number,
    noiseSigma: number = 0.1
  ): DDMDecisionResult {
    const archetype = this.getArchetype(archetypeId);
    if (!archetype) {
      return { decision: 'CONTINUE', accumulatedEvidence: 0, timeToBoundarySec: elapsedSec };
    }

    // Drift rate (v) = Content Hook Quality - Viewer Skepticism
    const driftRate = (contentHookQuality * archetype.traits.curiositySensitivity) - (archetype.traits.skepticismThreshold * 0.5);
    
    // Boundary thresholds (a)
    const upperBoundaryAction = 1.0;
    const lowerBoundarySkip = -0.5;

    // Simulate Wiener process dW ~ N(0, sqrt(dt))
    const dt = 0.5;
    const dW = (Math.random() - 0.5) * 2 * Math.sqrt(dt);
    const evidenceChange = driftRate * dt + noiseSigma * dW;

    const accumulatedEvidence = Math.max(lowerBoundarySkip - 0.1, Math.min(upperBoundaryAction + 0.1, evidenceChange + (elapsedSec / archetype.traits.hookPatienceSec)));

    let decision: 'ACTION' | 'SKIP' | 'CONTINUE' = 'CONTINUE';
    if (accumulatedEvidence >= upperBoundaryAction) decision = 'ACTION';
    else if (accumulatedEvidence <= lowerBoundarySkip || elapsedSec > archetype.traits.hookPatienceSec * 1.5) decision = 'SKIP';

    return {
      decision,
      accumulatedEvidence: Number(accumulatedEvidence.toFixed(3)),
      timeToBoundarySec: elapsedSec
    };
  }

  public getArchetype(archetypeId: string): ViewerArchetype | undefined {
    return this.archetypes.get(archetypeId);
  }

  public getAllArchetypes(): ViewerArchetype[] {
    return Array.from(this.archetypes.values());
  }

  public registerArchetype(archetype: ViewerArchetype): void {
    this.archetypes.set(archetype.archetypeId, archetype);
  }
}
