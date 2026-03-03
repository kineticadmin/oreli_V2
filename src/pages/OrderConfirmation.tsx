import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gift, MapPin, Clock, ChevronRight, Sparkles, Heart, Home as HomeIcon } from "lucide-react";

interface ConfirmationProps {
  onHome: () => void;
}

const confettiColors = [
  "hsl(var(--primary))",
  "hsl(var(--golden-honey))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--mint-fresh))",
];

const ConfettiParticle: React.FC<{ delay: number; left: number; size: number; color: string }> = ({
  delay,
  left,
  size,
  color,
}) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      left: `${left}%`,
      top: "-5%",
      width: size,
      height: size,
      backgroundColor: color,
    }}
    initial={{ y: 0, rotate: 0, opacity: 1 }}
    animate={{
      y: "110vh",
      rotate: 720,
      opacity: [1, 1, 0.8, 0],
    }}
    transition={{
      duration: 3.5 + Math.random() * 2,
      delay,
      ease: "easeIn",
    }}
  />
);

const OrderConfirmation: React.FC<ConfirmationProps> = ({ onHome }) => {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
      left: Math.random() * 100,
      size: 4 + Math.random() * 8,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    }))
  );

  return (
    <div className="app-container min-h-screen gradient-dark relative overflow-hidden flex flex-col">
      {/* Confetti layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <ConfettiParticle key={p.id} delay={p.delay} left={p.left} size={p.size} color={p.color} />
        ))}
      </div>

      {/* Decorative glow orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-40 right-0 w-[200px] h-[200px] rounded-full bg-accent/10 blur-[80px]" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-lg">
              <Gift className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          {/* Sparkle accents */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-golden-honey" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-3"
            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          >
            <Heart className="w-5 h-5 text-accent" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="font-display text-[28px] leading-tight font-bold text-primary-foreground text-center"
        >
          Cadeau commandé !
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-primary-foreground/70 text-center mt-3 text-base leading-relaxed max-w-[280px]"
        >
          Sophie va adorer son cadeau.
          <br />
          Tu viens de rendre quelqu'un heureux.
        </motion.p>

        {/* Order number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-6 px-5 py-2.5 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 backdrop-blur-sm"
        >
          <span className="text-primary-foreground/60 text-xs font-medium tracking-wider">
            Commande #ORL-2024-1847
          </span>
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 w-full flex flex-col gap-3"
        >
          {/* Delivery card */}
          <div className="rounded-2xl bg-primary-foreground/8 backdrop-blur-sm border border-primary-foreground/10 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-mint-fresh/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-mint-fresh" />
            </div>
            <div className="flex-1">
              <p className="text-primary-foreground text-sm font-semibold">Livraison demain</p>
              <p className="text-primary-foreground/50 text-xs mt-0.5">Avant 18h · Emballage premium</p>
            </div>
          </div>

          {/* Tracking card */}
          <div className="rounded-2xl bg-primary-foreground/8 backdrop-blur-sm border border-primary-foreground/10 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-primary-foreground text-sm font-semibold">Suivi en temps réel</p>
              <p className="text-primary-foreground/50 text-xs mt-0.5">Notifications à chaque étape</p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary-foreground/30 flex-shrink-0" />
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-10 w-full flex flex-col gap-3"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-xl bg-primary-foreground text-foreground font-semibold text-[15px] shadow-card flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Suivre ma commande
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onHome}
            className="w-full py-4 rounded-xl border border-primary-foreground/20 text-primary-foreground font-semibold text-[15px] flex items-center justify-center gap-2"
          >
            <HomeIcon className="w-4 h-4" />
            Retour à l'accueil
          </motion.button>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.4 }}
          className="font-display italic text-primary-foreground text-sm mt-10"
        >
          Oreli — Offrir avec intention
        </motion.p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
