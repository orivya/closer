import React, { useState } from 'react';
import { ViewState } from '../types';
import { User, Bell, Moon, Lock, Database, ChevronRight, LogOut, Shield, Zap, Calendar, Award, TrendingUp, Clock, Type, ArrowUpRight, Activity, Briefcase, Sun, Cloud, CloudRain, Smile, Meh, Wind, Sparkles } from 'lucide-react';

interface SettingsProps {
  onChangeView: (view: ViewState) => void;
}

// Mock Data representing a "Weather" history - Monochromatic Sage Theme
const weeklyWeather = [
  { day: 'M', label: 'Cloudy', value: 2, height: '40%', icon: Cloud, opacity: 'opacity-40', summary: "Felt a bit foggy, hard to focus." },
  { day: 'T', label: 'Low', value: 1, height: '25%', icon: CloudRain, opacity: 'opacity-30', summary: "Heavy energy, needed rest." },
  { day: 'W', label: 'Content', value: 4, height: '75%', icon: Smile, opacity: 'opacity-80', summary: "Found flow in the afternoon." },
  { day: 'T', label: 'Steady', value: 3, height: '55%', icon: Meh, opacity: 'opacity-60', summary: "Just getting things done." },
  { day: 'F', label: 'Cloudy', value: 2, height: '40%', icon: Cloud, opacity: 'opacity-40', summary: "Uncertainty about the weekend." },
  { day: 'S', label: 'Radiant', value: 5, height: '90%', icon: Sun, opacity: 'opacity-100', summary: "Full of energy and light!" },
  { day: 'S', label: 'Content', value: 4, height: '75%', icon: Smile, opacity: 'opacity-80', summary: "Peaceful Sunday reset." },
];

const Settings: React.FC<SettingsProps> = ({ onChangeView }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'settings'>('insights');
  const [focusedDayIndex, setFocusedDayIndex] = useState<number>(6); // Default to Sunday (latest)

  const activeWeather = weeklyWeather[focusedDayIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up pb-20 relative">
      
      {/* Profile Header (Always Visible) */}
      <div className="flex flex-col items-center text-center pt-4 mb-6">
         <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sage to-sage-dark flex items-center justify-center text-white text-3xl font-serif shadow-xl shadow-sage/20 border-4 border-white">
               S
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
               <div className="w-5 h-5 bg-text-primary rounded-full flex items-center justify-center">
                  <User size={10} className="text-white" />
               </div>
            </div>
         </div>
         <h2 className="font-serif text-2xl font-medium text-text-primary mb-1">Sarah Anderson</h2>
         <p className="text-text-secondary text-sm font-medium bg-stone-100 px-3 py-1 rounded-full inline-block mb-6">
            Premium Member
         </p>

         {/* Stats Row */}
         <div className="grid grid-cols-3 gap-3 w-full max-w-md">
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center">
               <div className="w-8 h-8 rounded-full bg-sage/5 text-sage-dark flex items-center justify-center mb-1">
                  <Zap size={14} fill="currentColor" />
               </div>
               <span className="font-serif text-xl text-text-primary">12</span>
               <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Day Streak</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center">
               <div className="w-8 h-8 rounded-full bg-sage/5 text-sage-dark flex items-center justify-center mb-1">
                  <Calendar size={14} />
               </div>
               <span className="font-serif text-xl text-text-primary">247</span>
               <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Entries</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center">
               <div className="w-8 h-8 rounded-full bg-sage/5 text-sage-dark flex items-center justify-center mb-1">
                  <Award size={14} />
               </div>
               <span className="font-serif text-xl text-text-primary">Lvl 3</span>
               <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Reflector</span>
            </div>
         </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-stone-100 rounded-xl mb-8">
         <button 
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'insights' ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
         >
            Insights
         </button>
         <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'settings' ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
         >
            Settings
         </button>
      </div>

      {/* --- INSIGHTS CONTENT --- */}
      {activeTab === 'insights' && (
        <div className="space-y-6 animate-fade-in">
           
           {/* Pattern Card */}
           <div className="bg-gradient-to-br from-[#F4F7F5] to-white p-6 rounded-[24px] border border-white shadow-card relative overflow-hidden group">
              <div className="flex items-start justify-between mb-4">
                 <div className="w-10 h-10 rounded-2xl bg-white text-sage flex items-center justify-center shadow-sm">
                    <Activity size={20} strokeWidth={1.5} />
                 </div>
                 <span className="bg-sage/10 text-sage text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">Discovery</span>
              </div>
              <h4 className="font-serif text-xl text-text-primary mb-2">Confidence correlates with length</h4>
              <p className="text-text-secondary text-sm leading-relaxed font-light mb-4">
                 When your journal entries exceed 300 words, your sentiment analysis shows a <span className="font-semibold text-sage-dark">40% increase in confidence</span>.
              </p>
              <button 
                 onClick={() => onChangeView(ViewState.EDITOR)}
                 className="w-full py-2.5 bg-white border border-sage/20 text-sage-dark rounded-xl text-sm font-medium hover:bg-sage hover:text-white transition-all shadow-sm"
              >
                 Test this pattern
              </button>
           </div>

           {/* Interactive Weather Report (Monochromatic) */}
           <div className="rounded-[32px] border border-stone-100 shadow-sm relative overflow-hidden flex flex-col bg-white">
                <div className="p-6 pb-2 z-10 relative flex justify-between items-start">
                    <div>
                        <h3 className="font-serif text-lg text-text-primary">Weekly Weather</h3>
                        <p className="text-[10px] text-text-muted font-medium mt-0.5">Atmospheric analysis of your week</p>
                    </div>
                </div>
                
                {/* Sky Container */}
                <div className="h-[200px] relative flex items-end justify-between px-4 pb-4 border-b border-stone-50">
                    {/* Background Guidelines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-8 px-6">
                       <div className="border-t border-dashed border-stone-400 w-full h-0" />
                       <div className="border-t border-dashed border-stone-400 w-full h-0" />
                       <div className="border-t border-dashed border-stone-400 w-full h-0" />
                    </div>

                    {weeklyWeather.map((data, index) => {
                       const Icon = data.icon;
                       const isActive = index === focusedDayIndex;
                       return (
                          <div 
                              key={index} 
                              onClick={() => setFocusedDayIndex(index)}
                              className="flex flex-col items-center gap-3 w-full h-full justify-end group cursor-pointer relative z-10"
                            >
                             
                             {/* The Floating Icon (Height determined by data) */}
                             <div className="relative w-full flex justify-center transition-all duration-700 ease-out" style={{ height: data.height }}>
                                <div className={`
                                   absolute top-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform shadow-sm
                                   ${isActive ? 'scale-125 bg-sage text-white shadow-md z-20' : `scale-100 hover:scale-110 bg-stone-50 text-sage ${data.opacity}`}
                                   ${index % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}
                                `}>
                                   <Icon size={isActive ? 24 : 20} strokeWidth={1.5} />
                                </div>

                                {/* Vertical Connection Stem */}
                                <div className={`h-full w-[1px] border-l border-dashed mt-10 transition-colors ${isActive ? 'border-sage/50' : 'border-stone-200'}`} />
                             </div>

                             {/* Day Label */}
                             <span className={`text-[10px] font-bold uppercase transition-colors ${isActive ? 'text-sage-dark scale-110' : 'text-stone-300'}`}>
                                {data.day}
                             </span>
                          </div>
                       )
                    })}
                </div>

                {/* AI Analysis Footer */}
                <div className="p-6 bg-stone-50/50">
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            <Sparkles size={16} className="text-sage" />
                        </div>
                        <div>
                             <p className="text-[10px] font-bold text-sage uppercase tracking-widest mb-1">Daily Synthesis</p>
                             <p className="text-text-secondary text-sm font-serif italic">"{activeWeather.summary}"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Habits Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-sm">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Peak Focus</div>
                    <div className="flex items-center gap-2 mb-1">
                        <Clock size={16} className="text-sage" />
                        <span className="font-serif text-lg text-text-primary">8:00 PM</span>
                    </div>
                    <div className="text-xs text-text-secondary">Evening writer</div>
                </div>
                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-sm">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Avg Length</div>
                    <div className="flex items-center gap-2 mb-1">
                        <Type size={16} className="text-sage" />
                        <span className="font-serif text-lg text-text-primary">287</span>
                    </div>
                    <div className="text-xs text-text-secondary">Words per entry</div>
                </div>
            </div>

            <button 
                onClick={() => onChangeView(ViewState.SPACE_DASHBOARD)}
                className="w-full py-3 rounded-xl border border-stone-200 text-sm font-medium text-text-secondary hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
            >
                <span>View Full Dashboard</span>
                <ArrowUpRight size={16} />
            </button>
        </div>
      )}

      {/* --- SETTINGS CONTENT --- */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fade-in">
             <section>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 pl-2">Account</h3>
                <div className="bg-white rounded-3xl border border-stone-200/50 shadow-sm overflow-hidden">
                <SettingsItem icon={User} label="Personal Information" />
                <SettingsItem icon={Shield} label="Privacy & Security" />
                <SettingsItem icon={Database} label="Data & Export" isLast />
                </div>
            </section>

            <section>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 pl-2">App Settings</h3>
                <div className="bg-white rounded-3xl border border-stone-200/50 shadow-sm overflow-hidden">
                <SettingsItem icon={Bell} label="Notifications" value="On" />
                <SettingsItem icon={Moon} label="Appearance" value="System" />
                <SettingsItem icon={Lock} label="Passcode Lock" value="Enabled" isLast />
                </div>
            </section>

            <button className="w-full py-4 text-red-400 hover:text-red-500 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                <LogOut size={16} />
                Sign Out
            </button>

            <div className="text-center text-xs text-text-muted pt-4">
                Meadow v1.0.4 (Build 220)
            </div>
        </div>
      )}

    </div>
  );
};

const SettingsItem = ({ icon: Icon, label, value, isLast }: any) => (
  <button className={`w-full flex items-center gap-4 p-4 hover:bg-stone-50 transition-colors ${!isLast ? 'border-b border-stone-100' : ''}`}>
     <div className="w-8 h-8 rounded-lg bg-stone-50 text-text-secondary flex items-center justify-center">
        <Icon size={16} strokeWidth={1.5} />
     </div>
     <span className="flex-1 text-left text-sm font-medium text-text-primary">{label}</span>
     {value && <span className="text-sm text-text-muted">{value}</span>}
     <ChevronRight size={16} className="text-stone-300" />
  </button>
);

export default Settings;