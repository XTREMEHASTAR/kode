# Production Inference Pipeline Forensic Audit (`PIPELINE_AUDIT.md`)

## Executive Summary

A full 5-video differential execution audit was conducted across 5 distinct video archetypes:
- **Video A**: Talking head with speech (`video_talking_head_A`)
- **Video B**: Fast meme edit (`video_fast_meme_B`)
- **Video C**: Black screen (`video_black_screen_C`)
- **Video D**: Music video (`video_music_video_D`)
- **Video E**: Gaming clip (`video_gaming_clip_E`)

Structured 10-file JSON debug traces were exported under `debug/pipeline/<timestamp>-<assetId>/` for every execution.

---

## 1. Stage Comparison Matrix

| Pipeline Stage | Video A | Video B | Video C | Video D | Video E | Stage Status | Diversity Maintained? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01. FFmpeg Keyframe Demux** | `seed: 3959` | `seed: 7083` | `seed: 7120` | `seed: 7291` | `seed: 6994` | Executes | **YES** (Hashes differ) |
| **02. Visual Editing Rhythm** | `0.9900` | `0.9900` | `0.9900` | `0.9900` | `0.9900` | **COLLAPSED** | **NO (100% Identical)** |
| **03. Speech Clarity Index** | `0.9900` | `0.9900` | `0.9900` | `0.9900` | `0.9900` | **COLLAPSED** | **NO (100% Identical)** |
| **04. Audio RMS Energy** | `0.5657` | `0.5657` | `0.5657` | `0.5657` | `0.5657` | **COLLAPSED** | **NO (100% Identical)** |
| **05. OCR Caption Density** | `0.5867` | `0.6933` | `0.5600` | `0.5867` | `0.6133` | Executes | **YES** (Minor drift) |
| **06. Embedding Vector Norm** | `9.4791` | `9.4791` | `9.4791` | `9.4791` | `9.4791` | **COLLAPSED** | **NO (100% Identical)** |
| **07. ContentDNA Hook Score** | `0.8389` | `0.8655` | `0.8322` | `0.8389` | `0.8455` | **COLLAPSED** | **NO ($\pm 1.5\%$ variance)** |
| **08. Predicted Views** | `116,093` | `115,718` | `115,585` | `113,693` | `115,798` | **COLLAPSED** | **NO ($\pm 1.0\%$ variance)** |
| **09. Virality Probability** | `62.6%` | `62.3%` | `62.3%` | `61.1%` | `62.4%` | **COLLAPSED** | **NO ($\pm 0.7\%$ variance)** |
| **10. Completion Rate** | `42.4%` | `42.8%` | `42.3%` | `42.4%` | `42.5%` | **COLLAPSED** | **NO ($\pm 0.2\%$ variance)** |

---

## 2. Stage Where Diversity First Collapses

**Stage 2 (FFmpegProcessor)** & **Stage 3 (Subsystem Extractors)**.

---

## 3. Why It Happens

1. **Synthetic Keyframe Buffer Generation**: `FFmpegProcessor.extractMediaPayload()` does not execute an actual FFmpeg process on disk to decode real video frames. Instead, it generates synthetic 1-sample-per-second RGBA keyframe buffers `[r, g, b, 255]`.
2. **Motion Saturated Scene Detection**: Because keyframe color values increment by fixed step deltas ($37, 19, 53$) every second, the inter-frame difference `diff / 765` exceeds the motion threshold `0.15` on **every single frame step**. As a result, `sceneChanges` is forced to equal `durationSec` for **all 5 videos**.
3. **Editing Rhythm Clamp Saturation**: In `VisualExtractor.ts`, `editingRhythmScore` is computed as `Math.min(0.99, Math.max(0.05, (sceneChanges / duration) * 3))`. Since `sceneChanges / duration = 1.0`, $(1.0 \times 3) = 3.0$, which clamps to **0.99 for 100% of uploaded videos** (Talking Head, Fast Meme, Black Screen, Music Video, Gaming Clip).
4. **Synthetic Sine Wave Audio Generation**: `FFmpegProcessor.extractMediaPayload()` generates a pure synthetic sine wave (`Math.sin(...) * 0.8`) for `audioPcmBuffer`. A pure sine wave has **0% silence** (`silenceRatio = 0.00`) and a constant RMS energy of **0.5657**.
5. **Speech Clarity Saturation**: In `SpeechExtractor.ts`, `speechClarity` is computed as `Math.min(0.99, (1 - silenceRatio) * 1.2)`. Because `silenceRatio` is 0.00, `(1 - 0.0) * 1.2 = 1.2`, which clamps to **0.99 for all videos**, even a black screen or silent gaming video.
6. **Downstream Feature Fusion Collapse**: In `ProductionContentDnaEngine.ts`, `hookScoreVal` is computed as:
   $$\text{hookScoreVal} = (0.99 \times 0.35) + (\text{captionDensity} \times 0.25) + (0.99 \times 0.25) + (0.5657 \times 0.15) \approx 0.84$$
   Because 75% of the weighted components are pinned to static constants ($0.99, 0.99, 0.5657$), the hook score and 1024D ContentDNA vector mean remain fixed at $\approx 0.56$.
7. **Prediction Model Output Lock**: In `PredictionModelSuite.ts`, `baseViews` is calculated directly from `followerCount`, `viralityProb` ($\approx 0.62$), and `dnaSignal` ($\approx 0.56$). Since `dnaSignal` varies by less than $\pm 0.01$ across all video types, predicted views lock to $\sim 115,000$ for a 50k follower creator regardless of whether the video is a talking head, a fast meme, or a black screen.

---

## 4. Exact File, Function, and Line Numbers

- **File 1**: [FFmpegProcessor.ts](file:///c:/Users/jaiveer/Downloads/insaas/src/engine/orchestrator/FFmpegProcessor.ts)
  - **Function**: `FFmpegProcessor.extractMediaPayload()`
  - **Lines**: 28–46
- **File 2**: [VisualExtractor.ts](file:///c:/Users/jaiveer/Downloads/insaas/src/engine/orchestrator/real/VisualExtractor.ts)
  - **Function**: `VisualExtractor.extractVisualFeatures()`
  - **Lines**: 48–70
- **File 3**: [SpeechExtractor.ts](file:///c:/Users/jaiveer/Downloads/insaas/src/engine/orchestrator/real/SpeechExtractor.ts)
  - **Function**: `SpeechExtractor.extractSpeechFeatures()`
  - **Lines**: 22–46
- **File 4**: [ProductionContentDnaEngine.ts](file:///c:/Users/jaiveer/Downloads/insaas/src/engine/orchestrator/real/ProductionContentDnaEngine.ts)
  - **Function**: `ProductionContentDnaEngine.fuseProductionContentDna()`
  - **Lines**: 44–58

---

## 5. Cache & Singleton Audit Findings

1. `InferenceCache.ts`: `private cache: Map<string, any> = new Map()`
   - Implements in-memory key-value caching.
2. `LocalAiOrchestrator.ts`: `private cache: Map<string, MultimodalContentDNA> = new Map()`
   - Caches `MultimodalContentDNA` objects by `assetId`.
3. `QwenReasoningEngine.ts`: Lines 33–50
   - Uses a strict 500ms timeout for local Ollama HTTP calls. When Ollama is un-instantiated, it falls back to binary deterministic logic (`isHighMotion = motion > 0.4 || sceneCount > 5`) which yields identical category tags across videos.
4. `PredictionModelSuite.ts`: Line 20
   - Uses fixed PRNG seed `4096`.

---

## 6. Root Cause

Synthetic buffer generation in `FFmpegProcessor` forces static signal parameters (100% scene cut frequency, 0% silence ratio, constant 0.8 amplitude sine wave) into downstream extractors. Downstream clamp math (`Math.min(0.99, ...)`) caps `editingRhythmScore` and `speechClarity` to maximum saturation (0.99), destroying feature diversity before embedding generation and prediction modeling occur.

---

## 7. Recommended Fix

Replace synthetic buffer generation in `FFmpegProcessor.extractMediaPayload()` with real media demuxing via FFmpeg CLI child processes (`ffmpeg -i <videoPath> ...`) to extract actual keyframes and audio PCM samples, or compute frame luminance and audio waveform variance directly from file binary streams when the FFmpeg binary is absent.

---

## 8. Confidence Level

**100% (HIGH)** — Empirically verified across 5 distinct video archetypes (Video A, B, C, D, E) with structured debug reports in `/debug/pipeline/`.
