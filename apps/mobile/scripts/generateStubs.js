const fs = require('fs');
const path = require('path');

const categories = ['Electronics', 'Home', 'Fashion', 'Beauty', 'Sports', 'Leisure', 'Experience', 'Gastronomy'];
const adjectives = ['Premium', 'Elegant', 'Practical', 'Smart', 'Vintage', 'Innovative', 'Sustainable', 'Comfortable'];
const nouns = ['Watch', 'Headphones', 'Bag', 'Gift Box', 'Book', 'Subscription', 'Ticket', 'Workshop', 'Stay', 'Coffee Machine', 'Plant'];

const products = Array.from({ length: 50 }).map((_, i) => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const name = `${adjective} ${noun}`;
    return {
        id: `prod_${i + 1}`,
        name,
        description: `A wonderful gift idea: ${name.toLowerCase()}. Guaranteed to please.`,
        price: Math.floor(Math.random() * 200) + 15, // 15 to 215
        imageUrl: `https://picsum.photos/seed/prod${i}/400/400`,
        category: categories[Math.floor(Math.random() * categories.length)],
    };
});

fs.writeFileSync(
    path.join(__dirname, '../data/stubs/products.ts'),
    `// Generated stub data for products\\nexport const STUB_PRODUCTS = ${JSON.stringify(products, null, 2)};\\n`
);

const relNames = ['Sophie', 'Marc', 'Julie', 'Thomas', 'Emma', 'Lucas', 'Maman', 'Papa', 'Léa'];
const relations = ['Sister', 'Brother', 'Friend', 'Friend', 'Cousin', 'Cousin', 'Mother', 'Father', 'Niece'];

const relatives = Array.from({ length: 9 }).map((_, i) => ({
    id: `rel_${i + 1}`,
    name: relNames[i],
    relationship: relations[i],
    avatarUrl: `https://i.pravatar.cc/150?u=rel${i}`,
    birthDate: `199${Math.floor(Math.random() * 9)}-0${Math.floor(Math.random() * 8) + 1}-1${Math.floor(Math.random() * 8)}`,
    interests: categories.sort(() => 0.5 - Math.random()).slice(0, 3)
}));

fs.writeFileSync(
    path.join(__dirname, '../data/stubs/relatives.ts'),
    `// Generated stub data for relatives\\nexport const STUB_RELATIVES = ${JSON.stringify(relatives, null, 2)};\\n`
);

console.log('Stub data generated successfully.');
