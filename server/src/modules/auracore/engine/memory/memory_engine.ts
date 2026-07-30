import { AgentMemoryState } from '../contracts/engine.types.js';

/**
 * Memory Engine Module - Mathematically Grounded
 * Incorporates ACT-R Cognitive Memory Activation & Ebbinghaus Forgetting Curves.
 */
export class MemoryEngine {
  private agentMemories: Map<string, AgentMemoryState> = new Map();
  private impressionTimestamps: Map<string, number[]> = new Map(); // AgentId:CreatorId -> timestamps

  public getAgentMemory(agentId: string): AgentMemoryState {
    if (!this.agentMemories.has(agentId)) {
      this.agentMemories.set(agentId, {
        agentId,
        seenContentIds: new Set<string>(),
        creatorAffinityMap: {},
        hookPatternFatigue: {}
      });
    }
    return this.agentMemories.get(agentId)!;
  }

  /**
   * ACT-R Memory Activation Model
   * A_i = ln( sum_{j=1}^n t_j^{-d} )
   * where t_j is time elapsed since j-th impression, and d is decay rate (default 0.5)
   */
  public computeActRActivation(agentId: string, creatorId: string, currentTime: number, d: number = 0.5): number {
    const key = `${agentId}:${creatorId}`;
    const timestamps = this.impressionTimestamps.get(key) || [];
    if (timestamps.length === 0) return 0.0;

    let activationSum = 0;
    for (const t_j of timestamps) {
      const elapsedSeconds = Math.max(1, (currentTime - t_j) / 1000);
      activationSum += Math.pow(elapsedSeconds, -d);
    }

    const activation = Math.log(Math.max(0.0001, activationSum));
    return Number((1 / (1 + Math.exp(-activation))).toFixed(3)); // Sigmoid normalized (0.0 to 1.0)
  }

  /**
   * Ebbinghaus Retention Function
   * R = exp(-t / S)
   */
  public computeEbbinghausRetention(elapsedSec: number, memoryStrength: number = 100): number {
    return Number((Math.exp(-elapsedSec / memoryStrength)).toFixed(3));
  }

  public recordImpression(
    agentId: string,
    contentId: string,
    creatorId: string,
    hookType: string,
    watchDurationRatio: number
  ): void {
    const memory = this.getAgentMemory(agentId);
    memory.seenContentIds.add(contentId);
    const now = Date.now();

    // Record impression timestamp for ACT-R
    const key = `${agentId}:${creatorId}`;
    const timestamps = this.impressionTimestamps.get(key) || [];
    timestamps.push(now);
    this.impressionTimestamps.set(key, timestamps.slice(-20)); // keep last 20 impressions

    // Update creator affinity using ACT-R Activation score
    const actRScore = this.computeActRActivation(agentId, creatorId, now);
    const affinityDelta = watchDurationRatio >= 0.8 ? (0.05 + actRScore * 0.1) : watchDurationRatio <= 0.2 ? -0.15 : 0.0;
    const currentAffinity = memory.creatorAffinityMap[creatorId] || 0.0;
    memory.creatorAffinityMap[creatorId] = Number(Math.min(1.0, Math.max(-1.0, currentAffinity + affinityDelta)).toFixed(2));

    // Update hook pattern fatigue
    const currentFatigue = memory.hookPatternFatigue[hookType] || 0.0;
    const fatigueDelta = 0.05;
    memory.hookPatternFatigue[hookType] = Number(Math.min(1.0, currentFatigue + fatigueDelta).toFixed(2));
  }
}
