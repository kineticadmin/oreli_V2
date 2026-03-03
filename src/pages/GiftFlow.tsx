import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Send, Gift, Sparkles, Heart, Star, Calendar, Clock, Search, Eye, ChevronRight } from "lucide-react";
import { closeOnes, occasions, products } from "@/data/mockData";

export interface GiftFlowProps {
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

type MessageRole = "oreli" | "user" | "choices" | "products" | "summary";

interface ChatMessage {
  id: string;
  role: MessageRole;
  text?: string;
  choices?: { id: string; icon?: React.ReactNode; label: string; sub?: string }[];
  products?: typeof products;
  field?: string;
  summaryData?: { budget: string; delivery: string; person: string };
}

const budgetChoices = [
  { id: "30", icon: <span className="text-sm font-semibold text-primary">€</span>, label: "~30€", sub: "Un geste attentionné" },
  { id: "50", icon: <span className="text-sm font-semibold text-primary">€€</span>, label: "~50€", sub: "Le juste milieu" },
  { id: "80", icon: <Star className="w-4 h-4 text-primary" />, label: "~80€", sub: "Quelque chose de spécial" },
  { id: "100", icon: <Sparkles className="w-4 h-4 text-primary" />, label: "~100€+", sub: "Faire vraiment plaisir" },
];

const deliveryChoices = [
  { id: "today", icon: <Clock className="w-4 h-4 text-primary" />, label: "Aujourd'hui", sub: "Express" },
  { id: "tomorrow", icon: <Calendar className="w-4 h-4 text-primary" />, label: "Demain", sub: "" },
  { id: "week", icon: <Calendar className="w-4 h-4 text-muted-foreground" />, label: "Cette semaine", sub: "" },
];

const surpriseChoices = [
  { id: "total", icon: <Gift className="w-4 h-4 text-[hsl(var(--lavender))]" />, label: "Surprise Totale", sub: "Je m'occupe de tout" },
  { id: "guided", icon: <Eye className="w-4 h-4 text-primary" />, label: "Surprise Guidée", sub: "Montre-moi des options" },
  { id: "choose", icon: <Search className="w-4 h-4 text-foreground" />, label: "Je Choisis", sub: "Je veux voir une sélection" },
];

const occasionChoices = occasions.map((o) => ({
  id: o.label,
  icon: <span className="text-base">{o.emoji}</span>,
  label: o.label,
}));

const personChoices = closeOnes.map((p) => ({
  id: p.id,
  icon: (
    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
      <span className="text-xs font-semibold text-primary">{p.avatar}</span>
    </div>
  ),
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
  const [inputValue, setInputValue] = useState("");
  const [currentField, setCurrentField] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setCurrentField(step.field);

    switch (step.field) {
      case "personId":
        simulateTyping(() => {
          addMessage({ role: "oreli", text: "Bonjour ! À qui souhaites-tu offrir un cadeau ?" });
          setTimeout(() => {
            addMessage({
              role: "choices",
              choices: [
                ...personChoices,
                { id: "new", icon: <Heart className="w-4 h-4 text-primary" />, label: "Quelqu'un d'autre" },
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
            text: `${personName} a de la chance ! Quel budget as-tu en tête ?`,
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
            text: "Parfait ! C'est pour quelle occasion ?",
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
            text: "Tu en as besoin pour quand ?",
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
            text: "Dernière question : quel niveau de surprise souhaites-tu ?",
          });
          setTimeout(() => {
            addMessage({ role: "choices", choices: surpriseChoices, field: "surpriseLevel" });
          }, 300);
        });
        break;
    }
  };

  useEffect(() => {
    const firstStep = preselectedPerson ? 1 : 0;
    setCurrentStep(firstStep);

    if (preselectedPerson) {
      const name = getPersonName(preselectedPerson);
      simulateTyping(() => {
        addMessage({
          role: "oreli",
          text: `Tu veux offrir un cadeau à ${name} ? Quelle belle idée ! Quel budget as-tu en tête ?`,
        });
        setTimeout(() => {
          addMessage({ role: "choices", choices: budgetChoices, field: "budget" });
          setCurrentField("budget");
        }, 300);
      });
    } else {
      askQuestion(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }, 100);
    }
  }, [messages, isTyping]);

  const processChoice = (field: string, choiceId: string, choiceLabel: string) => {
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

    while (nextStep < steps.length && steps[nextStep].skip) {
      nextStep++;
    }

    if (field === "surpriseLevel") {
      handleSurpriseOutcome(choiceId, newData);
    } else {
      setCurrentStep(nextStep);
      setTimeout(() => {
        askQuestion(nextStep, { personName: getPersonName(newData.personId || "") });
      }, 400);
    }
  };

  const handleChoice = (field: string, choiceId: string, choiceLabel: string) => {
    processChoice(field, choiceId, choiceLabel);
  };

  const handleTextSubmit = () => {
    const text = inputValue.trim();
    if (!text || !currentField) return;
    setInputValue("");
    processChoice(currentField, text, text);
  };

  const handleSurpriseOutcome = (level: string, finalData: Partial<GiftFlowData>) => {
    const personName = getPersonName(finalData.personId || "");
    const maxBudget = finalData.budget?.[1] || 80;
    const filteredProducts = products.filter((p) => p.price <= maxBudget + 20);
    const budgetLabel = `~${finalData.budget?.[1] ? finalData.budget[1] - 20 : 50}€`;
    const deliveryLabel = finalData.deliveryDate === "today" ? "Aujourd'hui" : finalData.deliveryDate === "tomorrow" ? "Demain" : "Cette semaine";

    if (level === "total") {
      simulateTyping(() => {
        addMessage({
          role: "oreli",
          text: `C'est parti ! Je m'occupe de tout pour ${personName}. Une magnifique surprise sera livrée. Prêt(e) à valider ?`,
        });
        setTimeout(() => {
          addMessage({
            role: "summary",
            summaryData: { budget: budgetLabel, delivery: deliveryLabel, person: personName },
            field: "confirm_total",
          });
        }, 400);
      }, 1200);
    } else if (level === "guided") {
      simulateTyping(() => {
        addMessage({
          role: "oreli",
          text: `Voici mes 3 meilleures recommandations, spécialement sélectionnées :`,
        });
        setTimeout(() => {
          addMessage({ role: "products", products: filteredProducts.slice(0, 3) });
        }, 400);
      }, 1500);
    } else {
      simulateTyping(() => {
        addMessage({
          role: "oreli",
          text: `Voici une sélection de cadeaux pour ${personName}, filtrés selon tes préférences :`,
        });
        setTimeout(() => {
          addMessage({ role: "products", products: filteredProducts });
        }, 400);
      }, 1500);
    }
  };

  const handleConfirmTotal = () => {
    addMessage({ role: "user", text: "Aller au paiement" });
    onComplete({
      personId: data.personId || "",
      budget: data.budget || [30, 80],
      occasion: data.occasion || "",
      deliveryDate: data.deliveryDate || "",
      surpriseLevel: "total",
    });
  };

  const totalSteps = steps.filter((s) => !s.skip).length;
  const completedSteps = Math.min(currentStep, totalSteps);
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className="app-container h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0 border-b border-border/40">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full gradient-magic flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-base text-foreground">Oreli</span>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
          <X className="w-5 h-5 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Progress */}
      <div className="px-4 py-2 flex-shrink-0">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-2 pb-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-3"
            >
              {/* Oreli message */}
              {msg.role === "oreli" && (
                <div className="flex gap-2.5 items-start max-w-[85%]">
                  <div className="w-7 h-7 rounded-full gradient-magic flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-card rounded-2xl rounded-tl-md px-4 py-3 shadow-card">
                    <p className="text-sm text-foreground leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              )}

              {/* User message */}
              {msg.role === "user" && (
                <div className="flex justify-end">
                  <div className="gradient-primary rounded-2xl rounded-tr-md px-4 py-3 max-w-[75%]">
                    <p className="text-sm text-primary-foreground font-medium">{msg.text}</p>
                  </div>
                </div>
              )}

              {/* Choice bubbles */}
              {msg.role === "choices" && msg.choices && (
                <div className="pl-9 flex flex-wrap gap-2 mt-1">
                  {msg.choices.map((choice) => (
                    <motion.button
                      key={choice.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (msg.field === "confirm_total") {
                          handleConfirmTotal();
                        } else {
                          handleChoice(msg.field || "", choice.id, choice.label);
                        }
                      }}
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-card border border-border hover:border-primary/40 shadow-sm transition-all text-left"
                    >
                      {choice.icon && <span className="flex-shrink-0">{choice.icon}</span>}
                      <div>
                        <p className="text-sm font-medium text-foreground">{choice.label}</p>
                        {choice.sub && (
                          <p className="text-[11px] text-muted-foreground leading-tight">{choice.sub}</p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Surprise Totale summary card */}
              {msg.role === "summary" && msg.summaryData && (
                <div className="pl-9 mt-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border-2 border-primary/20 bg-card p-5 shadow-card"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-[hsl(var(--lavender))]/15 flex items-center justify-center mb-3">
                        <Gift className="w-6 h-6 text-[hsl(var(--lavender))]" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-foreground">Surprise Totale</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Budget: {msg.summaryData.budget} · Livraison: {msg.summaryData.delivery}
                      </p>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleConfirmTotal}
                        className="w-full mt-4 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm"
                      >
                        Aller au paiement
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Product cards — horizontal scroll */}
              {msg.role === "products" && msg.products && (
                <div className="pl-9 mt-2 -mr-4">
                  <div className="flex gap-3 overflow-x-auto pb-2 pr-4 snap-x snap-mandatory scrollbar-hide">
                    {msg.products.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.12 }}
                        className="flex-shrink-0 w-[220px] snap-start rounded-2xl overflow-hidden shadow-card cursor-pointer group"
                        onClick={() => onSelectProduct(product.id)}
                      >
                        {/* Full background image */}
                        <div className="relative h-[260px]">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Match badge */}
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span className="text-xs font-semibold text-foreground">{product.matchScore}% match</span>
                          </div>
                          {/* Bottom gradient overlay */}
                          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                          {/* Content over image */}
                          <div className="absolute inset-x-0 bottom-0 p-3.5">
                            <h3 className="font-display font-bold text-sm text-white leading-tight line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-[11px] text-white/70 mt-1 line-clamp-2 leading-snug">
                              {product.aiJustification}
                            </p>
                            <div className="flex items-center justify-between mt-2.5">
                              <span className="font-bold text-white text-base">{product.price}€</span>
                              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                                Voir <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
            className="flex gap-2.5 items-center mb-3"
          >
            <div className="w-7 h-7 rounded-full gradient-magic flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="bg-card rounded-2xl rounded-tl-md px-4 py-3 shadow-card flex gap-1.5">
              <motion.span
                className="w-2 h-2 rounded-full bg-muted-foreground/40"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.span
                className="w-2 h-2 rounded-full bg-muted-foreground/40"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
              />
              <motion.span
                className="w-2 h-2 rounded-full bg-muted-foreground/40"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Text input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-border/40 bg-background">
        <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm border border-border/60">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder="Écris un message..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleTextSubmit}
            className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default GiftFlow;
