import { useState, useCallback } from 'react';
import { apiRequest } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────

export interface GiftChatMessage {
    role: 'user' | 'oreli';
    text: string;
}

export interface GiftChatContext {
    relationshipId?: string;
    productId?: string;
    occasion?: string;
    suggestedDeliveryDate?: string;
}

export interface RecommendedProduct {
    id: string;
    title: string;
    description: string;
    priceAmount: number;
    currency: string;
    coverImageUrl: string | null;
    isSurpriseReady: boolean;
    isLastMinuteOk: boolean;
    category: { id: string; name: string; slug: string } | null;
    tags: { slug: string; label: string }[];
    seller: { id: string; displayName: string };
    score: number;
    justification?: string;
}

interface GiftChatResponse {
    message: string;
    suggestions: string[];
    intent: {
        relationshipId?: string;
        budgetMin?: number;
        budgetMax?: number;
        occasion?: string;
        deliveryDate?: string;
        surpriseMode?: 'total' | 'controlled' | 'manual';
    };
    ready: boolean;
    products?: RecommendedProduct[];
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useGiftChat(context: GiftChatContext = {}) {
    const [messages, setMessages] = useState<GiftChatMessage[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [products, setProducts] = useState<RecommendedProduct[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const sendMessage = useCallback(async (userText: string) => {
        const userMessage: GiftChatMessage = { role: 'user', text: userText };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setSuggestions([]);
        setIsLoading(true);

        try {
            const response = await apiRequest<GiftChatResponse>('/gift/chat', {
                method: 'POST',
                body: {
                    messages: updatedMessages,
                    context,
                },
            });

            const oreliMessage: GiftChatMessage = { role: 'oreli', text: response.message };
            setMessages([...updatedMessages, oreliMessage]);
            setSuggestions(response.suggestions);

            if (response.ready && response.products) {
                setIsReady(true);
                setProducts(response.products);
            }
        } catch {
            const errorMessage: GiftChatMessage = {
                role: 'oreli',
                text: "Désolée, je rencontre un problème. Réessaie dans un instant.",
            };
            setMessages([...updatedMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, context]);

    const initChat = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiRequest<GiftChatResponse>('/gift/chat', {
                method: 'POST',
                body: {
                    messages: [],
                    context,
                },
            });

            const oreliMessage: GiftChatMessage = { role: 'oreli', text: response.message };
            setMessages([oreliMessage]);
            setSuggestions(response.suggestions);
        } catch {
            const fallbackMessage: GiftChatMessage = {
                role: 'oreli',
                text: "Bonjour ! Pour qui souhaites-tu offrir un cadeau ?",
            };
            setMessages([fallbackMessage]);
            setSuggestions(["Ma partenaire", "Ma mère", "Un ami", "Quelqu'un d'autre"]);
        } finally {
            setIsLoading(false);
        }
    }, [context]);

    const reset = useCallback(() => {
        setMessages([]);
        setSuggestions([]);
        setProducts(null);
        setIsReady(false);
    }, []);

    return {
        messages,
        suggestions,
        products,
        isLoading,
        isReady,
        sendMessage,
        initChat,
        reset,
    };
}
