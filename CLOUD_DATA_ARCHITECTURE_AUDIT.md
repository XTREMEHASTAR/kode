# KONTAGI Phase 2 — Cloud Data Architecture Audit

## 1. Current Database & Provider Inspection
* **Server DB Support**: `server.js` contains a dual-mode database driver:
  * **Supabase Client**: Uses `@supabase/supabase-js` if `SUPABASE_URL` and `SUPABASE_ANON_KEY` are defined in `.env`.
  * **Resilient File DB**: Automatically falls back to `db-mock-store.json` on disk when Supabase credentials are not supplied.
* **REST Server Endpoints**: Running on port `3000` (`http://localhost:3000`). Currently serves `/api/workspaces`, `/api/projects`, `/api/videos`, `/api/settings`, and AI improvement endpoints (`/api/ai/hook/improve`, `/api/ai/script/improve`).

---

## 2. Current Local Storage Audit
* **Script Intelligence Data**: Stored entirely in browser `localStorage`:
  * `kontagi-free-tier-scripts`: Array of `FreeTierScript` objects.
  * `kontagi-free-tier-quota`: Daily analysis quota tracking object (`{ date: YYYY-MM-DD, count: N }`).
* **Authentication**: Stored in `localStorage` under `kontagi_auth_session`.
* **Workspace & Media Assets**: Stored in `localStorage` under `kontagi-workspaces-data-list`, `kontagi-projects-data-list`, `kontagi-videos-data-list`, and `kontagi-system-settings`.

---

## 3. Canonical Analysis Schema (`FreeTierScript`)
The existing TypeScript type in `src/types/freeTier.ts` defines the complete script analysis payload:
```ts
export interface FreeTierScript {
  id: string;
  userId?: string;
  legacyLocal?: boolean;
  title: string;
  scriptText: string;
  originalScriptText?: string;
  versions?: Array<{
    id: string;
    name: string;
    scriptText: string;
    hookScore: number;
    createdAt: string;
    type: 'original' | 'ai-hook' | 'ai-script' | 'user-edit';
  }>;
  contentType: string;
  createdAt: string;
  hookScore: number;
  isFavorite: boolean;
  wordCount: number;
  characterCount: number;
  estimatedSpeakingTime: number;
  hookText: string;
  signals: string[];
  engineVersion: string;
  analysisMode: string;
  analysisConfidence: 'High' | 'Limited';
  analysisResult: {
    hookScore: number;
    hookStatus: string;
    hookSupportingText: string;
    scoreBreakdown: ScoreBreakdownData;
    insights: InsightData;
    suggestions: SuggestionItem[];
    scriptReview: ScriptReviewData;
    structure: { hook: string; body: string; cta: string };
    ctaDetected: boolean;
  };
}
```

---

## 4. Current Persistence Flow
1. **Creation**: `freeTierService.createScript()` calculates deterministic metrics, constructs `FreeTierScript` with `userId = activeUser.id`, and appends to `localStorage` (`kontagi-free-tier-scripts`).
2. **AI Improvement**: `aiScriptService` calls `/api/ai/hook/improve` or `/api/ai/script/improve`. Upon user acceptance, `freeTierService.updateScript()` updates `scriptText`, `hookText`, `hookScore`, `versions`, and `analysisResult` in `localStorage`.
3. **Library & Details**: Loaded by reading `localStorage` filtered by `userId`.

---

## 5. Existing User Relationship & Gaps
* **Phase 1 Status**: Scripts are tagged with `userId` in `localStorage`.
* **Critical Gap**: Because storage is strictly client-side `localStorage`, logging into a clean browser or another device results in an empty library. Edits, favorites, renames, and AI improvements are bound to the single browser instance.

---

## 6. Recommended Cloud Architecture & Strategy

```
Authenticated User (JWT / x-user-id)
         │
         ▼
  Node/Express API Gateway (server.js :3000)
         │
   ┌─────┴────────────────────────┐
   ▼                              ▼
Supabase PostgreSQL DB      File DB (db-mock-store.json)
(production mode)          (dev / offline fallback)
         │
         ▼
  Canonical Cloud Records
  (script_analyses, script_versions, ai_generations)
         │
         ▼
  scriptCloudService / freeTierService (orchestrator)
         │
         ▼
  Local Cache (localStorage / AuraDB)
         │
         ▼
  React UI (Instant Render + Background Sync)
```

1. **Cloud as Source of Truth**:
   - Server endpoints `/api/scripts`, `/api/scripts/:id`, `/api/scripts/:id/favorite`, `/api/scripts/:id/rename`, `/api/scripts/:id/version`, `/api/scripts/:id/ai-generation` manage cloud persistence.
   - Server validates ownership using `req.userId` derived from bearer session token / auth header.
2. **Cloud DB Tables**:
   - `script_analyses`: Stores main analysis record JSON & top-level attributes (`user_id`, `title`, `hook_score`, `is_favorite`, etc.).
   - `script_versions`: Stores historical script versions (`analysis_id`, `user_id`, `version_type`, `script_text`, `hook_score`).
   - `ai_generations`: Stores audit logs of AI improvement calls (`analysis_id`, `user_id`, `generation_type`, `provider`, `model`).
3. **Local Cache Role**:
   - `localStorage` acts purely as a fast local read cache for immediate UI rendering before cloud reconciliation.
   - On Library or Analysis load: UI renders cached data immediately, performs background fetch to `/api/scripts`, updates cache, and re-renders UI.
