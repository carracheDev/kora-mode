import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

const variants = {
  primary: "bg-primary text-primary-ink hover:bg-primary-hover",
  secondary: "border border-line bg-surface text-ink hover:bg-bg",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
};

const sizes = {
  sm: "min-h-12 px-4 sm:min-h-10",
  md: "min-h-12 px-5",
  lg: "min-h-14 px-6",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  children,
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
    const labelSize = variant === "primary" ? "text-[19px] font-bold" : "text-sm font-semibold";
    const classes = `inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] transition-[filter,background-color,color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${sizes[size]} ${labelSize} ${fullWidth ? "w-full" : ""} ${className}`;
  const content = (
    <>
      {loading ? <LoaderCircle aria-hidden="true" className="animate-spin" size={18} /> : null}
      {children}
    </>
  );

  return (
    <button
      aria-busy={loading || undefined}
      className={classes}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {content}
    </button>
  );
}