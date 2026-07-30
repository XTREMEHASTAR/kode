import { z } from 'zod';

// ──────────────────────────────────────────────
// AI Gateway — Validation Schemas
// ──────────────────────────────────────────────

export const analyzeSchema = z.object({
  scriptText: z.string().min(1, 'Script text is required').max(50_000),
  contentType: z.string().max(100).optional(),
  title: z.string().max(500).optional(),
});

export const rewriteSchema = z.object({
  scriptText: z.string().min(1, 'Script text is required').max(50_000),
  instructions: z.string().max(2000).optional(),
  contentType: z.string().max(100).optional(),
  tone: z.string().max(100).optional(),
});

export const improveSchema = z.object({
  text: z.string().max(50_000).optional(),
  script: z.string().max(50_000).optional(),
  scriptText: z.string().max(50_000).optional(),
  type: z.string().optional().default('general'),
  context: z.string().max(5000).optional(),
  contentType: z.string().max(100).optional(),
  mode: z.string().optional(),
  tone: z.string().optional(),
  originalHook: z.string().optional(),
  audience: z.any().optional(),
  goal: z.string().optional(),
  attemptIndex: z.number().optional(),
  diagnosticsFeedback: z.any().optional(),
});

export const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(5000),
  context: z
    .object({
      scriptText: z.string().max(50_000).optional(),
      analysisId: z.string().optional(),
    })
    .optional(),
  stream: z.boolean().optional().default(false),
});

// Type exports
export type AnalyzeInput = z.infer<typeof analyzeSchema>;
export type RewriteInput = z.infer<typeof rewriteSchema>;
export type ImproveInput = z.infer<typeof improveSchema>;
export type ChatInput = z.infer<typeof chatSchema>;
