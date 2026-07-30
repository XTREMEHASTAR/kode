import { SimulationScheduleConfig, SimulationStatus } from '../contracts/engine.types.js';
import { SimulationEventBus } from '../event_bus/event_bus.js';
import { SIMULATION_EVENT_TOPICS } from '../contracts/events.js';

/**
 * Simulation Scheduler Module
 * Time-step tick manager controlling execution clock, pause/resume state, and ticks.
 */
export class SimulationScheduler {
  private status: SimulationStatus = 'IDLE';
  private currentStep: number = 0;
  private totalSteps: number = 0;
  private eventBus: SimulationEventBus;
  private simulationId: string = '';

  constructor(eventBus: SimulationEventBus) {
    this.eventBus = eventBus;
  }

  public init(config: SimulationScheduleConfig): void {
    this.simulationId = config.simulationId;
    this.totalSteps = config.totalDurationSeconds;
    this.currentStep = 0;
    this.status = 'INITIALIZING';

    this.eventBus.publish(SIMULATION_EVENT_TOPICS.SIMULATION_STARTED, this.simulationId, {
      status: this.status,
      config
    });
  }

  public async executeTicks(onTick: (step: number) => Promise<void> | void): Promise<void> {
    this.status = 'RUNNING';
    try {
      for (let s = 1; s <= this.totalSteps; s++) {
        if ((this.status as SimulationStatus) === 'PAUSED') {
          break;
        }
        this.currentStep = s;
        await onTick(s);
      }
      if ((this.status as SimulationStatus) === 'RUNNING') {
        this.status = 'COMPLETED';
        this.eventBus.publish(SIMULATION_EVENT_TOPICS.SIMULATION_COMPLETED, this.simulationId, {
          status: this.status,
          totalStepsExecuted: this.currentStep
        });
      }
    } catch (err: any) {
      this.status = 'FAILED';
      this.eventBus.publish(SIMULATION_EVENT_TOPICS.SIMULATION_FAILED, this.simulationId, {
        error: err?.message || String(err)
      });
      throw err;
    }
  }

  public pause(): void {
    this.status = 'PAUSED';
    this.eventBus.publish(SIMULATION_EVENT_TOPICS.SIMULATION_PAUSED, this.simulationId, { step: this.currentStep });
  }

  public getStatus(): { status: SimulationStatus; currentStep: number; totalSteps: number } {
    return { status: this.status, currentStep: this.currentStep, totalSteps: this.totalSteps };
  }
}
