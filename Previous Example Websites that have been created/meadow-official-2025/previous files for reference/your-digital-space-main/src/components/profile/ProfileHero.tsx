import { User } from "lucide-react";

interface ProfileHeroProps {
  name: string;
  email: string;
  joinedDate: string;
}

export function ProfileHero({ name, email, joinedDate }: ProfileHeroProps) {
  return (
    <div className="flex items-center gap-6 mb-8 p-6 bg-elevated border border-border-subtle rounded-[14px] max-md:flex-col max-md:text-center">
      <div className="w-[100px] h-[100px] bg-gradient-to-br from-sage-subtle to-surface border-2 border-sage-muted rounded-full flex items-center justify-center flex-shrink-0">
        <User className="w-11 h-11 text-sage" strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <div className="text-2xl font-semibold text-foreground mb-1">{name}</div>
        <div className="text-sm text-tertiary-foreground mb-3">{email}</div>
        <div className="text-xs text-text-muted">Member since {joinedDate}</div>
      </div>
    </div>
  );
}
