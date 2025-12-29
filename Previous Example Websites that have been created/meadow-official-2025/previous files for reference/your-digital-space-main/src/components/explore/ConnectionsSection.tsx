import { toast } from "sonner";

interface Connection {
  nodes: string[];
  observation: string;
}

interface ConnectionsSectionProps {
  connection: Connection;
  onExplore: () => void;
  onSave: () => void;
}

export function ConnectionsSection({ connection, onExplore, onSave }: ConnectionsSectionProps) {
  const handleSave = () => {
    onSave();
    toast.success("Saved to Library");
  };

  return (
    <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.3px] text-tertiary">
          Connections
        </span>
      </div>
      <p className="text-[13px] text-tertiary mb-4">
        Patterns that might be related
      </p>
      <div className="bg-elevated rounded-lg p-6">
        {/* Connection Visual */}
        <div className="flex items-center justify-center gap-3 py-5 mb-6 flex-wrap">
          {connection.nodes.map((node, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="px-4 py-3 bg-background border border-border rounded-md text-xs font-medium text-muted-foreground text-center max-w-[120px]">
                {node}
              </div>
              {index < connection.nodes.length - 1 && (
                <div className="w-10 h-0.5 bg-sage-muted relative">
                  <div className="absolute right-0 -top-[3px] w-2 h-2 bg-sage rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Observation */}
        <div className="bg-background rounded-md p-4 mb-4">
          <div className="font-mono text-[10px] font-medium uppercase tracking-[0.3px] text-tertiary mb-2">
            Observation
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {connection.observation}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-1.5 px-[18px] py-2.5 bg-sage-subtle border border-sage-muted rounded-md text-[13px] font-medium text-sage hover:bg-sage hover:border-sage hover:text-white transition-all duration-150 active:scale-[0.97]"
          >
            Explore in chat →
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-[18px] py-2.5 bg-transparent border border-border rounded-md text-[13px] font-medium text-muted-foreground hover:bg-hover hover:text-foreground transition-all duration-150 active:scale-[0.97]"
          >
            Save to Library
          </button>
        </div>
      </div>
    </section>
  );
}
