# KONTAGI Legacy Migration Mapping

This document maps all original standalone HTML views from the `backup/` directory to their corresponding React + TypeScript + Vite components and React Router routes.

## Core Architecture Overview

- **SPA Shell**: The master layout and top control panel/viewport emulator are handled in [AppShell.tsx](src/layouts/AppShell.tsx).
- **Theme Controls**: Managed via the React context [AppContext.tsx](src/context/AppContext.tsx) and synchronized automatically to the DOM `document.body` classes (supporting standard light/dark modes).
- **Persistent State**: Workspace parameters, creative assets, and analysis results are stored locally inside browser IndexedDB using AuraDB / Dexie in [auraDb.ts](src/services/auraDb.ts).

---

## Migration Index Mapping Table

| Legacy Standalone File | React Router Route Path | React Component File | Controller & Layout Details |
| :--- | :--- | :--- | :--- |
| `index.html` | `/` | [AppShell.tsx](src/layouts/AppShell.tsx) | Root redirect wrapper; redirects immediately to `/dashboard`. |
| `dashboard.html` | `/dashboard` | [Dashboard.tsx](src/pages/Dashboard.tsx) | Workspace overview, uptime gauges, latency monitoring charts, and AI suggestion logs. |
| `projects.html` | `/projects` | [Projects.tsx](src/pages/Projects.tsx) | Directory interface for workspace creative projects and assets. |
| `upload.html` | `/upload` | [Upload.tsx](src/pages/Upload.tsx) | Drag-and-drop file ingestion interface communicating with backend FFmpeg transcoding telemetry endpoints. |
| `hooks.html` | `/assets/:videoId/hooks` | [AssetAnalysis.tsx](src/pages/AssetAnalysis.tsx) | Frame saliency maps, gaze prediction cells, scroll bypass risk indexes. |
| `retention.html` | `/assets/:videoId/retention` | [AssetAnalysis.tsx](src/pages/AssetAnalysis.tsx) | Predictive retention dropoff chart, segment optimizer hooks. |
| `script.html` | `/assets/:videoId/script` | [AssetAnalysis.tsx](src/pages/AssetAnalysis.tsx) | AI transcript editor, vocal dynamics checkpoints, custom hook variance tester. |
| `thumbnail.html` | `/assets/:videoId/thumbnail` | [AssetAnalysis.tsx](src/pages/AssetAnalysis.tsx) | Cover art picker, visual contrast audits, typography overlays. |
| `caption.html` | `/assets/:videoId/caption` | [AssetAnalysis.tsx](src/pages/AssetAnalysis.tsx) | Direct/creative/professional publisher text presets and platform tags. |
| `audio.html` | `/assets/:videoId/audio` | [AssetAnalysis.tsx](src/pages/AssetAnalysis.tsx) | Peak amplitude analyzers, voice isolation metrics, frequency diagnostics. |
| `visual.html` | `/assets/:videoId/visual` | [AssetAnalysis.tsx](src/pages/AssetAnalysis.tsx) | Contrast checker (WCAG level AA parameters), pace counters, saliency focus grids. |
| `audience.html` | `/assets/:videoId/audience` | [AssetAnalysis.tsx](src/pages/AssetAnalysis.tsx) | Gen-Z affinity mappings, user interest matching bars. |
| `lab.html` | `/assets/:videoId/creative-lab`| [AssetAnalysis.tsx](src/pages/AssetAnalysis.tsx) | Generative variant selectors, synthetic face swapping tools. |
| `report.html` | `/assets/:videoId/report` | [AssetAnalysis.tsx](src/pages/AssetAnalysis.tsx) | PDF/CSV compliance audits and exports. |
| `memory.html` | `/assets/:videoId/memory` | [AssetAnalysis.tsx](src/pages/AssetAnalysis.tsx) | AuraDB historical campaign parity charts. |
| `library.html` | `/library` | [GlobalSystem.tsx](src/pages/GlobalSystem.tsx) | Global workspace library displaying video logs and scoreboard. |
| `creators.html` | `/creators` | [GlobalSystem.tsx](src/pages/GlobalSystem.tsx) | Creators database containing profiles, rates, and active content pieces. |
| `brand.html` | `/brand` | [GlobalSystem.tsx](src/pages/GlobalSystem.tsx) | Brand compliance manager setting forbidden keywords and visual rules. |
| `coach.html` | `/coach` | [GlobalSystem.tsx](src/pages/GlobalSystem.tsx) | AI Coaching workspace for dialoging with marketing bots. |
| `trend.html` | `/trend` | [GlobalSystem.tsx](src/pages/GlobalSystem.tsx) | Trending keywords, sounds, and content hooks tracking dashboards. |
| `client.html` | `/client` | [GlobalSystem.tsx](src/pages/GlobalSystem.tsx) | Portal for client sharing, workspaces sharing and token configurations. |
| `team.html` | `/team` | [GlobalSystem.tsx](src/pages/GlobalSystem.tsx) | Team member seat administration panel. |
| `billing.html` | `/billing` | [GlobalSystem.tsx](src/pages/GlobalSystem.tsx) | Active SaaS subscription selector (Starter, Pro, Enterprise). |
| `notifications.html` | `/notifications` | [GlobalSystem.tsx](src/pages/GlobalSystem.tsx) | System log warnings and alerts. |
| `settings.html` | `/settings` | [GlobalSystem.tsx](src/pages/GlobalSystem.tsx) | Theme switching settings, border radius sliders, dynamic configurations. |
| `admin.html` | `/admin` | [GlobalSystem.tsx](src/pages/GlobalSystem.tsx) | Workspace support ticket logs and database administration tools. |
| `mobile.html` | `/mobile` | [GlobalSystem.tsx](src/pages/GlobalSystem.tsx) | Viewport layout controller for testing mobile configurations. |
| `auth.html` | Integrated | [AppShell.tsx](src/layouts/AppShell.tsx) | Bypassed directly inside dashboard dashboard authorization simulations. |
