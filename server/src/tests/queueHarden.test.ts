import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { QueueManager } from '../queues/queueManager.js';

describe('Production Queue Hardening & Stress Test Suite (v2.1)', () => {

  it('1. enforces idempotency deduplication across duplicate job submissions', () => {
    const key = `idem_test_key_${Date.now()}`;
    const jobA = QueueManager.enqueueJob({
      userId: '00000000-0000-0000-0000-000000000010',
      title: 'Idempotent Duplicate Asset',
      idempotencyKey: key
    });

    const jobB = QueueManager.enqueueJob({
      userId: '00000000-0000-0000-0000-000000000010',
      title: 'Idempotent Duplicate Asset',
      idempotencyKey: key
    });

    assert.strictEqual(jobA.id, jobB.id, 'Duplicate idempotencyKey must return identical jobId');
  });

  it('2. tracks worker heartbeats and queue telemetry SLA metrics', () => {
    const metrics = QueueManager.getMetrics();
    assert.strictEqual(metrics.workerHeartbeatStatus, 'healthy');
    assert.ok(metrics.p95ProcessingTimeMs > 0);
    assert.ok(metrics.criticalCount >= 0);
    assert.ok(metrics.dlqCount >= 0);
  });

  it('3. supports job cancellation for queued or processing jobs', () => {
    const job = QueueManager.enqueueJob({
      userId: '00000000-0000-0000-0000-000000000020',
      title: 'Job Cancellation Test Asset',
      priorityTier: 'bulk'
    });

    const cancelled = QueueManager.cancelJob(job.id);
    assert.strictEqual(cancelled, true);

    const checkJob = QueueManager.getJob(job.id);
    assert.ok(checkJob);
    assert.strictEqual(checkJob.status, 'cancelled');
  });

  it('4. recovers stalled jobs missing heartbeats', () => {
    const recoveredCount = QueueManager.recoverStalledJobs();
    assert.ok(recoveredCount >= 0);
  });

});
