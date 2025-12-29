
import React from 'react';
import { ViewState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  BookOpen,
  Plus,
  Leaf,
  LogOut,
  LayoutGrid,
  User,
  Loader2
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, onClose }) => {
  const { profile, signOut, isLoading } = useAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const menuItems = [
    { id: ViewState.HOME, label: 'Home', icon: Home },
    { id: ViewState.JOURNAL, label: 'Journal', icon: BookOpen },
    { id: ViewState.EXPLORE, label: 'Explore', icon: LayoutGrid },
    { id: ViewState.SETTINGS, label: 'Profile', icon: User },
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Force reload to show landing page
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  // Get display name or fallback
  const displayName = profile?.display_name || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <aside className="w-64 h-full glass-sidebar flex flex-col">
      {/* Logo (Meadow 23 style) */}
      <div className="px-6 py-8 flex items-center gap-3 cursor-pointer group" onClick={() => onChangeView(ViewState.HOME)}>
        <div className="w-8 h-8 rounded-lg bg-sage-500 flex items-center justify-center text-white shadow-md shadow-sage-500/20">
          <Leaf size={16} fill="currentColor" strokeWidth={1.5} />
        </div>
        <span className="font-serif text-lg font-medium text-sage-900 tracking-tight">Meadow</span>
      </div>

      {/* New Entry Button (Meadow 23 style) */}
      <div className="px-6 mb-6">
        <button
          onClick={() => onChangeView(ViewState.EDITOR)}
          className="w-full py-3 px-4 bg-sage-500 text-white rounded-full shadow-[0_4px_14px_0_rgba(107,143,122,0.39)] flex items-center justify-center gap-2 font-medium text-sm transition-all hover:-translate-y-0.5 hover:bg-sage-600 hover:shadow-[0_6px_20px_rgba(107,143,122,0.35)]"
        >
          <Plus size={16} strokeWidth={2} />
          <span>New Entry</span>
        </button>
      </div>

      {/* Navigation (Meadow 23 style) */}
      <nav className="flex-1 px-4 overflow-y-auto space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === ViewState.EXPLORE && currentView.toString().startsWith('space-'));

          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                ? 'bg-white shadow-sm text-sage-900'
                : 'text-sage-600 hover:bg-black/5 hover:text-sage-900'
                }`}
            >
              <Icon
                size={18}
                strokeWidth={1.75}
                className={`transition-colors ${isActive ? 'text-sage-500' : 'text-sage-400 group-hover:text-sage-500'}`}
              />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer (Meadow 23 style) */}
      <div className="p-4 border-t border-sage-100">
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-sage-50 transition-all group disabled:opacity-50"
        >
          <div className="w-8 h-8 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-sage-600 text-sm font-serif font-medium">
            {initials}
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-xs font-medium text-sage-900 truncate">{displayName}</div>
            <div className="text-[10px] text-sage-500">Sign out</div>
          </div>
          {isSigningOut ? (
            <Loader2 size={14} className="text-sage-400 animate-spin" />
          ) : (
            <LogOut size={14} strokeWidth={1.5} className="text-sage-400 group-hover:text-sage-600 transition-colors" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;