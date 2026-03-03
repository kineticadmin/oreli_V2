import React from "react";
import { motion } from "framer-motion";
import { Gift, MapPin, Clock, ChevronRight, Home as HomeIcon, Check } from "lucide-react";

interface ConfirmationProps {
  onHome: () => void;
}

const OrderConfirmation: React.FC<ConfirmationProps> = ({ onHome }) => {
  return (
    <div className="app-container min-h-screen bg-background flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-foreground flex items-center justify-center">
            <Check className="w-10 h-10 text-primary-foreground" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-[28px] leading-tight font-bold text-foreground text-center"
        >
          Cadeau commandé !
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground text-center mt-4 text-base leading-relaxed max-w-[280px]"
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
          className="mt-6 px-5 py-2.5 rounded-full border border-border bg-muted"
        >
          <span className="text-muted-foreground text-xs font-medium tracking-wider">
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
          <div className="rounded-2xl bg-card border border-border p-5 flex items-center gap-4 shadow-card">
            <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-foreground text-sm font-semibold">Livraison demain</p>
              <p className="text-muted-foreground text-xs mt-0.5">Avant 18h · Emballage premium</p>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5 flex items-center gap-4 shadow-card">
            <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-foreground text-sm font-semibold">Suivi en temps réel</p>
              <p className="text-muted-foreground text-xs mt-0.5">Notifications à chaque étape</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
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
            className="w-full py-4 rounded-full bg-foreground text-primary-foreground font-semibold text-[15px] flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Suivre ma commande
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onHome}
            className="w-full py-4 rounded-full border-2 border-border text-foreground font-semibold text-[15px] flex items-center justify-center gap-2"
          >
            <HomeIcon className="w-4 h-4" />
            Retour à l'accueil
          </motion.button>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.4 }}
          className="text-muted-foreground text-sm mt-10 font-medium"
        >
          Oreli — Offrir avec intention
        </motion.p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
