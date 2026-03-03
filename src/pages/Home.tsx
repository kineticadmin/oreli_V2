import React from "react";
import { motion } from "framer-motion";
import { Bell, Sparkles, ArrowRight } from "lucide-react";
import { closeOnes, products } from "@/data/mockData";

interface HomeProps {
  onStartGiftFlow: (personId?: string) => void;
  onProductTap: (productId: string) => void;
  onAddCloseOne: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartGiftFlow, onProductTap, onAddCloseOne }) => {
  return (
    <div className="app-container pb-24 overflow-y-auto h-screen bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gradient-celebration flex items-center justify-center">
            <span className="text-lg">🎁</span>
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

      {/* Large warm greeting — inspired by "Hello Emily" style */}
      <div className="px-5 pt-6 pb-2">
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

      {/* Primary CTA — large immersive card */}
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="mx-5 mt-5 rounded-xl overflow-hidden cursor-pointer relative"
        onClick={() => onStartGiftFlow()}
      >
        <div className="gradient-primary p-6 pb-7 relative overflow-hidden">
          {/* Floating decorative elements */}
          <motion.div
            className="absolute -right-4 -top-4 w-32 h-32 rounded-full bg-primary-foreground/10"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute right-8 bottom-4 text-4xl opacity-30"
            animate={{ y: [0, -6, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🎁
          </motion.div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary-foreground/80" />
              <span className="text-xs text-primary-foreground/80 font-semibold uppercase tracking-wider">IA cadeau</span>
            </div>
            <h2 className="font-display italic text-[22px] text-primary-foreground leading-tight mb-1">
              Offrir un cadeau
            </h2>
            <p className="text-primary-foreground/70 text-sm mb-5">
              Le cadeau parfait en 60 secondes
            </p>
            <button className="bg-primary-foreground text-primary font-semibold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-card">
              C'est parti <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Close ones — warmer style */}
      <div className="mt-7 px-5">
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
      <div className="mt-7 px-5">
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
      <div className="mt-7 px-5 pb-4">
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
