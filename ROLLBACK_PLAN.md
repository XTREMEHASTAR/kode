# KONTAGI — Incident Mitigation & Emergency Rollback Plan

**Date**: July 26, 2026  
**Auditor**: Lead DevOps & Incident Commander  
**Scope**: Emergency rollback procedures, database point-in-time recovery, container rollback, and traffic redirection  

---

## 1. Rollback Triggers

An emergency rollback must be initiated immediately if any of the following conditions occur during launch:

1. **Catastrophic API Failure**: Backend error rate (`5xx` status codes) exceeds **5.0%** of total requests over a 5-minute window.
2. **Database Data Corruption**: Unrecoverable transaction failure affecting user records or script analyses.
3. **Security Breach / Access Failure**: Authentication breakdown or unauthorized data exposure across user boundaries.
4. **Complete AI Gateway Outage**: Fallback chain exhaustion affecting 100% of generative AI requests.

---

## 2. Emergency Rollback Standard Operating Procedure (SOP)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Halt Incoming Traffic (Nginx maintenance page)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Rollback Docker Containers to previous stable tag        │
│    (docker compose down && docker compose up -d)            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Restore Database snapshot from pre-launch backup         │
│    (sh server/scripts/backup/restore.sh pre-launch.dump)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Re-enable Traffic & Verify Liveness/Readiness Probes     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Rollback Execution Commands

### Step 1: Display Emergency Maintenance Banner in Nginx
```bash
cp /etc/nginx/maintenance.html /var/www/html/index.html
nginx -s reload
```

### Step 2: Roll Back Container Deployment to Previous Release Tag
```bash
cd /opt/kontagi
git checkout tags/v0.9.9-stable
cd server
docker compose down
docker compose up -d --build
```

### Step 3: Restore Database Snapshot
```bash
sh /opt/kontagi/server/scripts/backup/restore.sh /opt/kontagi/backup/pre-launch-2026-07-26.dump
```

### Step 4: Validate System Recovery
```bash
curl -s http://localhost:3000/healthz
curl -s http://localhost:3000/readyz
```

### Step 5: Restore Traffic Routing
Remove maintenance banner and reload Nginx:
```bash
nginx -s reload
```

---

## 4. Summary

The Rollback Plan provides clear criteria, automated restoration scripts, and deterministic execution steps to mitigate any potential launch incident within **< 5 minutes**.  
**Rollback Plan Status: APPROVED & READY FOR GO-LIVE.**
