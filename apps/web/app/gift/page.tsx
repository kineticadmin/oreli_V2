'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useGiftChat, type GiftChatContext } from '@/hooks/use-gift-chat';
import { formatPrice } from '@/hooks/use-catalog';

function GiftChatInner() {
  const searchParams = useSearchParams();

  const context: GiftChatContext = {
    ...(searchParams.get('relationshipId') ? { relationshipId: searchParams.get('relationshipId')! } : {}),
    ...(searchParams.get('productId') ? { productId: searchParams.get('productId')! } : {}),
    ...(searchParams.get('occasion') ? { occasion: searchParams.get('occasion')! } : {}),
  };

  const { messages, suggestions, products, isLoading, isReady, initChat, sendMessage } =
    useGiftChat(context);

  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { initChat(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    sendMessage(trimmed);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-obsidian font-bold text-sm">
          ✦
        </div>
        <h1 className="text-lg font-semibold text-cream">Oreli</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col gap-3 mb-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2 items-end ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'oreli' && (
              <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-obsidian text-xs flex-shrink-0">
                ✦
              </div>
            )}
            <div
              className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                message.role === 'oreli'
                  ? 'bg-charcoal border border-warm text-cream rounded-bl-sm'
                  : 'bg-gold text-obsidian font-medium rounded-br-sm'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 items-end">
            <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-obsidian text-xs">
              ✦
            </div>
            <div className="bg-charcoal border border-warm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map((dotIndex) => (
                <div
                  key={dotIndex}
                  className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                  style={{ animationDelay: `${dotIndex * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {suggestions.length > 0 && !isLoading && (
          <div className="flex flex-wrap gap-2 pl-9">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="bg-stone border border-warm rounded-full px-4 py-2 text-sm text-cream hover:border-gold transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {isReady && products && (
          <div className="flex flex-col gap-3 mt-2">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-charcoal border border-warm rounded-2xl p-4 flex gap-4 hover:border-gold transition-colors group"
              >
                <div className="w-16 h-16 rounded-xl bg-stone flex items-center justify-center flex-shrink-0 relative">
                  <span className="text-2xl">🎁</span>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold rounded-full px-1.5 py-0.5 text-[9px] font-bold text-obsidian whitespace-nowrap">
                    ✦ {Math.round(product.score * 100)}%
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-cream font-medium text-sm truncate group-hover:text-gold transition-colors">
                    {product.title}
                  </p>
                  {product.justification && (
                    <p className="text-muted text-xs italic mt-0.5">
                      &ldquo;{product.justification}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gold font-bold text-sm">
                      {formatPrice(product.priceAmount, product.currency)}
                    </span>
                    <span className="text-muted text-xs">{product.seller.displayName}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-obsidian border-t border-warm pt-4 pb-2">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(input);
            }}
            placeholder="Réponds à Oreli…"
            disabled={isLoading}
            className="flex-1 bg-charcoal border border-warm rounded-full px-4 py-2.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-gold flex items-center justify-center disabled:opacity-40 hover:bg-gold/90 transition-colors"
          >
            <span className="text-obsidian text-sm font-bold">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GiftPage() {
  return (
    <Suspense>
      <GiftChatInner />
    </Suspense>
  );
}
