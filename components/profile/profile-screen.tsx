"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, ChevronLeft, ChevronRight, CircleAlert, HeartHandshake, House, IdCard, UserRound } from "lucide-react";
import { getRoleDefinition } from "@/data/mock";
import { PersonaAvatar } from "@/components/role-switcher";
import type { ProfileData } from "@/types";
import { cn } from "@/lib/utils";
import { displayName, pronounText, useProfile } from "./use-profile";
import { AboutYou } from "./about-you";
import { PersonalDetailsScreen } from "./personal-details";
import { EmergencyContacts } from "./emergency-contacts";
import { HomePreferences } from "./home-preferences";
import { NotificationPreferences, notificationSummary } from "./notification-preferences";

export type ProfileSection = "overview" | "about" | "personal" | "emergency" | "home" | "notifications";

const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "Europe/London" });

function Row({
  icon,
  title,
  summary,
  attention,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  summary: string;
  attention?: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="flex w-full items-center gap-3.5 bg-white px-4 py-3.5 text-left outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary/30"
      >
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", attention ? "bg-coral/10 text-[#c2392d]" : "bg-sky-100 text-ink")}>
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-black text-ink">{title}</span>
          <span className={cn("block truncate text-xs font-semibold", attention ? "text-[#c2392d]" : "text-muted-ink")}>{summary}</span>
        </span>
        {attention && <CircleAlert className="h-4 w-4 shrink-0 text-[#c2392d]" strokeWidth={2.6} aria-label="Needs attention" />}
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-ink" strokeWidth={2.6} />
      </motion.button>
    </li>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="mb-2 px-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-ink">{label}</h3>
      <ul role="list" className="divide-y divide-ink/5 overflow-hidden rounded-3xl ring-1 ring-ink/5">
        {children}
      </ul>
    </section>
  );
}

function essentials(p: ProfileData) {
  const personalDone = Boolean(p.personal.mobile.trim() && p.personal.addressLine1.trim() && p.personal.postcode.trim());
  return {
    about: p.pronouns !== "unset",
    personal: personalDone,
    emergency: p.emergencyContacts.length > 0,
  };
}

export function ProfileScreen({ initialSection = "overview", onBackHome }: { initialSection?: ProfileSection; onBackHome: () => void }) {
  const { profile, setProfile, persona, loaded } = useProfile();
  const [section, setSection] = useState<ProfileSection>(initialSection);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => setSection(initialSection), [initialSection]);
  useEffect(() => {
    if (!savedFlash) return;
    const t = window.setTimeout(() => setSavedFlash(false), 2200);
    return () => window.clearTimeout(t);
  }, [savedFlash]);

  const goOverview = () => setSection("overview");
  const save = (patch: Partial<ProfileData>) => {
    setProfile((p) => ({ ...p, ...patch }));
    setSavedFlash(true);
    goOverview();
  };

  const name = displayName(profile, persona.firstName);
  const pronouns = pronounText(profile);
  const done = essentials(profile);
  const doneCount = Object.values(done).filter(Boolean).length;
  const contactNames = profile.emergencyContacts.map((c) => c.name.split(" ")[0]).join(" and ");
  const visibleCards = Object.values(profile.home.cards).filter(Boolean).length;

  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-b from-[#e6f8ff] to-[#f4f8ff]">
      {/* Wait for saved preferences so section drafts start from the right values. */}
      {loaded && (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={section}
          className="absolute inset-0"
          initial={{ opacity: 0, x: section === "overview" ? -24 : 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: section === "overview" ? -24 : 24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {section === "overview" && (
            <div className="no-scrollbar h-full overflow-y-auto overscroll-contain px-4 pb-36 pt-[84px]">
              <button
                type="button"
                onClick={onBackHome}
                className="-ml-1 mb-2 flex items-center gap-0.5 rounded-full py-1 pr-3 text-xs font-black text-primary outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={3} />
                Home
              </button>

              {/* Identity */}
              <section className="flex items-center gap-4 rounded-[1.75rem] bg-white p-4 ring-1 ring-ink/5">
                <PersonaAvatar initials={persona.initials} role={persona.role} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h2 className="truncate text-2xl font-black leading-tight tracking-tight text-ink">{name}</h2>
                    {pronouns && <span className="text-sm font-bold text-muted-ink">({pronouns})</span>}
                  </div>
                  <p className="truncate text-xs font-semibold text-muted-ink">
                    {persona.jobTitle} · {getRoleDefinition(persona.role).label}
                  </p>
                  {persona.role === "new-starter" && (
                    <p className="mt-0.5 text-xs font-bold text-meadow-600">
                      Starting {dayMonth.format(new Date(`${persona.startDate}T12:00:00Z`))} in {persona.location}
                    </p>
                  )}
                </div>
              </section>

              {/* Essentials progress */}
              <div className="mt-3 rounded-3xl bg-white px-4 py-3 ring-1 ring-ink/5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-ink">{doneCount === 3 ? "Your essentials are done" : "Finish your essentials"}</p>
                  <span className="text-xs font-black tabular-nums text-ink">{doneCount}/3</span>
                </div>
                <div className="mt-2 flex gap-1.5" aria-hidden="true">
                  {Object.values(done).map((d, i) => (
                    <span key={i} className={cn("h-2 flex-1 rounded-full", d ? "bg-meadow-600" : "bg-ink/10")} />
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {savedFlash && (
                  <motion.p
                    role="status"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex items-center gap-2 rounded-2xl bg-meadow-400/15 px-3.5 py-2.5 text-xs font-black text-meadow-600"
                  >
                    <Check className="h-4 w-4" strokeWidth={3} />
                    Saved
                  </motion.p>
                )}
              </AnimatePresence>

              <Group label="About you">
                <Row
                  icon={<UserRound className="h-5 w-5" strokeWidth={2.4} />}
                  title="Name and pronouns"
                  summary={pronouns ? `${name} · ${pronouns}` : profile.pronouns === "prefer-not" ? `${name} · pronouns not shared` : `${name} · add your pronouns`}
                  attention={!done.about}
                  onClick={() => setSection("about")}
                />
                <Row
                  icon={<IdCard className="h-5 w-5" strokeWidth={2.4} />}
                  title="Personal details"
                  summary={done.personal ? `${profile.personal.mobile} · ${profile.personal.city || profile.personal.postcode}` : "Add your mobile and home address"}
                  attention={!done.personal}
                  onClick={() => setSection("personal")}
                />
                <Row
                  icon={<HeartHandshake className="h-5 w-5" strokeWidth={2.4} />}
                  title="Emergency contacts"
                  summary={done.emergency ? contactNames : "No one added yet"}
                  attention={!done.emergency}
                  onClick={() => setSection("emergency")}
                />
              </Group>

              <Group label="Your app">
                <Row
                  icon={<House className="h-5 w-5" strokeWidth={2.4} />}
                  title="Home screen and shortcuts"
                  summary={`${profile.home.shortcuts.length} shortcuts · ${visibleCards} ${visibleCards === 1 ? "card" : "cards"} shown`}
                  onClick={() => setSection("home")}
                />
                <Row
                  icon={<Bell className="h-5 w-5" strokeWidth={2.4} />}
                  title="Notifications"
                  summary={notificationSummary(profile.notifications)}
                  onClick={() => setSection("notifications")}
                />
              </Group>

              <p className="mt-4 px-1 text-center text-[11px] font-semibold text-muted-ink">
                Saved on this device for the demo. Your details aren&apos;t sent anywhere.
              </p>
            </div>
          )}

          {section === "about" && <AboutYou profile={profile} legalFirstName={profile.personal.legalFirstName} onSave={save} onBack={goOverview} />}
          {section === "personal" && <PersonalDetailsScreen profile={profile} onSave={save} onBack={goOverview} />}
          {section === "emergency" && <EmergencyContacts profile={profile} onSave={save} onBack={goOverview} />}
          {section === "home" && <HomePreferences profile={profile} onSave={save} onBack={goOverview} />}
          {section === "notifications" && <NotificationPreferences profile={profile} onSave={save} onBack={goOverview} />}
        </motion.div>
      </AnimatePresence>
      )}
    </div>
  );
}
