import type { ReactNode } from "react";

type BadgeVariant = "promo" | "stock" | "new";

const variants: Record<BadgeVariant, string> = {
  promo: "bg-promo text-promo-ink",
  stock: "bg-surface-mint text-primary",
  new: "bg-ink text-surface",
};

export function Badge({
  children,
  variant = "new",
}: {
  children: ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex min-h-6 items-center rounded-[var(--radius-pill)] px-3 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
}