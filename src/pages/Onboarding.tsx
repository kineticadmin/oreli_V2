import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import onboarding1 from "@/assets/onboarding-gift-1.jpg";
import onboarding2 from "@/assets/onboarding-gift-2.jpg";
import onboarding3 from "@/assets/onboarding-gift-3.jpg";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    image: onboarding1,
    title: "Offrir avec\nintention",
    subtitle: "Fini les heures de recherche et le stress de dernière minute.",
  },
  {
    image: onboarding2,
    title: "On comprend\nceux que\ntu aimes",
    subtitle: "Notre IA apprend les goûts de tes proches et propose des cadeaux qui touchent en plein cœur.",
  },
  {
    image: onboarding3,
    title: "60 secondes.\nLe cadeau\nparfait.",
    subtitle: "Des artisans locaux à Bruxelles, livrés chez toi. Zéro stress.",
  },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    if (current < 2) setCurrent(current + 1);
    else onComplete();
  };

  return (
    <div className="app-container h-screen relative overflow-hidden bg-foreground">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          {/* Full-bleed background image */}
          <motion.img
            src={slides[current].image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

          {/* Logo top-left */}
          <div className="absolute top-6 left-6 z-10">
            <span className="text-lg font-bold text-white tracking-tight">
              Oreli
            </span>
          </div>

          {/* Skip button top-right */}
          {current < 2 && (
            <button
              onClick={onComplete}
              className="absolute top-6 right-6 z-10 text-sm text-white/60 font-medium"
            >
              Passer
            </button>
          )}

          {/* Typography overlay — bottom-aligned */}
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-32 z-10">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <h1 className="text-[38px] leading-[1.05] text-white font-bold whitespace-pre-line">
                {slides[current].title}
              </h1>
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-white/60 text-[15px] leading-relaxed mt-5 max-w-[280px]"
            >
              {slides[current].subtitle}
            </motion.p>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-8 z-20">
            {/* Pagination dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === current ? 24 : 8,
                    backgroundColor: i === current ? "#fff" : "rgba(255,255,255,0.3)",
                  }}
                  className="h-2 rounded-full"
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            {current < 2 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={next}
                className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg"
              >
                <ArrowRight className="w-6 h-6 text-foreground" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="px-8 py-4 rounded-full bg-white text-foreground font-semibold text-base shadow-lg flex items-center gap-2"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Commencer <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
