import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { SettingsButton } from "./SettingsButton";

interface ProfileSectionProps {
  name: string;
  email: string;
  onEdit: () => void;
}

export function ProfileSection({ name, email, onEdit }: ProfileSectionProps) {
  return (
    <div className="flex items-center gap-5 p-5">
      <div className="w-16 h-16 bg-sage-subtle border border-sage-muted rounded-full flex items-center justify-center flex-shrink-0">
        <User className="w-7 h-7 text-sage" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-base font-semibold text-foreground mb-0.5 truncate">{name}</div>
        <div className="text-[13px] text-tertiary-foreground truncate">{email}</div>
      </div>
      <Link to="/profile">
        <SettingsButton onClick={onEdit}>Edit</SettingsButton>
      </Link>
    </div>
  );
}
