import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-cream mb-4 leading-tight">
          Le cadeau parfait,<br />
          <span className="text-gold">livré à Bruxelles</span>
        </h1>
        <p className="text-muted text-lg mb-10 max-w-xl mx-auto">
          Des créateurs locaux sélectionnés. Des cadeaux uniques. Même pour les retardataires.
        </p>
        <Link
          href="/catalog"
          className="inline-block bg-gold text-obsidian font-semibold px-8 py-3.5 rounded-2xl text-base hover:bg-gold/90 transition-colors"
        >
          Découvrir le catalogue
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="bg-charcoal border border-warm rounded-2xl p-6"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-cream font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted text-sm">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

const FEATURES = [
  {
    icon: '⚡',
    title: 'Last-minute possible',
    description: 'Des vendeurs qui acceptent les commandes en urgence, livrés le jour même ou le lendemain.',
  },
  {
    icon: '🎁',
    title: 'Mode surprise',
    description: 'Laissez le vendeur choisir pour vous — idéal quand on manque d\'inspiration.',
  },
  {
    icon: '🏪',
    title: 'Créateurs locaux',
    description: 'Des boutiques bruxelloises triées sur le volet pour leur qualité et fiabilité.',
  },
];
