"use client";

import { useState } from "react";
import { Building2, CalendarDays, Gift, House, Laptop, Package } from "lucide-react";
import type { DeliveryMethod } from "@/types";
import { cn } from "@/lib/utils";
import { ChoiceCard, PrimaryButton, ToolShell } from "./tool-shell";

export interface DeliverySelection {
  method: DeliveryMethod;
  /** ISO date for home delivery. */
  date?: string;
}

const TZ = "Europe/London";
const dayLabel = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: TZ });

/** The three working days before the start date, as ISO dates. */
function deliveryDates(startDate: string): string[] {
  const dates: string[] = [];
  const d = new Date(`${startDate}T12:00:00Z`);
  while (dates.length < 3) {
    d.setUTCDate(d.getUTCDate() - 1);
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) dates.unshift(d.toISOString().slice(0, 10));
  }
  return dates;
}

export function DeliveryPreference({
  officeLocation,
  startDate,
  kitSummary,
  saved,
  onSave,
  onBack,
}: {
  officeLocation: string;
  startDate: string;
  /** Short lines describing what will be delivered, e.g. "Windows laptop". */
  kitSummary: string[];
  saved: DeliverySelection | null;
  onSave: (selection: DeliverySelection) => void;
  onBack: () => void;
}) {
  const dates = deliveryDates(startDate);
  const [method, setMethod] = useState<DeliveryMethod | null>(saved?.method ?? null);
  const [date, setDate] = useState<string | undefined>(saved?.date ?? dates[dates.length - 1]);
  const startLabel = dayLabel.format(new Date(`${startDate}T12:00:00Z`));

  return (
    <ToolShell
      title="Delivery preference"
      subtitle="Where should we get your laptop, kit and welcome pack to?"
      onBack={onBack}
      action={
        <PrimaryButton
          disabled={!method || (method === "home" && !date)}
          onClick={() => method && onSave({ method, date: method === "home" ? date : undefined })}
        >
          {method === "home" ? "Confirm home delivery" : method === "office" ? "Confirm office collection" : "Choose an option"}
        </PrimaryButton>
      }
    >
      <div role="radiogroup" aria-label="Delivery method" className="flex flex-col gap-2.5">
        <ChoiceCard
          selected={method === "office"}
          onSelect={() => setMethod("office")}
          icon={<Building2 className="h-5 w-5" strokeWidth={2.4} />}
          title="Collect at the office"
          detail={`${officeLocation} reception on your first day, ${startLabel}`}
        />
        <ChoiceCard
          selected={method === "home"}
          onSelect={() => setMethod("home")}
          icon={<House className="h-5 w-5" strokeWidth={2.4} />}
          title="Deliver to my home"
          detail="Sent to the home address in Workday, before day one"
        />
        {method === "home" && (
          <div className="rounded-3xl bg-white p-4 ring-1 ring-ink/5">
            <p className="mb-2 flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-ink">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={2.6} />
              Delivery day
            </p>
            <div role="radiogroup" aria-label="Delivery day" className="flex gap-1.5">
              {dates.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={date === d}
                  onClick={() => setDate(d)}
                  className={cn(
                    "flex-1 rounded-xl px-2 py-2.5 text-center text-xs font-black outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
                    date === d ? "bg-primary text-white" : "bg-sky-100 text-ink",
                  )}
                >
                  {dayLabel.format(new Date(`${d}T12:00:00Z`))}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <section className="mt-5 rounded-3xl bg-white p-4 ring-1 ring-ink/5">
        <p className="mb-3 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-ink">
          <Package className="h-4 w-4" strokeWidth={2.6} />
          What&apos;s in the box
        </p>
        <ul role="list" className="flex flex-col gap-2">
          {kitSummary.map((line, i) => (
            <li key={line} className="flex items-center gap-2.5 text-sm font-bold text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100">
                {i === 0 ? <Laptop className="h-4 w-4" strokeWidth={2.4} /> : <Package className="h-4 w-4" strokeWidth={2.4} />}
              </span>
              {line}
            </li>
          ))}
          <li className="flex items-center gap-2.5 text-sm font-bold text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-200 text-[#7a4f00]">
              <Gift className="h-4 w-4" strokeWidth={2.4} />
            </span>
            Welcome kit
          </li>
        </ul>
      </section>
    </ToolShell>
  );
}
