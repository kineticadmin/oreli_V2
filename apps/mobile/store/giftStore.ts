import { create } from 'zustand';

export interface PersonViewModel {
    id: string;
    name: string;
    relationship: string;
    avatar: string;
    avatarUrl: string | null;
    daysUntilEvent?: number;
    eventType: string | null;
    eventDate: string | null;
    apiId?: string;
    preferences?: Record<string, unknown>;
}

export interface GiftFlowData {
    personId: string;
    selectedProductId: string;
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

    // Selected person for gift flow
    selectedPerson: PersonViewModel | null;

    // Flow data
    giftFlow: Partial<GiftFlowData>;

    // Actions
    setTheme: (theme: 'dark' | 'light' | 'system') => void;
    setUserName: (name: string) => void;
    setUserAddress: (address: UserAddress) => void;
    setSelectedPerson: (p: PersonViewModel | null) => void;
    updateGiftFlow: (data: Partial<GiftFlowData>) => void;
    resetGiftFlow: () => void;
}

export const useGiftStore = create<GiftStore>((set) => ({
    theme: 'light',
    userName: 'Brunell',
    userAddress: { name: 'Sophie Dupont', line: 'Rue de la Loi 42, 1000 Bruxelles' },
    selectedPerson: null,
    giftFlow: {
        giftMessage: 'Joyeux anniversaire ! Avec tout mon amour 💝',
        premiumWrap: false,
    },

    setTheme: (theme) => set({ theme }),
    setUserName: (name) => set({ userName: name }),
    setUserAddress: (address) => set({ userAddress: address }),
    setSelectedPerson: (p) => set({ selectedPerson: p }),
    updateGiftFlow: (data) =>
        set((state) => ({ giftFlow: { ...state.giftFlow, ...data } })),
    resetGiftFlow: () =>
        set({
            selectedPerson: null,
            giftFlow: {
                giftMessage: 'Joyeux anniversaire ! Avec tout mon amour 💝',
                premiumWrap: false,
            },
        }),
}));
