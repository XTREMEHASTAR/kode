import { CreatorAgent, CreatorConfig, CreatorNiche, SimulatedContent } from './CreatorAgent';
import { EnvironmentState } from '../environment/EnvironmentState';
import { CreatorTelemetry } from './CreatorTelemetry';
import { SeededPRNG } from '../environment/EnvironmentTelemetry';

export interface CreatorEcosystemConfig {
  seed?: number;
  initialCreatorCount?: number;
}

/**
 * AuraWorld Central Creator Ecosystem Engine
 */
export class CreatorEcosystem {
  private creators: Map<string, CreatorAgent> = new Map();
  private telemetry: CreatorTelemetry;
  private prng: SeededPRNG;

  constructor(config: CreatorEcosystemConfig = {}) {
    const seed = config.seed ?? 4096;
    const initialCount = config.initialCreatorCount ?? 50;
    this.prng = new SeededPRNG(seed);
    this.telemetry = new CreatorTelemetry();

    // Populate initial synthetic creator agents
    this.bootstrapCreators(initialCount);
  }

  public addCreator(config: CreatorConfig): CreatorAgent {
    const agent = new CreatorAgent(config);
    this.creators.set(agent.id, agent);
    
    this.telemetry.logEvent({
      timestamp: Date.now(),
      creatorId: agent.id,
      eventType: 'CREATOR_REGISTERED',
      details: `Registered creator ${agent.name} in niche ${agent.niche}`,
      followerCount: agent.followerCount
    });

    return agent;
  }

  public getCreatorById(id: string): CreatorAgent | undefined {
    return this.creators.get(id);
  }

  public queryCreatorsByNiche(niche: CreatorNiche): CreatorAgent[] {
    return Array.from(this.creators.values()).filter(c => c.niche === niche);
  }

  public getAllCreators(): CreatorAgent[] {
    return Array.from(this.creators.values());
  }

  /**
   * Batch simulate content generation across active creators
   */
  public simulateContentBatch(env: EnvironmentState): SimulatedContent[] {
    const contentList: SimulatedContent[] = [];

    this.creators.forEach(creator => {
      const prngNoise = this.prng.nextFloat();
      // Determine if creator posts based on posting frequency
      if (prngNoise <= creator.postingFrequencyPerWeek / 7.0) {
        const content = creator.generateContent(env, prngNoise);
        contentList.push(content);

        this.telemetry.logEvent({
          timestamp: env.timestamp,
          creatorId: creator.id,
          eventType: 'CONTENT_PUBLISHED',
          details: `Published content ${content.id} with quality ${content.qualityScore}`,
          followerCount: creator.followerCount
        });
      }
    });

    return contentList;
  }

  public getTelemetryLogs() {
    return this.telemetry.getEvents();
  }

  private bootstrapCreators(count: number): void {
    const niches: CreatorNiche[] = ['TECH', 'LIFESTYLE', 'FINANCE', 'FITNESS', 'ENTERTAINMENT'];
    
    for (let i = 1; i <= count; i++) {
      const niche = niches[i % niches.length];
      this.addCreator({
        id: `crt_${String(i).padStart(4, '0')}`,
        name: `Creator_${niche}_${i}`,
        niche,
        authorityScore: Number((0.4 + (i % 5) * 0.12).toFixed(2)),
        postingFrequencyPerWeek: (i % 7) + 1,
        baseContentQuality: Number((0.5 + (i % 5) * 0.1).toFixed(2)),
        brandTrust: 0.85,
        followerCount: 5000 * i
      });
    }
  }
}
