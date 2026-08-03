import { v4 as uuidv4 } from 'uuid';

export interface OutcomeRecord {
  id: string;
  jobId?: string;
  userId: string;
  contentRef: {
    platform?: string;
    title?: string;
    caption?: string;
  };
  metrics: {
    views?: number;
    watchTimeAvg?: number;
    completionRate?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    followersGained?: number;
  };
  measuredAt: string;
}

export class LearningLoopService {
  private static OUTCOMES_STORE: OutcomeRecord[] = [];

  public static async recordActualOutcome(data: Omit<OutcomeRecord, 'id'>): Promise<OutcomeRecord> {
    const record: OutcomeRecord = {
      id: uuidv4(),
      ...data
    };
    this.OUTCOMES_STORE.push(record);
    console.log(`[LEARNING LOOP] Ingested real outcome #${record.id} for user ${record.userId}`);
    return record;
  }

  public static getOutcomesCount(): number {
    return this.OUTCOMES_STORE.length;
  }
}
