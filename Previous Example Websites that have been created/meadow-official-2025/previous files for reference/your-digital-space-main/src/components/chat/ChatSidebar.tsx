import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  Compass, 
  BookOpen, 
  Settings, 
  User,
  LogOut,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const navItems = [
  { icon: MessageSquare, label: "Chat", path: "/chat" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: BookOpen, label: "Library", path: "/library" },
];

const bottomNavItems = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface ChatSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export function ChatSidebar({ expanded, onToggle }: ChatSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <aside
      className={cn(
        "h-screen flex flex-col border-r border-subtle bg-elevated transition-all duration-300 flex-shrink-0 z-[100] overflow-hidden",
        expanded ? "w-[200px]" : "w-[72px]",
        "hidden xs:flex" // Hidden below 480px, shows mobile nav instead
      )}
    >
      {/* Logo */}
      <div className="h-14 px-4 flex items-center gap-3 border-b border-subtle overflow-hidden">
        <Link to="/" className="flex-shrink-0 cursor-pointer">
          <div className="w-8 h-7 relative">
            <div 
              className="w-full h-full animate-nav-breathe relative"
              style={{
                background: "linear-gradient(155deg, hsl(var(--sage-light)) 0%, hsl(var(--primary)) 50%, hsl(var(--sage-dark)) 100%)",
                borderRadius: "75% 25% 65% 35% / 60% 40% 60% 40%",
              }}
            >
              <div className="absolute top-[38%] left-[42%] -translate-x-1/2 flex gap-2">
                <div className="w-1 h-1 rounded-full bg-white/95" />
                <div className="w-[3px] h-[3px] rounded-full bg-white/90" />
              </div>
            </div>
          </div>
        </Link>
        <span 
          className={cn(
            "text-[15px] font-semibold text-foreground tracking-wide whitespace-nowrap transition-opacity duration-150",
            expanded ? "opacity-100" : "opacity-0"
          )}
        >
          ORIVYA
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "w-full h-11 flex items-center gap-3 px-3 rounded-md transition-all duration-150 relative overflow-hidden",
                isActive 
                  ? "bg-sage-subtle text-sage" 
                  : "text-muted-foreground hover:bg-hover hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-sage rounded-r-sm" />
              )}
              <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
              <span 
                className={cn(
                  "text-[13px] font-medium whitespace-nowrap transition-opacity duration-150",
                  expanded ? "opacity-100" : "opacity-0"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-subtle flex flex-col gap-1">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "w-full h-11 flex items-center gap-3 px-3 rounded-md transition-all duration-150 relative overflow-hidden",
                isActive 
                  ? "bg-sage-subtle text-sage" 
                  : "text-muted-foreground hover:bg-hover hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
              <span 
                className={cn(
                  "text-[13px] font-medium whitespace-nowrap transition-opacity duration-150",
                  expanded ? "opacity-100" : "opacity-0"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Sidebar Toggle */}
      <div className="p-3 mt-auto">
        <button
          onClick={onToggle}
          className="w-full h-9 flex items-center justify-center bg-transparent border border-subtle rounded-sm text-text-muted hover:bg-hover hover:text-foreground hover:border-border transition-all duration-150 active:scale-[0.96]"
        >
          <ChevronLeft 
            className={cn(
              "w-4 h-4 transition-transform duration-150",
              expanded ? "" : "rotate-180"
            )} 
            strokeWidth={1.5} 
          />
        </button>
      </div>
    </aside>
  );
}
