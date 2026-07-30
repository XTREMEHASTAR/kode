import { z } from 'zod';

// ──────────────────────────────────────────────
// Script Validation Schemas
// ──────────────────────────────────────────────

export const createScriptSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(500).trim(),
  scriptText: z.string().min(1, 'Script text is required').max(50_000),
  contentType: z.string().max(100).default('Other'),
  hookScore: z.number().optional(),
  isFavorite: z.boolean().optional(),
  wordCount: z.number().optional(),
  characterCount: z.number().optional(),
  estimatedSpeakingTime: z.number().optional(),
  hookText: z.string().optional(),
  signals: z.any().optional(),
  analysisResult: z.any().optional(),
});

export const updateScriptSchema = z.object({
  title: z.string().min(1).max(500).trim().optional(),
  scriptText: z.string().min(1).max(50_000).optional(),
  isFavorite: z.boolean().optional(),
  contentType: z.string().max(100).optional(),
  hookScore: z.number().optional(),
  wordCount: z.number().optional(),
  characterCount: z.number().optional(),
  estimatedSpeakingTime: z.number().optional(),
  hookText: z.string().optional(),
  signals: z.any().optional(),
  analysisResult: z.any().optional(),
});

export const scriptIdParamSchema = z.object({
  id: z.string().min(1),
});

export const listScriptsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  favorite: z.enum(['true', 'false']).optional(),
  sort: z.enum(['createdAt', 'hookScore', 'title']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type CreateScriptInput = z.infer<typeof createScriptSchema>;
export type UpdateScriptInput = z.infer<typeof updateScriptSchema>;
export type ListScriptsQuery = z.infer<typeof listScriptsQuerySchema>;
