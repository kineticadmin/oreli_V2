import Link from 'next/link';
import { type ProductSummary } from '@/lib/api';
import { formatPrice } from '@/hooks/use-catalog';

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-charcoal border border-warm rounded-2xl overflow-hidden hover:border-gold/40 transition-colors"
    >
      <div className="aspect-square bg-stone flex items-center justify-center overflow-hidden">
        {product.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.coverImageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-muted text-4xl">🎁</div>
        )}
      </div>

      <div className="p-4">
        <p className="text-cream text-sm font-medium line-clamp-2 mb-1">{product.title}</p>
        <p className="text-muted text-xs mb-3 line-clamp-1">{product.seller.displayName}</p>

        <div className="flex items-center justify-between">
          <span className="text-gold font-semibold text-sm">
            {formatPrice(product.priceAmount, product.currency)}
          </span>
          <div className="flex gap-1">
            {product.isLastMinuteOk && (
              <span className="bg-stone text-muted text-[10px] px-1.5 py-0.5 rounded">
                Last-minute
              </span>
            )}
            {product.isSurpriseReady && (
              <span className="bg-stone text-muted text-[10px] px-1.5 py-0.5 rounded">
                Surprise
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
