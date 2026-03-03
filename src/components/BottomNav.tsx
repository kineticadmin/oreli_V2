import React from "react";
import { motion } from "framer-motion";
import { Home, Gift, Package, Heart, User } from "lucide-react";

interface BottomNavProps {
  active: string;
  onNavigate: (tab: string) => void;
}

const tabs = [
  { id: "home", icon: Home, label: "Accueil" },
  { id: "gifts", icon: Gift, label: "Cadeaux" },
  { id: "orders", icon: Package, label: "Commandes" },
  { id: "close", icon: Heart, label: "Proches" },
  { id: "profile", icon: User, label: "Profil" },
];

const BottomNav: React.FC<BottomNavProps> = ({ active, onNavigate }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-[400px] mx-auto bg-card/70 backdrop-blur-xl border border-border/40 rounded-2xl shadow-modal z-50">
      <div className="flex items-center justify-around py-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                fill={isActive ? "currentColor" : "none"}
              />
              <span
                className={`text-[10px] transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="navDot"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
