import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Send } from "lucide-react";
import { closeOnes, occasions, products } from "@/data/mockData";

interface GiftFlowProps {
  preselectedPerson?: string;
  onComplete: (data: GiftFlowData) => void;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
}

export interface GiftFlowData {
  personId: string;
  budget: [number, number];
  occasion: string;
  deliveryDate: string;
  surpriseLevel: string;
}

type MessageRole = "oreli" | "user" | "choices" | "products";

interface ChatMessage {
  id: string;
  role: MessageRole;
  text?: string;
  choices?: { id: string; emoji?: string; label: string; sub?: string }[];
  products?: typeof products;
  field?: string;
}

const budgetChoices = [
  { id: "30", emoji: "💰", label: "~30€", sub: "Un geste attentionné" },
  { id: "50", emoji: "💰", label: "~50€", sub: "Le juste milieu" },
  { id: "80", emoji: "💎", label: "~80€", sub: "Quelque chose de spécial" },
  { id: "100", emoji: "👑", label: "~100€+", sub: "Faire vraiment plaisir" },
];

const deliveryChoices = [
  { id: "today", emoji: "⚡", label: "Aujourd'hui", sub: "Express" },
  { id: "tomorrow", emoji: "📦", label: "Demain", sub: "" },
  { id: "week", emoji: "📅", label: "Cette semaine", sub: "" },
];

const surpriseChoices = [
  { id: "total", emoji: "🎁", label: "Surprise Totale", sub: "Fais-moi confiance, je m'occupe de tout" },
  { id: "guided", emoji: "🔍", label: "Surprise Guidée", sub: "Montre-moi des options, je choisis" },
  { id: "choose", emoji: "🎯", label: "Je Choisis", sub: "Je veux voir une sélection" },
];

const occasionChoices = occasions.map((o) => ({
  id: o.label,
  emoji: o.emoji,
  label: o.label,
}));

const personChoices = closeOnes.map((p) => ({
  id: p.id,
  emoji: p.avatar,
  label: p.name,
  sub: p.relationship,
}));

const GiftFlow: React.FC<GiftFlowProps> = ({ preselectedPerson, onComplete, onClose, onSelectProduct }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [data, setData] = useState<Partial<GiftFlowData>>({
    personId: preselectedPerson || "",
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = [
    { field: "personId", skip: !!preselectedPerson },
    { field: "budget" },
    { field: "occasion" },
    { field: "deliveryDate" },
    { field: "surpriseLevel" },
  ];

  const getPersonName = (id: string) => closeOnes.find((p) => p.id === id)?.name || "";

  const addMessage = (msg: Omit<ChatMessage, "id">) => {
    const newMsg = { ...msg, id: Date.now().toString() + Math.random() };
    setMessages((prev) => [...prev, newMsg]);
  };

  const simulateTyping = (callback: () => void, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const askQuestion = (stepIndex: number, extraContext?: Record<string, string>) => {
    const step = steps[stepIndex];
    if (!step) return;

    const personName = extraContext?.personName || getPersonName(data.personId || "");

    switch (step.field) {
      case "personId":
        simulateTyping(() => {
          addMessage({ role: "oreli", text: "Bonjour ! ✨ À qui veux-tu offrir un cadeau ?" });
          setTimeout(() => {
            addMessage({
              role: "choices",
              choices: [
                ...personChoices,
                { id: "new", emoji: "+", label: "Quelqu'un d'autre" },
              ],
              field: "personId",
            });
          }, 300);
        });
        break;
      case "budget":
        simulateTyping(() => {
          addMessage({
            role: "oreli",
            text: `Super choix ! ${personName} a de la chance 💝 Quel budget as-tu en tête ?`,
          });
          setTimeout(() => {
            addMessage({ role: "choices", choices: budgetChoices, field: "budget" });
          }, 300);
        });
        break;
      case "occasion":
        simulateTyping(() => {
          addMessage({
            role: "oreli",
            text: "Parfait ! C'est pour quelle occasion ? 🎉",
          });
          setTimeout(() => {
            addMessage({ role: "choices", choices: occasionChoices, field: "occasion" });
          }, 300);
        });
        break;
      case "deliveryDate":
        simulateTyping(() => {
          addMessage({
            role: "oreli",
            text: "Tu en as besoin pour quand ? ⏰",
          });
          setTimeout(() => {
            addMessage({ role: "choices", choices: deliveryChoices, field: "deliveryDate" });
          }, 300);
        });
        break;
      case "surpriseLevel":
        simulateTyping(() => {
          addMessage({
            role: "oreli",
            text: "Dernière question ! Comment veux-tu que je t'aide ? 🎁",
          });
          setTimeout(() => {
            addMessage({ role: "choices", choices: surpriseChoices, field: "surpriseLevel" });
          }, 300);
        });
        break;
    }
  };

  // Start conversation
  useEffect(() => {
    const firstStep = preselectedPerson ? 1 : 0;
    setCurrentStep(firstStep);

    if (preselectedPerson) {
      const name = getPersonName(preselectedPerson);
      simulateTyping(() => {
        addMessage({
          role: "oreli",
          text: `Tu veux offrir un cadeau à ${name} ? Quelle belle idée ! 💝 Quel budget as-tu en tête ?`,
        });
        setTimeout(() => {
          addMessage({ role: "choices", choices: budgetChoices, field: "budget" });
        }, 300);
      });
    } else {
      askQuestion(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleChoice = (field: string, choiceId: string, choiceLabel: string) => {
    // Add user reply bubble
    addMessage({ role: "user", text: choiceLabel });

    const newData = { ...data };
    let nextStep = currentStep + 1;

    switch (field) {
      case "personId":
        newData.personId = choiceId;
        break;
      case "budget": {
        const val = parseInt(choiceId);
        newData.budget = [Math.max(10, val - 20), val + 20];
        break;
      }
      case "occasion":
        newData.occasion = choiceId;
        break;
      case "deliveryDate":
        newData.deliveryDate = choiceId;
        break;
      case "surpriseLevel":
        newData.surpriseLevel = choiceId;
        break;
    }

    setData(newData);

    // Find next non-skipped step
    while (nextStep < steps.length && steps[nextStep].skip) {
      nextStep++;
    }

    if (field === "surpriseLevel") {
      // Final step — handle based on surprise level
      handleSurpriseOutcome(choiceId, newData);
    } else {
      setCurrentStep(nextStep);
      setTimeout(() => {
        askQuestion(nextStep, { personName: getPersonName(newData.personId || "") });
      }, 400);
    }
  };

  const handleSurpriseOutcome = (level: string, finalData: Partial<GiftFlowData>) => {
    const personName = getPersonName(finalData.personId || "");
    const maxBudget = finalData.budget?.[1] || 80;

    const filteredProducts = products.filter((p) => p.price <= maxBudget + 20);

    if (level === "total") {
      // Total surprise — no products shown, just confirm
      simulateTyping(() => {
        addMessage({
          role: "oreli",
          text: `C'est parti ! 🎉 Je m'occupe de tout pour ${personName}. Je vais sélectionner le cadeau parfait basé sur ses goûts et te l'envoyer directement.`,
        });
        setTimeout(() => {
          addMessage({
            role: "oreli",
            text: "Ta surprise est prête à être lancée ! Confirme pour passer au paiement 💝",
          });
          setTimeout(() => {
            addMessage({
              role: "choices",
              choices: [
                { id: "confirm", emoji: "✨", label: "Lancer la surprise !", sub: "" },
                { id: "change", emoji: "🔄", label: "Changer d'avis", sub: "" },
              ],
              field: "confirm_total",
            });
          }, 300);
        }, 600);
      }, 1200);
    } else if (level === "guided") {
      // Guided — show max 3 products
      simulateTyping(() => {
        addMessage({
          role: "oreli",
          text: `Voici mes 3 meilleures suggestions pour ${personName} 💝 Elles correspondent parfaitement à tes critères !`,
        });
        setTimeout(() => {
          addMessage({
            role: "products",
            products: filteredProducts.slice(0, 3),
          });
        }, 400);
      }, 1500);
    } else {
      // Choose — show larger selection
      simulateTyping(() => {
        addMessage({
          role: "oreli",
          text: `Voici une sélection de cadeaux pour ${personName} 🎁 Tous filtrés selon tes préférences. À toi de choisir !`,
        });
        setTimeout(() => {
          addMessage({
            role: "products",
            products: filteredProducts,
          });
        }, 400);
      }, 1500);
    }
  };

  const handleConfirmTotal = (choiceId: string) => {
    if (choiceId === "confirm") {
      addMessage({ role: "user", text: "Lancer la surprise !" });
      onComplete({
        personId: data.personId || "",
        budget: data.budget || [30, 80],
        occasion: data.occasion || "",
        deliveryDate: data.deliveryDate || "",
        surpriseLevel: "total",
      });
    } else {
      addMessage({ role: "user", text: "Changer d'avis" });
      // Go back to surprise level step
      setCurrentStep(4);
      setTimeout(() => askQuestion(4), 400);
    }
  };

  const totalSteps = steps.filter((s) => !s.skip).length;
  const completedSteps = Math.min(currentStep, totalSteps);
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className="app-container h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </motion.button>
        <div className="flex-1 mx-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-magic flex items-center justify-center">
            <span className="text-xs">✨</span>
          </div>
          <span className="font-display italic text-sm text-foreground">Oreli</span>
        </div>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[100px]">
          <motion.div
            className="h-full rounded-full gradient-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="ml-3">
          <X className="w-5 h-5 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-2 pb-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-3"
            >
              {msg.role === "oreli" && (
                <div className="flex gap-2 items-start max-w-[85%]">
                  <div className="w-7 h-7 rounded-full gradient-magic flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px]">✨</span>
                  </div>
                  <div className="bg-card rounded-2xl rounded-tl-md px-4 py-3 shadow-card">
                    <p className="text-sm text-foreground leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              )}

              {msg.role === "user" && (
                <div className="flex justify-end">
                  <div className="gradient-primary rounded-2xl rounded-tr-md px-4 py-3 max-w-[75%]">
                    <p className="text-sm text-primary-foreground">{msg.text}</p>
                  </div>
                </div>
              )}

              {msg.role === "choices" && msg.choices && (
                <div className="pl-9 flex flex-wrap gap-2 mt-1">
                  {msg.choices.map((choice) => (
                    <motion.button
                      key={choice.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (msg.field === "confirm_total") {
                          handleConfirmTotal(choice.id);
                        } else {
                          handleChoice(msg.field || "", choice.id, `${choice.emoji || ""} ${choice.label}`);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border-2 border-primary/20 hover:border-primary shadow-card transition-all text-left"
                    >
                      {choice.emoji && <span className="text-lg">{choice.emoji}</span>}
                      <div>
                        <p className="text-sm font-semibold text-foreground">{choice.label}</p>
                        {choice.sub && (
                          <p className="text-[11px] text-muted-foreground">{choice.sub}</p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {msg.role === "products" && msg.products && (
                <div className="pl-9 flex flex-col gap-3 mt-2">
                  {msg.products.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="bg-card rounded-xl shadow-card overflow-hidden"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full gradient-celebration animate-fill-bar"
                              style={{ "--fill-width": `${product.matchScore}%` } as React.CSSProperties}
                            />
                          </div>
                          <span className="text-xs font-semibold text-secondary">
                            {product.matchScore}%
                          </span>
                        </div>
                        <h3 className="font-display text-sm font-bold leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground mt-1 italic">
                          {product.aiJustification}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-foreground">{product.price}€</span>
                          <span className="text-[10px] text-muted-foreground">
                            {product.seller} · ⭐ {product.rating}
                          </span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onSelectProduct(product.id)}
                          className="w-full mt-2 py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm"
                        >
                          Offrir celui-ci 🎁
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 items-center mb-3"
          >
            <div className="w-7 h-7 rounded-full gradient-magic flex items-center justify-center flex-shrink-0">
              <span className="text-[10px]">✨</span>
            </div>
            <div className="bg-card rounded-2xl rounded-tl-md px-4 py-3 shadow-card flex gap-1">
              <motion.span
                className="w-2 h-2 rounded-full bg-accent"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.span
                className="w-2 h-2 rounded-full bg-accent"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
              />
              <motion.span
                className="w-2 h-2 rounded-full bg-accent"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GiftFlow;
