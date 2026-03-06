# CLAUDE.md — Oreli Gift Magic

Règles absolues pour tout agent Claude travaillant sur ce projet.
Lire entièrement avant toute action.

## Contexte Projet

Oreli.ai est une marketplace two-sided de gifting IA (Belgique → Benelux → Europe).
Document de référence complet : `oreli.md` à la racine.
Version actuelle : monorepo en construction — voir `MIGRATION.md` pour l'état d'avancement.

## Structure Monorepo Cible

```
oreli-gift-magic/           ← racine monorepo
├── apps/
│   ├── mobile/             ← App React Native (Expo Router v3, Bare Workflow)
│   ├── api/                ← Backend Hono.js (API mobile + vendeur)
│   ├── web/                ← Next.js 14 (acheteur web desktop)
│   ├── seller-console/     ← Next.js 14 + Refine.dev
│   └── admin/              ← Next.js 14 + Refine.dev
├── packages/
│   ├── design-tokens/      ← Couleurs, typo, spacing (source de vérité)
│   └── shared-types/       ← Types TypeScript partagés (User, Product, Order…)
├── specs/                  ← Specs SPEC-XXX.md (source de vérité fonctionnelle)
├── infra/                  ← Terraform, Dockerfiles
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Règles Constitutionnelles — Priorité Maximale

Ces deux règles s'appliquent avant toutes les autres, en toute circonstance.

### CONST-1. Gestion proactive du contexte et de la mémoire

Ne jamais attendre que le contexte soit presque épuisé pour agir.

**Règles concrètes :**
- Après chaque phase ou step significatif : mettre à jour `MEMORY.md` immédiatement
- Dès que le contexte dépasse ~50% d'utilisation : compacter les informations non essentielles
- Avant de démarrer un travail long : vérifier que `MEMORY.md` est à jour
- Si le contexte est serré : écrire un résumé dans `MEMORY.md` avant de continuer
- Toujours écrire dans `MEMORY.md` ce qu'un nouvel agent aurait besoin de savoir pour reprendre

**Signaux d'alerte :** beaucoup de fichiers lus, longue conversation, travail sur plusieurs surfaces en même temps → sauvegarder la mémoire maintenant.

### CONST-2. Code intelligent, simple et lisible

Tout code écrit dans ce projet doit respecter ces principes sans exception.

**Nommage sémantique obligatoire :**
- Les noms doivent exprimer l'intention, pas l'implémentation
- `eligibleProducts` pas `list`, `filteredArr` ou `res`
- `hasAvailableStock` pas `flag`, `bool` ou `b`
- `buyerUserId` pas `uid`, `id1` ou `userId2`
- `requestedDeliveryDate` pas `date`, `d` ou `dt`

**Simplicité obligatoire :**
- Une fonction = une responsabilité. Si elle fait deux choses, la diviser.
- Pas d'abstraction prématurée : 3 lignes répétées ne justifient pas un helper
- Pas de cleverness : le code le plus lisible prime sur le code le plus court
- Pas de commentaires sur ce que fait le code — seulement sur pourquoi

**Lisibilité obligatoire :**
- Extraire les conditions complexes dans des variables nommées avant de les utiliser
- Préférer les early returns aux if/else imbriqués
- Maximum 3 niveaux d'indentation par fonction
- Les magic numbers → constantes nommées (`MIN_SELLER_RELIABILITY_SCORE = 0.70`)

**Interdit :**
- Variables à une lettre sauf dans les boucles courtes (`i`, `j`)
- Abréviations cryptiques (`usr`, `prd`, `ord`, `cfg`, `val`, `tmp`, `res`, `err2`)
- Fonctions de plus de 40 lignes sans justification
- Tout `any` TypeScript

---

## Règles Absolues — Toujours Respecter

### 1. Jamais de code sans spec
Chaque feature doit avoir une spec `specs/SPEC-XXX-nom.md` validée avant implémentation.
Si la spec n'existe pas, la créer d'abord et attendre validation.

### 2. Versioning API obligatoire
Tous les endpoints backend : `/api/v1/` préfixé. Sans exception.
Ne jamais créer un endpoint sans ce préfixe.

### 3. Types partagés depuis packages/shared-types
Ne jamais redéfinir un type déjà existant dans `packages/shared-types`.
Importer depuis `@oreli/shared-types`, pas depuis les fichiers locaux.

### 4. Design tokens depuis packages/design-tokens
Ne jamais hardcoder des couleurs, tailles ou espacements.
Toujours importer depuis `@oreli/design-tokens`.

### 5. SellerOwnershipGuard sur toutes les routes /seller/*
Chaque route vendeur DOIT filtrer par `jwtSellerId`. Jamais par body/params.
Test obligatoire : seller A ne peut pas accéder aux données de seller B → 403.

### 6. Cursor-based pagination partout
Jamais de pagination offset (LIMIT/OFFSET). Toujours cursor (created_at + id).
Helper partagé dans `apps/api/src/lib/pagination.ts`.

### 7. Zod validation sur tous les inputs backend
Aucun body non-validé traité. Validation Zod avant tout traitement.

### 8. Jamais de secrets dans le code
Toutes les clés dans `.env` (jamais committées) ou Secret Manager GCP.
`.env.example` maintenu à jour avec toutes les variables.

### 9. Tests avant merge
CI doit passer (lint + typecheck + tests) avant tout merge sur main.
Coverage minimum 80% sur services core (recommendation, orders, auth).

### 10. Pas de Expo Managed Workflow
L'app mobile est en Bare Workflow. Ne jamais utiliser de modules incompatibles bare.
Stripe, Face ID, push notifications nécessitent bare.

## Stack Technique par Surface

### apps/mobile
- Expo SDK 54+ Bare Workflow + Expo Router v3 (file-based)
- React Native 0.81+ + React 19
- Zustand (state global) + TanStack Query v5 (server state)
- NativeWind v4 (Tailwind sur RN) + design-tokens
- expo-secure-store pour tokens (JAMAIS AsyncStorage)
- React Native Reanimated 3 pour animations

### apps/api
- Hono.js sur Node 20 (cold start < 200ms)
- Prisma ORM + PostgreSQL 15 + pgvector
- BullMQ + Redis (queues + cache + SSE pub/sub)
- Zod pour validation, JWT pour auth
- OpenTelemetry dès le setup (5 lignes dans main.ts)

### apps/web, apps/seller-console, apps/admin
- Next.js 14 App Router + Tailwind CSS
- TanStack Query v5 + React Hook Form + Zod
- Refine.dev pour seller-console et admin (CRUD généré)

### packages/design-tokens
- Source : `apps/mobile/constants/Colors.ts` + `Typography.ts` (extraits à la migration)
- Export TypeScript strict
- Consommé par toutes les surfaces

### packages/shared-types
- Source : interfaces de `apps/mobile/data/mockData.ts` (extraites à la migration)
- Types : User, Seller, Product, Order, CloseOne/Relationship, GiftIntentDTO, etc.
- Zod schemas dans `packages/shared-validators`

## V1 — Ce qui est dans le scope
- Auth mobile (email + Apple + Google OAuth)
- Gift Flow 9 étapes (structured form, pas texte libre)
- Rules Engine + pgvector (sans LLM Gemini — V2)
- Checkout Stripe PaymentSheet
- SSE tracking commandes (pas Firestore)
- Seller Console (onboarding + catalogue + commandes)
- Backoffice admin basique (orders + KYB + KPIs)
- Notifications push FCM

## V1 — Ce qui est HORS scope (ne pas coder)
- Input texte libre Gemini (V2)
- Abonnement Oreli+ (V2)
- Map tracking temps réel (V2)
- Visual Search (V2 — feature complexe)
- Chat support in-app automatisé (V2)
- Multi-pays / TVA automatisée (V3)
- Corporate Gifting B2B (V3)

## État de Migration (mettre à jour au fil du build)

| Step | Description | Status |
|------|-------------|--------|
| M1 | Setup monorepo racine (turbo + pnpm workspaces) | EN COURS |
| M2 | Déplacer prototype dans apps/mobile/ | A FAIRE |
| M3 | Extraire design-tokens | A FAIRE |
| M4 | Extraire shared-types | A FAIRE |
| M5 | Vérifier expo start depuis apps/mobile/ | A FAIRE |
| P0 | Phases backend (voir oreli.md section 22) | A FAIRE |

## Stratégie Git (règle absolue)

### Branches
- `main` — production stable uniquement. Merge depuis develop après validation.
- `develop` — intégration continue. Toujours dans un état deployable.
- `feat/xxx` — branches courtes (1 phase ou 1 feature). Jamais de longue vie.

### Workflow par phase
1. Créer `feat/nom-phase` depuis `develop`
2. Travailler sur la branche feature
3. À la fin de chaque phase réussie (typecheck + tests verts) :
   - Commit sur la feature branch
   - Merge dans `develop` (fast-forward si possible)
   - Supprimer la feature branch
   - Push `develop`
4. Merge `develop` → `main` uniquement sur décision explicite (release)

### Règles commit
- Format : `feat:`, `fix:`, `chore:`, `refactor:`, `test:`
- Message court et factuel (ce qui change, pas comment)
- Un commit par phase complète — pas de commits WIP sur develop
- Jamais de `--force` sur develop ou main

### Ce qu'on NE fait PAS (trop lourd pour solo dev)
- Pas de PR formelles entre feature et develop
- Pas de squash systématique
- Pas de tags sur chaque commit

## Conventions de Code

- TypeScript strict partout — aucun `any` (voir CONST-2)
- Nommage sémantique obligatoire (voir CONST-2)
- camelCase variables/fonctions, PascalCase composants/types, kebab-case fichiers
- Commits : `feat:`, `fix:`, `chore:`, `refactor:` — pas de merge sans CI vert
- Branches : `feat/nom-feature`, `fix/nom-bug`

## Contacts & Contexte Business

- Marché cible V1 : Bruxelles (premium last-minute gifting)
- Supply minimale : 25 vendeurs Bruxelles
- KPI critique V1 : match rate > 60%, time-to-match < 10s
- Seuil rentabilité : 3 000 commandes/mois
