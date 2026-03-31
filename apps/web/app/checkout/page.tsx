'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useProduct, formatPrice } from '@/hooks/use-catalog';
import { useCreateOrder } from '@/hooks/use-orders';
import { useAuth } from '@/lib/auth-context';

const checkoutSchema = z.object({
  recipientName: z.string().min(2, 'Nom requis'),
  addressLine: z.string().min(5, 'Adresse requise'),
  city: z.string().min(2, 'Ville requise'),
  postalCode: z.string().min(4, 'Code postal requis'),
  requestedDeliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide'),
  giftMessage: z.string().max(500).optional(),
  surpriseMode: z.enum(['total', 'controlled', 'manual']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function tomorrowDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}

function CheckoutForm({ productId }: { productId: string }) {
  const router = useRouter();
  const { session } = useAuth();
  const { data: product, isLoading } = useProduct(productId);
  const createOrder = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      requestedDeliveryDate: tomorrowDate(),
      surpriseMode: 'manual',
    },
  });

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-muted text-sm mb-4">Connectez-vous pour commander.</p>
        <Link href="/auth" className="text-gold text-sm hover:underline">
          Se connecter
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-muted text-sm">Produit introuvable.</p>
      </div>
    );
  }

  function onSubmit(data: CheckoutFormData): void {
    createOrder.mutate(
      {
        items: [{ productId: product!.id, quantity: 1 }],
        deliveryAddress: {
          name: data.recipientName,
          line: data.addressLine,
          city: data.city,
          postalCode: data.postalCode,
          country: 'BE',
        },
        requestedDeliveryDate: data.requestedDeliveryDate,
        giftMessage: data.giftMessage?.trim() || undefined,
        surpriseMode: data.surpriseMode,
      },
      {
        onSuccess: (result) => {
          router.push(`/orders/${result.orderId}`);
        },
      },
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href={`/product/${productId}`}
        className="text-muted text-sm hover:text-cream transition-colors mb-8 inline-block"
      >
        ← Retour au produit
      </Link>

      <h1 className="text-2xl font-bold text-cream mb-8">Commander</h1>

      {/* Résumé produit */}
      <div className="bg-charcoal border border-warm rounded-2xl p-5 mb-8 flex gap-4">
        <div className="w-16 h-16 bg-stone rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
          {product.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.coverImageUrl} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">🎁</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-cream text-sm font-medium truncate">{product.title}</p>
          <p className="text-muted text-xs mt-0.5">{product.seller.displayName}</p>
          <p className="text-gold font-semibold text-sm mt-1">
            {formatPrice(product.priceAmount, product.currency)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Adresse de livraison */}
        <div>
          <h2 className="text-cream font-semibold mb-4">Adresse de livraison</h2>
          <div className="space-y-3">
            <div>
              <input
                {...register('recipientName')}
                placeholder="Nom du destinataire"
                className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold/50"
              />
              {errors.recipientName && (
                <p className="text-danger text-xs mt-1">{errors.recipientName.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('addressLine')}
                placeholder="Rue et numéro"
                className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold/50"
              />
              {errors.addressLine && (
                <p className="text-danger text-xs mt-1">{errors.addressLine.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  {...register('postalCode')}
                  placeholder="Code postal"
                  className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold/50"
                />
                {errors.postalCode && (
                  <p className="text-danger text-xs mt-1">{errors.postalCode.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register('city')}
                  placeholder="Ville"
                  className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold/50"
                />
                {errors.city && (
                  <p className="text-danger text-xs mt-1">{errors.city.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Date de livraison */}
        <div>
          <label className="block text-cream font-semibold mb-2">Date de livraison souhaitée</label>
          <input
            {...register('requestedDeliveryDate')}
            type="date"
            className="bg-stone border border-warm rounded-xl px-4 py-3 text-cream text-sm focus:outline-none focus:border-gold/50"
          />
          {errors.requestedDeliveryDate && (
            <p className="text-danger text-xs mt-1">{errors.requestedDeliveryDate.message}</p>
          )}
        </div>

        {/* Mode surprise */}
        <div>
          <label className="block text-cream font-semibold mb-2">Mode de sélection</label>
          <select
            {...register('surpriseMode')}
            className="bg-stone border border-warm rounded-xl px-4 py-3 text-cream text-sm focus:outline-none focus:border-gold/50"
          >
            <option value="manual">Ce produit exactement</option>
            <option value="controlled">Laisser le vendeur adapter légèrement</option>
            <option value="total">Surprise totale (le vendeur choisit)</option>
          </select>
        </div>

        {/* Message cadeau */}
        <div>
          <label className="block text-cream font-semibold mb-2">Message cadeau (optionnel)</label>
          <textarea
            {...register('giftMessage')}
            placeholder="Bon anniversaire ! Avec toute mon affection…"
            rows={3}
            className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold/50 resize-none"
          />
        </div>

        {createOrder.isError && (
          <div className="bg-danger/10 border border-danger/20 rounded-xl px-5 py-4 text-danger text-sm">
            Une erreur est survenue. Veuillez réessayer.
          </div>
        )}

        <button
          type="submit"
          disabled={createOrder.isPending}
          className="w-full bg-gold text-obsidian font-semibold py-3.5 rounded-2xl text-base hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          {createOrder.isPending ? 'Création de la commande…' : 'Confirmer la commande'}
        </button>
      </form>
    </div>
  );
}

function CheckoutPageInner() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  if (!productId) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-muted text-sm mb-4">Aucun produit sélectionné.</p>
        <Link href="/catalog" className="text-gold text-sm hover:underline">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return <CheckoutForm productId={productId} />;
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutPageInner />
    </Suspense>
  );
}
