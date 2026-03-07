'use client';

import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/product-form';
import { useCreateProduct } from '@/hooks/use-products';
import type { CreateProductInput } from '@/hooks/use-products';

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  function handleSubmit(input: CreateProductInput) {
    createProduct.mutate(input, {
      onSuccess: () => router.push('/dashboard/products'),
    });
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <a href="/dashboard/products" className="text-muted text-sm hover:text-cream transition-colors">
          ← Produits
        </a>
        <h1 className="text-2xl font-bold text-cream mt-4">Nouveau produit</h1>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isLoading={createProduct.isPending}
        error={createProduct.error?.message}
        submitLabel="Créer le produit"
      />
    </div>
  );
}
