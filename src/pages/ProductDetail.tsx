import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { products, type Product } from "@/data/mockData";

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  onBuy: (productId: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onBuy }) => {
  const product = products.find((p) => p.id === productId) as Product;
  const [imgIdx, setImgIdx] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [giftMessage, setGiftMessage] = useState(false);
  const [premiumWrap, setPremiumWrap] = useState(false);
  const [delivery, setDelivery] = useState("express");

  const totalPrice = product.price + (premiumWrap ? 5 : 0);

  return (
    <div className="app-container h-screen overflow-y-auto bg-background pb-28">
      {/* Image gallery */}
      <div className="relative">
        <img
          src={product.images[imgIdx]}
          alt={product.name}
          className="w-full h-72 object-cover"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        {/* Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {product.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setImgIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === imgIdx ? "w-5 bg-primary" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        <h1 className="font-display text-[24px] font-bold">{product.name}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-2xl font-semibold">{product.price}€</span>
          <span className="px-2 py-1 rounded-full bg-mint-fresh/20 text-mint-fresh text-xs font-semibold">
            🚚 Livraison incluse
          </span>
        </div>

        {/* AI match badge */}
        <div className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/20 text-foreground text-sm">
          ✨ {product.matchScore}% match pour Sophie
        </div>

        {/* Description */}
        <p className={`mt-4 text-sm text-muted-foreground ${!showFullDesc ? "line-clamp-3" : ""}`}>
          {product.description}
        </p>
        <button
          onClick={() => setShowFullDesc(!showFullDesc)}
          className="text-primary text-sm font-semibold mt-1"
        >
          {showFullDesc ? "Moins" : "Lire plus"}
        </button>

        {/* Seller card */}
        <div className="mt-4 p-4 bg-card rounded-lg shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-celebration flex items-center justify-center text-white font-semibold text-sm">
            {product.seller[0]}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{product.seller}</p>
            <p className="text-xs text-muted-foreground">
              ⭐ {product.rating} · Artisan vérifié ✓ · Bruxelles
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-golden-honey/20 text-golden-honey text-xs font-semibold">
            Vérifié
          </span>
        </div>

        {/* Delivery options */}
        <h3 className="font-semibold text-sm mt-6 mb-2">Livraison</h3>
        <div className="flex flex-col gap-2">
          <motion.div
            whileTap={{ scale: 0.97 }}
            onClick={() => setDelivery("express")}
            className={`p-3 rounded-lg flex items-center justify-between cursor-pointer ${
              delivery === "express"
                ? "border-2 border-primary bg-muted"
                : "bg-card shadow-card border-2 border-transparent"
            }`}
          >
            <span className="text-sm font-semibold">Express — Demain avant 18h</span>
            <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full font-semibold">
              Express
            </span>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.97 }}
            onClick={() => setDelivery("standard")}
            className={`p-3 rounded-lg flex items-center justify-between cursor-pointer ${
              delivery === "standard"
                ? "border-2 border-primary bg-muted"
                : "bg-card shadow-card border-2 border-transparent"
            }`}
          >
            <span className="text-sm font-semibold">Standard — 2-3 jours</span>
          </motion.div>
        </div>

        {/* Gift options */}
        <h3 className="font-semibold text-sm mt-6 mb-2">Options cadeau</h3>
        <div
          onClick={() => setGiftMessage(!giftMessage)}
          className={`p-3 rounded-lg bg-card shadow-card flex items-center justify-between cursor-pointer mb-2 ${
            giftMessage ? "border-2 border-primary" : "border-2 border-transparent"
          }`}
        >
          <span className="text-sm">Ajouter un message personnel</span>
          <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${giftMessage ? "bg-primary" : "bg-muted"}`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${giftMessage ? "translate-x-4" : ""}`} />
          </div>
        </div>
        {giftMessage && (
          <motion.textarea
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="w-full p-3 border-2 border-primary/30 rounded-lg bg-card text-sm resize-none focus:outline-none focus:border-primary"
            rows={3}
            placeholder="Ton message pour Sophie..."
          />
        )}

        <div
          onClick={() => setPremiumWrap(!premiumWrap)}
          className={`p-3 rounded-lg bg-card shadow-card flex items-center justify-between cursor-pointer mt-2 ${
            premiumWrap ? "border-2 border-golden-honey" : "border-2 border-transparent"
          }`}
        >
          <span className="text-sm">
            Emballage cadeau premium{" "}
            <span className="text-golden-honey font-semibold">(+5€)</span>
          </span>
          <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${premiumWrap ? "bg-golden-honey" : "bg-muted"}`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${premiumWrap ? "translate-x-4" : ""}`} />
          </div>
        </div>
      </div>

      {/* Sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-4 bg-card border-t border-border shadow-modal">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onBuy(product.id)}
          className="w-full py-4 rounded-xl gradient-primary text-white font-semibold text-base"
        >
          Offrir — {totalPrice}€
        </motion.button>
      </div>
    </div>
  );
};

export default ProductDetail;
