import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Sparkles, ArrowRight, Heart, Gift, Calendar } from "lucide-react";
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
    icon: Sparkles,
    badge: "IA Cadeau",
    title: "Offrir un cadeau",
    subtitle: "Le cadeau parfait en 60 secondes",
    cta: "C'est parti",
    action: "gift" as const,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=800&q=80",
    icon: Heart,
    badge: "Fête des mères",
    title: "Bientôt la fête des mères",
    subtitle: "Explorez nos sélections exclusives",
    cta: "Explorer",
    action: "gift" as const,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80",
    icon: Gift,
    badge: "Nouveautés",
    title: "Cadeaux d'exception",
    subtitle: "Notre sélection premium du moment",
    cta: "Découvrir",
    action: "gift" as const,
  },
];

const Home: React.FC<HomeProps> = ({ onStartGiftFlow, onProductTap, onAddCloseOne }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-container pb-24 overflow-y-auto h-screen bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gradient-celebration flex items-center justify-center">
            <Gift className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.div whileTap={{ scale: 0.9 }} className="relative cursor-pointer">
            <Bell className="w-6 h-6 text-foreground" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
          </motion.div>
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
            B
          </div>
        </div>
      </div>

      {/* Large warm greeting */}
      <div className="px-6 pt-8 pb-3">
        <h1 className="text-[32px] leading-[1.1] text-foreground font-sans font-semibold">
          Bonjour,{" "}
          <span className="font-display italic text-primary">Brunell</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-2 flex items-center gap-2">
          L'anniversaire de Sophie est dans{" "}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary text-primary-foreground text-xs font-semibold">
            12 jours
          </span>
        </p>
      </div>

      {/* Hero Slider — immersive full-image cards */}
      <div className="mx-6 mt-7">
        <div className="relative rounded-2xl overflow-hidden" style={{ height: 220 }}>
          <AnimatePresence mode="wait">
            {heroSlides.map((slide, idx) =>
              idx === activeSlide ? (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => onStartGiftFlow()}
                >
                  {/* Background image */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <slide.icon className="w-3.5 h-3.5 text-primary-foreground/90" />
                      <span className="text-[10px] text-primary-foreground/80 font-semibold uppercase tracking-widest">
                        {slide.badge}
                      </span>
                    </div>
                    <h2 className="font-display italic text-[24px] text-primary-foreground leading-tight mb-1">
                      {slide.title}
                    </h2>
                    <p className="text-primary-foreground/70 text-sm mb-4">
                      {slide.subtitle}
                    </p>
                    <button className="bg-primary-foreground/95 backdrop-blur-sm text-foreground font-semibold px-5 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-card w-fit">
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
                    ? "w-5 bg-primary-foreground"
                    : "w-1.5 bg-primary-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Close ones — warmer style */}
      <div className="mt-10 px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base text-foreground">Tes proches</h3>
          <button className="text-xs text-primary font-semibold">Voir tout</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {/* Add button */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            onClick={onAddCloseOne}
            className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0"
          >
            <div className="w-[64px] h-[64px] rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center bg-muted/30">
              <span className="text-primary text-2xl font-light">+</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Ajouter</span>
          </motion.div>

          {closeOnes.map((person) => (
            <motion.div
              key={person.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onStartGiftFlow(person.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <div className="relative">
                <div
                  className={`w-[64px] h-[64px] rounded-full flex items-center justify-center text-primary-foreground text-lg font-semibold gradient-primary ring-[3px] ring-offset-2 ring-offset-background ${
                    person.daysUntilEvent && person.daysUntilEvent < 7
                      ? "ring-golden-honey"
                      : person.daysUntilEvent && person.daysUntilEvent < 14
                      ? "ring-primary"
                      : "ring-transparent"
                  }`}
                >
                  {person.avatar}
                </div>
                {person.daysUntilEvent && person.daysUntilEvent < 14 && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-secondary text-primary-foreground text-[9px] font-bold">
                    {person.daysUntilEvent}j
                  </div>
                )}
              </div>
              <span className="text-[11px] text-foreground font-medium">{person.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Curated for you — lifestyle cards */}
      <div className="mt-10 px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display italic text-xl text-foreground">Sélectionné pour toi</h2>
          <button className="text-xs text-primary font-semibold">Voir tout</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -2 }}
              onClick={() => onProductTap(product.id)}
              className="flex-shrink-0 w-[180px] bg-card rounded-xl shadow-card overflow-hidden cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-[140px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-accent/90 backdrop-blur-sm text-primary-foreground text-[10px] rounded-full font-semibold flex items-center gap-1">
                    ✨ {product.matchScore}%
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="font-semibold text-[13px] text-foreground leading-tight line-clamp-2">
                  {product.name}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {product.seller} · ⭐ {product.rating}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-foreground text-base">{product.price}€</span>
                  {product.deliveryExpress && (
                    <span className="text-[9px] text-mint-fresh font-semibold">⚡ Express</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming events */}
      <div className="mt-10 px-6 pb-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">Événements à venir</h3>
        <div className="flex flex-col gap-2.5">
          {closeOnes
            .filter((p) => p.eventDate)
            .map((person) => (
              <motion.div
                key={person.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartGiftFlow(person.id)}
                className="flex items-center gap-3 p-3.5 bg-card rounded-xl shadow-card cursor-pointer group hover:shadow-card-hover transition-shadow"
              >
                <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                  {person.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{person.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {person.eventType} · {person.eventDate}
                  </p>
                </div>
                {person.daysUntilEvent && (
                  <span
                    className={`px-3 py-1.5 rounded-full text-primary-foreground text-xs font-bold flex-shrink-0 ${
                      person.daysUntilEvent < 7
                        ? "bg-primary"
                        : person.daysUntilEvent < 30
                        ? "bg-secondary"
                        : "bg-muted-foreground/60"
                    }`}
                  >
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
