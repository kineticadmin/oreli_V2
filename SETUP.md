# Oreli — Setup des outils et clés externes

> Document de référence pour configurer tous les services externes avant de démarrer.
> Ordre recommandé : Infrastructure → Auth → Paiements → IA → Optionnel.

---

## Résumé rapide

| Service | Obligatoire pour démarrer | Coût | Temps d'activation |
|---------|--------------------------|------|--------------------|
| PostgreSQL (Neon) | Oui | Gratuit | 5 min |
| Redis (Upstash) | Oui | Gratuit | 5 min |
| Stripe | Oui | Gratuit (mode test) | 10 min |
| Gemini (Google AI Studio) | Oui | Gratuit | 5 min |
| JWT secrets | Oui | — (à générer) | 1 min |
| Google OAuth | Non (V1 optionnel) | Gratuit | 20 min |
| Apple Sign In | Non (V1 optionnel) | Compte dev payant | 30 min |
| Brevo (email) | Non (V1 optionnel) | Gratuit | 10 min |
| Cloudflare R2 (storage) | Non (V1 optionnel) | Gratuit | 10 min |

---

## 1. Infrastructure locale — PostgreSQL + Redis

La méthode la plus rapide pour démarrer est d'utiliser les services cloud gratuits (Neon + Upstash) plutôt que Docker local.

### Option A — Cloud (recommandé, 0€)

#### PostgreSQL — Neon

1. Aller sur **neon.tech** → créer un compte gratuit
2. Créer un projet `oreli-dev`
3. Dans l'onglet **Connection Details**, copier la connection string
4. Elle ressemble à :
   ```
   postgresql://alex:AbCdEf123@ep-cool-darkness-123456.eu-west-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Coller dans `apps/api/.env` :
   ```env
   DATABASE_URL="postgresql://..."
   ```

#### Redis — Upstash

1. Aller sur **upstash.com** → créer un compte gratuit
2. Créer une base Redis → choisir région `eu-west-1`
3. Dans l'onglet **Details**, copier le **Redis URL**
4. Il ressemble à :
   ```
   redis://default:AbCdEf123@eu1-sacred-bug-123.upstash.io:1234
   ```
5. Coller dans `apps/api/.env` :
   ```env
   REDIS_URL="redis://default:..."
   ```

### Option B — Docker local

```bash
# Depuis la racine du monorepo
docker-compose up -d
```

Le `docker-compose.yml` lance PostgreSQL (port 5432) et Redis (port 6379) avec les valeurs par défaut du `.env.example`.

---

## 2. JWT Secrets (générer localement)

Deux secrets à générer — ils ne quittent jamais ton serveur.

```bash
# Dans ton terminal, générer les deux secrets :
openssl rand -hex 64
# copier → JWT_ACCESS_SECRET

openssl rand -hex 64
# copier → JWT_REFRESH_SECRET
```

Dans `apps/api/.env` :
```env
JWT_ACCESS_SECRET="<valeur générée>"
JWT_REFRESH_SECRET="<valeur générée différente>"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="30d"
```

---

## 3. Admin API Key

Clé interne utilisée par le backoffice admin pour accéder aux routes protégées.

```bash
openssl rand -hex 32
```

Dans `apps/api/.env` :
```env
ADMIN_API_KEY="<valeur générée>"
```

Dans `apps/admin/.env.local` :
```env
NEXT_PUBLIC_ADMIN_KEY="<même valeur>"
```

---

## 4. Stripe — Paiements

### Étapes

1. Aller sur **dashboard.stripe.com** → créer un compte (gratuit, mode test)
2. Vérifier son adresse email si demandé
3. Dans le dashboard → **Developers** → **API keys**
4. Copier :
   - **Publishable key** : commence par `pk_test_...`
   - **Secret key** : commence par `sk_test_...`

### Webhook local (pour tester les événements Stripe en local)

1. Installer la Stripe CLI :
   ```bash
   brew install stripe/stripe-cli/stripe
   stripe login
   ```
2. Dans un terminal séparé, lancer le forwarding :
   ```bash
   stripe listen --forward-to localhost:8080/api/v1/webhooks/stripe
   ```
3. Stripe affiche un `whsec_...` — copier cette valeur

### Variables

Dans `apps/api/.env` :
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Dans `apps/mobile/.env` :
```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## 5. Gemini — Google AI Studio (IA conversation)

C'est la clé qui fait fonctionner la conversation Oreli.

### Étapes

1. Aller sur **aistudio.google.com**
2. Se connecter avec un compte Google
3. Cliquer sur **Get API key** → **Create API key**
4. Choisir "Create API key in new project" (ou un projet existant)
5. Copier la clé — elle commence par `AIza...`

### Limites du tier gratuit (suffisant pour V1)

| Limite | Valeur |
|--------|--------|
| Requêtes / minute | 15 |
| Requêtes / jour | 1 500 |
| Tokens / minute | 1 000 000 |
| Prix | 0€ |

Dans `apps/api/.env` :
```env
GEMINI_API_KEY="AIza..."
```

> Quand on passe en production, migrer vers **Vertex AI** (même modèle, data residency EU, pay-as-you-go). La migration est transparente — seule la clé change.

---

## 6. Google OAuth (optionnel — connexion "Continuer avec Google")

### Étapes

1. Aller sur **console.cloud.google.com**
2. Créer un projet `oreli` (ou utiliser le projet Gemini créé plus haut)
3. Menu → **APIs & Services** → **Credentials**
4. Cliquer **+ Create Credentials** → **OAuth client ID**
5. Application type : **Web application**
6. Authorized redirect URIs : ajouter
   - `http://localhost:8080/api/v1/auth/oauth/google/callback` (dev)
   - `https://api.oreli.ai/api/v1/auth/oauth/google/callback` (prod — à ajouter plus tard)
7. Copier **Client ID** et **Client Secret**

Dans `apps/api/.env` :
```env
GOOGLE_CLIENT_ID="....apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-..."
```

---

## 7. Apple Sign In (optionnel — connexion "Continuer avec Apple")

> Nécessite un compte **Apple Developer** ($99/an).

### Étapes

1. Aller sur **developer.apple.com** → **Certificates, IDs & Profiles**
2. Créer un **App ID** avec la capability "Sign In with Apple"
3. Créer un **Services ID** (utilisé pour l'OAuth web)
4. Configurer le domain et redirect URL dans le Services ID
5. Créer une **Key** avec "Sign In with Apple" activé → télécharger le `.p8`
6. Relever :
   - **Team ID** (10 caractères, en haut à droite du developer portal)
   - **Client ID** = le Bundle ID de ton app (ex: `com.oreli.app`)
   - **Key ID** + le fichier `.p8`

Dans `apps/api/.env` :
```env
APPLE_CLIENT_ID="com.oreli.app"
APPLE_TEAM_ID="XXXXXXXXXX"
```

> Le fichier `.p8` est chargé en runtime — stocker son chemin dans une variable ou son contenu dans un secret.

---

## 8. Resend — Emails transactionnels (optionnel)

Utilisé pour les emails de confirmation de commande, rappels anniversaire, etc.
Resend est préféré à Brevo pour ce use case : SDK TypeScript natif, API moderne, logs en temps réel, et intégration React Email pour les templates.

### Étapes (compte Kinetic existant)

1. Aller sur **resend.com** → se connecter avec le compte Kinetic
2. **Domains** → vérifier que `oreli.ai` est ajouté (ou l'ajouter et configurer les records DNS SPF/DKIM)
3. **API Keys** → **Create API Key**
   - Name : `oreli-dev`
   - Permission : Sending access
   - Domain : oreli.ai
4. Copier la clé : `re_...`

Dans `apps/api/.env` :
```env
RESEND_API_KEY="re_..."
EMAIL_FROM="hello@oreli.ai"
```

> Tier gratuit : 3 000 emails/mois, 100/jour. Suffisant pour la V1 complète.

---

## 9. Cloudflare R2 — Stockage images produits (optionnel)

Utilisé pour les images des produits et assets vendors.

### Étapes

1. Aller sur **dash.cloudflare.com** → **R2 Object Storage**
2. Créer un bucket `oreli-assets-dev`
3. Créer un bucket `oreli-private-dev`
4. **R2** → **Manage R2 API tokens** → **Create API token**
   - Permissions : Object Read & Write
   - Copier **Access Key ID** et **Secret Access Key**

Dans `apps/api/.env` :
```env
CLOUD_STORAGE_BUCKET_ASSETS="oreli-assets-dev"
CLOUD_STORAGE_BUCKET_PRIVATE="oreli-private-dev"
# + ajouter dans .env.example :
# R2_ACCOUNT_ID="..."
# R2_ACCESS_KEY_ID="..."
# R2_SECRET_ACCESS_KEY="..."
```

> Tier gratuit : 10 Go stockage + 1 million opérations/mois.

---

## 10. Variables d'environnement — Récapitulatif complet

### `apps/api/.env`

```env
# Infrastructure
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."

# API
PORT=8080
NODE_ENV=development
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001,exp://localhost:8081"

# Auth JWT (générer avec openssl rand -hex 64)
JWT_ACCESS_SECRET="<générer>"
JWT_REFRESH_SECRET="<générer>"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="30d"

# Admin (générer avec openssl rand -hex 32)
ADMIN_API_KEY="<générer>"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Gemini (OBLIGATOIRE pour le chat Oreli)
GEMINI_API_KEY="AIza..."

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID="....apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-..."

# Apple Sign In (optionnel)
APPLE_CLIENT_ID="com.oreli.app"
APPLE_TEAM_ID="XXXXXXXXXX"

# Resend email (optionnel)
RESEND_API_KEY="re_..."
EMAIL_FROM="hello@oreli.ai"

# Cloudflare R2 (optionnel)
CLOUD_STORAGE_BUCKET_ASSETS="oreli-assets-dev"
CLOUD_STORAGE_BUCKET_PRIVATE="oreli-private-dev"
```

### `apps/mobile/.env`

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### `apps/seller-console/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### `apps/admin/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ADMIN_KEY=<même valeur que ADMIN_API_KEY>
```

---

## 11. Démarrage après configuration

```bash
# 1. Appliquer le schema Prisma sur la base de données
cd apps/api && npx prisma migrate dev

# 2. Charger les données de test
pnpm seed
# Credentials créés : test@oreli.ai / Test1234!

# 3. Lancer l'API
pnpm api   # http://localhost:8080

# 4. Lancer l'app mobile
pnpm mobile   # Expo DevTools

# 5. Lancer le web acheteur
pnpm web   # http://localhost:3001

# 6. Lancer la console vendeur
pnpm seller   # http://localhost:3000

# 7. Lancer l'admin
pnpm admin   # http://localhost:3002
```

### Vérifier que l'API répond

```bash
curl http://localhost:8080/api/v1/health
# {"status":"ok","db":"connected","redis":"connected"}
```

---

## 12. Ordre minimal pour le premier test end-to-end

Si tu veux tester le chat Oreli le plus vite possible, voici le minimum :

1. **Neon** (5 min) → `DATABASE_URL`
2. **Upstash** (5 min) → `REDIS_URL`
3. **JWT secrets** (1 min) → `openssl rand -hex 64` × 2
4. **Admin key** (1 min) → `openssl rand -hex 32`
5. **Stripe** (10 min) → `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`
6. **Stripe publishable key** → `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
7. **Gemini** (5 min) → `GEMINI_API_KEY`
8. `npx prisma migrate dev` + `pnpm seed`
9. `pnpm api` + `pnpm mobile`

**Temps total estimé : 30 minutes.**
