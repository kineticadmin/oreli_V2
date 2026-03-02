import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfirmationProps {
  onHome: () => void;
}

const confettiColors = ["hsl(0 100% 70%)", "hsl(39 100% 60%)", "hsl(257 55% 78%)"];

const ConfettiParticle: React.FC<{ delay: number; left: number }> = ({ delay, left }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-sm"
    style={{
      left: `${left}%`,
      top: "-5%",
      backgroundColor: confettiColors[Math.floor(Math.random() * 3)],
    }}
    initial={{ y: 0, rotate: 0, opacity: 1 }}
    animate={{
      y: "110vh",
      rotate: 720,
      opacity: [1, 1, 0],
    }}
    transition={{
      duration: 3,
      delay,
      ease: "easeIn",
    }}
  />
);

const OrderConfirmation: React.FC<ConfirmationProps> = ({ onHome }) => {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      delay: Math.random() * 1.5,
      left: Math.random() * 100,
    }))
  );

  return (
    <div className="app-container h-screen gradient-dark relative overflow-hidden flex flex-col items-center justify-center px-8">
      {/* Confetti */}
      {particles.map((p) => (
        <ConfettiParticle key={p.id} delay={p.delay} left={p.left} />
      ))}

      {/* Gift animation */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-8xl mb-6"
      >
        🎉
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-display text-[32px] font-bold text-white text-center"
      >
        Cadeau commandé ! 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-cream text-center mt-2 text-base"
      >
        Sophie va adorer. Livraison demain avant 18h.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 px-4 py-2 rounded-full bg-cream/10 text-cream text-sm"
      >
        Commande #ORL-2024-1847
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-8 w-full flex flex-col gap-3"
      >
        <button className="w-full py-4 rounded-xl bg-white text-deep-plum font-semibold text-base">
          Suivre ma commande
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-base"
        >
          Retour à l'accueil
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2 }}
        className="font-display italic text-cream mt-8 text-sm"
      >
        Tu viens de rendre quelqu'un heureux.
      </motion.p>
    </div>
  );
};

export default OrderConfirmation;
