import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { products, type Product } from "@/data/mockData";

interface CheckoutProps {
  productId: string;
  onBack: () => void;
  onConfirm: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ productId, onBack, onConfirm }) => {
  const product = products.find((p) => p.id === productId) as Product;
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => onConfirm(), 1500);
  };

  return (
    <div className="app-container h-screen overflow-y-auto bg-background pb-28">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </motion.button>
        <h1 className="font-display text-xl font-bold">Finaliser</h1>
      </div>

      <div className="px-4 pt-2">
        {/* Product summary */}
        <div className="flex gap-3 p-3 bg-card rounded-lg shadow-card">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-20 h-20 rounded-md object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold text-sm">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.seller}</p>
            <p className="font-semibold text-base mt-1">{product.price}€</p>
          </div>
        </div>

        {/* Delivery */}
        <h3 className="font-semibold text-sm mt-6 mb-2">Adresse de livraison</h3>
        <div className="p-3 bg-card rounded-lg shadow-card">
          <p className="text-sm font-semibold">Sophie Dupont</p>
          <p className="text-sm text-muted-foreground">Rue de la Loi 42, 1000 Bruxelles</p>
          <button className="text-primary text-xs font-semibold mt-2">Modifier</button>
        </div>

        {/* Payment */}
        <h3 className="font-semibold text-sm mt-6 mb-2">Paiement</h3>
        <div className="p-3 bg-card rounded-lg shadow-card">
          <div className="flex gap-2 mb-3">
            <button className="flex-1 py-2.5 rounded-lg bg-foreground text-card text-sm font-semibold">
               Pay
            </button>
            <button className="flex-1 py-2.5 rounded-lg bg-foreground text-card text-sm font-semibold">
              G Pay
            </button>
          </div>
          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground mb-2">Ou payer par carte</p>
            <input
              className="w-full p-3 rounded-lg bg-background border border-border text-sm mb-2"
              placeholder="Numéro de carte"
            />
            <div className="flex gap-2">
              <input
                className="flex-1 p-3 rounded-lg bg-background border border-border text-sm"
                placeholder="MM/AA"
              />
              <input
                className="flex-1 p-3 rounded-lg bg-background border border-border text-sm"
                placeholder="CVC"
              />
            </div>
          </div>
        </div>

        {/* Gift message preview */}
        <h3 className="font-semibold text-sm mt-6 mb-2">Message cadeau</h3>
        <div className="p-4 bg-cream rounded-lg border border-border">
          <p className="font-display italic text-sm text-foreground">
            "Joyeux anniversaire Maman ! Avec tout mon amour 💝"
          </p>
        </div>

        {/* Summary */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span>{product.price}€</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Livraison</span>
            <span className="text-mint-fresh font-semibold">Gratuite</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Emballage premium</span>
            <span>5€</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-semibold text-base">Total</span>
            <span className="font-semibold text-lg">{product.price + 5}€</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-4 bg-card border-t border-border shadow-modal">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirm}
          disabled={loading}
          className="w-full py-4 rounded-xl gradient-primary text-white font-semibold text-base relative overflow-hidden"
        >
          {loading ? (
            <div className="h-6 animate-shimmer rounded" />
          ) : (
            `Confirmer la commande — ${product.price + 5}€`
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default Checkout;
