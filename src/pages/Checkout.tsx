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
      <div className="flex items-center gap-3 px-6 pt-6 pb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <h1 className="text-xl font-bold">Finaliser</h1>
      </div>

      <div className="px-6 pt-2">
        {/* Product summary */}
        <div className="flex gap-4 p-4 bg-card rounded-2xl shadow-card">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold text-sm">{product.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{product.seller}</p>
            <p className="font-bold text-base mt-2">{product.price}€</p>
          </div>
        </div>

        {/* Delivery */}
        <h3 className="font-bold text-sm mt-8 mb-3">Adresse de livraison</h3>
        <div className="p-4 bg-card rounded-2xl shadow-card">
          <p className="text-sm font-semibold">Sophie Dupont</p>
          <p className="text-sm text-muted-foreground mt-1">Rue de la Loi 42, 1000 Bruxelles</p>
          <button className="text-foreground text-xs font-semibold mt-3 underline underline-offset-2">Modifier</button>
        </div>

        {/* Payment */}
        <h3 className="font-bold text-sm mt-8 mb-3">Paiement</h3>
        <div className="p-4 bg-card rounded-2xl shadow-card">
          <div className="flex gap-2.5 mb-4">
            <button className="flex-1 py-3 rounded-xl bg-foreground text-primary-foreground text-sm font-semibold">
               Pay
            </button>
            <button className="flex-1 py-3 rounded-xl bg-foreground text-primary-foreground text-sm font-semibold">
              G Pay
            </button>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-3">Ou payer par carte</p>
            <input
              className="w-full p-3.5 rounded-xl bg-muted border-0 text-sm mb-2.5 focus:outline-none focus:ring-2 focus:ring-foreground"
              placeholder="Numéro de carte"
            />
            <div className="flex gap-2.5">
              <input
                className="flex-1 p-3.5 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                placeholder="MM/AA"
              />
              <input
                className="flex-1 p-3.5 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                placeholder="CVC"
              />
            </div>
          </div>
        </div>

        {/* Gift message */}
        <h3 className="font-bold text-sm mt-8 mb-3">Message cadeau</h3>
        <div className="p-4 bg-muted rounded-2xl">
          <p className="italic text-sm text-foreground">
            "Joyeux anniversaire Maman ! Avec tout mon amour 💝"
          </p>
        </div>

        {/* Summary */}
        <div className="mt-8 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span className="font-medium">{product.price}€</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Livraison</span>
            <span className="font-semibold text-mint-fresh">Gratuite</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Emballage premium</span>
            <span className="font-medium">5€</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-bold text-base">Total</span>
            <span className="font-bold text-lg">{product.price + 5}€</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-5 bg-background/80 backdrop-blur-xl border-t border-border">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirm}
          disabled={loading}
          className="w-full py-4 rounded-full bg-foreground text-primary-foreground font-semibold text-base relative overflow-hidden"
        >
          {loading ? (
            <div className="h-5 animate-shimmer rounded" />
          ) : (
            `Confirmer — ${product.price + 5}€`
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default Checkout;
