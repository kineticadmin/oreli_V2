'use client';

import { useState } from 'react';
import type { CreateProductInput } from '@/hooks/use-products';

interface ProductFormProps {
  defaultValues?: Partial<CreateProductInput>;
  onSubmit: (input: CreateProductInput) => void;
  isLoading: boolean;
  error?: string | undefined;
  submitLabel: string;
}

export function ProductForm({ defaultValues, onSubmit, isLoading, error, submitLabel }: ProductFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? '');
  const [description, setDescription] = useState(defaultValues?.description ?? '');
  const [priceEur, setPriceEur] = useState(
    defaultValues?.priceAmount !== undefined ? String(defaultValues.priceAmount / 100) : '',
  );
  const [isSurpriseReady, setIsSurpriseReady] = useState(defaultValues?.isSurpriseReady ?? false);
  const [isLastMinuteOk, setIsLastMinuteOk] = useState(defaultValues?.isLastMinuteOk ?? false);
  const [prepTimeMin, setPrepTimeMin] = useState(
    defaultValues?.preparationTimeMin !== undefined ? String(defaultValues.preparationTimeMin) : '',
  );
  const [tagInput, setTagInput] = useState(defaultValues?.tagSlugs?.join(', ') ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const priceAmountCents = Math.round(parseFloat(priceEur) * 100);
    const parsedPrepTime = prepTimeMin ? parseInt(prepTimeMin) : undefined;
    const parsedTags = tagInput
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priceAmount: priceAmountCents,
      isSurpriseReady,
      isLastMinuteOk,
      ...(parsedPrepTime !== undefined && !isNaN(parsedPrepTime) ? { preparationTimeMin: parsedPrepTime } : {}),
      ...(parsedTags.length > 0 ? { tagSlugs: parsedTags } : {}),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Titre" required>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Bouquet de roses premium"
          required
          minLength={2}
          maxLength={200}
          className={inputClass}
        />
      </FormField>

      <FormField label="Description" required>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez votre produit en détail (matériaux, dimensions, ce qui est inclus...)"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          className={`${inputClass} resize-none`}
        />
        <p className="text-muted text-xs mt-1">{description.length}/5000</p>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Prix (EUR)" required>
          <input
            type="number"
            value={priceEur}
            onChange={(e) => setPriceEur(e.target.value)}
            placeholder="49.90"
            required
            min="1"
            max="10000"
            step="0.01"
            className={inputClass}
          />
          <p className="text-muted text-xs mt-1">Prix en euros (ex: 49.90)</p>
        </FormField>

        <FormField label="Temps de préparation (min)">
          <input
            type="number"
            value={prepTimeMin}
            onChange={(e) => setPrepTimeMin(e.target.value)}
            placeholder="60"
            min="0"
            max="10080"
            className={inputClass}
          />
          <p className="text-muted text-xs mt-1">Optionnel — en minutes</p>
        </FormField>
      </div>

      <FormField label="Tags (slugs séparés par virgules)">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="fleurs, romantique, anniversaire"
          className={inputClass}
        />
        <p className="text-muted text-xs mt-1">Séparés par des virgules, en minuscules</p>
      </FormField>

      <div className="bg-stone border border-warm rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium text-cream">Options de vente</p>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isSurpriseReady}
            onChange={(e) => setIsSurpriseReady(e.target.checked)}
            className="w-4 h-4 accent-gold"
          />
          <div>
            <span className="text-cream text-sm">Mode Surprise</span>
            <p className="text-muted text-xs">Ce produit peut être offert sans que le destinataire le voit à l&apos;avance</p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isLastMinuteOk}
            onChange={(e) => setIsLastMinuteOk(e.target.checked)}
            className="w-4 h-4 accent-gold"
          />
          <div>
            <span className="text-cream text-sm">Last-minute</span>
            <p className="text-muted text-xs">Disponible pour les cadeaux à livrer dans moins de 36h</p>
          </div>
        </label>
      </div>

      {error && (
        <p className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gold text-obsidian font-semibold py-3 rounded-xl text-sm hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Enregistrement...' : submitLabel}
      </button>
    </form>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-muted mb-1.5">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = 'w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold transition-colors';
