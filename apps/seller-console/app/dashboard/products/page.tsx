'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts, useArchiveProduct, formatProductStatus, formatPrice } from '@/hooks/use-products';

const STATUS_FILTERS = [
  { value: undefined, label: 'Tous' },
  { value: 'active', label: 'Actifs' },
  { value: 'draft', label: 'Brouillons' },
  { value: 'pending_review', label: 'En révision' },
  { value: 'paused', label: 'Pausés' },
] as const;

export default function ProductsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useProducts(statusFilter);
  const archiveProduct = useArchiveProduct();

  const products = data?.data ?? [];

  function handleArchive(productId: string, title: string) {
    if (!confirm(`Archiver "${title}" ? Cette action est irréversible.`)) return;
    archiveProduct.mutate(productId);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-cream">Produits</h1>
          <p className="text-muted text-sm mt-1">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="bg-gold text-obsidian font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-gold/90 transition-colors"
        >
          + Nouveau produit
        </Link>
      </div>

      {/* Filtres status */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              statusFilter === filter.value
                ? 'bg-gold text-obsidian font-medium'
                : 'bg-stone text-muted hover:text-cream'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-5 py-4 text-danger text-sm">
          Impossible de charger les produits.
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted text-sm">Aucun produit</p>
          <Link
            href="/dashboard/products/new"
            className="inline-block mt-4 text-gold text-sm hover:underline"
          >
            Créer votre premier produit
          </Link>
        </div>
      )}

      {products.length > 0 && (
        <div className="bg-charcoal border border-warm rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm">
                <th className="text-left px-5 py-3 text-xs text-muted uppercase tracking-wide">Produit</th>
                <th className="text-left px-5 py-3 text-xs text-muted uppercase tracking-wide">Prix</th>
                <th className="text-left px-5 py-3 text-xs text-muted uppercase tracking-wide">Statut</th>
                <th className="text-left px-5 py-3 text-xs text-muted uppercase tracking-wide">Stock</th>
                <th className="text-right px-5 py-3 text-xs text-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm">
              {products.map((product) => {
                const { label, color } = formatProductStatus(product.status);
                return (
                  <tr key={product.id} className="hover:bg-stone/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-cream text-sm font-medium truncate max-w-xs">{product.title}</p>
                      <p className="text-muted text-xs mt-0.5">
                        {product.isSurpriseReady && (
                          <span className="mr-2 bg-stone px-1.5 py-0.5 rounded text-[10px]">Surprise</span>
                        )}
                        {product.isLastMinuteOk && (
                          <span className="bg-stone px-1.5 py-0.5 rounded text-[10px]">Last-minute</span>
                        )}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-cream text-sm">{formatPrice(product.priceAmount, product.currency)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-sm ${color}`}>{label}</span>
                    </td>
                    <td className="px-5 py-4 text-cream text-sm">{product.stockQuantity}</td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="text-gold text-sm hover:underline mr-4"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleArchive(product.id, product.title)}
                        className="text-muted text-sm hover:text-danger transition-colors"
                      >
                        Archiver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
