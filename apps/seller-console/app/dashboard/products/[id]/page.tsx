'use client';

import { useParams, useRouter } from 'next/navigation';
import { ProductForm } from '@/components/product-form';
import { useProduct, useUpdateProduct } from '@/hooks/use-products';
import type { CreateProductInput } from '@/hooks/use-products';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: product, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct(id);

  function handleSubmit(input: CreateProductInput) {
    updateProduct.mutate(input, {
      onSuccess: () => router.push('/dashboard/products'),
    });
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8">
        <p className="text-danger">Produit introuvable.</p>
      </div>
    );
  }

  const defaultValues: CreateProductInput = {
    title: product.title,
    description: product.description,
    priceAmount: product.priceAmount,
    isSurpriseReady: product.isSurpriseReady,
    isLastMinuteOk: product.isLastMinuteOk,
    preparationTimeMin: product.preparationTimeMin ?? undefined,
    tagSlugs: product.tags.map((t) => t.slug),
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <a href="/dashboard/products" className="text-muted text-sm hover:text-cream transition-colors">
          ← Produits
        </a>
        <h1 className="text-2xl font-bold text-cream mt-4">Modifier le produit</h1>
        <p className="text-muted text-sm mt-1 truncate">{product.title}</p>
      </div>

      <ProductForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isLoading={updateProduct.isPending}
        error={updateProduct.error?.message}
        submitLabel="Enregistrer les modifications"
      />
    </div>
  );
}
