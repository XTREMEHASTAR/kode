import { ProductionInferencePipeline } from '../src/engine/orchestrator/real/ProductionInferencePipeline';
import { CreatorAgent } from '../src/engine/creator/CreatorAgent';
import { EnvironmentState } from '../src/engine/environment/EnvironmentState';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('=== RUNNING 5-VIDEO DIFFERENTIAL EXECUTION AUDIT ===\n');

  const pipeline = new ProductionInferencePipeline();

  const creatorProfile: CreatorAgent = {
    id: 'creator_test_01',
    name: 'Audit Creator',
    archetype: 'EDUCATOR',
    followerCount: 50000,
    authorityScore: 0.85,
    niche: 'TECH_EDUCATION',
    historicalViralityRate: 0.25,
    averageRetentionSec: 18,
    postingFrequencyPerWeek: 4,
    audienceDemographics: { genZPct: 0.65, millennialPct: 0.25, otherPct: 0.10 }
  } as any;

  const environmentState: EnvironmentState = {
    platformId: 'TIKTOK',
    timestamp: Date.now(),
    activeTrends: [{ id: 'trend_01', category: 'TECH', viralityMultiplier: 1.2 }],
    algorithmState: { recencyWeight: 0.4, retentionWeight: 0.6 }
  } as any;

  const videoArchetypes = [
    { assetId: 'video_talking_head_A', videoPath: 'c:/videos/talking_head.mp4', durationSec: 30, label: 'Video A (Talking Head)' },
    { assetId: 'video_fast_meme_B', videoPath: 'c:/videos/fast_meme.mp4', durationSec: 15, label: 'Video B (Fast Meme)' },
    { assetId: 'video_black_screen_C', videoPath: 'c:/videos/black_screen.mp4', durationSec: 30, label: 'Video C (Black Screen)' },
    { assetId: 'video_music_video_D', videoPath: 'c:/videos/music_video.mp4', durationSec: 45, label: 'Video D (Music Video)' },
    { assetId: 'video_gaming_clip_E', videoPath: 'c:/videos/gaming_clip.mp4', durationSec: 60, label: 'Video E (Gaming Clip)' }
  ];

  const results: any[] = [];

  for (const item of videoArchetypes) {
    console.log(`Processing ${item.label}...`);
    const res = await pipeline.runProductionInference({
      assetId: item.assetId,
      videoPath: item.videoPath,
      durationSec: item.durationSec,
      creatorProfile,
      environmentState
    });

    results.push({
      label: item.label,
      assetId: item.assetId,
      durationSec: item.durationSec,
      hookScore: res.contentDna.hookScore.value,
      visualNovelty: res.contentDna.visualNovelty.value,
      editingRhythm: res.contentDna.editingRhythm.value,
      speechClarity: res.contentDna.speechClarity.value,
      audioEnergy: res.contentDna.audioEnergy.value,
      predictedViews: res.predictionOutput.predictedViews,
      viralityProbability: res.predictionOutput.viralityProbability,
      completionRate: res.predictionOutput.predictedCompletionRate
    });
  }

  console.log('\n================================================================');
  console.log('             5-VIDEO DIFFERENTIAL EXPERIMENT SUMMARY MATRIX              ');
  console.log('================================================================');
  console.table(results);

  console.log('\nDebug reports generated in /debug/pipeline/');
}

main().catch(err => {
  console.error('Audit Execution Failed:', err);
  process.exit(1);
});
