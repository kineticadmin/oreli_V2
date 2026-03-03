import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Star, Truck, ShieldCheck } from "lucide-react";
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
  const [premiumWrap, setPremiumWrap] = useState(false);
  const [delivery, setDelivery] = useState("express");

  const totalPrice = product.price + (premiumWrap ? 5 : 0);

  return (
    <div className="app-container h-screen overflow-y-auto bg-background pb-28">
      {/* Image gallery — large like reference */}
      <div className="relative bg-muted">
        <img
          src={product.images[imgIdx]}
          alt={product.name}
          className="w-full h-[380px] object-cover"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center"
        >
          <Heart className="w-5 h-5 text-foreground" />
        </motion.button>
        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {product.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setImgIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === imgIdx ? "w-6 bg-foreground" : "bg-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Product info — clean card style */}
      <div className="px-6 pt-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-[22px] font-bold text-foreground leading-tight flex-1">{product.name}</h1>
          <span className="text-[22px] font-bold text-foreground">{product.price}€</span>
        </div>

        <p className="text-sm text-muted-foreground mt-2">{product.seller}</p>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-foreground fill-foreground" />
            <span className="text-sm font-semibold">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">{product.matchScore}% match</span>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h3 className="font-bold text-sm mb-2">Description</h3>
          <p className={`text-sm text-muted-foreground leading-relaxed ${!showFullDesc ? "line-clamp-3" : ""}`}>
            {product.description}
          </p>
          <button
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="text-foreground text-sm font-semibold mt-1.5 underline underline-offset-2"
          >
            {showFullDesc ? "Moins" : "Lire plus"}
          </button>
        </div>

        {/* Features */}
        <div className="flex gap-4 mt-6">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted">
            <Truck className="w-4 h-4 text-foreground" />
            <span className="text-xs font-medium">Livraison gratuite</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted">
            <ShieldCheck className="w-4 h-4 text-foreground" />
            <span className="text-xs font-medium">Artisan vérifié</span>
          </div>
        </div>

        {/* Delivery options */}
        <h3 className="font-bold text-sm mt-8 mb-3">Livraison</h3>
        <div className="flex flex-col gap-2.5">
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setDelivery("express")}
            className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${
              delivery === "express"
                ? "border-2 border-foreground bg-muted"
                : "border-2 border-border bg-card"
            }`}
          >
            <span className="text-sm font-semibold">Express — Demain avant 18h</span>
            {delivery === "express" && (
              <span className="px-2.5 py-1 bg-foreground text-primary-foreground text-[10px] rounded-full font-bold">
                Express
              </span>
            )}
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setDelivery("standard")}
            className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${
              delivery === "standard"
                ? "border-2 border-foreground bg-muted"
                : "border-2 border-border bg-card"
            }`}
          >
            <span className="text-sm font-semibold">Standard — 2-3 jours</span>
          </motion.div>
        </div>

        {/* Premium wrap */}
        <div
          onClick={() => setPremiumWrap(!premiumWrap)}
          className={`mt-6 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${
            premiumWrap ? "border-2 border-foreground bg-muted" : "border-2 border-border bg-card"
          }`}
        >
          <span className="text-sm font-medium">
            Emballage cadeau premium <span className="text-muted-foreground">(+5€)</span>
          </span>
          <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${premiumWrap ? "bg-foreground" : "bg-border"}`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${premiumWrap ? "translate-x-4" : ""}`} />
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-5 bg-background/80 backdrop-blur-xl border-t border-border">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onBuy(product.id)}
          className="w-full py-4 rounded-full bg-foreground text-primary-foreground font-semibold text-base"
        >
          Offrir — {totalPrice}€
        </motion.button>
      </div>
    </div>
  );
};

export default ProductDetail;
