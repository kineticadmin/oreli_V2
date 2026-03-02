export interface CloseOne {
  id: string;
  name: string;
  relationship: string;
  avatar: string;
  eventType?: string;
  eventDate?: string;
  daysUntilEvent?: number;
}

export interface Product {
  id: string;
  name: string;
  seller: string;
  rating: number;
  price: number;
  images: string[];
  description: string;
  matchScore: number;
  aiJustification: string;
  deliveryExpress: boolean;
}

export const closeOnes: CloseOne[] = [
  {
    id: "1",
    name: "Sophie",
    relationship: "Maman",
    avatar: "S",
    eventType: "Anniversaire",
    eventDate: "15 mars",
    daysUntilEvent: 12,
  },
  {
    id: "2",
    name: "Lucas",
    relationship: "Partenaire",
    avatar: "L",
    eventType: undefined,
    eventDate: undefined,
    daysUntilEvent: undefined,
  },
  {
    id: "3",
    name: "Emma",
    relationship: "Meilleure amie",
    avatar: "E",
    eventType: "Anniversaire",
    eventDate: "2 avril",
    daysUntilEvent: 30,
  },
  {
    id: "4",
    name: "Thomas",
    relationship: "Frère",
    avatar: "T",
    eventType: "Diplôme",
    eventDate: "20 juin",
    daysUntilEvent: 110,
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Bougie Artisanale — Forêt de Soignes",
    seller: "La Bougie Belge",
    rating: 4.9,
    price: 38,
    images: [
      "https://images.unsplash.com/photo-1602607616776-5ebd6e502d86?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1572726431721-3e9349e1e648?w=400&h=300&fit=crop",
    ],
    description:
      "Bougie artisanale coulée à la main à Bruxelles. Cire de soja naturelle aux notes boisées de la Forêt de Soignes. Durée de combustion : 45h.",
    matchScore: 92,
    aiJustification:
      "Sophie adore les ambiances cosy et les produits naturels. Cette bougie artisanale bruxelloise est parfaite pour son anniversaire.",
    deliveryExpress: true,
  },
  {
    id: "2",
    name: "Coffret Chocolats Pralinés",
    seller: "Maison Marcolini",
    rating: 4.8,
    price: 52,
    images: [
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop",
    ],
    description:
      "Coffret de 24 pralinés artisanaux. Sélection signature du maître chocolatier. Cacao d'origine unique.",
    matchScore: 87,
    aiJustification:
      "Un classique qui fait toujours plaisir. Marcolini est une valeur sûre pour les amateurs de chocolat belge.",
    deliveryExpress: true,
  },
  {
    id: "3",
    name: "Carafe en Verre Soufflé",
    seller: "Atelier Verre & Feu",
    rating: 4.7,
    price: 75,
    images: [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=300&fit=crop",
    ],
    description:
      "Carafe soufflée à la bouche dans un atelier bruxellois. Chaque pièce est unique. Contenance 1L.",
    matchScore: 78,
    aiJustification:
      "Un objet unique et artisanal qui apporte une touche d'élégance. Idéal pour quelqu'un qui aime la décoration.",
    deliveryExpress: false,
  },
  {
    id: "4",
    name: "Box Spa Détente",
    seller: "Les Thermes de Bruxelles",
    rating: 4.9,
    price: 89,
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop",
    ],
    description:
      "Un moment de pure détente : accès spa, gommage et massage relaxant de 30 minutes. Valable 6 mois.",
    matchScore: 85,
    aiJustification:
      "Offrir du temps pour soi est le plus beau des cadeaux. Parfait pour une maman qui mérite de se reposer.",
    deliveryExpress: true,
  },
  {
    id: "5",
    name: "Cours de Cuisine — 2 Personnes",
    seller: "L'Atelier des Chefs",
    rating: 4.6,
    price: 65,
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=400&h=300&fit=crop",
    ],
    description:
      "Cours de 3h pour 2 personnes. Menu gastronomique, ingrédients inclus. Ambiance conviviale garantie.",
    matchScore: 81,
    aiJustification:
      "Une expérience à partager ensemble. Idéal pour créer des souvenirs et passer un bon moment.",
    deliveryExpress: false,
  },
];

export const occasions = [
  { emoji: "🎂", label: "Anniversaire" },
  { emoji: "💝", label: "Saint-Valentin" },
  { emoji: "🎄", label: "Noël" },
  { emoji: "🎓", label: "Diplôme" },
  { emoji: "👶", label: "Naissance" },
  { emoji: "🏠", label: "Crémaillère" },
  { emoji: "💐", label: "Juste comme ça" },
  { emoji: "✨", label: "Autre" },
];
