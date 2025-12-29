import { FileText } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="p-8 bg-elevated border border-dashed border-border rounded-lg text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
        <FileText className="w-6 h-6 text-text-muted" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-sage rounded-sm text-[13px] font-medium text-white hover:bg-sage-light transition-all duration-150"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
