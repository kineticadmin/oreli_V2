# Migration Monorepo — Oreli

Suivi en temps réel de la migration du prototype standalone vers le monorepo Turborepo.
Mettre à jour ce fichier après chaque step complété.

## Etat Global

| Step | Description | Status | Date |
|------|-------------|--------|------|
| M1 | Setup monorepo racine | DONE | 2026-03-06 |
| M2 | git mv prototype → apps/mobile/ | DONE | 2026-03-06 |
| M3 | Extraire design-tokens | DONE | 2026-03-06 |
| M4 | Extraire shared-types | DONE | 2026-03-06 |
| M5 | Vérifier structure apps/mobile/ | DONE | 2026-03-06 |

## STEP M1 — Setup Monorepo Racine

**Fichiers créés :**
- `turbo.json` — pipeline Turborepo (build/lint/typecheck/test/dev)
- `pnpm-workspace.yaml` — workspaces apps/* + packages/*
- `package.json` — workspace root avec scripts turbo
- `CLAUDE.md` — règles pour tous les agents Claude
- `MIGRATION.md` — ce fichier

**Fichiers existants conservés intacts :**
- Tout le prototype Expo (app/, components/, constants/, store/, data/, etc.)

---

## STEP M2 — git mv prototype → apps/mobile/

**Plan :**
1. Créer `apps/mobile/`
2. `git mv` de tous les fichiers du prototype dedans
3. Renommer le `package.json` du prototype : `"name": "@oreli/mobile"`
4. Mettre à jour les paths dans `tsconfig.json` (alias `@/` → `apps/mobile/`)

**Fichiers à déplacer :**
- `app/` → `apps/mobile/app/`
- `components/` → `apps/mobile/components/`
- `constants/` → `apps/mobile/constants/` (temporaire, puis extrait en M3)
- `store/` → `apps/mobile/store/`
- `data/` → `apps/mobile/data/`
- `assets/` → `apps/mobile/assets/`
- `scripts/` → `apps/mobile/scripts/`
- `app.json` → `apps/mobile/app.json`
- `babel.config.js` → `apps/mobile/babel.config.js`
- `tailwind.config.js` → `apps/mobile/tailwind.config.js`
- `global.css` → `apps/mobile/global.css`
- `tsconfig.json` → `apps/mobile/tsconfig.json`
- `package.json` (Expo) → `apps/mobile/package.json` (renommé @oreli/mobile)

---

## STEP M3 — Extraire packages/design-tokens

**Source :** `apps/mobile/constants/Colors.ts` + `apps/mobile/constants/Typography.ts`

**Cible :** `packages/design-tokens/src/`
- `colors.ts` — palettes dark/light + ThemeColors type
- `typography.ts` — scale typo + Radius + Spacing + Shadow
- `index.ts` — export central

**apps/mobile** mettra à jour ses imports :
```
import { useThemeColors } from '@/constants/Colors'
→ import { useThemeColors } from '@oreli/design-tokens'
```

---

## STEP M4 — Extraire packages/shared-types

**Source :** interfaces de `apps/mobile/data/mockData.ts`

**Cible :** `packages/shared-types/src/`
- `entities.ts` — User, Seller, Product, CloseOne (→ Relationship), Order, Occasion
- `dtos.ts` — GiftIntentDTO, CreateOrderDTO, RecommendationResult, ProductScore
- `api.ts` — ApiResponse<T>, ApiError, PaginationCursor
- `index.ts` — export central

---

## STEP M5 — Vérification Expo

**Depuis apps/mobile/ :**
```bash
cd apps/mobile
npx expo start
```

L'app doit démarrer sans erreur. Tous les imports `@/` doivent résoudre correctement.

---

## Après Migration — Prochaines Phases

Voir `CLAUDE.md` section "Etat de Migration" et `oreli.md` section 22 pour le guide complet.

**Phase 1 — Auth Backend** (après M5 validé)
**Phase 2 — Catalog & Seller Console**
**Phase 3 — Gift Flow & IA**
**Phase 4 — Orders & Checkout**
**Phase 5 — Complétion screens mobile**
