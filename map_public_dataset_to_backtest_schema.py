"""
map_public_dataset_to_backtest_schema.py

Ingests public metadata datasets:
1. YouTube Shorts & TikTok Trends 2025 (CC0)
2. Instagram Reels Analytics Dataset (CC BY 4.0)

Performs filtering for Reels/Shorts content, maps schema fields, calculates
quantile-based tercile buckets (top/middle/bottom third), computes 90% CI coverage,
Spearman rank values, and Brier components against SYNTHETIC predictions.

CRITICAL NON-NEGOTIABLE SAFETY CONSTRAINTS:
1. All predicted values generated here are SYNTHETIC NOISY PERTURBATIONS.
   They must be clearly labeled as SYNTHETIC TEST FIXTURES.
2. All segment keys are prefixed with 'TEST:' to isolate from production claim_eligible gating.
"""

import os
import csv
import json
import math
import random

# Ensure deterministic synthetic noise generation for reproducible test runs
random.seed(42)

def map_creator_tier(followers_or_tier, is_follower_count=False):
    if is_follower_count:
        try:
            cnt = float(followers_or_tier)
            if cnt < 10000:
                return 'cold'
            elif cnt <= 50000:
                return 'warming'
            else:
                return 'established'
        except (ValueError, TypeError):
            return 'cold'
    else:
        tier_str = str(followers_or_tier).lower()
        if tier_str in ['nano', 'micro', 'cold']:
            return 'cold'
        elif tier_str in ['mid', 'warming']:
            return 'warming'
        elif tier_str in ['macro', 'mega', 'established']:
            return 'established'
        return 'established'

def calculate_percentile(values, percentile):
    if not values:
        return 0.0
    sorted_vals = sorted(values)
    k = (len(sorted_vals) - 1) * (percentile / 100.0)
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return sorted_vals[int(k)]
    d0 = sorted_vals[int(f)] * (c - k)
    d1 = sorted_vals[int(c)] * (k - f)
    return d0 + d1

def assign_tercile_bucket(value, p33, p66):
    if value <= p33:
        return 'bottom'
    elif value <= p66:
        return 'middle'
    else:
        return 'top'

def process_datasets():
    output_dir = os.path.join("server", "src", "fixtures")
    os.makedirs(output_dir, exist_ok=True)

    items = []

    # 1. Process Instagram Reels dataset
    ig_path = os.path.join("instagram_dataset", "Instagram_Analytics.csv")
    if os.path.exists(ig_path):
        print(f"Reading {ig_path}...")
        with open(ig_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                media_type = (row.get('media_type') or '').strip().lower()
                if media_type != 'reel':
                    continue

                post_id = row.get('post_id') or f"IG_{len(items)}"
                category = (row.get('content_category') or 'General').strip()
                follower_count = row.get('follower_count') or 0
                creator_tier = map_creator_tier(follower_count, is_follower_count=True)
                
                try:
                    eng_rate = float(row.get('engagement_rate') or 0.0)
                    reach = float(row.get('reach') or 100.0)
                    saves = float(row.get('saves') or 0.0)
                except ValueError:
                    eng_rate, reach, saves = 0.03, 100.0, 0.0

                save_rate = saves / max(1.0, reach)

                # Normalize viral score 0-100 based on engagement rate & reach
                actual_score = min(100.0, max(0.0, eng_rate * 1000 + math.log10(max(1.0, reach)) * 10))

                items.append({
                    "id": f"synthetic_ig_{post_id}",
                    "dataset_source": "instagram_analytics_dataset",
                    "title": f"Instagram Reel ({category}) - {post_id}",
                    "creatorId": row.get('account_id') or "ig_creator",
                    "creatorTier": creator_tier,
                    "platform": "instagram",
                    "country": "us",
                    "category": category.lower(),
                    "actual_score": round(actual_score, 2),
                    "actual_save_rate": round(save_rate, 4),
                    "realMetrics": {
                        "views": int(reach),
                        "engagementRate": round(eng_rate, 4),
                        "saveRate": round(save_rate, 4),
                        "viralScore": round(actual_score, 2)
                    }
                })

    # 2. Process YouTube / TikTok Trends 2025 dataset
    yt_path = "youtube_shorts_tiktok_trends_2025.csv"
    if os.path.exists(yt_path):
        print(f"Reading {yt_path}...")
        with open(yt_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                platform_raw = (row.get('platform') or 'youtube').strip().lower()
                platform = 'youtube_shorts' if 'youtube' in platform_raw else 'tiktok'
                country = (row.get('country') or 'us').strip().lower()
                category = (row.get('category') or 'general').strip().lower()
                row_id = row.get('row_id') or f"YT_{len(items)}"
                raw_tier = row.get('creator_tier') or 'Mid'
                creator_tier = map_creator_tier(raw_tier, is_follower_count=False)

                try:
                    views = float(row.get('views') or 1000.0)
                    eng_rate = float(row.get('engagement_rate') or 0.05)
                    save_rate = float(row.get('save_rate') or 0.01)
                except ValueError:
                    views, eng_rate, save_rate = 1000.0, 0.05, 0.01

                # Normalize viral score 0-100
                actual_score = min(100.0, max(0.0, eng_rate * 500 + math.log10(max(1.0, views)) * 8))

                items.append({
                    "id": f"synthetic_{platform}_{row_id}",
                    "dataset_source": "youtube_tiktok_trends_2025",
                    "title": (row.get('title') or f"{platform} clip").strip(),
                    "creatorId": (row.get('author_handle') or "creator").strip(),
                    "creatorTier": creator_tier,
                    "platform": platform,
                    "country": country,
                    "category": category,
                    "actual_score": round(actual_score, 2),
                    "actual_save_rate": round(save_rate, 4),
                    "realMetrics": {
                        "views": int(views),
                        "engagementRate": round(eng_rate, 4),
                        "saveRate": round(save_rate, 4),
                        "viralScore": round(actual_score, 2)
                    }
                })

    print(f"Total Reels/Shorts items extracted: {len(items)}")

    # 3. Segment items & compute per-segment tercile quantiles and SYNTHETIC predictions
    segments = {}
    for item in items:
        # Mandatory TEST: prefix for isolation
        seg_key = f"TEST:{item['platform']}:{item['country']}:{item['category']}:{item['creatorTier']}"
        item['segmentKey'] = seg_key
        if seg_key not in segments:
            segments[seg_key] = []
        segments[seg_key].append(item)

    processed_items = []
    segment_summaries = {}

    for seg_key, seg_items in segments.items():
        actual_scores = [it['actual_score'] for it in seg_items]
        
        # Calculate empirical 33.3rd and 66.7th percentiles for actual values
        act_p33 = calculate_percentile(actual_scores, 33.33)
        act_p66 = calculate_percentile(actual_scores, 66.67)

        # Generate SYNTHETIC predicted values with controlled Gaussian noise
        # SYNTHETIC LABEL MANDATORY: This is a synthetic test fixture perturbation!
        synthetic_preds = []
        for it in seg_items:
            # Gaussian noise with stddev=7.5
            noise = random.gauss(0, 7.5)
            pred_score = min(100.0, max(0.0, it['actual_score'] + noise))
            it['synthetic_predicted_score'] = round(pred_score, 2)
            it['is_synthetic_test_fixture'] = True
            it['label'] = "SYNTHETIC TEST FIXTURE — NOT A REAL MODEL PREDICTION"
            synthetic_preds.append(pred_score)

        pred_p33 = calculate_percentile(synthetic_preds, 33.33)
        pred_p66 = calculate_percentile(synthetic_preds, 66.67)

        for it in seg_items:
            pred_score = it['synthetic_predicted_score']
            act_score = it['actual_score']

            # Assign tercile buckets
            it['actualBucket'] = assign_tercile_bucket(act_score, act_p33, act_p66)
            it['predictedBucket'] = assign_tercile_bucket(pred_score, pred_p33, pred_p66)

            # 90% CI boundaries (fixed +/- 12 interval)
            ci_min = max(0.0, pred_score - 12.0)
            ci_max = min(100.0, pred_score + 12.0)
            it['ciMin'] = round(ci_min, 2)
            it['ciMax'] = round(ci_max, 2)

            # Edge inclusion check (inclusive)
            it['coveredByCi'] = (act_score >= ci_min) and (act_score <= ci_max)

            # Brier component for high save rate (saveRate >= 0.01)
            p_high_save = pred_score / 100.0
            o_high_save = 1.0 if it['actual_save_rate'] >= 0.01 else 0.0
            it['brierComponent'] = round((p_high_save - o_high_save) ** 2, 4)

            processed_items.append(it)

    # 4. Save fixture JSON file
    fixture_payload = {
        "is_synthetic_test_fixture": True,
        "warning": "SYNTHETIC TEST FIXTURES — NOT REAL ACCURACY DATA",
        "claim_eligible": False,
        "total_items": len(processed_items),
        "total_segments": len(segments),
        "items": processed_items
    }

    out_file = os.path.join(output_dir, "synthetic_reels_backtest_fixtures.json")
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(fixture_payload, f, indent=2)

    print(f"Successfully wrote {len(processed_items)} synthetic test items across {len(segments)} segments to {out_file}")

if __name__ == "__main__":
    process_datasets()
