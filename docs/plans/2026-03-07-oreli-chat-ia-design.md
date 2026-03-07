# Design — Oreli Chat IA (Conversation Gifting)

**Date :** 2026-03-07
**Statut :** Validé
**Priorité :** P0 — cœur de l'offre produit

---

## Problème

Le gift flow actuel est un wizard déguisé en chat : les messages d'Oreli sont hardcodés, les chips sont prédéfinies, et il n'y a aucune intelligence sur les goûts du destinataire. Oreli pose toujours les mêmes 5 questions dans le même ordre, même quand elle a déjà les réponses.

Résultat : la promesse "enlever la charge mentale du cadeau" n'est pas tenue. C'est un formulaire avec une UI de chat.

---

## Vision

Oreli est un concierge gifting. Elle **conduit** la conversation, utilise ce qu'elle sait déjà, pose uniquement les questions manquantes, et arrive à une recommandation en **3-4 échanges maximum**. L'utilisateur ne remplit jamais un formulaire — il répond à quelqu'un qui le connaît.

---

## Architecture

### LLM choisi : Gemini 1.5 Flash via Google AI Studio

- Tier gratuit : 1 500 req/jour, 1M tokens/min — suffisant pour toute la V1
- Pas de carte bancaire pour démarrer
- Migration vers Vertex AI (data residency EU) transparente quand nécessaire
- Prévu dans `oreli.md` — les prompts sont déjà spécifiés

### Principe : stateless côté serveur

Le client envoie **l'historique complet** à chaque appel. Pas de session côté API. Simple, scalable, testable.

---

## Section 1 — Conversation

### Règle fondamentale

Oreli ne demande jamais ce qu'elle peut déduire du contexte. Si l'utilisateur arrive depuis la fiche d'un proche, elle ne demande pas "pour qui ?".

### Informations à collecter (dans l'ordre de priorité)

| Info | Obligatoire | Source possible |
|------|-------------|-----------------|
| Proche | Oui | Contexte d'entrée ou question |
| Occasion | Oui | Contexte d'entrée (événement) ou question |
| Budget | Oui | Question |
| Date souhaitée | Oui | Contexte d'entrée (événement) ou question |
| Préférences destinataire | Non — mais décisif | Profil relationship en BDD |
| Mode surprise | Non — défaut `manual` | Question si pertinent |

### Points d'entrée et contexte pré-chargé

| Point d'entrée | Contexte disponible | Ce qu'Oreli demande |
|----------------|--------------------|--------------------|
| Clic "Offrir" sur un proche | `relationshipId` + préférences | Occasion → Budget → Date |
| Card événement (anniversaire) | `relationshipId` + `occasion` + `suggestedDeliveryDate` | Budget uniquement |
| Bouton "Offrir" sur un produit | `productId` | Pour qui → Date |
| Bouton "Offrir" générique (home) | Rien | Tout (max 4 tours) |
| Re-commande | Tout sauf date | Confirmer ou changer |

### Exemple de conversation — entrée depuis un proche

```
[Contexte: relationshipId=sophie, preferences: {likes: ["chocolat", "yoga"]}]

Oreli  → "Sophie a de la chance ! 🎁 C'est pour quelle occasion ?"
          [Anniversaire] [Saint-Valentin] [Juste comme ça] [Autre]

User   → "Son anniversaire vendredi"

Oreli  → "Quel budget as-tu en tête ?"
          [~30€] [~50€] [~80€] [100€+]

User   → clique 50€

         → ready: true → recommandation

Oreli  → "J'ai trouvé 3 cadeaux parfaits pour Sophie 🎁"
          [cards avec justification Gemini]
```

### Mode Surprise Totale

Oreli collecte les mêmes informations mais ne montre aucune liste. Elle confirme directement et passe au checkout avec le produit #1 du scoring.

> *"C'est réglé. Un cadeau parfait pour Sophie sera livré vendredi. 🎁"*

Condition : `score >= 65/100`. Sinon, Oreli propose automatiquement le mode guidé.

### Contrainte de longueur

- Maximum 4 tours avant de recommander
- Si le 4ème tour est atteint sans toutes les infos → Oreli complète avec des valeurs par défaut raisonnables et recommande quand même
- Jamais de message "Je n'ai pas compris" — Oreli reformule toujours positivement

---

## Section 2 — API

### Endpoint

```
POST /api/v1/gift/chat
Authorization: Bearer <token>  (optionnel — guests autorisés)
```

### Request

```typescript
interface GiftChatRequest {
  messages: {
    role: 'user' | 'oreli';
    text: string;
  }[];
  context?: {
    relationshipId?: string;      // proche pré-sélectionné
    productId?: string;           // produit pré-sélectionné
    occasion?: string;            // depuis un événement calendrier
    suggestedDeliveryDate?: string; // date de l'événement (ISO)
  };
}
```

### Response

```typescript
interface GiftChatResponse {
  message: string;              // texte d'Oreli
  suggestions: string[];        // 3-4 chips cliquables
  intent: {                     // état collecté jusqu'ici
    relationshipId?: string;
    budgetMin?: number;         // centimes EUR
    budgetMax?: number;
    occasion?: string;
    deliveryDate?: string;      // ISO date
    surpriseMode?: 'total' | 'controlled' | 'manual';
  };
  ready: boolean;               // true = Oreli a tout
  products?: RecommendedProduct[]; // présent si ready: true
}
```

Quand `ready: true`, les produits sont dans la même réponse — zéro aller-retour supplémentaire.

### Pipeline interne du endpoint

```
1. Charger le profil des proches de l'utilisateur (depuis DB)
2. Construire le system prompt Gemini avec contexte + proches + date
3. Appeler Gemini 1.5 Flash (réponse JSON forcée)
4. Parser + valider la réponse Zod
5. Si ready: true → appeler recommendProducts(intent) (moteur existant)
6. Retourner GiftChatResponse
```

### System prompt Gemini

```
Tu es Oreli, un concierge gifting premium, chaleureux et efficace.
Ton rôle : collecter les informations nécessaires pour recommander
le cadeau parfait, en 3-4 échanges maximum.

RÈGLES :
- Ne demande jamais ce que tu peux déduire du contexte
- Si les préférences du proche sont connues, utilise-les sans les redemander
- Si les préférences sont inconnues, pose UNE question ouverte
  ("C'est quel genre de personne ?")
- Maximum 4 tours. Au 4ème, recommande avec ce que tu as.
- Ton : chaleureux, bref, jamais condescendant, jamais robotique
- Suggestions : 3-4 chips pertinentes au contexte actuel
- Dès que tu as { relationshipId, budget, occasion, deliveryDate } → ready: true

INFORMATIONS DISPONIBLES :
- Date actuelle : {currentDate}
- Proches de l'utilisateur : {relationshipsJSON}
- Contexte d'entrée : {contextJSON}

Réponds UNIQUEMENT en JSON valide, sans markdown :
{
  "message": "...",
  "suggestions": ["...", "...", "..."],
  "intent": {
    "relationshipId": null,
    "budgetMin": null,
    "budgetMax": null,
    "occasion": null,
    "deliveryDate": null,
    "surpriseMode": "manual"
  },
  "ready": false
}
```

---

## Section 3 — Surfaces

### Mobile — `apps/mobile`

**`gift-flow.tsx` est refactorisé** : même UI (bulles, chips, input libre), state machine hardcodée remplacée par `useGiftChat(context)`.

```typescript
// Nouveau hook
function useGiftChat(context: GiftChatContext) {
  // - Maintient l'historique messages[]
  // - Envoie POST /gift/chat à chaque message user
  // - Expose: { messages, suggestions, products, isLoading, sendMessage }
}
```

**Points d'entrée qui alimentent le contexte :**
- `close.tsx` → bouton "Offrir" → `{ relationshipId }`
- `(tabs)/index.tsx` → card événement → `{ relationshipId, occasion, suggestedDeliveryDate }`
- `product/[id].tsx` → bouton "Offrir ce cadeau" → `{ productId }`
- Bouton flottant home → `{}` (contexte vide)

**Cards produits** : inchangées visuellement. Ajout d'une ligne de justification Gemini sous le titre (`"Artisanal bruxellois, livrable vendredi — parfait pour Sophie"`).

### Web — `apps/web`

Nouvelle page `/gift` avec le même pattern chat en colonne centrale. Même hook `useGiftChat`, même endpoint. Points d'entrée :
- `product/[id]` → bouton "Offrir" → `/gift?productId=...`
- Home → CTA principal → `/gift`
- Futur : email de rappel → `/gift?relationshipId=...&occasion=birthday`

### Ce qui ne change pas

- `checkout.tsx`, `checkout/page.tsx` — inchangés
- `order/[id].tsx` — inchangé
- `POST /gift/recommend` reste — le chat l'appelle en interne quand `ready: true`

---

## Section 4 — Seed Data

### Script `apps/api/prisma/seed.ts`

Lancé avec `pnpm seed`. Toutes les entités ont `metadata: { isTestData: true }`.
Suppression propre avec `pnpm seed:clean` (ne touche pas aux vraies données).

### Contenu

**1 utilisateur de test**
```
email: test@oreli.ai
password: Test1234!
```

**5 sellers Brussels**
| Nom | Catégorie principale |
|-----|---------------------|
| Maison Cacao | Chocolat |
| L'Apothicaire Bruxelles | Bien-être |
| Cave du Sablon | Gastronomie |
| Atelier Brussel | Accessoires |
| Expériences & Co | Expériences |

**25 produits** répartis sur 5 catégories, avec :
- Tags (romantique, artisanal, local, wellness, gourmet, couple, femme, homme…)
- Prix réalistes (25€ → 150€)
- Stock > 0
- `isSurpriseReady` et `isLastMinuteOk` variés
- `preparationTimeMin` cohérent avec la catégorie

**4 relationships avec préférences riches**
```json
[
  {
    "displayName": "Sophie",
    "relationshipType": "partenaire",
    "preferences": {
      "likes": ["chocolat artisanal", "yoga", "bougies", "bien-être"],
      "dislikes": ["parfum", "alcool"],
      "style": "minimaliste premium"
    },
    "upcomingEvents": [{ "type": "birthday", "date": "2026-03-14" }]
  },
  {
    "displayName": "Maman",
    "relationshipType": "mère",
    "preferences": {
      "likes": ["fleurs", "thé", "lecture", "jardinage"],
      "dislikes": [],
      "style": "classique chaleureux"
    },
    "upcomingEvents": [{ "type": "mothers_day", "date": "2026-05-11" }]
  },
  {
    "displayName": "Marc",
    "relationshipType": "ami",
    "preferences": {
      "likes": ["gastronomie", "vins", "sport", "voyages"],
      "dislikes": ["accessoires déco"],
      "style": "aventurier gourmet"
    },
    "upcomingEvents": []
  },
  {
    "displayName": "Julie",
    "relationshipType": "collègue",
    "preferences": {
      "likes": ["accessoires bureau", "chocolat", "café"],
      "dislikes": [],
      "style": "pratique et élégant"
    },
    "upcomingEvents": [{ "type": "birthday", "date": "2026-04-02" }]
  }
]
```

**1 adresse de livraison**
```
Rue de la Loi 42, 1000 Bruxelles, BE
```

---

## Récapitulatif — Ce qu'on construit

| # | Composant | Surface |
|---|-----------|---------|
| 1 | `POST /gift/chat` — endpoint Gemini | API |
| 2 | `recommendation.service.ts` — enrichi avec justifications | API |
| 3 | `prisma/seed.ts` + `seed:clean` | API |
| 4 | `useGiftChat(context)` hook | Mobile + Web |
| 5 | `gift-flow.tsx` refactorisé | Mobile |
| 6 | Page `/gift` avec chat | Web |
| 7 | Justification courte sur les cards produits | Mobile + Web |
| 8 | Points d'entrée contextuels (close.tsx, events, product) | Mobile |

---

## Variables d'environnement nécessaires

```env
# apps/api/.env
GEMINI_API_KEY=AIza...   # Google AI Studio — aistudio.google.com
```

C'est la seule nouvelle clé. Tout le reste est déjà en place.

---

## Hors scope de cette itération

- Embeddings pgvector (à ajouter quand catalogue > 50 produits réels)
- Visual Search (V2)
- Conversation multi-session (historique entre sessions)
- Personnalisation algorithmique "Curated For You"
