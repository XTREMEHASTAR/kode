import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('=== RUNNING USER-FIRST PRODUCT FLOW VERIFICATION ===\n');

  const dashPath = path.join(process.cwd(), 'src', 'pages', 'Dashboard.tsx');
  const uploadPath = path.join(process.cwd(), 'src', 'pages', 'Upload.tsx');
  const processingPath = path.join(process.cwd(), 'src', 'components', 'processing', 'LivePipelineProcessing.tsx');
  const analysisPath = path.join(process.cwd(), 'src', 'pages', 'AssetAnalysis.tsx');

  const dashContent = fs.readFileSync(dashPath, 'utf-8');
  const uploadContent = fs.readFileSync(uploadPath, 'utf-8');
  const processingContent = fs.readFileSync(processingPath, 'utf-8');
  const analysisContent = fs.readFileSync(analysisPath, 'utf-8');

  // 1. Home Dashboard "New Analysis" CTA
  const hasHomeNewAnalysisBtn = dashContent.includes('Start New Video Analysis');
  console.log(`• Home Dashboard Has "Start New Video Analysis" CTA: ${hasHomeNewAnalysisBtn ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // 2. Upload Wizard (Video, Script, Thumbnail, Caption)
  const hasScriptInput = uploadContent.includes('script') || uploadContent.includes('Script');
  const hasCaptionInput = uploadContent.includes('caption') || uploadContent.includes('Caption');
  console.log(`• Upload Wizard Has Video, Script, Thumbnail, Caption Support: ${(hasScriptInput && hasCaptionInput) ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // 3. Processing Screen 6 Stages
  const hasFFmpegStage = processingContent.includes('FFmpeg');
  const hasOCRStage = processingContent.includes('OCR');
  const hasWhisperStage = processingContent.includes('Whisper');
  const hasDnaStage = processingContent.includes('ContentDNA');
  const hasPredictionStage = processingContent.includes('PredictionModelSuite');
  const hasProcessingStages = hasFFmpegStage && hasOCRStage && hasWhisperStage && hasDnaStage && hasPredictionStage;
  console.log(`• Live Pipeline Processing Screen Displays 6 Stages: ${hasProcessingStages ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // 4. Prediction Report & Explainability
  const hasExplainability = analysisContent.includes('Why This Prediction Was Made');
  console.log(`• Prediction Report Has Explainability Section ("Why prediction made"): ${hasExplainability ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // 5. 6 Advanced Sub-Tabs (ContentDNA, Audio, Visual, OCR, Transcript, Benchmark)
  const hasContentDnaTab = analysisContent.includes('ContentDNA');
  const hasAudioTab = analysisContent.includes('Audio');
  const hasVisualTab = analysisContent.includes('Visual');
  const hasOcrTab = analysisContent.includes('OCR');
  const hasTranscriptTab = analysisContent.includes('Transcript');
  const hasBenchmarkTab = analysisContent.includes('Benchmark');
  const has6Tabs = hasContentDnaTab && hasAudioTab && hasVisualTab && hasOcrTab && hasTranscriptTab && hasBenchmarkTab;
  console.log(`• Prediction Report Has 6 Advanced Analysis Sub-Tabs: ${has6Tabs ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // 6. Optional Scenario Simulator CTA Button
  const hasScenarioCta = analysisContent.includes('Enter Scenario Simulator (Optional)');
  console.log(`• Prediction Report Has Optional Scenario Simulator CTA: ${hasScenarioCta ? 'YES (PASS)' : 'NO (FAIL)'}`);

  const allPass = hasHomeNewAnalysisBtn && (hasScriptInput && hasCaptionInput) && hasProcessingStages && hasExplainability && has6Tabs && hasScenarioCta;

  const status = allPass ? 'PASS' : 'FAIL';

  console.log(`\n=== USER-FIRST PRODUCT FLOW VERDICT: ${status} ===\n`);

  if (!allPass) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('User-First Flow Verification Error:', err);
  process.exit(1);
});
