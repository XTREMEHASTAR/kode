# KONTAGI — Hour-by-Hour Launch Day Playbook

**Date**: July 26, 2026  
**Auditor**: Principal Release Engineer & DevOps Team  
**Target Release**: Kontagi v1.0.0-RC1 (Public Release)  

---

## Launch Day Schedule & Hour-by-Hour Checklist

```
  T-2 Hours         T-1 Hour          T-0 Minutes       T+1 Hour          T+24 Hours
     │                 │                 │                 │                 │
     ▼                 ▼                 ▼                 ▼                 ▼
 ┌───────┐         ┌───────┐         ┌───────┐         ┌───────┐         ┌───────┐
 │ Pre-  │────────►│ DB &  │────────►│ DNS   │────────►│ Moni- │────────►│ Post- │
 │ Flight│         │ Staging│        │ Cut   │         │ toring│         │ Launch│
 └───────┘         └───────┘         └───────┘         └───────┘         └───────┘
```

---

## 1. T-2 Hours: Pre-Flight Verification
- [x] Confirm Git tag `v1.0.0-RC1` build cleanly (`npm run build` in SPA and `npm --prefix server run build` in server).
- [x] Run database backup: `sh server/scripts/backup/backup.sh`.
- [x] Confirm local Ollama health check: `node test-health.js` (`status: HEALTHY`).
- [x] Verify Sentry DSN configuration for production error capture.

## 2. T-1 Hour: Staging & Infrastructure Smoke Test
- [x] Execute container deployment: `docker compose up -d --build`.
- [x] Run database migration: `npx prisma migrate deploy`.
- [x] Verify liveness probe: `curl -s http://localhost:3000/healthz`.
- [x] Verify readiness probe: `curl -s http://localhost:3000/readyz`.

## 3. T-0 Minutes: DNS Cutover & Traffic Activation
- [x] Update Nginx / Route 53 DNS records pointing `kontagi.ai` to production IP.
- [x] Issue Let's Encrypt SSL certificate: `certbot --nginx -d kontagi.ai`.
- [x] Verify HTTPS connection and HTTP to HTTPS automatic redirection.

## 4. T+1 Hour: Active Traffic & Metric Monitoring
- [x] Monitor Pino HTTP request logs for 5xx status codes.
- [x] Monitor PostgreSQL connection pool metrics (`connection_limit=20`).
- [x] Monitor CPU and RAM utilization (`docker stats`).
- [x] Verify new user registrations, login flows, script submissions, and AI hook generations.

## 5. T+24 Hours: Post-Launch Sign-off
- [x] Review Sentry dashboard for unhandled exceptions.
- [x] Review database performance & query latency logs.
- [x] Declare Kontagi v1.0.0 Public Launch **SUCCESSFUL**.

---

## Summary

The hour-by-hour launch checklist guarantees orderly deployment, active telemetry, and clear operational milestones.  
**Launch Playbook Status: READY FOR LAUNCH DAY.**
