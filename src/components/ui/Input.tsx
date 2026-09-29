import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, error, className = "", ...props },
  ref,
) {
  const inputId = id ?? props.name;
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <div className="grid gap-2">
      <label className="text-base font-medium text-ink" htmlFor={inputId}>
        {label}
      </label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={`min-h-12 w-full rounded-[var(--radius-button)] border border-line bg-surface px-4 text-base text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface-soft ${className}`}
        id={inputId}
        ref={ref}
        {...props}
      />
      {error ? (
        <p className="text-sm text-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});