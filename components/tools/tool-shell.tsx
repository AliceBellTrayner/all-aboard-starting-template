"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export { usePersistentState } from "@/lib/use-persistent-state";

/** Full-height layout for a single focused task: back, title, body and one primary action. */
export function ToolShell({
  title,
  subtitle,
  onBack,
  backLabel = "Tools",
  children,
  action,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
  backLabel?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="relative h-full">
      <div className="no-scrollbar h-full overflow-y-auto overscroll-contain px-4 pt-[84px]" style={{ paddingBottom: action ? 200 : 140 }}>
        <button
          type="button"
          onClick={onBack}
          className="-ml-1 mb-2 flex items-center gap-0.5 rounded-full py-1 pr-3 text-xs font-black text-primary outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={3} />
          {backLabel}
        </button>
        <h2 className="text-2xl font-black leading-tight tracking-tight text-ink">{title}</h2>
        <p className="mt-1 text-sm font-semibold text-muted-ink">{subtitle}</p>
        <div className="mt-5">{children}</div>
      </div>
      {action && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[96px] z-20 px-4 pb-2 pt-6 bg-gradient-to-t from-[#f4f8ff] via-[#f4f8ff]/90 to-transparent">
          <div className="pointer-events-auto">{action}</div>
        </div>
      )}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-[15px] font-black text-white shadow-[0_16px_30px_-14px_rgba(47,43,255,0.9)] outline-none transition-opacity disabled:opacity-40 disabled:shadow-none focus-visible:ring-4 focus-visible:ring-primary/35"
    >
      {children}
    </motion.button>
  );
}

/** Large selectable card used for single and multi choice. */
export function ChoiceCard({
  selected,
  onSelect,
  icon,
  title,
  detail,
  badge,
  multi = false,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  icon?: ReactNode;
  title: string;
  detail?: string;
  badge?: string;
  multi?: boolean;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-3xl border-2 bg-white p-4 text-left transition-colors outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
        selected ? "border-primary shadow-[0_14px_30px_-20px_rgba(47,43,255,0.9)]" : "border-transparent ring-1 ring-ink/5 hover:bg-[#f8faff]",
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            selected ? "bg-primary text-white" : "bg-sky-100 text-ink",
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="text-[15px] font-black text-ink">{title}</span>
          {badge && (
            <span className="rounded-full bg-gold-200 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#7a4f00]">
              {badge}
            </span>
          )}
        </span>
        {detail && <span className="mt-0.5 block text-xs font-semibold text-muted-ink">{detail}</span>}
        {children}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2",
          multi ? "rounded-lg" : "rounded-full",
          selected ? "border-primary bg-primary text-white" : "border-ink/20 bg-white",
        )}
      >
        {selected && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
      </span>
    </button>
  );
}

export function GroupLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 mt-5 px-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-ink first:mt-0">{children}</p>;
}
