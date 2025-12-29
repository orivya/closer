
import React from 'react';
import { ViewState } from '../types';
import { 
  Home, 
  BookOpen, 
  Plus, 
  Leaf,
  LogOut,
  LayoutGrid,
  User
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, onClose }) => {
  const menuItems = [
    { id: ViewState.HOME, label: 'Home', icon: Home },
    { id: ViewState.JOURNAL, label: 'Journal', icon: BookOpen, badge: 24 },
    { id: ViewState.EXPLORE, label: 'Explore', icon: LayoutGrid },
    { id: ViewState.SETTINGS, label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-[280px] h-full bg-[#faf9f7] border-r border-stone-200/60 flex flex-col">
        {/* Logo */}
        <div className="p-10 flex items-center gap-3 cursor-pointer group" onClick={() => onChangeView(ViewState.HOME)}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center text-white shadow-lg shadow-sage/20 group-hover:scale-105 transition-transform duration-500">
            <Leaf size={16} fill="currentColor" strokeWidth={1.5} />
          </div>
          <span className="font-serif text-xl font-medium text-text-primary tracking-tight">Meadow</span>
        </div>

        {/* New Entry Button */}
        <div className="px-6 mb-8">
          <button 
            onClick={() => onChangeView(ViewState.EDITOR)}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-sage to-sage-dark text-white rounded-xl shadow-lg shadow-sage/25 flex items-center justify-center gap-2.5 font-medium text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sage/40 active:translate-y-0 active:scale-[0.98]"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>New Entry</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Check if active (handle sub-views for spaces if necessary)
            const isActive = currentView === item.id || (item.id === ViewState.EXPLORE && currentView.toString().startsWith('space-'));
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id);
                }}
                className={`
                  w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-300 group
                  ${isActive 
                    ? 'bg-white text-text-primary shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.02)] ring-1 ring-stone-200/50' 
                    : 'text-text-secondary hover:bg-stone-100 hover:text-text-primary'}
                `}
              >
                <Icon 
                  size={20} 
                  strokeWidth={1.75}
                  className={`transition-colors duration-300 ${isActive ? 'text-sage' : 'text-text-muted group-hover:text-text-secondary'}`} 
                />
                <span className="flex-1 text-left tracking-wide">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${isActive ? 'bg-sage/10 text-sage' : 'bg-stone-100 text-text-muted'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-stone-200/60">
          <button className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-stone-200/50 transition-all duration-300 group active:scale-[0.98]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-stone-200 to-stone-100 border border-stone-200 flex items-center justify-center text-text-secondary text-sm font-serif font-medium">
              S
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-text-primary group-hover:text-sage-dark transition-colors">Sarah</div>
              <div className="text-[11px] text-text-muted tracking-wide">Premium Member</div>
            </div>
            <LogOut size={16} strokeWidth={1.5} className="text-stone-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </aside>
  );
};

export default Sidebar;
