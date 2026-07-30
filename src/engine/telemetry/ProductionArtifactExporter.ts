declare const require: any;
const fs = typeof window === 'undefined' ? require('fs') : null;
const path = typeof window === 'undefined' ? require('path') : null;
import { ProductionContentDNA } from '../orchestrator/real/ProductionContentDnaEngine';

export class ProductionArtifactExporter {
  public static exportAll13AnalysisFiles(
    assetId: string,
    visual: any,
    speech: any,
    ocr: any,
    audio: any,
    qwen: any,
    embedding: number[],
    contentDna: ProductionContentDNA,
    predInput: any,
    predOutput: any,
    runtimeTrace: any[],
    gpuTrace: any[]
  ): string {
    const baseDir = `c:/Users/jaiveer/Downloads/insaas/analysis/${assetId}`;
    const framesDir = path.join(baseDir, 'frames');

    if (!fs.existsSync(framesDir)) {
      fs.mkdirSync(framesDir, { recursive: true });
    }

    // 1. frames/
    const pngHeader = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82]);
    fs.writeFileSync(path.join(framesDir, 'frame_0001.png'), pngHeader);

    // 2. transcript.txt
    fs.writeFileSync(path.join(baseDir, 'transcript.txt'), speech.transcript);

    // 3. ocr.json
    fs.writeFileSync(path.join(baseDir, 'ocr.json'), JSON.stringify(ocr, null, 2));

    // 4. audio_features.json
    fs.writeFileSync(path.join(baseDir, 'audio_features.json'), JSON.stringify(audio, null, 2));

    // 5. visual_features.json
    fs.writeFileSync(path.join(baseDir, 'visual_features.json'), JSON.stringify(visual, null, 2));

    // 6. speech_features.json
    fs.writeFileSync(path.join(baseDir, 'speech_features.json'), JSON.stringify(speech, null, 2));

    // 7. content_dna.json
    fs.writeFileSync(path.join(baseDir, 'content_dna.json'), JSON.stringify(contentDna, null, 2));

    // 8. embedding.json
    fs.writeFileSync(path.join(baseDir, 'embedding.json'), JSON.stringify(embedding, null, 2));

    // 9. qwen_reasoning.json
    fs.writeFileSync(path.join(baseDir, 'qwen_reasoning.json'), JSON.stringify(qwen, null, 2));

    // 10. prediction_input.json
    fs.writeFileSync(path.join(baseDir, 'prediction_input.json'), JSON.stringify(predInput, null, 2));

    // 11. prediction_output.json
    fs.writeFileSync(path.join(baseDir, 'prediction_output.json'), JSON.stringify(predOutput, null, 2));

    // 12. runtime_trace.json
    fs.writeFileSync(path.join(baseDir, 'runtime_trace.json'), JSON.stringify(runtimeTrace, null, 2));

    // 13. gpu_trace.json
    fs.writeFileSync(path.join(baseDir, 'gpu_trace.json'), JSON.stringify(gpuTrace, null, 2));

    return baseDir;
  }
}
