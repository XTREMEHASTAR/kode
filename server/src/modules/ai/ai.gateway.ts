import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

// ──────────────────────────────────────────────
// AI Gateway Client — Sole interface to LLM providers
//
// This module is the ONLY place that communicates
// with Ollama or Gemini. Nothing else in the
// application imports Ollama URLs or makes direct
// LLM API calls.
// ──────────────────────────────────────────────

export interface GatewayRequest {
  prompt: string;
  systemPrompt?: string;
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
  format?: 'json' | 'text';
}

export interface GatewayResponse {
  text: string;
  provider: string;
  model: string;
  durationMs: number;
  tokenCount?: number;
}

export interface ProviderHealth {
  name: string;
  available: boolean;
  model: string;
  latencyMs?: number;
  error?: string;
}

export type StreamCallback = (chunk: string, done: boolean) => void;

// ── Provider Abstraction ────────────────────

interface ProviderConfig {
  name: string;
  model: string;
  call: (req: GatewayRequest) => Promise<GatewayResponse>;
  stream: (req: GatewayRequest, onChunk: StreamCallback) => Promise<GatewayResponse>;
  healthCheck: () => Promise<ProviderHealth>;
}

// ── Gateway Client ──────────────────────────

export class AiGatewayClient {
  private providers: ProviderConfig[];
  private healthCache = new Map<string, { health: ProviderHealth; cachedAt: number }>();
  private static readonly HEALTH_CACHE_TTL = 30_000; // 30s

  constructor() {
    this.providers = this.buildProviderChain();
  }

  /**
   * Send a request through the gateway with automatic fallback and retries.
   */
  async generate(request: GatewayRequest): Promise<GatewayResponse> {
    const providers = this.getProviderOrder();
    const errors: Array<{ provider: string; error: unknown }> = [];

    for (const provider of providers) {
      for (let attempt = 0; attempt <= config.AI_MAX_RETRIES; attempt++) {
        try {
          const start = Date.now();
          const response = await this.withTimeout(
            provider.call(request),
            config.AI_REQUEST_TIMEOUT_MS,
          );
          response.durationMs = Date.now() - start;

          logger.info(
            {
              provider: provider.name,
              model: provider.model,
              durationMs: response.durationMs,
              attempt,
            },
            'AI request completed',
          );

          return response;
        } catch (error) {
          const isLastAttempt = attempt === config.AI_MAX_RETRIES;
          logger.warn(
            { provider: provider.name, attempt, err: error },
            `AI request failed${isLastAttempt ? ' (exhausted retries)' : ', retrying'}`,
          );
          errors.push({ provider: provider.name, error });

          if (!isLastAttempt) {
            // Exponential backoff: 500ms, 1000ms, 2000ms...
            await this.sleep(500 * Math.pow(2, attempt));
          }
        }
      }
    }

    logger.error({ errors: errors.map((e) => ({ provider: e.provider, error: String(e.error) })) }, 'All AI providers exhausted');
    throw new Error(
      `All AI providers failed. Tried: ${providers.map((p) => p.name).join(', ')}`,
    );
  }

  /**
   * Stream a response through the gateway.
   */
  async stream(
    request: GatewayRequest,
    onChunk: StreamCallback,
  ): Promise<GatewayResponse> {
    const providers = this.getProviderOrder();

    for (const provider of providers) {
      try {
        const start = Date.now();
        const response = await this.withTimeout(
          provider.stream({ ...request, stream: true }, onChunk),
          config.AI_STREAM_TIMEOUT_MS,
        );
        response.durationMs = Date.now() - start;

        logger.info(
          { provider: provider.name, model: provider.model, durationMs: response.durationMs },
          'AI stream completed',
        );

        return response;
      } catch (error) {
        logger.warn({ provider: provider.name, err: error }, 'AI stream failed, trying next provider');
        continue;
      }
    }

    throw new Error('All AI providers failed for streaming');
  }

  /**
   * Check health of all providers.
   */
  async checkHealth(): Promise<ProviderHealth[]> {
    const results = await Promise.allSettled(
      this.providers.map(async (p) => {
        // Check cache first
        const cached = this.healthCache.get(p.name);
        if (cached && Date.now() - cached.cachedAt < AiGatewayClient.HEALTH_CACHE_TTL) {
          return cached.health;
        }

        const health = await p.healthCheck();
        this.healthCache.set(p.name, { health, cachedAt: Date.now() });
        return health;
      }),
    );

    return results.map((r, i) =>
      r.status === 'fulfilled'
        ? r.value
        : {
            name: this.providers[i].name,
            available: false,
            model: this.providers[i].model,
            error: String(r.reason),
          },
    );
  }

  // ── Provider Implementations ──────────────────

  private buildProviderChain(): ProviderConfig[] {
    const providers: ProviderConfig[] = [];

    // Ollama primary
    providers.push({
      name: 'ollama',
      model: config.OLLAMA_MODEL,
      call: (req) => this.callOllama(req, config.OLLAMA_MODEL),
      stream: (req, cb) => this.streamOllama(req, config.OLLAMA_MODEL, cb),
      healthCheck: () => this.checkOllamaHealth(config.OLLAMA_MODEL),
    });

    // Ollama fallback model
    if (config.OLLAMA_FALLBACK_MODEL !== config.OLLAMA_MODEL) {
      providers.push({
        name: 'ollama-fallback',
        model: config.OLLAMA_FALLBACK_MODEL,
        call: (req) => this.callOllama(req, config.OLLAMA_FALLBACK_MODEL),
        stream: (req, cb) => this.streamOllama(req, config.OLLAMA_FALLBACK_MODEL, cb),
        healthCheck: () => this.checkOllamaHealth(config.OLLAMA_FALLBACK_MODEL),
      });
    }

    // Gemini (if configured)
    if (config.GEMINI_API_KEY) {
      providers.push({
        name: 'gemini',
        model: config.GEMINI_MODEL,
        call: (req) => this.callGemini(req),
        stream: (req, cb) => this.streamGemini(req, cb),
        healthCheck: () => this.checkGeminiHealth(),
      });
    }

    return providers;
  }

  private getProviderOrder(): ProviderConfig[] {
    if (config.AI_PROVIDER === 'gemini') {
      return this.providers.filter((p) => p.name === 'gemini');
    }
    if (config.AI_PROVIDER === 'ollama') {
      return this.providers.filter((p) => p.name.startsWith('ollama'));
    }
    // Auto: ollama → ollama-fallback → gemini
    return [...this.providers];
  }

  // ── Ollama ────────────────────────────────────

  private async callOllama(req: GatewayRequest, model: string): Promise<GatewayResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.AI_REQUEST_TIMEOUT_MS);

    try {
      const body: Record<string, unknown> = {
        model,
        prompt: req.prompt,
        stream: false,
        options: {
          temperature: req.temperature ?? 0.7,
          ...(req.maxTokens ? { num_predict: req.maxTokens } : {}),
        },
      };

      if (req.systemPrompt) {
        body.system = req.systemPrompt;
      }

      if (req.format === 'json') {
        body.format = 'json';
      }

      const response = await fetch(`${config.OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Ollama ${model} returned ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as {
        response: string;
        total_duration?: number;
        eval_count?: number;
      };

      return {
        text: data.response,
        provider: 'ollama',
        model,
        durationMs: data.total_duration ? Math.round(data.total_duration / 1_000_000) : 0,
        tokenCount: data.eval_count,
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  private async streamOllama(
    req: GatewayRequest,
    model: string,
    onChunk: StreamCallback,
  ): Promise<GatewayResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.AI_STREAM_TIMEOUT_MS);
    let fullText = '';
    let tokenCount = 0;

    try {
      const body: Record<string, unknown> = {
        model,
        prompt: req.prompt,
        stream: true,
        options: {
          temperature: req.temperature ?? 0.7,
          ...(req.maxTokens ? { num_predict: req.maxTokens } : {}),
        },
      };

      if (req.systemPrompt) body.system = req.systemPrompt;
      if (req.format === 'json') body.format = 'json';

      const response = await fetch(`${config.OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama stream ${model} returned ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body for streaming');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line) as {
              response: string;
              done: boolean;
              eval_count?: number;
            };

            if (parsed.response) {
              fullText += parsed.response;
              onChunk(parsed.response, false);
            }

            if (parsed.done) {
              tokenCount = parsed.eval_count || 0;
              onChunk('', true);
            }
          } catch {
            // Partial JSON line — skip
          }
        }
      }

      return {
        text: fullText,
        provider: 'ollama',
        model,
        durationMs: 0,
        tokenCount,
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  private async checkOllamaHealth(model: string): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      // Check if Ollama is running
      const tagsResponse = await fetch(`${config.OLLAMA_BASE_URL}/api/tags`, {
        signal: AbortSignal.timeout(5000),
      });

      if (!tagsResponse.ok) {
        return { name: 'ollama', available: false, model, error: `HTTP ${tagsResponse.status}` };
      }

      const tags = (await tagsResponse.json()) as {
        models: Array<{ name: string }>;
      };

      const modelAvailable = tags.models.some(
        (m) => m.name === model || m.name.startsWith(`${model}:`),
      );

      return {
        name: 'ollama',
        available: modelAvailable,
        model,
        latencyMs: Date.now() - start,
        error: modelAvailable ? undefined : `Model "${model}" not found in Ollama`,
      };
    } catch (error) {
      return {
        name: 'ollama',
        available: false,
        model,
        latencyMs: Date.now() - start,
        error: `Connection failed: ${String(error)}`,
      };
    }
  }

  // ── Gemini ────────────────────────────────────

  private async callGemini(req: GatewayRequest): Promise<GatewayResponse> {
    if (!config.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

    const start = Date.now();

    const response = await ai.models.generateContent({
      model: config.GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ text: req.prompt }] }],
      config: {
        systemInstruction: req.systemPrompt,
        temperature: req.temperature ?? 0.7,
        maxOutputTokens: req.maxTokens,
        responseMimeType: req.format === 'json' ? 'application/json' : undefined,
      },
    });

    const text = response.text ?? '';

    return {
      text,
      provider: 'gemini',
      model: config.GEMINI_MODEL,
      durationMs: Date.now() - start,
    };
  }

  private async streamGemini(
    req: GatewayRequest,
    onChunk: StreamCallback,
  ): Promise<GatewayResponse> {
    if (!config.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

    const start = Date.now();
    let fullText = '';

    const response = await ai.models.generateContentStream({
      model: config.GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ text: req.prompt }] }],
      config: {
        systemInstruction: req.systemPrompt,
        temperature: req.temperature ?? 0.7,
        maxOutputTokens: req.maxTokens,
      },
    });

    for await (const chunk of response) {
      const text = chunk.text ?? '';
      if (text) {
        fullText += text;
        onChunk(text, false);
      }
    }

    onChunk('', true);

    return {
      text: fullText,
      provider: 'gemini',
      model: config.GEMINI_MODEL,
      durationMs: Date.now() - start,
    };
  }

  private async checkGeminiHealth(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      if (!config.GEMINI_API_KEY) {
        return { name: 'gemini', available: false, model: config.GEMINI_MODEL, error: 'No API key' };
      }

      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

      // Minimal health check — list models
      await ai.models.get({ model: config.GEMINI_MODEL });

      return {
        name: 'gemini',
        available: true,
        model: config.GEMINI_MODEL,
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      return {
        name: 'gemini',
        available: false,
        model: config.GEMINI_MODEL,
        latencyMs: Date.now() - start,
        error: String(error),
      };
    }
  }

  // ── Utilities ─────────────────────────────────

  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`AI request timed out after ${ms}ms`)), ms),
      ),
    ]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
