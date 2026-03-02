import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { closeOnes, occasions } from "@/data/mockData";

interface GiftFlowProps {
  preselectedPerson?: string;
  onComplete: (data: GiftFlowData) => void;
  onClose: () => void;
}

export interface GiftFlowData {
  personId: string;
  budget: [number, number];
  occasion: string;
  deliveryDate: string;
  surpriseLevel: string;
}

const budgetPills = [30, 50, 80, 100, 150];

const GiftFlow: React.FC<GiftFlowProps> = ({ preselectedPerson, onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedPerson, setSelectedPerson] = useState(preselectedPerson || "");
  const [budgetRange, setBudgetRange] = useState<[number, number]>([30, 80]);
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [surpriseLevel, setSurpriseLevel] = useState("");

  const goNext = () => {
    if (step < 5) setStep(step + 1);
    else {
      onComplete({
        personId: selectedPerson,
        budget: budgetRange,
        occasion: selectedOccasion,
        deliveryDate,
        surpriseLevel,
      });
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
    else onClose();
  };

  const canContinue = () => {
    switch (step) {
      case 1: return !!selectedPerson;
      case 2: return true;
      case 3: return !!selectedOccasion;
      case 4: return !!deliveryDate;
      case 5: return !!surpriseLevel;
      default: return false;
    }
  };

  const surpriseOptions = [
    {
      id: "total",
      emoji: "🎁",
      title: "Surprise Totale",
      desc: "Fais-moi confiance, je m'occupe de tout",
      bg: "gradient-magic",
      textColor: "text-white",
    },
    {
      id: "guided",
      emoji: "🔍",
      title: "Surprise Guidée",
      desc: "Montre-moi des options, je choisis",
      bg: "bg-cream",
      textColor: "text-foreground",
    },
    {
      id: "choose",
      emoji: "🎯",
      title: "Je Choisis",
      desc: "Je sais ce que je veux, aide-moi à trouver",
      bg: "bg-warm-white",
      textColor: "text-foreground",
    },
  ];

  const deliveryOptions = [
    { id: "today", label: "Aujourd'hui", sub: "⚡", badge: "Express" },
    { id: "tomorrow", label: "Demain", sub: "", badge: "" },
    { id: "week", label: "Cette semaine", sub: "", badge: "" },
  ];

  return (
    <div className="app-container h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <motion.button whileTap={{ scale: 0.9 }} onClick={goBack}>
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </motion.button>
        <div className="flex-1 mx-4 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-primary"
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
          <X className="w-6 h-6 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Who */}
            {step === 1 && (
              <div>
                <h1 className="font-display text-[26px] font-bold mb-1">À qui veux-tu offrir ?</h1>
                <p className="text-sm text-muted-foreground mb-6">
                  Choisis un proche ou ajoute quelqu'un de nouveau
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {closeOnes.map((person) => (
                    <motion.div
                      key={person.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedPerson(person.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        selectedPerson === person.id
                          ? "border-primary bg-muted"
                          : "border-transparent bg-card shadow-card"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold mb-2">
                        {person.avatar}
                      </div>
                      <p className="font-semibold text-sm">{person.name}</p>
                      <span className="text-xs text-muted-foreground">{person.relationship}</span>
                      {selectedPerson === person.id && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 text-primary"
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </div>
                <button className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-primary text-primary font-semibold text-sm">
                  + Ajouter un proche
                </button>
              </div>
            )}

            {/* Step 2: Budget */}
            {step === 2 && (
              <div>
                <h1 className="font-display text-[26px] font-bold mb-1">Quel est ton budget ?</h1>
                <p className="text-center text-2xl font-semibold my-8 text-foreground">
                  {budgetRange[0]}€ — {budgetRange[1]}€
                </p>
                <div className="px-2 mb-6">
                  <input
                    type="range"
                    min={10}
                    max={300}
                    value={budgetRange[1]}
                    onChange={(e) =>
                      setBudgetRange([budgetRange[0], parseInt(e.target.value)])
                    }
                    className="w-full accent-primary h-2 rounded-full appearance-none bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-deep-plum [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {budgetPills.map((val) => (
                    <motion.button
                      key={val}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setBudgetRange([Math.max(10, val - 20), val])}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        budgetRange[1] === val
                          ? "gradient-primary text-white"
                          : "border-2 border-primary text-primary"
                      }`}
                    >
                      ~{val}€
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Occasion */}
            {step === 3 && (
              <div>
                <h1 className="font-display text-[26px] font-bold mb-6">
                  C'est pour quelle occasion ?
                </h1>
                <div className="grid grid-cols-2 gap-3">
                  {occasions.map((occ) => (
                    <motion.div
                      key={occ.label}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedOccasion(occ.label)}
                      className={`p-4 rounded-lg text-center cursor-pointer transition-all duration-300 ${
                        selectedOccasion === occ.label
                          ? "gradient-primary text-white scale-105"
                          : "bg-card shadow-card"
                      }`}
                    >
                      <span className="text-3xl block mb-2">{occ.emoji}</span>
                      <span className="text-sm font-semibold">{occ.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: When */}
            {step === 4 && (
              <div>
                <h1 className="font-display text-[26px] font-bold mb-6">Pour quand ?</h1>
                <div className="flex flex-col gap-3">
                  {deliveryOptions.map((opt) => (
                    <motion.div
                      key={opt.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setDeliveryDate(opt.id)}
                      className={`p-4 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                        deliveryDate === opt.id
                          ? "border-2 border-primary bg-muted"
                          : "bg-card shadow-card border-2 border-transparent"
                      }`}
                    >
                      <span className="font-semibold text-sm">
                        {opt.label} {opt.sub}
                      </span>
                      {opt.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-semibold">
                          {opt.badge}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Surprise level */}
            {step === 5 && (
              <div>
                <h1 className="font-display text-[26px] font-bold mb-6">
                  Quel niveau de surprise ?
                </h1>
                <div className="flex flex-col gap-3">
                  {surpriseOptions.map((opt) => (
                    <motion.div
                      key={opt.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSurpriseLevel(opt.id)}
                      className={`p-5 rounded-lg cursor-pointer transition-all ${opt.bg} ${
                        surpriseLevel === opt.id
                          ? "border-2 border-primary shadow-card-hover scale-[1.02]"
                          : "border-2 border-transparent shadow-card"
                      }`}
                    >
                      <span className="text-3xl block mb-2">{opt.emoji}</span>
                      <p className={`font-semibold ${opt.textColor}`}>{opt.title}</p>
                      <p className={`text-sm ${opt.textColor} opacity-70`}>{opt.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={goNext}
          disabled={!canContinue()}
          className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
            canContinue()
              ? "gradient-primary text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {step === 5 ? "Trouver le cadeau parfait ✨" : "Continuer"}
        </motion.button>
      </div>
    </div>
  );
};

export default GiftFlow;
