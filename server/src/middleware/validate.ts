import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ValidationError } from '../utils/apiError.js';

// ──────────────────────────────────────────────
// Zod Validation Middleware Factory
// ──────────────────────────────────────────────

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Generic validation middleware.
 *
 * Usage:
 *   router.post('/users', validate({ body: createUserSchema }), controller.create)
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: Record<string, string[]> = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        for (const [field, messages] of Object.entries(fieldErrors)) {
          errors[`body.${field}`] = messages ?? [];
        }
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        for (const [field, messages] of Object.entries(fieldErrors)) {
          errors[`query.${field}`] = messages ?? [];
        }
      } else {
        Object.assign(req.query as object, result.data);
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        for (const [field, messages] of Object.entries(fieldErrors)) {
          errors[`params.${field}`] = messages ?? [];
        }
      } else {
        req.params = result.data;
      }
    }

    if (Object.keys(errors).length > 0) {
      next(new ValidationError(errors));
      return;
    }

    next();
  };
}
