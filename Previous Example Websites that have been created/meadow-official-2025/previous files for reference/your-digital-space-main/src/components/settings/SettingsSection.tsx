import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="mb-8">
      <div className="font-mono text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-4">
        {title}
      </div>
      <div className="bg-elevated border border-border-subtle rounded-[14px] overflow-hidden">
        {children}
      </div>
    </section>
  );
}
