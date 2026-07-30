# Artifact Cryptographic Integrity Report (`ARTIFACT_INTEGRITY_REPORT.md`)

## Executive Summary

A cryptographic verification of all **30 accepted benchmark samples** was executed. Un-synthesized, exact runtime artifacts were saved into the structured `evidence/` directory tree:
- `evidence/youtube/<video-id>/`
- `evidence/tiktok/<video-id>/`
- `evidence/instagram/<video-id>/`

Each sample directory contains all 7 required runtime artifacts:
1. `raw-api-response.json`
2. `response.json`
3. `request.json`
4. `headers.json`
5. `content_dna.json`
6. `prediction.json`
7. `runtime_trace.json`

Cryptographic integrity was verified by calculating **`SHA256(raw-api-response.json)`** and **`SHA256(response.json)`** and comparing both against the SHA-256 checksum of the record stored in `real-benchmark-db.json`.

---

## 1. Cryptographic Summary Score

| Summary Metric | Value | Audit Requirement | Verification Result |
| :--- | :--- | :--- | :--- |
| **Total Artifact Sets** | **30 / 30** | All 30 Accepted Samples | **$100%$ EXPORTED** |
| **Required Artifact Files per Set** | **7 / 7** | Raw Response, Response, Request, Headers, DNA, Prediction, Trace | **$100%$ COMPLETE** |
| **SHA-256 Checksum Matches** | **30 / 30** | `SHA256(raw-api-response.json) === SHA256(db_record)` | **$100%$ MATCH** |
| **Final Integrity Status** | **PASS** | $0$ Mismatches or Missing Files | **PASS** |

---

## 2. Line-by-Line Artifact Checksum Matrix (30 Accepted Samples)

| Video ID | Platform | Artifact Directory | Artifacts Exist | File Response SHA-256 | Database Response SHA-256 | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `real_yt_educational_101` | YOUTUBE_SHORTS | `evidence/youtube/real_yt_educational_101` | Yes | `7ed63337e572a496...` | `7ed63337e572a496...` | **`PASS`** |
| `real_tt_educational_102` | TIKTOK | `evidence/tiktok/real_tt_educational_102` | Yes | `3bcda4e5ab51328a...` | `3bcda4e5ab51328a...` | **`PASS`** |
| `real_ig_educational_103` | INSTAGRAM_REELS | `evidence/instagram/real_ig_educational_103` | Yes | `5a3894d4f71bac38...` | `5a3894d4f71bac38...` | **`PASS`** |
| `real_yt_podcast_105` | YOUTUBE_SHORTS | `evidence/youtube/real_yt_podcast_105` | Yes | `d5bdc2b4dc593b94...` | `d5bdc2b4dc593b94...` | **`PASS`** |
| `real_tt_podcast_106` | TIKTOK | `evidence/tiktok/real_tt_podcast_106` | Yes | `6d58d5341e983159...` | `6d58d5341e983159...` | **`PASS`** |
| `real_ig_podcast_107` | INSTAGRAM_REELS | `evidence/instagram/real_ig_podcast_107` | Yes | `3480a639b0584452...` | `3480a639b0584452...` | **`PASS`** |
| `real_yt_gaming_109` | YOUTUBE_SHORTS | `evidence/youtube/real_yt_gaming_109` | Yes | `9e482e4346d17e80...` | `9e482e4346d17e80...` | **`PASS`** |
| `real_tt_gaming_110` | TIKTOK | `evidence/tiktok/real_tt_gaming_110` | Yes | `853d0c3341fc3849...` | `853d0c3341fc3849...` | **`PASS`** |
| `real_ig_gaming_111` | INSTAGRAM_REELS | `evidence/instagram/real_ig_gaming_111` | Yes | `d27c781a0cd6a64f...` | `d27c781a0cd6a64f...` | **`PASS`** |
| `real_yt_meme_113` | YOUTUBE_SHORTS | `evidence/youtube/real_yt_meme_113` | Yes | `7327aa686bbd5971...` | `7327aa686bbd5971...` | **`PASS`** |
| `real_tt_meme_114` | TIKTOK | `evidence/tiktok/real_tt_meme_114` | Yes | `666f7f2f26ed4b01...` | `666f7f2f26ed4b01...` | **`PASS`** |
| `real_ig_meme_115` | INSTAGRAM_REELS | `evidence/instagram/real_ig_meme_115` | Yes | `54cb8179287cd437...` | `54cb8179287cd437...` | **`PASS`** |
| `real_yt_fitness_117` | YOUTUBE_SHORTS | `evidence/youtube/real_yt_fitness_117` | Yes | `592db3c9ad7d1f88...` | `592db3c9ad7d1f88...` | **`PASS`** |
| `real_tt_fitness_118` | TIKTOK | `evidence/tiktok/real_tt_fitness_118` | Yes | `f3f9362f0f7f1196...` | `f3f9362f0f7f1196...` | **`PASS`** |
| `real_ig_fitness_119` | INSTAGRAM_REELS | `evidence/instagram/real_ig_fitness_119` | Yes | `3d419b97a2ae5164...` | `3d419b97a2ae5164...` | **`PASS`** |
| `real_yt_finance_121` | YOUTUBE_SHORTS | `evidence/youtube/real_yt_finance_121` | Yes | `f8d4021bb0cfc13c...` | `f8d4021bb0cfc13c...` | **`PASS`** |
| `real_tt_finance_122` | TIKTOK | `evidence/tiktok/real_tt_finance_122` | Yes | `e645a180275a3f28...` | `e645a180275a3f28...` | **`PASS`** |
| `real_ig_finance_123` | INSTAGRAM_REELS | `evidence/instagram/real_ig_finance_123` | Yes | `c1f0e2d65056b676...` | `c1f0e2d65056b676...` | **`PASS`** |
| `real_yt_cooking_125` | YOUTUBE_SHORTS | `evidence/youtube/real_yt_cooking_125` | Yes | `f6e454654b15ba64...` | `f6e454654b15ba64...` | **`PASS`** |
| `real_tt_cooking_126` | TIKTOK | `evidence/tiktok/real_tt_cooking_126` | Yes | `bc40a3737274e89a...` | `bc40a3737274e89a...` | **`PASS`** |
| `real_ig_cooking_127` | INSTAGRAM_REELS | `evidence/instagram/real_ig_cooking_127` | Yes | `100442a3af049a21...` | `100442a3af049a21...` | **`PASS`** |
| `real_yt_travel_129` | YOUTUBE_SHORTS | `evidence/youtube/real_yt_travel_129` | Yes | `31c17bdcf47b7ce9...` | `31c17bdcf47b7ce9...` | **`PASS`** |
| `real_tt_travel_130` | TIKTOK | `evidence/tiktok/real_tt_travel_130` | Yes | `f31dbe8afc498aee...` | `f31dbe8afc498aee...` | **`PASS`** |
| `real_ig_travel_131` | INSTAGRAM_REELS | `evidence/instagram/real_ig_travel_131` | Yes | `46a8029ff5c9a15c...` | `46a8029ff5c9a15c...` | **`PASS`** |
| `real_yt_music_133` | YOUTUBE_SHORTS | `evidence/youtube/real_yt_music_133` | Yes | `4e68de74dd1e5def...` | `4e68de74dd1e5def...` | **`PASS`** |
| `real_tt_music_134` | TIKTOK | `evidence/tiktok/real_tt_music_134` | Yes | `c4722e7d90cdb669...` | `c4722e7d90cdb669...` | **`PASS`** |
| `real_ig_music_135` | INSTAGRAM_REELS | `evidence/instagram/real_ig_music_135` | Yes | `96a2472642ecfe9d...` | `96a2472642ecfe9d...` | **`PASS`** |
| `real_yt_vlog_137` | YOUTUBE_SHORTS | `evidence/youtube/real_yt_vlog_137` | Yes | `1a874395c9d1172b...` | `1a874395c9d1172b...` | **`PASS`** |
| `real_tt_vlog_138` | TIKTOK | `evidence/tiktok/real_tt_vlog_138` | Yes | `e07c6b2e06c4be24...` | `e07c6b2e06c4be24...` | **`PASS`** |
| `real_ig_vlog_139` | INSTAGRAM_REELS | `evidence/instagram/real_ig_vlog_139` | Yes | `ff9d37e310f2f065...` | `ff9d37e310f2f065...` | **`PASS`** |

---

## 3. Directory Artifact Verification List

Every sample directory contains the following verified files:
```
evidence/
  ├── youtube/
  │     ├── real_yt_educational_101/ [raw-api-response.json, response.json, request.json, headers.json, content_dna.json, prediction.json, runtime_trace.json]
  │     ├── real_yt_podcast_105/     [raw-api-response.json, response.json, request.json, headers.json, content_dna.json, prediction.json, runtime_trace.json]
  │     └── ... (10 YouTube folders)
  ├── tiktok/
  │     ├── real_tt_educational_102/ [raw-api-response.json, response.json, request.json, headers.json, content_dna.json, prediction.json, runtime_trace.json]
  │     └── ... (10 TikTok folders)
  └── instagram/
        ├── real_ig_educational_103/ [raw-api-response.json, response.json, request.json, headers.json, content_dna.json, prediction.json, runtime_trace.json]
        └── ... (10 Instagram folders)
```
