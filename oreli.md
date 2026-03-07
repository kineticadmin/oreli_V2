**ORELI.AI**

_Document Cadre de Travail_

**Version 3.0**

_« Offrir doit redevenir simple, sûr et presque automatique. Oreli efface la charge mentale du cadeau. »_

Marketplace Two-Sided · IA Gifting · Mobile-First · GCP Native

Belgique → Benelux → Europe Ouest

**Version 3.0** \- _Février 2026_

# CHANGELOG V2 — CORRECTIONS APPLIQUÉES

_Ce document intègre un audit technique complet de la v1. Chaque correction est motivée par un problème concret, pas une préférence esthétique._

| **#** | **Problème V1** | **Correction V2** | **Impact** |
| --- | --- | --- | --- |
| 1   | NestJS cold start sur Cloud Run (4-8s) | Hono.js pour API mobile + NestJS pour admin/jobs | UX critique |
| 2   | Double queue BullMQ + Pub/Sub | BullMQ uniquement (Redis déjà présent en V1) | Complexité -50% |
| 3   | Meilisearch en V1 injustifié | PostgreSQL FTS natif (GIN index) | Infrastructure -1 service |
| 4   | Firestore en V1 injustifié | SSE NestJS natif pour tracking temps réel | Infrastructure -1 service |
| 5   | Expo Managed Workflow | Expo Bare Workflow + EAS Build dès le départ | Dette technique -∞ |
| 6   | API Versioning absent | /api/v1/ préfixé sur tous les endpoints dès J1 | Compatibilité mobile |
| 7   | Race condition stock non adressée | SELECT FOR UPDATE dans transaction Prisma | Intégrité données |
| 8   | JWT refresh sans rotation | Token family rotation + détection réutilisation | Sécurité critique |
| 9   | Backoffice from scratch Next.js | Refine.dev (framework backoffice React) | Dev time -6 semaines |
| 10  | Pagination offset | Cursor-based pagination (created_at + id) | Performance scale |
| 11  | Isolation multi-tenant absente | SellerOwnershipGuard systématique | Sécurité critique |
| 12  | OpenTelemetry reporté V2 | Instrumenté dès le setup initial (5 lignes) | Observabilité V1 |
| 13  | Scoring IA hardcodé | Table system_config + backoffice tuning | Ops agility |
| 14  | Privacy données ML non adressée | Anonymisation avant BigQuery/Vertex AI | RGPD compliance |
| 15  | Stripe Connect type non précisé | Connect Express explicitement (V1) | Compliance PSD2 |

# CHANGELOG V3 — NOUVELLES DIMENSIONS

_Ce document intègre 6 nouvelles dimensions absentes de la V2 : surface web acheteur, visual search IA, curation algorithmique, design system complet, stratégie marketing/communication, et un guide agent ultra-granulaire._

|     |     |     |     |
| --- | --- | --- | --- |
| **#** | **Nouvelle Dimension V3** | **Contenu ajouté** | **Section** |
| 16  | Surface Acheteur Web | Next.js checkout web complet — pour acheteurs desktop/bureau | 5bis & 6bis |
| 17  | Visual Search Feature | Photo → IA → produit identifié ou approché — Gemini Vision | 11bis |
| 18  | Curated For You | Section home boostée par vendeurs + IA profil utilisateur | 6.3 |
| 19  | Design System Oreli | Identité visuelle complète, tokens, typography, UX tone — inspiré Merode | 19  |
| 20  | Stratégie Marketing & Comm. | Stratégie digitale complète, campagnes, activation, content | 20  |
| 21  | Stack Solo Dev + Claude Code | Stack optimisée budget limité + Claude Code à 95% | 21  |
| 22  | Guide Agent Ultra-Granulaire | Step-by-step chunk-by-chunk, spec manager, zéro dette technique | 22  |

# 1\. VISION & STRATÉGIE

## 1.1 Positionnement

_Oreli.ai : concierge digital intelligent — bon cadeau, bon moment, moins d'une minute. Sans charge mentale._

Oreli se situe à l'intersection de trois univers :

- E-commerce émotionnel — l'acte d'offrir comme expérience, pas comme transaction
- Marketplace curé premium — offre sélective, vendeurs validés, qualité garantie
- Assistant IA personnel — réduction radicale de la friction décisionnelle

## 1.2 Problème Central

| **Friction** | **Manifestation** | **Ce qu'Oreli résout** |
| --- | --- | --- |
| Fatigue décisionnelle | 60-70% trouvent le choix de cadeau stressant (30-60 min) | IA réduit à <60 secondes |
| Procrastination | 30-45% des achats en last-minute, 35-45% abandonnés | Rappels + mode express |
| Manque de confiance | «Et si ça ne lui plaît pas ?» — frein psychologique fort | Curation + garantie satisfaction |
| Friction exécution | Recherche + comparaison + logistique = abandon | Checkout 1 tap, livraison gérée |

## 1.3 Flywheel Stratégique

_Plus d'acheteurs → plus de données relationnelles → meilleure IA → meilleure pertinence → plus de confiance → plus de commandes → plus d'offre premium → cercle vertueux_

## 1.4 Ambition

- Court terme : Réflexe cadeau premium last-minute, Bruxelles
- Moyen terme : Concierge gifting quotidien, Benelux
- Long terme : Infrastructure émotionnelle du gifting digital, Europe Ouest

# 2\. MARCHÉ & ÉCONOMIE

## 2.1 Taille du Marché

| **Périmètre** | **Volume** | **Note** |
| --- | --- | --- |
| Gifting mondial | 600-700 Mds $ | Comportement structurel |
| E-commerce gifting mondial | 200-250 Mds $ | Part numérique ~35% |
| Gifting UE | 150-200 Mds EUR | Croissance 6-8%/an |
| Gifting Belgique | 3-5 Mds EUR/an | 7-8M adultes acheteurs |
| Part non réalisée (BE) | ~1.4 Mds EUR/an | 35% intentions non converties → cible principale |
| Occasions/adulte/an | 5-12 | Anniversaires, fêtes, mariages, naissance… |
| Part last-minute | 30-45% | Wedge prioritaire Oreli |

## 2.2 KPIs Marketplace à suivre

| **Métrique** | **Définition** | **Seuil V1 OK** | **Alarme si** |
| --- | --- | --- | --- |
| Liquidity Rate | % demandes qui aboutissent | \> 60% | < 50% |
| Match Rate | % intents avec offre pertinente | \> 70% | < 60% |
| Time-to-Match | Intent → recommandation affichée | < 10s | \> 15s |
| On-Time Delivery | % livraisons dans les délais promis | \> 92% | < 88% |
| Repeat Rate (30j) | Utilisateurs avec 2+ commandes | \> 25% | < 18% |
| Take Rate Net | Revenue / GMV après refunds + fraude | 18-25% | < 15% |
| Contribution Margin | Marge nette par commande | \> 8 EUR | < 5 EUR |
| Seller Activation | Inscription → 1ère commande reçue | < 14j | \> 21j |

# 3\. MODÈLE ÉCONOMIQUE

## 3.1 Flux de Revenus

| **Source** | **Mécanisme** | **Montant indicatif** | **Disponibilité** |
| --- | --- | --- | --- |
| Commission vendeur | % du panier HT | 15-22% | V1 dès J0 |
| Frais de service acheteur | Frais fixe par commande | 2,49 - 4,99 EUR | V1 dès J0 |
| Options premium | Livraison express, packaging signature, message vidéo | 3-15 EUR/option | V1 dès J0 |
| Abonnement Oreli+ | Mensuel, frais offerts + fonctions avancées | 4,99 EUR/mois | V2 — M6 |
| Seller Pro | Visibilité boostée + analytics | Abonnement + commission | V2 — M8 |
| Corporate Gifting B2B | Contrats entreprises, récurrence | Sur devis | V3 — M12+ |

## 3.2 Exemple Unit Economics V1

_Panier 60 EUR : commission 18% = 10.80 EUR | frais service = 3.49 EUR | option packaging = 3 EUR → Revenu brut Oreli = 17.29 EUR / commande_

## 3.3 Projections GMV

| **Horizon** | **Zone** | **Utilisateurs** | **Commandes/an** | **GMV** | **Revenue Oreli** |
| --- | --- | --- | --- | --- | --- |
| 12 mois (V1) | Belgique | 50 000 | 100 000 | 5.5M EUR | ~990K EUR |
| 24 mois (V2) | Benelux | 200 000 | 500 000 | 30M EUR | ~6M EUR |
| 36 mois (V3) | Europe Ouest | 1 000 000 | 3 000 000 | 195M EUR | ~42M EUR |

## 3.4 Offres & Freemium

| **Niveau** | **Prix** | **Fonctionnalités incluses** | **Cible** |
| --- | --- | --- | --- |
| FREE | Gratuit | Recommendations complètes, commandes, tracking, 1 proche | Mass market |
| ORELI+ | 4.99 EUR/mois | Frais service offerts, proches illimités, rappels avancés, support prioritaire, surprises exclusives | Utilisateurs fréquents |
| SELLER BASE | Commission 15-22% | Marketplace access, commandes, paiement sécurisé, analytics basiques | Tous vendeurs V1 |
| SELLER PRO | 39 EUR/mois + commission réduite 13% | Analytics avancées, boost visibilité, insights IA, outils CRM | Vendeurs croissance V2 |

# 4\. STRATÉGIE GO-TO-MARKET & ANTI-COLD-START

## 4.1 Wedge Initial

_"Cadeau premium last-minute livré vite en zone urbaine dense (Bruxelles), sans charge mentale."_

- Urgence = forte intention d'achat + tolérance prix élevée
- Zone dense = densité supply suffisante pour liquidité rapide
- Premium = panier élevé + marge correcte dès V1

## 4.2 Supply Minimale Viable : 25 Vendeurs Bruxelles

| **Catégorie** | **Nombre V1** | **Critères sélection** |
| --- | --- | --- |
| Objets cadeaux premium | 10  | Stock dispo, délai prep <4h, emballage cadeau natif |
| Fleurs & plantes | 4   | Livraison same-day Bruxelles, florist certifié |
| Food premium (chocolats, épicerie fine) | 5   | Produits locaux artisanaux, packaging cadeau inclus |
| Expériences locales | 4   | Réservation instantanée, confirmation auto, no-show policy |
| Cadeaux personnalisés rapides | 2   | Délai <48h, qualité artisanale, proof avant envoi |

## 4.3 Calendrier 90 Jours

| **Phase** | **Période** | **Priorités** | **KPI Cible** |
| --- | --- | --- | --- |
| Préparation | J-90 → J-60 | Stack technique, playbook vendeur, landing waitlist, contrats types | Waitlist 500+ emails |
| Supply First | J-60 → J-30 | 25 vendeurs signés, 80% catalogue validé, tests logistique | 25 vendeurs actifs |
| Soft Launch | J-30 → J0 | 100-300 commandes test bêta privée, mesure friction | Match rate >60% |
| Launch | J0 → J+90 | Paid acquisition contrôlée, optimisation conversion, rétention | 2 000 commandes |

# 5\. ARCHITECTURE PRODUIT — STACK RÉVISÉE V2

## 5.1 Les 5 Surfaces Produit

| **Surface** | **Type** | **Stack V2 (révisé)** | **Hébergement** |
| --- | --- | --- | --- |
| App Mobile Acheteur | Frontend | React Native Bare Workflow + EAS Build | App Store / Play Store |
| Website Acquisition | Frontend | Next.js 14 (App Router) + Tailwind | Vercel |
| Seller Console (SaaS) | Frontend | Next.js 14 + Refine.dev + Tailwind | Vercel |
| API Core (mobile/web) | Backend | Hono.js sur Node.js 20 — cold start <200ms | Cloud Run GCP |
| API Admin + Jobs | Backend | NestJS 10 — richesse framework pour backoffice et workers | Cloud Run GCP |

## 5.2 Pourquoi deux backends ? (décision architecturale clé)

_NestJS cold start = 4-8 secondes. Inacceptable pour une API mobile sur Cloud Run à trafic irrégulier._

|     | **Hono.js (API mobile/web)** | **NestJS (admin/jobs)** |
| --- | --- | --- |
| Cold start | <200ms | 4-8 secondes (acceptable côté admin) |
| Throughput | ~3x plus rapide que Express | Standard, suffisant |
| Écosystème | Middlewares simples, Web Standards API | DI, décorateurs, modules complets |
| Idéal pour | Endpoints gift flow, checkout, tracking | Backoffice, jobs BullMQ, workers IA |
| Déploiement | Cloud Run min-instances: 0 (coût optimisé) | Cloud Run min-instances: 1 (admin) |
| Partagé | Types Prisma, validators Zod, auth JWT | Même chose via monorepo shared/ |

## 5.3 Stack Simplifiée V1 (vs V1 originale)

| **Composant** | **V1 originale** | **V2 révisée** | **Justification** |
| --- | --- | --- | --- |
| Framework backend | NestJS unique | Hono (api) + NestJS (admin) | Cold start critique mobile |
| Queue système | BullMQ + Pub/Sub | BullMQ uniquement | Redis déjà présent, Pub/Sub inutile en monolithe |
| Search | Meilisearch | PostgreSQL FTS (GIN index) | < 100K produits = FTS suffisant |
| Tracking temps réel | Firestore | SSE natif Hono/NestJS | Zéro infra supplémentaire en V1 |
| App Mobile | Expo Managed | Expo Bare + EAS Build | Stripe, Face ID, push avancé nécessitent bare |
| Backoffice | Next.js from scratch | Next.js + Refine.dev | \-6 semaines de dev sur CRUD |
| Pagination | Offset (LIMIT/OFFSET) | Cursor-based (created_at + id) | Performance + cohérence |
| API versioning | Absent | /api/v1/ sur tous les endpoints | Compatibilité mobile obligatoire |
| Embeddings IA | pgvector (vague) | text-embedding-004 + pgvector (précis) | Modèle Google, gratuit jusqu'au scale |

## 5.4 Monorepo Structure

oreli/

apps/

api-mobile/ ← Hono.js (endpoints acheteur + vendeur)

api-admin/ ← NestJS (backoffice, workers BullMQ, crons)

mobile/ ← React Native Bare Workflow

web-acquisition/ ← Next.js (landing, SEO)

seller-console/ ← Next.js + Refine.dev

packages/

shared-types/ ← Types TypeScript communs

shared-validators/ ← Schémas Zod partagés

shared-auth/ ← Logique JWT / guards

prisma/ ← Schema DB + client généré

email-templates/ ← Templates React Email

infra/

terraform/ ← IaC GCP

docker/ ← Dockerfiles par app

**5bis. SURFACE ACHETEUR WEB — CHECKOUT DESKTOP**

_"Un acheteur sur son bureau à 16h, anniversaire demain. Il ne télécharge pas d'app. Il commande en 3 clics depuis son navigateur." — Cette surface n'est pas optionnelle : 35-40% des commandes e-commerce premium se font encore depuis un desktop._

## 5bis.1 Positionnement de la Surface Web

La surface web acheteur n'est pas un clone de l'app mobile — c'est un canal complémentaire avec ses propres forces : clavier, grand écran, copier-coller facile, session longue. Elle cible principalement les acheteurs en contexte bureau (travail, domicile) qui n'ont pas installé l'app.

|     |     |     |
| --- | --- | --- |
| **Dimension** | **App Mobile** | **Web Acheteur** |
| Contexte principal | En déplacement, impulse, last-minute | Au bureau, planifié, comparaison |
| Session typique | < 90 secondes | 3-8 minutes |
| Avantage UX | Biométrie, push, offline | Saisie facile, bookmarks, partage |
| Part estimée | 60-65% des commandes | 35-40% des commandes |
| Conversion | Plus haute (intent fort) | Plus basse mais panier plus élevé |
| Stack | React Native Bare + EAS | Next.js 14 App Router |

## 5bis.2 Stack Technique

- Next.js 14 App Router — SSR pour SEO, RSC pour performance
- Tailwind CSS + Design System Oreli (tokens partagés avec seller console)
- TanStack Query v5 — server state, cache, optimistic updates
- React Hook Form + Zod — formulaires validation identique au backend
- Stripe PaymentSheet Web — 3DS/SCA natif, zéro donnée carte chez Oreli
- NextAuth.js — OAuth Google/Apple + email/mdp, sessions JWT
- SSE hook useOrderTracking — même endpoint que mobile
- Hébergement : Vercel (même pipeline CI/CD, preview par PR)

## 5bis.3 Pages & Écrans

|     |     |     |
| --- | --- | --- |
| **Page / Route** | **Composants Clés** | **Notes UX** |
| /   | Hero + Gift Flow CTA + Curated For You + Events prochains | Landing et entrée app simultanément |
| /gift | Gift Flow Web (5 steps sidebar stepper) | Stepper latéral visible — progress rassurant |
| /gift/recommend | Grid produits 3 colonnes, filtres latéraux, score affinité | Plus d'espace = plus de contexte vendeur |
| /gift/product/:id | Photos galerie, vendeur rating, options livraison, CTA checkout | Social proof visible — reviews, rating |
| /checkout | Récap total, adresse, Stripe PaymentSheet, message cadeau | Même logique que mobile — snapshot adresse |
| /orders | Liste commandes, statuts, SSE tracking inline | Pas besoin d'app pour suivre sa commande |
| /orders/:id | Timeline complète, preuve livraison, support | Deep link partageable par email/SMS |
| /profile | Proches, événements, historique, préférences | Gestion relationship graph depuis desktop |
| /login & /signup | OAuth + email, magic link optionnel V2 | Session cookie httpOnly sécurisée |

## 5bis.4 Gift Flow Web — Stepper 5 Étapes

_Sur desktop, le Gift Flow est présenté en sidebar stepper (étapes visibles à gauche) + contenu principal à droite. Pas de pagination plein écran comme mobile — l'utilisateur voit sa progression globale._

1.  Destinataire + Budget (en une seule étape — desktop permet plus de densité)
2.  Occasion + Date + Mode surprise
3.  Recommandations IA — grille 3 colonnes, filtres latéraux dynamiques
4.  Détail produit + Options (packaging, message vidéo V2)
5.  Checkout — adresse, paiement Stripe, confirmation

## 5bis.5 SEO & Performance

- Pages produits : SSR avec métadonnées Open Graph → partageables sur LinkedIn/WhatsApp
- URLs lisibles : /gift/product/box-chocolats-leonidas-bruxelles → SEO longue traîne
- Core Web Vitals target : LCP < 1.8s, CLS < 0.1, INP < 200ms
- ISR (Incremental Static Regeneration) sur pages catalogue — revalidation 5 min
- Image optimization : next/image avec CDN Cloud Storage intégré

# 6\. FRONTEND — APPLICATION MOBILE ACHETEUR

_Objectif UX : 0 → commande confirmée en < 60 secondes. Chaque écran supplémentaire tue la conversion._

## 6.1 Stack Mobile (Révisée — Bare Workflow)

- React Native 0.73+ avec Expo SDK (bare workflow)
- Expo EAS Build : builds cloud iOS/Android + OTA updates sans App Store review
- Navigation : React Navigation v6 (Stack + Bottom Tabs + Modals)
- State global : Zustand (léger, sans boilerplate Redux)
- Server state : TanStack Query v5 (cache, refetch, optimistic updates)
- HTTP client : ky (wrapper fetch moderne, auto-retry, timeout)
- Formulaires : React Hook Form + Zod validation
- Paiement : @stripe/stripe-react-native (nécessite bare workflow)
- Storage sécurisé : expo-secure-store (Keychain iOS / Keystore Android)
- Push notifications : expo-notifications + FCM
- Biométrie : expo-local-authentication (Face ID / Touch ID)
- Animations : React Native Reanimated 3 + React Native Skia (micro-animations)
- Internationalisation : i18next (FR / EN / NL dès V1 pour Belgique)

_Expo Managed Workflow INTERDIT : Stripe, Face ID avancé, et push background nécessitent code natif. Le "on migre plus tard" arrive toujours au pire moment._

## 6.2 Architecture des Écrans

### Module Auth

| **Écran** | **Composants clés** | **Actions / Notes** |
| --- | --- | --- |
| Splash | Animation logo, check token existant | Redirect auto si session valide |
| Onboarding | 3 slides valeur, CTA inscription | Vu une seule fois (AsyncStorage flag) |
| Sign Up | Email + mdp, Apple Sign-In, Google OAuth | Token stocké expo-secure-store |
| Login | Email/mdp, biométrie auto si activée | Refresh token rotation à chaque call |
| Vérification Email | OTP 6 chiffres, resend countdown 60s | OTP expiré en 10 min |
| Profil Initial | Prénom, ville, opt-in marketing (RGPD) | Progressive profiling — pas bloquant |

### Module Home & Navigation

| **Écran** | **Composants** | **Notes UX** |
| --- | --- | --- |
| Home Dashboard | 2 CTA dominants (Se faire plaisir / Faire plaisir), événements proches dans 14j, commande en cours | Pas de scroll. Above the fold uniquement. |
| Notifications Hub | Rappels événements, statuts commandes, alertes Oreli | Lien deep-link vers commande ou flow |

### Module Gift Flow — CŒUR PRODUIT

| **Étape** | **Écran** | **Composants UX** | **Contrainte technique** |
| --- | --- | --- | --- |
| 1   | Destinataire | Liste proches (avatar + prénom), ajout rapide "+" | Zustand GiftIntent store |
| 2   | Budget | Slider + suggestions rapides (30 / 50 / 100 EUR) |     |
| 3   | Occasion | Grille 8 icônes, texte libre (input optionnel) | Max 1 tap |
| 4   | Date livraison | DatePicker + "Aujourd'hui / Demain / Choisir" | Filtre stock/SLA immédiat |
| 5   | Niveau surprise | 3 choix illustrés : Totale / Guidée / Je choisis |     |
| 6   | Recommandations IA | Cards 3-5 produits, score affinité visible, justification courte | POST /api/v1/gift/recommend |
| 7   | Détail produit | Photos carousel, vendeur (rating, délai), CTA fort | Snapshot produit côté client |
| 8   | Checkout | Récap prix total (tout inclus), message cadeau, Face ID pay | Stripe PaymentSheet |
| 9   | Confirmation | Animation succès, ETA livraison, partage optionnel | Deep link commande |

### Module Relationship Graph (Moat Data)

| **Écran** | **Données Collectées** | **Usage IA** |
| --- | --- | --- |
| Liste Proches | Nom, relation, prochain événement | Contexte recommendation |
| Profil Proche | Préférences JSONB (goûts, allergies, tailles, couleurs, style) | Signal scoring IA fort |
| Historique Cadeaux | Timeline par proche, note satisfaction | Anti-doublon, apprentissage préférences |
| Ajout Proche | Form rapide ou import contacts (permission) | Seed relationship graph |

### Module Events & Rappels

| **Écran** | **Fonctionnalités** |
| --- | --- |
| Calendrier Gifting | Vue mensuelle, événements colorés par urgence (rouge <3j, orange <7j) |
| Détail Événement | Infos, proche lié, historique années précédentes, CTA "Préparer cadeau" |
| Créer Événement | Type, date, proche, récurrence (yearly), règles rappel configurables |
| Paramètres Rappels | Canaux push/email, timing J-14/J-7/J-1, heure envoi |

### Module Orders & Tracking

| **Écran** | **Fonctionnalités** |
| --- | --- |
| Liste Commandes | Statut visuel (badge coloré), ETA, destinataire, photo produit |
| Detail Commande | Timeline complète (SSE temps réel), preuve livraison, actions support |
| Tracking Live (SSE) | Connexion SSE vers /api/v1/orders/:id/track — statut pushed par le serveur |
| Support | Ouverture ticket, upload photo (expo-image-picker), état remboursement |

# 6bis. NOUVELLES FEATURES — VISUAL SEARCH & CURATED FOR YOU

## 6bis.1 Visual Search — Photo to Gift

_"Je veux offrir quelque chose dans ce style." — L'utilisateur prend une photo ou importe une image. Gemini Vision identifie le produit ou propose les 5 articles les plus proches dans notre catalogue._

Cette feature crée un vecteur de différentiation fort : aucun concurrent gifting en Belgique ne propose de recherche visuelle. Elle capitalise sur un comportement déjà existant (screenshots de produits sur Instagram/Pinterest) et le transforme en achat immédiat.

### Cas d'usage principaux

- L'acheteur screenshot un produit vu sur Instagram → Oreli trouve le même ou similaire
- Inspiration en boutique physique → photo du produit → commander online
- "Ma femme adore ce type d'objet" → photo d'un objet qu'elle possède → produits similaires
- Wishlist screenshot (Amazon, Etsy) → Oreli match dans notre catalogue premium

### Pipeline Technique — Visual Search

|     |     |     |     |
| --- | --- | --- | --- |
| **Étape** | **Action** | **Technologie** | **Durée** |
| 1   | Upload image depuis galerie ou caméra | expo-image-picker (mobile) / file input (web) | < 1s |
| 2   | Compression client-side avant envoi | expo-image-manipulator / Canvas API web | < 200ms |
| 3   | Envoi image à API POST /api/v1/gift/visual-search | Multipart form / base64 selon taille | < 500ms |
| 4   | Analyse image par Gemini Vision | Gemini 1.5 Flash avec image + prompt structuré | ~800ms |
| 5   | Extraction tags + catégorie + attributs visuels | JSON schema response — couleur, style, matière, usage | inclus étape 4 |
| 6   | Génération embedding texte des attributs extraits | text-embedding-004 sur description extraite | ~150ms |
| 7   | Vector similarity search pgvector | Opérateur &lt;=&gt; sur products.embedding | ~15ms |
| 8   | Scoring + ranking (budget si connu, vendeur, stock) | Rules engine existant — réutilisation code | < 5ms |
| 9   | Réponse : 5 produits + label 'identique' ou 'inspiré de' | JSON Hono vers app | ~1ms |
| TOTAL | Latence totale visual search |     | ~1.5-2s (acceptable) |

### Prompt Gemini Vision — Extraction Attributs

POST /api/v1/gift/visual-search — Hono.js Handler

const analyzeImage = async (imageBase64: string): Promise&lt;VisualSearchResult&gt; => {

const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

const prompt = \`Analyse cette image de produit cadeau.

Retourne UNIQUEMENT du JSON avec ces champs:

{

product_type: string, // ex: 'chocolats', 'bijou', 'livre'

style: string\[\], // ex: \['artisanal', 'minimaliste', 'luxe'\]

colors: string\[\], // couleurs dominantes

materials: string\[\], // ex: \['cuir', 'céramique', 'or'\]

occasion_tags: string\[\], // ex: \['romantique', 'anniversaire'\]

price_range: string, // 'low'|'medium'|'high'|'luxury'

confidence: number // 0-1 confiance identification

}\`;

// timeout 1500ms — fallback sur recherche texte si dépassé

const result = await Promise.race(\[model.generateContent(...), timeout(1500)\]);

return VisualSearchSchema.parse(JSON.parse(result.response.text()));

};

### UX — Visual Search Mobile

- Accès via icône caméra dans la barre de recherche home ET dans le gift flow (étape recommandation)
- Preview image + label IA extrait en attendant les résultats ('Chocolats artisanaux détectés...')
- Badge 'Match' (produit très proche) ou 'Dans l'esprit' (similaire) sur chaque carte résultat
- Possibilité de re-cropper l'image si trop de contexte parasite
- Fallback texto : si Gemini confidence < 0.4 → afficher search box pré-remplie avec les tags extraits

## 6bis.2 Curated For You — Section Home Personnalisée

_"Votre vitrine personnelle — des produits boostés par les vendeurs, filtrés par notre IA selon vos proches et vos habitudes." — Cette section combine monétisation vendeur (boost payant) et pertinence IA pour créer une expérience qui s'améliore à chaque visite._

### Mécanique Double — Boost Vendeur + Filtre IA

La section 'Curated For You' n'est pas une simple liste sponsorisée. C'est un filtre en deux temps : les vendeurs paient pour entrer dans le pool boosté, mais l'IA Oreli ne montre que les produits réellement pertinents pour l'utilisateur parmi ce pool. Un boost vendeur ne garantit pas l'affichage — il garantit l'éligibilité.

|     |     |     |
| --- | --- | --- |
| **Mécanisme** | **Logique** | **Impact** |
| Seller Boost Pool | Vendeurs payent pour inclure produits dans pool 'boostable' | Monétisation V2 — revenus additionnels |
| Filtre IA Profil | Parmi le pool, IA filtre selon proches, occasions proches, historique | Pertinence maintenue — confiance utilisateur |
| Personnalisation Events | Priorité aux produits adaptés aux événements dans les 14 prochains jours | Urgence + conversion |
| Anti-Fatigue | Rotation daily — pas les mêmes produits d'une visite à l'autre | Engagement récurrent |
| Fallback Non-Logué | Pour nouveaux utilisateurs — meilleurs produits catégorie + popularité | Cold start acheteur résolu |

### Structure Visuelle — Mobile Home

- Titre : 'Pour vous — cette semaine' (pas 'Sponsorisé' — framing éditorial)
- Horizontal scroll de cards (4-6 produits visible) — same UX que Spotify 'Made for You'
- Badge occasion sur chaque card : 'Idéal anniversaire', 'Last-minute OK', 'Livraison demain'
- Si événement proche (< 7j) → badge urgence coloré : 'Anniversaire de Marie dans 3 jours'
- CTA sur la section : 'Voir tous les produits curatés' → page dédiée /curated

### Page /curated — Expérience Complète

- Grille produits filtrables : par proche, occasion, budget, délai
- Explication transparente : 'Sélectionnés selon les goûts de vos proches et vos occasions à venir'
- Section 'Nouveautés vendeurs Bruxelles' — feed produits récemment ajoutés au catalogue
- Section 'Tendances gifting' — basée sur les commandes des 7 derniers jours anonymisées

### Backend — Endpoint /api/v1/home/curated

// Logique backfill curated products

async getCuratedForUser(userId: string): Promise&lt;CuratedProduct\[\]&gt; {

const \[relationships, upcomingEvents, history, weights\] = await Promise.all(\[

getRelationshipsWithPreferences(userId),

getUpcomingEvents(userId, 14), // 14 prochains jours

getGiftHistory(userId, 90), // 90 derniers jours

getSystemConfig('curated_weights')

\]);

// Pool boosté vendeurs (is_boosted = true AND boost_expires_at > NOW())

const boostedPool = await getBoostedProducts();

// Scoring IA identique au gift flow — réutilisation complète

return scoreAndRank(boostedPool, { relationships, upcomingEvents, history, weights })

.slice(0, 12); // 12 produits max en home

}

# 7\. FRONTEND — WEBSITE D'ACQUISITION

## 7.1 Stack & Objectif

- Next.js 14 App Router — SSR pour SEO, ISR pour pages blog
- Tailwind CSS + Shadcn/ui (composants accessibles)
- Hébergement : Vercel (Edge Network, preview deployments par PR)
- Analytics : Vercel Analytics + PostHog
- Formulaires : React Hook Form + Server Actions Next.js

## 7.2 Pages & Conversion

| **Page** | **Objectif** | **CTA Principal** |
| --- | --- | --- |
| / Landing | Convertir trafic froid. Hero + valeur + social proof | Télécharger l'app / Rejoindre la liste |
| /comment-ca-marche | Réduire friction cognitive. Flow 3 étapes illustré | Essayer maintenant |
| /vendeurs | Recruter partenaires vendeurs. Pitch + avantages + formulaire | Devenir partenaire Oreli |
| /confiance | Lever objection sécurité. Garanties, politique retour, RGPD | Commander en confiance |
| /blog | SEO longue traîne. Guides cadeaux, occasions, idées | Découvrir Oreli |
| /legal | CGU / Politique confidentialité / Cookies (RGPD) | \-  |

## 7.3 Pré-lancement Waitlist

- Landing waitlist isolée : email + prénom + occasion principale (data pour cold start segmentation)
- Incentive : "Crédit Oreli 5 EUR à l'ouverture pour les 500 premiers"
- Referral : "Invite 3 amis → crédit doublé à 10 EUR"
- Intégration email : Brevo (ex-Sendinblue) — RGPD natif EU, moins cher que Mailchimp

# 8\. FRONTEND — SELLER CONSOLE (SaaS VENDEUR)

**_Refine.dev : framework React open-source pour backoffice/admin. Génère tables, filtres, formulaires CRUD — économie de 4-6 semaines de dev._**

## 8.1 Stack Technique

- Next.js 14 + Refine.dev (data provider personnalisé → API Hono)
- TanStack Table v8 via Refine (tables complexes avec filtres)
- Recharts (graphiques performance)
- React Hook Form + Zod (formulaires catalogue)
- react-dropzone + Cloud Storage (upload photos produits)
- Auth : sessions JWT role=seller, SellerOwnershipGuard systématique
- Hébergement : Vercel

## 8.2 Onboarding Vendeur — 7 Étapes

| **Étape** | **Écran** | **Action Technique** |
| --- | --- | --- |
| 1   | Inscription | Email + mdp → création user (role seller) + seller (status: pending) |
| 2   | Informations légales | Nom légal, N° TVA, adresse, type entité → validation format TVA UE |
| 3   | Documents KYB | Upload pièce ID + extrait BCE/KBO + RIB → Cloud Storage private bucket |
| 4   | Stripe Connect Express | Redirect Stripe onboarding → webhook seller activated → seller.stripe_id enregistré |
| 5   | Configuration boutique | SLA prep (heures), zones livraison (GeoJSON), horaires, cut-off time |
| 6   | Premier produit | Wizard guidé (titre, photos, prix, tags Oreli, stock) → product.status = draft |
| 7   | Attente validation | Admin Oreli review KYB → approve → seller.status = active → 1er produit visible |

## 8.3 Modules Principaux

### Dashboard

| **Widget** | **Données** |
| --- | --- |
| Commandes du jour | Nombre, montant, statut rapide, alertes urgences (rouge si >SLA) |
| Performance SLA | Taux on-time delivery 30j, temps moyen acceptation, taux rejet |
| Revenus | GMV semaine/mois, commission Oreli déduite, payout prochain |
| Stock critique | Produits en rupture ou stock <5 unités — avec CTA mise à jour rapide |
| Actions requises | Commandes à accepter (timer visible), documents KYB manquants |

### Gestion Commandes

- Liste filtrée : statut, date, montant — pagination cursor-based
- Détail commande : info acheteur anonymisée, produit, message cadeau, adresse, timer SLA
- Accepter/Refuser : bouton proéminent, raison obligatoire si refus (stockée pour scoring)
- Update statuts : En préparation → Prêt → Remis transporteur → Livré
- Preuve livraison : upload photo (react-dropzone) OU saisie numéro suivi

### Catalogue

- CRUD produit complet : titre, description, photos multi (3 min), prix, délai, stock, tags Oreli
- Tags Oreli critiques : surprise-ready, last-minute-ok, premium, enfant-friendly, couple, corporate
- Validation images : format WebP recommandé, min 800x800px, compression auto Cloud Storage
- Inventory update batch : mise à jour stock multi-produits depuis tableau

### Finance

- Revenus par période avec décomposition : GMV / commission / net vendeur
- Historique payouts Stripe avec lien dashboard Stripe Express
- Factures téléchargeables (PDF) — générées automatiquement par le système

# 9\. BACKEND — ARCHITECTURE RÉVISÉE

## 9.1 API Mobile (Hono.js)

Hono.js : framework Web ultra-léger (14kb) basé sur Web Standards API. Compatible Node.js, Bun, Deno, Cloudflare Workers.

| **Caractéristique** | **Valeur** | **Comparaison Express** |
| --- | --- | --- |
| Cold start | < 200ms sur Cloud Run | Express : 800ms-1.5s, NestJS : 4-8s |
| Req/sec (benchmark) | ~400K req/s | Express : ~100K req/s |
| Bundle size | 14 KB | Express : 500KB+ |
| TypeScript | Natif (generics sur route) | Via @types/express |
| Validation | Zod middleware natif | À ajouter manuellement |
| OpenAPI | zod-openapi intégré | swagger-jsdoc externe |

// main.ts — API Mobile Hono

import { Hono } from "hono";

import { cors } from "hono/cors";

import { jwt } from "hono/jwt";

import { zValidator } from "@hono/zod-validator";

import { serve } from "@hono/node-server";

const app = new Hono().basePath("/api/v1");

app.use("\*", cors({ origin: process.env.ALLOWED_ORIGINS!.split(",") }));

app.use("/gift/\*", jwt({ secret: process.env.JWT_SECRET! }));

app.use("/orders/\*", jwt({ secret: process.env.JWT_SECRET! }));

app.route("/gift", giftRouter);

app.route("/orders", ordersRouter);

app.route("/auth", authRouter);

serve({ fetch: app.fetch, port: 8080 });

## 9.2 Versioning API — Règle Absolue

_Tous les endpoints DOIVENT être préfixés /api/v1/ dès le premier commit. Une app mobile en production ne peut pas forcer une mise à jour utilisateur._

Stratégie de breaking change :

1.  Ajouter /api/v2/orders avec nouveau contrat (backward compatible)
2.  Déployer backend v2 — les deux versions coexistent
3.  Déployer app mobile v2 sur stores — attendre que 95% des users aient migré
4.  Déprécier /api/v1/orders (header Deprecation + Sunset date)
5.  Supprimer /api/v1/orders après délai

## 9.3 Modules Backend (API Mobile Hono)

| **Module / Router** | **Endpoints Clés** | **Responsabilités** |
| --- | --- | --- |
| authRouter | POST /auth/signup, /auth/login, /auth/oauth/:provider, /auth/refresh, /auth/logout | JWT issuing, OAuth, refresh rotation |
| giftRouter | POST /gift/intent, GET /gift/recommend, POST /gift/surprise | Capture intent, appel RecommendationService |
| ordersRouter | POST /orders, GET /orders/:id, GET /orders/:id/track (SSE) | Création commande, tracking SSE |
| catalogRouter | GET /products, GET /products/:id | Catalogue acheteur (lecture seule) |
| usersRouter | GET/PATCH /users/me, GET/POST/DELETE /users/addresses | Profil, adresses |
| relationshipsRouter | GET/POST/PUT/DELETE /relationships, /relationships/:id/events | Graph relationnel, événements |
| sellerRouter | GET /seller/orders, POST /seller/orders/:id/accept, PATCH /seller/orders/:id/status | Actions vendeur (guard SellerOwnership) |
| webhooksRouter | POST /webhooks/stripe | Événements Stripe — validation signature |

## 9.4 API Admin (NestJS)

| **Module NestJS** | **Responsabilités** | **Dépendances** |
| --- | --- | --- |
| AdminOrdersModule | Vue globale commandes, force statut, annulation, remboursement | Prisma, Stripe |
| AdminSellersModule | Review KYB, approve/reject, suspension, reliability scoring | Prisma, Storage |
| AdminProductsModule | Modération produits, approve/hide, audit | Prisma |
| RecommendationModule | RecommendationService (rules engine + Vertex AI), config weights | Prisma, Vertex AI SDK |
| AnalyticsModule | Agrégation KPIs, export BigQuery, rapports | BigQuery client, Prisma |
| WorkersModule | BullMQ job definitions: EventReminders, Payouts, SLAWatcher, Reporting | BullMQ, Redis |
| SchedulerModule | Crons: daily event scan, weekly payout batch, monthly reports | NestJS Schedule, BullMQ |
| SupportModule | Gestion tickets, réponse agent, escalation | Prisma |

## 9.5 Queue System — BullMQ Uniquement (Redis)

_BullMQ uniquement en V1. Redis déjà déployé pour le cache. Pub/Sub = infrastructure supplémentaire sans justification en monolithe._

| **Job Queue** | **Déclencheur** | **Worker** | **Retry** |
| --- | --- | --- | --- |
| send-notification | order.paid, fulfillment events | NotificationWorker (FCM + email) | 3x avec backoff exponentiel |
| event-reminder | Cloud Scheduler daily 7h | EventReminderWorker | 2x  |
| sla-watcher | Toutes les 15 min via Scheduler | SLAWatcherWorker | 5x  |
| payout-process | Cloud Scheduler vendredis 10h | PayoutWorker (Stripe) | 3x avec alerte admin |
| product-embedding | Création/modification produit | EmbeddingWorker (Vertex AI) | 3x  |
| analytics-export | Cloud Scheduler quotidien 3h | BigQueryExportWorker | 2x  |
| recommendation-log | Chaque appel /gift/recommend | LoggingWorker (BigQuery) | 1x (best effort) |

## 9.6 Server-Sent Events (SSE) — Tracking Temps Réel

Remplacement de Firestore pour le tracking V1. SSE natif Hono — zéro infrastructure supplémentaire.

// Hono SSE endpoint

giftRouter.get("/orders/:id/track", jwtMiddleware, async (c) => {

const orderId = c.req.param("id");

const userId = c.get("jwtPayload").sub;

// Vérifier ownership

const order = await ordersService.findByIdAndUser(orderId, userId);

if (!order) return c.json({ error: "Not found" }, 404);

return streamSSE(c, async (stream) => {

// Statut initial immédiat

await stream.writeSSE({ data: JSON.stringify({ status: order.status }) });

// Subscription Redis Pub/Sub (interne — pas externe)

const sub = redis.subscribe(\`order:${orderId}:status\`);

sub.on("message", async (\_, message) => {

await stream.writeSSE({ data: message });

});

stream.onAbort(() => sub.unsubscribe());

});

});

Quand un worker change le statut d'une commande, il publie sur le channel Redis interne → les clients SSE connectés reçoivent le push instantanément.

## 9.7 Isolation Multi-Tenant Vendeur — Guard Systématique

_Chaque route vendeur DOIT vérifier que la ressource appartient au seller du JWT. Sans ça, un vendeur peut accéder aux commandes d'un concurrent._

// SellerOwnershipGuard — appliqué sur TOUTES les routes /seller/\*

const sellerOwnershipMiddleware = async (c: Context, next: Next) => {

const jwtSellerId = c.get("jwtPayload").sellerId;

const paramSellerId = c.req.param("sellerId");

// Si l'URL contient un sellerId, il doit matcher le JWT

if (paramSellerId && paramSellerId !== jwtSellerId) {

return c.json({ error: "Forbidden" }, 403);

}

// TOUJOURS filtrer les queries par jwtSellerId, jamais par body/params

c.set("sellerId", jwtSellerId);

await next();

};

# 10\. BASES DE DONNÉES — RÉVISÉE (ÉCOSYSTÈME GOOGLE)

## 10.1 Architecture Multi-Base Simplifiée

| **Base** | **Service GCP** | **Usage V1** | **Ajouté en** |
| --- | --- | --- | --- |
| PostgreSQL 15 + pgvector | Cloud SQL | Toutes données transactionnelles + embeddings IA | V1 dès J0 |
| Redis 7 | Cloud Memorystore | Cache + sessions + BullMQ queues + SSE pub/sub interne | V1 dès J0 |
| BigQuery | BigQuery | Analytics, exports, data warehouse, ML training data | V1 (export batch nuit) |
| Cloud Storage | Cloud Storage | Images produits, assets, preuves livraison, documents KYB | V1 dès J0 |
| Firestore | Firestore | SUPPRIMÉ de V1. Réintroduction V3 si multi-device real-time nécessaire | V3 si besoin |

## 10.2 PostgreSQL — Schéma Complet Révisé

### Corrections Appliquées au Schéma

_Correction #1 : delivery_address_id supprimé — uniquement delivery_address_snapshot_json (JSONB immuable). Adresse ne peut jamais changer après commande._

_Correction #2 : Contrainte CHECK currency = EUR en V1 pour éviter bugs multi-devise silencieux._

_Correction #3 : Index composites + partial indexes sur orders pour les requêtes admin critiques._

_Correction #4 : SELECT FOR UPDATE documenté sur inventory pour race conditions multi-commandes._

**Bloc 1 — Identity & Access**

\-- users : contrainte status explicite + index email

CREATE TABLE users (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

email TEXT UNIQUE NOT NULL,

phone TEXT,

password_hash TEXT,

first_name TEXT NOT NULL,

last_name TEXT NOT NULL,

locale TEXT NOT NULL DEFAULT 'fr',

status TEXT NOT NULL CHECK (status IN ('active','suspended','deleted')),

marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

last_login_at TIMESTAMPTZ

);

CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_users_status_created ON users(status, created_at DESC);

**Bloc 2 — Relationship Graph (Moat Data)**

CREATE TABLE relationships (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

display_name TEXT NOT NULL,

relationship_type TEXT NOT NULL CHECK (type IN

('partner','friend','parent','child','colleague','other')),

birthdate DATE,

preferences_json JSONB NOT NULL DEFAULT '{}'::jsonb,

affinity_score FLOAT DEFAULT 0.5,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE INDEX idx_relationships_user ON relationships(user_id);

**Bloc 3 — Catalog**

CREATE TABLE products (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

seller_id UUID NOT NULL REFERENCES sellers(id),

status TEXT NOT NULL CHECK (status IN

('draft','pending_review','active','paused','archived')),

title TEXT NOT NULL,

description TEXT NOT NULL,

price_amount INTEGER NOT NULL CHECK (price_amount > 0), -- centimes EUR

currency TEXT NOT NULL DEFAULT 'EUR'

CHECK (currency = 'EUR'), -- Contrainte V1

is_surprise_ready BOOLEAN NOT NULL DEFAULT FALSE,

preparation_time_min INTEGER NOT NULL DEFAULT 240, -- minutes

embedding VECTOR(768), -- text-embedding-004

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

\-- Index FTS PostgreSQL (remplace Meilisearch)

CREATE INDEX idx_products_fts ON products

USING GIN(to_tsvector('french', title || ' ' || description));

\-- Index pgvector pour similarity search

CREATE INDEX idx_products_embedding ON products

USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

**Bloc 4 — Orders (Corrections Critiques)**

CREATE TABLE orders (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

buyer_user_id UUID NOT NULL REFERENCES users(id),

status TEXT NOT NULL CHECK (status IN (

'draft','pending_payment','paid','accepted',

'in_preparation','shipped','delivered','cancelled','refunded')),

currency TEXT NOT NULL DEFAULT 'EUR',

items_subtotal_amount INTEGER NOT NULL,

service_fee_amount INTEGER NOT NULL DEFAULT 0,

delivery_fee_amount INTEGER NOT NULL DEFAULT 0,

total_amount INTEGER NOT NULL,

gift_message TEXT,

surprise_mode TEXT NOT NULL CHECK (surprise_mode IN

('total','controlled','manual')),

requested_delivery_date DATE NOT NULL,

\-- CORRECTION : snapshot immuable uniquement, pas de FK address

delivery_address_snapshot JSONB NOT NULL,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

\-- Index composites pour requêtes admin critiques

CREATE INDEX idx_orders_user_created ON orders(buyer_user_id, created_at DESC);

CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);

\-- Partial index : commandes actives (exclut terminées pour perf)

CREATE INDEX idx_orders_active ON orders(created_at DESC)

WHERE status NOT IN ('delivered', 'refunded', 'cancelled');

**Bloc 5 — Inventory avec Gestion Race Condition**

CREATE TABLE inventory (

product_id UUID PRIMARY KEY REFERENCES products(id),

stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),

reserved_quantity INTEGER NOT NULL DEFAULT 0

CHECK (reserved_quantity >= 0),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CONSTRAINT reserved_lte_stock

CHECK (reserved_quantity <= stock_quantity)

);

\-- Pattern SELECT FOR UPDATE dans OrdersService.createOrder()

\-- (Prisma via $transaction + $executeRaw)

async reserveStock(productId: string, qty: number): Promise&lt;boolean&gt; {

return await prisma.$transaction(async (tx) => {

const result = await tx.$executeRaw\`

UPDATE inventory

SET reserved_quantity = reserved_quantity + ${qty},

updated_at = NOW()

WHERE product_id = ${productId}::uuid

AND (stock_quantity - reserved_quantity) >= ${qty}

\`;

// 0 rows updated = rupture de stock

return result === 1;

});

}

**Bloc 6 — Config IA (Poids Scoring Dynamiques)**

\-- Poids scoring IA configurables depuis backoffice (pas hardcodés)

CREATE TABLE system_config (

key TEXT PRIMARY KEY,

value JSONB NOT NULL,

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_by UUID REFERENCES users(id)

);

\-- Seed initial

INSERT INTO system_config (key, value) VALUES ('recommendation_weights', '{

"budget_match": 0.30,

"occasion_match": 0.25,

"relationship_match": 0.20,

"vector_similarity": 0.15,

"seller_reliability": 0.07,

"popularity": 0.03

}');

## 10.3 JWT Refresh Token — Rotation Sécurisée

_Sans rotation de refresh token, un token volé est exploitable pendant 30 jours._

\-- Table refresh tokens avec family (détection réutilisation)

CREATE TABLE refresh_tokens (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

token_hash TEXT NOT NULL UNIQUE, -- bcrypt du token

family_id UUID NOT NULL, -- même famille = même chaîne de rotation

expires_at TIMESTAMPTZ NOT NULL,

used_at TIMESTAMPTZ, -- NULL = pas encore utilisé

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

\-- Algorithme de rotation :

\-- 1. Vérifier token_hash dans la table

\-- 2. Si used_at IS NOT NULL → COMPROMIS → invalider toute la family_id

\-- 3. Si valide → marquer used_at = NOW()

\-- 4. Émettre nouveau refresh token avec même family_id

\-- 5. Émettre nouveau access token (15 min)

## 10.4 Cursor-Based Pagination — Standard

// Tous les endpoints de liste utilisent ce pattern

// GET /seller/orders?after=2024-01-15T10:30:00Z_\_uuid-xxx&limit=20

interface PaginationCursor {

after?: string; // "ISO_DATE_\_uuid" encodé base64

limit: number; // max 50

}

// SQL résultant

WHERE (created_at, id) < ($cursor_date, $cursor_id)

ORDER BY created_at DESC, id DESC

LIMIT $limit + 1 -- +1 pour détecter hasMore

# 11\. INTELLIGENCE ARTIFICIELLE — IMPLÉMENTATION CONCRÈTE

_Cette section décrit précisément QUEL modèle, COMMENT il est appelé, QUE fait-il avec la base de données produits, et COMMENT il arrive au résultat final._

## 11.1 Modèles Utilisés — Décisions Concrètes

| **Rôle** | **Modèle** | **Provider** | **Coût indicatif** | **Latence** |
| --- | --- | --- | --- | --- |
| Extraction d'intention (intent parsing) | Gemini 1.5 Flash | Vertex AI (GCP) | $0.075/1M tokens input | < 800ms |
| Embeddings produits & profils | text-embedding-004 | Vertex AI (GCP) | $0.00002/1K chars | < 200ms (batch) |
| Génération justification ("Pourquoi ce choix") | Gemini 1.5 Flash | Vertex AI (GCP) | $0.075/1M tokens | < 600ms |
| Extraction préférences profil proche | Gemini 1.5 Flash | Vertex AI (GCP) | Usage faible (1 call/update) | < 1s |
| Détection urgence événement | Règles métier TypeScript pur | Interne | Gratuit | < 5ms |
| Scoring final recommendation | Algorithme TypeScript (weighted sum) | Interne | Gratuit | < 10ms |

_Pourquoi Gemini 1.5 Flash et pas GPT-4o ? (1) Natif GCP = pas de sortie du réseau Google, latence réduite, facturation unifiée. (2) Flash = optimisé vitesse/coût. (3) Contexte de 1M tokens si besoin. (4) Data residency EU disponible sur Vertex AI._

## 11.2 Pipeline Complet — De l'Intention au Résultat

Voici le flux exact, étape par étape, avec le code de chaque couche.

### ÉTAPE 1 — Capture d'Intention (Interface Conversationnelle)

L'utilisateur interagit avec l'app. En V1, interface structurée (4 écrans). En V2, input texte libre analysé par Gemini.

V1 — Structured Form (fast, zero LLM cost) :

// Le mobile envoie ce payload après les 4 écrans du gift flow

interface GiftIntentDTO {

relationship_id: string; // UUID du proche

budget_min_cents: number; // 3000 = 30 EUR

budget_max_cents: number; // 7000 = 70 EUR

occasion: OccasionType; // "birthday" | "anniversary" | etc.

requested_delivery_date: string; // ISO date

surprise_mode: "total" | "controlled" | "manual";

delivery_address_id: string;

}

V2 — Free Text Input (Gemini 1.5 Flash) :

// L'utilisateur tape : "Cadeau pour ma femme, anniversaire vendredi,

// environ 60 euros, elle adore le chocolat artisanal"

const extractIntent = async (userText: string, userId: string): Promise&lt;GiftIntentDTO&gt; => {

const model = vertexAI.getGenerativeModel({

model: "gemini-1.5-flash-001",

generationConfig: {

responseMimeType: "application/json",

responseSchema: GiftIntentJSONSchema, // Zod → JSON Schema

},

});

const prompt = \`Tu es un assistant gifting. Extrais les informations

de cadeau depuis ce message utilisateur.

Message: "${userText}"

Proches disponibles: ${JSON.stringify(await getUserRelationships(userId))}

Date actuelle: ${new Date().toISOString()}

Retourne uniquement du JSON valide, jamais de texte.\`;

const result = await model.generateContent(prompt);

const json = JSON.parse(result.response.text());

// Validation Zod avant d'utiliser

return GiftIntentSchema.parse(json);

};

### ÉTAPE 2 — Hard Filters (Base de Données PostgreSQL)

Avant tout scoring IA, on élimine les produits techniquement impossibles. Cette étape est pure SQL, zéro IA.

\-- Hard filters appliqués en premier (éliminatoires)

SELECT p.\*, i.stock_quantity - i.reserved_quantity AS available_stock

FROM products p

JOIN inventory i ON i.product_id = p.id

JOIN sellers s ON s.id = p.seller_id

JOIN seller_policies sp ON sp.seller_id = s.id

WHERE

p.status = 'active'

\-- Budget

AND p.price_amount BETWEEN $budget_min AND $budget_max

\-- Stock disponible

AND (i.stock_quantity - i.reserved_quantity) > 0

\-- Délai livraison possible

AND NOW() + (sp.sla_preparation_hours + sp.sla_delivery_hours)

\* INTERVAL '1 hour' < $requested_delivery_datetime

\-- Zone livraison (seller couvre l'adresse)

AND ST_Contains(sp.delivery_zone_geojson::geometry,

ST_SetSRID(ST_MakePoint($lng, $lat), 4326))

\-- Vendeur actif et fiable

AND s.status = 'active'

AND s.reliability_score >= 0.70

\-- Résultat : pool de candidats (typiquement 20-150 produits)

En parallèle, si occasion ou préférences présentes → Full-Text Search PostgreSQL :

\-- FTS sur occasion + préférences du proche (GIN index)

AND to_tsvector('french', p.title || ' ' || p.description)

@@ plainto_tsquery('french', $occasion_keywords)

\-- Ex: "anniversaire romantique" → produits avec ces mots dans titre/desc

### ÉTAPE 3 — Vector Similarity Search (pgvector + Embeddings)

On construit un vecteur de contexte utilisateur, et on trouve les produits les plus proches sémantiquement.

Comment les embeddings sont créés :

// À la création/modification d'un produit → job BullMQ product-embedding

const generateProductEmbedding = async (product: Product): Promise&lt;number\[\]&gt; => {

const textToEmbed = \[

product.title,

product.description,

product.tags.join(" "),

product.category.name,

// Ex: "Box chocolats artisanaux premium Saint-Valentin couple romantique"

\].join(" ");

const response = await vertexAI.getEmbeddings({

model: "text-embedding-004",

content: textToEmbed,

task_type: "RETRIEVAL_DOCUMENT", // optimisé pour recherche

});

return response.embeddings\[0\].values; // 768 floats

// Stocké dans products.embedding (pgvector VECTOR(768))

};

Comment le vecteur de contexte est construit à partir de l'intent :

// Construction du vecteur contexte utilisateur

const buildContextEmbedding = async (intent: GiftIntent, relationship: Relationship) => {

const contextText = \[

\`occasion: ${intent.occasion}\`,

\`relation: ${relationship.relationship_type}\`,

\`preferences: ${JSON.stringify(relationship.preferences_json)}\`,

// Ex: "occasion: birthday relation: partner

// preferences: {likes: \['chocolat','yoga'\], dislikes: \['parfum'\]}"

\].join(" ");

return vertexAI.getEmbeddings({

model: "text-embedding-004",

content: contextText,

task_type: "RETRIEVAL_QUERY", // optimisé pour requête

});

};

Requête pgvector — Top 50 produits les plus proches sémantiquement :

\-- Similarity search sur le pool de candidats filtrés

SELECT p.id,

1 - (p.embedding &lt;=&gt; $context_vector::vector) AS similarity_score

FROM products p

WHERE p.id = ANY($filtered_product_ids::uuid\[\])

AND p.embedding IS NOT NULL

ORDER BY p.embedding &lt;=&gt; $context_vector::vector

LIMIT 50;

\-- &lt;=&gt; = opérateur cosine distance pgvector

\-- 1 - distance = similarité (0 à 1, 1 = identique)

### ÉTAPE 4 — Scoring Engine (TypeScript — Pondéré Dynamique)

Sur les 50 candidats restants, on calcule un score final combinant tous les signaux. Les poids viennent de system_config (modifiables depuis le backoffice sans déploiement).

interface ProductScore {

product_id: string;

final_score: number; // 0-100

score_breakdown: {

budget_match: number; // 0-1 : proximité budget optimal

occasion_match: number; // 0-1 : tags occasion matchés

relationship_match: number; // 0-1 : tags relation matchés

vector_similarity: number; // 0-1 : cosine similarity pgvector

seller_reliability: number; // 0-1 : reliability_score du vendeur

popularity: number; // 0-1 : commandes 30j normalisées

anti_repeat: number; // 0 ou -0.5 : déjà offert à ce proche

};

}

const scoreProducts = (

candidates: CandidateProduct\[\],

intent: GiftIntent,

relationship: Relationship,

weights: ScoringWeights, // depuis system_config

giftHistory: string\[\] // product_ids déjà offerts à ce proche

): ProductScore\[\] => {

return candidates.map(product => {

// Budget match : score max si prix = milieu du budget

const budgetMidpoint = (intent.budget_min_cents + intent.budget_max_cents) / 2;

const budgetMatch = 1 - Math.abs(product.price_amount - budgetMidpoint)

/ (intent.budget_max_cents - intent.budget_min_cents);

// Occasion match : intersection tags produit avec tags occasion

const occasionTags = OCCASION_TAG_MAP\[intent.occasion\]; // ex: birthday → \['romantique','celebration'\]

const occasionMatch = product.tags.filter(t => occasionTags.includes(t)).length

/ occasionTags.length;

// Relationship match : intersection tags avec type relation

const relTags = RELATION_TAG_MAP\[relationship.relationship_type\];

const relationshipMatch = product.tags.filter(t => relTags.includes(t)).length

/ relTags.length;

// Anti-repeat : malus si déjà offert ce produit à ce proche

const antiRepeat = giftHistory.includes(product.id) ? -0.5 : 0;

// Score final pondéré

const rawScore =

weights.budget_match \* budgetMatch +

weights.occasion_match \* occasionMatch +

weights.relationship_match \* relationshipMatch +

weights.vector_similarity \* product.similarity_score +

weights.seller_reliability \* product.seller.reliability_score +

weights.popularity \* product.normalized_popularity +

antiRepeat;

return {

product_id: product.id,

final_score: Math.max(0, Math.min(100, rawScore \* 100)),

score_breakdown: { budgetMatch, occasionMatch, /\* ... \*/ }

};

})

.sort((a, b) => b.final_score - a.final_score)

.slice(0, 5); // Top 5 pour shortlist

};

### ÉTAPE 5 — Génération Justification (Gemini 1.5 Flash)

Pour chaque produit recommandé, Gemini génère une phrase de justification courte (~15 mots) visible dans l'app.

const generateJustification = async (

product: Product,

score: ProductScore,

intent: GiftIntent,

relationship: Relationship

): Promise&lt;string&gt; => {

const prompt = \`Tu es Oreli, un assistant gifting empathique.

Génère UNE phrase de justification courte (max 12 mots, ton chaleureux)

pour recommander ce cadeau.

Produit: ${product.title}

Proche: ${relationship.relationship_type}

Occasion: ${intent.occasion}

Points forts: ${Object.entries(score.score_breakdown)

.filter((\[\_, v\]) => v > 0.7)

.map((\[k\]) => k).join(", ")}

Exemples de style:

\- "Livré demain, noté 4.9 — idéal pour un anniversaire romantique"

\- "Artisanal local, packaging inclus — parfait pour votre budget"

Ne jamais mentionner de prix ni de score.\`;

const result = await model.generateContent(prompt);

return result.response.text().trim();

};

_Important : timeout de 800ms sur cet appel. Si Gemini dépasse → fallback sur template pré-généré TypeScript. La recommendation ne doit JAMAIS bloquer sur la justification._

### ÉTAPE 6 — Fallback Logic

Si le moteur retourne < 3 résultats après scoring :

1.  Élargir budget ±20% et recalculer
2.  Élargir zone géographique (si livraison J+2 acceptable)
3.  Baisser le seuil minimum de seller_reliability (0.70 → 0.60)
4.  Si toujours < 3 → afficher "Pas assez d'offres disponibles ce jour" + proposition date alternative

En production, le fallback rate est une métrique clé. Un fallback rate > 15% indique un problème de supply ou de wedge trop étroit.

### ÉTAPE 7 — Mode Surprise Totale

En mode Surprise Totale, l'app n'affiche aucune shortlist. Le produit n'est pas visible avant la commande.

// Mode Surprise Totale : on prend le produit #1 du scoring

const getSurpriseSelection = (ranked: ProductScore\[\]): ProductScore => {

const top = ranked\[0\];

// Seuil de confiance minimum : score > 65/100

// Si score trop faible → proposer mode "Guidée" à la place

if (top.final_score < 65) {

throw new InsufficientConfidenceError(

"Score de confiance insuffisant pour surprise totale"

);

}

return top;

};

## 11.3 Pipeline Complet — Schéma de Séquence

| **Step** | **Action** | **Technologie** | **Durée** |
| --- | --- | --- | --- |
| 1   | User input (form V1 / texte libre V2) | App Mobile | 5-30s (interaction humaine) |
| 2   | Extraction intent (V2 seulement) | Gemini 1.5 Flash via Vertex AI | ~800ms |
| 3   | Hard filters SQL | PostgreSQL Cloud SQL | ~20-50ms |
| 4   | Build context embedding | text-embedding-004 Vertex AI | ~150ms |
| 5   | Vector similarity search | pgvector (ivfflat index) | ~15ms |
| 6   | Scoring engine TypeScript | Node.js (calcul mémoire) | < 5ms |
| 7   | Génération justifications (x3-5) | Gemini 1.5 Flash (parallel promises) | ~600ms (parallèle) |
| 8   | Logging async (ML data) | BullMQ job → BigQuery | 0ms (fire and forget) |
| 9   | Réponse app mobile | JSON via Hono | ~1ms |
| TOTAL | Latence totale perçue V1 | Steps 3+5+6+9 | < 100ms (V1 sans LLM) |
| TOTAL | Latence totale perçue V2 | Steps 2+3+4+5+6+7+9 | < 2s (acceptable gifting) |

## 11.4 Event Intelligence — IA Proactive

Le scheduler daily analyse les événements et déclenche les notifications au bon moment.

// Worker NestJS — tourne quotidiennement à 7h00

@Processor("event-reminder")

export class EventReminderWorker {

async process(job: Job) {

const upcomingEvents = await prisma.events.findMany({

where: {

event_date: {

gte: new Date(),

lte: addDays(new Date(), 14),

},

// Pas de notification envoyée dans les 24h

event_reminders: {

none: { sent_at: { gte: subHours(new Date(), 24) } }

}

},

include: { user: true, relationship: true }

});

for (const event of upcomingEvents) {

const daysUntil = differenceInDays(event.event_date, new Date());

const urgency = computeUrgencyScore(daysUntil, event.relationship.affinity_score);

// Gemini génère le message push personnalisé

const message = await generateReminderMessage({

event, daysUntil, relationship: event.relationship

});

await notificationService.sendPush({

userId: event.user_id,

title: message.title, // "Anniversaire de Léa dans 2 jours 🎂"

body: message.body, // "On s'en occupe ? Voir les idées →"

deepLink: \`/gift?relationshipId=${event.relationship_id}\`,

});

}

}

}

## 11.5 Coûts IA — Estimation Réelle V1

| **Usage IA** | **Volume mensuel estimé (5K commandes)** | **Coût Vertex AI** |
| --- | --- | --- |
| Embeddings produits (batch, 1x à création) | 1 000 produits × 500 chars | ~$0.01 (négligeable) |
| Embeddings contexte (par recommendation call) | 10 000 calls × 200 chars | ~$0.04 |
| Gemini intent extraction V2 (1 call/session) | 10 000 calls × 300 tokens input + 100 output | ~$0.08 |
| Gemini justifications (5 calls/recommend) | 50 000 calls × 200 tokens input + 15 output | ~$0.19 |
| Gemini notifications personnalisées | 15 000 notifications × 400 tokens | ~$0.11 |
| TOTAL mensuel V1 (5K commandes/mois) |     | < $0.50/mois |
| TOTAL mensuel V2 (50K commandes/mois) | Extrapolation ×10 | < $5/mois |

_Vertex AI Gemini 1.5 Flash : coût IA quasi-nul jusqu'au scale de 100K commandes/mois. Ce n'est pas un poste de coût significatif en V1/V2._

# 12\. BACKOFFICE — CONTROL TOWER (RÉVISÉ)

_Stack révisée : Next.js + Refine.dev. Économie estimée : 4-6 semaines de dev vs Next.js from scratch._

## 12.1 Stack & Justification Refine.dev

Refine.dev est un framework React open-source conçu pour les backoffices. Il fournit :

- Data providers : connecteurs vers votre API REST/GraphQL — tables, filtres, CRUD générés
- Hooks spécialisés : useTable, useList, useShow, useCreate, useUpdate avec typage complet
- Compatible avec : TanStack Table, Ant Design, Material UI, Shadcn/ui (au choix)
- RBAC natif : gestion rôles (admin/ops/support/finance) avec permissions granulaires
- Audit log UI : visualisation actions admin depuis admin_actions table

## 12.2 Modules Backoffice

### Orders Control Panel

- Vue globale : TanStack Table avec filtres statut/date/montant/vendeur, cursor pagination
- Timeline par commande : chaque changement de statut horodaté + acteur
- Actions : annuler, forcer statut, declencher remboursement (Stripe), compensation wallet
- Alertes SLA temps réel : polling 30s sur commandes actives avec retard (badge rouge)

### Seller Management + KYB

- File KYB : liste vendeurs en attente, review documents (viewer intégré Cloud Storage)
- Approve → webhook déclenché → email automatique vendeur + compte activé
- Reject → motif obligatoire → email avec instructions correction
- Profil vendeur : historique, reliability score, commandes, incidents, suspension

### IA Tuning Panel (critique)

- Interface de modification des poids de scoring (system_config) sans redéploiement
- A/B test configuration : 50% trafic vers weights_set_A vs weights_set_B
- Metrics IA en temps réel : CTR recommendations, conversion rate, fallback rate
- Override manual : blacklister un produit des recommendations (bug, rupture cachée)

### KPI Dashboard

| **KPI** | **Source Data** | **Rafraîchissement** | **Seuil Alerte** |
| --- | --- | --- | --- |
| GMV total | orders (amount) | Temps réel | \-20% vs semaine précédente |
| Liquidity Rate | orders / gift_intent_logs | Toutes les heures | < 55% |
| Match Rate | recommendation_logs | Toutes les heures | < 65% |
| On-Time Delivery | fulfillments | Toutes les heures | < 88% |
| Repeat Rate 30j | orders (cohort) | Quotidien | < 18% |
| Fallback Rate IA | recommendation_logs | Toutes les heures | \> 15% |
| Seller Acceptance Rate | fulfillments | Toutes les heures | < 82% |
| Refund Rate | refunds / orders | Quotidien | \> 3% |

# 13\. INFRASTRUCTURE & DEVOPS (GOOGLE CLOUD)

## 13.1 Services GCP — Configuration V1

| **Service** | **Produit GCP** | **Config V1** | **Notes** |
| --- | --- | --- | --- |
| API Mobile (Hono) | Cloud Run | min-instances: 0, max: 10, CPU 0.5, RAM 256Mi | Scale à zéro OK car Hono cold start < 200ms |
| API Admin (NestJS) | Cloud Run | min-instances: 1, max: 3, CPU 1, RAM 512Mi | Toujours chaud pour backoffice |
| PostgreSQL | Cloud SQL | PostgreSQL 15, db-g1-small (V1), db-n1-standard-2 (V2) | HA activé dès V2 |
| Redis | Cloud Memorystore | Redis 7, Basic tier 1GB (V1), Standard HA 5GB (V2) | BullMQ + cache + SSE pub/sub |
| Storage | Cloud Storage | Buckets: oreli-assets (public), oreli-private (KYB docs) | CDN activé sur oreli-assets |
| CDN | Cloud CDN | Cache assets produits, TTL 24h | Réduire latence images mobile |
| Secrets | Secret Manager | Stripe keys, JWT secret, DB URL, Vertex AI creds | Rotation automatique 90 jours |
| Scheduler | Cloud Scheduler | Crons: event-scan (7h), payout (vendredi 10h), reports (3h) | Enqueue BullMQ jobs |
| Observabilité | Cloud Logging + Monitoring | Alertes: latence P95 > 2s, error rate > 1% | Centralisé |
| Traces | Cloud Trace | Via OpenTelemetry OTLP dès V1 | Voir slow queries, Vertex AI latency |
| ML Platform | Vertex AI | Gemini 1.5 Flash + text-embedding-004 | Pay-per-use, pas de cluster dédié en V1 |
| Analytics | BigQuery | Export batch quotidien 3h depuis PostgreSQL | Tables: events, marketplace, ml_training |

## 13.2 CI/CD Pipeline

\# GitHub Actions — .github/workflows/deploy.yml

on:

push:

branches: \[main, staging\]

pull_request:

branches: \[main\]

jobs:

quality:

\- Lint (ESLint + Prettier)

\- Type check (tsc --noEmit)

\- Tests unitaires (Jest) — couverture min 80% sur services core

\- Tests intégration (Supertest + test DB PostgreSQL)

\- Prisma migrate check (migration cohérente avec schema)

build:

\- Docker build multi-stage (API Mobile + API Admin)

\- Push Google Artifact Registry

\- EAS Build mobile (iOS + Android) si tag release

deploy-staging:

needs: \[quality, build\]

\- Cloud Run deploy revision → staging

\- Smoke tests (endpoint health + 1 recommendation call)

\- Prisma migrate deploy (staging DB)

deploy-prod:

needs: \[deploy-staging\]

if: github.ref == "refs/heads/main"

environment: production # requires manual approval

\- Prisma migrate deploy (prod DB)

\- Cloud Run deploy → prod (gradual traffic 10% → 50% → 100%)

## 13.3 Observabilité — Dès V1

- Sentry : erreurs backend (Hono + NestJS) + mobile React Native
- PostHog : events produit critiques (signup, recommendation_shown, checkout_started, order_paid, repeat_order)
- OpenTelemetry : traces distribuées dès le setup (5 lignes dans main.ts de chaque service)
- Cloud Trace : réception automatique traces OTLP depuis GCP
- Cloud Monitoring : alertes slack #ops-alerts pour latence P95 > 2s et error rate > 1%
- Prisma Query insights : slow query detection sur Cloud SQL

# 14\. SÉCURITÉ & CONFORMITÉ UE

## 14.1 Sécurité Applicative

| **Couche** | **Mesure** | **Implementation** |
| --- | --- | --- |
| Auth | JWT 15min + refresh rotation avec family detection | Table refresh_tokens + bcrypt hash |
| Mobile storage | expo-secure-store (Keychain/Keystore) | Jamais AsyncStorage pour tokens |
| Paiements | Stripe SCA/3DS, zéro donnée carte chez Oreli | Stripe PaymentSheet mobile |
| Rate limiting | Par IP + par userId sur endpoints sensibles | Hono middleware Redis-backed |
| Inputs | Zod validation systématique (backend) | Aucun body non-validé traité |
| SQL injection | Impossible via Prisma (ORM paramétré) | Raw queries uniquement si absolument nécessaire |
| Secrets | Secret Manager GCP, rotation 90j | Zéro secret en clair dans le code |
| TLS | TLS 1.3 minimum, HSTS headers | Cloud Load Balancer + Vercel edge |
| CORS | Liste blanche origines explicites | Mobile n'a pas de CORS (API natif) |
| Multi-tenant | SellerOwnershipGuard sur toutes les routes vendeur | Filter par JWT sellerId, jamais params |

## 14.2 Conformité RGPD/DSA/PSD2

| **Réglementation** | **Obligations** | **Implementation Concrète** |
| --- | --- | --- |
| RGPD | Consentement, droit oubli, portabilité, minimisation | Consent lors signup, endpoint DELETE /users/me (anonymise), GET /users/me/export |
| RGPD — ML | Données ML anonymisées avant Vertex AI | BigQuery : suppression user_id + hachage pseudonymisé avant export ML |
| DSA | Tracabilité vendeurs, modération, transparence ranking | KYB obligatoire, audit_actions logs, motifs visible dans backoffice |
| PSD2/PSD3 | SCA obligatoire, split payments via PSP licencié | Stripe Connect Express (PSP avec licence UE) |
| Droit consommateur UE | Rétractation 14j, garanties légales | Politique retour documentée, process remboursement automatisé |

# 15\. MVP V1 / V2 / V3 — DECOUPAGE RÉVISÉ

## 15.1 V1 — Cash Machine (0 → 2 000 commandes)

_Règle V1 : tout ce qui n'accélère pas la première commande est SUSPENDU. L'IA V1 = rules engine pur (zéro LLM en V1 si ça ralentit le launch)._

| **Composant** | **MUST HAVE V1** | **FAKE / Différé V1** |
| --- | --- | --- |
| Auth mobile | Email + Apple + Google OAuth, JWT rotation | \-  |
| Gift Flow | 4 écrans structurés, rules engine, shortlist 3-5 | Input texte libre (V2) |
| Embeddings | text-embedding-004 sur produits (batch async) | Context embedding (V2) |
| Checkout | Stripe PaymentSheet, confirmation instantanée | \-  |
| Tracking | SSE statuts (pas Firestore) | Map temps réel (V2) |
| Seller Console | Onboarding + catalogue + commandes + Stripe Connect | Analytics avancées (V2) |
| Backoffice | Orders + KYB + KPIs basiques + support tickets | IA tuning panel (V2) |
| IA  | Rules engine + pgvector similarity (sans LLM) | Gemini intent + justifications (V2) |
| Notifications | Push FCM sur statuts commande + rappels J-2 | SMS, email rich (V2) |
| Support | Tickets in-app + email/WhatsApp manuel | Chat in-app automatisé (V2) |

## 15.2 V2 — Product-Market Fit (2K → 10K commandes)

- IA V2 : Gemini 1.5 Flash pour intent extraction + justifications + context embeddings
- Relationship Graph complet avec affinity scoring ML
- Oreli+ abonnement avec billing Stripe
- Extraction RecommendationService en microservice dédié
- SSE → Firestore si multi-device tracking requis
- IA Tuning Panel dans backoffice
- A/B testing weights scoring

## 15.3 V3 — Scale Platform (10K → 100K+)

- Microservices complets (FraudService, PricingService, EventIntelligenceService)
- Collaborative filtering ML complet sur Vertex AI
- Corporate Gifting B2B avec dashboard dédié
- Multi-pays TVA automatisée
- API publique pour intégrations partenaires

# 16\. ESTIMATION DES COÛTS — DE ZÉRO AU PREMIER CLIENT

_Objectif de cette section : donner une vision réaliste et chiffrée des investissements nécessaires pour atteindre la production et la première commande réelle._

## 16.1 Infrastructure & Services Récurrents (Mensuel)

### Google Cloud Platform

| **Service GCP** | **Configuration V1** | **Coût/mois (EUR)** |
| --- | --- | --- |
| Cloud SQL PostgreSQL | db-g1-small (1 vCPU, 1.7GB RAM) | ~45 EUR |
| Cloud Memorystore Redis | M1 Basic 1GB | ~30 EUR |
| Cloud Run — API Mobile (Hono) | 0 idle cost, ~500K req/mois | ~8 EUR |
| Cloud Run — API Admin (NestJS) | min-instances 1, 0.5 vCPU | ~18 EUR |
| Cloud Storage | 50GB assets + KYB docs | ~5 EUR |
| Cloud CDN | Cache images produits | ~8 EUR |
| Cloud Load Balancer | HTTPS global | ~18 EUR |
| Cloud Scheduler | 5 jobs récurrents | ~1 EUR |
| Secret Manager | 10 secrets, accès fréquents | ~2 EUR |
| BigQuery | Storage + queries analytics | ~5 EUR |
| Vertex AI (Gemini + Embeddings) | V1 rules engine pur : quasi nul. V2 LLM : < 5 EUR | ~0-5 EUR |
| Cloud Logging & Monitoring | Logs 30j, alertes | ~5 EUR |
| TOTAL GCP V1 |     | ~145-155 EUR/mois |

### Services Tiers

| **Service** | **Forfait V1** | **Coût/mois (EUR)** |
| --- | --- | --- |
| Vercel (2 apps : web + seller console) | Pro plan | ~20 EUR |
| Stripe Connect Express | 1.4% + 0.25 EUR/tx EU + 0.5% platform fee | Variable (% GMV) |
| Brevo (ex-Sendinblue) — Emails transactionnels | Starter 20K emails/mois | ~16 EUR |
| Sentry | Team plan (errors + performance) | ~26 EUR |
| PostHog | Gratuit jusqu'à 1M events/mois | 0 EUR |
| Apple Developer Account | 99$/an | ~8 EUR/mois |
| Google Play Developer | 25$ one-time | ~2 EUR (one-time) |
| Expo EAS Build | Production plan (builds iOS/Android) | ~29 EUR/mois |
| GitHub | Team plan (CI/CD, repos privés) | ~4 EUR/mois |
| TOTAL services tiers |     | ~100-110 EUR/mois |

### Stripe Fees sur Transactions

| **Volume GMV mensuel** | **Frais Stripe (EU cards)** | **Frais Platform Connect** | **Total Stripe** |
| --- | --- | --- | --- |
| 5 000 EUR (100 cmd × 50 EUR) | ~95 EUR (1.4% + 0.25/tx) | ~25 EUR (0.5%) | ~120 EUR |
| 20 000 EUR (400 cmd × 50 EUR) | ~380 EUR | ~100 EUR | ~480 EUR |
| 100 000 EUR (2K cmd × 50 EUR) | ~1 900 EUR | ~500 EUR | ~2 400 EUR |

Note : Stripe fees sont prélevés sur le GMV, couverts par le take rate (18-25%). À 20% take rate sur 20K EUR GMV = 4 000 EUR de revenu brut — Stripe prend ~480 EUR = 12% du revenu. Net = 3 520 EUR pour couvrir les autres coûts.

### Coût Total Infrastructure Mensuel

| **Poste** | **V1 (< 500 cmd/mois)** | **V1 stable (2K cmd/mois)** | **V2 (10K cmd/mois)** |
| --- | --- | --- | --- |
| GCP | ~155 EUR | ~155 EUR | ~350 EUR |
| Services tiers | ~105 EUR | ~105 EUR | ~180 EUR |
| TOTAL RÉCURRENT | ~260 EUR/mois | ~260 EUR/mois | ~530 EUR/mois |

_L'infrastructure Oreli V1 est très légère. Le vrai investissement est dans le développement._

## 16.2 Coûts de Développement — Scénarios

### Scénario A — Solo Founder + Claude Code (Recommandé pour Bootstrap)

_Un développeur fullstack expérimenté utilisant Claude Code comme agent peut construire Oreli V1 en 12-16 semaines._

| **Composant** | **Estimation dev** | **Notes** |
| --- | --- | --- |
| Setup monorepo + CI/CD + infra GCP | 1-2 semaines | Terraform, GitHub Actions, Cloud Run |
| Schema DB + Prisma + migrations | 1 semaine | Toutes les tables + seed data |
| API Mobile Hono (tous endpoints V1) | 3-4 semaines | Auth, gift flow, orders, seller endpoints |
| App Mobile React Native (tous écrans) | 4-5 semaines | Gift flow + checkout + tracking + proches |
| Seller Console Next.js + Refine.dev | 2-3 semaines | Refine réduit massivement le dev time |
| Backoffice Admin + Refine.dev | 1-2 semaines | Orders + KYB + KPIs |
| IA Rules Engine + pgvector V1 | 1-2 semaines | Scoring, fallback, justifications template |
| Intégration Stripe Connect | 1 semaine | Paiement, webhooks, payouts |
| Tests, QA, hardening | 2 semaines | Jest, Supertest, smoke tests |
| TOTAL | 16-21 semaines | Soit 4-5 mois solo |

| **Type fondateur** | **Coût développement** | **Timeline** |
| --- | --- | --- |
| Fondateur dev (no salary) | 0 EUR (temps propre) | 5 mois |
| Freelance senior fullstack (600 EUR/j) | ~36 000 - 60 000 EUR | 10-15 semaines à plein temps |
| Claude Code comme agent (abonnement) | ~200 EUR/mois (Max plan) | Réducteur de time estimé à -30-40% |

### Scénario B — Petite Équipe (2 Développeurs)

| **Rôle** | **Profil** | **Tarif/jour** | **Durée** | **Coût** |
| --- | --- | --- | --- | --- |
| Dev fullstack senior (backend focus) | NestJS/Hono, PostgreSQL, GCP | 650 EUR/j | 80 jours | ~52 000 EUR |
| Dev fullstack mid (frontend focus) | React Native, Next.js | 450 EUR/j | 80 jours | ~36 000 EUR |
| TOTAL Équipe (3 mois) |     |     |     | ~88 000 EUR |

### Scénario C — Agence Web

| **Poste** | **Fourchette** |
| --- | --- |
| Développement MVP complet (agence) | 80 000 - 150 000 EUR |
| Timeline agence | 4-7 mois (délais allongés par gestion client) |
| Avantage | Clés en main, garanties, expertise sectorielle |
| Inconvénient | Coûteux, dépendance externe, moins flexible pour pivots |

## 16.3 Coûts Design

| **Option** | **Coût** | **Résultat** |
| --- | --- | --- |
| Designer UX/UI freelance (app + web + seller) | 5 000 - 15 000 EUR | Maquettes Figma complètes, design system |
| Template premium React Native + personnalisation | 500 - 2 000 EUR | Bon pour V1, limites sur différentiation |
| IA design tools (Figma AI, Galileo AI) + dev | 200 - 1 000 EUR | Acceptable pour V1 lean |
| Designer intégré à l'équipe | Inclus si équipe | Recommandé si fondateur non-design |

## 16.4 Coûts Légaux & Compliance

| **Poste légal** | **Coût estimé (one-time sauf mention)** |
| --- | --- |
| Constitution société (SRL Belgique) | 1 500 - 3 000 EUR |
| CGU / CGV / Politique confidentialité (avocat spécialisé digital) | 2 000 - 4 000 EUR |
| Audit conformité RGPD initial | 1 500 - 3 000 EUR |
| DPO externe partiel (mensuel, obligatoire si traitement données à grande échelle) | 300 - 800 EUR/mois |
| Conseil DSA (Digital Services Act) | 1 000 - 2 000 EUR |
| Assurance RC Pro + cyber risques | 800 - 2 000 EUR/an |
| Contrats types vendeurs (NDA, CGV vendeur, SLA) | 1 000 - 2 000 EUR |
| TOTAL légal one-time | ~8 000 - 15 000 EUR |

## 16.5 Coûts Marketing & Acquisition Premiers Clients

| **Canal** | **Budget V1** | **Objectif** |
| --- | --- | --- |
| Meta/Instagram Ads Bruxelles (ciblage fin 25-45 ans) | 2 000 - 4 000 EUR | Premiers 300-500 acheteurs |
| Google Ads (intent "cadeau urgent Bruxelles") | 1 000 - 2 000 EUR | Traffic haute intention |
| Micro-influence Bruxelles (3-5 créateurs lifestyle) | 2 000 - 5 000 EUR | Social proof + notoriété locale |
| Recrutement vendeurs (outreach, événements B2B) | 1 000 - 2 000 EUR | 25 vendeurs signés |
| PR locale (presse belge, blog lifestyle) | 500 - 1 500 EUR | Crédibilité early stage |
| Crédit lancement utilisateurs (5 EUR × 500 waitlist) | 2 500 EUR | Conversion waitlist |
| TOTAL marketing pre-launch + launch | ~9 000 - 15 000 EUR |     |

## 16.6 Budget Total Recommandé — De Zéro au Premier Client

| **Scénario** | **Développement** | **Design** | **Légal** | **Infra 6 mois** | **Marketing** | **TOTAL** | **Timeline** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Bootstrap Solo | 0 (fondateur) | 2 000 EUR | 8 000 EUR | 1 800 EUR | 9 000 EUR | ~21 000 EUR | 5-6 mois |
| Réaliste lean | 40 000 EUR | 8 000 EUR | 10 000 EUR | 2 000 EUR | 12 000 EUR | ~72 000 EUR | 3-4 mois |
| Confortable | 88 000 EUR | 12 000 EUR | 15 000 EUR | 3 000 EUR | 15 000 EUR | ~133 000 EUR | 3 mois |

_Recommandation : budget cible 70 000 - 90 000 EUR pour lancer correctement avec une petite équipe (1 senior + 1 mid ou fondateur dev + 1 freelance), design soigné et marge pour les imprévus (toujours +30% de buffer)._

_Le piège le plus fréquent : sous-estimer le temps d'onboarding vendeurs (commercial, négociation, contrats) et la partie légale RGPD. Ces deux postes décalent systématiquement les timelines de 4-6 semaines._

## 16.7 Seuil de Rentabilité Opérationnelle

| **Volume** | **Revenu brut Oreli** | **Coûts récurrents** | **Contribution** | **Status** |
| --- | --- | --- | --- | --- |
| 500 cmd/mois (25 EUR moy. rev/cmd) | ~12 500 EUR/mois | ~1 100 EUR (infra + Stripe) | ~11 400 EUR | Couvre infra |
| 1 000 cmd/mois | ~25 000 EUR/mois | ~2 500 EUR | ~22 500 EUR | Couvre 1 salaire |
| 3 000 cmd/mois | ~75 000 EUR/mois | ~5 500 EUR | ~69 500 EUR | Rentable opérationnel |
| 5 000 cmd/mois | ~125 000 EUR/mois | ~8 000 EUR | ~117 000 EUR | Très profitable |

Note : "revenu brut" = commission 18% + frais service 3.50 EUR. Hors salaires équipe et marketing. Le seuil de rentabilité comptable (avec salaires) dépend de la structure de l'équipe.

# 17\. BACKLOG V1 — RÉVISÉ

## 17.1 Sprint Plan 90 Jours (Sprints 2 semaines)

| **Sprint** | **Période** | **Focus** | **Deliverable** |
| --- | --- | --- | --- |
| S0  | J1-J7 (setup) | Monorepo, CI/CD, Cloud Run, Cloud SQL, Redis, secrets | Stack déployée staging — Hello World API + DB connectée |
| S1  | J8-J21 | Prisma schema complet + Auth (signup/login/OAuth) + JWT rotation | 1ère requête authentifiée |
| S2  | J22-J35 | Catalog + Seller onboarding + KYB + Stripe Connect + product CRUD | 1er produit créé par vendeur |
| S3  | J36-J49 | Gift Flow mobile + Rules Engine + pgvector + Checkout Stripe | 1ère commande end-to-end (test interne) |
| S4  | J50-J63 | Fulfillment + SLA timers + SSE tracking + notifications FCM | Cycle complet vendeur → livreur → acheteur |
| S5  | J64-J77 | Backoffice Refine.dev + KPIs + support tickets + seller management | Équipe peut opérer sans accès DB direct |
| S6  | J78-J90 | QA, hardening sécurité, RGPD, perf, tests, soft launch 50 users | Production-ready, premiers vrais clients |

## 17.2 Stories Critiques P0

| **ID** | **Story** | **Points** | **Notes** |
| --- | --- | --- | --- |
| A1  | Setup monorepo Turborepo + envs + CI/CD GitHub Actions | 8   | Fondation tout le reste |
| A2  | Prisma schema V1 complet (toutes tables) + migrations | 13  | Schema révisé avec corrections V2 |
| A3  | Auth signup/login email + Apple + Google OAuth + JWT rotation | 13  | Token family + refresh_tokens table |
| B1  | Gift Intent capture (4 écrans mobile) + Zustand store | 8   | Coeur UX |
| B2  | Rules Engine V1 (hard filters SQL + scoring + fallback) | 13  | Sans LLM en V1 |
| B3  | pgvector product embeddings (batch job + index ivfflat) | 8   | text-embedding-004 |
| B4  | Checkout Stripe PaymentSheet + webhook payment_intent.succeeded | 13  | Critique |
| B5  | Order orchestration + stock reserve (SELECT FOR UPDATE) | 13  | Race condition fix |
| B6  | SSE tracking /orders/:id/track + Redis pub/sub interne | 8   | Remplace Firestore |
| C1  | Seller onboarding + KYB upload + Stripe Connect Express | 13  | Critique pour supply |
| C2  | Seller product CRUD + inventory + tags Oreli | 13  | Avec FTS index GIN |
| C3  | Seller order management (accept/reject/statuts) + SellerOwnershipGuard | 8   | Guard critique |
| D1  | Backoffice orders control (Refine.dev) + KYB review flow | 13  |     |
| D2  | BullMQ workers (notification, SLA watcher, payout) | 8   |     |
| E1  | OpenTelemetry setup + Sentry + PostHog events critiques | 5   | Dès S0, pas après |
| E2  | Cursor-based pagination sur tous les endpoints liste | 5   | Standard dès J1 |

# 21\. STACK RECOMMANDÉE — SOLO DEV + CLAUDE CODE À 95%

_Contraintes réelles : dev JS expérimenté, budget limité, Claude Code comme agent principal à 95%, objectif = production en 5 mois max. Chaque choix tech doit être optimisé pour : génération IA fiable, debugging facile, déploiement simple._

## 21.1 Principes de Sélection — 'IA-Friendly Stack'

Claude Code génère du meilleur code quand la stack est bien documentée, conventionnelle, et avec des patterns clairs. Les frameworks ésotériques, les monorepo hyper-complexes, et les configurations sur-mesure sont des ennemis de la génération IA. La règle d'or : préférer la solution avec le plus de code d'exemple dans l'internet (donc dans les données d'entraînement).

|     |     |     |
| --- | --- | --- |
| **Critère** | **Poids** | **Explication** |
| Documentation abondante | 35% | Claude a été entraîné sur beaucoup d'exemples → meilleur code généré |
| Patterns clairs et répétables | 30% | CRUD simple > magie framework → debugging plus facile |
| Setup minimal | 20% | Moins de config = moins d'erreurs silencieuses = moins de débogage |
| Écosystème stable | 15% | Breaking changes = prompts invalides → privilégier LTS et versions stables |

## 21.2 Stack Finale Recommandée — Avec Justifications

### Backend — Simplifié Maximum

|     |     |     |     |
| --- | --- | --- | --- |
| **Composant** | **Choix V3 Solo** | **Pourquoi pas l'alternative** | **Budget/mois** |
| API unique | Hono.js SEUL (pas de split NestJS) | NestJS trop complexe à générer correctement pour Claude. Hono = simple, typé, rapide à générer. | 0 EUR |
| ORM | Prisma (identique V2) | Le meilleur support IA — énorme corpus d'exemples. Drizzle moins connu. | 0 EUR |
| Queue | BullMQ (identique V2) | Déjà prévu. Simple et bien documenté. | inclus Redis |
| Auth | Lucia Auth OU Better Auth | NextAuth trop Next-spécifique. Lucia/Better Auth = framework agnostic, clair à générer. | 0 EUR |
| Validation | Zod (identique V2) | Standard de facto TypeScript. Claude génère du Zod parfait. | 0 EUR |
| Tests | Vitest (pas Jest) | Vitest = Jest API compatible + 5x plus rapide + ESM natif. Même syntaxe pour Claude. | 0 EUR |

### Frontend Mobile — React Native Expo

|     |     |     |
| --- | --- | --- |
| **Composant** | **Choix** | **Note Solo Dev** |
| Framework | Expo SDK 51+ Bare Workflow | Identique V2 — inchangé, bonne génération Claude |
| Navigation | Expo Router v3 (file-based) | NOUVEAU vs V2 — file-based routing = moins de code boilerplate à générer, patterns très clairs |
| State | Zustand (identique V2) | Simple, minimaliste, Claude génère parfaitement |
| UI Components | NativeWind v4 + tokens design | Tailwind sur React Native — Claude maîtrise Tailwind parfaitement |
| Forms | React Hook Form (identique V2) | Inchangé |
| HTTP | TanStack Query v5 (identique V2) | Inchangé |

_Expo Router v3 est le changement clé vs V2 : au lieu de configurer manuellement React Navigation, les routes sont des fichiers dans app/. Claude génère des routes file-based parfaitement — moins de configuration, moins d'erreurs._

### Frontend Web — Uniformisé

|     |     |     |
| --- | --- | --- |
| **Surface** | **Stack** | **Note** |
| Web Acquisition + Web Acheteur | Next.js 14 App Router + NativeWind web | Même tokens design — cohérence mobile/web |
| Seller Console | Next.js 14 + Refine.dev (identique V2) | Inchangé |
| Backoffice Admin | Next.js 14 + Refine.dev (identique V2) | Inchangé |

### Infrastructure — Cloud Run vs Railway vs Render

_Pour un solo dev avec budget limité, GCP natif peut être intimidant. Voici la recommandation réaliste :_

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| **Option** | **Avantage** | **Inconvénient** | **Coût V1** | **Recommandé si** |
| GCP Cloud Run (V2 original) | Natif Vertex AI, scalable, production-grade | Setup plus complexe, courbe apprentissage | ~145 EUR/mois | Tu veux prod robuste dès J1 |
| Railway.app | Déploiement en 5 min, interface simple, DB incluse | Moins de contrôle, scaling limité | ~30-60 EUR/mois | Tu veux aller vite en V1 |
| Render.com | Proche Heroku, simple, DB PostgreSQL incluse | Cold starts sur free tier, moins scalable | ~25-50 EUR/mois | Budget ultra-serré < 50 EUR/mois |
| Hybrid (recommandé) | Railway pour API + Vercel pour frontend + Neon pour DB | 3 dashboards à gérer | ~50-80 EUR/mois | Meilleur rapport simplicité/coût V1 |

_Recommandation concrète pour solo dev + Claude Code : commencer avec Railway (API) + Vercel (frontends) + Neon (PostgreSQL serverless) + Upstash (Redis serverless). Total ~50 EUR/mois. Migrer vers GCP quand les revenus justifient la complexité._

### Coût Infrastructure Réaliste Solo Dev V1

|     |     |     |
| --- | --- | --- |
| **Service** | **Provider recommandé solo** | **Coût/mois** |
| API Hono | Railway Starter | ~10 EUR |
| PostgreSQL | Neon (serverless, 3GB free) | 0-15 EUR |
| Redis | Upstash (pay-per-request) | 0-10 EUR |
| Frontend (3 apps) | Vercel Pro | ~20 EUR |
| Storage images | Cloudflare R2 (S3-compatible, 10GB free) | 0-5 EUR |
| Vertex AI (embeddings) | GCP Pay-as-you-go | ~1-5 EUR |
| Email | Brevo (identique V2) | ~16 EUR |
| Monitoring | BetterStack (logs + uptime) | ~24 EUR |
| TOTAL |     | ~70-100 EUR/mois |

# 18\. PROMPTS POUR AGENT IA (CLAUDE CODE / ANTIGRAVITY)

_Ces prompts sont conçus pour extraire du présent document le plan de travail à forte granularité. Chaque prompt cible un périmètre précis et auto-suffisant._

## PROMPT 1 — Plan de Travail Global

_Tu es un expert en architecture logicielle. Analyse le document cadre Oreli.ai v2 fourni. Génère : (1) Liste exhaustive des epics avec critères d'acceptance, (2) Décomposition en stories techniques estimées en story points, (3) Dépendances entre stories (ce qui doit être fait avant quoi), (4) Ordre d'exécution optimal pour atteindre la première commande end-to-end le plus rapidement possible. Stack: Hono.js (API mobile) + NestJS (admin/workers) + React Native bare workflow + Next.js + Refine.dev + PostgreSQL + Prisma + Redis + BullMQ. Format: Markdown avec tables, headers clairs, diagramme dépendances Mermaid._

## PROMPT 2 — Setup Monorepo & Infrastructure

_Génère la structure complète du monorepo Oreli (Turborepo) avec: apps/api-mobile (Hono.js), apps/api-admin (NestJS), apps/mobile (React Native bare), apps/web-acquisition (Next.js), apps/seller-console (Next.js+Refine), packages/shared-types, packages/prisma. Inclus: (1) package.json racine + Turborepo config, (2) Dockerfile multi-stage optimisé pour Hono et NestJS séparément, (3) .github/workflows/deploy.yml complet (lint+tests+build+deploy staging+deploy prod avec approval manuel), (4) Terraform pour Cloud Run (2 services) + Cloud SQL PostgreSQL 15 + Cloud Memorystore Redis + Cloud Storage + Secret Manager, (5) docker-compose.yml développement local (PostgreSQL + Redis + services). TypeScript strict partout._

## PROMPT 3 — Schema Prisma Complet

_Génère le schema Prisma complet pour Oreli selon la section 10 du document cadre v2. Inclus TOUTES les tables: users, user_roles, user_devices, user_addresses, relationships, events, event_reminders, sellers, seller_users, seller_policies, seller_documents, categories, products (avec champ Unsupported("vector(768)") pour pgvector), product_assets, tags, product_tags, inventory, orders, order_items, fulfillments, delivery_shipments, order_status_events, payments, refunds, seller_payouts, ledger_entries, refresh_tokens, support_tickets, support_messages, admin_actions, risk_flags, system_config. Contraintes: CHECK sur status enums, DEFAULT values, relations correctes. Ajoute les migrations SQL raw pour: index GIN FTS, index ivfflat pgvector, index composites critiques, partial indexes, SELECT FOR UPDATE pattern documenté en commentaire. Inclus seed.ts avec données test réalistes._

## PROMPT 4 — API Mobile Hono.js Complète

_Construis l'API Mobile Hono.js complète (apps/api-mobile) selon la section 9 du document cadre v2. Inclus: (1) Structure projet Hono avec tous les routers (/api/v1/auth, /gift, /orders, /catalog, /users, /relationships, /seller, /webhooks), (2) Middleware JWT avec refresh token rotation (family detection + table refresh_tokens), (3) SellerOwnershipMiddleware sur toutes les routes /seller/, (4) Zod validators pour chaque endpoint, (5) Cursor-based pagination helper partagé, (6) SSE endpoint /orders/:id/track avec Redis pub/sub interne, (7) Endpoint /webhooks/stripe avec validation signature Stripe, (8) Rate limiting Redis-backed sur login/signup/checkout, (9) OpenTelemetry instrumentation (5 lignes init), (10) Health check endpoint. Tout en TypeScript strict. Tests Supertest pour les endpoints critiques._

## PROMPT 5 — Moteur IA V1 (Rules Engine + pgvector)

_Implémente le moteur de recommendation Oreli V1 selon la section 11 du document cadre v2. Inclus: (1) RecommendationService avec méthode getRecommendations(intent: GiftIntentDTO, userId: string): Promise&lt;RecommendationResult\[\]&gt;, (2) Hard filters SQL (budget, stock, SLA, zone, seller status) — requête Prisma $queryRaw, (3) generateProductEmbedding() avec Vertex AI text-embedding-004 (Google Auth ADC), (4) buildContextEmbedding() depuis intent + relationship.preferences_json, (5) pgvector similarity search (opérateur &lt;=&gt;), (6) scoreProducts() avec poids dynamiques depuis system_config table, (7) Anti-repeat logic (historique cadeaux proche), (8) Fallback logic (élargissement budget ±20%, zone, seuil seller), (9) generateJustification() Gemini 1.5 Flash avec timeout 800ms + fallback template, (10) Mode Surprise Totale (seuil confiance 65/100), (11) BullMQ job recommendation-log pour BigQuery async. Tests unitaires Jest sur tous les cas de scoring._

## PROMPT 6 — App Mobile React Native (Gift Flow Complet)

_Construis le Gift Flow complet de l'app mobile Oreli (React Native bare workflow + Expo EAS) selon la section 6 du document cadre v2. Inclus: (1) Navigation (React Navigation v6) : Stack auth + Bottom Tabs + Modal stacks, (2) Zustand store: GiftIntentStore (relationship, budget, occasion, date, surprise_mode), (3) 9 écrans du gift flow (destinataire → budget → occasion → date → surprise → recommendations → detail → checkout → confirmation) avec TypeScript strict, (4) TanStack Query hooks pour tous les appels API (useRecommendations, useOrder, useRelationships), (5) Stripe PaymentSheet intégration complète (expo-secure-store pour token + @stripe/stripe-react-native), (6) SSE hook useOrderTracking() avec reconnexion automatique, (7) expo-secure-store pour JWT storage (jamais AsyncStorage), (8) Biométrie Face ID/Touch ID pour checkout rapide, (9) Animations React Native Reanimated 3 sur cards recommendations. Objectif UX: 0 → commande < 60 secondes._

## PROMPT 7 — Seller Console + Backoffice (Refine.dev)

_Construis la Seller Console ET le Backoffice Admin Oreli avec Refine.dev + Next.js 14 selon les sections 8 et 12 du document cadre v2. Seller Console: (1) Onboarding 7 étapes (KYB + Stripe Connect redirect), (2) Dashboard avec widgets KPI (commandes jour, SLA gauge, revenus recharts, stock critique), (3) TanStack Table commandes avec filtres, cursor pagination, detail avec timer SLA, boutons accept/reject/statut, (4) Catalogue CRUD complet (upload photos Cloud Storage direct, tags Oreli), (5) Finance avec historique payouts et lien Stripe Express. Backoffice Admin: (6) Orders control panel avec actions admin (cancel, refund, force status), (7) KYB review workflow (approve/reject avec motif), (8) KPI dashboard temps réel (polling 30s), (9) IA Tuning Panel (modification poids system_config sans redéploiement), (10) Support tickets avec priorité et réponse agent. RBAC: roles admin/ops/support/finance avec permissions granulaires._

## PROMPT 8 — Tests & Sécurité

_Génère la stratégie de tests complète pour Oreli V2 selon les sections 9, 10, 11, 14 du document cadre. (1) Tests unitaires Jest: RecommendationService (tous scénarios scoring, fallback, anti-repeat, surprise mode), OrdersService (machine à états statuts, reserve stock SELECT FOR UPDATE), AuthService (JWT rotation, family detection réutilisation token → révocation complète), (2) Tests intégration Supertest: flow complet commande (intent → payment_intent → webhook Stripe mock → fulfillment créé → SSE push), flow remboursement, SellerOwnershipGuard (tentative accès cross-seller = 403), (3) Tests sécurité: SQL injection via Prisma (ne doit pas passer), rate limiting (X requêtes → 429), CORS origins non autorisées (→ reject), (4) Mocks Stripe: payment_intent.succeeded, payment_intent.payment_failed, charge.dispute.created (chargeback). Coverage minimum: 80% sur services core (recommendation, orders, payments, auth)._

# 22\. GUIDE AGENT ULTRA-GRANULAIRE — BUILDING ORELI AVEC CLAUDE CODE

_Ce guide est conçu pour un solo dev qui utilise Claude Code à 95% du travail. L'approche : Spec Manager d'abord, puis agents séquentiels avec prompts atomiques. Zéro dette technique tolérée — chaque PR doit passer CI avant merge._

## 22.1 Philosophie — Spec-First Development avec IA

La plus grande erreur quand on travaille avec un agent IA : lui demander de coder sans spec. Le résultat : du code qui 'fonctionne' mais qui n'est pas aligné avec l'architecture, qui accumule de la dette technique, et qui est impossible à faire évoluer.

La bonne approche : Spec Manager → Spec complète → Implémentation atomique → Tests → Merge. L'agent n'écrit jamais de code sans avoir une spec validée. Cela semble plus lent — c'est 2x plus rapide sur 3 mois.

|     |     |
| --- | --- |
| **Mauvaise approche** | **Bonne approche** |
| 'Claude, code l'auth' | 'Claude, implémenterons l'auth selon la SPEC-AUTH-001 ci-jointe' |
| Prompt vague → code approximatif → debug 4h | Spec précise → code conforme → 0 debug |
| Une session = une feature | Une session = un fichier / un module / un test |
| Merge sans test | CI obligatoire — aucun merge si test fail |
| Dette technique invisible | Chaque TODO documenté dans backlog avant de continuer |

## 22.2 Gestionnaire de Specs — Structure

### Organisation des Specs dans le Monorepo

oreli/

specs/ ← Toutes les specs ici — source de vérité

SPEC-000-OVERVIEW.md ← Lien vers ce document + conventions globales

infra/

SPEC-INF-001-monorepo.md

SPEC-INF-002-ci-cd.md

SPEC-INF-003-database.md

auth/

SPEC-AUTH-001-signup-login.md

SPEC-AUTH-002-jwt-rotation.md

SPEC-AUTH-003-oauth.md

gift-flow/

SPEC-GIFT-001-intent-capture.md

SPEC-GIFT-002-recommendation-engine.md

SPEC-GIFT-003-checkout.md

SPEC-GIFT-004-visual-search.md

orders/

SPEC-ORD-001-order-creation.md

SPEC-ORD-002-sse-tracking.md

SPEC-ORD-003-fulfillment.md

sellers/

SPEC-SEL-001-onboarding.md

SPEC-SEL-002-catalog-crud.md

SPEC-SEL-003-order-management.md

mobile/

SPEC-MOB-001-navigation.md

SPEC-MOB-002-gift-flow-screens.md

SPEC-MOB-003-home-curated.md

design/

SPEC-DES-001-tokens.md

SPEC-DES-002-components.md

### Template de Spec — SPEC-XXX-000.md

\# SPEC-XXX-000 : \[Nom du module\]

\## Contexte

\[Pourquoi ce module existe, lien avec le reste du système\]

\## Périmètre

\[Ce qui est INCLUS dans cette spec — liste exhaustive\]

\[Ce qui est EXCLU — pour éviter le scope creep\]

\## Interface (contrats)

\[Input : types TypeScript exacts\]

\[Output : types TypeScript exacts\]

\[Endpoints : méthode, route, auth, body, response\]

\## Comportement Attendu

\[Happy path step by step\]

\[Edge cases et comportement attendu\]

\[Erreurs et codes HTTP attendus\]

\## Tests Requis (acceptance criteria)

\[ \] Test 1 : \[description précise\]

\[ \] Test 2 : ...

\## Dépendances

\[Specs qui doivent être implémentées avant\]

\[Tables DB utilisées\]

\[Services externes appelés\]

\## Notes d'Implémentation

\[Patterns à suivre, pièges à éviter\]

## 22.3 Step-by-Step : 90 Jours de Build

_Chaque 'STEP' est un prompt atomique à envoyer à Claude Code. Durée estimée par step : 30 min à 2h selon complexité. Règle : ne jamais passer au step suivant si les tests du step actuel échouent._

### PHASE 0 — Foundation (Semaine 1-2, ~14 Steps)

**STEP 0.1 — Monorepo Init**

PROMPT: Initialise un monorepo Turborepo pour Oreli avec la structure

suivante : apps/api (Hono.js Node 20), apps/mobile (Expo SDK 51 bare),

apps/web (Next.js 14), apps/seller-console (Next.js 14), apps/admin

(Next.js 14). Packages partagés : packages/shared-types (TypeScript types

communs), packages/shared-validators (schémas Zod), packages/design-tokens

(tokens couleurs/typo). Utilise pnpm workspaces. Configure turbo.json avec

pipelines build/test/lint. Chaque app doit avoir un package.json minimal.

Pas de code fonctionnel — structure uniquement. Ajoute un README.md racine.

**STEP 0.2 — Design Tokens**

PROMPT: Dans packages/design-tokens/src/tokens.ts, implémente les design

tokens Oreli selon la spec SPEC-DES-001. Couleurs : primary #1A1A2E,

accent #C9A84C, warm #F5F0E8, sand #E8E2D8, mid #6B6B6B.

Spacing scale : 4/8/16/24/32/48px. Radius : 4/8/12/16/9999.

Typography : Playfair Display pour headings, Inter pour body.

Export tout en TypeScript strict. Ajoute tailwind.config.ts qui

consomme ces tokens. Ajoute un test Vitest qui vérifie que tous

les tokens sont bien exportés et typés.

**STEP 0.3 — TypeScript Shared Types**

PROMPT: Dans packages/shared-types/src/, crée les types TypeScript

fondamentaux partagés : User, Seller, Product, Order, OrderItem,

Relationship, Event, GiftIntentDTO, RecommendationResult,

ProductScore, PaginationCursor, ApiResponse&lt;T&gt;, ApiError.

Pas de logique — types purs uniquement. Tout strict, aucun any.

Export depuis un index.ts propre. Ajoute des JSDoc sur chaque type.

**STEP 0.4 — Shared Validators**

PROMPT: Dans packages/shared-validators/src/, implémente les schémas

Zod correspondant aux types de shared-types. Schema Zod pour GiftIntentDTO

(avec validation budget min &lt; max, date &gt; aujourd'hui, etc.), CreateUserDTO,

CreateProductDTO, CreateOrderDTO. Chaque schema doit inférer son type

TypeScript avec z.infer<>. Tests Vitest : cas valides + cas invalides

pour chaque schema (min 2 tests par schema).

**STEP 0.5 — Database Schema Prisma**

PROMPT: Dans packages/prisma/, crée le schema.prisma complet pour

Oreli V1. Tables requises : users, sellers, seller_users, seller_policies,

categories, products (avec Unsupported('vector(768)') pour embedding),

product_assets, tags, product_tags, inventory, relationships, events,

event_reminders, orders, order_items, fulfillments, order_status_events,

payments, refresh_tokens, system_config. Contraintes CHECK sur tous les

status fields (enum explicites). Index : email unique sur users, FTS GIN

sur products (via migration SQL raw), index composites sur orders.

Génère le client Prisma. Crée seed.ts avec 2 vendeurs, 10 produits,

2 users test avec relations et événements.

**STEP 0.6 — Migrations SQL + Extensions**

PROMPT: Crée le fichier migrations/001_extensions.sql contenant :

CREATE EXTENSION IF NOT EXISTS vector; (pgvector)

CREATE EXTENSION IF NOT EXISTS unaccent; (FTS sans accents)

Ensuite migrations/002_indexes.sql avec : index GIN FTS sur products

(to_tsvector french, title || description), index ivfflat pgvector sur

products.embedding (lists=100), partial index sur orders WHERE status

NOT IN ('delivered','refunded','cancelled'), index composite sur

orders(buyer_user_id, created_at DESC). Documente chaque index avec

un commentaire SQL expliquant pourquoi il existe.

**STEP 0.7 — Docker Compose Dev**

PROMPT: Crée docker-compose.yml pour l'environnement de développement

local. Services : postgres (image pgvector/pgvector:pg16, port 5432,

volume persistant, health check), redis (image redis:7-alpine, port 6379).

Crée .env.example avec toutes les variables requises (DATABASE_URL,

REDIS_URL, JWT_SECRET, JWT_REFRESH_SECRET, STRIPE_SECRET_KEY,

STRIPE_WEBHOOK_SECRET, VERTEX_AI_PROJECT, VERTEX_AI_LOCATION,

GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APPLE_CLIENT_ID, BREVO_API_KEY).

Ajoute un script scripts/dev-setup.sh qui fait docker compose up -d +

pnpm prisma migrate dev + pnpm prisma db seed.

**STEP 0.8 — Hono API Skeleton**

PROMPT: Dans apps/api/, configure Hono.js avec Node 20. Structure :

src/main.ts (entry point, serve()), src/app.ts (Hono instance, middlewares

globaux), src/routes/ (dossier vide pour l'instant), src/middleware/

(cors, logger, error-handler). Middleware cors : origines depuis ENV.

Middleware error-handler : catch global, log Sentry, retour JSON ApiError.

Middleware logger : log chaque request (method, path, status, duration).

Endpoint GET /health : retourne { status: 'ok', timestamp, version }.

Test Vitest + Supertest : GET /health retourne 200 avec le bon body.

Configure le Dockerfile multi-stage optimise (build + production image).

**STEP 0.9 — Prisma Client + Connection**

PROMPT: Dans apps/api/src/lib/prisma.ts, configure le PrismaClient

singleton (pattern recommandé pour Node.js — évite les connexions multiples).

Logging : query en dev, error en prod. Dans apps/api/src/lib/redis.ts,

configure ioredis avec retry strategy (3 tentatives, backoff exponentiel).

Dans apps/api/src/lib/bullmq.ts, configure la connexion BullMQ partagée.

Test de connexion : script apps/api/src/scripts/test-connections.ts

qui vérifie PostgreSQL + Redis + sort le résultat dans la console.

**STEP 0.10 — CI/CD GitHub Actions**

PROMPT: Crée .github/workflows/ci.yml pour le pipeline CI. Jobs :

1) lint (ESLint + Prettier check sur tout le monorepo),

2) type-check (tsc --noEmit sur tous les packages),

3) test (Vitest sur tous les packages, avec PostgreSQL + Redis

services GitHub Actions pour les tests d'intégration),

4) build (build Turbo de toutes les apps),

5) prisma-check (prisma validate + prisma generate -- dry-run).

Règle CI : tous les jobs doivent passer pour merger sur main.

Ajoute .github/workflows/deploy-staging.yml déclenché sur merge main :

build Docker + push registry + déploiement Railway/Render staging.

### PHASE 1 — Auth (Semaine 3, ~6 Steps)

**STEP 1.1 — JWT Service**

PROMPT: Dans apps/api/src/services/auth/jwt.service.ts, implémente

JwtService avec : issueAccessToken(userId, role): string (exp 15min),

issueRefreshToken(): { token: string, hash: string, familyId: string }

(exp 30 jours, token random 32 bytes, hash bcrypt round 10),

verifyAccessToken(token): JwtPayload | null,

rotateRefreshToken(oldTokenHash, userId): Promise&lt;NewTokens | null&gt;

(implémente token family rotation : si used_at IS NOT NULL → invalide

toute la famille). Tests Vitest complets : emission, vérification,

rotation valide, détection réutilisation (compromis).

**STEP 1.2 — Auth Routes (signup, login, refresh, logout)**

PROMPT: Dans apps/api/src/routes/auth.router.ts, implémente avec Hono:

POST /api/v1/auth/signup (email, password, firstName, lastName →

créer user + émettre tokens + stocker refresh en DB),

POST /api/v1/auth/login (email, password → vérifier hash bcrypt →

émettre tokens), POST /api/v1/auth/refresh (refreshToken body →

rotation → nouveaux tokens), POST /api/v1/auth/logout (invalider

refresh token courant). Validation Zod sur tous les inputs.

Passwords hashés bcrypt 12 rounds. Rate limiting : 5 tentatives/min

sur login par IP (Redis counter). Tests Supertest : tous les happy

paths + cas d'erreur (mauvais mdp, token expiré, token réutilisé).

**STEP 1.3 — OAuth Google & Apple**

PROMPT: Implémente OAuth dans apps/api/src/routes/auth.router.ts.

GET /api/v1/auth/oauth/google : redirect vers Google consent avec

state CSRF, scope email+profile. GET /api/v1/auth/oauth/google/callback :

échange code → access token Google → récupère email+name → upsert user

(créer si inexistant, login si existant) → émet tokens Oreli.

Même pattern pour Apple Sign-In (POST avec id_token Apple).

Stocke provider + providerId dans table user_oauth_accounts.

Test : mock Google token response avec nock → vérifier upsert user.

**STEP 1.4 — Auth Middleware (JWT Guard)**

PROMPT: Dans apps/api/src/middleware/auth.middleware.ts, crée

jwtGuard : middleware Hono qui extrait Bearer token du header,

vérifie avec JwtService, set c.set('userId') et c.set('userRole').

Retourne 401 si token absent/invalide/expiré. Crée sellerGuard :

vérifie que l'user a role=seller, set c.set('sellerId').

Tests : request sans token → 401, token invalide → 401,

token valide → next() appelé avec userId dans context.

### PHASE 2 — Catalog & Seller (Semaine 4-5, ~8 Steps)

**STEP 2.1 — Product Embedding Worker**

PROMPT: Dans apps/api/src/workers/product-embedding.worker.ts,

implémente le BullMQ worker 'product-embedding'. Process :

1) Récupère le produit depuis DB avec ses tags et catégorie,

2) Construit le texte à embedder : title + description + tags + catégorie,

3) Appelle Vertex AI text-embedding-004 (Google ADC auth, task_type:

RETRIEVAL_DOCUMENT), 4) Stocke le vecteur dans products.embedding

via Prisma executeRaw (pgvector UPDATE),

5) Retry 3x avec backoff exponentiel si Vertex AI timeout.

Test : mock Vertex AI avec jest.mock → vérifier que l'embedding

est bien stocké en DB après processing du job.

**STEP 2.2 — Catalog Routes (lecture publique)**

PROMPT: Dans apps/api/src/routes/catalog.router.ts, implémente :

GET /api/v1/products (list avec cursor pagination, filtres : category,

minPrice, maxPrice, isAvailable), GET /api/v1/products/:id (détail

produit avec vendeur + inventory + assets). Cursor basé sur

(created_at, id). Pas d'auth requis (public). Inclus FTS search :

param ?q=chocolat → plainto_tsquery french sur titre+description.

Tests : list pagination, search FTS, produit inexistant → 404.

**STEP 2.3 — Seller Onboarding**

PROMPT: Implémente l'onboarding vendeur dans apps/api/src/routes/

seller.router.ts. POST /api/v1/seller/register : crée user (role=seller)

\+ seller (status=pending) + seller_user link. POST /api/v1/seller/kyb :

upload documents (multer → Cloud Storage private bucket), update

seller.kyb_status=submitted. POST /api/v1/seller/stripe-connect/init :

crée Stripe Connect Express account + retourne onboarding URL.

GET /api/v1/seller/stripe-connect/return : webhook interne appelé

après retour Stripe → vérifier account status → update seller.

SellerOwnershipGuard sur toutes les routes /seller/\* sauf register.

**STEP 2.4 — Seller Product CRUD**

PROMPT: Implémente CRUD produit vendeur (avec SellerOwnershipGuard) :

GET /api/v1/seller/products (liste mes produits, cursor paginated),

POST /api/v1/seller/products (créer produit, status=draft, enqueue

product-embedding job), PUT /api/v1/seller/products/:id (update,

si title ou description change → re-enqueue embedding),

DELETE /api/v1/seller/products/:id (soft delete, status=archived),

PATCH /api/v1/seller/products/:id/inventory (update stock_quantity).

Validation Zod CreateProductDTO. Test SellerOwnershipGuard :

seller A ne peut pas modifier produit de seller B → 403.

### PHASE 3 — Gift Flow & IA (Semaine 6-7, ~7 Steps)

**STEP 3.1 — Hard Filters SQL**

PROMPT: Dans apps/api/src/services/recommendation/hard-filters.service.ts,

implémente getEligibleProducts(intent: GiftIntentDTO): Promise&lt;Product\[\]&gt;.

Query Prisma $queryRaw avec les filtres : status=active, price BETWEEN

budget_min/max, stock disponible > 0, délai livraison possible (NOW() +

sla_prep_hours + sla_delivery_hours < requested_delivery_datetime),

zone livraison via ST_Contains (PostGIS), seller reliability >= 0.70.

Tests Vitest avec DB de test seedée : vérifier que produits hors budget

sont exclus, produits en rupture exclus, vendeurs inactifs exclus.

**STEP 3.2 — Scoring Engine**

PROMPT: Dans apps/api/src/services/recommendation/scoring.service.ts,

implémente scoreProducts(candidates, intent, relationship, weights,

giftHistory): ProductScore\[\]. Calcul : budget_match (proximité milieu

budget), occasion_match (intersection tags OCCASION_TAG_MAP),

relationship_match (intersection tags RELATION_TAG_MAP),

vector_similarity (passé en param depuis pgvector query),

seller_reliability (direct depuis seller.reliability_score),

popularity (commandes 30j normalisées 0-1), anti_repeat (-0.5 si

déjà offert). Score final pondéré, clampé 0-100. Retourner top 5.

Tests : cas boundary (anti-repeat, fallback < 3 résultats), poids dynamiques.

**STEP 3.3 — pgvector Similarity Search**

PROMPT: Dans apps/api/src/services/recommendation/vector-search.service.ts,

implémente buildContextEmbedding(intent, relationship): Promise&lt;number\[\]&gt;

(text-embedding-004, task_type: RETRIEVAL_QUERY) et

findSimilarProducts(contextVector, candidateIds): Promise&lt;SimilarityResult\[\]&gt;

(query pgvector &lt;=&gt; operator, LIMIT 50, filter sur candidateIds).

Timeout 500ms sur Vertex AI — fallback sur scoring sans vector_similarity

(mettre ce poids à 0) si timeout. Test : mock Vertex AI, vérifier

query pgvector correcte, vérifier fallback sur timeout.

**STEP 3.4 — Justification Generator**

PROMPT: Dans apps/api/src/services/recommendation/justification.service.ts,

implémente generateJustifications(products: ProductScore\[\], intent,

relationship): Promise&lt;Map<string, string&gt;>. Pour chaque produit,

appel Gemini 1.5 Flash en parallèle (Promise.allSettled). Prompt :

max 12 mots, ton chaleureux, sans prix ni score. Timeout 800ms.

Si timeout ou erreur → fallback sur template TypeScript selon

occasion + relationship type (map statique). Jamais de throw —

toujours retourner une justification (fallback si nécessaire).

**STEP 3.5 — Recommendation Endpoint Complet**

PROMPT: Dans apps/api/src/routes/gift.router.ts, implémente

POST /api/v1/gift/recommend (auth requis). Flow complet :

1) Valider GiftIntentDTO avec Zod,

2) Hard filters SQL → pool candidats,

3) Context embedding + pgvector search en parallèle avec hard filters,

4) Scoring engine avec poids depuis system_config,

5) Génération justifications en parallèle,

6) Logging async BullMQ (fire-and-forget, ne pas await),

7) Réponse JSON : top 5 products avec score + justification.

SLA : P95 < 500ms (V1 sans LLM). Log timing de chaque étape.

Tests Supertest : intent valide → 5 recommandations, intent sans résultat

→ 0 résultats + message, fallback budget ±20%.

**STEP 3.6 — Visual Search Endpoint**

PROMPT: Dans apps/api/src/routes/gift.router.ts, ajoute

POST /api/v1/gift/visual-search (auth requis, multipart/form-data).

Handler : 1) Valider image (max 5MB, types jpg/png/webp),

2) Encode base64, 3) Appel Gemini Vision avec prompt extraction attributs

(product_type, style\[\], colors\[\], occasion_tags\[\], price_range, confidence),

4) Si confidence < 0.4 → retourner { fallback: true, searchQuery: ... },

5) Générer embedding depuis attributs extraits, 6) pgvector search,

7) Retourner 5 produits avec label 'match'/'inspired_by'.

Timeout global 2000ms. Test : image mock → vérifier extraction attributs.

### PHASE 4 — Orders & Checkout (Semaine 8, ~6 Steps)

**STEP 4.1 — Stock Reservation (SELECT FOR UPDATE)**

PROMPT: Dans apps/api/src/services/orders/inventory.service.ts,

implémente reserveStock(productId: string, qty: number): Promise&lt;boolean&gt;

via Prisma $transaction + $executeRaw. Query UPDATE inventory SET

reserved_quantity = reserved_quantity + qty WHERE product_id = $id

AND (stock_quantity - reserved_quantity) >= qty. Retourne true si 1 row

updated, false si rupture. releaseStock(productId, qty) : decrement

reserved_quantity. Test concurrence : 2 calls simultanés pour le dernier

item → 1 seul doit réussir.

**STEP 4.2 — Order Creation**

PROMPT: Dans apps/api/src/services/orders/orders.service.ts, implémente

createOrder(dto: CreateOrderDTO, userId: string): Promise&lt;Order&gt;.

Transaction Prisma : 1) Vérifier produits existent et sont actifs,

2) reserveStock pour chaque item, 3) Créer order (status=pending_payment)

\+ order_items + delivery_address_snapshot (JSONB immuable — snapshot à J0),

4) Créer PaymentIntent Stripe (montant total en centimes, metadata orderId),

5) Retourner order + clientSecret Stripe. Si step échoue → rollback +

releaseStock. Test : order créée → stock réservé, Stripe mock appelé.

**STEP 4.3 — Stripe Webhook**

PROMPT: Dans apps/api/src/routes/webhooks.router.ts, implémente

POST /api/v1/webhooks/stripe (no auth, raw body requis).

Valider signature Stripe (stripe.webhooks.constructEvent).

Handler payment_intent.succeeded : update order status=paid, créer

payment record, enqueue notification 'order_paid' BullMQ.

Handler payment_intent.payment_failed : update status=cancelled,

releaseStock, enqueue notification 'payment_failed'.

Handler charge.dispute.created : flag order comme dispute, alerte admin.

Test : mock stripe event avec valid signature → vérifier update DB.

**STEP 4.4 — SSE Tracking**

PROMPT: Dans apps/api/src/routes/orders.router.ts, implémente

GET /api/v1/orders/:id/track (auth requis, SSE). Vérifier ownership

(order.buyer_user_id === userId → 403 sinon). Utiliser streamSSE Hono.

Envoyer statut initial immédiatement. Subscribe Redis channel

'order:{id}:status' via ioredis.subscribe. Sur message → write SSE.

onAbort → unsubscribe Redis. Quand un worker change le statut d'une

commande, il doit publier sur ce channel Redis (ajouter dans order

status update service). Test : mock Redis message → vérifier SSE emit.

### PHASE 5 — Mobile Screens (Semaine 9-11, ~10 Steps)

**STEP 5.1 — Expo Router Setup + Navigation**

PROMPT: Dans apps/mobile/, configure Expo Router v3 avec la structure

app/(auth)/\_layout.tsx (stack auth), app/(tabs)/\_layout.tsx (bottom tabs),

app/(tabs)/index.tsx (home), app/(tabs)/gift.tsx (entry gift flow),

app/(tabs)/orders.tsx, app/(tabs)/relationships.tsx, app/(tabs)/profile.tsx.

Tab icons via Lucide React Native. Design tokens importés de packages/

design-tokens. Bottom tab bar : background warm, active accent, inactive mid.

Configure NativeWind v4 avec tailwind.config.ts consommant les tokens.

**STEP 5.2 — Auth Screens**

PROMPT: Implémente les écrans auth dans app/(auth)/ :

login.tsx (email + password, biométrie si disponible), signup.tsx

(email + password + prénom + nom), oauth-callback.tsx (gestion

deep link retour OAuth). Expo Secure Store pour tokens.

TanStack Query pour calls API auth. Zustand AuthStore :

{ userId, accessToken, isAuthenticated, login(), logout(), refresh() }.

Biométrie : expo-local-authentication, proposée au login si disponible.

Design : Playfair Display pour titre, Inter pour inputs, CTA primary.

**STEP 5.3 — Home Screen + Curated For You**

PROMPT: Implémente app/(tabs)/index.tsx — Home Screen Oreli.

Above the fold : 2 CTA (Faire plaisir / Se faire plaisir) en cards

pleine largeur, design warm avec illustration. Section 'Prochains événements'

(scroll horizontal, cards colorées par urgence). Section 'Curated For You'

(scroll horizontal, endpoint GET /api/v1/home/curated). Bouton appareil

photo (caméra icon) dans header → deep link vers visual search.

Animations Reanimated 3 : fade-in staggered des sections. TanStack Query

avec staleTime 5min pour curated. Skeleton loading pour chaque section.

**STEP 5.4 — Gift Flow Screens (9 écrans)**

PROMPT: Implémente les 9 écrans du gift flow dans app/gift/ :

01-recipient.tsx, 02-budget.tsx (slider + suggestions rapides),

03-occasion.tsx (grille 8 icônes), 04-date.tsx (datepicker + shortcuts),

05-surprise.tsx (3 options illustrées), 06-recommendations.tsx (cards

avec score bar animée + justification IA), 07-product-detail.tsx

(carousel photos + vendeur info), 08-checkout.tsx (Stripe PaymentSheet

\+ Face ID), 09-confirmation.tsx (animation succès confetti gold + ETA).

Zustand GiftIntentStore partagé entre écrans. Progress bar en haut.

UX : 0 → commande en < 60 secondes. Chaque écran max 1 interaction primaire.

**STEP 5.5 — Visual Search Screen**

PROMPT: Implémente app/gift/visual-search.tsx. Interface :

bouton 'Prendre une photo' (expo-camera) + bouton 'Depuis la galerie'

(expo-image-picker). Preview de l'image sélectionnée. State machine :

idle → image_selected → analyzing → results | fallback.

Pendant analyse : animation 'scan' sur l'image (Reanimated 3 sweep).

Résultats : grille 2 colonnes avec badge 'Match' (vert) ou 'Dans l'esprit'

(accent). Bouton 'Affiner avec des mots' si confidence < 0.4 (fallback).

### PHASE 6 — Seller Console (Semaine 12, ~5 Steps)

**STEP 6.1 — Seller Console Setup + Refine**

PROMPT: Configure apps/seller-console/ avec Next.js 14 App Router +

Refine.dev. Data provider : customDataProvider qui wraps tous les appels

vers /api/v1/seller/\* avec Bearer token dans header.

Layout : sidebar navigation (Refine Sider), header avec seller name +

logo. Pages : /dashboard, /orders, /products, /finance, /settings.

Auth : redirect vers /login si token absent. NextAuth avec credentials

provider qui appelle POST /api/v1/auth/login.

**STEP 6.2 — Seller Dashboard**

PROMPT: Implémente la page /dashboard de la Seller Console.

Widgets Refine useList + Recharts : 1) Commandes du jour (count, amount,

urgent en rouge), 2) SLA Performance gauge (taux on-time 30j),

3) Revenue chart semaine/mois (BarChart Recharts), 4) Stock critique

(produits stock < 5, CTA mise à jour rapide), 5) Actions requises

(commandes à accepter avec timer visible — polling 30s).

Design : tokens Oreli, KPI cards avec Playfair Display pour chiffres.

**STEP 6.3 — Order Management Seller**

PROMPT: Implémente /orders dans Seller Console. TanStack Table v8

via Refine useTable : colonnes (statut badge, date, montant, destinataire

anonymisé, actions). Filtres : statut, date range. Cursor pagination.

Detail commande : timeline statuts, timer SLA (rouge si > SLA),

boutons Accepter/Refuser (raison obligatoire si refus), update statuts

séquentiels. Upload preuve livraison via react-dropzone → S3/R2.

### PHASE 7 — QA & Hardening (Semaine 13-14, ~5 Steps)

**STEP 7.1 — Tests Sécurité Critiques**

PROMPT: Écris les tests de sécurité suivants avec Vitest + Supertest :

1) SellerOwnershipGuard : seller A tente GET /seller/orders sur

commande de seller B → 403, 2) Token reuse attack : refresh token

utilisé 2x → révocation famille complète + 401,

3) Rate limiting : 6 tentatives login en 1 min → 429,

4) CORS : request depuis origine non autorisée → reject,

5) SQL injection via champ search : input malveillant → Prisma paramétré

→ pas d'injection possible (vérifier avec EXPLAIN ANALYZE),

6) Webhook Stripe sans signature valide → 400.

**STEP 7.2 — OpenTelemetry + Sentry + PostHog**

PROMPT: Instrumente toutes les apps avec observabilité.

OpenTelemetry dans apps/api/src/main.ts (5 lignes, SDK Node, OTLP exporter).

Sentry dans apps/api (erreurs non catchées + slow transactions).

Sentry dans apps/mobile (crash reporting React Native).

PostHog events critiques à tracker : user_signed_up, gift_intent_created,

recommendation_shown, product_detail_viewed, checkout_started, order_paid,

order_repeat. Ajoute tracking_service.ts qui wrap posthog.capture()

avec userId anonymisé (RGPD).

**STEP 7.3 — RGPD Endpoints**

PROMPT: Implémente les endpoints RGPD requis dans users.router.ts :

DELETE /api/v1/users/me : anonymise user (email → deleted_UUID@oreli.com,

nom → 'Compte supprimé', supprime adresses et tokens, conserve orders

anonymisés pour compliance comptable). GET /api/v1/users/me/export :

retourne ZIP avec JSON de toutes les données utilisateur (orders, proches,

préférences, historique). Dans BigQueryExportWorker, vérifier que

user_id est remplacé par hash pseudonymisé avant export ML.

## 22.4 Règles Anti-Dette Technique — Non Négociables

_Ces règles s'appliquent à chaque STEP, sans exception. Claude Code doit les respecter — si un prompt génère du code qui les viole, rejeter le code et relancer avec ces contraintes explicites._

|     |     |     |
| --- | --- | --- |
| **Règle** | **Vérification** | **Conséquence si violation** |
| Zéro any TypeScript | tsc --noEmit doit passer sans erreur | CI bloqué — ne pas merger |
| Tests avant merge | Coverage > 80% sur services core | CI bloqué — ne pas merger |
| Pas de secret en clair | grep -r 'sk_live\\\|secret' --include='\*.ts' doit retourner vide | Revert immédiat |
| Zod sur tous les inputs | Chaque endpoint a un validator Zod avant toute logique | Audit mensuel |
| SELECT FOR UPDATE sur stock | Toute modification inventory doit être dans $transaction | Race condition bug prod |
| SellerOwnershipGuard sur /seller/\* | Test automatisé cross-seller sur chaque nouvelle route | Faille sécurité critique |
| Cursor pagination partout | Aucun LIMIT/OFFSET — uniquement cursor (created_at, id) | Performance dégradée à scale |
| API versioning /api/v1/ | Tous les endpoints préfixés dès le premier commit | Breaking change mobile impossible |

## 22.5 Prompt Master — Context Injection

_Ce prompt est à injecter au début de chaque session Claude Code pour garantir la cohérence architecturale. Sauvegarde-le dans .claude/context.md à la racine du monorepo._

\# ORELI.AI — CONTEXTE ARCHITECTURAL CLAUDE CODE

\## Stack

\- Backend : Hono.js (Node 20) sur apps/api/

\- DB : PostgreSQL 15 + pgvector via Prisma

\- Cache/Queue : Redis + BullMQ

\- Mobile : React Native Expo SDK 51 Bare + Expo Router v3

\- Web : Next.js 14 App Router

\- IA : Vertex AI (Gemini 1.5 Flash + text-embedding-004)

\- Design : tokens dans packages/design-tokens/, NativeWind

\## Règles Absolues

\- Zéro 'any' TypeScript

\- Zod validation sur tous les inputs API

\- SellerOwnershipGuard sur TOUTES les routes /seller/\*

\- SELECT FOR UPDATE dans $transaction pour inventory

\- Cursor pagination (created_at + id) — jamais LIMIT/OFFSET

\- Tous les endpoints /api/v1/

\- Tests Vitest pour chaque fonction service

\## Patterns à Suivre

\- Auth : JWT 15min + refresh tokens (table refresh_tokens, family rotation)

\- Erreurs : toujours ApiError { code, message, details } en JSON

\- Logging : structured JSON, pas de console.log

\- Secrets : toujours depuis process.env, jamais en dur

\## Ce qui N'est Pas Encore Implémenté (ne pas inventer)

\- \[Mettre à jour cette liste au fur et à mesure\]

# 20\. STRATÉGIE MARKETING, COMMUNICATION & ACTIVATION

_"La meilleure technologie ne se vend pas seule. Oreli doit exister dans la tête des Bruxellois avant qu'ils en aient besoin — pour être là quand l'urgence arrive."_

## 20.1 Positionnement de Marque — La Plateforme Émotionnelle

### Territory de Marque

Oreli n'est pas un site de cadeaux. Oreli est le complice intelligent de ceux qui tiennent à bien offrir, sans que ça devienne une corvée. La marque occupe le territoire de l'attention intentionnelle — je prends soin des gens que j'aime, et Oreli me permet de le faire mieux.

|     |     |     |
| --- | --- | --- |
| **Dimension** | **Oreli est...** | **Oreli n'est jamais...** |
| Ton | Chaleureux, direct, complice | Corporate, formel, excessivement émojisé |
| Registre | Confiant sans arrogance — expert mais accessible | Techno-froid, ou au contraire trop 'fun' |
| Promesse | Le bon cadeau, au bon moment, sans effort | Le moins cher / le plus rapide |
| Valeurs | Curation, soin, confiance, pertinence | Quantité, promo, discount agressif |
| Persona marque | L'ami de confiance qui connaît Bruxelles et comprend les gens | Le comparateur ou l'agrégateur |

### Signature Ligne

_Oreli — Offrir avec intention._

### Taglines Secondaires (A/B Test)

- 'Le cadeau parfait. Livré demain.'
- 'Votre concierge cadeau, à Bruxelles et au-delà.'
- 'Moins de stress, plus d'émotion.'

## 20.2 Stratégie Digitale — Architecture des Canaux

|     |     |     |     |
| --- | --- | --- | --- |
| **Canal** | **Rôle** | **Budget V1** | **KPI Principal** |
| Meta Ads (Instagram/Facebook) | Acquisition acheteurs — ciblage socio-démo + intérêts | 2 500 EUR/mois | CPA < 12 EUR |
| Google Ads (Search) | Capture intention forte — 'cadeau livraison bruxelles' | 1 500 EUR/mois | ROAS > 4x |
| TikTok Ads V2 | Génération awareness 25-35 ans — format court émotionnel | 0 EUR V1 | CPM < 5 EUR |
| LinkedIn (B2B) | Corporate Gifting V3 — décideurs RH/Com | 0 EUR V1 | Leads qualifiés |
| SEO / Contenu | Traffic organique longue traîne — guides cadeaux | Temps seul en V1 | Sessions organiques |
| Email / Brevo | Nurturing, rappels, newsletter | ~16 EUR/mois (infra) | Open rate > 28% |
| Micro-Influence | Social proof local Bruxelles | 2 000-5 000 EUR one-shot | Mentions, followers |
| Referral in-app | Acquisition virale — invite 3 amis → crédit | 5 EUR/user converti | Viral coefficient |

## 20.3 Campagnes Lancement — 4 Phases

### Phase 0 — Pré-Lancement : 'L'Attente Qui Crée Le Désir' (J-90 à J-30)

_Objectif : 500 emails waitlist + 25 vendeurs recrutés. Pas de produit à vendre encore — on vend le problème résolu._

- Landing waitlist épurée : une seule promesse, un seul CTA — email + prénom + occasion principale
- Série de posts Instagram 'Le problème du cadeau' — stats émotion, témoignages frustration, sans montrer le produit
- Teaser produit J-14 : vidéo 15s — giftwrap qui s'ouvre, révèle interface Oreli, no voix off
- Referral waitlist : 'Invitez 3 amis → passez en tête de liste + crédit 10 EUR'
- Outreach vendeurs : LinkedIn + email direct aux boutiques premium Bruxelles — deck 1 page vendeur

### Phase 1 — Soft Launch : 'Le Club des Premiers' (J-30 à J0)

_Objectif : 100-300 commandes test. Bêta privée — invitation seulement. Crée la FOMO et le sentiment d'exclusivité._

- Email waitlist : invitations par vagues de 50 — 'Vous êtes parmi les premiers 500'
- Unboxing content : les premiers acheteurs reçoivent une surprise packaging — incitation naturelle à poster
- WhatsApp community fondateur : groupe des premiers utilisateurs — feedback direct, sentiment d'appartenance
- PR : pitch à Moustique, Trends, RTBF Style — 'La startup bruxelloise qui réinvente le cadeau'

### Phase 2 — Launch : 'Bruxelles Offre Mieux' (J0 à J+60)

_Objectif : 2 000 commandes, 5 000 app installs. Acquisition payante activée. Message principal : urgence résolue + émotion._

- Campaign Instagram/Meta — 3 créatifs A/B : 1) Émotion ('la tête de ta mère en recevant...'), 2) Urgence ('anniversaire demain, livré aujourd'hui'), 3) Produit ('ces chocolats bruxellois ont 4.9 étoiles')
- Google Search — 3 groupes : \[cadeau livraison bruxelles\], \[idée cadeau anniversaire belge\], \[cadeau premium bruxelles\]
- Activation Octobre-Novembre (Black Friday anticipé) — 'Offrez différemment, sans promo massive'
- PR campaign Noël : guide 'Les 10 cadeaux artisanaux bruxellois de Noël 2026' — SEO + presse

### Phase 3 — Rétention : 'L'App Qui Pense Pour Vous' (J+60 → continu)

_Objectif : repeat rate > 25%, conversion FREE → Oreli+. Message : l'app qui se souvient pour vous._

- Push notifications personnalisées — événements proches, inspiration curated
- Email série 'Comment Oreli a appris à mieux vous connaître' — storytelling profil IA
- Campagne Oreli+ : 'Vos frais de service offerts — calculez ce que vous économisez en un an'
- Programme ambassadeur : 5 EUR de crédit pour chaque ami qui commande (double face)

## 20.4 Content Strategy — Piliers Éditoriaux

|     |     |     |     |
| --- | --- | --- | --- |
| **Pilier** | **Thème** | **Format** | **Fréquence** |
| Inspiration | 'Le gift guide de la semaine' — 3 idées par occasion | Carrousel Instagram + article blog | 2x/semaine |
| Vendeurs | Portrait vendeur — 'La chocolatière qui...', 'L'artisan qui...' | Reel 30s + story | 1x/semaine |
| Éducation | 'Pourquoi les cadeaux stressent 70% des Belges' — data + conseil | Article long + infographie | 2x/mois |
| Social Proof | Unboxing acheteurs, témoignages, '4.9 étoiles sur 312 avis' | Repost UGC + story | 3x/semaine |
| Behind the Scenes | Comment Oreli sélectionne ses vendeurs, comment l'IA fonctionne | Story series + LinkedIn | 1x/mois |
| Occasions | Guides por chaque occasion : anniversaire, naissance, mariage... | SEO articles + Pinterest | 1 guide/occasion |

## 20.5 Micro-Influence Bruxelles — Stratégie

### Profils Cibles

- Lifestyle Bruxelles (10K-80K followers) : vie urbaine, resto, shopping, culture — profil Oreli parfait
- Parenthood (5K-40K) : anniversaires enfants, fêtes de famille — occasions récurrentes
- Couple / Romance (8K-50K) : Saint-Valentin, anniversaires couple — panier élevé
- Corporate (LinkedIn 5K+ connexions) : RH, office managers — seed B2B V3

### Modèle de Collaboration

- Gifted order : Oreli offre une commande — influenceur documente l'expérience complète (pas le produit seul)
- Code promo unique tracé : réduction 5 EUR pour leur audience — attribution précise CAC
- Contenu reposté sur @oreli.be + story highlight 'Vu par nos amis'
- Règle : aucun brief créatif imposé — l'authenticité prime. Juste : montrer l'app + l'unboxing.

## 20.6 SEO — Architecture Contenu

|     |     |     |     |
| --- | --- | --- | --- |
| **Type Page** | **Exemple URL** | **Intent** | **Volume estimé BE** |
| Guide occasion | /blog/idees-cadeaux-anniversaire-belgique | Informationnel | 1 200/mois |
| Guide profil | /blog/cadeau-pour-homme-40-ans | Informationnel | 800/mois |
| Page catégorie | /cadeaux/chocolats-artisanaux-bruxelles | Transactionnel | 600/mois |
| Page vendeur | /vendeurs/leonidas-chocolats-bruxelles | Navigationnel | Variable |
| Page occasion | /occasions/anniversaire | Transactionnel | 2 000/mois |
| Livraison locale | /livraison-cadeaux-bruxelles-meme-jour | Transactionnel fort | 1 500/mois |

# 19\. DESIGN SYSTEM & IDENTITÉ VISUELLE ORELI

_Référence inspiratoire : TheMerode (Brussels) — quiet luxury, typographie éditorial, photographie pleine page, chaleur humaine sans ostentation. Traduction pour Oreli : premium émotionnel accessible._

## 19.1 Philosophie Design — 'Warm Precision'

Oreli n'est pas un marketplace froid et transactionnel. C'est un concierge personnel qui comprend l'émotion derrière chaque cadeau. Le design doit incarner cette dualité : précision technologique + chaleur humaine. Chaque pixel doit dire : 'tu peux me faire confiance, et je prends soin de toi'.

|     |     |     |
| --- | --- | --- |
| **Principe** | **Ce que ça signifie** | **Ce que ça interdit** |
| Warm Precision | Lignes nettes + couleurs chaudes — jamais froid ni clinique | Blues froids, grids trop rigides, whitespace stérile |
| Editorial Confidence | Typographie grande, photos pleine largeur, hiérarchie forte | Trop de texte, boutons partout, surcharge visuelle |
| Emotional Honesty | Iconographie humaine, photos de vraies personnes, pas de stock photo générique | Mockups plastiques, photos isolées sur blanc |
| Premium Without Distance | Qualité perçue élevée mais interface accessible — pas d'exclusion | Codes ultra-luxe inaccessibles, termes jargon |
| Purposeful Motion | Animations avec intention — feedback, joie, progression | Animations décoratives sans sens, loaders interminables |

## 19.2 Palette de Couleurs

### Couleurs Primaires

|     |     |     |     |
| --- | --- | --- | --- |
| **Token** | **HEX** | **Usage** | **Inspiration** |
| color-primary | #1A1A2E | Texte principal, headers, CTAs majeurs | Encre de nuit — autorité douce |
| color-accent | #C9A84C | Highlights, badges premium, CTA secondaires, dividers | Or belge — Merode influence |
| color-warm | #F5F0E8 | Background principal, surfaces cards | Ivoire chaud — jamais blanc pur |
| color-sand | #E8E2D8 | Borders subtiles, input backgrounds, alt rows | Papier artisanal |
| color-mid | #6B6B6B | Body text secondaire, labels, meta | Ardoise élégante |
| color-white | #FFFFFF | Backgrounds modaux, surfaces élevées | Contraste sur warm |

### Couleurs Sémantiques

|     |     |     |
| --- | --- | --- |
| **Token** | **HEX** | **Usage** |
| color-success | #1E7A4A | Commande confirmée, paiement OK, livraison réussie |
| color-warning | #D97706 | SLA bientôt dépassé, stock faible, rappel urgent |
| color-error | #C0392B | Erreur paiement, rupture stock, commande annulée |
| color-info | #2563EB | SSE update, tracking, notifications info |

## 19.3 Typographie

### Hiérarchie Typographique

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| **Niveau** | **Font** | **Taille mobile** | **Taille web** | **Usage** |
| Display | Playfair Display (serif) | 32sp | 56px | Hero landing, grands titres sections |
| H1  | Playfair Display | 28sp | 40px | Titre page, nom produit |
| H2  | Playfair Display Italic | 22sp | 32px | Sous-sections, titres cards |
| H3  | Inter SemiBold | 18sp | 24px | Labels catégorie, titres widgets |
| Body Large | Inter Regular | 16sp | 18px | Description produit, texte principal |
| Body | Inter Regular | 14sp | 16px | Corps de texte, formulaires |
| Caption | Inter Regular | 12sp | 14px | Meta info, timestamps, prix détail |
| Label | Inter SemiBold | 11sp | 13px | Badges, tags, status pills |
| Code | JetBrains Mono | 13sp | 14px | Prix, codes promo, références commande |

_Ratio clé : Playfair Display pour l'émotion et le prestige — Inter pour la clarté fonctionnelle. Ce binôme crée la tension 'warm precision' sans effort._

## 19.4 Composants UI Clés

### Cards Produit — Anatomie

- Image : ratio 4:3, full-bleed, légère ombre portée (elevation 2) — objet mis en valeur
- Badge Vendeur : avatar rond 24px + prénom vendeur + étoile rating — toujours présent
- Badge Urgence (conditionnel) : 'Livraison demain' / 'Dernières pièces' — couleur warning
- Titre : Playfair Display 16sp, max 2 lignes, ellipsis
- Justification IA (en gift flow) : Inter Italic 13sp, couleur mid — max 10 mots
- Prix : Inter SemiBold 18sp primary + 'frais inclus' caption sand
- Score affinité (gift flow seulement) : barre 4px hauteur, gradient accent, animée à l'apparition

### Bouton CTA Principal

- Background : color-primary, radius 12px, padding 16px 32px
- Text : Inter SemiBold 16sp white, letter-spacing 0.5px
- État hover/pressed : légère élévation + couleur accent subtle (pas de changement violent)
- État loading : skeleton shimmer — jamais de spinner isolé
- Taille minimum touch : 48x48dp (WCAG AA)

### Checkout — Micro-Animations

- Ajout au panier : animation 'fly to cart' (product thumbnail → icône panier)
- Paiement réussi : confetti léger (particules dorées) + animation coche verte — 1.5s
- Face ID / Touch ID : animation cercle + scan subtil — < 0.5s
- SSE update statut : toast slide-in bas droite, disparaît auto 3s, couleur selon statut

## 19.5 Design Mobile — Principes Clés

### Home Screen Philosophy

_Inspiration : Spotify home + Calm app — pas de grille saturée. Above the fold = 2 CTA + 1 section curated. Chaque scroll révèle une section avec intention._

- Safe area respectée — pas de contenu sous les encoches / home indicator
- Bottom tab bar : 5 tabs max — Home, Cadeaux (gift flow), Commandes, Proches, Profil
- Haptics : retour tactile sur ajout panier, confirmation paiement, refus (lighter/heavier selon contexte)
- Dark mode : supporté dès V1 — tous les tokens ont leur variante dark
- Accessibility : Dynamic Type iOS / Font Scaling Android supportés — layout flexible

## 19.6 Seller Console — Design Professionnel

_La Seller Console est un outil de travail, pas une vitrine. Design sobre, dense mais lisible, inspiré Stripe Dashboard. Palette identique mais usage plus fonctionnel._

- Sidebar navigation : icons + labels, couleur primary, section grouping
- Tables : striping sand/white, headers primary, actions inline discrètes (icônes, tooltip sur hover)
- KPI Cards : chiffre large Playfair + trend flèche colorée + baseline période précédente
- Alertes SLA : badge rouge animé (pulse) sur commandes en retard — impossible à rater
- Mode dense disponible (toggle) : pour vendeurs qui préfèrent plus d'infos par page

## 19.7 Design Tokens — Implémentation

### Shared Tokens (packages/design-tokens/)

// tokens.ts — partagé mobile + web

export const tokens = {

colors: {

primary: '#1A1A2E',

accent: '#C9A84C',

warm: '#F5F0E8',

sand: '#E8E2D8',

mid: '#6B6B6B',

},

spacing: { xs:4, sm:8, md:16, lg:24, xl:32, xxl:48 },

radius: { sm:4, md:8, lg:12, xl:16, full:9999 },

shadows: {

card: '0 2px 12px rgba(26,26,46,0.08)',

modal: '0 8px 40px rgba(26,26,46,0.18)',

},

typography: {

display: { family:'Playfair Display', weight:700 },

heading: { family:'Playfair Display', weight:400, style:'italic' },

body: { family:'Inter', weight:400 },

label: { family:'Inter', weight:600 },

}

};

Ces tokens sont importés dans NativeWind (mobile) et Tailwind config (web) pour une cohérence parfaite entre plateformes sans duplication.

# SYNTHÈSE EXÉCUTIVE V2

_Oreli V2 est une architecture pragmatique, validée et prête à développer. Chaque décision technique est motivée par un problème concret résolu, pas par une préférence théorique._

| **Dimension** | **Décision Clé V2** | **Bénéfice** |
| --- | --- | --- |
| Performance | Hono.js pour API mobile (cold start < 200ms) | UX fluide sans min-instances coûteux |
| Simplicité | BullMQ uniquement (pas Pub/Sub), PostgreSQL FTS (pas Meilisearch), SSE (pas Firestore) | \-3 services à maintenir en V1 |
| Mobile | React Native Bare + EAS (pas Expo Managed) | Stripe, Face ID, push avancé sans blocage |
| Backoffice | Refine.dev (pas from scratch) | \-4 à 6 semaines de dev |
| Sécurité | JWT family rotation, SellerOwnershipGuard, SELECT FOR UPDATE | Zéro failles classiques |
| IA  | Gemini 1.5 Flash + text-embedding-004 (Vertex AI GCP natif) | Coût < 5 EUR/mois en V1, latence < 2s total |
| Coûts | Infrastructure ~260 EUR/mois, dev 70-90K EUR tout compris | Rationnel pour un seed |
| Timeline | 90 jours de dev → soft launch → premier client réel | Réaliste avec 2 devs ou 1 dev + Claude Code |

# SYNTHÈSE EXÉCUTIVE V3

_Oreli V3 est une vision complète : produit, design, marché, technologie et exécution. Du premier pixel à la première commande, chaque décision est motivée par un problème concret résolu._

|     |     |     |
| --- | --- | --- |
| **Dimension** | **Décision V3** | **Différence vs V2** |
| Surfaces | 6 surfaces : mobile + web acheteur + web acquisition + seller console + admin + email | +1 surface web acheteur |
| Features IA | Visual Search (Gemini Vision) + Curated For You (boost + filtre IA) | 2 nouvelles features différenciantes |
| Design | System 'Warm Precision' — Playfair + Inter, palette ivoire/or/navy, tokens partagés | Identité visuelle complète |
| Marketing | Stratégie 360° — 4 phases, 8 canaux, content pillars, micro-influence Bruxelles | Stratégie complète absent en V2 |
| Stack Solo | Hono seul + Expo Router v3 + Railway/Neon/Upstash = ~70 EUR/mois | Optimisée budget limité + IA |
| Build Guide | 22 STEP atomiques, Spec Manager, prompts Claude Code précis, règles anti-dette | Granularité opérationnelle maximale |

_"La meilleure infrastructure est celle qu'on ne déploie pas. Le meilleur code est celui qu'on n'écrit pas. La meilleure feature V1 est celle qui rapproche du premier euro encaissé."_

# GLOSSAIRE — ACRONYMES & TERMES TECHNIQUES

Ce glossaire recense l'ensemble des acronymes, abréviations et termes techniques utilisés dans ce document. Organisé par domaine pour faciliter la navigation.

## A. Architecture & Backend

| **Acronyme/Terme** | **Forme longue** | **Définition dans le contexte Oreli** |
| --- | --- | --- |
| API | Application Programming Interface | Interface permettant à deux logiciels de communiquer. Dans Oreli : ensemble des endpoints HTTP exposés par le backend Hono.js pour les clients mobile, web et console vendeur. |
| App Router | Application Router (Next.js 14) | Nouveau système de routage de Next.js 14 basé sur le dossier /app. Supporte les React Server Components (RSC), le streaming SSR et les Server Actions. |
| Bare Workflow | Expo Bare Workflow | Mode Expo qui expose le code natif iOS/Android directement. Opposé au Managed Workflow. Requis pour les SDK natifs comme @stripe/stripe-react-native. |
| BullMQ | Bull Message Queue | Bibliothèque Node.js de gestion de queues de tâches asynchrones basée sur Redis. Utilisée pour les jobs asynchrones : notifications, embeddings, paiements planifiés. |
| CI/CD | Continuous Integration / Continuous Deployment | Pipeline automatisé qui teste le code à chaque push (CI) et déploie automatiquement si les tests passent (CD). Oreli : GitHub Actions → Railway/Vercel. |
| CRUD | Create, Read, Update, Delete | Les quatre opérations de base sur une base de données. Refine.dev génère automatiquement des interfaces CRUD pour la Seller Console et le backoffice. |
| CTA | Call To Action | Bouton ou lien incitant l'utilisateur à effectuer une action précise (ex: "Télécharger l'app", "Commander maintenant", "Rejoindre la liste"). |
| EAS | Expo Application Services | Services cloud d'Expo pour builder et déployer les apps React Native : EAS Build (compilation cloud), EAS Submit (publication stores), EAS Update (OTA). |
| ESM | ECMAScript Modules | Système de modules natif JavaScript (import/export). Vitest requiert ESM natif, contrairement à Jest qui utilise CommonJS par défaut. |
| FCM | Firebase Cloud Messaging | Service de push notifications de Google. Utilisé par Oreli pour envoyer les notifications iOS/Android (statuts commande, rappels événements). |
| FTS | Full-Text Search | Recherche en texte intégral dans PostgreSQL via index GIN. Remplace Meilisearch en V1 — suffisant pour catalogue < 10 000 produits. |
| GIN | Generalized Inverted Index | Type d'index PostgreSQL optimisé pour les recherches full-text et les tableaux. Utilisé pour accélérer la recherche dans le catalogue produits Oreli. |
| HTTP | HyperText Transfer Protocol | Protocole de communication entre client et serveur web. Oreli utilise HTTPS (version sécurisée TLS) pour toutes les communications. |
| ISR | Incremental Static Regeneration | Fonctionnalité Next.js permettant de régénérer les pages statiques en arrière-plan à intervalles définis (ex: 5 min pour le catalogue). Combine performances statiques et fraîcheur des données. |
| JWT | JSON Web Token | Standard de tokens d'authentification signés cryptographiquement. Oreli utilise : Access Token (15 min) + Refresh Token (30 jours) avec rotation de famille. |
| KYB | Know Your Business | Processus de vérification d'identité des vendeurs professionnels. Requis par PSD2 et Stripe Connect. Documents : pièce d'identité + extrait BCE + RIB. |
| ORM | Object-Relational Mapper | Couche d'abstraction entre le code et la base de données. Oreli utilise Prisma — génère des requêtes SQL sécurisées depuis TypeScript. |
| OTA | Over-The-Air (update) | Mise à jour de l'app React Native sans passer par les stores Apple/Google. Possible uniquement pour le code JavaScript (pas le code natif). |
| RSC | React Server Components | Composants React rendus côté serveur, sans JavaScript côté client. Améliore les performances et le SEO dans Next.js 14 App Router. |
| SSE | Server-Sent Events | Protocole web permettant au serveur d'envoyer des données en temps réel vers le client (unidirectionnel). Oreli l'utilise pour le tracking des commandes en temps réel. |
| SSR | Server-Side Rendering | Génération des pages HTML côté serveur à chaque requête. Utilisé pour le SEO des pages produits et l'affichage des données fraîches. |
| TLS | Transport Layer Security | Protocole de chiffrement des communications réseau. La base du HTTPS. Toutes les communications Oreli sont chiffrées via TLS 1.3. |

## B. Intelligence Artificielle & Machine Learning

| **Terme** | **Forme longue** | **Définition dans le contexte Oreli** |
| --- | --- | --- |
| BigQuery | Google BigQuery | Entrepôt de données analytiques de GCP. Oreli l'utilise pour stocker les logs de recommandations IA, entraîner les modèles ML et analyser les comportements acheteurs. |
| Cold Start | Démarrage à froid | Délai d'initialisation d'un service après une période d'inactivité. Problème critique pour Cloud Run : NestJS = 4-8s, Hono.js = < 200ms. Raison principale du choix Hono. |
| Context Embedding | Embedding de contexte | Vecteur numérique représentant le contexte d'un achat (destinataire, occasion, budget, historique). Comparé aux embeddings produits pour trouver les meilleurs matchs. |
| Curated For You | Pour vous — section personnalisée | Section de la page d'accueil combinant produits boostés par les vendeurs (monétisation) et filtrés par l'IA selon le profil utilisateur. |
| Embedding | Représentation vectorielle | Transformation d'un texte ou d'une image en vecteur de nombres (768 dimensions pour text-embedding-004). Permet de calculer une similarité sémantique entre produits et contexte utilisateur. |
| Gemini 1.5 Flash | Modèle de langage multimodal de Google | LLM de Google, version optimisée pour la vitesse et le coût. Utilisé pour : extraction d'intention, génération de justifications, analyse d'images (Visual Search). |
| GCP | Google Cloud Platform | Plateforme cloud de Google. Oreli utilise : Cloud Run, Cloud SQL, Cloud Memorystore, Cloud Storage, Vertex AI, Secret Manager, Cloud Scheduler. |
| LLM | Large Language Model | Modèle de langage à grande échelle entraîné sur d'énormes corpus textuels. Ex : Gemini 1.5 Flash. Utilisé pour extraire l'intention de cadeau et générer des justifications personnalisées. |
| ML  | Machine Learning | Apprentissage automatique — sous-domaine de l'IA. Oreli utilise ML pour les recommandations (pgvector) et l'analyse comportementale (BigQuery + Vertex AI). |
| P95 | Percentile 95 | La valeur en-dessous de laquelle se situent 95% des mesures. Métrique standard de performance. Ex : "P95 < 500ms" signifie que 95% des requêtes répondent en moins de 500ms. |
| pgvector | Extension PostgreSQL pour vecteurs | Extension PostgreSQL permettant de stocker et comparer des vecteurs d'embeddings. Opérateur &lt;=&gt; calcule la distance cosinus entre deux vecteurs. Coeur du moteur de recommandation Oreli. |
| Rules Engine | Moteur de règles | Système de filtrage basé sur des règles prédéfinies (budget, stock, délai, zone de livraison). Utilisé en V1 avant l'activation du LLM — < 100ms de latence. |
| SLA | Service Level Agreement | Engagement contractuel sur les délais de service. Oreli : vendeurs s'engagent sur un délai de préparation (ex: 4h). Le SLA Watcher surveille les dépassements. |
| text-embedding-004 | Modèle d'embedding de Google | Modèle Vertex AI qui convertit du texte en vecteur de 768 dimensions. Utilisé pour créer les embeddings des produits et des contextes utilisateurs. |
| Vertex AI | Plateforme ML de GCP | Plateforme Google Cloud pour l'IA/ML. Fournit l'accès aux modèles Gemini et text-embedding-004 via API. Intégration native avec les autres services GCP. |
| Visual Search | Recherche visuelle | Feature permettant à l'acheteur de prendre une photo pour trouver des produits similaires dans le catalogue. Pipeline : image → Gemini Vision → attributs → embedding → pgvector → 5 résultats. |

## C. Paiements & Conformité

| **Terme/Acronyme** | **Forme longue** | **Définition dans le contexte Oreli** |
| --- | --- | --- |
| 3DS / 3D Secure | 3D Secure (v2) | Protocole d'authentification forte des paiements en ligne. Requis par PSD2 pour les transactions > 30 EUR. Géré automatiquement par Stripe PaymentSheet. |
| BCE / KBO | Banque-Carrefour des Entreprises (Belgique) | Registre officiel des entreprises belges. L'extrait BCE/KBO est un document officiel prouvant l'existence légale d'une entreprise — requis dans le KYB Oreli. |
| DSA | Digital Services Act | Règlement européen (2022) imposant des obligations aux plateformes : transparence du ranking, traçabilité des vendeurs, modération de contenu, signalement illégal. |
| GMV | Gross Merchandise Value | Valeur brute totale des transactions sur la marketplace. KPI principal de santé : GMV = nombre de commandes × panier moyen. Target Oreli V1 : 360K EUR/an. |
| PSD2/PSD3 | Payment Services Directive 2/3 | Directive européenne sur les paiements régulant les prestataires de services de paiement. Impose la SCA, les droits des consommateurs et la licence PSP. |
| PSP | Payment Service Provider | Prestataire de services de paiement. Stripe est le PSP d'Oreli — détient la licence bancaire UE, gère la SCA, les remboursements et les virements vendeurs. |
| RGPD | Règlement Général sur la Protection des Données | Règlement européen (2018) sur la protection des données personnelles. Impose : consentement, droit d'oubli, portabilité, minimisation. Oreli : endpoints DELETE/me + export + pseudonymisation ML. |
| RIB | Relevé d'Identité Bancaire | Document contenant les coordonnées bancaires (IBAN + BIC) d'un compte. Requis dans le KYB vendeur pour la configuration des virements Stripe Connect. |
| SCA | Strong Customer Authentication | Authentification forte imposée par PSD2 : combinaison d'au moins 2 facteurs (possession, connaissance, biométrie). Stripe gère le 3DS/SCA automatiquement. |
| Stripe Connect | Plateforme de paiement split | Solution Stripe pour les marketplaces : permet de recevoir des paiements et de reverser automatiquement la part vendeur. Oreli utilise le mode "Express" (onboarding simplifié). |
| TVA | Taxe sur la Valeur Ajoutée | Taxe européenne sur les ventes. Oreli doit valider le numéro de TVA des vendeurs professionnels lors du KYB. La TVA V3 (multi-pays) sera automatisée. |

## D. Infrastructure & DevOps

| **Terme** | **Forme longue** | **Définition dans le contexte Oreli** |
| --- | --- | --- |
| BetterStack | Plateforme de monitoring | Service de logs centralisés + monitoring d'uptime. Alternative à Datadog, optimisée solo dev. ~24 EUR/mois dans la stack V3. |
| Brevo | Plateforme d'emailing transactionnel | Service d'envoi d'emails (ex-Sendinblue). Utilisé pour les emails transactionnels Oreli : confirmation commande, rappels, notifications. ~16 EUR/mois. |
| Cloud Memorystore | Redis managé GCP | Service Redis managé de Google Cloud. Utilisé par Oreli pour : cache API, sessions, queues BullMQ. Config V1 : M1 Basic 1GB (~30 EUR/mois). |
| Cloud Run | Conteneurs serverless GCP | Service GCP pour déployer des conteneurs Docker sans gérer des serveurs. Scale automatique à 0 — idéal pour le cold start Hono.js. ~8 EUR/mois pour l'API mobile. |
| Cloud SQL | PostgreSQL managé GCP | Service PostgreSQL managé de Google Cloud. Sauvegardes automatiques, haute disponibilité, SSL. Config V1 : db-g1-small (~45 EUR/mois). |
| Cloud Scheduler | Tâches planifiées GCP | Service GCP de planification de tâches cron. Déclenche les jobs BullMQ : event reminders (daily 7h), SLA watcher (toutes 15 min), payouts (vendredis 10h). |
| DXA | Document eXtended Attribute (unit) | Unité de mesure Word/OpenXML. 1 inch = 1440 DXA, 1 cm ≈ 567 DXA. Utilisé pour définir les marges, tailles de colonnes et indentations dans les documents .docx. |
| EAS Build | Expo Application Services Build | Service cloud de compilation des apps React Native. Gère les certificats iOS et Android. ~29 EUR/mois pour le plan Production (builds illimités). |
| Monorepo | Dépôt monolithique multi-packages | Architecture de dépôt Git où plusieurs apps et packages partagent le même repository. Oreli : Turborepo avec apps/ (5 apps) + packages/ (shared-types, prisma, design-tokens). |
| Neon | PostgreSQL serverless | Base de données PostgreSQL serverless avec scale-to-zero. Alternative à Cloud SQL pour la stack solo dev. 3GB gratuit, puis ~15 EUR/mois. |
| OpenTelemetry (OTEL) | Standard d'observabilité open-source | Standard open-source pour collecter traces, métriques et logs. Oreli : instrumenté dès le setup initial (5 lignes). Compatible Cloud Trace GCP et Sentry. |
| PostHog | Plateforme d'analytics produit | Outil open-source d'analytics comportemental. Oreli track les événements critiques : signup, recommendation_shown, checkout_started, order_paid. |
| Railway | Plateforme de déploiement | Alternative à Heroku pour déployer des apps Node.js. Interface simple, déploiement Git automatique. ~10 EUR/mois pour l'API Hono en stack solo. |
| Redis | Remote Dictionary Server | Base de données en mémoire (clé-valeur). Ultra-rapide. Oreli l'utilise pour : cache API, stockage sessions, queues BullMQ, rate limiting. |
| Secret Manager | Gestionnaire de secrets GCP | Service GCP pour stocker et accéder aux secrets (clés API, mots de passe, certificats) de façon sécurisée. Rotation des secrets tous les 90 jours. |
| Sentry | Plateforme de monitoring d'erreurs | Outil de tracking des erreurs en production. Capture les exceptions backend (Hono) et mobile (React Native). ~26 EUR/mois plan Team. |
| Turborepo | Gestionnaire de monorepo | Outil de build system pour monorepos JavaScript/TypeScript. Parallélise les builds, met en cache les résultats. Utilisé par Oreli pour orchestrer les 5 apps. |
| Upstash | Redis serverless | Redis serverless pay-per-request. Alternative à Cloud Memorystore pour la stack solo dev. 0-10 EUR/mois selon usage. |
| Vercel | Plateforme de déploiement Next.js | Plateforme de déploiement optimisée pour Next.js. Héberge les 3 apps web Oreli : web acheteur, seller console, admin. ~20 EUR/mois plan Pro. |

## E. Frontend & Design

| **Terme/Acronyme** | **Forme longue** | **Définition dans le contexte Oreli** |
| --- | --- | --- |
| App Router | Next.js 14 App Router | Nouveau système de routage Next.js (dossier /app). Supporte RSC, streaming, Server Actions. Utilisé pour web acheteur et seller console. |
| CLS | Cumulative Layout Shift | Métriques Core Web Vitals mesurant la stabilité visuelle de la page. Target Oreli : < 0.1. |
| Core Web Vitals | Métriques de performance web Google | Ensemble de métriques SEO/UX de Google : LCP (vitesse chargement), CLS (stabilité), INP (réactivité). Oreli targets : LCP < 1.8s, CLS < 0.1, INP < 200ms. |
| Design Tokens | Variables de design partagées | Variables centralisées définissant les valeurs de design (couleurs, espacements, typographie). Partagées entre mobile (NativeWind) et web (Tailwind). Définis dans packages/design-tokens/. |
| Face ID / Touch ID | Authentification biométrique Apple | Face ID (reconnaissance faciale) et Touch ID (empreinte digitale) sur iOS. Intégré via expo-local-authentication pour valider les paiements Oreli sans saisie de mot de passe. |
| INP | Interaction to Next Paint | Nouvelle métrique Core Web Vitals mesurant la réactivité aux interactions utilisateur. Remplace FID. Target Oreli : < 200ms. |
| LCP | Largest Contentful Paint | Métrique Core Web Vitals mesurant le temps d'affichage du plus grand élément visible. Target Oreli : < 1.8s. |
| NativeWind | Tailwind CSS pour React Native | Adaptation de Tailwind CSS pour React Native. Permet d'utiliser les classes Tailwind directement dans les composants mobile. Consomme les design tokens Oreli. |
| OTA Update | Over-The-Air Update | Mise à jour du code JavaScript React Native sans passer par l'App Store. Limite : seul le bundle JS est mis à jour, pas le code natif. |
| Refine.dev | Framework backoffice React | Framework open-source React pour interfaces d'administration. Génère tables, filtres, formulaires CRUD. Économie estimée : 4-6 semaines de dev. Utilisé pour seller console et backoffice. |
| ROAS | Return on Ad Spend | Retour sur dépenses publicitaires. ROAS = revenus générés / budget publicitaire. Target Oreli Google Ads : > 4x (4 EUR générés pour 1 EUR dépensé). |
| SEO | Search Engine Optimization | Optimisation pour les moteurs de recherche. Oreli cible la longue traîne locale : "cadeau livraison bruxelles", "idée cadeau anniversaire belge". |
| Tailwind CSS | Framework CSS utility-first | Framework CSS basé sur des classes utilitaires. Oreli l'utilise pour tous les frontends web (seller console, web acheteur, admin, site acquisition). |
| TanStack Query (v5) | Bibliothèque de gestion de server state | Anciennement React Query. Gère le cache des données serveur, les refetch automatiques, les états de chargement. Utilisé dans toutes les apps React d'Oreli. |
| Warm Precision | Philosophie design Oreli | Concept design d'Oreli : combinaison de lignes nettes (précision) et de couleurs chaudes (chaleur humaine). Inspiré de TheMerode Brussels. Traduit par la palette ivoire/or/navy. |

## F. Business & Marketplace

| **Terme/Acronyme** | **Forme longue** | **Définition dans le contexte Oreli** |
| --- | --- | --- |
| AOV | Average Order Value | Panier moyen — valeur moyenne d'une commande. AOV Oreli cible : 60 EUR. KPI clé pour les projections de revenus (GMV = commandes × AOV). |
| B2B | Business to Business | Commerce entre entreprises. Oreli V3 : Corporate Gifting B2B — entreprises qui commandent des cadeaux en volume pour leurs employés ou clients. |
| B2C | Business to Consumer | Commerce entre entreprise et particulier. Modèle principal Oreli V1 : particuliers acheteurs sur l'app mobile ou le web acheteur. |
| Benelux | Belgique + Pays-Bas + Luxembourg | Zone géographique cible de l'expansion V2 d'Oreli après la validation du marché belge (Bruxelles en V1). |
| CAC | Customer Acquisition Cost | Coût d'acquisition d'un client. CAC target Oreli : 8-12 EUR (Meta Ads CPA < 12 EUR). CAC doit être inférieur à la LTV pour la rentabilité. |
| CPA | Cost Per Acquisition | Coût par acquisition — combien dépenser en publicité pour obtenir une commande. Target Meta Ads Oreli : < 12 EUR. |
| FOMO | Fear Of Missing Out | Peur de rater quelque chose. Mécanisme psychologique de marketing utilisé dans la Phase 1 (Soft Launch) — bêta privée sur invitation crée l'exclusivité et l'envie. |
| Gifting | Le marché du cadeau | Secteur e-commerce dédié aux cadeaux. Marché total Europe : ~45 Mds EUR. Belgique : ~2,8 Mds EUR. Croissance portée par la mobile-ification et la personnalisation. |
| GTM | Go-To-Market (stratégie) | Plan d'action pour lancer un produit sur un marché : cible, canaux, message, pricing, partenariats. Oreli : wedge initial Bruxelles → 25 vendeurs sélectionnés → gifting B2C premium. |
| KPI | Key Performance Indicator | Indicateur clé de performance. KPIs Oreli V1 : GMV, AOV, commandes/mois, repeat rate, vendeurs actifs, CPA, app rating stores. |
| LTV | Lifetime Value | Valeur totale générée par un client sur sa durée de vie. LTV Oreli estimé : 3-4 achats/an × 60 EUR × commission 30% = ~54-72 EUR. LTV > CAC = business viable. |
| Marketplace | Plateforme de mise en relation | Plateforme connectant acheteurs et vendeurs. Oreli est une marketplace two-sided : côté acheteur (app mobile + web) + côté vendeur (seller console). Commission sur chaque transaction. |
| MVP | Minimum Viable Product | Version minimale du produit permettant de valider les hypothèses avec de vrais utilisateurs. MVP Oreli V1 : gift flow + catalogue + checkout + tracking SSE, sans LLM. |
| PR  | Public Relations | Relations publiques. Dans le plan marketing Oreli : pitch aux médias belges (Moustique, Trends-Tendances, RTBF Style) pour couverture éditoriale du lancement. |
| Repeat Rate | Taux de réachat | Pourcentage de clients qui recommandent après leur premier achat. Target Oreli V1 : > 25%. KPI clé de rétention — directement lié à la satisfaction gifting. |
| Take Rate | Taux de commission | Pourcentage prélevé par la marketplace sur chaque transaction. Oreli : 28-30% de commission sur le prix vendeur, soit ~17 EUR sur un panier de 60 EUR. |
| Two-Sided Marketplace | Marketplace biface | Marketplace avec deux types d'utilisateurs distincts : acheteurs et vendeurs. Chaque côté crée de la valeur pour l'autre. Problème : chicken-and-egg (qui vient en premier ?). |
| Wedge | Point d'entrée stratégique | Niche initiale choisie pour entrer sur un marché. Wedge Oreli : cadeaux de luxe accessibles à Bruxelles, livraison même jour. Verticale pour valider avant d'élargir. |

## G. Sécurité & Authentification

| **Terme/Acronyme** | **Forme longue** | **Définition dans le contexte Oreli** |
| --- | --- | --- |
| bcrypt | Algorithme de hachage de mots de passe | Algorithme cryptographique pour hasher les mots de passe. Inclut un "salt" aléatoire pour résister aux attaque rainbow table. Oreli : round 10 pour les refresh tokens. |
| Biometric Auth | Authentification biométrique | Vérification d'identité via empreinte ou reconnaissance faciale. Oreli utilise expo-local-authentication pour valider les paiements (Face ID / Touch ID). |
| Cross-Seller | Accès cross-vendeur | Scénario de sécurité où un vendeur tente d'accéder aux données d'un autre vendeur. Protégé par SellerOwnershipGuard qui filtre systématiquement par JWT sellerId. |
| Guard (Auth Guard) | Middleware de protection de route | Middleware Hono/NestJS qui vérifie les droits d'accès avant d'exécuter la logique métier. SellerOwnershipGuard sur toutes les routes /seller/\*. |
| IBAN | International Bank Account Number | Numéro de compte bancaire international standardisé. Format : BE + 2 chiffres contrôle + 12 chiffres. Requis dans le RIB lors du KYB vendeur. |
| Keychain / Keystore | Stockage sécurisé OS mobile | Mécanisme de stockage sécurisé natif iOS (Keychain) et Android (Keystore). Accédé via expo-secure-store. Jamais AsyncStorage pour les tokens d'authentification. |
| Rate Limiting | Limitation de débit | Mécanisme limitant le nombre de requêtes autorisées par IP ou par utilisateur dans une fenêtre temporelle. Protège contre le brute force et les attaques DDoS. |
| Salt | Sel cryptographique | Valeur aléatoire ajoutée au mot de passe avant hachage pour empêcher les attaque par tables précomputées. Généré automatiquement par bcrypt. |
| SELECT FOR UPDATE | Verrou de ligne SQL | Instruction SQL qui verrouille les lignes sélectionnées pendant une transaction. Utilisé par Oreli pour éviter les race conditions sur les stocks (vente double du même article). |
| SellerOwnershipGuard | Guard d'isolation multi-tenant | Middleware custom Oreli qui vérifie que le vendeur authentifié ne peut accéder qu'à ses propres données. Appliqué systématiquement sur toutes les routes /api/v1/seller/\*. |
| Token Family Rotation | Rotation de famille de tokens | Mécanisme de sécurité des refresh tokens : chaque refresh génère un nouveau token et invalide l'ancien. Si un token déjà utilisé est réutilisé → toute la famille est révoquée (détection de vol). |
| Zod | Bibliothèque de validation TypeScript | Bibliothèque TypeScript pour définir des schémas de validation. Oreli : obligatoire sur tous les inputs API (zéro body non validé). Partagé entre backend et frontend. |

## H. Spécifique Oreli

| **Terme/Acronyme** | **Forme longue** | **Définition dans le contexte Oreli** |
| --- | --- | --- |
| Affinity Scoring | Score d'affinité | Score calculé par l'IA estimant la pertinence d'un produit pour un destinataire donné. Prend en compte : historique, préférences connues, occasion, budget. |
| Control Tower | Tour de contrôle — backoffice Oreli | Interface backoffice interne d'Oreli. Permet à l'équipe Oreli de gérer les vendeurs, modérer les commandes, tuner les paramètres IA et suivre les KPIs en temps réel. |
| GiftIntent | Intention de cadeau | Objet représentant l'intention d'achat d'un cadeau : destinataire, budget, occasion, date, niveau de surprise. Capturé via le Gift Flow et utilisé pour les recommandations IA. |
| Gift Flow | Flux de commande cadeau | Parcours utilisateur de la sélection du destinataire jusqu'à la confirmation de commande. Objectif : < 60 secondes. 8-9 écrans (mobile) ou stepper 5 étapes (web). |
| Hardening | Durcissement sécuritaire | Phase de renforcement de la sécurité avant la mise en production. Oreli Sprint S6 : audit sécurité, RGPD checks, performance tests, bug fixes critiques. |
| Mode Surprise | Mode de recommandation automatique | Option Gift Flow où Oreli choisit le produit final sans que l'acheteur le voie. Acheteur valide uniquement le budget — crée une vraie surprise pour le destinataire. |
| Oreli+ | Abonnement premium Oreli | Niveau d'abonnement payant V2. Fonctionnalités supplémentaires : rappels proactifs, cadeaux groupés, accès prioritaire aux nouvelles collections, historique étendu. |
| Relationship Graph | Graphe relationnel | Représentation des proches de l'utilisateur avec leurs préférences, dates importantes et historique de cadeaux. Alimenté manuellement + suggestions IA. Base des recommandations personnalisées. |
| Seller Boost Pool | Système de mise en avant payante | Mécanisme de monétisation V2 : les vendeurs paient pour inclure leurs produits dans un "pool" de produits éligibles à la mise en avant. L'IA filtre parmi ce pool selon la pertinence utilisateur. |
| Soft Launch | Lancement doux | Lancement du produit en accès restreint (bêta privée sur invitation) avant l'ouverture publique. Permet de valider le produit avec de vrais utilisateurs sans les risques d'un launch public. |
| Snapshot produit | Instantané produit | Copie des données produit (titre, prix, photos) sauvegardée dans la commande au moment de l'achat. Protège contre les modifications ultérieures du catalogue vendeur. |
| Waitlist | Liste d'attente | Liste de personnes ayant exprimé leur intérêt avant le lancement. Objectif Phase 0 Oreli : 500 emails. Créer l'anticipation et valider la demande avant d'investir dans l'acquisition. |