import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { QueueManager } from '../queues/queueManager.js';

describe('Production Priority Queue Manager Test Suite', () => {

  it('1. enqueues jobs into critical, standard, and bulk priority tiers', () => {
    const job1 = QueueManager.enqueueJob({
      userId: '00000000-0000-0000-0000-000000000001',
      title: 'Critical Enterprise Asset',
      priorityTier: 'critical'
    });

    const job2 = QueueManager.enqueueJob({
      userId: '00000000-0000-0000-0000-000000000002',
      title: 'Standard Pro Asset',
      priorityTier: 'standard'
    });

    const job3 = QueueManager.enqueueJob({
      userId: '00000000-0000-0000-0000-000000000003',
      title: 'Bulk Free Asset',
      priorityTier: 'bulk'
    });

    assert.ok(job1.id.startsWith('job_'));
    assert.strictEqual(job1.priorityTier, 'critical');
    assert.strictEqual(job2.priorityTier, 'standard');
    assert.strictEqual(job3.priorityTier, 'bulk');
  });

  it('2. tracks job telemetry and resolves status transitions', async () => {
    const job = QueueManager.enqueueJob({
      userId: '00000000-0000-0000-0000-000000000004',
      title: 'Telemetry Status Test Asset',
      priorityTier: 'critical',
      personaTier: 'quick'
    });

    const telemetry = QueueManager.getMetrics();
    assert.ok(telemetry.criticalCount >= 0);

    // Wait briefly for worker execution
    await new Promise(r => setTimeout(r, 600));

    const updatedJob = QueueManager.getJob(job.id);
    assert.ok(updatedJob);
    assert.ok(['processing', 'completed'].includes(updatedJob.status));
  });

});
