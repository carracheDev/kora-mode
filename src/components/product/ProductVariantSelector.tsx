"use client";

import { useState } from "react";
import type { Product } from "@/core/types";

export function useProductVariantSelection() {
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  return { size, color, setSize, setColor };
}

export function ProductVariantSelector({
  product,
  size,
  color,
  onSizeChange,
  onColorChange,
}: {
  product: Product;
  size: string;
  color: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}) {
  return (
    <div className="grid gap-5">
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Taille</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.sizes.map((option) => (
            <button
              aria-pressed={size === option}
              className={`min-h-11 min-w-11 rounded-[var(--radius-button)] border px-3 text-sm font-semibold ${size === option ? "border-primary bg-primary text-primary-ink" : "border-line bg-surface text-ink"}`}
              key={option}
              onClick={() => onSizeChange(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      {product.colors.length ? (
        <fieldset>
          <legend className="text-sm font-semibold text-ink">Couleur</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((option) => (
              <button
                aria-pressed={color === option.name}
                className={`inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] border px-4 text-sm ${color === option.name ? "border-primary bg-surface font-semibold text-primary" : "border-line bg-surface text-ink"}`}
                key={option.name}
                onClick={() => onColorChange(option.name)}
                type="button"
              >
                <span aria-hidden="true" className="size-4 rounded-full border border-line" style={{ backgroundColor: option.hex }} />
                {option.name}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}
    </div>
  );
}
