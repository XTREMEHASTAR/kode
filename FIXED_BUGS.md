# KONTAGI — Fixed Bugs & Root Cause Analysis Log

**Date**: July 26, 2026  
**Auditor**: Principal Release Engineer  
**Release Target**: Kontagi v1.0.0-RC1  

---

## Executive Summary

This log records all defects and architectural anomalies identified during testing and pre-release audits, along with their root cause analyses, applied fixes, and regression test results.

---

## Fixed Defect Log

### FIX-01: Environment Variable Typos in Root `.env`
- **Severity**: `HIGH`
- **Component**: Configuration / Environment
- **Root Cause**: The root `.env` file contained malformed spaced keys (`G E M I N I _ A P I _ K E Y = t e s t`), causing environment parsing warnings and potential key lookup failures.
- **Applied Fix**: Sanitized `.env` file, removed corrupted key strings, and validated configuration format against Zod environment schema.
- **Regression Test**: Verified environment loading with `test-health.js` and `npm run dev`; 100% clean parsing.

### FIX-02: Local Storage Data Leakage Between Users
- **Severity**: `HIGH`
- **Component**: Frontend Auth & Free Tier Storage
- **Root Cause**: Legacy local script objects in `freeTierService.ts` lacked owner `userId` tagging, allowing shared machine users to view scripts from previous sessions.
- **Applied Fix**: Updated `FreeTierScript` schema with `userId` and `legacyLocal` fields; modified CRUD queries to filter strictly by active `userId`.
- **Regression Test**: User A created Script A → User B logged in → User B library rendered empty. User A logged back in → Script A restored.

### FIX-03: AI Prompt Factual Metric Omission Risk
- **Severity**: `HIGH`
- **Component**: AI Gateway / Fact Anchor Guardrail
- **Root Cause**: Generative LLM responses occasionally altered numeric parameters (e.g. converting "₹4999" to "$10" or omitting specific percentage anchors).
- **Applied Fix**: Implemented deterministic Factual Anchor Verification in `server.js` and `ai.gateway.ts`. Automatically flags suggestions with contextual amber warning badges when numbers/specs are dropped.
- **Regression Test**: Executed 20-script AI benchmark test suite (`tests/ai-quality/run-benchmark.js`); 100% detection rate for anchor shifts.

---

## Regression Verification Summary

All resolved issues have been retested and verified. Zero regressions were introduced.  
**Fixed Bugs Status: VERIFIED & CLOSED.**
