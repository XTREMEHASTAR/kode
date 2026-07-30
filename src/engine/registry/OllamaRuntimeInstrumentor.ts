export interface OllamaRequestPayload {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: Record<string, any>;
}

export interface OllamaResponsePayload {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface RealRuntimeTelemetryLog {
  modelName: string;
  endpoint: string;
  requestPayload: OllamaRequestPayload;
  rawResponseJson?: OllamaResponsePayload;
  wallClockExecutionMs: number;
  modelLoadDurationMs: number;
  promptEvalDurationMs: number;
  evalDurationMs: number;
  totalTokensGenerated: number;
  status: 'SUCCESS' | 'ERROR';
  errorMessage?: string;
  timestamp: string;
}

export class OllamaRuntimeInstrumentor {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://127.0.0.1:11434') {
    this.baseUrl = baseUrl;
  }

  public async executeAndInstrument(
    modelName: string,
    prompt: string
  ): Promise<{ responseText: string; telemetry: RealRuntimeTelemetryLog }> {
    const endpoint = `${this.baseUrl}/api/generate`;
    const requestPayload: OllamaRequestPayload = {
      model: modelName,
      prompt,
      stream: false
    };

    const startTime = performance.now();
    const timestamp = new Date().toISOString();

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      const endTime = performance.now();
      const wallClockExecutionMs = Number((endTime - startTime).toFixed(2));

      if (!res.ok) {
        const errText = await res.text();
        const telemetry: RealRuntimeTelemetryLog = {
          modelName,
          endpoint,
          requestPayload,
          wallClockExecutionMs,
          modelLoadDurationMs: 0,
          promptEvalDurationMs: 0,
          evalDurationMs: 0,
          totalTokensGenerated: 0,
          status: 'ERROR',
          errorMessage: `Ollama HTTP Error ${res.status}: ${errText}`,
          timestamp
        };
        throw new Error(`[OLLAMA_INFERENCE_FAILURE] Model ${modelName} returned status ${res.status}: ${errText}`);
      }

      const rawResponseJson: OllamaResponsePayload = await res.json();

      const modelLoadDurationMs = rawResponseJson.load_duration ? Number((rawResponseJson.load_duration / 1e6).toFixed(2)) : 0;
      const promptEvalDurationMs = rawResponseJson.prompt_eval_duration ? Number((rawResponseJson.prompt_eval_duration / 1e6).toFixed(2)) : 0;
      const evalDurationMs = rawResponseJson.eval_duration ? Number((rawResponseJson.eval_duration / 1e6).toFixed(2)) : 0;
      const totalTokensGenerated = rawResponseJson.eval_count || 0;

      const telemetry: RealRuntimeTelemetryLog = {
        modelName,
        endpoint,
        requestPayload,
        rawResponseJson,
        wallClockExecutionMs,
        modelLoadDurationMs,
        promptEvalDurationMs,
        evalDurationMs,
        totalTokensGenerated,
        status: 'SUCCESS',
        timestamp
      };

      return {
        responseText: rawResponseJson.response,
        telemetry
      };
    } catch (err: any) {
      const endTime = performance.now();
      const wallClockExecutionMs = Number((endTime - startTime).toFixed(2));

      const telemetry: RealRuntimeTelemetryLog = {
        modelName,
        endpoint,
        requestPayload,
        wallClockExecutionMs,
        modelLoadDurationMs: 0,
        promptEvalDurationMs: 0,
        evalDurationMs: 0,
        totalTokensGenerated: 0,
        status: 'ERROR',
        errorMessage: err?.message || 'Connection Refused at http://127.0.0.1:11434',
        timestamp
      };

      console.error(`[RUNTIME_INSTRUMENTATION_ERROR] Real Ollama HTTP request failed: ${telemetry.errorMessage}`);
      throw new Error(`[RUNTIME_INFERENCE_FAILED] Pipeline halted. Reason: ${telemetry.errorMessage}`);
    }
  }
}
