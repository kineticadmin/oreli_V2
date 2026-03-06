import { describe, it, expect } from 'vitest';
import {
  issueAccessToken,
  verifyAccessToken,
} from './jwt.service.js';

// Les variables d'environnement sont définies dans vitest.setup.ts (avant tout import).

describe('issueAccessToken', () => {
  it('retourne un token JWT non vide', () => {
    const token = issueAccessToken('user-123', 'user');
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // Structure JWT : header.payload.signature
  });

  it('inclut le userId dans le payload (claim sub)', () => {
    const userId = 'user-abc-456';
    const token = issueAccessToken(userId, 'user');
    const payload = verifyAccessToken(token);

    expect(payload?.sub).toBe(userId);
  });

  it('inclut le role dans le payload', () => {
    const token = issueAccessToken('user-123', 'seller');
    const payload = verifyAccessToken(token);

    expect(payload?.role).toBe('seller');
  });

  it('inclut le sellerId quand fourni', () => {
    const token = issueAccessToken('user-123', 'seller', 'seller-789');
    const payload = verifyAccessToken(token);

    expect(payload?.sellerId).toBe('seller-789');
  });

  it('ne contient pas de sellerId pour un user standard', () => {
    const token = issueAccessToken('user-123', 'user');
    const payload = verifyAccessToken(token);

    expect(payload?.sellerId).toBeUndefined();
  });
});

describe('verifyAccessToken', () => {
  it('retourne le payload pour un token valide', () => {
    const token = issueAccessToken('user-123', 'user');
    const payload = verifyAccessToken(token);

    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe('user-123');
  });

  it('retourne null pour un token falsifié', () => {
    const tampered = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoYWNrZXIifQ.invalid_signature';
    const payload = verifyAccessToken(tampered);

    expect(payload).toBeNull();
  });

  it('retourne null pour une chaîne vide', () => {
    expect(verifyAccessToken('')).toBeNull();
  });

  it('retourne null pour un token malformé', () => {
    expect(verifyAccessToken('pas.un.jwt')).toBeNull();
  });
});
