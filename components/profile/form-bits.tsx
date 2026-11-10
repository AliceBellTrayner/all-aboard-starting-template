"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TextField({
  label,
  hint,
  error,
  className,
  ...input
}: { label: string; hint?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block px-1 text-xs font-extrabold text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink outline-none ring-1 placeholder:text-muted-ink/70 focus-visible:ring-4",
          error ? "ring-coral focus-visible:ring-coral/30" : "ring-ink/10 focus-visible:ring-primary/25",
        )}
        {...input}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 px-1 text-[11px] font-bold text-[#c2392d]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 px-1 text-[11px] font-semibold text-muted-ink">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Accessible on/off switch row with a label and optional description. */
export function SwitchRow({
  label,
  detail,
  checked,
  onChange,
  icon,
  disabled,
}: {
  label: string;
  detail?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left ring-1 ring-ink/5 outline-none transition-opacity disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-primary/30"
    >
      {icon && (
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", checked ? "bg-primary/10 text-primary" : "bg-ink/5 text-muted-ink")}>
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-black text-ink">{label}</span>
        {detail && <span className="block text-xs font-semibold text-muted-ink">{detail}</span>}
      </span>
      <span
        aria-hidden="true"
        className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", checked ? "bg-meadow-600" : "bg-ink/15")}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-[left]",
            checked ? "left-6" : "left-1",
          )}
        />
      </span>
    </button>
  );
}
