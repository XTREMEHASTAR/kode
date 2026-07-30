# Benchmark Dataset Forensic Audit Report (`BENCHMARK_DATASET_AUDIT.md`)

## Executive Summary

A forensic audit of the **100-video benchmark dataset** used in model evaluation was conducted. Every sample was inspected for ground truth provenance, collection methodology, platform source URLs, and data authenticity.

Per strict validation guidelines:
> *If any benchmark sample uses estimated, simulated, placeholder, generated, or inferred engagement values, mark it **INVALID**.*

---

## 1. Audit Summary & Benchmark Confidence Score

| Audit Metric | Result | Benchmark Quality Assessment |
| :--- | :--- | :--- |
| **Total Samples Audited** | **100** | Full 10-category evaluation corpus |
| **Valid Samples** | **0** | **0% Live-Scraped API Authenticity** |
| **Invalid Samples** | **100** | **100% Algorithmic / Synthetic Generation** |
| **Benchmark Confidence Score** | **0.0%** | **UNVALIDATED BENCHMARK DATASET** |

---

## 2. Root Cause & Audit Findings

1. **Synthetic Label Generation**: All 100 engagement numbers (`actualViews`, `actualLikes`, `actualComments`, `actualShares`, `actualCompletionRate`) were generated inside `scripts/run_model_validation.ts` using algorithmic linear variance formulas (`baseViews * varianceFactor`).
2. **Missing Live Source URLs**: No public platform URLs (YouTube, TikTok, Instagram Reels) or live API responses (YouTube Data API v3 / TikTok Research API) were fetched to establish real-world ground truth.
3. **Synthetic Media Paths**: Media file paths (`c:/videos/benchmark_educational_1.mp4`) point to local test stubs rather than verified public content assets.

---

## 3. Full 100-Sample Forensic Catalog

| Video ID | Category | Platform | Actual Views | Actual Likes | Actual Comments | Actual Shares | Completion | Source | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `bench_educational_001` | Educational | TikTok (Simulated) | 60,350 | 4,225 | 604 | 1,207 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_educational_002` | Educational | TikTok (Simulated) | 69,700 | 5,576 | 836 | 1,046 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_educational_003` | Educational | TikTok (Simulated) | 79,050 | 4,743 | 1,107 | 1,581 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_educational_004` | Educational | TikTok (Simulated) | 88,400 | 6,188 | 707 | 1,326 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_educational_005` | Educational | TikTok (Simulated) | 97,750 | 7,820 | 978 | 1,955 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_educational_006` | Educational | TikTok (Simulated) | 107,100 | 6,426 | 1,285 | 1,607 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_educational_007` | Educational | TikTok (Simulated) | 98,600 | 6,902 | 1,380 | 1,972 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_educational_008` | Educational | TikTok (Simulated) | 107,950 | 8,636 | 864 | 1,619 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_educational_009` | Educational | TikTok (Simulated) | 117,300 | 7,038 | 1,173 | 2,346 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_educational_010` | Educational | TikTok (Simulated) | 126,650 | 8,865 | 1,520 | 1,900 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_podcast_011` | Podcast | TikTok (Simulated) | 52,000 | 3,640 | 520 | 1,040 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_podcast_012` | Podcast | TikTok (Simulated) | 59,150 | 4,732 | 710 | 887 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_podcast_013` | Podcast | TikTok (Simulated) | 66,300 | 3,978 | 928 | 1,326 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_podcast_014` | Podcast | TikTok (Simulated) | 59,800 | 4,186 | 478 | 897 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_podcast_015` | Podcast | TikTok (Simulated) | 66,950 | 5,356 | 670 | 1,339 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_podcast_016` | Podcast | TikTok (Simulated) | 74,100 | 4,446 | 889 | 1,112 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_podcast_017` | Podcast | TikTok (Simulated) | 81,250 | 5,687 | 1,138 | 1,625 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_podcast_018` | Podcast | TikTok (Simulated) | 88,400 | 7,072 | 707 | 1,326 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_podcast_019` | Podcast | TikTok (Simulated) | 95,550 | 5,733 | 956 | 1,911 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_podcast_020` | Podcast | TikTok (Simulated) | 102,700 | 7,189 | 1,232 | 1,541 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_gaming_021` | Gaming | TikTok (Simulated) | 74,800 | 5,236 | 748 | 1,496 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_gaming_022` | Gaming | TikTok (Simulated) | 86,900 | 6,952 | 1,043 | 1,304 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_gaming_023` | Gaming | TikTok (Simulated) | 99,000 | 5,940 | 1,386 | 1,980 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_gaming_024` | Gaming | TikTok (Simulated) | 111,100 | 7,777 | 889 | 1,667 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_gaming_025` | Gaming | TikTok (Simulated) | 123,200 | 9,856 | 1,232 | 2,464 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_gaming_026` | Gaming | TikTok (Simulated) | 135,300 | 8,118 | 1,624 | 2,030 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_gaming_027` | Gaming | TikTok (Simulated) | 147,400 | 10,318 | 2,064 | 2,948 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_gaming_028` | Gaming | TikTok (Simulated) | 136,400 | 10,912 | 1,091 | 2,046 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_gaming_029` | Gaming | TikTok (Simulated) | 148,500 | 8,910 | 1,485 | 2,970 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_gaming_030` | Gaming | TikTok (Simulated) | 160,600 | 11,242 | 1,927 | 2,409 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_meme_031` | Meme | TikTok (Simulated) | 142,450 | 9,971 | 1,425 | 2,849 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_meme_032` | Meme | TikTok (Simulated) | 162,800 | 13,024 | 1,954 | 2,442 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_meme_033` | Meme | TikTok (Simulated) | 183,150 | 10,989 | 2,564 | 3,663 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_meme_034` | Meme | TikTok (Simulated) | 203,500 | 14,245 | 1,628 | 3,053 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_meme_035` | Meme | TikTok (Simulated) | 185,000 | 14,800 | 1,850 | 3,700 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_meme_036` | Meme | TikTok (Simulated) | 205,350 | 12,321 | 2,464 | 3,080 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_meme_037` | Meme | TikTok (Simulated) | 225,700 | 15,799 | 3,160 | 4,514 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_meme_038` | Meme | TikTok (Simulated) | 246,050 | 19,684 | 1,968 | 3,691 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_meme_039` | Meme | TikTok (Simulated) | 266,400 | 15,984 | 2,664 | 5,328 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_meme_040` | Meme | TikTok (Simulated) | 286,750 | 20,072 | 3,441 | 4,301 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_fitness_041` | Fitness | TikTok (Simulated) | 81,700 | 5,719 | 817 | 1,634 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_fitness_042` | Fitness | TikTok (Simulated) | 72,200 | 5,776 | 866 | 1,083 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_fitness_043` | Fitness | TikTok (Simulated) | 82,650 | 4,959 | 1,157 | 1,653 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_fitness_044` | Fitness | TikTok (Simulated) | 93,100 | 6,517 | 745 | 1,397 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_fitness_045` | Fitness | TikTok (Simulated) | 103,550 | 8,284 | 1,036 | 2,071 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_fitness_046` | Fitness | TikTok (Simulated) | 114,000 | 6,840 | 1,368 | 1,710 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_fitness_047` | Fitness | TikTok (Simulated) | 124,450 | 8,712 | 1,742 | 2,489 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_fitness_048` | Fitness | TikTok (Simulated) | 134,900 | 10,792 | 1,079 | 2,024 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_fitness_049` | Fitness | TikTok (Simulated) | 125,400 | 7,524 | 1,254 | 2,508 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_fitness_050` | Fitness | TikTok (Simulated) | 135,850 | 9,509 | 1,630 | 2,038 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_finance_051` | Finance | TikTok (Simulated) | 77,700 | 5,439 | 777 | 1,554 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_finance_052` | Finance | TikTok (Simulated) | 89,250 | 7,140 | 1,071 | 1,339 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_finance_053` | Finance | TikTok (Simulated) | 100,800 | 6,048 | 1,411 | 2,016 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_finance_054` | Finance | TikTok (Simulated) | 112,350 | 7,864 | 899 | 1,685 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_finance_055` | Finance | TikTok (Simulated) | 123,900 | 9,912 | 1,239 | 2,478 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_finance_056` | Finance | TikTok (Simulated) | 113,400 | 6,804 | 1,361 | 1,701 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_finance_057` | Finance | TikTok (Simulated) | 124,950 | 8,747 | 1,749 | 2,499 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_finance_058` | Finance | TikTok (Simulated) | 136,500 | 10,920 | 1,092 | 2,048 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_finance_059` | Finance | TikTok (Simulated) | 148,050 | 8,883 | 1,481 | 2,961 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_finance_060` | Finance | TikTok (Simulated) | 159,600 | 11,172 | 1,915 | 2,394 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_cooking_061` | Cooking | TikTok (Simulated) | 103,750 | 7,262 | 1,038 | 2,075 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_cooking_062` | Cooking | TikTok (Simulated) | 117,500 | 9,400 | 1,410 | 1,763 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_cooking_063` | Cooking | TikTok (Simulated) | 105,000 | 6,300 | 1,470 | 2,100 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_cooking_064` | Cooking | TikTok (Simulated) | 118,750 | 8,313 | 950 | 1,781 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_cooking_065` | Cooking | TikTok (Simulated) | 132,500 | 10,600 | 1,325 | 2,650 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_cooking_066` | Cooking | TikTok (Simulated) | 146,250 | 8,775 | 1,755 | 2,194 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_cooking_067` | Cooking | TikTok (Simulated) | 160,000 | 11,200 | 2,240 | 3,200 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_cooking_068` | Cooking | TikTok (Simulated) | 173,750 | 13,900 | 1,390 | 2,606 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_cooking_069` | Cooking | TikTok (Simulated) | 187,500 | 11,250 | 1,875 | 3,750 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_cooking_070` | Cooking | TikTok (Simulated) | 175,000 | 12,250 | 2,100 | 2,625 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_travel_071` | Travel | TikTok (Simulated) | 99,400 | 6,958 | 994 | 1,988 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_travel_072` | Travel | TikTok (Simulated) | 114,800 | 9,184 | 1,378 | 1,722 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_travel_073` | Travel | TikTok (Simulated) | 130,200 | 7,812 | 1,823 | 2,604 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_travel_074` | Travel | TikTok (Simulated) | 145,600 | 10,192 | 1,165 | 2,184 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_travel_075` | Travel | TikTok (Simulated) | 161,000 | 12,880 | 1,610 | 3,220 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_travel_076` | Travel | TikTok (Simulated) | 176,400 | 10,584 | 2,117 | 2,646 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_travel_077` | Travel | TikTok (Simulated) | 162,400 | 11,368 | 2,274 | 3,248 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_travel_078` | Travel | TikTok (Simulated) | 177,800 | 14,224 | 1,422 | 2,667 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_travel_079` | Travel | TikTok (Simulated) | 193,200 | 11,592 | 1,932 | 3,864 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_travel_080` | Travel | TikTok (Simulated) | 208,600 | 14,602 | 2,503 | 3,129 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_music_081` | Music | TikTok (Simulated) | 124,000 | 8,680 | 1,240 | 2,480 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_music_082` | Music | TikTok (Simulated) | 141,050 | 11,284 | 1,693 | 2,116 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_music_083` | Music | TikTok (Simulated) | 158,100 | 9,486 | 2,213 | 3,162 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_music_084` | Music | TikTok (Simulated) | 142,600 | 9,982 | 1,141 | 2,139 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_music_085` | Music | TikTok (Simulated) | 159,650 | 12,772 | 1,597 | 3,193 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_music_086` | Music | TikTok (Simulated) | 176,700 | 10,602 | 2,120 | 2,651 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_music_087` | Music | TikTok (Simulated) | 193,750 | 13,562 | 2,713 | 3,875 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_music_088` | Music | TikTok (Simulated) | 210,800 | 16,864 | 1,686 | 3,162 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_music_089` | Music | TikTok (Simulated) | 227,850 | 13,671 | 2,279 | 4,557 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_music_090` | Music | TikTok (Simulated) | 244,900 | 17,143 | 2,939 | 3,674 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_vlog_091` | Vlog | TikTok (Simulated) | 51,000 | 3,570 | 510 | 1,020 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_vlog_092` | Vlog | TikTok (Simulated) | 59,250 | 4,740 | 711 | 889 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_vlog_093` | Vlog | TikTok (Simulated) | 67,500 | 4,050 | 945 | 1,350 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_vlog_094` | Vlog | TikTok (Simulated) | 75,750 | 5,302 | 606 | 1,136 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_vlog_095` | Vlog | TikTok (Simulated) | 84,000 | 6,720 | 840 | 1,680 | 34.0% | Script Generator Formula | **`INVALID`** |
| `bench_vlog_096` | Vlog | TikTok (Simulated) | 92,250 | 5,535 | 1,107 | 1,384 | 36.4% | Script Generator Formula | **`INVALID`** |
| `bench_vlog_097` | Vlog | TikTok (Simulated) | 100,500 | 7,035 | 1,407 | 2,010 | 38.8% | Script Generator Formula | **`INVALID`** |
| `bench_vlog_098` | Vlog | TikTok (Simulated) | 93,000 | 7,440 | 744 | 1,395 | 41.2% | Script Generator Formula | **`INVALID`** |
| `bench_vlog_099` | Vlog | TikTok (Simulated) | 101,250 | 6,075 | 1,013 | 2,025 | 43.6% | Script Generator Formula | **`INVALID`** |
| `bench_vlog_100` | Vlog | TikTok (Simulated) | 109,500 | 7,665 | 1,314 | 1,643 | 34.0% | Script Generator Formula | **`INVALID`** |

---

## 4. Remediation Plan for 100% Valid Benchmark

To achieve a **100% Valid Benchmark** with **100% Confidence Score**, the dataset must be reconstructed using the following live platform protocol:

1. **Live Platform Crawling**: Fetch 100 public video URLs from TikTok, YouTube Shorts, and Instagram Reels across the 10 target categories.
2. **API Data Ingestion**: Pull real engagement metrics directly via:
   - **YouTube Data API v3**: `statistics.viewCount`, `statistics.likeCount`, `statistics.commentCount`
   - **TikTok Research API / Content Posting API**: `view_count`, `like_count`, `share_count`
3. **Provenance Metadata**: Attach verifiable public URLs, channel IDs, upload timestamps, and raw API JSON payloads to every sample.
