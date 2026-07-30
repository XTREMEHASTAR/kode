/**
 * AuraCore AI Simulation Environment - Event Definitions & Topics
 */

export const SIMULATION_EVENT_TOPICS = {
  // System Lifecycle
  SIMULATION_STARTED: 'simulation.lifecycle.started',
  SIMULATION_PAUSED: 'simulation.lifecycle.paused',
  SIMULATION_RESUMED: 'simulation.lifecycle.resumed',
  SIMULATION_COMPLETED: 'simulation.lifecycle.completed',
  SIMULATION_FAILED: 'simulation.lifecycle.failed',

  // Environment & Clock
  ENVIRONMENT_TICK_COMPLETED: 'environment.tick.completed',
  ENVIRONMENT_CONFIG_MUTATED: 'environment.config.mutated',

  // World State
  WORLD_STATE_MUTATED: 'world_state.mutated',
  ATTENTION_CONSUMED: 'world_state.attention_consumed',

  // Population & Agents
  POPULATION_SWARM_READY: 'population.swarm.ready',
  AGENT_ACTION_EMITTED: 'population.agent.action_emitted',

  // Recommendation & Waves
  RECOMMENDATION_BATCH_SERVED: 'recommendation.batch.served',
  WAVE_GATE_EVALUATED: 'recommendation.wave.evaluated',

  // Trends
  TREND_SPIKED: 'trend.spiked',
  TREND_SATURATED: 'trend.saturated',
  TREND_DIED: 'trend.died',

  // Community
  COMMENT_GENERATED: 'community.comment.generated',
  CONTROVERSY_RATIO_DETECTED: 'community.controversy.ratio_detected',

  // Content Competition
  COMPETITION_SLOT_RESOLVED: 'competition.slot.resolved',

  // Memory
  MEMORY_STATE_UPDATED: 'memory.state.updated',

  // Telemetry
  TELEMETRY_FRAME_EMITTED: 'telemetry.frame.emitted',
  TELEMETRY_FINALIZED: 'telemetry.finalized'
} as const;

export interface SystemSimulationEvent<T = unknown> {
  eventId: string;
  topic: string;
  timestamp: number;
  simulationId: string;
  payload: T;
}

export type EventSubscriptionCallback<T = unknown> = (event: SystemSimulationEvent<T>) => void | Promise<void>;
