import { SyntheticAgent, PopulationSwarmConfig } from '../contracts/engine.types.js';
import { ViewerArchetypeSystem } from '../archetypes/archetype_system.js';
import { SimulationEventBus } from '../event_bus/event_bus.js';
import { SIMULATION_EVENT_TOPICS } from '../contracts/events.js';

/**
 * Synthetic Population Generator Module
 * Instantiates heterogeneous swarms of synthetic viewer and creator agents.
 */
export class SyntheticPopulationGenerator {
  private archetypeSystem: ViewerArchetypeSystem;

  constructor(archetypeSystem: ViewerArchetypeSystem) {
    this.archetypeSystem = archetypeSystem;
  }

  public generateSwarm(config: PopulationSwarmConfig, simulationId?: string, eventBus?: SimulationEventBus): SyntheticAgent[] {
    const agents: SyntheticAgent[] = [];
    const total = config.populationSize;
    const mix = config.demographicMix;

    const availableArchetypes = this.archetypeSystem.getAllArchetypes();
    if (availableArchetypes.length === 0) {
      throw new Error('[SyntheticPopulationGenerator] No archetypes registered in ArchetypeSystem.');
    }

    let agentIndex = 0;
    Object.entries(mix).forEach(([archetypeId, percentage]) => {
      const pctNumber = typeof percentage === 'number' ? percentage : 0.33;
      const count = Math.round(total * pctNumber);
      for (let i = 0; i < count; i++) {
        agentIndex++;
        const varianceSeed = Number(((Math.random() - 0.5) * 0.2).toFixed(3));
        
        agents.push({
          agentId: `agent_${agentIndex}_${archetypeId.toLowerCase()}`,
          archetypeId,
          varianceSeed,
          currentFatigue: Number((Math.random() * 0.2).toFixed(2)),
          activeInterests: {
            'Tech & Entrepreneurship': Number((0.5 + Math.random() * 0.5).toFixed(2)),
            'Viral Trends': Number((0.3 + Math.random() * 0.7).toFixed(2)),
            'Education': Number((0.2 + Math.random() * 0.6).toFixed(2))
          },
          followerIds: []
        });
      }
    });

    while (agents.length < total) {
      agentIndex++;
      const fallbackArchetype = availableArchetypes[0].archetypeId;
      agents.push({
        agentId: `agent_${agentIndex}_${fallbackArchetype.toLowerCase()}`,
        archetypeId: fallbackArchetype,
        varianceSeed: 0,
        currentFatigue: 0.1,
        activeInterests: { 'Tech & Entrepreneurship': 0.8 },
        followerIds: []
      });
    }

    if (eventBus && simulationId) {
      eventBus.publish(SIMULATION_EVENT_TOPICS.POPULATION_SWARM_READY, simulationId, {
        populationSize: agents.length,
        config
      });
    }

    return agents;
  }
}
