import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileHeaderProps {
  onEdit: () => void;
}

export function ProfileHeader({ onEdit }: ProfileHeaderProps) {
  return (
    <header className="px-8 py-5 border-b border-border-subtle bg-elevated flex items-center justify-between flex-shrink-0 max-md:px-6 max-sm:px-4">
      <h1 className="text-xl font-semibold text-foreground">Profile</h1>
      <Link
        to="/settings"
        className="flex items-center gap-1.5 px-3.5 py-2 bg-transparent border border-border rounded-md text-[13px] text-muted-foreground hover:bg-hover hover:text-foreground transition-all duration-150 active:scale-[0.97]"
      >
        <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
        Edit Profile
      </Link>
    </header>
  );
}
