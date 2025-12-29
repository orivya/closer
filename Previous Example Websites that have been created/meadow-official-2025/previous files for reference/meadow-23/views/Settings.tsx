import React from 'react';
import { User, Shield, Archive, Moon, Sparkles, ChevronRight, LogOut, CreditCard } from 'lucide-react';
import { GlassCard, Button } from '../components/ui';

export const Settings: React.FC = () => {
  const SettingItem = ({ icon: Icon, label, desc, toggle = false, active = false }: any) => (
    <button className="w-full flex items-center gap-4 p-4 hover:bg-black/5 transition-colors text-left group first:rounded-t-2xl last:rounded-b-2xl">
      <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-sage-500 group-hover:bg-white transition-colors">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-sage-900">{label}</div>
        {desc && <div className="text-xs text-sage-500">{desc}</div>}
      </div>
      {toggle ? (
         <div className={`w-11 h-6 rounded-full relative transition-colors ${active ? 'bg-sage-500' : 'bg-sage-200'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${active ? 'left-6' : 'left-1'}`}></div>
         </div>
      ) : (
        <ChevronRight size={16} className="text-sage-300 group-hover:text-sage-500" />
      )}
    </button>
  );

  return (
    <div className="animate-fade-up max-w-2xl mx-auto pb-12">
      <div className="text-center mb-10">
        <div className="w-24 h-24 mx-auto bg-white border-4 border-sage-100 rounded-full flex items-center justify-center text-3xl font-serif text-sage-500 mb-4 shadow-sm">
          U
        </div>
        <h2 className="font-serif text-3xl text-sage-900 mb-1">User Name</h2>
        <p className="text-sage-500 text-sm">Free Plan Member</p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-sage-400 mb-4 px-2">Account</h3>
          <GlassCard className="p-0 flex flex-col divide-y divide-sage-100/50">
            <SettingItem icon={User} label="Personal Information" desc="Name, email, profile photo" />
            <SettingItem icon={Shield} label="Privacy & Security" desc="Password, 2FA, App Lock" />
            <SettingItem icon={CreditCard} label="Subscription" desc="Manage your plan and billing" />
          </GlassCard>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-sage-400 mb-4 px-2">App Preferences</h3>
          <GlassCard className="p-0 flex flex-col divide-y divide-sage-100/50">
            <SettingItem icon={Moon} label="Dark Mode" toggle active={false} />
            <SettingItem icon={Sparkles} label="AI Insights" desc="Allow AI to analyze entries for patterns" toggle active={true} />
            <SettingItem icon={Archive} label="Data & Export" desc="Download all your entries" />
          </GlassCard>
        </div>

        <div className="pt-4">
           <Button variant="secondary" className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100" icon={<LogOut size={16} />}>
             Sign Out
           </Button>
           <p className="text-center text-xs text-sage-300 mt-6">Meadow v1.2.0 (Build 2026)</p>
        </div>
      </div>
    </div>
  );
};