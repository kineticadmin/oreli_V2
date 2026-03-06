/**
 * Erreurs métier Oreli — chaque classe correspond à un code HTTP précis.
 * Le error-handler central (middleware/error-handler.ts) les intercepte par nom.
 */

export class NotFoundError extends Error {
  override name = 'NotFoundError';
  constructor(resource: string) {
    super(`${resource} introuvable`);
  }
}

export class ForbiddenError extends Error {
  override name = 'ForbiddenError';
  constructor(reason = 'Accès refusé') {
    super(reason);
  }
}

export class UnauthorizedError extends Error {
  override name = 'UnauthorizedError';
  constructor(reason = 'Authentification requise') {
    super(reason);
  }
}

export class ConflictError extends Error {
  override name = 'ConflictError';
  constructor(reason: string) {
    super(reason);
  }
}

export class ValidationError extends Error {
  override name = 'ValidationError';
  readonly field?: string | undefined;
  constructor(message: string, field?: string) {
    super(message);
    this.field = field;
  }
}
