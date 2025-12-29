import { Edit3, ArrowDownCircle, MessageSquare, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickAddSectionProps {
  onNewNote: () => void;
  onNewDecision: () => void;
}

export function QuickAddSection({ onNewNote, onNewDecision }: QuickAddSectionProps) {
  const navigate = useNavigate();

  const actions = [
    { icon: Edit3, label: "Write Note", onClick: onNewNote },
    { icon: ArrowDownCircle, label: "Track Decision", onClick: onNewDecision },
    { icon: MessageSquare, label: "New Session", onClick: () => navigate("/chat") },
    { icon: Compass, label: "Explore Patterns", onClick: () => navigate("/explore") },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-8 max-sm:grid-cols-2">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="flex items-center justify-center gap-3 px-4 py-4 bg-elevated border border-dashed border-border rounded-md text-[13px] text-text-muted hover:border-sage-muted hover:text-sage hover:bg-sage-subtle hover:border-solid hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 active:translate-y-0 active:shadow-none"
        >
          <action.icon className="w-4 h-4" strokeWidth={1.5} />
          {action.label}
        </button>
      ))}
    </div>
  );
}
