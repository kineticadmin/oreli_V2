# ROADMAP — Oreli Mobile Redressement V1
**Dernière mise à jour** : 2026-03-31
**Objectif** : Flow 0→commande en < 60 sec, conforme au PRD `apps/mobile/prd.md`

---

## Etat de l'infrastructure (2026-03-31)

| Service | URL | Statut |
|---------|-----|--------|
| API Railway | https://oreliapi-production.up.railway.app | LIVE — health OK |
| Web Vercel | https://oreli-web.vercel.app | LIVE |
| Seller Console Vercel | https://oreli-seller-console.vercel.app | LIVE |
| Admin Vercel | https://oreli-admin.vercel.app | LIVE |
| DB Neon PostgreSQL | — | LIVE — seed OK |
| Redis Upstash | — | LIVE |

**Compte test mobile** : `test@oreli.ai` / `Test1234!`
**Compte test seller** : `seller@oreli.ai` / `Test1234!`

---

## Sprint 1 — Flux principal bout en bout

**Branche** : `feat/gift-flow-v1`
**Objectif** : Un utilisateur peut offrir un cadeau à un proche en < 60 sec via le flow structuré.

| # | Tâche | Fichiers concernés | Statut |
|---|-------|--------------------|--------|
| 1.1 | Gift Flow 5 écrans (Destinataire → Budget → Occasion → Date → Surprise) | `apps/mobile/app/gift-flow/` (nouveau dossier) | A FAIRE |
| 1.2 | Ecran résultats recommandations (shortlist 3-5 produits, score, justification) | `apps/mobile/app/gift-flow/results.tsx` | A FAIRE |
| 1.3 | Profil détaillé d'un proche (préférences, allergies, goûts) | `apps/mobile/app/relationship/[id].tsx` | A FAIRE |
| 1.4 | Formulaire ajout adresse dans l'app | `apps/mobile/app/(tabs)/profile.tsx` (section adresses) | A FAIRE |

**Endpoint API requis** :
- `POST /api/v1/gift/recommend` — EXISTE (testé OK)
- `GET /api/v1/relationships/:id` — A VERIFIER
- `PUT /api/v1/relationships/:id` — A VERIFIER
- `POST /api/v1/users/me/addresses` — EXISTE

---

## Sprint 2 — Qualité et rétention

**Branche** : `feat/retention-v1`

| # | Tâche | Fichiers concernés | Statut |
|---|-------|--------------------|--------|
| 2.1 | Gestion événements sur les proches (anniversaire + rappels) | `apps/mobile/app/relationship/[id].tsx` | A FAIRE |
| 2.2 | Recherche catalogue + filtres (catégorie, budget, délai) | `apps/mobile/app/(tabs)/gifts.tsx` | A FAIRE |
| 2.3 | Skeleton loading sur toutes les listes | Composants partagés | A FAIRE |
| 2.4 | Ecran confirmation amélioré (confetti, haptics, ETA) | `apps/mobile/app/confirmation.tsx` | A FAIRE |
| 2.5 | Historique cadeaux par proche | `apps/mobile/app/relationship/[id].tsx` | A FAIRE |

---

## Sprint 3 — Auth complète + RGPD

**Branche** : `feat/auth-complete`

| # | Tâche | Fichiers concernés | Statut |
|---|-------|--------------------|--------|
| 3.1 | Apple Sign-In | `apps/mobile/app/(auth)/login.tsx`, `signup.tsx` | A FAIRE |
| 3.2 | Google OAuth | idem | A FAIRE |
| 3.3 | Vérification email OTP | `apps/mobile/app/(auth)/verify-email.tsx` (nouveau) | A FAIRE |
| 3.4 | Biométrie checkout (Face ID) | `apps/mobile/app/checkout.tsx` | A FAIRE |
| 3.5 | RGPD export + suppression compte | `apps/mobile/app/(tabs)/profile.tsx` | A FAIRE |

---

## Corrections déjà appliquées (2026-03-31)

- [x] API Railway déployée et connectée (DB + Redis OK)
- [x] Seller console déployée et fonctionnelle (login + dashboard)
- [x] Web déployé sur Vercel
- [x] Mobile connectée à l'API Railway
- [x] Checkout : adresse hardcodée → adresse réelle depuis API
- [x] Checkout : bouton "Modifier" fonctionnel (→ profil)
- [x] Gifts : infinite scroll implémenté

---

## Règles de travail multi-agents

Voir section dédiée dans `CLAUDE.md`.
