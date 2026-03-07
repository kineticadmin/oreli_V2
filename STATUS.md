# Oreli Gift Magic — Point Global

> Dernière mise à jour : 2026-03-07
> Branche active : `develop`

---

## Vue d'ensemble

Oreli est une marketplace de gifting premium (Bruxelles → Benelux). Le monorepo contient 5 applications + 2 packages partagés. **Tout le code de base est écrit et typechecké. Aucune variable d'environnement externe n'est encore configurée** — c'est la prochaine étape.

---

## État par surface

### ✅ apps/api — Backend Hono.js (port 8080)

**Complet.** Toutes les routes V1 sont implémentées.

| Groupe | Endpoints |
|--------|-----------|
| Auth | `POST /auth/signup`, `/login`, `/refresh`, `/logout` |
| Catalog | `GET /catalog/products`, `/catalog/products/:id`, `/catalog/categories` |
| Gift | `POST /gift/recommend`, `GET /gift/home/curated` |
| Orders | `GET /orders`, `POST /orders`, `GET /orders/:id`, `GET /orders/:id/track` (SSE) |
| Users | `GET/PATCH /users/me`, `GET/POST /users/me/addresses`, `PATCH/DELETE /users/me/addresses/:id/default` |
| Relationships | `GET/POST /users/me/relationships`, `PATCH/DELETE /:id`, events CRUD |
| Seller | `GET /sellers/me`, `GET/PATCH /sellers/:id`, produits CRUD, stock, commandes (accept/reject/ship) |
| Admin | `GET /admin/stats`, `/admin/orders`, `/admin/sellers`, `PATCH /admin/sellers/:id/kyb` |
| Webhooks | `POST /webhooks/stripe` |
| Health | `GET /health` |

**Infrastructure :** Prisma + PostgreSQL + pgvector, BullMQ + Redis, Stripe PaymentSheet, SSE via Redis pub/sub.

**Manque pour démarrer :** variables d'environnement (voir section dédiée).

---

### ✅ apps/mobile — React Native Expo (Bare Workflow)

**Complet.** Toutes les routes et hooks branchés sur l'API réelle.

**Écrans :**
| Écran | Fichier | État |
|-------|---------|------|
| Onboarding | `app/onboarding.tsx` | ✅ |
| Login | `app/(auth)/login.tsx` | ✅ Branché API |
| Signup | `app/(auth)/signup.tsx` | ✅ Branché API |
| Home | `app/(tabs)/index.tsx` | ✅ heroSlides statiques (OK) |
| Catalogue | `app/(tabs)/gifts.tsx` | ✅ Branché API |
| Commandes | `app/(tabs)/orders.tsx` | ✅ Branché API |
| Proches | `app/(tabs)/close.tsx` | ✅ Branché API |
| Profil | `app/(tabs)/profile.tsx` | ✅ Branché API (`GET /users/me`) |
| Gift Flow | `app/gift-flow.tsx` | ✅ Branché recommandation réelle |
| Produit | `app/product/[id].tsx` | ✅ Branché API |
| Ajout proche | `app/add-close-one.tsx` | ✅ Branché API |
| Checkout | `app/checkout.tsx` | ✅ Stripe PaymentSheet |
| Confirmation | `app/confirmation.tsx` | ✅ Affiche vrai orderId |
| Détail commande | `app/order/[id].tsx` | ✅ SSE live status |

**Hooks :**
| Hook | Endpoint |
|------|----------|
| `useAuth` | `/auth/*` + SecureStore |
| `useCatalog` | `/catalog/products`, `/catalog/products/:id` |
| `useRecommendation` | `/gift/recommend` |
| `useOrders` | `GET /orders` |
| `useCreateOrder` | `POST /orders` |
| `useOrderTracking` | `GET /orders/:id/track` (SSE) |
| `useProfile` | `/users/me`, `/users/me/addresses` |
| `useRelationships` | `/users/me/relationships` |

**Manque pour démarrer :** `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` dans `.env`.

---

### ✅ apps/web — Next.js 14 (port 3001, acheteur desktop)

**Complet.** Expérience acheteur web complète.

| Page | Route | État |
|------|-------|------|
| Landing | `/` | ✅ |
| Auth | `/auth` | ✅ Login + Signup |
| Catalogue | `/catalog` | ✅ Filtres catégorie, last-minute, surprise |
| Produit | `/product/[id]` | ✅ Galerie, tags, badges |
| Checkout | `/checkout` | ✅ Adresse, date, message cadeau |
| Commandes | `/orders` | ✅ Liste avec statuts |
| Détail commande | `/orders/[id]` | ✅ Progress bar, tracking code |

**Manque pour démarrer :** `NEXT_PUBLIC_API_URL` dans `.env.local`.

---

### ✅ apps/seller-console — Next.js 14 (port 3000, espace vendeur)

**Complet.** Espace vendeur avec auth, catalogue, commandes et paramètres.

| Page | Route | État |
|------|-------|------|
| Login | `/login` | ✅ |
| Signup | `/signup` | ✅ |
| Onboarding | `/onboarding` | ✅ Création boutique |
| Dashboard | `/dashboard` | ✅ KPIs + commandes urgentes |
| Produits | `/dashboard/products` | ✅ Liste + édition stock inline |
| Nouveau produit | `/dashboard/products/new` | ✅ |
| Éditer produit | `/dashboard/products/[id]` | ✅ |
| Commandes | `/dashboard/orders` | ✅ Accept / Reject / Ship |
| Paramètres | `/dashboard/settings` | ✅ Profil + politique SLA |

**Manque pour démarrer :** `NEXT_PUBLIC_API_URL` dans `.env.local`.

---

### ✅ apps/admin — Next.js 14 (port 3002, backoffice)

**Complet.** Backoffice admin basique.

| Page | Route | État |
|------|-------|------|
| Accueil | `/` | ✅ Redirect dashboard |
| Dashboard | `/dashboard` | ✅ KPIs globaux + dernières commandes |
| Commandes | `/dashboard/orders` | ✅ Filtre statut, recherche |
| Vendeurs | `/dashboard/sellers` | ✅ KYB approve/reject |

**Manque pour démarrer :** `NEXT_PUBLIC_API_URL` + `NEXT_PUBLIC_ADMIN_KEY` dans `.env.local`.

---

### ✅ packages/design-tokens (`@oreli/design-tokens`)

Palettes dark/light, Typography, Radius, Spacing, Shadow. Source de vérité design.

### ✅ packages/shared-types (`@oreli/shared-types`)

Entités (User, Seller, Product, Order…), DTOs, types API.

---

## Variables d'environnement à configurer

C'est **la seule chose qui bloque le démarrage**. Aucune clé externe n'est encore ajoutée.

### apps/api — `.env`

```env
# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/oreli

# Redis
REDIS_URL=redis://localhost:6379

# JWT (générer avec: openssl rand -hex 64)
JWT_ACCESS_SECRET=<à générer>
JWT_REFRESH_SECRET=<à générer>

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin
ADMIN_API_KEY=<à générer>

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002

# Optionnel
PORT=8080
NODE_ENV=development
```

### apps/mobile — `.env`

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### apps/web — `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### apps/seller-console — `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### apps/admin — `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ADMIN_KEY=<même valeur que ADMIN_API_KEY dans l'API>
```

---

## Services externes à activer

| Service | Usage | Où s'inscrire |
|---------|-------|---------------|
| **Stripe** | Paiements (PaymentSheet + webhooks) | dashboard.stripe.com — mode test gratuit |
| **PostgreSQL** | Base de données principale | Docker local (`docker-compose up`) ou Neon |
| **Redis** | Cache + BullMQ + SSE pub/sub | Docker local ou Upstash |

> Vertex AI (recommandation vectorielle) et FCM (push notifications) sont en V2 — pas besoin pour démarrer.

---

## Démarrage local (une fois les env vars configurées)

```bash
# 1. Infrastructure
docker-compose up -d  # PostgreSQL + Redis

# 2. Base de données
cd apps/api && npx prisma migrate dev

# 3. API (port 8080)
pnpm api

# 4. Mobile
pnpm mobile

# 5. Seller console (port 3000)
pnpm seller

# 6. Web acheteur (port 3001)
pnpm web

# 7. Admin (port 3002)
pnpm admin
```

---

## Ce qui est hors scope V1 (ne pas coder)

- Input texte libre Gemini → V2
- Abonnement Oreli+ → V2
- Map tracking temps réel → V2
- Visual Search → V2
- Chat support in-app → V2
- Multi-pays / TVA automatisée → V3
- Corporate Gifting B2B → V3

---

## Qualité

- **TypeScript strict** : 0 erreur sur les 5 apps (`npx tsc --noEmit` partout)
- **Cursor pagination** partout (jamais offset)
- **SellerOwnershipGuard** sur toutes les routes `/sellers/:sellerId/*`
- **Zod validation** sur tous les inputs backend
- **expo-secure-store** pour les tokens mobile (jamais AsyncStorage)
- **Git strategy** : branche `develop`, feature branches courtes
