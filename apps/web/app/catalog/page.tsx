'use client';

import { useState } from 'react';
import { useProducts, useCategories, type ProductFilters } from '@/hooks/use-catalog';
import { ProductCard } from '@/components/product-card';

export default function CatalogPage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const { data, isLoading, error } = useProducts(filters);
  const { data: categories } = useCategories();

  const products = data?.data ?? [];

  function toggleCategory(categoryId: string) {
    setFilters((prev) =>
      prev.categoryId === categoryId
        ? { ...prev, categoryId: undefined }
        : { ...prev, categoryId },
    );
  }

  function toggleLastMinute() {
    setFilters((prev) => ({
      ...prev,
      isLastMinuteOk: prev.isLastMinuteOk === true ? undefined : true,
    }));
  }

  function toggleSurprise() {
    setFilters((prev) => ({
      ...prev,
      isSurpriseReady: prev.isSurpriseReady === true ? undefined : true,
    }));
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cream">Catalogue</h1>
        <p className="text-muted text-sm mt-1">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setFilters({})}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            Object.keys(filters).length === 0
              ? 'bg-gold text-obsidian font-medium'
              : 'bg-stone text-muted hover:text-cream'
          }`}
        >
          Tous
        </button>

        <button
          onClick={toggleLastMinute}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            filters.isLastMinuteOk
              ? 'bg-gold text-obsidian font-medium'
              : 'bg-stone text-muted hover:text-cream'
          }`}
        >
          Last-minute
        </button>

        <button
          onClick={toggleSurprise}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            filters.isSurpriseReady
              ? 'bg-gold text-obsidian font-medium'
              : 'bg-stone text-muted hover:text-cream'
          }`}
        >
          Surprise
        </button>

        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              filters.categoryId === category.id
                ? 'bg-gold text-obsidian font-medium'
                : 'bg-stone text-muted hover:text-cream'
            }`}
          >
            {category.name}
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
          <p className="text-muted text-sm">Aucun produit pour ces filtres.</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
