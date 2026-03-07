'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProduct, formatPrice } from '@/hooks/use-catalog';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(id);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-muted text-sm mb-4">Produit introuvable.</p>
        <Link href="/catalog" className="text-gold text-sm hover:underline">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const displayedImageUrl = selectedImageUrl ?? product.coverImageUrl;
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        href="/catalog"
        className="text-muted text-sm hover:text-cream transition-colors mb-8 inline-block"
      >
        ← Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square bg-stone rounded-2xl overflow-hidden mb-3">
            {displayedImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayedImageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🎁</div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageUrl(image.url)}
                  className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                    (selectedImageUrl ?? product.coverImageUrl) === image.url
                      ? 'border-gold'
                      : 'border-warm hover:border-muted'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div>
          {product.category && (
            <p className="text-muted text-xs uppercase tracking-wide mb-2">
              {product.category.name}
            </p>
          )}
          <h1 className="text-2xl font-bold text-cream mb-1">{product.title}</h1>
          <p className="text-muted text-sm mb-4">{product.seller.displayName}</p>

          <p className="text-gold text-3xl font-bold mb-6">
            {formatPrice(product.priceAmount, product.currency)}
          </p>

          <p className="text-muted text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap mb-4">
            {product.isLastMinuteOk && (
              <span className="bg-stone border border-warm text-muted text-xs px-3 py-1 rounded-full">
                Last-minute disponible
              </span>
            )}
            {product.isSurpriseReady && (
              <span className="bg-stone border border-warm text-muted text-xs px-3 py-1 rounded-full">
                Mode surprise
              </span>
            )}
            {product.preparationTimeMin !== null && (
              <span className="bg-stone border border-warm text-muted text-xs px-3 py-1 rounded-full">
                Préparation : {product.preparationTimeMin} min
              </span>
            )}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {product.tags.map((tag) => (
                <span key={tag.slug} className="text-muted text-xs">
                  #{tag.label}
                </span>
              ))}
            </div>
          )}

          {/* Stock + CTA */}
          {isOutOfStock ? (
            <div className="bg-danger/10 border border-danger/20 rounded-xl px-5 py-4 text-danger text-sm text-center">
              Rupture de stock
            </div>
          ) : (
            <button
              onClick={() => router.push(`/checkout?productId=${product.id}`)}
              className="w-full bg-gold text-obsidian font-semibold py-3.5 rounded-2xl text-base hover:bg-gold/90 transition-colors"
            >
              Commander
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
