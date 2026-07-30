import { DynamicOllamaRegistry, OllamaCapability } from '../DynamicOllamaRegistry';

/**
 * Executable Unit Test Suite for Dynamic Ollama Model Discovery Registry
 */
export function runDynamicOllamaRegistryTests(): { testName: string; passed: boolean; details?: string }[] {
  const results: { testName: string; passed: boolean; details?: string }[] = [];
  const registry = new DynamicOllamaRegistry('http://127.0.0.1:11434');

  // Test 1: Capability Unavailable Exception Halting when offline/empty
  try {
    let threwError = false;
    try {
      registry.selectModelForCapability(OllamaCapability.SPEECH_REASONING);
    } catch (err: any) {
      threwError = err.message.includes('[CAPABILITY_UNAVAILABLE_ERROR]');
    }
    results.push({ testName: 'Capability Unavailable Exception Halting when offline/empty', passed: threwError });
  } catch (err: any) {
    results.push({ testName: 'Capability Unavailable Exception Halting when offline/empty', passed: false, details: err?.message });
  }

  // Test 2: Internal Capability Mapper Inference
  try {
    const testMapper = (registry as any).inferCapabilitiesFromName('qwen2.5vl');
    const passed = testMapper.includes(OllamaCapability.VISION) && testMapper.includes(OllamaCapability.OCR_READING);
    results.push({ testName: 'Internal Capability Mapper Inference (qwen2.5vl -> VISION, OCR)', passed });
  } catch (err: any) {
    results.push({ testName: 'Internal Capability Mapper Inference (qwen2.5vl -> VISION, OCR)', passed: false, details: err?.message });
  }

  return results;
}
