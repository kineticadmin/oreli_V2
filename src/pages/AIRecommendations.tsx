import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
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
      <div className="app-container h-screen flex flex-col items-center justify-center bg-background">
        <motion.div
          className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-primary-foreground text-2xl">✦</span>
        </motion.div>

        <h2 className="text-xl font-bold text-foreground mt-8">
          Oreli réfléchit...
        </h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={thinkingIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-muted-foreground mt-3"
          >
            {thinkingTexts[thinkingIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="app-container h-screen overflow-y-auto bg-background pb-8">
      <div className="px-6 pt-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[22px] font-bold mb-2"
        >
          Recommandations pour {personName}
        </motion.h1>
        <p className="text-sm text-muted-foreground mb-8">
          Score d'affinité basé sur ses goûts et l'occasion
        </p>

        <div className="flex flex-col gap-5">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12 }}
              className="bg-card rounded-2xl shadow-card overflow-hidden"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-52 object-cover"
              />
              <div className="p-5">
                {/* Score bar */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-foreground animate-fill-bar"
                      style={{ "--fill-width": `${product.matchScore}%` } as React.CSSProperties}
                    />
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {product.matchScore}%
                  </span>
                </div>

                <h2 className="text-lg font-bold">{product.name}</h2>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {product.aiJustification}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {product.seller} · <Star className="w-3 h-3 fill-foreground text-foreground" /> {product.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-foreground">{product.price}€</span>
                  <span className="text-xs text-muted-foreground">Frais inclus</span>
                </div>

                <div className="flex gap-2.5 mt-4">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectProduct(product.id)}
                    className="flex-1 py-3 rounded-full border-2 border-foreground text-foreground font-semibold text-sm"
                  >
                    Voir détail
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectProduct(product.id)}
                    className="flex-1 py-3 rounded-full bg-foreground text-primary-foreground font-semibold text-sm"
                  >
                    Offrir celui-ci
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button className="w-full mt-6 py-3 text-muted-foreground text-sm font-medium">
          Aucun ne me plaît — relancer la recherche
        </button>
      </div>
    </div>
  );
};

export default AIRecommendations;
