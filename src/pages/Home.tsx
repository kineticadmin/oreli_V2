import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ArrowRight, Heart, Gift, Sparkles } from "lucide-react";
import { closeOnes, products } from "@/data/mockData";

interface HomeProps {
  onStartGiftFlow: (personId?: string) => void;
  onProductTap: (productId: string) => void;
  onAddCloseOne: () => void;
}

const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=800&q=80",
    badge: "IA Cadeau",
    title: "Offrir un cadeau",
    subtitle: "Le cadeau parfait en 60 secondes",
    cta: "C'est parti",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=800&q=80",
    badge: "Fête des mères",
    title: "Bientôt la fête des mères",
    subtitle: "Explorez nos sélections exclusives",
    cta: "Explorer",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80",
    badge: "Nouveautés",
    title: "Cadeaux d'exception",
    subtitle: "Notre sélection premium du moment",
    cta: "Découvrir",
  },
];

const Home: React.FC<HomeProps> = ({ onStartGiftFlow, onProductTap, onAddCloseOne }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-container pb-28 overflow-y-auto h-screen bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <span className="text-lg font-bold text-foreground tracking-tight">Oreli</span>
        <div className="flex items-center gap-3">
          <motion.div whileTap={{ scale: 0.9 }} className="relative cursor-pointer">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-foreground" />
          </motion.div>
          <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center text-primary-foreground text-sm font-semibold">
            B
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-6 pt-4 pb-2">
        <h1 className="text-[28px] leading-[1.15] text-foreground font-bold">
          Bonjour, Brunell
        </h1>
        <p className="text-muted-foreground text-sm mt-2 flex items-center gap-2">
          L'anniversaire de Sophie est dans
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-foreground text-primary-foreground text-xs font-semibold">
            12 jours
          </span>
        </p>
      </div>

      {/* Hero Slider */}
      <div className="mx-6 mt-6">
        <div className="relative rounded-2xl overflow-hidden" style={{ height: 240 }}>
          <AnimatePresence mode="wait">
            {heroSlides.map((slide, idx) =>
              idx === activeSlide ? (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => onStartGiftFlow()}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                  <div className="relative z-10 h-full flex flex-col justify-end p-6">
                    <span className="text-[10px] text-white/60 font-semibold uppercase tracking-[0.15em] mb-2">
                      {slide.badge}
                    </span>
                    <h2 className="text-[22px] font-bold text-white leading-tight mb-1">
                      {slide.title}
                    </h2>
                    <p className="text-white/60 text-sm mb-4">
                      {slide.subtitle}
                    </p>
                    <button className="bg-white text-foreground font-semibold px-5 py-2.5 rounded-full text-sm flex items-center gap-2 w-fit">
                      {slide.cta} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>

          {/* Dots */}
          <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setActiveSlide(idx); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeSlide
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Close ones */}
      <div className="mt-10 px-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base text-foreground">Tes proches</h3>
          <button className="text-xs text-muted-foreground font-medium">Voir tout</button>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-none">
          {/* Add button */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            onClick={onAddCloseOne}
            className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30">
              <span className="text-muted-foreground text-2xl font-light">+</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Ajouter</span>
          </motion.div>

          {closeOnes.map((person) => (
            <motion.div
              key={person.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onStartGiftFlow(person.id)}
              className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center text-primary-foreground text-lg font-semibold">
                  {person.avatar}
                </div>
                {person.daysUntilEvent && person.daysUntilEvent < 14 && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-foreground text-primary-foreground text-[9px] font-bold">
                    {person.daysUntilEvent}j
                  </div>
                )}
              </div>
              <span className="text-[11px] text-foreground font-medium">{person.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Curated products */}
      <div className="mt-10 px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg text-foreground">Sélectionné pour toi</h2>
          <button className="text-xs text-muted-foreground font-medium">Voir tout &gt;</button>
        </div>
        <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -2 }}
              onClick={() => onProductTap(product.id)}
              className="flex-shrink-0 w-[180px] bg-card rounded-2xl shadow-card overflow-hidden cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-[160px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 right-2.5">
                  <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                    <Heart className="w-4 h-4 text-foreground" />
                  </span>
                </div>
              </div>
              <div className="p-3.5">
                <p className="font-semibold text-[13px] text-foreground leading-tight line-clamp-2">
                  {product.name}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  {product.seller}
                </p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="font-bold text-foreground text-base">{product.price}€</span>
                  <span className="text-[10px] text-muted-foreground">⭐ {product.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming events */}
      <div className="mt-10 px-6 pb-8">
        <h3 className="font-bold text-base mb-4 text-foreground">Événements à venir</h3>
        <div className="flex flex-col gap-3">
          {closeOnes
            .filter((p) => p.eventDate)
            .map((person) => (
              <motion.div
                key={person.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartGiftFlow(person.id)}
                className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-card cursor-pointer group hover:shadow-card-hover transition-shadow"
              >
                <div className="w-11 h-11 rounded-full bg-foreground flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                  {person.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{person.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {person.eventType} · {person.eventDate}
                  </p>
                </div>
                {person.daysUntilEvent && (
                  <span className="px-3 py-1.5 rounded-full bg-foreground text-primary-foreground text-xs font-bold flex-shrink-0">
                    {person.daysUntilEvent}j
                  </span>
                )}
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
