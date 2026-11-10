"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bell, CalendarDays, MapPin, Navigation, Settings2, UserRound, X } from "lucide-react";
import { useUserRole } from "@/context/user-role";
import { DEMO_STARTER_ID, SHORTCUTS, getNotificationsFor, getPersonaById } from "@/data/mock";
import { RoleSwitcher } from "@/components/role-switcher";
import { NOTIFICATION_CATEGORY_KINDS, type NotificationItem, type ShortcutId } from "@/types";
import type { TabId } from "@/components/launchpad/bottom-nav";
import type { ProfileSection } from "@/components/profile/profile-screen";
import { displayName, useProfile } from "@/components/profile/use-profile";
import { SHORTCUT_ICON } from "@/components/profile/shortcut-icons";
import { notificationSummary } from "@/components/profile/notification-preferences";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const OFFICE_ADDRESS = process.env.NEXT_PUBLIC_OFFICE_ADDRESS;

type HomeScreenProps = {
  onContinue: () => void;
  onProfile: (section?: ProfileSection) => void;
  onNavigate: (tab: TabId) => void;
};

/** Where each shortcut goes. "notifications" opens the sheet instead of a tab. */
const SHORTCUT_TAB: Record<Exclude<ShortcutId, "notifications">, TabId> = {
  journey: "journey",
  tasks: "tasks",
  "app-store": "tools",
  buddy: "buddy",
  "ask-hr": "buddy",
};

export function HomeScreen({ onContinue, onProfile, onNavigate }: HomeScreenProps) {
  const { persona: viewer } = useUserRole();
  const starterPersona = getPersonaById(DEMO_STARTER_ID);
  if (!starterPersona || starterPersona.role !== "new-starter") {
    throw new Error(`No demo starter found for "${DEMO_STARTER_ID}"`);
  }
  const starter = starterPersona;
  const manager = getPersonaById(starter.managerId);
  const { profile } = useProfile();
  // Greet the starter by their preferred name when they are the one viewing.
  const greetingName = viewer.id === starter.id ? displayName(profile, starter.firstName) : starter.firstName;
  const allNotifications = useMemo(() => getNotificationsFor(viewer.id), [viewer.id]);
  // Respect the categories chosen in Profile > Notifications.
  const notifications = useMemo(() => {
    const allowed = new Set(
      (Object.keys(NOTIFICATION_CATEGORY_KINDS) as (keyof typeof NOTIFICATION_CATEGORY_KINDS)[])
        .filter((c) => profile.notifications.categories[c])
        .flatMap((c) => NOTIFICATION_CATEGORY_KINDS[c]),
    );
    return allNotifications.filter((n) => allowed.has(n.kind));
  }, [allNotifications, profile.notifications.categories]);
  const hiddenCount = allNotifications.length - notifications.length;
  const shortcuts = profile.home.shortcuts;
  const cards = profile.home.cards;
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const address = OFFICE_ADDRESS?.trim() || `${starter.location}, UK`;
  const mapUrl = useMemo(() => {
    if (!GOOGLE_MAPS_API_KEY) return undefined;
    const url = new URL("https://www.google.com/maps/embed/v1/place");
    url.searchParams.set("key", GOOGLE_MAPS_API_KEY);
    url.searchParams.set("q", address);
    return url.toString();
  }, [address]);
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#e3f6ea] to-[#f4f8ff]">
      <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <span className="rounded-full bg-white/85 px-3 py-1.5 text-sm font-black tracking-tight text-ink shadow-[0_14px_30px_-16px_rgba(23,32,58,0.5)] ring-1 ring-white/70 backdrop-blur-xl">
          Horse<span className="text-meadow-600">Power</span>
        </span>
        <div className="flex items-center gap-2">
          <RoleSwitcher compact />
          <button
            type="button"
            onClick={() => setNotificationsOpen(true)}
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-ink shadow-[0_14px_30px_-16px_rgba(23,32,58,0.5)] ring-1 ring-white/70 backdrop-blur-xl outline-none transition hover:bg-white focus-visible:ring-4 focus-visible:ring-primary/35"
          >
            <Bell className="h-5 w-5" strokeWidth={2.4} />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ff7d69] px-1 text-[10px] font-black text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onProfile()}
            aria-label="Profile"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#123b2b] shadow-sm outline-none transition hover:bg-[#e6f4eb] focus-visible:ring-4 focus-visible:ring-white/60"
          >
            <UserRound className="h-5 w-5" strokeWidth={2.4} />
          </button>
        </div>
      </header>

      <div className="no-scrollbar h-full overflow-y-auto overscroll-contain pb-44">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#3fb2f2] via-[#8fd9fb] to-[#d9f6ff] px-6 pb-24 pt-28 text-ink">
          <MeadowBackdrop />
          <div className="relative">
            <p className="text-lg font-extrabold text-[#1d4f7a]">Hello {greetingName},</p>
            <h1 className="mt-4 text-[2.4rem] font-black leading-[1.07] tracking-tight">
              A new chapter.
              <br />A place for you.
            </h1>
            <StartCountdown startDate={starter.startDate} />
            <p className="mt-4 text-base font-semibold text-ink/85">Welcome to the team, {greetingName}.</p>
            <p className="mt-2 text-sm font-bold text-ink/75">
              {starter.jobTitle} <span className="px-1.5 text-meadow-600">·</span> {starter.location}
            </p>
          </div>
        </section>

        <div className="relative -mt-1 flex flex-col gap-3.5 bg-gradient-to-b from-[#e3f6ea] to-[#f4f8ff] px-5 pt-4">
          {shortcuts.length > 0 && (
            <nav aria-label="Shortcuts">
              <ul role="list" className="grid grid-cols-4 gap-2">
                {shortcuts.map((id) => {
                  const Icon = SHORTCUT_ICON[id];
                  const label = SHORTCUTS.find((s) => s.id === id)?.label ?? id;
                  return (
                    <li key={id}>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.94 }}
                        onClick={() => (id === "notifications" ? setNotificationsOpen(true) : onNavigate(SHORTCUT_TAB[id]))}
                        className="flex w-full flex-col items-center gap-1.5 rounded-2xl bg-white/95 px-1 py-3 text-center shadow-[0_12px_30px_-22px_rgba(27,46,34,0.38)] ring-1 ring-[#dcebe1] outline-none focus-visible:ring-4 focus-visible:ring-[#2f9e6a]/35"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e3f6ea] text-[#2e7950]">
                          <Icon className="h-5 w-5" strokeWidth={2.4} />
                        </span>
                        <span className="text-[11px] font-black leading-tight text-[#172a20]">{label}</span>
                      </motion.button>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() => onProfile("home")}
                className="mx-auto mt-1.5 flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold text-[#2e7950] outline-none focus-visible:ring-4 focus-visible:ring-[#2f9e6a]/30"
              >
                <Settings2 className="h-3.5 w-3.5" strokeWidth={2.6} />
                Edit shortcuts
              </button>
            </nav>
          )}

          {cards.recruiter && (
          <section className="rounded-[1.6rem] border border-[#dcebe1] bg-white/95 p-4 shadow-[0_12px_30px_-22px_rgba(27,46,34,0.38)]">
            <div className="flex items-center gap-3">
              <div
                aria-label="Sam Patel profile photo placeholder"
                role="img"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d8efda] text-sm font-black text-[#28583a] ring-2 ring-white"
              >
                SP
              </div>
              <div>
                <h2 className="text-sm font-black text-[#172a20]">Sam Patel</h2>
                <p className="text-xs font-semibold text-[#778078]">Your recruiter</p>
              </div>
            </div>
            <p className="mt-3 text-sm font-medium leading-relaxed text-[#354039]">
              “You’ve got this. I’m here if you need anything before day one.”
            </p>
          </section>
          )}

          {cards.manager && (
          <section className="rounded-[1.6rem] border border-[#dcebe1] bg-white/95 p-4 shadow-[0_12px_30px_-22px_rgba(27,46,34,0.38)]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#647368]">A note from your manager</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-[#26352c]">
              “So glad you’re joining us. I’m here to help you settle in.”
            </p>
            <p className="mt-2 text-xs font-semibold text-[#778078]">{manager?.fullName ?? "Your line manager"} · Line manager</p>
          </section>
          )}

          {cards.office && (
          <section className="overflow-hidden rounded-[1.6rem] border border-[#dcebe1] bg-white/95 shadow-[0_12px_30px_-22px_rgba(27,46,34,0.38)]">
            <div className="flex items-center gap-2 px-4 pb-2 pt-3.5">
              <MapPin className="h-4 w-4 text-[#2f8054]" />
              <h2 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#647368]">Your office</h2>
            </div>
            <p className="px-4 pb-3 text-sm font-bold text-[#26352c]">{address}</p>
            {mapUrl ? (
              <iframe
                title={`Google Map for ${address}`}
                src={mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-28 w-full border-0"
              />
            ) : (
              <div className="flex h-20 items-center justify-center bg-[#e6f8ff] text-[#2f8054]">
                <MapPin className="h-6 w-6" aria-hidden="true" />
                <span className="ml-2 text-xs font-bold">{starter.location}</span>
              </div>
            )}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-4 py-3 text-xs font-extrabold text-[#286c46] outline-none focus-visible:ring-4 focus-visible:ring-[#2f9e6a]/30"
            >
              Open in Google Maps
              <Navigation className="h-4 w-4" />
            </a>
          </section>
          )}

        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[4.5rem] z-20 bg-gradient-to-t from-[#f4f8ff] via-[#f4f8ff]/95 to-transparent px-5 pb-3 pt-7">
        <button
          type="button"
          onClick={onContinue}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#2e7950] px-5 py-3 text-sm font-black text-white shadow-[0_10px_20px_-12px_rgba(18,59,43,0.8)] transition hover:bg-[#246641] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2f9e6a]/35"
        >
          See what happens next
          <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
        </button>
      </div>

      <NotificationSheet
        notifications={notifications}
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        summary={notificationSummary(profile.notifications)}
        hiddenCount={hiddenCount}
        onManage={() => {
          setNotificationsOpen(false);
          onProfile("notifications");
        }}
      />
    </div>
  );
}

const startDateLabel = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Europe/London",
});

/** Whole days from today (local) until an ISO date. Negative once it has passed. */
function daysUntil(isoDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(`${isoDate}T00:00:00`).getTime() - today.getTime()) / 86_400_000);
}

/**
 * Countdown to the starter's first day. The day count depends on "today", so it
 * is filled in after mount; the server renders the date only, at the same size.
 */
function StartCountdown({ startDate }: { startDate: string }) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => setDays(daysUntil(startDate)), [startDate]);

  const dateText = startDateLabel.format(new Date(`${startDate}T12:00:00Z`));
  const big = days === null ? null : days > 1 ? String(days) : days === 1 ? "1" : days === 0 ? "Today" : null;
  const unit = days === null ? "" : days > 1 ? "days" : days === 1 ? "day" : "";
  const headline =
    days === null
      ? "Your first day"
      : days > 1
        ? "until your first day"
        : days === 1
          ? "until your first day. It's tomorrow!"
          : days === 0
            ? "is your first day. Welcome!"
            : `You started ${Math.abs(days)} ${Math.abs(days) === 1 ? "day" : "days"} ago`;

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={days !== null && days > 0 ? `${days} ${unit} until your first day, ${dateText}` : `First day: ${dateText}`}
      className="mt-5 inline-flex items-center gap-3.5 rounded-[1.4rem] bg-white/85 py-2.5 pl-2.5 pr-5 shadow-[0_14px_30px_-16px_rgba(23,32,58,0.5)] ring-1 ring-white/70 backdrop-blur-xl"
    >
      <span className="gold-fill flex h-14 min-w-14 flex-col items-center justify-center rounded-2xl px-2 text-[#5a3a00] shadow-[inset_0_-3px_0_rgba(0,0,0,0.12)]">
        {big ? (
          <>
            <motion.span
              key={big}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
              className={big === "Today" ? "text-sm font-black" : "text-2xl font-black leading-none tabular-nums"}
            >
              {big}
            </motion.span>
            {unit && <span className="text-[10px] font-extrabold uppercase tracking-wide">{unit}</span>}
          </>
        ) : (
          <CalendarDays className="h-6 w-6" strokeWidth={2.4} aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-black leading-tight text-ink">{headline}</span>
        <span className="block text-xs font-bold text-[#1d4f7a]">{dateText}</span>
      </span>
    </div>
  );
}

/**
 * Sky, sun, a cloud and rolling meadow hills, matching the Journey landscape.
 * The front hill uses the page's top colour so the hero blends into the cards below.
 */
function MeadowBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,#fff8c9_0%,rgba(255,248,201,0.45)_45%,rgba(255,248,201,0)_70%)]" />
      <div className="absolute right-10 top-10 h-12 w-12 rounded-full bg-[#ffe27a] shadow-[0_0_40px_10px_rgba(255,226,122,0.55)]" />
      <svg viewBox="0 0 120 44" className="absolute right-[96px] top-[92px] w-28 opacity-90">
        <g fill="#ffffff">
          <circle cx="24" cy="26" r="14" />
          <circle cx="48" cy="18" r="18" />
          <circle cx="74" cy="26" r="13" />
          <rect x="10" y="26" width="78" height="14" rx="7" />
        </g>
      </svg>
      <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-24 w-full">
        <path d="M0 58 C 70 20, 150 30, 220 52 S 340 34, 400 46 L400 120 L0 120 Z" fill="#9be6ae" />
        <path d="M0 78 C 90 50, 180 62, 260 80 S 360 70, 400 74 L400 120 L0 120 Z" fill="#56c283" />
        <g transform="translate(330 52) scale(0.55)">
          <rect x="-3" y="10" width="6" height="22" rx="2" fill="#7a4f2a" />
          <circle cx="0" cy="0" r="22" fill="#2b8a5c" />
          <circle cx="-9" cy="6" r="14" fill="#2b8a5c" />
          <circle cx="10" cy="5" r="15" fill="#2b8a5c" />
        </g>
        <g transform="translate(58 66) scale(0.4)">
          <rect x="-3" y="10" width="6" height="22" rx="2" fill="#7a4f2a" />
          <circle cx="0" cy="0" r="22" fill="#2f9e6a" />
          <circle cx="-9" cy="6" r="14" fill="#2f9e6a" />
          <circle cx="10" cy="5" r="15" fill="#2f9e6a" />
        </g>
        <path d="M0 98 C 100 82, 220 90, 300 100 S 380 94, 400 96 L400 120 L0 120 Z" fill="#e3f6ea" />
      </svg>
    </div>
  );
}

function NotificationSheet({
  notifications,
  open,
  onClose,
  summary,
  hiddenCount,
  onManage,
}: {
  notifications: NotificationItem[];
  open: boolean;
  onClose: () => void;
  summary: string;
  hiddenCount: number;
  onManage: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-end"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close notifications"
            onClick={onClose}
            className="absolute inset-0 bg-[#0b1630]/45 backdrop-blur-[2px]"
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifications-title"
            className="relative w-full max-w-[440px] rounded-t-[2rem] bg-[#f7fbff] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 shadow-[0_-30px_60px_-20px_rgba(11,22,48,0.5)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-ink">Your updates</p>
                <h2 id="notifications-title" className="text-2xl font-black tracking-tight text-ink">Notifications</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-ink outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={onManage}
              className="mt-3 flex w-full items-center gap-2.5 rounded-2xl bg-sky-100 px-3.5 py-2.5 text-left outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
            >
              <Settings2 className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.6} />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-black text-ink">{summary}</span>
                {hiddenCount > 0 && (
                  <span className="block text-[11px] font-semibold text-muted-ink">
                    {hiddenCount} {hiddenCount === 1 ? "update" : "updates"} hidden by your settings
                  </span>
                )}
              </span>
              <span className="text-xs font-black text-primary">Manage</span>
            </button>
            <ul className="no-scrollbar mt-3 max-h-[55dvh] space-y-2 overflow-y-auto">
              {notifications.length ? notifications.map((notification) => (
                <li key={notification.id} className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-ink/5">
                  <div className="flex items-start gap-2.5">
                    {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-ink">{notification.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-ink">{notification.body}</p>
                    </div>
                  </div>
                </li>
              )) : (
                <li className="rounded-2xl bg-white p-4 text-sm font-semibold text-muted-ink">You’re all caught up.</li>
              )}
            </ul>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
