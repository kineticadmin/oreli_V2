export interface CloseOne {
    id: string;
    name: string;
    relationship: string;
    avatar: string;
    avatarUrl?: string;
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
    category: string;
}

export interface Occasion {
    iconName: string;
    label: string;
}

import { STUB_PRODUCTS } from '@/data/stubs/products';
import { STUB_RELATIVES } from '@/data/stubs/relatives';

export const closeOnes: CloseOne[] = STUB_RELATIVES.map((rel: any) => {
    // Generate some mock upcoming events based on the birthdate
    const eventTypes = ['Anniversaire', 'Fête', 'Diplôme'];
    const hasEvent = Math.random() > 0.3;
    const daysUntilEvent = hasEvent ? Math.floor(Math.random() * 120) + 2 : undefined;

    return {
        id: rel.id,
        name: rel.name,
        relationship: rel.relationship,
        avatar: rel.name.substring(0, 1).toUpperCase(),
        avatarUrl: rel.avatarUrl,
        eventType: hasEvent ? eventTypes[Math.floor(Math.random() * eventTypes.length)] : undefined,
        eventDate: rel.birthDate,
        daysUntilEvent,
    };
});

export const products: Product[] = STUB_PRODUCTS.map((prod: any) => ({
    id: prod.id,
    name: prod.name,
    seller: 'Artisan Local',
    rating: Number((Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)),
    price: prod.price,
    images: [
        prod.imageUrl,
        `https://picsum.photos/seed/${prod.id}_2/400/400`,
        `https://picsum.photos/seed/${prod.id}_3/400/400`
    ],
    description: prod.description,
    matchScore: Math.floor(Math.random() * 30) + 70, // 70 - 99
    aiJustification: `Sélectionné spécialement car ce cadeau de catégorie "${prod.category}" correspond parfaitement au profil.`,
    deliveryExpress: Math.random() > 0.5,
    category: prod.category,
}));

export const occasions: { iconName: string; label: string }[] = [
    { iconName: 'gift', label: 'Anniversaire' },
    { iconName: 'heart', label: 'Saint-Valentin' },
    { iconName: 'star', label: 'Noël' },
    { iconName: 'award', label: 'Diplôme' },
    { iconName: 'smile', label: 'Naissance' },
    { iconName: 'home', label: 'Crémaillère' },
    { iconName: 'sun', label: 'Juste comme ça' },
    { iconName: 'more-horizontal', label: 'Autre' },
];

export const heroSlides = [
    {
        id: '0',
        image: 'https://picsum.photos/seed/lea/800/600',
        badge: '98% Match',
        title: 'Le cadeau parfait\npour Léa',
        subtitle: 'Une sélection sur-mesure pour elle',
        cta: 'Voir le cadeau',
    },
    {
        id: '1',
        image: 'https://picsum.photos/seed/hero1/800/600',
        badge: 'IA Cadeau',
        title: 'Le cadeau parfait\nen 60 secondes',
        subtitle: 'Des artisans locaux sélectionnés avec soin',
        cta: "C'est parti",
    },
    {
        id: '2',
        image: 'https://picsum.photos/seed/hero2/800/600',
        badge: 'Fête des mères',
        title: 'Bientôt la fête\ndes mères',
        subtitle: 'Explorez nos sélections exclusives',
        cta: 'Explorer',
    },
    {
        id: '3',
        image: 'https://picsum.photos/seed/hero3/800/600',
        badge: 'Nouveautés',
        title: "Cadeaux\nd'exception",
        subtitle: 'Notre sélection premium du moment',
        cta: 'Découvrir',
    },
];

export const budgetOptions = [
    { id: '30', label: '30€', sublabel: 'Un geste attentionné', icon: 'coffee' },
    { id: '50', label: '50€', sublabel: 'Le juste milieu', icon: 'gift' },
    { id: '80', label: '80€', sublabel: 'Quelque chose de spécial', icon: 'star' },
    { id: '100', label: '100€+', sublabel: 'Faire vraiment plaisir', icon: 'award' },
];

export const deliveryOptions = [
    { id: 'today', label: "Aujourd'hui", sublabel: 'Express' },
    { id: 'tomorrow', label: 'Demain', sublabel: '' },
    { id: 'week', label: 'Cette semaine', sublabel: '' },
];

export const surpriseOptions = [
    { id: 'total', label: 'Surprise Totale', sublabel: "Je m'occupe de tout", icon: 'gift' },
    { id: 'guided', label: 'Surprise Guidée', sublabel: 'Montre-moi des options', icon: 'eye' },
    { id: 'choose', label: 'Je Choisis', sublabel: 'Je veux voir une sélection', icon: 'search' },
];
