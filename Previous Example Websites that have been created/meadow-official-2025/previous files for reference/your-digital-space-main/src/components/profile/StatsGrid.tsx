interface Stat {
  value: number;
  label: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8 max-sm:grid-cols-2">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-5 bg-elevated border border-border-subtle rounded-[10px] text-center transition-all duration-250 hover:border-border hover:-translate-y-0.5"
        >
          <div className="font-mono text-[28px] font-semibold text-foreground mb-1">
            {stat.value}
          </div>
          <div className="text-xs text-text-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
