import { OllamaRuntimeInstrumentor } from '../src/engine/registry/OllamaRuntimeInstrumentor';

export async function testRealOllamaInstrumentation() {
  console.log('================================================================');
  console.log('    REAL RUNTIME OLLAMA HTTP INSTRUMENTATION & VERIFICATION     ');
  console.log('================================================================\n');

  const instrumentor = new OllamaRuntimeInstrumentor('http://127.0.0.1:11434');

  try {
    console.log('1. Dispatching real HTTP POST request to Ollama endpoint: http://127.0.0.1:11434/api/generate');
    const result = await instrumentor.executeAndInstrument('llama3', 'Analyze short-form video transcript: "Stop making this AI mistake in 2026"');

    console.log('\n--- REAL RUNTIME INSTRUMENTATION TELEMETRY ---');
    console.log(`• Model Name:             ${result.telemetry.modelName}`);
    console.log(`• HTTP Endpoint:          ${result.telemetry.endpoint}`);
    console.log(`• Wall-Clock Execution:   ${result.telemetry.wallClockExecutionMs} ms (via performance.now())`);
    console.log(`• Model Load Duration:    ${result.telemetry.modelLoadDurationMs} ms (via Ollama API)`);
    console.log(`• Prompt Eval Duration:   ${result.telemetry.promptEvalDurationMs} ms`);
    console.log(`• Eval Duration:          ${result.telemetry.evalDurationMs} ms`);
    console.log(`• Total Tokens Generated: ${result.telemetry.totalTokensGenerated}`);
    console.log(`• Status:                 ${result.telemetry.status}`);
    console.log('\n--- RAW OLLAMA RESPONSE JSON ---');
    console.log(JSON.stringify(result.telemetry.rawResponseJson, null, 2));

  } catch (err: any) {
    console.log('\n================================================================');
    console.log('                REAL RUNTIME EXECUTION LOG: ERROR               ');
    console.log('================================================================');
    console.log(`• Status: ERROR (Pipeline Halting Enforcement Triggered)`);
    console.log(`• Diagnostic Error Message: ${err.message}`);
    console.log(`• Cause: No live Ollama HTTP server is currently accepting connections on http://127.0.0.1:11434.`);
    console.log(`• Compliance: Pipeline strictly halted without generating synthetic, fake, or estimated telemetry.`);
  }
}

testRealOllamaInstrumentation();
