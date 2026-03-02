import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/mockData";

interface AIRecommendationsProps {
  personName: string;
  onSelectProduct: (productId: string) => void;
  onBack: () => void;
}

const thinkingTexts = [
  "Analyse des goûts de Sophie...",
  "Recherche parmi 847 artisans...",
  "Sélection des meilleurs cadeaux...",
];

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  personName,
  onSelectProduct,
  onBack,
}) => {
  const [thinking, setThinking] = useState(true);
  const [thinkingIdx, setThinkingIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThinkingIdx((p) => (p + 1) % thinkingTexts.length);
    }, 1000);
    const timeout = setTimeout(() => {
      setThinking(false);
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (thinking) {
    return (
      <div className="app-container h-screen flex flex-col items-center justify-center bg-soft-lavender/20">
        {/* Pulsing orb */}
        <motion.div
          className="w-32 h-32 rounded-full gradient-magic relative"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="absolute text-sm"
              style={{
                top: `${20 + Math.sin(i * 1.2) * 60}%`,
                left: `${20 + Math.cos(i * 1.2) * 60}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            >
              ✨
            </motion.span>
          ))}
        </motion.div>

        <h2 className="font-display italic text-xl text-foreground mt-8">
          Oreli réfléchit...
        </h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={thinkingIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-muted-foreground mt-2"
          >
            {thinkingTexts[thinkingIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="app-container h-screen overflow-y-auto bg-background pb-6">
      <div className="px-4 pt-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="text-muted-foreground text-sm mb-4"
        >
          ← Retour
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-[24px] font-bold mb-1"
        >
          Voici mes recommandations pour {personName} 💝
        </motion.h1>
        <p className="text-sm text-muted-foreground mb-6">
          Score d'affinité basé sur ses goûts et l'occasion
        </p>

        <div className="flex flex-col gap-4">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.15 }}
              className="bg-card rounded-lg shadow-card overflow-hidden"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                {/* Score bar */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-celebration animate-fill-bar"
                      style={{ "--fill-width": `${product.matchScore}%` } as React.CSSProperties}
                    />
                  </div>
                  <span className="text-sm font-semibold text-secondary">
                    {product.matchScore}%
                  </span>
                </div>

                <h2 className="font-display text-lg font-bold">{product.name}</h2>
                <p className="text-sm italic text-muted-foreground mt-1">
                  {product.aiJustification}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {product.seller} · ⭐ {product.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-semibold text-foreground">{product.price}€</span>
                  <span className="text-xs text-muted-foreground">Frais inclus</span>
                </div>

                <div className="flex gap-2 mt-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectProduct(product.id)}
                    className="flex-1 py-2.5 rounded-xl border-2 border-primary text-primary font-semibold text-sm"
                  >
                    Voir détail
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectProduct(product.id)}
                    className="flex-1 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm"
                  >
                    Offrir celui-ci
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button className="w-full mt-4 py-3 text-muted-foreground text-sm">
          Aucun ne me plaît — relancer la recherche 🔄
        </button>
      </div>
    </div>
  );
};

export default AIRecommendations;
