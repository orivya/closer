import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NavRail } from "@/components/layout/NavRail";
import { ExploreHeader } from "@/components/explore/ExploreHeader";
import { InsightsSection } from "@/components/explore/InsightsSection";
import { ThreadsSection } from "@/components/explore/ThreadsSection";
import { ConnectionsSection } from "@/components/explore/ConnectionsSection";
import { UnexploredSection } from "@/components/explore/UnexploredSection";
import { PatternsSection } from "@/components/explore/PatternsSection";
import { MobileNav } from "@/components/chat/MobileNav";

// Mock data
const insights = [
  {
    id: "1",
    text: "You've mentioned time constraints 8 times but haven't explored what's actually consuming your time or whether it's negotiable.",
    highlight: "time constraints 8 times",
    highlightText: "time constraints 8 times",
  },
  {
    id: "2",
    text: "A pattern is emerging: you defer to others before acting on your own instincts. This has appeared in 4 sessions.",
    highlight: "defer to others before acting on your own instincts",
    highlightText: "defer to others before acting on your own instincts",
  },
  {
    id: "3",
    text: "You talk about freedom frequently but haven't defined what that actually means to you in concrete terms.",
    highlight: "freedom",
    highlightText: "freedom",
  },
];

const threads = [
  { id: "1", text: "What would change if you had half the responsibilities you currently have?" },
  { id: "2", text: "What does 'enough' actually look like to you? When would you know you've arrived?" },
  { id: "3", text: "What are you afraid would happen if you actually tried? What's the realistic worst case?" },
  { id: "4", text: "If your manager said yes to flexibility tomorrow, what would you do first?" },
  { id: "5", text: "Who has made a transition like the one you want? What can you learn from them?" },
  { id: "6", text: "You mentioned your parents' career paths. How does that influence your own choices?" },
];

const connection = {
  nodes: ["Time consumed by work", "Waiting for certainty", "Deferring to others"],
  observation:
    "These patterns share a common thread: you may be treating negotiable constraints as fixed. The time issue, the certainty seeking, and the deferring pattern all suggest decisions are being delayed until external conditions change — but those conditions might already be more flexible than assumed.",
};

const unexploredItems = [
  {
    id: "1",
    text: "Your relationship with risk — you mention avoiding it but haven't explored why",
    topic: "Your relationship with risk",
  },
  {
    id: "2",
    text: "What success actually represents to you beyond external markers",
    topic: "What success means to you",
  },
  {
    id: "3",
    text: "What you'd do if everything worked out — you've never discussed the upside",
    topic: "If everything worked out",
  },
];

const activePatterns = [
  { id: "time-constraint", title: "Time consumed by primary work", type: "constraint" as const, typeLabel: "Constraint", meta: "8 sessions · First seen Feb 12" },
  { id: "certainty", title: "Seeking certainty before acting", type: "blindspot" as const, typeLabel: "Observation", meta: "6 sessions · First seen Feb 15" },
  { id: "deferring", title: "Deferring to others before acting", type: "blindspot" as const, typeLabel: "Observation", meta: "4 sessions · Surfaced Feb 25" },
  { id: "skills", title: "Strong analytical and problem-solving skills", type: "resource" as const, typeLabel: "Resource", meta: "5 sessions · First seen Feb 20" },
  { id: "self-trust", title: "Building self-trust → Acting on instincts", type: "shift" as const, typeLabel: "Shift", meta: "3 sessions · Currently active" },
];

const exploredPatterns = [
  { id: "network", title: "Network of supportive people", type: "resource" as const, typeLabel: "Resource", meta: "Explored Mar 10" },
  { id: "energy", title: "Energy depleted by evening", type: "constraint" as const, typeLabel: "Constraint", meta: "Explored Mar 8" },
];

const closedPatterns = [
  { id: "team", title: "Whether team would support changes", type: "blindspot" as const, typeLabel: "Observation", meta: 'Closed Mar 10 — "Team was supportive"' },
];

export default function Explore() {
  const navigate = useNavigate();

  const handleExploreInChat = (topic: string) => {
    toast.success("Opening in chat...");
    setTimeout(() => {
      navigate(`/chat?explore=${encodeURIComponent(topic)}`);
    }, 500);
  };

  const handleStartThread = (topic: string) => {
    toast.success("Starting conversation...");
    setTimeout(() => {
      navigate(`/chat?thread=${encodeURIComponent(topic)}`);
    }, 500);
  };

  const handleSaveInsight = (id: string) => {
    toast.success("Saved to Library");
  };

  const handlePatternClick = (id: string) => {
    toast.success("Opening in Library...");
    setTimeout(() => {
      navigate(`/library#pattern-${id}`);
    }, 500);
  };

  return (
    <div className="flex h-screen bg-background">
      <NavRail />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden max-xs:pb-16">
        <ExploreHeader
          title="Explore"
          subtitle="Review what's surfacing and prioritize what matters"
        />

        <div className="flex-1 overflow-y-auto p-8 max-md:p-5 max-xs:p-4">
          <div className="max-w-[900px] mx-auto">
            <InsightsSection
              insights={insights}
              onExplore={handleExploreInChat}
              onSave={handleSaveInsight}
            />

            <ThreadsSection
              threads={threads}
              onStartThread={handleStartThread}
            />

            <ConnectionsSection
              connection={connection}
              onExplore={() => handleExploreInChat("connection between patterns")}
              onSave={() => {}}
            />

            <UnexploredSection
              items={unexploredItems}
              onExplore={handleStartThread}
            />

            <PatternsSection
              activePatterns={activePatterns}
              exploredPatterns={exploredPatterns}
              closedPatterns={closedPatterns}
              onPatternClick={handlePatternClick}
            />
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
