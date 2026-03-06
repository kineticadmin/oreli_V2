import type { Context } from 'hono';
import { ZodError } from 'zod';

export interface ApiErrorResponse {
  code: string;
  message: string;
  field?: string | undefined;
}

export function handleError(error: Error, context: Context): Response {
  // Erreur de validation Zod → 422 avec le champ en erreur
  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    const errorResponse: ApiErrorResponse = {
      code: 'VALIDATION_ERROR',
      message: firstIssue?.message ?? 'Données invalides',
      field: firstIssue?.path.join('.'),
    };
    return context.json(errorResponse, 422);
  }

  // Erreurs métier connues (à étendre avec des classes d'erreur dédiées)
  if (error.name === 'NotFoundError') {
    return context.json({ code: 'NOT_FOUND', message: error.message }, 404);
  }

  if (error.name === 'ForbiddenError') {
    return context.json({ code: 'FORBIDDEN', message: error.message }, 403);
  }

  if (error.name === 'UnauthorizedError') {
    return context.json({ code: 'UNAUTHORIZED', message: error.message }, 401);
  }

  // Erreur inattendue → log complet côté serveur, message générique côté client
  console.error('[UnhandledError]', error);
  return context.json(
    { code: 'INTERNAL_ERROR', message: 'Une erreur interne est survenue' },
    500,
  );
}
