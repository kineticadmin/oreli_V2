import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera } from "lucide-react";

interface AddCloseOneProps {
  onBack: () => void;
  onSave: () => void;
}

const relationships = [
  "Maman", "Papa", "Partenaire", "Ami(e)", "Frère/Sœur", "Collègue", "Enfant", "Autre",
];

const AddCloseOne: React.FC<AddCloseOneProps> = ({ onBack, onSave }) => {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [showRelDropdown, setShowRelDropdown] = useState(false);

  return (
    <div className="app-container h-screen overflow-y-auto bg-background pb-6">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </motion.button>
        <h1 className="font-display text-xl font-bold">Ajouter un proche</h1>
      </div>

      <div className="px-4 pt-4 flex flex-col items-center">
        <h2 className="font-display text-[24px] font-bold text-center mb-6">
          Parle-moi de cette personne
        </h2>

        {/* Avatar upload */}
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-primary flex items-center justify-center mb-6 relative cursor-pointer">
          <Camera className="w-6 h-6 text-primary" />
        </div>

        {/* Form */}
        <div className="w-full space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Prénom</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-cream border-2 border-transparent focus:border-primary focus:outline-none text-sm"
              placeholder="Prénom"
            />
          </div>

          <div className="relative">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Relation</label>
            <button
              onClick={() => setShowRelDropdown(!showRelDropdown)}
              className="w-full p-3 rounded-lg bg-cream text-left text-sm border-2 border-transparent focus:border-primary"
            >
              {relationship || "Choisir..."}
            </button>
            {showRelDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg shadow-card-hover z-10 overflow-hidden">
                {relationships.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRelationship(r);
                      setShowRelDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-sm text-left hover:bg-muted transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              Date d'anniversaire
            </label>
            <input
              type="date"
              className="w-full p-3 rounded-lg bg-cream border-2 border-transparent focus:border-primary focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              Ses goûts en quelques mots
            </label>
            <textarea
              className="w-full p-3 rounded-lg bg-cream border-2 border-transparent focus:border-primary focus:outline-none text-sm resize-none"
              rows={3}
              placeholder="Elle adore le chocolat, les bougies parfumées, la couleur vert..."
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          disabled={!name}
          className={`w-full mt-8 py-4 rounded-xl font-semibold text-base ${
            name ? "gradient-primary text-white" : "bg-muted text-muted-foreground"
          }`}
        >
          Enregistrer
        </motion.button>
      </div>
    </div>
  );
};

export default AddCloseOne;
