"use client";

import { useCallback, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  Coffee,
  Hand,
  MapPin,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Timer,
} from "lucide-react";
import {
  getBuddyDashboard,
  getBuddyDashboardsForStarter,
  getChatMessages,
  getManagerDashboard,
  getPersonaById,
  getRoleDefinition,
  type BuddyDashboard,
  type Persona,
} from "@/data/mock";
import type { ChatMessage, CoffeeMeeting, StarterProfileSummary, SuggestedActivity } from "@/types";
import { useUserRole } from "@/context/user-role";
import { PersonaAvatar } from "@/components/role-switcher";
import { cn } from "@/lib/utils";
import { BuddyChatSheet, ChatBubbleButton } from "./buddy-chat";

/* ---------- Formatting ---------- */

const TZ = "Europe/London";
const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: TZ });
const weekdayDayMonth = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: TZ });
const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
const monthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: TZ });

/** Whole days from today until an ISO date (yyyy-mm-dd). Negative once passed. */
function daysUntil(isoDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${isoDate}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function countdownLabel(isoDate: string): string {
  const days = daysUntil(isoDate);
  if (days > 1) return `Starts in ${days} days`;
  if (days === 1) return "Starts tomorrow";
  if (days === 0) return "Starts today";
  return `Started ${dayMonth.format(new Date(isoDate))}`;
}

function personasFor(ids: string[]): Persona[] {
  return ids.map((id) => getPersonaById(id)).filter((p): p is Persona => Boolean(p));
}

function sharedInterests(a: string[], b: string[]): string[] {
  const lower = new Set(b.map((i) => i.toLowerCase()));
  return a.filter((i) => lower.has(i.toLowerCase()));
}

/* ---------- Building blocks ---------- */

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "rounded-[1.75rem] bg-white p-4 shadow-[0_18px_40px_-24px_rgba(23,32,58,0.45)] ring-1 ring-ink/5",
        className,
      )}
    >
      {children}
    </section>
  );
}

function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-ink">
      {icon}
      {children}
    </h3>
  );
}

function Chip({ children, highlight = false }: { children: ReactNode; highlight?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-extrabold",
        highlight ? "bg-gold-200 text-[#7a4f00]" : "bg-sky-100 text-ink",
      )}
    >
      {children}
    </span>
  );
}

function ScreenHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-start gap-3 px-1">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-ink">{eyebrow}</p>
        <h2 className="text-2xl font-black leading-tight tracking-tight text-ink">{title}</h2>
        <p className="mt-1 text-sm font-semibold text-muted-ink">{subtitle}</p>
      </div>
      {action}
    </header>
  );
}

/** A button that flips to a confirmed state once tapped. Demo only, nothing is sent. */
function ActionButton({
  icon,
  label,
  doneLabel,
  variant = "primary",
}: {
  icon: ReactNode;
  label: string;
  doneLabel: string;
  variant?: "primary" | "soft";
}) {
  const [done, setDone] = useState(false);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={() => setDone(true)}
      disabled={done}
      aria-live="polite"
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-black transition-colors outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
        done
          ? "bg-meadow-400/15 text-meadow-600"
          : variant === "primary"
            ? "bg-primary text-white"
            : "bg-ink/5 text-ink hover:bg-ink/10",
      )}
    >
      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : icon}
      {done ? doneLabel : label}
    </motion.button>
  );
}

/* ---------- Sections ---------- */

function StarterCard({ profile, viewerInterests }: { profile: StarterProfileSummary; viewerInterests: string[] }) {
  const common = sharedInterests(profile.interests, viewerInterests);
  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <Card>
      <div className="flex items-center gap-3.5">
        <PersonaAvatar initials={initials} role="new-starter" size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-black leading-tight text-ink">{profile.fullName}</p>
          <p className="truncate text-xs font-semibold text-muted-ink">
            {profile.jobTitle} · {profile.team}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-muted-ink">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2.6} />
            {profile.location}
          </p>
        </div>
      </div>
      <div className="mt-3.5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6f66ff] to-[#2f2bff] px-3.5 py-2.5 text-white">
        <CalendarDays className="h-4 w-4 shrink-0" strokeWidth={2.6} />
        <span className="text-sm font-black">{countdownLabel(profile.startDate)}</span>
        <span className="ml-auto text-xs font-bold text-white/80">Day one {dayMonth.format(new Date(profile.startDate))}</span>
      </div>
      <div className="mt-3.5">
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-ink">Interests</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map((interest) => (
            <Chip key={interest} highlight={common.includes(interest)}>
              {interest}
            </Chip>
          ))}
        </div>
        {common.length > 0 && (
          <p className="mt-2 text-xs font-bold text-[#7a4f00]">
            You both like {common.join(" and ").toLowerCase()}. An easy way in.
          </p>
        )}
      </div>
    </Card>
  );
}

function CoffeeCard({ meeting, withName }: { meeting: CoffeeMeeting | null; withName: string }) {
  return (
    <Card>
      <SectionTitle icon={<Coffee className="h-4 w-4" strokeWidth={2.6} />}>Coffee chat</SectionTitle>
      {meeting ? (
        <div className="flex items-start gap-3">
          <div className="flex w-14 shrink-0 flex-col items-center rounded-2xl bg-gold-200 py-2 text-[#7a4f00]">
            <span className="text-[10px] font-extrabold uppercase">
              {new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: TZ }).format(new Date(meeting.when))}
            </span>
            <span className="text-xl font-black leading-none">
              {new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: TZ }).format(new Date(meeting.when))}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-black text-ink">With {withName}</p>
            <p className="text-xs font-semibold text-muted-ink">
              {weekdayDayMonth.format(new Date(meeting.when))} · {time.format(new Date(meeting.when))}
            </p>
            <p className="text-xs font-semibold text-muted-ink">{meeting.location}</p>
            <p className="mt-1.5 text-xs font-bold text-ink">“{meeting.topic}”</p>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-[15px] font-black text-ink">Nothing booked yet</p>
          <p className="mb-3 text-xs font-semibold text-muted-ink">
            A relaxed 30 minutes before day one helps {withName} feel at home.
          </p>
          <div className="flex">
            <ActionButton icon={<Coffee className="h-4 w-4" strokeWidth={2.6} />} label="Book a coffee chat" doneLabel="Invite sent" />
          </div>
        </div>
      )}
    </Card>
  );
}

function ConversationStarters({ items }: { items: string[] }) {
  const [index, setIndex] = useState(0);
  if (items.length === 0) return null;
  return (
    <Card>
      <div className="flex items-center justify-between">
        <SectionTitle icon={<MessageCircle className="h-4 w-4" strokeWidth={2.6} />}>Conversation starters</SectionTitle>
        <span className="mb-3 text-[11px] font-extrabold tabular-nums text-muted-ink">
          {index + 1}/{items.length}
        </span>
      </div>
      <div className="relative min-h-[76px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
            className="rounded-2xl bg-sky-100 px-4 py-3.5 text-[15px] font-bold leading-snug text-ink"
          >
            {items[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={() => setIndex((i) => (i + 1) % items.length)}
        className="mt-3 flex items-center gap-1.5 rounded-full bg-ink/5 px-3.5 py-2 text-xs font-black text-ink outline-none hover:bg-ink/10 focus-visible:ring-4 focus-visible:ring-primary/30"
      >
        <RefreshCw className="h-3.5 w-3.5" strokeWidth={3} />
        Another one
      </button>
    </Card>
  );
}

function ActivityList({ items }: { items: SuggestedActivity[] }) {
  const [done, setDone] = useState<Set<string>>(() => new Set());
  if (items.length === 0) return null;
  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  return (
    <Card>
      <div className="flex items-center justify-between">
        <SectionTitle icon={<Sparkles className="h-4 w-4" strokeWidth={2.6} />}>Ideas to try</SectionTitle>
        <span className="mb-3 text-[11px] font-extrabold tabular-nums text-muted-ink">
          {done.size}/{items.length} done
        </span>
      </div>
      <ul role="list" className="flex flex-col gap-2">
        {items.map((activity) => {
          const isDone = done.has(activity.id);
          return (
            <li key={activity.id}>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                aria-pressed={isDone}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-colors outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
                  isDone ? "bg-meadow-400/10" : "bg-[#f4f8ff] hover:bg-[#eaf1ff]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                    isDone ? "border-meadow-600 bg-meadow-600 text-white" : "border-ink/20 bg-white",
                  )}
                >
                  {isDone && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-sm font-black text-ink", isDone && "line-through decoration-2 opacity-60")}>
                    {activity.title}
                  </span>
                  <span className="block text-xs font-semibold text-muted-ink">{activity.detail}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-[11px] font-extrabold text-muted-ink">
                  <Timer className="h-3.5 w-3.5" strokeWidth={2.6} />
                  {activity.duration}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ---------- Role views ---------- */

type ViewProps = { persona: Persona; onOpenChat: (contacts: Persona[]) => void };

/** Team buddy or job family buddy: everything needed to help the starter settle in. */
function BuddyView({ persona, onOpenChat }: ViewProps) {
  const dashboard = getBuddyDashboard(persona.id);
  if (!dashboard) return <EmptyState message="You haven't been matched with a starter yet." />;
  const starter = dashboard.starterProfile;
  const isTeamBuddy = persona.role === "team-buddy";
  return (
    <>
      <ScreenHeader
        eyebrow={getRoleDefinition(persona.role).label}
        title={isTeamBuddy ? `Help ${starter.firstName} settle in` : `Share your know-how with ${starter.firstName}`}
        subtitle={
          isTeamBuddy
            ? `You're ${starter.firstName}'s go-to person in ${starter.team}.`
            : `You joined recently, so you know what the first months feel like.`
        }
        action={
          <ChatBubbleButton
            label={`Chat with ${starter.firstName}`}
            onClick={() => onOpenChat(personasFor([starter.personaId]))}
          />
        }
      />
      <StarterCard profile={starter} viewerInterests={persona.interests} />
      <CoffeeCard meeting={dashboard.upcomingCoffee} withName={starter.firstName} />
      <ConversationStarters items={dashboard.conversationSuggestions} />
      <ActivityList items={dashboard.suggestedActivities} />
    </>
  );
}

function buddyIntro(buddy: Persona, starter: Persona): string {
  if (buddy.role === "team-buddy") {
    const manager = starter.role === "new-starter" ? getPersonaById(starter.managerId) : undefined;
    return `${manager ? `Picked by ${manager.firstName}` : "Chosen by your manager"} to help you settle into ${buddy.team}.`;
  }
  if (buddy.role === "job-family-buddy") {
    return `Also a ${buddy.jobTitle}. Joined in ${monthYear.format(new Date(buddy.joinedOn))}, so the first months are fresh in their mind.`;
  }
  return "";
}

/** New starter: meet the two people helping them in. */
function StarterView({ persona, onOpenChat }: ViewProps) {
  const dashboards = getBuddyDashboardsForStarter(persona.id);
  return (
    <>
      <ScreenHeader
        eyebrow="Your buddies"
        title={`You've got ${dashboards.length === 1 ? "a buddy" : `${dashboards.length} buddies`}, ${persona.firstName}`}
        subtitle="One knows your team, one knows your role. Say hello before day one."
        action={
          <ChatBubbleButton
            label="Chat with your buddies"
            onClick={() => onOpenChat(personasFor(dashboards.map((d) => d.buddyId)))}
          />
        }
      />
      {dashboards.length === 0 && <EmptyState message="Your buddies will appear here once your manager assigns them." />}
      {dashboards.map((d) => {
        const buddy = getPersonaById(d.buddyId);
        if (!buddy) return null;
        const common = sharedInterests(buddy.interests, persona.interests);
        return (
          <Card key={d.buddyId}>
            <div className="flex items-center gap-3.5">
              <PersonaAvatar initials={buddy.initials} role={buddy.role} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-ink">
                  {getRoleDefinition(buddy.role).label}
                </p>
                <p className="truncate text-lg font-black leading-tight text-ink">{buddy.fullName}</p>
                <p className="truncate text-xs font-semibold text-muted-ink">{buddy.jobTitle}</p>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold leading-snug text-ink">{buddyIntro(buddy, persona)}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {buddy.interests.map((interest) => (
                <Chip key={interest} highlight={common.includes(interest)}>
                  {interest}
                </Chip>
              ))}
            </div>
            {d.upcomingCoffee && (
              <p className="mt-3 flex items-center gap-2 rounded-2xl bg-gold-200/70 px-3 py-2 text-xs font-bold text-[#7a4f00]">
                <Coffee className="h-4 w-4 shrink-0" strokeWidth={2.6} />
                Coffee on {weekdayDayMonth.format(new Date(d.upcomingCoffee.when))} at{" "}
                {time.format(new Date(d.upcomingCoffee.when))}, {d.upcomingCoffee.location}
              </p>
            )}
            <div className="mt-3.5 flex gap-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenChat([buddy])}
                aria-label={`Say hello to ${buddy.firstName}`}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-black outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
                  d.upcomingCoffee ? "bg-primary text-white" : "bg-ink/5 text-ink hover:bg-ink/10",
                )}
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.6} />
                Say Hello
              </motion.button>
              {!d.upcomingCoffee && (
                <ActionButton icon={<Coffee className="h-4 w-4" strokeWidth={2.6} />} label="Book coffee" doneLabel="Requested" />
              )}
            </div>
          </Card>
        );
      })}
    </>
  );
}

/** Line manager: who is buddying the starter and whether they have connected yet. */
function ManagerView({ persona, onOpenChat }: ViewProps) {
  const managerDashboard = getManagerDashboard(persona.id);
  const starter = managerDashboard ? getPersonaById(managerDashboard.starterId) : undefined;
  if (!managerDashboard || !starter) return <EmptyState message="No new starters to buddy up right now." />;
  const dashboards: BuddyDashboard[] = getBuddyDashboardsForStarter(starter.id);
  const connected = dashboards.filter((d) => d.upcomingCoffee).length;

  return (
    <>
      <ScreenHeader
        eyebrow="Buddy overview"
        title={`${starter.firstName}'s buddies`}
        subtitle={`${connected} of ${dashboards.length} buddies have a coffee booked with ${starter.firstName}.`}
        action={
          <ChatBubbleButton
            label={`Chat with ${starter.firstName}'s buddies`}
            onClick={() => onOpenChat(personasFor(dashboards.map((d) => d.buddyId)))}
          />
        }
      />
      {dashboards.map((d) => {
        const buddy = getPersonaById(d.buddyId);
        if (!buddy) return null;
        return (
          <Card key={d.buddyId}>
            <div className="flex items-center gap-3">
              <PersonaAvatar initials={buddy.initials} role={buddy.role} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-black text-ink">{buddy.fullName}</p>
                <p className="truncate text-xs font-semibold text-muted-ink">{getRoleDefinition(buddy.role).label}</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-meadow-400/15 px-2.5 py-1 text-[11px] font-extrabold text-meadow-600">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                Assigned
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-[#f4f8ff] p-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-ink">Coffee chat</p>
                <p className={cn("text-sm font-black", d.upcomingCoffee ? "text-ink" : "text-coral")}>
                  {d.upcomingCoffee ? dayMonth.format(new Date(d.upcomingCoffee.when)) : "Not booked"}
                </p>
              </div>
              <div className="rounded-2xl bg-[#f4f8ff] p-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-ink">Ideas planned</p>
                <p className="text-sm font-black text-ink">{d.suggestedActivities.length}</p>
              </div>
            </div>
            {!d.upcomingCoffee && (
              <div className="mt-3 flex">
                <ActionButton
                  icon={<Hand className="h-4 w-4" strokeWidth={2.6} />}
                  label={`Nudge ${buddy.firstName} to book a coffee`}
                  doneLabel={`${buddy.firstName} nudged`}
                  variant="soft"
                />
              </div>
            )}
          </Card>
        );
      })}
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="text-center">
      <p className="text-sm font-semibold text-muted-ink">{message}</p>
    </Card>
  );
}

/* ---------- Screen ---------- */

export function BuddyScreen() {
  const { role, persona } = useUserRole();
  // Chat lives here so messages persist across role switches (in memory only).
  const [messages, setMessages] = useState<ChatMessage[]>(getChatMessages);
  const [chatContacts, setChatContacts] = useState<Persona[]>([]);
  const [chatOpen, setChatOpen] = useState(false);

  const openChat = useCallback((contacts: Persona[]) => {
    setChatContacts(contacts);
    setChatOpen(true);
  }, []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  function send(recipientId: string, body: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}-${prev.length}`,
        senderId: persona.id,
        recipientId,
        body,
        sentAt: new Date().toISOString(),
      },
    ]);
  }

  return (
    <div className="relative h-full">
      <div className="no-scrollbar h-full overflow-y-auto overscroll-contain bg-gradient-to-b from-[#e6f8ff] to-[#f4f8ff]">
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-3.5 px-4 pb-36 pt-[88px]"
          >
            {role === "new-starter" ? (
              <StarterView persona={persona} onOpenChat={openChat} />
            ) : role === "line-manager" ? (
              <ManagerView persona={persona} onOpenChat={openChat} />
            ) : (
              <BuddyView persona={persona} onOpenChat={openChat} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <BuddyChatSheet
        open={chatOpen}
        onClose={closeChat}
        viewer={persona}
        contacts={chatContacts}
        messages={messages}
        onSend={send}
      />
    </div>
  );
}
