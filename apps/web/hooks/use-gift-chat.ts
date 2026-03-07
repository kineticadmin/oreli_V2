'use client';

import { useState, useCallback } from 'react';
import { apiRequest } from '@/lib/api';

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

export interface ChatProduct {
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

interface GiftChatApiResponse {
  message: string;
  suggestions: string[];
  intent: Record<string, string | number | boolean | null>;
  ready: boolean;
  products?: ChatProduct[];
}

export function useGiftChat(context: GiftChatContext = {}) {
  const [messages, setMessages] = useState<GiftChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [products, setProducts] = useState<ChatProduct[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const callApi = useCallback(async (currentMessages: GiftChatMessage[]) => {
    setIsLoading(true);
    try {
      const response = await apiRequest<GiftChatApiResponse>('/gift/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: currentMessages, context }),
      });

      const oreliMessage: GiftChatMessage = { role: 'oreli', text: response.message };
      setMessages([...currentMessages, oreliMessage]);
      setSuggestions(response.suggestions);

      if (response.ready && response.products) {
        setIsReady(true);
        setProducts(response.products);
      }
    } catch {
      setMessages([
        ...currentMessages,
        { role: 'oreli', text: 'Désolée, une erreur est survenue. Réessaie !' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [context]);

  const initChat = useCallback(() => callApi([]), [callApi]);

  const sendMessage = useCallback(
    (text: string) => {
      const userMessage: GiftChatMessage = { role: 'user', text };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setSuggestions([]);
      callApi(updatedMessages);
    },
    [messages, callApi],
  );

  return { messages, suggestions, products, isLoading, isReady, initChat, sendMessage };
}
