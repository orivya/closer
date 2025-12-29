import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Compass, BookOpen, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: MessageSquare, label: "Chat", path: "/chat" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: BookOpen, label: "Library", path: "/library" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function MobileNav() {
  const location = useLocation();

  // Visible only at 480px and below (max-xs:flex), hidden above
  return (
    <nav className="flex xs:hidden fixed bottom-0 left-0 right-0 w-full h-16 bg-elevated border-t border-subtle items-center justify-around z-[100]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-12 h-14 transition-colors",
              isActive ? "text-sage" : "text-muted-foreground"
            )}
          >
            <item.icon className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[9px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
