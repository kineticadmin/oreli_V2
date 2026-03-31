# PRD — Parcours Utilisateur Oreli
**Document de référence pour Claude Code**
Version : 1.0 | Scope : App Mobile Acheteur (React Native Bare + Expo Router v3)

---

## Contexte et contraintes

- **Objectif UX global** : 0 → commande confirmée en **< 60 secondes**
- **Stack mobile** : React Native 0.73+ Bare Workflow, Expo SDK 51, Expo Router v3, Zustand, TanStack Query v5, NativeWind v4
- **Auth** : JWT 15 min + refresh tokens 30 jours (family rotation), expo-secure-store (jamais AsyncStorage)
- **Paiement** : @stripe/stripe-react-native (PaymentSheet), Stripe webhooks
- **Tracking temps réel** : SSE via Hono `streamSSE` + Redis pub/sub (pas Firestore)
- **IA V1** : Rules engine + pgvector similarity (zéro LLM) — latence < 100 ms
- **IA V2** : Gemini 1.5 Flash pour intent extraction + justifications — latence < 2 s
- **Design system** : "Warm Precision" — Playfair Display (émotion) + Inter (fonctionnel), tokens dans `packages/design-tokens/`

---

## Navigation globale

```
app/
├── (auth)/
│   ├── _layout.tsx          — Stack navigator auth
│   ├── onboarding.tsx       — 3 slides (1 seule fois)
│   ├── login.tsx
│   ├── signup.tsx
│   ├── verify-email.tsx     — OTP 6 chiffres
│   └── oauth-callback.tsx   — Deep link retour OAuth
└── (tabs)/
    ├── _layout.tsx           — Bottom tabs (5 tabs max)
    ├── index.tsx             — Home Dashboard
    ├── gift.tsx              — Gift Flow entry
    ├── orders.tsx            — Liste commandes
    ├── relationships.tsx     — Proches
    └── profile.tsx           — Profil & paramètres
```

**Zustand stores** : `AuthStore`, `GiftIntentStore`
**Bottom tab bar** : background `color-warm`, active `color-accent`, inactive `color-mid`

---

## Parcours 1 — Première connexion (Onboarding)

**Déclencheur** : Aucun token en expo-secure-store. Flag `onboarding_seen` absent en AsyncStorage.
**Objectif** : Amener l'utilisateur à créer un compte ou se connecter.

### Flux

```
Splash → (check token) → Onboarding 3 slides → Écran choix auth
```

### Étapes détaillées

#### 1.1 Splash Screen
- **Fichier** : `app/splash.tsx` (ou géré via `app.json`)
- **Actions** :
  1. Animation logo Oreli (Reanimated 3, fade-in 800 ms)
  2. Lire token depuis `expo-secure-store`
  3. Si token valide et non expiré → `router.replace('/(tabs)')` (0 interaction utilisateur)
  4. Si refresh token présent → tenter rotation silencieuse → si succès → Home
  5. Sinon → vérifier flag `onboarding_seen` en AsyncStorage
  6. Si flag absent → `router.replace('/(auth)/onboarding')`
  7. Si flag présent → `router.replace('/(auth)/login')`
- **Contrainte** : Délai max 1 500 ms avant redirect pour éviter flash d'écran blanc

#### 1.2 Onboarding (3 slides)
- **Fichier** : `app/(auth)/onboarding.tsx`
- **Comportement** : Affiché **une seule fois**. Écrire `onboarding_seen: true` en AsyncStorage dès l'affichage (pas à la fin).
- **Slides** :
  | Slide | Titre (Playfair Display 28sp) | Sous-titre (Inter 16sp) | Illustration |
  |-------|-------------------------------|-------------------------|--------------|
  | 1 | "Offrez l'artisanat bruxellois" | "Des cadeaux uniques, préparés avec soin par des artisans locaux" | Illustration produit artisanal |
  | 2 | "L'IA choisit pour vous" | "Décrivez votre proche, Oreli trouve le cadeau parfait en quelques secondes" | Illustration IA / recommandation |
  | 3 | "Livraison le jour même possible" | "Commandez avant 14h, livré aujourd'hui à Bruxelles" | Illustration livraison |
- **Navigation** : Swipe horizontal + dots indicateur. Slide 3 : CTA principal "Créer mon compte" + lien "J'ai déjà un compte"
- **Animations** : Transition slides avec `Reanimated 3`, fade-in staggered des éléments

#### 1.3 Écran choix d'authentification
- Trois options présentées avec égale importance :
  - **Apple Sign-In** (prioritaire sur iOS — affiché en premier)
  - **Google OAuth**
  - **Email + mot de passe** (bouton secondaire)
- Redirect vers `/(auth)/signup` ou `/(auth)/login` selon le choix

---

## Parcours 2 — Connexion (utilisateur existant)

**Déclencheur** : Token expiré ou session manquante. Flag `onboarding_seen` présent.
**Objectif** : Reconnexion en < 10 secondes.

### Flux

```
Splash → (check token) → [Auto-login si refresh valide] → Home
                       ↓ sinon
                    Login Screen → [Email/mdp | OAuth | Biométrie] → Home
```

### Étapes détaillées

#### 2.1 Auto-login (transparent)
- **Si access token valide** (exp > now) → redirect Home sans écran intermédiaire
- **Si access token expiré mais refresh token présent** :
  1. Appel `POST /api/v1/auth/refresh` avec le refresh token
  2. Si succès → stocker nouveaux tokens en expo-secure-store → redirect Home
  3. Si échec (token révoqué / famille compromise) → redirect Login avec message "Session expirée"

#### 2.2 Écran Login
- **Fichier** : `app/(auth)/login.tsx`
- **Composants** :
  - Titre Playfair Display 28sp : "Bon retour"
  - Champ email (keyboard: email-address, autoComplete: email)
  - Champ mot de passe (secureTextEntry, autoComplete: password)
  - CTA principal "Se connecter" (Inter SemiBold, color-primary background, 48dp height min)
  - Séparateur "ou" + boutons Apple / Google
  - Lien "Mot de passe oublié ?" + lien "Créer un compte"
- **Validation** : React Hook Form + Zod — erreur inline sous chaque champ
- **Sécurité** :
  - Rate limiting côté serveur : 5 tentatives/min par IP (Redis counter)
  - Après 3 échecs successifs → afficher CAPTCHA ou délai 30 s
  - Passwords bcrypt 12 rounds côté API

#### 2.3 Biométrie (si activée par l'utilisateur)
- **Lib** : `expo-local-authentication`
- **Déclenchement** : Automatique à l'ouverture de l'écran Login si biométrie activée en paramètres
- **Flow** :
  1. Vérifier `LocalAuthentication.isEnrolledAsync()`
  2. Si true et paramètre `biometry_enabled` en expo-secure-store → prompt biométrie immédiat
  3. Si validé → utiliser le refresh token stocké pour émettre de nouveaux tokens
  4. Animation cercle + scan subtil < 0.5 s
- **Fallback** : Bouton "Utiliser le mot de passe" toujours visible

#### 2.4 Post-connexion
- Stocker `accessToken` + `refreshToken` dans expo-secure-store
- Hydrate `AuthStore` Zustand : `{ userId, accessToken, isAuthenticated: true }`
- TanStack Query rehydrate le cache (commandes en cours, proches, événements)
- Notifications push en attente affichées
- Redirect `router.replace('/(tabs)')`

---

## Parcours 3 — Création de compte

**Déclencheur** : CTA "Créer mon compte" depuis Onboarding ou Login.

### Flux email

```
Sign Up Form → Vérification Email (OTP) → Profil Initial → Home
```

### Flux OAuth

```
OAuth Consent → Callback → [Upsert user] → Profil Initial → Home
```

### Étapes détaillées

#### 3.1 Formulaire Sign Up
- **Fichier** : `app/(auth)/signup.tsx`
- **Champs** :
  | Champ | Validation |
  |-------|------------|
  | Prénom | required, min 2 chars |
  | Nom | required, min 2 chars |
  | Email | format email valide, unicité vérifiée à la soumission |
  | Mot de passe | min 8 chars, 1 majuscule, 1 chiffre |
  | Confirmation | doit correspondre au mot de passe |
- **Validation** : React Hook Form + Zod — erreurs inline, pas de submit si invalide
- **Appel API** : `POST /api/v1/auth/signup` → reçoit `{ accessToken, refreshToken, userId }`
- **Stockage** : expo-secure-store (jamais AsyncStorage)

#### 3.2 Vérification email
- **Fichier** : `app/(auth)/verify-email.tsx`
- **OTP** : 6 chiffres, expiration 10 min
- **UI** :
  - 6 inputs individuels (focus auto sur suivant)
  - Countdown 60 s avant bouton "Renvoyer"
  - Bouton "Renvoyer" désactivé pendant le countdown
- **Appel API** : `POST /api/v1/auth/verify-email` avec `{ otp, email }`
- **Erreurs** : "Code incorrect" (3 tentatives max), "Code expiré" (redirect resend)
- **Skip** : Flux OAuth — la vérification email est effectuée par le provider OAuth

#### 3.3 OAuth (Google / Apple)
- **Google** : Redirect `GET /api/v1/auth/oauth/google` → consent → callback → upsert user en DB → tokens Oreli
- **Apple** : `POST /api/v1/auth/oauth/apple` avec `id_token` → vérification → upsert → tokens
- **Comportement** : Si email déjà existant → login automatique (pas d'erreur "compte existant")
- **Stockage** : `user_oauth_accounts` table (provider + providerId)

#### 3.4 Profil initial (Progressive Profiling)
- **Fichier** : Intégré dans `app/(tabs)/profile.tsx` ou modal post-inscription
- **Champs** (tous optionnels — non bloquants) :
  - Prénom d'affichage (pré-rempli depuis Sign Up)
  - Ville (pour localisation cadeaux)
  - Opt-in newsletter (checkbox RGPD, décochée par défaut)
- **Comportement** : Bouton "Compléter plus tard" toujours visible. Données sauvegardées à la volée.
- **Nudge** : Si aucun proche ajouté → afficher card "Ajoutez un premier proche pour commencer"

---

## Parcours 4 — Ajout et gestion des proches

**Localisation** : Tab "Proches" (`app/(tabs)/relationships.tsx`)
**Importance** : Donnée moat — plus le profil proche est riche, plus l'IA est précise.

### 4.1 Liste des proches
- **Endpoint** : `GET /api/v1/relationships` (auth requis, cursor pagination)
- **UI** :
  - Chaque proche : avatar initiales (circle 48dp) + prénom + type relation + badge prochain événement
  - Badge urgence coloré : rouge si événement < 3 jours, orange < 7 jours, vert sinon
  - Bouton flottant "+" en bas droite (FAB, color-accent)
  - Empty state si aucun proche : illustration + CTA "Ajouter mon premier proche"

### 4.2 Ajout d'un proche
- **Endpoint** : `POST /api/v1/relationships`
- **Formulaire** :
  | Champ | Type | Requis |
  |-------|------|--------|
  | Prénom | text | Oui |
  | Type relation | picker (conjoint, partenaire, ami·e, parent, enfant, frère/sœur, collègue, autre) | Oui |
  | Photo | image picker (optionnel) | Non |
- **Option** : "Importer depuis mes contacts" → demande permission `Contacts` → sélection → pré-remplissage
- **Post-création** : Redirect vers le profil du proche pour compléter les préférences

### 4.3 Profil d'un proche
- **Endpoint** : `GET /api/v1/relationships/:id` + `PUT /api/v1/relationships/:id`
- **Sections** :

  **Infos de base** : Prénom, relation, photo

  **Préférences** (stockées en JSONB `preferences_json`) :
  | Préférence | Type | Exemples |
  |------------|------|---------|
  | Goûts / centres d'intérêt | multi-select + texte libre | Chocolat, jardinage, musique jazz |
  | Allergies / restrictions | multi-select | Gluten, noix, végane |
  | Taille vêtements | select | XS / S / M / L / XL |
  | Couleurs préférées | color picker | Bleu marine, terracotta |
  | Style | multi-select | Minimaliste, bohème, classique |
  | Budget habituel reçu | range slider | 20–100 EUR |

  **Événements** : Liste des événements liés (voir section 4.4)

  **Historique cadeaux** : Timeline des cadeaux passés (voir section 4.5)

- **UX** : Sauvegarde optimiste (TanStack Query mutation), pas de bouton "Sauvegarder" explicite — auto-save par champ

### 4.4 Gestion des événements d'un proche
- **Endpoint** : `POST /api/v1/events`, `PUT /api/v1/events/:id`, `DELETE /api/v1/events/:id`
- **Types d'événements** : Anniversaire, Saint-Valentin, Fête des Mères/Pères, Noël, Mariage, Naissance, Retraite, Autre
- **Champs** :
  - Type + date + récurrence (yearly / one-shot)
  - Rappels configurables : J-14, J-7, J-2, J-1 (multi-select)
  - Canal rappel : push, email, les deux
- **Calendrier Gifting** : Vue mensuelle avec événements colorés par urgence. CTA "Préparer le cadeau" sur chaque événement → lance Gift Flow avec proche et occasion pré-sélectionnés.

### 4.5 Historique des cadeaux par proche
- **Endpoint** : `GET /api/v1/relationships/:id/gift-history`
- **Affichage** : Timeline verticale — photo produit + nom + date + prix + note satisfaction (1–5 étoiles)
- **Usage IA** : Alimente l'anti-repeat logic (−0.5 de score si déjà offert) et l'apprentissage des préférences
- **Notation post-livraison** : Push J+1 → modal de notation → mise à jour `reliability_score` vendeur

### 4.6 Suppression d'un proche
- **Confirmation** : Dialog "Supprimer [Prénom] ?" avec avertissement "L'historique de cadeaux sera conservé pour vos archives"
- **API** : Soft delete côté serveur — `relationship.status = 'archived'`
- **RGPD** : Les commandes passées restent anonymisées pour compliance comptable

---

## Parcours 5 — Gestion du profil utilisateur

**Localisation** : Tab "Profil" (`app/(tabs)/profile.tsx`)

### 5.1 Page profil principale
- **Sections** :
  - Avatar (initiales ou photo) + prénom + email
  - Stat cards : "X cadeaux offerts", "X proches", "Membre depuis [mois année]"
  - Liens vers les sous-sections

### 5.2 Informations personnelles
- **Endpoint** : `PUT /api/v1/users/me`
- **Champs éditables** : Prénom, nom, email (avec re-vérification OTP si changement), ville
- **Photo de profil** : expo-image-picker → upload Supabase Storage → URL mise à jour

### 5.3 Sécurité et biométrie
- **Changer le mot de passe** : Ancien mdp requis → nouveau mdp → confirmation
- **Biométrie** : Toggle "Activer Face ID / Touch ID pour le checkout" → stocke préférence en expo-secure-store
- **Sessions actives** : Liste des refresh tokens actifs avec possibilité de révoquer (logout d'un appareil spécifique)

### 5.4 Adresses de livraison
- **Endpoint** : `GET/POST/PUT/DELETE /api/v1/users/me/addresses`
- **Comportement** :
  - Liste des adresses enregistrées
  - Adresse par défaut marquée (étoile)
  - Formulaire ajout : rue, numéro, code postal, ville, pays, instructions livraison (optionnel)
  - **Important** : L'adresse est snapshottée à la commande — modifier une adresse n'affecte pas les commandes passées

### 5.5 Paramètres notifications
- **Endpoint** : `PUT /api/v1/users/me/notification-preferences`
- **Options** :
  - Push notifications (FCM) : on/off global + par type (rappels événements, statuts commande, promotions)
  - Email notifications : on/off + par type
  - Timing rappels : J-14, J-7, J-2, J-1 (multi-select par défaut)
  - Heure d'envoi préférée : picker 8h–20h

### 5.6 RGPD — Mes données
- **Export** : `GET /api/v1/users/me/export` → téléchargement ZIP contenant JSON de toutes les données (orders, proches, préférences, historique)
- **Suppression compte** : `DELETE /api/v1/users/me`
  - Confirmation en deux étapes : "Êtes-vous sûr ?" + saisie email pour confirmer
  - Anonymisation : email → `deleted_UUID@oreli.com`, nom → "Compte supprimé", suppression adresses et tokens
  - Conservation : orders anonymisés pour compliance comptable (obligation légale 7 ans)
  - Push notification envoyée : "Votre compte sera supprimé dans 14 jours — annuler ?"

---

## Parcours 6 — Commande depuis le catalogue (browsing libre)

**Déclencheur** : CTA "Se faire plaisir" en Home, ou recherche textuelle, ou Visual Search.
**Cas d'usage** : L'utilisateur sait ce qu'il veut chercher — pas besoin du gift flow IA.

### Flux

```
Home CTA → Catalogue / Recherche → Fiche Produit → Checkout → Confirmation
```

### Étapes détaillées

#### 6.1 Entrée catalogue
- **Depuis Home** : CTA "Se faire plaisir" (card pleine largeur, above the fold)
- **Depuis recherche** : Barre de recherche dans le header → FTS PostgreSQL GIN (`plainto_tsquery('french', q)`)
- **Depuis Visual Search** : Bouton caméra dans header → `expo-camera` → Gemini Vision → produits similaires

#### 6.2 Liste produits / Catalogue
- **Endpoint** : `GET /api/v1/products?cursor=...&category=...&minPrice=...&maxPrice=...&q=...`
- **UI** :
  - Grid 2 colonnes (cards produit)
  - Filtres : catégorie (chips horizontales), budget (range slider), délai livraison (checkboxes), vendeur rating (stars)
  - Skeleton loading pendant fetch
  - Pagination cursor (infinite scroll — `created_at + id`)
- **Card produit** :
  - Image ratio 4:3, full-bleed
  - Badge vendeur : avatar 24px + prénom + étoile rating
  - Badge urgence conditionnel : "Livraison demain" (color-warning), "Dernières pièces" (color-warning)
  - Titre : Playfair Display 16sp, max 2 lignes
  - Prix : Inter SemiBold 18sp + "frais inclus" caption

#### 6.3 Fiche produit
- **Endpoint** : `GET /api/v1/products/:id`
- **UI** :
  - Carousel photos (ratio 4:3, swipeable)
  - Bloc vendeur : avatar + nom boutique + rating + délai SLA affiché
  - Description complète, tags Oreli
  - Prix total tout inclus (livraison incluse dans le prix affiché)
  - ETA livraison estimé selon adresse par défaut
  - CTA "Choisir ce cadeau" (full-width, color-primary, 56dp height)
- **Snapshot** : À l'ajout au panier, un snapshot du produit est créé côté client (prix, infos vendeur) — immuable

#### 6.4 Checkout
- **Fichier** : Modal ou écran `checkout.tsx`
- **Récapitulatif** :
  - Photo produit (thumbnail) + nom + vendeur
  - Sous-total + frais de livraison + total (ou "tout inclus" si livraison gratuite)
- **Formulaire** :
  - Adresse livraison : liste des adresses sauvegardées + option "Nouvelle adresse"
  - Destinataire : "Pour moi" ou sélection d'un proche (pre-selected si venu du gift flow)
  - Message cadeau : textarea optionnel, max 200 chars
- **Paiement** : Stripe PaymentSheet — `initPaymentSheet()` + `presentPaymentSheet()`
- **Biométrie checkout** : Si activée → Face ID / Touch ID avant `presentPaymentSheet()`
- **Sécurité stock** : `SELECT FOR UPDATE` côté API lors de la réservation stock (évite race condition)

#### 6.5 Confirmation
- **Déclenchement** : Webhook `payment_intent.succeeded` reçu → order `status = paid` → push confirmation
- **UI** :
  - Animation confetti doré + coche verte (Reanimated 3, 1.5 s)
  - Haptics : `ImpactFeedbackStyle.Heavy`
  - ETA livraison précis affiché
  - CTA "Suivre ma commande" → deep link vers détail commande
  - CTA "Partager" (optionnel) → share sheet natif
- **Post-confirmation** :
  - Historique proche mis à jour (si destinataire = proche)
  - Log ML async : BullMQ job → BigQuery (fire and forget)
  - Push notification vendeur : "Nouvelle commande à préparer"

---

## Parcours 7 — Commande via proche (Gift Flow IA)

**Déclencheur** : CTA "Faire plaisir" en Home, ou événement dans le calendrier, ou fiche d'un proche.
**Objectif** : Collecte du `GiftIntentDTO` en 4 écrans → recommandation IA → checkout.

### Flux

```
CTA → [1] Destinataire → [2] Budget → [3] Occasion → [4] Date → [5] Surprise
    → [6] Recommandations IA → [7] Fiche produit → [8] Checkout → [9] Confirmation
```

### GiftIntentDTO (Zustand GiftIntentStore)

```typescript
interface GiftIntentDTO {
  relationship_id: string;      // UUID du proche sélectionné
  budget_min_cents: number;     // ex: 3000 = 30 EUR
  budget_max_cents: number;     // ex: 7000 = 70 EUR
  occasion: OccasionType;       // 'birthday' | 'anniversary' | 'birth' | etc.
  requested_delivery_date: string; // ISO date
  surprise_mode: 'total' | 'controlled' | 'manual';
  delivery_address_id: string;
}
```

### Étapes détaillées

#### 7.1 Entrée Gift Flow
- Depuis Home : CTA "Faire plaisir à un proche" (card pleine largeur)
- Depuis événement : CTA "Préparer le cadeau" → `relationship_id` + `occasion` pré-remplis
- Depuis fiche proche : bouton "Offrir un cadeau" → `relationship_id` pré-rempli
- Initialise `GiftIntentStore` Zustand (reset des valeurs précédentes)

#### 7.2 Écran 1 — Destinataire
- **Affichage** : Liste des proches avec avatar + prénom + prochain événement
- **UX** : Sélection 1 tap → animation de sélection → next automatique
- **Bouton "+"** : Ajout rapide d'un nouveau proche (formulaire minimal, 2 champs) → revient sur cette étape
- **Pré-sélection** : Si venu depuis un événement ou une fiche proche → proche pré-sélectionné, skip auto possible
- **Store** : Met à jour `GiftIntentStore.relationship_id`

#### 7.3 Écran 2 — Budget
- **Slider** : Min 10 EUR, Max 500 EUR, pas 5 EUR
- **Suggestions rapides** : Chips "30 €", "50 €", "75 €", "100 €" → preset les deux curseurs
- **Affichage** : "De [min] à [max] EUR" + zone de confort IA estimée (sous-texte small)
- **Store** : Met à jour `budget_min_cents` et `budget_max_cents`

#### 7.4 Écran 3 — Occasion
- **Grille** : 8 icônes illustrées (2 colonnes × 4 rangées)

  | Occasion | OccasionType |
  |----------|-------------|
  | Anniversaire | `birthday` |
  | Saint-Valentin | `valentine` |
  | Naissance | `birth` |
  | Mariage | `wedding` |
  | Fête des Mères/Pères | `parent_day` |
  | Retraite | `retirement` |
  | Remerciement | `thank_you` |
  | Sans occasion particulière | `no_occasion` |

- **Input optionnel** : Texte libre sous la grille pour préciser (ex: "promotion au travail")
- **Sélection** : 1 tap max, surbrillance immediate
- **Store** : Met à jour `occasion`

#### 7.5 Écran 4 — Date de livraison
- **Raccourcis** : 3 boutons "Aujourd'hui", "Demain", "Choisir une date"
- **DatePicker** : Natif iOS/Android si "Choisir une date" — dates passées désactivées
- **Filtre SLA temps réel** : La date choisie est transmise immédiatement au moteur de filtrage SQL — seuls les vendeurs capables de livrer à cette date apparaîtront dans la shortlist
- **Store** : Met à jour `requested_delivery_date`

#### 7.6 Écran 5 — Niveau de surprise
- **3 choix illustrés** :

  | Mode | Label | Description | surprise_mode |
  |------|-------|-------------|---------------|
  | Totale | "Laisse faire Oreli" | L'IA choisit seule (seuil confiance 65/100 requis) | `total` |
  | Guidée | "Je choisis parmi ses suggestions" | Shortlist 3–5 avec justifications | `controlled` |
  | Manuel | "Je parcours le catalogue" | Catalogue filtré par budget/date/occasion | `manual` |

- **Mode Surprise Totale** : Si le score max des candidats < 65/100 → `InsufficientConfidenceError` → proposer automatiquement mode "Guidée" à la place

#### 7.7 Recommandations IA
- **Endpoint** : `POST /api/v1/gift/recommend` avec le `GiftIntentDTO`
- **Pipeline V1** (zéro LLM, < 100 ms) :
  1. Hard filters SQL : budget, stock, SLA, zone livraison, seller reliability ≥ 0.70
  2. FTS PostgreSQL sur occasion + préférences du proche
  3. pgvector similarity search (opérateur `<=>`, ivfflat index)
  4. Scoring pondéré : `budget_match` + `occasion_match` + `relationship_match` + `vector_similarity` + `seller_reliability` + `popularity` + `anti_repeat`
  5. Retourne top 3–5 produits avec scores
- **Pipeline V2** (+ Gemini, < 2 s) :
  - Intent extraction Gemini si input texte libre
  - Justifications générées par Gemini Flash (< 800 ms, parallèle, fallback template si timeout)
- **UI Shortlist** :
  - Cards produits avec score affinité (barre gradient animée 4px à l'apparition)
  - Justification IA en Inter Italic 13sp, couleur `color-mid`, max 10 mots
  - Badge vendeur sur chaque card
  - Swipe horizontal ou grille selon le mode

#### 7.8 Fiche produit recommandé
- **Même composant** que le catalogue mais avec :
  - Justification IA mise en avant (bloc dédiée au-dessus de la description)
  - Score affinité affiché (optionnel selon A/B test)
- **CTA** : "Choisir ce cadeau" → snapshot produit côté client

#### 7.9 Checkout
- Identique au Parcours 6, §6.4
- **Différence** : Le destinataire est pré-sélectionné (proche du gift flow)
- Le message cadeau suggère un pré-texte selon l'occasion

#### 7.10 Confirmation
- Identique au Parcours 6, §6.5
- **Supplémentaire** :
  - Historique cadeaux du proche mis à jour
  - Log ML BullMQ → BigQuery (relationship_id, product_id, scores, outcome)

---

## Parcours 8 — Discussion avec Oreli IA (V2)

**Déclencheur** : Bouton "Demander à Oreli" ou accès direct à l'interface conversationnelle.
**Scope** : Feature V2 — non incluse en V1 MVP.

### Flux

```
Input texte libre → Extraction intent (Gemini) → [Clarification si besoin]
                 → Recommandations → Sélection → Checkout
```

### Étapes détaillées

#### 8.1 Input texte libre
- **Placeholder** : "Décrivez votre proche et l'occasion… ex: 'Cadeau pour ma femme, anniversaire vendredi, environ 60 euros, elle adore le chocolat'"
- **Envoi** : Bouton envoyer ou touche return
- **Contexte injecté dans le prompt** : Liste des proches de l'utilisateur (prénom + relation) + date actuelle

#### 8.2 Extraction d'intention (Gemini 1.5 Flash)
- **Prompt système** : Extraire `GiftIntentDTO` depuis le message en JSON strict
- **Response schema** : `responseMimeType: 'application/json'` + `responseSchema: GiftIntentJSONSchema`
- **Validation** : Zod côté API avant traitement
- **Mapping automatique** : Si le message mentionne "ma femme" → match avec le proche correspondant dans la liste

#### 8.3 Clarification (si champ manquant)
- Si `budget` absent → "Quel budget avez-vous en tête ?"
- Si `requested_delivery_date` absent → "Pour quand souhaitez-vous livrer ?"
- **Maximum 2 questions** — jamais de sur-questionnement
- Format : Réponse conversationnelle courte + chips de réponses rapides

#### 8.4 Recommandations présentées
- Même pipeline que Gift Flow (§7.7)
- Justifications Gemini Flash (< 800 ms, fallback template)
- Affichage dans l'interface conversationnelle (cards inline dans la conversation)

#### 8.5 Sélection et checkout
- Tap sur une card produit → transition vers fiche produit standard
- Checkout identique au Parcours 6, §6.4

---

## Parcours 9 — Suivi de commande

**Localisation** : Tab "Commandes" (`app/(tabs)/orders.tsx`) + Détail commande
**Technologie** : SSE (Server-Sent Events) via Hono `streamSSE` + Redis pub/sub

### Statuts de commande (séquence)

```
pending → paid → accepted → preparing → shipped → delivered
                    ↓
                 cancelled (si refus vendeur ou échec paiement)
```

### Étapes détaillées

#### 9.1 Tab Commandes — Liste
- **Endpoint** : `GET /api/v1/orders?cursor=...` (auth requis, cursor pagination)
- **Card commande** :
  - Photo produit (thumbnail 60px)
  - Nom produit + nom boutique
  - Badge statut coloré :
    | Statut | Couleur |
    |--------|---------|
    | En cours | color-info |
    | Préparation | color-warning |
    | Livré | color-success |
    | Annulé | color-error |
  - ETA livraison
  - Destinataire (prénom du proche ou "Pour moi")
- **Filtres** : Tabs "En cours" / "Livrés" / "Annulés"
- **Empty state** : Illustration + CTA "Faire mon premier cadeau"

#### 9.2 Détail commande
- **Endpoint** : `GET /api/v1/orders/:id` (auth requis, vérifie ownership)
- **Connexion SSE** : Ouverte automatiquement dès l'affichage via hook `useOrderTracking(orderId)`
- **UI** :
  - Photo produit + nom + prix
  - Vendeur : avatar + nom boutique + lien fiche
  - Timeline des statuts (vertical, checkmark par statut atteint)
  - ETA livraison estimé (mis à jour par SSE)
  - Adresse de livraison (snapshot immuable)
  - Message cadeau (si renseigné)

#### 9.3 Tracking Live (SSE)
- **Endpoint** : `GET /api/v1/orders/:id/track` (auth requis, SSE stream)
- **Comportement serveur** :
  1. Vérifier ownership (`order.buyer_user_id === userId`) — 403 sinon
  2. Utiliser `streamSSE` Hono
  3. Envoyer statut initial immédiatement (évite flash de chargement)
  4. Subscribe Redis channel `order:{id}:status` via `ioredis.subscribe`
  5. Sur message Redis → `write` SSE event
  6. `onAbort` → `unsubscribe` Redis (cleanup obligatoire)
- **Comportement client** (hook `useOrderTracking`) :
  - `EventSource` natif ou polyfill
  - Reconnexion automatique si perte connexion (backoff exponentiel 1s → 2s → 4s → max 30s)
  - Mise à jour optimiste du cache TanStack Query à chaque SSE event
- **Event format** :
  ```json
  { "status": "preparing", "eta": "2024-01-15T14:30:00Z", "message": "Votre commande est en cours de préparation" }
  ```

#### 9.4 Notifications push
- **Déclencheur** : Chaque changement de statut → BullMQ worker notification → FCM push
- **Si app au premier plan** : Toast slide-in bas droite (Reanimated 3), 3 s auto-dismiss, couleur selon statut
- **Si app en arrière-plan** : Push notification système + badge sur tab "Commandes"
- **Haptics** :
  - Livraison confirmée : `NotificationFeedbackType.Success`
  - Annulation : `NotificationFeedbackType.Error`

#### 9.5 Preuve de livraison
- **Disponible** : Quand `status = 'delivered'`
- **Affichage** : Photo uploadée par le vendeur (Cloud Storage), visible dans le détail commande
- **Lien** : URL signée temporaire (24h) générée par Supabase Storage

#### 9.6 Support — Ticket
- **Accès** : Bouton "Signaler un problème" dans le détail commande
- **Formulaire** :
  - Type de problème : dropdown (Non livré, Produit endommagé, Mauvais produit, Autre)
  - Description : textarea
  - Photo : expo-image-picker (optionnel, max 3 photos)
- **API** : `POST /api/v1/orders/:id/support-tickets`
- **V1** : Traitement manuel côté équipe Oreli (email + WhatsApp). SLA réponse : 24h.
- **V2** : Chat in-app automatisé (Crisp intégré)

#### 9.7 Notation post-livraison
- **Déclencheur** : Push J+1 après `status = 'delivered'`
- **UI** : Bottom sheet modal avec :
  - 5 étoiles (TapGestureHandler)
  - Texte libre optionnel (textarea, max 200 chars)
  - CTA "Envoyer" + lien "Passer"
- **API** : `POST /api/v1/orders/:id/review`
- **Impact** : Met à jour `seller.reliability_score` + historique cadeaux du proche

---

## Règles transversales pour Claude Code

### Sécurité (non-négociable)

- Zéro `any` TypeScript — strict mode partout
- `expo-secure-store` exclusivement pour tokens (jamais `AsyncStorage`)
- `SellerOwnershipGuard` sur toutes les routes `/seller/*`
- `SELECT FOR UPDATE` dans `$transaction` pour toute opération stock
- Rate limiting : 5 tentatives login/min par IP (Redis counter)
- Passwords : bcrypt 12 rounds
- JWT : access token 15 min, refresh token 30 jours, family rotation (révocation famille si réutilisation)
- Webhooks Stripe : validation signature `stripe.webhooks.constructEvent` obligatoire

### Performance

- Cursor pagination (`created_at + id`) sur **tous** les endpoints liste — jamais `LIMIT/OFFSET`
- Tous les endpoints : `/api/v1/` prefix
- SSE : cleanup Redis subscribe dans `onAbort` obligatoire
- TanStack Query : `staleTime` 5 min pour données catalogue, 0 pour commandes/statuts

### Design system

```typescript
// packages/design-tokens/src/tokens.ts
export const tokens = {
  colors: {
    primary: '#1A1A2E',   // Texte principal, CTAs majeurs
    accent: '#C9A84C',    // Highlights, badges premium
    warm: '#F5F0E8',      // Background principal, surfaces
    sand: '#E8E2D8',      // Borders, input backgrounds
    mid: '#6B6B6B',       // Texte secondaire, labels
    success: '#1E7A4A',
    warning: '#D97706',
    error: '#C0392B',
    info: '#2563EB',
  },
  typography: {
    display: { family: 'Playfair Display', weight: 700 },   // Émotionnel
    heading: { family: 'Playfair Display', weight: 400, style: 'italic' },
    body: { family: 'Inter', weight: 400 },
    label: { family: 'Inter', weight: 600 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius: { sm: 4, md: 8, lg: 12, xl: 16 },
};
```

**Touch target minimum** : 48×48dp (WCAG AA)
**Dark mode** : Supporté dès V1 — tous les tokens ont leur variante dark
**Animations** : Reanimated 3 uniquement — jamais `Animated` API legacy

### Patterns d'erreur API

```typescript
// Format uniforme pour toutes les erreurs
interface ApiError {
  code: string;       // ex: 'INSUFFICIENT_STOCK', 'INVALID_OTP'
  message: string;    // Message human-readable
  details?: unknown;  // Infos supplémentaires si pertinent
}
```

### Tests requis par feature

| Feature | Tests obligatoires |
|---------|-------------------|
| Auth | Happy path signup/login, token réutilisation → révocation famille, rate limiting |
| Gift Flow | GiftIntentDTO validation Zod, hard filters SQL (budget/stock/SLA), scoring anti-repeat |
| Checkout | Webhook payment_intent.succeeded, SELECT FOR UPDATE race condition, stock réservé |
| SSE Tracking | Mock Redis message → vérifier SSE emit, cleanup onAbort |
| SellerOwnershipGuard | Seller A accède commande Seller B → 403 |

### PostHog events critiques (tracking ML)

```typescript
// À émettre dans tracking_service.ts (userId anonymisé RGPD)
'user_signed_up'
'gift_intent_created'         // Avec GiftIntentDTO (sans PII)
'recommendation_shown'        // Avec product_ids et scores
'product_detail_viewed'
'checkout_started'
'order_paid'                  // Avec amount, relationship_id
'order_repeat'                // Si même proche, même occasion
```

---

## Hors scope V1 (différé V2+)

| Feature | Version | Raison |
|---------|---------|--------|
| Input texte libre Oreli IA | V2 | Zéro LLM en V1 pour la latence |
| Justifications Gemini (gift flow) | V2 | Rules engine suffit en V1 |
| Map tracking temps réel | V2 | SSE statuts suffit en V1 |
| Chat in-app support | V2 | Traitement manuel en V1 |
| SMS notifications | V2 | Push FCM suffit en V1 |
| Visual Search (caméra) | V2 | Feature différenciante complexe |
| Curated For You (boost vendeur) | V2 | Monétisation V2 |
| Surface web acheteur (Next.js) | V2+ | Mobile first V1 |
| Corporate Gifting B2B | V3 | Segment distinct |