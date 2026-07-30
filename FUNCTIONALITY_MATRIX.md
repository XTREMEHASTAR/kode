# KONTAGI Functionality Matrix

This document maps all metrics, features, and analysis models within the KONTAGI platform, classifying each as **MEASURED**, **RULE-BASED**, or **AI-INFERRED**, and tracking their data source.

| Feature / Metric | Target Interface Page | Data Category | Backend Pipeline / Endpoint | Description / Source |
| :--- | :--- | :--- | :--- | :--- |
| **Overall Creative Score** | Dashboard, Library, Report | **AI-INFERRED** / **RULE-BASED** | `POST /api/upload` (Background Analysis) | Calculated by Gemini based on multimodal video inference or computed as a weighted average: `40% Hook + 30% Visual + 30% Audio` as a rule-based fallback. |
| **Hook Score & Analysis** | Hook Intelligence, Report | **AI-INFERRED** / **RULE-BASED** | `POST /api/upload` (Background Analysis) | Evaluated by Gemini for the first 3 seconds of the video or calculated rule-based: aspect ratio score (`9:16` bonus, landscape penalty) minus silence duration penalties. |
| **Visual Score & Analysis** | Visual Intelligence, Report | **AI-INFERRED** / **RULE-BASED** | `POST /api/upload` (Background Analysis) | Assessed by Gemini on visual composition, framing, and contrast, or calculated rule-based from metadata (resolution threshold + FPS criteria). |
| **Audio Score & Analysis** | Audio Intelligence, Report | **AI-INFERRED** / **RULE-BASED** | `POST /api/upload` (Background Analysis) | Evaluated by Gemini on audio clarity and noise or calculated rule-based from audio track stats (mean volume DB, max volume DB, silence gaps). |
| **Speaking Pacing & Duration** | Script Intelligence | **MEASURED** | `GET /api/analysis/:id` | Calculated dynamically by dividing the speech transcript word count by a speaking pace constant (130 words per minute / 2.16 words per second). |
| **Emotional Trajectory Curve** | Script Intelligence | **RULE-BASED** | Front-end static presets | Plots Curiosity, Excitement, and Trust across the video script timeline segments. |
| **Retention Profile Curve** | Retention Intelligence, Report | **AI-INFERRED** / **RULE-BASED** | `POST /api/upload` (Background Analysis) | Predicts viewer retention decay using Gemini or computes deterministic decay starting at 100% decaying through intermediate hook and visual status points. |
| **Alternative Script Suggester**| Script Intelligence | **AI-INFERRED** | `POST /api/ai/chat` | Rewrites script lines dynamically using Gemini instructions to maximize hook strength and conversion probability. |
| **Caption & Tags Optimizer** | Caption Intelligence | **AI-INFERRED** / **RULE-BASED** | `POST /api/ai/analyze-caption` | Evaluates caption engagement, keyword density, CTA presence, and hashtags using Gemini or rule-based word-matching. |
| **Audience Fit objections** | Audience Intelligence | **AI-INFERRED** | `POST /api/ai/analyze-audience` | Predicts objections, compelling factors, and demographics compatibility using Gemini. |
| **Platform Readiness Matrix** | Creative Lab, Report | **RULE-BASED** | `POST /api/ai/platform-readiness` | Checks technical requirements (aspect ratio, duration, resolution, audio presence) for TikTok, Instagram Reels, and YouTube Shorts. |
| **AI Creative Coach Chat** | Creative Coach | **AI-INFERRED** | `POST /api/ai/chat` | Interactive advisor that references active video transcript, scores, and visual telemetry data to provide tailored recommendations. |

---
*Note: All backend pipelines automatically fall back gracefully to **RULE-BASED** evaluation if the Gemini AI API provider is offline or missing credentials.*
