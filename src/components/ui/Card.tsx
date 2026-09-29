import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "interactive" | "soft";

export function Card({
  children,
  variant = "default",
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: CardVariant;
}) {
  return (
    <div className={`card ${variant === "default" ? "" : `card--${variant}`} ${className}`} {...props}>
      {children}
    </div>
  );
}