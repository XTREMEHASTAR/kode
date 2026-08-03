# Operational Runbook: KONTAGI Priority Queue Platform & Telemetry

**Document Version**: 1.0  
**Target Systems**: `QueueManager`, BullMQ, Redis, EKS Workers  
**SLA Baseline**: P95 Latency $< 2000\text{ms}$ (Critical Tier), Zero Job Loss  

---

## 1. Operational Overview & Priority Architecture

The KONTAGI Asynchronous Queue Platform manages all media ingestion, feature extraction, audience simulation, and decision plan generation tasks.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       3-TIER PRIORITY QUEUE TOPOLOGY                        │
└─────────────────────────────────────────────────────────────────────────────┘
  • Critical Tier  ──► Priority 1 (Enterprise API Customers, Concurrency: 5)
  • Standard Tier  ──► Priority 2 (Pro Creator Users, Concurrency: 3)
  • Bulk Tier      ──► Priority 3 (Free Tier Batch Ingestion, Concurrency: 1)
  • DLQ Tier       ──► Dead Letter Queue (Poison Messages & Max Retries Exceeded)
```

---

## 2. Telemetry Monitoring & Alerts

### Key Prometheus Metrics
- `kontagi_queue_depth{tier="critical"}`: Critical queue backlog length. Alert if $> 20$ for $> 60\text{s}$.
- `kontagi_queue_dlq_count`: Dead Letter Queue size. Alert if $> 0$.
- `kontagi_worker_heartbeat_status`: `healthy`, `degraded`, or `offline`. Alert if `degraded` or `offline`.
- `kontagi_job_p95_processing_ms`: P95 job processing latency. Alert if $> 5000\text{ms}$.

---

## 3. Incident Troubleshooting Procedures

### Incident 1: Dead Letter Queue (DLQ) Accumulation
1. **Symptom**: `kontagi_queue_dlq_count > 0` alert triggered.
2. **Diagnosis**: Query DLQ jobs via `GET /api/v1/intelligence-os/queue/telemetry`.
3. **Remediation**:
   - Inspect `error` property on DLQ jobs (e.g. `POISON_MESSAGE: invalid video container`).
   - If error was transient (e.g. temporary network timeout), call retry handler.
   - If poison payload (corrupt media file), notify creator with specific error status.

### Incident 2: Worker Heartbeat Degradation
1. **Symptom**: `workerHeartbeatStatus` reports `degraded` or `offline`.
2. **Diagnosis**: Check Kubernetes worker pod status (`kubectl get pods -l app=kontagi-worker`).
3. **Remediation**:
   - Call `QueueManager.recoverStalledJobs()` to automatically re-enqueue processing jobs missing heartbeats $> 10\text{s}$.
   - If worker memory leak occurred, trigger pod restart (`kubectl rollout restart deployment/kontagi-worker`).

---

## 4. Graceful Shutdown Protocol

When terminating worker pods during deployment or node maintenance:
1. Signal `QueueManager.gracefulShutdown(5000)` to stop ingesting new queue items.
2. Wait up to $5000\text{ms}$ for active workers to complete current simulation pipeline step.
3. Terminate container once `activeWorkers == 0`.
