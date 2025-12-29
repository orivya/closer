import { useAuth } from "@/hooks/useAuth";
import { NavRail } from "@/components/layout/NavRail";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { ThemesSection } from "@/components/profile/ThemesSection";
import { JourneySection } from "@/components/profile/JourneySection";
import { MobileNav } from "@/components/chat/MobileNav";

// Mock data
const stats = [
  { value: 42, label: "Sessions" },
  { value: 127, label: "Insights" },
  { value: 8, label: "Decisions" },
  { value: 15, label: "Patterns" },
];

const themes = [
  { name: "Work", count: 28 },
  { name: "Decisions", count: 19 },
  { name: "Self", count: 15 },
  { name: "Relationships", count: 12 },
  { name: "Growth", count: 9 },
];

const journeyItems = [
  {
    date: "Dec 4",
    title: "Insight: Treating constraints as fixed",
    description: "Recognized a pattern of not testing assumptions about limitations",
  },
  {
    date: "Dec 1",
    title: "Decision started: Should I take the new role?",
    description: "Weighing career growth against current stability",
  },
  {
    date: "Nov 28",
    title: "Decision resolved: Whether to relocate",
    description: "Chose to stay for now based on family priorities",
  },
  {
    date: "Nov 22",
    title: "Turning point: Waiting for permission",
    description: "Realized the pattern and chose to act on own terms",
  },
];

export default function Profile() {
  const { user } = useAuth();
  
  const userName = user?.email?.split("@")[0] || "Your Name";
  const userEmail = user?.email || "you@example.com";
  const joinedDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "November 2025";

  return (
    <div className="flex h-screen bg-background">
      <NavRail />

      <main className="flex-1 flex flex-col overflow-hidden max-xs:pb-16">
        <ProfileHeader onEdit={() => {}} />

        <div className="flex-1 overflow-y-auto p-8 max-md:p-6 max-xs:p-4">
          <div className="max-w-[800px] mx-auto">
            <ProfileHero
              name={userName}
              email={userEmail}
              joinedDate={joinedDate}
            />

            <StatsGrid stats={stats} />

            <ThemesSection themes={themes} />

            <JourneySection items={journeyItems} />
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
