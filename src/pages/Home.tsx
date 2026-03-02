import React from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { closeOnes, products } from "@/data/mockData";

interface HomeProps {
  onStartGiftFlow: (personId?: string) => void;
  onProductTap: (productId: string) => void;
  onAddCloseOne: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartGiftFlow, onProductTap, onAddCloseOne }) => {
  return (
    <div className="app-container pb-24 overflow-y-auto h-screen">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="font-display italic text-xl text-foreground">
          Orel<span className="relative">i<span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-golden-honey" /></span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-foreground" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary" />
          </div>
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold">
            B
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="font-display text-[28px] font-bold text-foreground">
          Bonjour, Brunell ✨
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-muted-foreground">
            L'anniversaire de Sophie est dans 12 jours
          </p>
          <span className="px-2 py-0.5 rounded-full bg-secondary text-white text-xs font-semibold">
            12j
          </span>
        </div>
      </div>

      {/* Primary CTA Card */}
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="mx-4 mt-4 p-6 rounded-lg gradient-primary relative overflow-hidden cursor-pointer"
        onClick={() => onStartGiftFlow()}
      >
        <motion.span
          className="absolute right-4 top-4 text-5xl opacity-20"
          animate={{ y: [0, -6, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🎁
        </motion.span>
        <h2 className="font-display italic text-xl text-white mb-1">
          Offrir un cadeau
        </h2>
        <p className="text-white/80 text-sm mb-4">
          Notre IA trouve le cadeau parfait en 60 secondes
        </p>
        <button className="bg-white text-primary font-semibold px-5 py-2.5 rounded-xl text-sm">
          C'est parti 🎁
        </button>
      </motion.div>

      {/* Close ones */}
      <div className="mt-6 px-4">
        <h3 className="font-semibold text-base mb-3">Tes proches</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {/* Add button */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={onAddCloseOne}
            className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary flex items-center justify-center">
              <span className="text-primary text-2xl">+</span>
            </div>
            <span className="text-xs text-muted-foreground">Ajouter</span>
          </motion.div>

          {closeOnes.map((person) => (
            <motion.div
              key={person.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStartGiftFlow(person.id)}
              className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-semibold gradient-primary ring-2 ring-offset-2 ring-offset-background ${
                  person.daysUntilEvent && person.daysUntilEvent < 7
                    ? "ring-golden-honey"
                    : person.daysUntilEvent && person.daysUntilEvent < 14
                    ? "ring-primary"
                    : "ring-transparent"
                }`}
              >
                {person.avatar}
              </div>
              <span className="text-xs text-foreground">{person.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Curated for you */}
      <div className="mt-6 px-4">
        <h2 className="font-display italic text-xl mb-3">Sélectionné pour toi</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onProductTap(product.id)}
              className="flex-shrink-0 w-48 bg-card rounded-lg shadow-card overflow-hidden cursor-pointer"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-36 object-cover"
              />
              <div className="p-3">
                <p className="font-semibold text-sm text-foreground leading-tight line-clamp-2">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {product.seller} · ⭐ {product.rating}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-foreground">{product.price}€</span>
                  <span className="px-2 py-0.5 bg-accent/30 text-accent-foreground text-xs rounded-full flex items-center gap-1">
                    ✨ AI
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming events */}
      <div className="mt-6 px-4 pb-4">
        <h3 className="font-semibold text-base mb-3">Événements à venir</h3>
        <div className="flex flex-col gap-3">
          {closeOnes
            .filter((p) => p.eventDate)
            .map((person) => (
              <motion.div
                key={person.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => onStartGiftFlow(person.id)}
                className="flex items-center gap-3 p-3 bg-card rounded-lg shadow-card cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                  {person.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{person.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {person.eventType} · {person.eventDate}
                  </p>
                </div>
                {person.daysUntilEvent && (
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                      person.daysUntilEvent < 7
                        ? "bg-primary"
                        : person.daysUntilEvent < 30
                        ? "bg-secondary"
                        : "bg-muted-foreground"
                    }`}
                  >
                    {person.daysUntilEvent}j
                  </span>
                )}
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
