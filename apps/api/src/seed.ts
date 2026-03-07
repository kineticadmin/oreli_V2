/**
 * Seed data — données de test pour développement local.
 *
 * Usage:
 *   pnpm seed           → insérer les données
 *   pnpm seed:clean     → supprimer uniquement les données de test
 */

import { PrismaClient } from '@oreli/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding test data...');

  // Nettoyage préalable (idempotent)
  await cleanTestData(prisma);

  // ─── Catégories ────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'chocolat' }, update: {}, create: { name: 'Chocolat', slug: 'chocolat' } }),
    prisma.category.upsert({ where: { slug: 'bien-etre' }, update: {}, create: { name: 'Bien-être', slug: 'bien-etre' } }),
    prisma.category.upsert({ where: { slug: 'gastronomie' }, update: {}, create: { name: 'Gastronomie', slug: 'gastronomie' } }),
    prisma.category.upsert({ where: { slug: 'accessoires' }, update: {}, create: { name: 'Accessoires', slug: 'accessoires' } }),
    prisma.category.upsert({ where: { slug: 'experiences' }, update: {}, create: { name: 'Expériences', slug: 'experiences' } }),
  ]);

  const [catChocolat, catBienEtre, catGastro, catAccessoires, catExp] = categories;

  // ─── Tags ──────────────────────────────────────────────────────────────
  const tagSlugs = [
    { slug: 'romantique', label: 'Romantique' },
    { slug: 'artisanal', label: 'Artisanal' },
    { slug: 'local', label: 'Local Brussels' },
    { slug: 'wellness', label: 'Wellness' },
    { slug: 'gourmet', label: 'Gourmet' },
    { slug: 'couple', label: 'Pour couple' },
    { slug: 'femme', label: 'Pour femme' },
    { slug: 'homme', label: 'Pour homme' },
    { slug: 'premium', label: 'Premium' },
    { slug: 'fait-main', label: 'Fait main' },
    { slug: 'birthday', label: 'Anniversaire' },
    { slug: 'celebration', label: 'Célébration' },
    { slug: 'detente', label: 'Détente' },
    { slug: 'gastronomie', label: 'Gastronomie' },
    { slug: 'decouverte', label: 'Découverte' },
  ];

  const tags = await Promise.all(
    tagSlugs.map((t) =>
      prisma.tag.upsert({ where: { slug: t.slug }, update: {}, create: t }),
    ),
  );

  const tagMap = Object.fromEntries(tags.map((t) => [t.slug, t.id]));

  // ─── Sellers ───────────────────────────────────────────────────────────
  const sellers = await Promise.all([
    prisma.seller.create({
      data: {
        displayName: 'Maison Cacao',
        legalName: 'Maison Cacao SPRL',
        status: 'active',
        kybStatus: 'approved',
        reliabilityScore: 0.96,
        policy: { create: { slaPrepHours: 2, slaDeliveryHours: 4, cutoffTimeLocal: '16:00' } },
      },
    }),
    prisma.seller.create({
      data: {
        displayName: "L'Apothicaire Bruxelles",
        status: 'active',
        kybStatus: 'approved',
        reliabilityScore: 0.91,
        policy: { create: { slaPrepHours: 3, slaDeliveryHours: 6, cutoffTimeLocal: '15:00' } },
      },
    }),
    prisma.seller.create({
      data: {
        displayName: 'Cave du Sablon',
        legalName: 'Cave du Sablon SA',
        status: 'active',
        kybStatus: 'approved',
        reliabilityScore: 0.88,
        policy: { create: { slaPrepHours: 4, slaDeliveryHours: 8, cutoffTimeLocal: '14:00' } },
      },
    }),
    prisma.seller.create({
      data: {
        displayName: 'Atelier Brussel',
        status: 'active',
        kybStatus: 'approved',
        reliabilityScore: 0.93,
        policy: { create: { slaPrepHours: 6, slaDeliveryHours: 24, cutoffTimeLocal: '17:00' } },
      },
    }),
    prisma.seller.create({
      data: {
        displayName: 'Expériences & Co',
        status: 'active',
        kybStatus: 'approved',
        reliabilityScore: 0.85,
        policy: { create: { slaPrepHours: 1, slaDeliveryHours: 2, cutoffTimeLocal: '18:00' } },
      },
    }),
  ]);

  const [sellerCacao, sellerApo, sellerCave, sellerAtelier, sellerExp] = sellers;

  // ─── Produits (25) ─────────────────────────────────────────────────────

  type ProductSeed = {
    sellerId: string;
    categoryId: string;
    title: string;
    description: string;
    priceAmount: number;
    isSurpriseReady: boolean;
    isLastMinuteOk: boolean;
    preparationTimeMin: number | null;
    stock: number;
    tagSlugsToLink: string[];
  };

  const productSeeds: ProductSeed[] = [
    // Chocolat (5)
    {
      sellerId: sellerCacao.id,
      categoryId: catChocolat.id,
      title: 'Box Grands Crus — Sélection Maison Cacao',
      description: '12 pralines artisanales fabriquées à Bruxelles. Cacao origine Équateur et Madagascar. Packaging cadeau inclus.',
      priceAmount: 3500,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 30,
      stock: 25,
      tagSlugsToLink: ['artisanal', 'local', 'romantique', 'birthday'],
    },
    {
      sellerId: sellerCacao.id,
      categoryId: catChocolat.id,
      title: 'Coffret Tablettes Origines — 6 pièces',
      description: '6 tablettes de chocolat noir 70% issues de 6 origines différentes. Un voyage sensoriel en format cadeau.',
      priceAmount: 4800,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 60,
      stock: 15,
      tagSlugsToLink: ['artisanal', 'gourmet', 'premium', 'decouverte'],
    },
    {
      sellerId: sellerCacao.id,
      categoryId: catChocolat.id,
      title: 'Truffes Maison — Boîte de 24',
      description: 'Truffes au chocolat belge et ganaches variées : vanille bourbon, caramel fleur de sel, praliné noisette.',
      priceAmount: 2800,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 20,
      stock: 30,
      tagSlugsToLink: ['artisanal', 'fait-main', 'celebration'],
    },
    {
      sellerId: sellerCacao.id,
      categoryId: catChocolat.id,
      title: 'Duo Couple — Box Chocolats & Message Personnalisé',
      description: 'Box romantique pour deux : 16 pralines assorties + carte message personnalisée gravée. Idéal anniversaire ou Saint-Valentin.',
      priceAmount: 5500,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 90,
      stock: 10,
      tagSlugsToLink: ['romantique', 'couple', 'artisanal', 'birthday'],
    },
    {
      sellerId: sellerCacao.id,
      categoryId: catChocolat.id,
      title: 'Tablette Grand Format — Personnalisable',
      description: 'Tablette de chocolat au lait 500g avec prénom ou message personnalisé gravé. Emballage premium.',
      priceAmount: 3200,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: 120,
      stock: 8,
      tagSlugsToLink: ['fait-main', 'premium', 'celebration'],
    },
    // Bien-être (5)
    {
      sellerId: sellerApo.id,
      categoryId: catBienEtre.id,
      title: 'Kit Rituel Spa Maison — Collection Bruxelles',
      description: 'Coffret bien-être : bougie de soja, sel de bain aux huiles essentielles, masque visage, gommage corps. Fabriqué à Bruxelles.',
      priceAmount: 6800,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 45,
      stock: 12,
      tagSlugsToLink: ['wellness', 'femme', 'artisanal', 'detente'],
    },
    {
      sellerId: sellerApo.id,
      categoryId: catBienEtre.id,
      title: 'Bougie Parfumée Artisanale — Figuier & Cèdre',
      description: 'Bougie en cire de soja 200g, parfum délicat figuier et bois de cèdre. Mèche en coton, 45h de combustion. Made in Brussels.',
      priceAmount: 3200,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 15,
      stock: 40,
      tagSlugsToLink: ['artisanal', 'local', 'wellness', 'femme'],
    },
    {
      sellerId: sellerApo.id,
      categoryId: catBienEtre.id,
      title: 'Coffret Soins Visage — Actifs Botaniques',
      description: 'Routine visage complète : sérum hyaluronique, crème jour, huile démaquillante. Formulations naturelles, testées dermatologiquement.',
      priceAmount: 8900,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: 30,
      stock: 7,
      tagSlugsToLink: ['wellness', 'premium', 'femme'],
    },
    {
      sellerId: sellerApo.id,
      categoryId: catBienEtre.id,
      title: 'Pack Méditation — Tapis, Bougie & Thé',
      description: 'Kit méditation pour débutants : tapis de yoga fin 3mm, bougie méditation lavande, thé blanc bio. Un cadeau qui invite à ralentir.',
      priceAmount: 5500,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 30,
      stock: 9,
      tagSlugsToLink: ['wellness', 'detente', 'femme'],
    },
    {
      sellerId: sellerApo.id,
      categoryId: catBienEtre.id,
      title: 'Coffret Bain Sensoriel — Sel & Huiles',
      description: 'Box bain luxueuse : 3 sachets de sel minéral (rose, noir, blanc), 2 huiles de bain, pierre ponce naturelle.',
      priceAmount: 4200,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 20,
      stock: 18,
      tagSlugsToLink: ['wellness', 'detente', 'fait-main'],
    },
    // Gastronomie (5)
    {
      sellerId: sellerCave.id,
      categoryId: catGastro.id,
      title: 'Coffret Vins Naturels — 3 Bouteilles Sélection Sablon',
      description: '3 vins naturels sélectionnés par notre sommelier : un blanc minéral, un rouge gourmand, un orange surprenant. Fiches de dégustation incluses.',
      priceAmount: 8500,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: 60,
      stock: 6,
      tagSlugsToLink: ['gourmet', 'homme', 'premium', 'decouverte'],
    },
    {
      sellerId: sellerCave.id,
      categoryId: catGastro.id,
      title: 'Box Apéro Belge — Charcuterie & Fromages Artisanaux',
      description: "Sélection belge : coppa, jambon d'Ardenne, fromage de Herve, gaufres liégeoises. Pour 2 personnes, livré sous vide.",
      priceAmount: 6200,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 30,
      stock: 14,
      tagSlugsToLink: ['gourmet', 'artisanal', 'local', 'celebration'],
    },
    {
      sellerId: sellerCave.id,
      categoryId: catGastro.id,
      title: 'Coffret Huiles & Vinaigres Rares',
      description: "Pour le cuisinier curieux : huile d'olive AOP Crète, huile de truffe noire, vinaigre balsamique 12 ans. Coffret bois inclus.",
      priceAmount: 7400,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: 45,
      stock: 5,
      tagSlugsToLink: ['gourmet', 'premium', 'fait-main'],
    },
    {
      sellerId: sellerCave.id,
      categoryId: catGastro.id,
      title: 'Champagne & Pralines — Coffret Célébration',
      description: 'Le grand classique revisité : une bouteille de champagne Blanc de Blancs + box de 8 pralines Maison Cacao.',
      priceAmount: 9800,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 60,
      stock: 8,
      tagSlugsToLink: ['romantique', 'couple', 'premium', 'celebration'],
    },
    {
      sellerId: sellerCave.id,
      categoryId: catGastro.id,
      title: 'Box Petit-Déjeuner Luxe — Livraison Matin',
      description: 'Réveil gourmand : croissants frais de la boulangerie, confiture artisanale, miel local, jus pressé, café grand cru.',
      priceAmount: 5500,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 15,
      stock: 20,
      tagSlugsToLink: ['artisanal', 'local', 'gourmet', 'birthday'],
    },
    // Accessoires (5)
    {
      sellerId: sellerAtelier.id,
      categoryId: catAccessoires.id,
      title: 'Carnet Cuir Pleine Fleur — Gravure Personnalisée',
      description: 'Carnet A5 en cuir végétan tanné naturellement. Pages ivoire non lignées 120g. Gravure prénom ou initiales incluse.',
      priceAmount: 4500,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: 1440,
      stock: 15,
      tagSlugsToLink: ['artisanal', 'fait-main', 'premium'],
    },
    {
      sellerId: sellerAtelier.id,
      categoryId: catAccessoires.id,
      title: 'Tote Bag Lin Naturel — Broderie Bruxelles',
      description: 'Grand sac en lin naturel certifié OEKO-TEX. Broderie "Bruxelles" en fil doré. Anses en coton tressé. 40x45cm.',
      priceAmount: 3800,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 240,
      stock: 22,
      tagSlugsToLink: ['artisanal', 'local', 'femme', 'fait-main'],
    },
    {
      sellerId: sellerAtelier.id,
      categoryId: catAccessoires.id,
      title: 'Porte-Clés Cuir Monogramme',
      description: 'Porte-clés en cuir pleine fleur avec vos initiales estampées à chaud. Finition naturelle patinée. Fabriqué à Bruxelles.',
      priceAmount: 2200,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 360,
      stock: 30,
      tagSlugsToLink: ['artisanal', 'fait-main', 'homme'],
    },
    {
      sellerId: sellerAtelier.id,
      categoryId: catAccessoires.id,
      title: 'Kit Bureau Premium — Organisateur & Stylo',
      description: 'Pour le professionnel élégant : organisateur de bureau en chêne massif + stylo plume en résine. Boîte cadeau incluse.',
      priceAmount: 6500,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: 120,
      stock: 8,
      tagSlugsToLink: ['premium', 'homme', 'artisanal'],
    },
    {
      sellerId: sellerAtelier.id,
      categoryId: catAccessoires.id,
      title: 'Sachet Bain & Cadeau — Packaging Luxe',
      description: 'Mini kit cadeau prêt à offrir : sachet organza, petite bougie, savon artisanal, carte message. Idéal collègue ou remerciement.',
      priceAmount: 1800,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 10,
      stock: 50,
      tagSlugsToLink: ['artisanal', 'fait-main', 'wellness'],
    },
    // Expériences (5)
    {
      sellerId: sellerExp.id,
      categoryId: catExp.id,
      title: "Atelier Chocolat Pour 2 — Maison Cacao",
      description: "2h d'atelier avec notre maître chocolatier : création de pralines et truffes maison. Tabliers fournis. Dégustation incluse.",
      priceAmount: 12000,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: null,
      stock: 4,
      tagSlugsToLink: ['couple', 'decouverte', 'artisanal', 'celebration'],
    },
    {
      sellerId: sellerExp.id,
      categoryId: catExp.id,
      title: "Dégustation Vins Naturels Guidée — 1h30",
      description: "Session de dégustation avec notre sommelier : 6 vins naturels en dégustation à l'aveugle. Accord mets-vins, lexique sensoriel.",
      priceAmount: 8500,
      isSurpriseReady: false,
      isLastMinuteOk: true,
      preparationTimeMin: null,
      stock: 6,
      tagSlugsToLink: ['gourmet', 'decouverte', 'couple'],
    },
    {
      sellerId: sellerExp.id,
      categoryId: catExp.id,
      title: 'Brunch Gastronomique Privé — Pour 2',
      description: 'Brunch le dimanche matin dans notre espace privatisé : table dressée, menu 8 plats, accords jus & vins doux.',
      priceAmount: 15000,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: null,
      stock: 2,
      tagSlugsToLink: ['romantique', 'couple', 'premium', 'gourmet'],
    },
    {
      sellerId: sellerExp.id,
      categoryId: catExp.id,
      title: 'Cours de Cuisine Belge — 2h Avec Chef',
      description: 'Apprenez à cuisiner 3 classiques belges revisités avec un chef étoilé. Dîner à emporter inclus. Max 4 participants.',
      priceAmount: 9500,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: null,
      stock: 4,
      tagSlugsToLink: ['decouverte', 'gastronomie', 'artisanal'],
    },
    {
      sellerId: sellerExp.id,
      categoryId: catExp.id,
      title: 'Visite Privée Grand-Place + Dégustation Bières',
      description: 'Visite guidée privée de la Grand-Place (1h) + dégustation de 5 bières artisanales bruxelloises dans un café historique.',
      priceAmount: 7500,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: null,
      stock: 8,
      tagSlugsToLink: ['local', 'decouverte', 'couple', 'homme'],
    },
  ];

  // Créer les produits
  for (const seedItem of productSeeds) {
    const productData: Parameters<typeof prisma.product.create>[0]['data'] = {
      sellerId: seedItem.sellerId,
      categoryId: seedItem.categoryId,
      title: seedItem.title,
      description: seedItem.description,
      priceAmount: seedItem.priceAmount,
      status: 'active',
      isSurpriseReady: seedItem.isSurpriseReady,
      isLastMinuteOk: seedItem.isLastMinuteOk,
      inventory: {
        create: { stockQuantity: seedItem.stock, reservedQuantity: 0 },
      },
      tags: {
        create: seedItem.tagSlugsToLink
          .filter((slug) => tagMap[slug] !== undefined)
          .map((slug) => ({ tagId: tagMap[slug]! })),
      },
    };

    if (seedItem.preparationTimeMin !== null) {
      productData.preparationTimeMin = seedItem.preparationTimeMin;
    }

    const product = await prisma.product.create({ data: productData });
    console.log(`  Product created: ${product.title}`);
  }

  // ─── Utilisateur de test ───────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Test1234!', 10);

  const testUser = await prisma.user.create({
    data: {
      email: 'test@oreli.ai',
      firstName: 'Alex',
      lastName: 'Test',
      passwordHash,
      status: 'active',
      addresses: {
        create: {
          label: 'Domicile',
          name: 'Alex Test',
          line: 'Rue de la Loi 42',
          city: 'Bruxelles',
          postalCode: '1000',
          country: 'BE',
          isDefault: true,
        },
      },
    },
  });

  console.log(`  User created: ${testUser.email}`);

  // ─── Relationships avec préférences riches ────────────────────────────

  const inSevenDays = new Date();
  inSevenDays.setDate(inSevenDays.getDate() + 7);
  const inTwoMonths = new Date();
  inTwoMonths.setMonth(inTwoMonths.getMonth() + 2);

  await prisma.relationship.create({
    data: {
      userId: testUser.id,
      displayName: 'Sophie',
      relationshipType: 'partner',
      birthdate: new Date('1992-03-14'),
      affinityScore: 0.95,
      preferences: {
        likes: ['chocolat artisanal', 'yoga', 'bougies', 'bien-être', 'vin blanc'],
        dislikes: ['parfum', 'alcool fort'],
        style: 'minimaliste premium',
        colors: ['blanc', 'beige', 'or'],
      },
      events: {
        create: [
          {
            userId: testUser.id,
            eventType: 'birthday',
            eventDate: inSevenDays,
            isRecurring: true,
          },
        ],
      },
    },
  });

  await prisma.relationship.create({
    data: {
      userId: testUser.id,
      displayName: 'Maman',
      relationshipType: 'parent',
      birthdate: new Date('1958-05-11'),
      affinityScore: 0.90,
      preferences: {
        likes: ['fleurs', 'thé', 'lecture', 'jardinage', 'chocolat au lait'],
        dislikes: ['alcool', 'gadgets technologiques'],
        style: 'classique chaleureux',
        colors: ['rose', 'vert', 'bordeaux'],
      },
      events: {
        create: [
          {
            userId: testUser.id,
            eventType: 'mothers_day',
            eventDate: new Date(new Date().getFullYear(), 4, 11),
            isRecurring: true,
          },
        ],
      },
    },
  });

  await prisma.relationship.create({
    data: {
      userId: testUser.id,
      displayName: 'Marc',
      relationshipType: 'friend',
      birthdate: new Date('1989-07-22'),
      affinityScore: 0.75,
      preferences: {
        likes: ['gastronomie', 'vins', 'sport', 'voyages', 'bières artisanales'],
        dislikes: ['accessoires déco', 'bougies'],
        style: 'aventurier gourmet',
        colors: ['noir', 'gris', 'bleu marine'],
      },
      events: {
        create: [],
      },
    },
  });

  await prisma.relationship.create({
    data: {
      userId: testUser.id,
      displayName: 'Julie',
      relationshipType: 'colleague',
      preferences: {
        likes: ['accessoires bureau', 'chocolat', 'café', 'plantes'],
        dislikes: [],
        style: 'pratique et élégant',
      },
      events: {
        create: [
          {
            userId: testUser.id,
            eventType: 'birthday',
            eventDate: inTwoMonths,
            isRecurring: true,
          },
        ],
      },
    },
  });

  console.log('  Relationships created: Sophie, Maman, Marc, Julie');
  console.log('\nSeed complete!');
  console.log('\nTest credentials:');
  console.log('  Email    : test@oreli.ai');
  console.log('  Password : Test1234!');
}

async function cleanTestData(_prisma: PrismaClient) {
  const testSellerNames = [
    'Maison Cacao',
    "L'Apothicaire Bruxelles",
    'Cave du Sablon',
    'Atelier Brussel',
    'Expériences & Co',
  ];

  const testUser = await _prisma.user.findUnique({ where: { email: 'test@oreli.ai' } });
  if (testUser) {
    await _prisma.user.delete({ where: { id: testUser.id } });
    console.log('  Deleted test user');
  }

  for (const name of testSellerNames) {
    const seller = await _prisma.seller.findFirst({ where: { displayName: name } });
    if (seller) {
      await _prisma.seller.delete({ where: { id: seller.id } });
      console.log(`  Deleted seller "${name}"`);
    }
  }
}

async function cleanOnly() {
  console.log('Cleaning test data...');
  await cleanTestData(prisma);
  console.log('Clean complete');
}

const isCleanOnly = process.argv.includes('--clean');

if (isCleanOnly) {
  cleanOnly()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
} else {
  seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
