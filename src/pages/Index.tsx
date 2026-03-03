import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Onboarding from "./Onboarding";
import Home from "./Home";
import GiftFlow from "./GiftFlow";
import AIRecommendations from "./AIRecommendations";
import ProductDetail from "./ProductDetail";
import Checkout from "./Checkout";
import OrderConfirmation from "./OrderConfirmation";
import AddCloseOne from "./AddCloseOne";
import BottomNav from "@/components/BottomNav";
import { closeOnes } from "@/data/mockData";

type Screen =
  | "onboarding"
  | "home"
  | "giftflow"
  | "recommendations"
  | "product"
  | "checkout"
  | "confirmation"
  | "addclose";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [navTab, setNavTab] = useState("home");

  const personName =
    closeOnes.find((p) => p.id === selectedPerson)?.name || "Sophie";

  const showNav =
    screen === "home" && !["onboarding", "giftflow", "recommendations", "product", "checkout", "confirmation", "addclose"].includes(screen);

  return (
    <div className="app-container min-h-screen bg-background relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-screen"
        >
          {screen === "onboarding" && (
            <Onboarding onComplete={() => setScreen("home")} />
          )}

          {screen === "home" && (
            <>
              <Home
                onStartGiftFlow={(personId) => {
                  if (personId) setSelectedPerson(personId);
                  setScreen("giftflow");
                }}
                onProductTap={(productId) => {
                  setSelectedProduct(productId);
                  setScreen("product");
                }}
                onAddCloseOne={() => setScreen("addclose")}
              />
              <BottomNav active={navTab} onNavigate={setNavTab} />
            </>
          )}

          {screen === "giftflow" && (
            <GiftFlow
              preselectedPerson={selectedPerson}
              onComplete={(data) => {
                setSelectedPerson(data.personId);
                setScreen("checkout");
              }}
              onSelectProduct={(id) => {
                setSelectedProduct(id);
                setScreen("product");
              }}
              onClose={() => setScreen("home")}
            />
          )}

          {screen === "recommendations" && (
            <AIRecommendations
              personName={personName}
              onSelectProduct={(id) => {
                setSelectedProduct(id);
                setScreen("product");
              }}
              onBack={() => setScreen("giftflow")}
            />
          )}

          {screen === "product" && (
            <ProductDetail
              productId={selectedProduct}
              onBack={() => setScreen("recommendations")}
              onBuy={(id) => {
                setSelectedProduct(id);
                setScreen("checkout");
              }}
            />
          )}

          {screen === "checkout" && (
            <Checkout
              productId={selectedProduct}
              onBack={() => setScreen("product")}
              onConfirm={() => setScreen("confirmation")}
            />
          )}

          {screen === "confirmation" && (
            <OrderConfirmation onHome={() => setScreen("home")} />
          )}

          {screen === "addclose" && (
            <AddCloseOne
              onBack={() => setScreen("home")}
              onSave={() => setScreen("home")}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Index;
