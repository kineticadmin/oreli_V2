import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import onboarding1 from "@/assets/onboarding-gift-1.jpg";
import onboarding2 from "@/assets/onboarding-gift-2.jpg";
import onboarding3 from "@/assets/onboarding-gift-3.jpg";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    image: onboarding1,
    titleLines: [
      { text: "Ton", style: "normal" },
      { text: "Cadeau.", style: "italic" },
      { text: "Ton", style: "normal" },
      { text: "Moment.", style: "italic" },
    ],
    subtitle: "Fini les heures de recherche et le stress de dernière minute.",
    overlayGradient: "from-primary/60 via-secondary/30 to-transparent",
  },
  {
    image: onboarding2,
    titleLines: [
      { text: "On", style: "normal" },
      { text: "Comprend", style: "italic" },
      { text: "Ceux que", style: "normal" },
      { text: "Tu Aimes.", style: "italic" },
    ],
    subtitle: "Notre IA apprend les goûts de tes proches et propose des cadeaux qui touchent en plein cœur.",
    overlayGradient: "from-accent/50 via-primary/20 to-transparent",
  },
  {
    image: onboarding3,
    titleLines: [
      { text: "60", style: "normal" },
      { text: "Secondes.", style: "italic" },
      { text: "Le Cadeau", style: "normal" },
      { text: "Parfait.", style: "italic" },
    ],
    subtitle: "Des artisans locaux à Bruxelles, livrés chez toi. Zéro stress.",
    overlayGradient: "from-secondary/60 via-golden-honey/30 to-transparent",
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
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
          />

          {/* Bottom gradient overlay for text readability */}
          <div className={`absolute inset-0 bg-gradient-to-t ${slides[current].overlayGradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

          {/* Floating sparkles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-golden-honey"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 8}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.7,
              }}
            />
          ))}

          {/* Logo top-left */}
          <div className="absolute top-6 left-6 z-10">
            <span className="font-display italic text-lg text-primary-foreground/90 tracking-wide">
              Orel<span className="relative">i<span className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-golden-honey" /></span>
            </span>
          </div>

          {/* Skip button top-right */}
          {current < 2 && (
            <button
              onClick={onComplete}
              className="absolute top-6 right-6 z-10 text-sm text-primary-foreground/60 font-sans"
            >
              Passer
            </button>
          )}

          {/* Bold typography overlay — bottom-aligned like the reference */}
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-32 z-10">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              {slides[current].titleLines.map((line, i) => (
                <h1
                  key={i}
                  className={`font-display text-[42px] leading-[1.05] text-primary-foreground ${
                    line.style === "italic" ? "italic text-primary" : "font-bold"
                  }`}
                >
                  {line.text}
                </h1>
              ))}
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-primary-foreground/70 text-sm leading-relaxed mt-4 max-w-[280px] font-sans"
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
                    backgroundColor: i === current
                      ? "hsl(0 100% 70%)"
                      : "hsla(0, 0%, 100%, 0.3)",
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
                className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg"
              >
                <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="px-8 py-4 rounded-xl gradient-primary text-primary-foreground font-semibold text-base shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Commencer →
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
