import { v4 as uuidv4 } from 'uuid';
import { AiGatewayClient, type GatewayResponse, type StreamCallback } from './ai.gateway.js';
import { AiRequestQueue } from './ai.queue.js';
import { logger } from '../../utils/logger.js';

// ──────────────────────────────────────────────
// AI Service — Business Logic Layer
//
// Uses AiGatewayClient for all LLM communication.
// Routes through AiRequestQueue for concurrency.
// Exposes domain-specific operations.
// ──────────────────────────────────────────────

export interface AnalysisResult {
  hookScore: number;
  hookAnalysis: string;
  structureScore: number;
  emotionalTriggers: string[];
  callToAction: string;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  provider: string;
  model: string;
  durationMs: number;
}

export interface RewriteResult {
  rewrittenText: string;
  changes: string[];
  provider: string;
  model: string;
  durationMs: number;
}

export interface ImproveResult {
  improvedText: string;
  explanation: string;
  provider: string;
  model: string;
  durationMs: number;
}

export interface ChatResult {
  response: string;
  provider: string;
  model: string;
  durationMs: number;
}

export class AiService {
  private readonly gateway: AiGatewayClient;
  private readonly queue: AiRequestQueue;

  constructor() {
    this.gateway = new AiGatewayClient();
    this.queue = new AiRequestQueue();
  }

  // ── POST /api/ai/analyze ──────────────────────

  async analyze(input: {
    scriptText: string;
    contentType?: string;
    title?: string;
  }): Promise<AnalysisResult> {
    const taskId = `analyze-${uuidv4().slice(0, 8)}`;

    return this.queue.enqueue(taskId, async () => {
      const systemPrompt = `You are Kontagi Script Intelligence — an expert content analyst specializing in social media and content performance.
Analyze the provided script and return ONLY a JSON object with the following structure:
{
  "hookScore": <number 0-100>,
  "hookAnalysis": "<string>",
  "structureScore": <number 0-100>,
  "emotionalTriggers": ["<string>"],
  "callToAction": "<string>",
  "recommendations": ["<string>"],
  "strengths": ["<string>"],
  "weaknesses": ["<string>"]
}
Do not include any text outside the JSON object.`;

      const prompt = `${input.title ? `Title: ${input.title}\n` : ''}Content Type: ${input.contentType || 'General'}

Script:
${input.scriptText}`;

      const response = await this.gateway.generate({
        prompt,
        systemPrompt,
        format: 'json',
        temperature: 0.3,
      });

      return {
        ...this.parseJsonResponse<Omit<AnalysisResult, 'provider' | 'model' | 'durationMs'>>(
          response,
          {
            hookScore: 0,
            hookAnalysis: '',
            structureScore: 0,
            emotionalTriggers: [],
            callToAction: '',
            recommendations: [],
            strengths: [],
            weaknesses: [],
          },
        ),
        provider: response.provider,
        model: response.model,
        durationMs: response.durationMs,
      };
    });
  }

  // ── POST /api/ai/rewrite ──────────────────────

  async rewrite(input: {
    scriptText: string;
    instructions?: string;
    contentType?: string;
    tone?: string;
  }): Promise<RewriteResult> {
    const taskId = `rewrite-${uuidv4().slice(0, 8)}`;

    return this.queue.enqueue(taskId, async () => {
      const systemPrompt = `You are Kontagi AI Rewriter — an expert content editor.
Rewrite the provided script to improve its impact, clarity, and engagement.
Return ONLY a JSON object:
{
  "rewrittenText": "<the rewritten script>",
  "changes": ["<description of change 1>", "<description of change 2>"]
}
Do not include any text outside the JSON object.`;

      const parts = [`Script:\n${input.scriptText}`];
      if (input.instructions) parts.push(`Instructions: ${input.instructions}`);
      if (input.contentType) parts.push(`Content Type: ${input.contentType}`);
      if (input.tone) parts.push(`Tone: ${input.tone}`);

      const response = await this.gateway.generate({
        prompt: parts.join('\n\n'),
        systemPrompt,
        format: 'json',
        temperature: 0.7,
      });

      return {
        ...this.parseJsonResponse<Omit<RewriteResult, 'provider' | 'model' | 'durationMs'>>(
          response,
          { rewrittenText: response.text, changes: ['Full rewrite'] },
        ),
        provider: response.provider,
        model: response.model,
        durationMs: response.durationMs,
      };
    });
  }

  // ── POST /api/ai/improve ──────────────────────

  async improve(input: {
    text?: string;
    script?: string;
    scriptText?: string;
    type?: string;
    context?: string;
    contentType?: string;
  }): Promise<ImproveResult> {
    const taskId = `improve-${uuidv4().slice(0, 8)}`;
    const targetText = input.text || input.script || input.scriptText || '';
    const typeKey = input.type || 'general';

    return this.queue.enqueue(taskId, async () => {
      const typeLabels: Record<string, string> = {
        hook: 'opening hook',
        script: 'full script',
        caption: 'social media caption',
        general: 'text',
      };

      const systemPrompt = `You are Kontagi AI Improver — an expert at making ${typeLabels[typeKey] || 'content'} more engaging, clear, and impactful.
Return ONLY a JSON object:
{
  "improvedText": "<the improved version>",
  "explanation": "<why these changes improve it>"
}
Do not include any text outside the JSON object.`;

      const parts = [`${typeLabels[typeKey] || 'Text'} to improve:\n${targetText}`];
      if (input.context) parts.push(`Context: ${input.context}`);
      if (input.contentType) parts.push(`Content Type: ${input.contentType}`);

      const response = await this.gateway.generate({
        prompt: parts.join('\n\n'),
        systemPrompt,
        format: 'json',
        temperature: 0.6,
      });

      return {
        ...this.parseJsonResponse<Omit<ImproveResult, 'provider' | 'model' | 'durationMs'>>(
          response,
          { improvedText: response.text, explanation: 'AI-generated improvement' },
        ),
        provider: response.provider,
        model: response.model,
        durationMs: response.durationMs,
      };
    });
  }

  // ── POST /api/ai/chat ─────────────────────────

  async chat(input: {
    message: string;
    context?: { scriptText?: string; analysisId?: string };
    stream?: boolean;
    onChunk?: StreamCallback;
  }): Promise<ChatResult> {
    const taskId = `chat-${uuidv4().slice(0, 8)}`;

    return this.queue.enqueue(taskId, async () => {
      const systemPrompt = `You are Kontagi AI Copilot — a helpful assistant for content creators.
You help with script writing, content strategy, hook creation, and social media optimization.
Be concise, actionable, and friendly.${
        input.context?.scriptText
          ? `\n\nThe user is working on this script:\n${input.context.scriptText.slice(0, 3000)}`
          : ''
      }`;

      // Streaming path
      if (input.stream && input.onChunk) {
        const response = await this.gateway.stream(
          { prompt: input.message, systemPrompt, temperature: 0.7 },
          input.onChunk,
        );

        return {
          response: response.text,
          provider: response.provider,
          model: response.model,
          durationMs: response.durationMs,
        };
      }

      // Non-streaming path
      const response = await this.gateway.generate({
        prompt: input.message,
        systemPrompt,
        temperature: 0.7,
      });

      return {
        response: response.text,
        provider: response.provider,
        model: response.model,
        durationMs: response.durationMs,
      };
    });
  }

  // ── Health & Status ───────────────────────────

  async getHealth() {
    const [providers, queueStats] = await Promise.all([
      this.gateway.checkHealth(),
      Promise.resolve(this.queue.getStats()),
    ]);

    const anyAvailable = providers.some((p) => p.available);

    return {
      status: anyAvailable ? ('healthy' as const) : ('degraded' as const),
      providers,
      queue: queueStats,
    };
  }

  // ── Private Helpers ───────────────────────────

  private parseJsonResponse<T>(response: GatewayResponse, fallback: T): T {
    try {
      // Try to extract JSON from the response text
      let text = response.text.trim();

      // Handle markdown code fences
      const jsonMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        text = jsonMatch[1].trim();
      }

      const parsed = JSON.parse(text) as T;
      return parsed;
    } catch (error) {
      logger.warn(
        { provider: response.provider, textLength: response.text.length },
        'AI response was not valid JSON, using fallback',
      );
      return fallback;
    }
  }
}
