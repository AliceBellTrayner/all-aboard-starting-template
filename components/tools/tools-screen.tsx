"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Eye, Headphones, Laptop, Store, Truck } from "lucide-react";
import {
  DEMO_STARTER_ID,
  getPeripherals,
  getPersonaById,
  getStoreApps,
  getTechRecommendation,
  isAppRecommendedFor,
} from "@/data/mock";
import { useUserRole } from "@/context/user-role";
import { cn } from "@/lib/utils";
import { usePersistentState } from "./tool-shell";
import { AppStore } from "./app-store";
import { ChooseTech, type TechSelection } from "./choose-tech";
import { ChoosePeripherals } from "./choose-peripherals";
import { DeliveryPreference, type DeliverySelection } from "./delivery-preference";

type Section = "home" | "apps" | "tech" | "peripherals" | "delivery";

interface ToolsState {
  apps: string[];
  tech: TechSelection | null;
  peripherals: string[] | null;
  delivery: DeliverySelection | null;
}

const INITIAL: ToolsState = { apps: [], tech: null, peripherals: null, delivery: null };

const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "Europe/London" });

function starterDetails() {
  const starter = getPersonaById(DEMO_STARTER_ID);
  if (!starter || starter.role !== "new-starter") throw new Error("Demo starter must be a new starter");
  return starter;
}

/**
 * Tools hub. Home is a short checklist of four set-up tasks; each opens its own
 * focused screen with a single primary action. The tools always belong to the
 * demo starter; other roles see a read-only preview banner.
 */
export function ToolsScreen() {
  const { role } = useUserRole();
  const starter = starterDetails();
  const [state, setState] = usePersistentState<ToolsState>(`launchpad.tools.${starter.id}.v1`, INITIAL);
  const [section, setSection] = useState<Section>("home");

  const rec = getTechRecommendation(starter.jobTitle);
  const recommendedApps = getStoreApps().filter((a) => isAppRecommendedFor(a, starter.jobTitle));
  const recommendedAdded = recommendedApps.filter((a) => state.apps.includes(a.id)).length;

  const laptopLabel = (() => {
    const choice = rec.choices.find((c) => c.id === "laptop");
    const id = state.tech?.laptop ?? choice?.recommendedId;
    return choice?.options.find((o) => o.id === id)?.label ?? "Laptop";
  })();
  const phoneLabel = (() => {
    const choice = rec.choices.find((c) => c.id === "phone");
    const id = state.tech?.phone;
    // BYOD means no work phone is shipped.
    return id && id !== "byod" ? choice?.options.find((o) => o.id === id)?.label : undefined;
  })();
  const peripheralNames = getPeripherals()
    .filter((p) => state.peripherals?.includes(p.id))
    .map((p) => p.label);

  const goHome = () => setSection("home");
  const save = (patch: Partial<ToolsState>) => {
    setState((s) => ({ ...s, ...patch }));
    goHome();
  };

  const tasks: {
    id: Exclude<Section, "home">;
    icon: ReactNode;
    title: string;
    detail: string;
    status: string | null;
  }[] = [
    {
      id: "apps",
      icon: <Store className="h-6 w-6" strokeWidth={2.4} />,
      title: "App store",
      detail: `${recommendedApps.length} apps picked for ${rec.jobFamily}`,
      status:
        state.apps.length > 0
          ? `${state.apps.length} added · ${recommendedAdded}/${recommendedApps.length} recommended`
          : null,
    },
    {
      id: "tech",
      icon: <Laptop className="h-6 w-6" strokeWidth={2.4} />,
      title: "Choose your tech",
      detail: `Laptop and phone, recommended for ${rec.jobFamily}`,
      status: state.tech
        ? [laptopLabel, state.tech.phone === "byod" ? "BYOD" : phoneLabel].filter(Boolean).join(" · ")
        : null,
    },
    {
      id: "peripherals",
      icon: <Headphones className="h-6 w-6" strokeWidth={2.4} />,
      title: "Choose your peripherals",
      detail: "Headset, monitor and assistive tech",
      status: state.peripherals ? (state.peripherals.length ? `${state.peripherals.length} requested` : "None needed") : null,
    },
    {
      id: "delivery",
      icon: <Truck className="h-6 w-6" strokeWidth={2.4} />,
      title: "Delivery preference",
      detail: "Office or home, for your kit and welcome pack",
      status: state.delivery
        ? state.delivery.method === "office"
          ? `Collect in ${starter.location}`
          : `Home · ${state.delivery.date ? dayMonth.format(new Date(`${state.delivery.date}T12:00:00Z`)) : ""}`
        : null,
    },
  ];
  const doneCount = tasks.filter((t) => t.status).length;
  const nextTask = tasks.find((t) => !t.status);

  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-b from-[#e6f8ff] to-[#f4f8ff]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={section}
          className="absolute inset-0"
          initial={{ opacity: 0, x: section === "home" ? -24 : 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: section === "home" ? -24 : 24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {section === "home" && (
            <div className="no-scrollbar h-full overflow-y-auto overscroll-contain px-4 pb-36 pt-[88px]">
              {role !== "new-starter" && (
                <p className="mb-3 flex items-center gap-2 rounded-2xl bg-ink/5 px-3.5 py-2.5 text-xs font-bold text-ink">
                  <Eye className="h-4 w-4 shrink-0" strokeWidth={2.6} />
                  Previewing {starter.firstName}&apos;s set-up
                </p>
              )}

              <header className="px-1">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-ink">Tools</p>
                <h2 className="text-2xl font-black leading-tight tracking-tight text-ink">
                  {doneCount === tasks.length ? "You're all set" : `Get set up, ${starter.firstName}`}
                </h2>
                <p className="mt-1 text-sm font-semibold text-muted-ink">
                  {doneCount === tasks.length
                    ? `Everything will be ready for ${dayMonth.format(new Date(starter.startDate))}.`
                    : `Four quick choices so everything's ready for day one.`}
                </p>
              </header>

              {/* Progress */}
              <div className="mt-4 flex items-center gap-3 px-1">
                <div className="flex flex-1 gap-1.5" aria-hidden="true">
                  {tasks.map((t) => (
                    <span key={t.id} className={cn("h-2 flex-1 rounded-full", t.status ? "bg-meadow-600" : "bg-ink/10")} />
                  ))}
                </div>
                <span className="text-xs font-black tabular-nums text-ink">
                  {doneCount}/{tasks.length} done
                </span>
              </div>

              <ol className="mt-4 flex flex-col gap-2.5">
                {tasks.map((t, i) => {
                  const done = Boolean(t.status);
                  const isNext = t.id === nextTask?.id;
                  return (
                    <li key={t.id}>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSection(t.id)}
                        className={cn(
                          "flex w-full items-center gap-3.5 rounded-3xl bg-white p-4 text-left outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
                          isNext ? "ring-2 ring-primary shadow-[0_18px_36px_-22px_rgba(47,43,255,0.9)]" : "ring-1 ring-ink/5",
                        )}
                      >
                        <span
                          className={cn(
                            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                            done ? "bg-meadow-400/15 text-meadow-600" : isNext ? "bg-primary text-white" : "bg-sky-100 text-ink",
                          )}
                        >
                          {t.icon}
                          {done && (
                            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-meadow-600 text-white ring-2 ring-white">
                              <Check className="h-3 w-3" strokeWidth={4} />
                            </span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[11px] font-extrabold tabular-nums text-muted-ink">{i + 1}</span>
                            <span className="truncate text-[15px] font-black text-ink">{t.title}</span>
                          </span>
                          <span className={cn("block truncate text-xs font-semibold", done ? "text-meadow-600" : "text-muted-ink")}>
                            {t.status ?? t.detail}
                          </span>
                        </span>
                        {isNext ? (
                          <span className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-[11px] font-black text-white">Start</span>
                        ) : (
                          <ChevronRight className="h-5 w-5 shrink-0 text-muted-ink" strokeWidth={2.6} />
                        )}
                      </motion.button>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {section === "apps" && (
            <AppStore
              jobTitle={starter.jobTitle}
              added={state.apps}
              onToggle={(id) =>
                setState((s) => ({ ...s, apps: s.apps.includes(id) ? s.apps.filter((x) => x !== id) : [...s.apps, id] }))
              }
              onBack={goHome}
            />
          )}

          {section === "tech" && (
            <ChooseTech jobTitle={starter.jobTitle} saved={state.tech ?? {}} onSave={(tech) => save({ tech })} onBack={goHome} />
          )}

          {section === "peripherals" && (
            <ChoosePeripherals saved={state.peripherals} onSave={(peripherals) => save({ peripherals })} onBack={goHome} />
          )}

          {section === "delivery" && (
            <DeliveryPreference
              officeLocation={starter.location}
              startDate={starter.startDate}
              kitSummary={[
                laptopLabel,
                ...(phoneLabel ? [phoneLabel] : []),
                ...(peripheralNames.length ? [peripheralNames.join(", ")] : []),
              ]}
              saved={state.delivery}
              onSave={(delivery) => save({ delivery })}
              onBack={goHome}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
