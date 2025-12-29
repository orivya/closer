
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, PromptCategory } from '../types';
import { PROMPT_CATEGORIES, QUICK_WRITES } from '../data/content';
import { 
  Mic, ChevronLeft, 
  X, Feather, Compass, Zap, 
  Image as ImageIcon,
  GitBranch, Folder, Hash, MoreVertical,
  Check, Trash2, Plus, 
  ArrowRight, Sparkles, Target, Share, Download, EyeOff, Loader2, Send
} from 'lucide-react';
import { JournalService } from '../services/journal';

interface EditorProps {
  onChangeView: (view: ViewState) => void;
  initialData?: any;
}

type EditorMode = 'selection' | 'free' | 'quick-menu' | 'quick-session' | 'guided-menu' | 'guided-session' | 'voice';

// Mock data for dropdowns
const INITIAL_THREADS = ['Career Decision', 'Relationships', 'Personal Growth', 'Health Journey'];
const INITIAL_CATEGORIES = ['Work', 'Personal', 'Ideas', 'Journal', 'Morning Pages'];

const DEMO_IMAGES = [
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800", 
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800", 
    "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?auto=format&fit=crop&q=80&w=800", 
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800"
];

const Editor: React.FC<EditorProps> = ({ onChangeView, initialData }) => {
  // --- STATE ---
  const [mode, setMode] = useState<EditorMode>(initialData?.prompt ? 'free' : 'selection');
  
  // Selection State
  const [selectedQuickJot, setSelectedQuickJot] = useState<any>(null);
  const [selectedGuidedCategory, setSelectedGuidedCategory] = useState<PromptCategory | null>(null);

  // Content
  const [title, setTitle] = useState(initialData?.prompt || '');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]); 
  const [wordCount, setWordCount] = useState(0);
  
  // UX State
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false); 
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceWave, setVoiceWave] = useState<number[]>([]);

  // Metadata State
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<'thread' | 'category' | 'tags'>('thread');
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [selectedThread, setSelectedThread] = useState<string | null>(initialData?.threadId || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Initialization
  useEffect(() => {
    if (initialData?.prompt && !initialData?.intentionId) {
      setTitle(initialData.prompt);
    }
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [initialData]);

  // Voice Animation Loop
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(t => t + 1);
        setVoiceWave(prev => {
            const next = [...prev, Math.random()];
            return next.slice(-30); 
        });
      }, 1000); 
    } else {
      setRecordingTime(0);
      setVoiceWave([]);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Handle Mode Selection
  const handleModeSelect = (selectedMode: string) => {
    if (selectedMode === 'goals') {
       const goalCat = PROMPT_CATEGORIES.find(c => c.id === 'goals');
       setSelectedGuidedCategory(goalCat || PROMPT_CATEGORIES[0]);
       setMode('guided-session');
       return;
    }
    if (selectedMode === 'discovery') {
       const discCat = PROMPT_CATEGORIES.find(c => c.id === 'discovery');
       setSelectedGuidedCategory(discCat || PROMPT_CATEGORIES[0]);
       setMode('guided-session');
       return;
    }
    if (selectedMode === 'voice') {
        setMode('free');
        setIsRecording(true);
        return;
    }
    setMode(selectedMode as EditorMode);
  };

  const handleGuidedSessionComplete = (generatedTitle: string, generatedContent: string) => {
      setTitle(generatedTitle);
      setContent(generatedContent);
      setMode('free'); 
      setTags([...tags, "guided-reflection"]);
  };

  // Focus Mode Logic
  const handleUserActivity = () => {
    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (content.length > 50 && !isRecording && !showMenu && !showDrawer && mode === 'free') setIsTyping(true);
    }, 2500);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [content, isRecording, showMenu, showDrawer, mode]);

  // --- HANDLERS ---
  const toggleDrawer = (tab: 'thread' | 'category' | 'tags') => {
      if (showDrawer && activeTab === tab) {
          setShowDrawer(false);
      } else {
          setActiveTab(tab);
          setShowDrawer(true);
          setIsCreatingCategory(false); 
      }
  };

  const handleAddImage = () => {
      const nextImage = DEMO_IMAGES[images.length % DEMO_IMAGES.length];
      setImages([...images, nextImage]);
  };

  const handleStopRecording = () => {
      setIsRecording(false);
      const transcribedText = "\n\nI realized today that the anxiety I'm feeling isn't about the work itself, but about the expectation I've set for myself. It's time to redefine what 'enough' means.";
      setContent(prev => prev + transcribedText);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.trim()) {
          if (!tags.includes(tagInput.trim())) {
              setTags([...tags, tagInput.trim()]);
          }
          setTagInput('');
      }
  };

  const handleCreateCategory = () => {
      if (newCategoryInput.trim()) {
          const newCat = newCategoryInput.trim();
          setCategories([...categories, newCat]);
          setSelectedCategory(newCat);
          setNewCategoryInput('');
          setIsCreatingCategory(false);
          setShowDrawer(false);
      }
  };
  
  const handleSave = async () => {
      if (!content.trim()) return;
      
      setIsSaving(true);
      try {
          const tagsToSave = [...tags];
          if (selectedCategory) tagsToSave.push(selectedCategory);
          if (selectedThread) tagsToSave.push(selectedThread);
          
          await JournalService.createEntry(
              title || 'Untitled Entry',
              content,
              tagsToSave
          );
          
          onChangeView(ViewState.HOME);
      } catch (err) {
          console.error("Failed to save:", err);
          alert("Could not save entry. Please ensure you are logged in.");
      } finally {
          setIsSaving(false);
      }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- VIEW RENDERERS ---

  if (mode === 'selection') {
    return <ModeSelection onSelect={handleModeSelect} onClose={() => onChangeView(ViewState.HOME)} />;
  }

  // --- QUICK JOT ---
  if (mode === 'quick-menu') {
    return (
        <div className="min-h-screen bg-[#faf9f7] p-6 animate-fade-up">
            <div className="max-w-4xl mx-auto pt-10">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setMode('selection')} className="p-2 hover:bg-white rounded-full transition-colors">
                        <ChevronLeft size={24} className="text-text-secondary" />
                    </button>
                    <div>
                        <h2 className="font-serif text-3xl text-text-primary">Quick Jot</h2>
                        <p className="text-text-secondary">Capture fleeting thoughts, fast.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {QUICK_WRITES.map((qw, idx) => (
                        <button 
                            key={qw.id}
                            onClick={() => {
                                setSelectedQuickJot(qw);
                                setMode('quick-session');
                            }}
                            className="bg-white p-6 rounded-3xl border border-stone-200 text-left hover:border-sage/40 hover:shadow-card-hover transition-all group animate-fade-up"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-stone-50 text-sage flex items-center justify-center mb-4 group-hover:bg-sage group-hover:text-white transition-colors">
                                <qw.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-serif text-xl text-text-primary mb-2">{qw.title}</h3>
                            <div className="space-y-1">
                                {qw.prompts.slice(0,2).map((p, i) => (
                                    <p key={i} className="text-sm text-text-secondary font-light line-clamp-1">• {p}</p>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  if (mode === 'quick-session' && selectedQuickJot) {
      return (
          <QuickJotSession 
              template={selectedQuickJot} 
              onBack={() => setMode('quick-menu')} 
              onComplete={(finalTitle, finalContent) => {
                  setTitle(finalTitle);
                  setContent(finalContent);
                  handleSave(); 
              }}
          />
      )
  }

  // --- GUIDED REFLECTION (Sequential Page View) ---
  if (mode === 'guided-menu') {
      return (
        <div className="min-h-screen bg-[#faf9f7] p-6 animate-fade-up">
            <div className="max-w-4xl mx-auto pt-10">
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => setMode('selection')} 
                        className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} className="text-text-secondary" />
                    </button>
                    <div>
                        <h2 className="font-serif text-3xl text-text-primary">Guided Reflection</h2>
                        <p className="text-text-secondary">Deep dives into specific areas of your life.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PROMPT_CATEGORIES.map((cat, idx) => {
                        // All icons are now Sage Green to match Quick Jot style
                        return (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedGuidedCategory(cat);
                                    setMode('guided-session');
                                }}
                                className="bg-white p-6 rounded-[24px] border border-stone-200 hover:border-sage/30 hover:shadow-card-hover transition-all text-left group animate-fade-up"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-stone-50 text-sage flex items-center justify-center mb-4 transition-colors group-hover:bg-sage group-hover:text-white">
                                    <cat.icon size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-medium text-text-primary text-lg mb-1">{cat.title}</h3>
                                <p className="text-sm text-text-secondary font-light line-clamp-2">{cat.description}</p>
                                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
                                    <Sparkles size={10} /> {cat.count} Steps
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
      );
  }

  if (mode === 'guided-session' && selectedGuidedCategory) {
      return (
          <GuidedReflectionSession 
              category={selectedGuidedCategory}
              onClose={() => setMode('guided-menu')}
              onComplete={handleGuidedSessionComplete}
          />
      );
  }

  // --- FREE EDITOR (Default) ---
  return (
    <div className="relative w-full h-full bg-[#faf9f7] overflow-hidden flex flex-col">
       
       {/* ATMOSPHERIC BACKGROUND */}
       <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-gradient-to-tr from-clay/5 to-transparent rounded-full blur-[150px] animate-float" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} />
       </div>

       {/* --- HEADER --- */}
       <header 
         className={`
           relative z-20 flex items-center justify-between px-6 py-6 md:px-12 transition-all duration-700
           ${isTyping ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}
         `}
       >
          <button 
             onClick={() => onChangeView(ViewState.HOME)}
             className="group flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
             <div className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-stone-200/50 flex items-center justify-center group-hover:bg-white transition-all shadow-sm">
                <ChevronLeft size={20} strokeWidth={1.5} />
             </div>
             <span className="hidden md:inline text-sm font-medium tracking-wide">Back</span>
          </button>

          <div className="flex items-center gap-4 relative">
             <span className="text-xs font-serif italic text-text-muted transition-opacity duration-300">
                {isSaving ? 'Syncing...' : wordCount > 0 ? `${wordCount} words` : 'Unsaved'}
             </span>
             
             {/* MENU TOGGLE */}
             <div ref={menuRef}>
                 <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm
                        ${showMenu ? 'bg-sage text-white' : 'bg-white/50 backdrop-blur-md border border-stone-200/50 text-text-secondary hover:bg-white'}
                    `}
                 >
                    <MoreVertical size={20} strokeWidth={1.5} />
                 </button>

                 {/* MENU DROPDOWN */}
                 {showMenu && (
                    <div className="absolute top-12 right-0 w-48 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-50 animate-scale-in origin-top-right">
                        <button className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-sage/10 hover:text-sage-dark transition-colors flex items-center gap-3">
                            <EyeOff size={16} /> Focus Mode
                        </button>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-sage/10 hover:text-sage-dark transition-colors flex items-center gap-3">
                            <Share size={16} /> Share Entry
                        </button>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-sage/10 hover:text-sage-dark transition-colors flex items-center gap-3">
                            <Download size={16} /> Export PDF
                        </button>
                        <div className="h-px bg-stone-100 my-1" />
                        <button className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3">
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                 )}
             </div>
          </div>
       </header>

       {/* --- MAIN CANVAS --- */}
       <main className="flex-1 relative z-10 overflow-y-auto px-6 md:px-12 scroll-smooth no-scrollbar">
          <div className="max-w-2xl mx-auto pt-4 pb-48 md:pt-8">
             
             {/* VISUAL HEADER (Images) */}
             {images.length > 0 && (
                 <div className="mb-8 grid grid-cols-2 gap-4 animate-fade-up">
                     {images.map((img, idx) => (
                         <div key={idx} className={`relative rounded-2xl overflow-hidden shadow-sm group ${images.length === 1 ? 'col-span-2 h-64' : 'h-40'}`}>
                             <img src={img} alt="Attachment" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                             <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                             <button 
                                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 text-stone-600 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"
                             >
                                 <Trash2 size={14} />
                             </button>
                         </div>
                     ))}
                 </div>
             )}

             {/* Title */}
             <input 
               type="text" 
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="Untitled Entry"
               className="w-full bg-transparent border-none p-0 text-[2.5rem] md:text-[3.5rem] font-serif font-medium text-text-primary placeholder:text-stone-300 focus:ring-0 mb-6 leading-[1.1] tracking-tight"
             />

             {/* Body */}
             <textarea 
               value={content}
               onChange={(e) => {
                 setContent(e.target.value);
                 setWordCount(e.target.value.trim().split(/\s+/).filter(w => w.length > 0).length);
               }}
               placeholder="Start writing..."
               className="w-full h-[calc(100vh-300px)] bg-transparent border-none p-0 text-lg md:text-xl font-serif leading-[1.8] text-text-primary placeholder:text-stone-300 focus:ring-0 resize-none outline-none"
             />
          </div>
       </main>

       {/* --- CONTROL DOCK --- */}
       <footer 
         className={`
            fixed bottom-0 left-0 right-0 z-30 transition-all duration-700
            ${isTyping ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'}
         `}
       >
          {/* DRAWER: Sliding Panel for Metadata */}
          <div 
             className={`
                bg-[#faf9f7]/95 backdrop-blur-xl border-t border-stone-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]
                transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden
                ${showDrawer ? 'max-h-[60vh] py-6' : 'max-h-0 py-0'}
             `}
          >
             <div className="max-w-2xl mx-auto px-6">
                
                {/* Drawer Header */}
                <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                         {activeTab === 'thread' && <><GitBranch size={14}/> Connect Thread</>}
                         {activeTab === 'category' && <><Folder size={14}/> Assign Category</>}
                         {activeTab === 'tags' && <><Hash size={14}/> Manage Tags</>}
                     </h3>
                     <button onClick={() => setShowDrawer(false)} className="text-stone-400 hover:text-stone-600">
                         <X size={18} />
                     </button>
                </div>

                <div className="min-h-[150px] overflow-y-auto no-scrollbar pb-6">
                   
                   {/* 1. THREADS TAB */}
                   {activeTab === 'thread' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {threads.map(t => (
                            <button 
                                key={t}
                                onClick={() => { setSelectedThread(selectedThread === t ? null : t); setShowDrawer(false); }}
                                className={`
                                p-4 rounded-xl text-left border transition-all flex items-center justify-between group
                                ${selectedThread === t ? 'bg-sage text-white border-sage' : 'bg-white border-stone-200 text-text-secondary hover:border-sage/50'}
                                `}
                            >
                                <span className="font-serif">{t}</span>
                                {selectedThread === t && <Check size={16} />}
                            </button>
                        ))}
                        <button className="p-4 rounded-xl text-left border border-dashed border-stone-300 text-stone-400 hover:text-sage hover:border-sage hover:bg-sage/5 transition-all flex items-center gap-2">
                            <Plus size={16} /> Create New Thread
                        </button>
                      </div>
                   )}

                   {/* 2. CATEGORIES TAB */}
                   {activeTab === 'category' && (
                      <div className="space-y-4">
                          {!isCreatingCategory ? (
                              <div className="flex flex-wrap gap-3">
                                  {categories.map(c => (
                                      <button
                                          key={c}
                                          onClick={() => { setSelectedCategory(selectedCategory === c ? null : c); setShowDrawer(false); }}
                                          className={`
                                              px-5 py-2.5 rounded-full text-sm font-medium transition-all border
                                              ${selectedCategory === c ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-text-secondary border-stone-200 hover:border-blue-300 hover:text-blue-600'}
                                          `}
                                      >
                                          {c}
                                      </button>
                                  ))}
                                  <button 
                                    onClick={() => setIsCreatingCategory(true)}
                                    className="px-5 py-2.5 rounded-full text-sm font-medium border border-dashed border-stone-300 text-stone-400 hover:text-blue-500 hover:border-blue-500 transition-all flex items-center gap-2"
                                  >
                                      <Plus size={14} /> New Category
                                  </button>
                              </div>
                          ) : (
                              <div className="flex items-center gap-3 animate-fade-in">
                                  <input 
                                    autoFocus
                                    type="text" 
                                    value={newCategoryInput}
                                    onChange={(e) => setNewCategoryInput(e.target.value)}
                                    placeholder="Enter category name..."
                                    className="flex-1 bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                                  />
                                  <button onClick={handleCreateCategory} className="px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold">
                                      Add
                                  </button>
                                  <button onClick={() => setIsCreatingCategory(false)} className="px-4 py-3 text-stone-400 hover:text-text-primary">
                                      Cancel
                                  </button>
                              </div>
                          )}
                      </div>
                   )}
                   
                   {/* 3. TAGS TAB */}
                   {activeTab === 'tags' && (
                       <div>
                          <input 
                             type="text" 
                             autoFocus
                             value={tagInput}
                             onChange={(e) => setTagInput(e.target.value)}
                             onKeyDown={handleAddTag}
                             placeholder="Type tag and hit Enter..." 
                             className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-sage focus:border-sage mb-4 outline-none"
                          />
                          <div className="flex flex-wrap gap-2">
                             {tags.map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-stone-100 text-text-secondary rounded-lg text-sm border border-stone-200 flex items-center gap-2">
                                   #{tag} <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500"><X size={12}/></button>
                                </span>
                             ))}
                             {tags.length === 0 && <p className="text-text-muted text-sm italic">No tags added yet. Try 'ideas' or 'reflection'.</p>}
                          </div>
                       </div>
                   )}
                </div>
             </div>
          </div>

          {/* DOCK BAR */}
          <div className="bg-white/80 backdrop-blur-xl border-t border-stone-200/50 pb-6 pt-4 px-6 md:pb-8 md:pt-4">
             <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                
                {/* Left: Metadata & Tools */}
                <div className="flex items-center gap-1 md:gap-3 overflow-x-auto no-scrollbar max-w-[70%]">
                   
                   {/* Tools */}
                   <div className="flex items-center gap-1 pr-2 border-r border-stone-200">
                        <IconButton 
                            icon={Mic} 
                            onClick={() => setIsRecording(true)} 
                            tooltip="Voice Note"
                        />
                        <IconButton 
                            icon={ImageIcon} 
                            onClick={handleAddImage}
                            tooltip="Add Image"
                        />
                   </div>

                   {/* Context Pills */}
                   <DockPill 
                      icon={GitBranch} 
                      label={selectedThread || "Thread"} 
                      isActive={!!selectedThread || (showDrawer && activeTab === 'thread')}
                      onClick={() => toggleDrawer('thread')}
                   />
                   <DockPill 
                      icon={Folder} 
                      label={selectedCategory || "Category"} 
                      isActive={!!selectedCategory || (showDrawer && activeTab === 'category')}
                      onClick={() => toggleDrawer('category')}
                   />
                   <DockPill 
                      icon={Hash} 
                      label={tags.length > 0 ? `${tags.length} Tags` : "Tags"} 
                      isActive={tags.length > 0 || (showDrawer && activeTab === 'tags')}
                      onClick={() => toggleDrawer('tags')}
                   />
                </div>

                {/* Right: Save Action */}
                <button 
                   onClick={handleSave}
                   disabled={isSaving}
                   className="h-12 px-6 md:px-8 bg-text-primary text-white rounded-full font-medium shadow-lg hover:bg-black hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-70 disabled:hover:scale-100"
                >
                   {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                   <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
             </div>
          </div>
       </footer>

       {/* --- CALM VOICE RECORDER OVERLAY --- */}
       {isRecording && (
           <div className="fixed inset-0 z-50 bg-[#faf9f7]/90 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in">
               <div className="w-full max-w-md px-6 text-center">
                   <div className="flex flex-col items-center justify-center gap-3 mb-16">
                       <div className="relative">
                            <div className="w-4 h-4 rounded-full bg-sage animate-pulse" />
                            <div className="absolute inset-0 w-4 h-4 rounded-full bg-sage blur-md animate-pulse" />
                       </div>
                       <span className="font-serif text-lg text-text-primary italic tracking-wide">Listening...</span>
                   </div>
                   
                   <div className="font-serif text-8xl md:text-9xl mb-12 tabular-nums tracking-tight text-text-primary opacity-90">
                       {formatTime(recordingTime)}
                   </div>

                   <div className="h-16 flex items-center justify-center gap-1.5 mb-20 px-8">
                       {Array.from({length: 20}).map((_, i) => (
                            <div 
                                key={i} 
                                className="w-1.5 rounded-full bg-sage transition-all duration-300 ease-in-out" 
                                style={{ 
                                    height: `${Math.max(15, Math.random() * 100)}%`, 
                                    opacity: 0.3 + (Math.random() * 0.7)
                                }} 
                            />
                       ))}
                   </div>

                   <div className="flex items-center justify-center gap-12">
                       <button 
                          onClick={() => setIsRecording(false)} 
                          className="px-6 py-3 rounded-full text-text-secondary hover:bg-stone-100 transition-colors font-medium text-sm tracking-wide"
                       >
                           Cancel
                       </button>

                       <button 
                           onClick={handleStopRecording}
                           className="group relative flex items-center justify-center"
                       >
                           <div className="absolute inset-0 rounded-full bg-sage/20 animate-ping opacity-75" />
                           <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-sage to-sage-dark hover:scale-105 transition-all shadow-xl shadow-sage/30 flex items-center justify-center text-white">
                                <div className="w-8 h-8 rounded-sm bg-white" />
                           </div>
                       </button>
                       
                       <button className="px-6 py-3 opacity-0 pointer-events-none">Cancel</button>
                   </div>
                   <p className="mt-12 text-text-muted text-xs uppercase tracking-widest font-bold">Tap to finish</p>
               </div>
           </div>
       )}
    </div>
  );
};

// --- QUICK JOT SESSION COMPONENT (Cleaner Stepper / Single View) ---
const QuickJotSession = ({ template, onBack, onComplete }: { template: any, onBack: () => void, onComplete: (title: string, content: string) => void }) => {
    // If it's a "Brain Dump" (single prompt), treat it differently than multi-question
    const isSinglePrompt = template.prompts.length === 1;
    const [answers, setAnswers] = useState<string[]>(new Array(template.prompts.length).fill(''));
    const [step, setStep] = useState(0);

    const handleSave = () => {
        const date = new Date().toLocaleDateString();
        const fullContent = answers.map((ans, i) => `**${template.prompts[i]}**\n${ans}`).join('\n\n');
        onComplete(`${template.title} - ${date}`, fullContent);
    };

    const handleNext = () => {
        if (step < template.prompts.length - 1) {
            setStep(step + 1);
        } else {
            handleSave();
        }
    };

    // SINGLE PROMPT VIEW (Brain Dump)
    if (isSinglePrompt) {
        return (
            <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col animate-fade-in">
                {/* Header */}
                <div className="p-6 flex items-center justify-between">
                    <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-text-secondary">
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-2 text-sage font-medium">
                        <template.icon size={18} />
                        <span className="uppercase tracking-widest text-xs font-bold">{template.title}</span>
                    </div>
                    <button onClick={handleSave} className="text-text-primary font-medium hover:text-sage-dark transition-colors">
                        Save
                    </button>
                </div>
                
                <div className="flex-1 max-w-3xl mx-auto w-full px-6 pb-20 pt-8 flex flex-col">
                    <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-8">{template.prompts[0]}</h2>
                    <textarea 
                        autoFocus
                        value={answers[0]}
                        onChange={(e) => setAnswers([e.target.value])}
                        className="flex-1 w-full bg-transparent border-none p-0 text-xl font-serif text-text-primary placeholder:text-stone-300 focus:ring-0 resize-none leading-relaxed"
                        placeholder="Just start writing..."
                    />
                </div>
            </div>
        );
    }

    // MULTI-STEP WIZARD VIEW (Morning Pages, etc.)
    const progress = ((step + 1) / template.prompts.length) * 100;

    return (
        <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col animate-fade-in">
             {/* Progress Bar */}
             <div className="w-full h-1 bg-stone-200">
                  <div className="h-full bg-sage transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
             </div>

             {/* Header */}
             <div className="px-6 py-6 flex justify-between items-center">
                 <button onClick={onBack} className="p-2 hover:bg-stone-200/50 rounded-full transition-colors">
                     <X size={24} className="text-text-secondary" />
                 </button>
                 <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    {template.title} {step + 1}/{template.prompts.length}
                 </span>
                 <div className="w-10" />
             </div>

             {/* Main Content */}
             <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
                 <div className="w-full animate-fade-up">
                     <h2 className="font-serif text-3xl md:text-4xl text-text-primary text-center leading-tight mb-12">
                         {template.prompts[step]}
                     </h2>
                     
                     <div className="relative">
                         <textarea 
                            autoFocus
                            key={step} // Force re-render/focus on step change
                            value={answers[step]}
                            onChange={(e) => {
                                const newAnswers = [...answers];
                                newAnswers[step] = e.target.value;
                                setAnswers(newAnswers);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleNext();
                                }
                            }}
                            className="w-full bg-transparent border-b-2 border-stone-200 p-4 text-xl md:text-2xl text-center text-text-primary placeholder:text-stone-300 focus:outline-none focus:border-sage transition-colors resize-none min-h-[150px]"
                            placeholder="Type your answer..."
                         />
                     </div>
                 </div>
             </div>

             {/* Footer Controls */}
             <div className="p-6 pb-12 flex justify-center">
                 <button 
                    onClick={handleNext}
                    disabled={!answers[step].trim()}
                    className="group flex items-center gap-3 px-8 py-4 bg-sage text-white rounded-full text-lg font-medium shadow-xl hover:bg-sage-dark hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                 >
                    {step === template.prompts.length - 1 ? 'Save Entry' : 'Next'} 
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </button>
             </div>
        </div>
    )
}

// --- GUIDED REFLECTION SESSION (Sequential Wizard - Replaces Chat) ---
const GuidedReflectionSession = ({ category, onClose, onComplete }: { category: PromptCategory, onClose: () => void, onComplete: (title: string, content: string) => void }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>(new Array(category.prompts.length).fill(''));
    const [isConnecting, setIsConnecting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // If step > length, show summary screen
    const isSummaryStep = step === category.prompts.length;

    const handleNext = () => {
        setIsConnecting(true);
        // Simulate "Thinking/Connecting" pause
        setTimeout(() => {
            setIsConnecting(false);
            if (step < category.prompts.length) {
                setStep(step + 1);
            }
        }, 800);
    };

    const handleFinish = () => {
        const date = new Date().toLocaleDateString();
        let fullContent = `## ${category.title} Reflection\n\n`;
        category.prompts.forEach((q, i) => {
            fullContent += `**${q}**\n${answers[i]}\n\n`;
        });
        onComplete(`${category.title} - ${date}`, fullContent);
    };

    if (isSummaryStep) {
        return (
            <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in">
                        <Check size={40} />
                    </div>
                    <h2 className="font-serif text-4xl text-text-primary mb-4">Clarity Found</h2>
                    <p className="text-text-secondary mb-12 text-lg">
                        You've unpacked your thoughts on {category.title}. Ready to save this reflection?
                    </p>
                    <button 
                        onClick={handleFinish}
                        className="w-full py-4 bg-sage text-white rounded-full text-lg font-medium shadow-xl hover:bg-sage-dark hover:scale-105 transition-all"
                    >
                        Save Reflection
                    </button>
                    <button 
                        onClick={onClose} 
                        className="mt-6 text-sm text-text-muted hover:text-text-secondary transition-colors"
                    >
                        Discard
                    </button>
                </div>
            </div>
        )
    }

    const progress = ((step + 1) / category.prompts.length) * 100;

    return (
        <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col animate-fade-in">
            {/* Sage Progress Bar */}
            <div className="w-full h-1 bg-stone-200">
                <div className="h-full bg-sage transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>

            {/* Header */}
            <div className="px-6 py-6 flex justify-between items-center">
                <button onClick={onClose} className="p-2 hover:bg-stone-200/50 rounded-full transition-colors text-text-secondary">
                    <X size={24} />
                </button>
                <div className="flex items-center gap-2 text-sage-dark font-medium">
                    <category.icon size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">{category.title}</span>
                </div>
                <div className="w-10" />
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full relative">
                
                {/* Transition State */}
                {isConnecting ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#faf9f7] z-10 animate-fade-in">
                        <div className="flex gap-2 mb-4">
                            <span className="w-3 h-3 bg-sage rounded-full animate-bounce" />
                            <span className="w-3 h-3 bg-sage rounded-full animate-bounce delay-100" />
                            <span className="w-3 h-3 bg-sage rounded-full animate-bounce delay-200" />
                        </div>
                        <p className="text-sage font-serif italic text-lg">Connecting...</p>
                    </div>
                ) : (
                    <div className="w-full animate-fade-up">
                        <h2 className="font-serif text-3xl md:text-5xl text-text-primary text-center leading-tight mb-16 px-4">
                            {category.prompts[step]}
                        </h2>
                        
                        <div className="relative max-w-2xl mx-auto">
                            <textarea 
                                autoFocus
                                key={step} // Reset state on step change
                                value={answers[step]}
                                onChange={(e) => {
                                    const newAnswers = [...answers];
                                    newAnswers[step] = e.target.value;
                                    setAnswers(newAnswers);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleNext();
                                    }
                                }}
                                className="w-full bg-transparent border-b-2 border-stone-200 p-4 text-xl md:text-2xl text-center text-text-primary placeholder:text-stone-300 focus:outline-none focus:border-sage transition-colors resize-none min-h-[150px]"
                                placeholder="Type here..."
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 pb-12 flex justify-center">
                {!isConnecting && (
                    <button 
                        onClick={handleNext}
                        disabled={!answers[step]?.trim()}
                        className="group flex items-center gap-3 px-8 py-4 bg-sage text-white rounded-full text-lg font-medium shadow-xl hover:bg-sage-dark hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {step === category.prompts.length - 1 ? 'Finish' : 'Next'} 
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
};

// --- SUB COMPONENTS ---

const ModeSelection = ({ onSelect, onClose }: any) => (
   <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center p-6 relative animate-fade-up">
      <button onClick={onClose} className="absolute top-8 left-8 p-3 rounded-full bg-white border border-stone-200 text-text-secondary hover:scale-105 transition-all shadow-sm">
         <X size={24} />
      </button>

      <div className="text-center mb-12 max-w-lg pt-12 md:pt-0">
         <h2 className="font-serif text-4xl md:text-5xl text-text-primary mb-4">How would you like to begin?</h2>
         <p className="text-text-secondary text-lg font-light">Choose the space that matches your mind right now.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl px-4 overflow-y-auto max-h-[70vh] pb-10">
         <SelectionCard 
            icon={Feather} 
            title="Free Flow" 
            desc="Just write without constraints."
            onClick={() => onSelect('free')}
            delay="0ms"
         />
         <SelectionCard 
            icon={Zap} 
            title="Quick Jot" 
            desc="Use a template for fast capture."
            onClick={() => onSelect('quick-menu')} 
            delay="100ms"
         />
         <SelectionCard 
            icon={Mic} 
            title="Voice Note" 
            desc="Speak your mind freely."
            onClick={() => onSelect('voice')}
            delay="150ms"
         />
         <SelectionCard 
            icon={Sparkles} 
            title="Guided Reflection" 
            desc="Deep dives into specific topics."
            onClick={() => onSelect('guided-menu')}
            delay="200ms"
         />
         <SelectionCard 
            icon={Target} 
            title="Goal Setting" 
            desc="Plan with structured questions."
            onClick={() => onSelect('goals')} 
            delay="250ms"
         />
         <SelectionCard 
            icon={Compass} 
            title="Self Discovery" 
            desc="Uncover insights about yourself."
            onClick={() => onSelect('discovery')}
            delay="300ms"
         />
      </div>
   </div>
);

const SelectionCard = ({ icon: Icon, title, desc, onClick, delay }: any) => (
   <button 
      onClick={onClick}
      className="group flex flex-col items-start gap-4 p-8 bg-white rounded-[32px] border border-stone-200 shadow-sm hover:shadow-card-hover hover:border-sage/20 hover:-translate-y-1 transition-all duration-300 text-left animate-fade-up h-full"
      style={{ animationDelay: delay }}
   >
      <div className="w-14 h-14 rounded-2xl bg-stone-50 text-sage flex items-center justify-center group-hover:scale-110 group-hover:bg-sage group-hover:text-white transition-all duration-500 shrink-0">
         <Icon size={24} strokeWidth={1.5} />
      </div>
      <div>
         <h3 className="font-serif text-xl text-text-primary mb-1 group-hover:text-sage-dark transition-colors">{title}</h3>
         <p className="text-sm text-text-secondary font-light leading-relaxed">{desc}</p>
      </div>
   </button>
);

const DockPill = ({ icon: Icon, label, isActive, onClick }: any) => (
   <button 
      onClick={onClick}
      className={`
         h-10 px-4 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wide transition-all border whitespace-nowrap
         ${isActive 
            ? 'bg-sage text-white border-sage shadow-md shadow-sage/20' 
            : 'bg-white text-text-secondary border-stone-200 hover:border-stone-300 hover:bg-stone-50'}
      `}
   >
      <Icon size={14} strokeWidth={2.5} />
      {label}
   </button>
);

const IconButton = ({ icon: Icon, onClick, active, tooltip }: any) => (
   <button 
      onClick={onClick}
      title={tooltip}
      className={`
        w-10 h-10 rounded-full border flex items-center justify-center transition-all shrink-0
        ${active 
            ? 'bg-red-500 text-white border-red-500 animate-pulse' 
            : 'bg-white border-stone-200 text-stone-500 hover:text-text-primary hover:border-stone-300'}
      `}
   >
      <Icon size={18} strokeWidth={1.5} />
   </button>
)

export default Editor;
