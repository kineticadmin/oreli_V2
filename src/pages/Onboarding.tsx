import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    bg: "gradient-dark",
    title: "Trouver le cadeau parfait ne devrait pas être aussi compliqué.",
    subtitle: "Fini les heures de recherche, les idées en panne, le stress de dernière minute.",
    titleColor: "text-white",
    subtitleColor: "text-cream/70",
  },
  {
    bg: "bg-gradient-to-b from-soft-lavender/30 to-cream",
    title: "Oreli comprend ceux que tu aimes.",
    subtitle: "Notre IA apprend les goûts de tes proches et propose des cadeaux qui touchent en plein cœur.",
    titleColor: "text-deep-plum",
    subtitleColor: "text-muted-foreground",
  },
  {
    bg: "gradient-primary",
    title: "En 60 secondes, le cadeau parfait.",
    subtitle: "Des artisans locaux, livrés chez toi. Zéro stress.",
    titleColor: "text-white",
    subtitleColor: "text-white/80",
  },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    if (current < 2) setCurrent(current + 1);
    else onComplete();
  };

  return (
    <div className="app-container h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className={`absolute inset-0 flex flex-col items-center justify-center px-8 ${slides[current].bg}`}
        >
          {/* Decorative elements */}
          {current === 0 && (
            <div className="mb-8 relative">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl"
              >
                😰
              </motion.div>
              {["❓", "❓", "❓"].map((q, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl"
                  style={{ top: -20 + i * 10, left: 60 + i * 20 }}
                  animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                >
                  {q}
                </motion.span>
              ))}
            </div>
          )}

          {current === 1 && (
            <div className="mb-8 relative">
              <motion.div
                className="w-24 h-24 rounded-full gradient-magic flex items-center justify-center"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl">✨</span>
              </motion.div>
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="absolute text-lg"
                  style={{
                    top: Math.sin(i * 1.5) * 50 - 10,
                    left: Math.cos(i * 1.5) * 60 + 30,
                  }}
                  animate={{
                    y: [0, -12, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
                >
                  🎁
                </motion.span>
              ))}
            </div>
          )}

          {current === 2 && (
            <motion.div
              className="mb-8 text-7xl"
              animate={{ rotateY: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              🎁
            </motion.div>
          )}

          <h1
            className={`font-display text-[28px] leading-tight font-bold text-center mb-4 ${slides[current].titleColor}`}
          >
            {slides[current].title}
          </h1>
          <p
            className={`text-center text-base leading-relaxed max-w-[300px] ${slides[current].subtitleColor}`}
          >
            {slides[current].subtitle}
          </p>

          {/* Bottom controls */}
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-6 px-8">
            {/* Pagination dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 bg-primary"
                      : "w-2 bg-cream/40"
                  }`}
                />
              ))}
            </div>

            {current < 2 ? (
              <button
                onClick={next}
                className="text-base font-semibold tracking-wide"
                style={{ color: current === 0 ? "hsl(30 100% 97%)" : "hsl(0 100% 70%)" }}
              >
                Suivant →
              </button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="w-full py-4 rounded-xl bg-white text-primary font-semibold text-lg"
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
