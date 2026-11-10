"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BottomNav, type TabId } from "@/components/launchpad/bottom-nav";
import { JourneyScreen } from "@/components/journey/journey-screen";
import { TasksScreen } from "@/components/tasks/tasks-screen";
import { ToolsScreen } from "@/components/tools/tools-screen";
import { BuddyScreen } from "@/components/buddy/buddy-screen";
import { RoleSwitcher } from "@/components/role-switcher";
import { HomeScreen } from "@/components/launchpad/home-screen";
import { useUserRole } from "@/context/user-role";
import { ProfileScreen, type ProfileSection } from "@/components/profile/profile-screen";

export default function Home() {
  const { role, persona } = useUserRole();
  const [tab, setTab] = useState<TabId>("home");
  const [profileSection, setProfileSection] = useState<ProfileSection>("overview");

  function openProfile(section: ProfileSection = "overview") {
    setProfileSection(section);
    setTab("profile");
  }
  const [celebrateJourney, setCelebrateJourney] = useState(false);
  const finishJourneyCelebration = useCallback(() => setCelebrateJourney(false), []);

  function continueToJourney() {
    setCelebrateJourney(false);
    // The first-visit celebration belongs to the new starter. Other roles
    // previewing the app shouldn't trigger it or use it up.
    if (role === "new-starter") {
      const key = `launchpad.journeyCelebrated.${persona.id}.v1`;
      try {
        if (!window.localStorage.getItem(key)) {
          window.localStorage.setItem(key, "true");
          setCelebrateJourney(true);
        }
      } catch {
        setCelebrateJourney(true);
      }
    }
    setTab("journey");
  }

  function changeTab(nextTab: TabId) {
    if (tab === "journey" && nextTab !== "journey") setCelebrateJourney(false);
    setTab(nextTab);
  }

  return (
    <main className="flex min-h-dvh w-full items-stretch justify-center bg-[#0e1a33] sm:items-center sm:py-8">
      <div className="relative h-dvh w-full max-w-[440px] overflow-hidden bg-[#8fd9fb] sm:h-[860px] sm:rounded-[2.5rem] sm:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)] sm:ring-8 sm:ring-[#1b2a4a]">
        <AnimatePresence mode="wait">
          <motion.div
            key="app"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {tab === "home" ? (
              <HomeScreen onContinue={continueToJourney} onProfile={openProfile} onNavigate={changeTab} />
            ) : tab === "journey" ? (
              <JourneyScreen
                celebrateOnEntry={celebrateJourney}
                onCelebrationComplete={finishJourneyCelebration}
              />
            ) : tab === "tasks" ? (
              <TasksScreen />
            ) : tab === "tools" ? (
              <ToolsScreen />
            ) : tab === "buddy" ? (
              <BuddyScreen />
            ) : (
              <ProfileScreen initialSection={profileSection} onBackHome={() => setTab("home")} />
            )}
            {tab !== "home" && (
              <div className="absolute inset-x-0 top-0 z-40 px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
                <RoleSwitcher />
              </div>
            )}
            <BottomNav active={tab} onChange={changeTab} />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
