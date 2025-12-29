import { useState, useMemo } from "react";
import { toast } from "sonner";
import { NavRail } from "@/components/layout/NavRail";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { QuickAddSection } from "@/components/library/QuickAddSection";
import { LibrarySection } from "@/components/library/LibrarySection";
import { AddNoteModal } from "@/components/library/AddNoteModal";
import { EmptyState } from "@/components/library/EmptyState";
import { MobileNav } from "@/components/chat/MobileNav";
import { LibraryItem } from "@/components/library/LibraryItemCard";

// Mock data
const mockItems: LibraryItem[] = [
  {
    id: "insight-1",
    type: "insight",
    title: "Thoroughness can be both a strength and a form of hesitation",
    preview: "You consider multiple perspectives carefully, but this can sometimes delay action.",
    date: "Dec 3",
    category: "Self",
    starred: true,
  },
  {
    id: "decision-1",
    type: "decision",
    title: "Should I take the new role?",
    preview: "Weighing career growth against current stability and work-life balance.",
    date: "Dec 1",
    category: "Work",
    starred: true,
    status: "open",
  },
  {
    id: "note-1",
    type: "note",
    title: "What I want my life to look like in 5 years",
    preview: "Freedom to work from anywhere, meaningful projects, strong relationships...",
    date: "Nov 28",
    category: "Growth",
    starred: true,
  },
  {
    id: "insight-2",
    type: "insight",
    title: "You may be treating negotiable constraints as fixed",
    preview: "The time issue, manager assumptions, and waiting pattern all suggest flexibility you haven't tested.",
    date: "Dec 4",
    category: "Work",
    starred: false,
  },
  {
    id: "insight-3",
    type: "insight",
    title: "You defer to others before acting on your own instincts",
    preview: "This pattern has appeared across 4 sessions when discussing major decisions.",
    date: "Dec 2",
    category: "Self",
    starred: false,
  },
  {
    id: "insight-4",
    type: "insight",
    title: "Freedom means something specific to you that you haven't defined",
    preview: "You talk about freedom frequently but in abstract terms—concrete definition might help.",
    date: "Nov 30",
    category: "Self",
    starred: false,
  },
  {
    id: "decision-2",
    type: "decision",
    title: "Whether to relocate",
    preview: "Decided: Stay for now. Family ties and current opportunity outweigh adventure.",
    date: "Nov 28",
    category: "Life",
    starred: false,
    status: "resolved",
  },
  {
    id: "pattern-1",
    type: "pattern",
    title: "Seeking certainty before acting",
    preview: "Emerged across 6 conversations. Connected to perfectionism and fear of regret.",
    date: "Dec 1",
    category: "Self",
    starred: false,
  },
  {
    id: "pattern-2",
    type: "pattern",
    title: "Building self-trust",
    preview: "Consistent theme when discussing personal growth and decision-making confidence.",
    date: "Nov 27",
    category: "Growth",
    starred: false,
  },
];

type FilterType = "all" | "insights" | "decisions" | "patterns" | "notes";

export default function Library() {
  const [items, setItems] = useState<LibraryItem[]>(mockItems);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  const stats = useMemo(() => ({
    total: items.length,
    insights: items.filter(i => i.type === "insight").length,
    decisions: items.filter(i => i.type === "decision").length,
    notes: items.filter(i => i.type === "note").length,
    weeklyGrowth: 3,
  }), [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Type filter
      if (activeFilter !== "all") {
        const typeToMatch = activeFilter.slice(0, -1); // Remove 's' from end
        if (item.type !== typeToMatch) {
          return false;
        }
      }
      // Category filter
      if (categoryFilter && item.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.preview.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [items, activeFilter, categoryFilter, searchQuery]);

  const starredItems = filteredItems.filter(i => i.starred);
  const insightItems = filteredItems.filter(i => i.type === "insight" && !i.starred);
  const decisionItems = filteredItems.filter(i => i.type === "decision" && !i.starred);
  const patternItems = filteredItems.filter(i => i.type === "pattern" && !i.starred);
  const noteItems = filteredItems.filter(i => i.type === "note" && !i.starred);

  const handleToggleStar = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, starred: !item.starred } : item
    ));
    const item = items.find(i => i.id === id);
    toast.success(item?.starred ? "Removed from starred" : "Added to starred");
  };

  const handleItemClick = (id: string) => {
    toast.info("Opening item details...");
  };

  const handleItemAction = (action: string, id: string) => {
    switch (action) {
      case "explore":
        toast.info("Opening in Explore...");
        break;
      case "create-card":
        toast.success("Card created");
        break;
      case "view-brief":
        toast.info("Opening decision brief...");
        break;
      case "continue":
        toast.info("Continuing decision...");
        break;
      case "revisit":
        toast.info("Reopening decision...");
        break;
    }
  };

  const handleSaveNote = (note: { title: string; content: string; category: string }) => {
    const newNote: LibraryItem = {
      id: `note-${Date.now()}`,
      type: "note",
      title: note.title || "Untitled Note",
      preview: note.content,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      category: note.category || undefined,
      starred: false,
    };
    setItems(prev => [newNote, ...prev]);
    toast.success("Note saved to Library");
  };

  const handleNewDecision = () => {
    toast.info("Starting decision tracker...");
  };

  const hasContent = filteredItems.length > 0;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Navigation Rail */}
      <NavRail />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden max-xs:pb-16">
        <LibraryHeader
          stats={stats}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onNewNote={() => setNoteModalOpen(true)}
        />

        <div className="flex-1 overflow-y-auto p-8 max-md:p-4">
          <div className="max-w-[1000px] mx-auto">
            {/* Quick Add */}
            <QuickAddSection 
              onNewNote={() => setNoteModalOpen(true)} 
              onNewDecision={handleNewDecision} 
            />

            {hasContent ? (
              <>
                {/* Starred */}
                <LibrarySection
                  title="Starred"
                  count={starredItems.length}
                  items={starredItems}
                  showStar
                  onToggleStar={handleToggleStar}
                  onItemClick={handleItemClick}
                  onItemAction={handleItemAction}
                />

                {/* Recent Insights */}
                <LibrarySection
                  title="Recent Insights"
                  count={insightItems.length}
                  items={insightItems.slice(0, 3)}
                  actionLabel={insightItems.length > 3 ? "View all" : undefined}
                  onAction={() => setActiveFilter("insights")}
                  onToggleStar={handleToggleStar}
                  onItemClick={handleItemClick}
                  onItemAction={handleItemAction}
                />

                {/* Decisions */}
                <LibrarySection
                  title="Decisions"
                  count={decisionItems.length}
                  items={decisionItems}
                  actionLabel="+ New decision"
                  onAction={handleNewDecision}
                  onToggleStar={handleToggleStar}
                  onItemClick={handleItemClick}
                  onItemAction={handleItemAction}
                />

                {/* Patterns */}
                <LibrarySection
                  title="Patterns"
                  count={patternItems.length}
                  items={patternItems}
                  actionLabel="Explore all"
                  onAction={() => {}}
                  onToggleStar={handleToggleStar}
                  onItemClick={handleItemClick}
                  onItemAction={handleItemAction}
                />

                {/* Notes */}
                {noteItems.length > 0 && (
                  <LibrarySection
                    title="Notes"
                    count={noteItems.length}
                    items={noteItems}
                    onToggleStar={handleToggleStar}
                    onItemClick={handleItemClick}
                    onItemAction={handleItemAction}
                  />
                )}
              </>
            ) : (
              <EmptyState
                title="No items found"
                description={searchQuery 
                  ? "No items match your search. Try a different query."
                  : "No items saved yet. As you chat, save moments that resonate."
                }
                actionLabel={!searchQuery ? "Start a conversation" : undefined}
                onAction={() => window.location.href = "/chat"}
              />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <MobileNav />

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
}
