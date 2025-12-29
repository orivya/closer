import { Link } from "react-router-dom";

interface JourneyItem {
  date: string;
  title: string;
  description: string;
}

interface JourneySectionProps {
  items: JourneyItem[];
}

export function JourneySection({ items }: JourneySectionProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Your Journey</h2>
        <Link
          to="/library"
          className="text-[13px] text-sage hover:opacity-80 hover:underline transition-all duration-150"
        >
          View library →
        </Link>
      </div>
      <div className="p-5 bg-elevated border border-border-subtle rounded-[10px]">
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex gap-4 ${
                index !== items.length - 1 ? "pb-4 border-b border-border-subtle" : ""
              }`}
            >
              <div className="font-mono text-[11px] text-text-muted min-w-[80px] pt-0.5">
                {item.date}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground mb-0.5">
                  {item.title}
                </div>
                <div className="text-[13px] text-tertiary-foreground">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
