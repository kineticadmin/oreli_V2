import { create } from 'zustand';
import { Product, CloseOne } from '@/data/mockData';

export interface GiftFlowData {
    personId: string;
    budget: [number, number];
    occasion: string;
    deliveryDate: string;
    surpriseLevel: string;
    giftMessage: string;
    premiumWrap: boolean;
}

export interface UserAddress {
    name: string;
    line: string;
}

interface GiftStore {
    // Theme
    theme: 'dark' | 'light' | 'system';

    // User profile
    userName: string;
    userAddress: UserAddress;

    // Selected entities
    selectedPerson: CloseOne | null;
    selectedProduct: Product | null;

    // Flow data
    giftFlow: Partial<GiftFlowData>;

    // Actions
    setTheme: (theme: 'dark' | 'light' | 'system') => void;
    setUserName: (name: string) => void;
    setUserAddress: (address: UserAddress) => void;
    setSelectedPerson: (p: CloseOne | null) => void;
    setSelectedProduct: (p: Product | null) => void;
    updateGiftFlow: (data: Partial<GiftFlowData>) => void;
    resetGiftFlow: () => void;
}

export const useGiftStore = create<GiftStore>((set) => ({
    theme: 'light',
    userName: 'Brunell',
    userAddress: { name: 'Sophie Dupont', line: 'Rue de la Loi 42, 1000 Bruxelles' },
    selectedPerson: null,
    selectedProduct: null,
    giftFlow: {
        giftMessage: 'Joyeux anniversaire ! Avec tout mon amour 💝',
        premiumWrap: false,
    },

    setTheme: (theme) => set({ theme }),
    setUserName: (name) => set({ userName: name }),
    setUserAddress: (address) => set({ userAddress: address }),
    setSelectedPerson: (p) => set({ selectedPerson: p }),
    setSelectedProduct: (p) => set({ selectedProduct: p }),
    updateGiftFlow: (data) =>
        set((state) => ({ giftFlow: { ...state.giftFlow, ...data } })),
    resetGiftFlow: () =>
        set({
            selectedPerson: null,
            selectedProduct: null,
            giftFlow: {
                giftMessage: 'Joyeux anniversaire ! Avec tout mon amour 💝',
                premiumWrap: false,
            },
        }),
}));
