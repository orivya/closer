import React, { useState, useEffect } from 'react';
import { ArrowLeft, Moon, Star, Cloud, Plus, Search, Sparkles, X, Tag, Loader2, BookOpen, BarChart2 } from 'lucide-react';
import { ViewState } from '../../types';
import { DreamsService, Dream } from '../../services/dreams';

interface DreamJournalProps {
  onChangeView: (view: ViewState) => void;
}

type DreamTab = 'capture' | 'journal' | 'patterns';

const COMMON_SYMBOLS = ['Water', 'Flying', 'Falling', 'Chasing', 'House', 'Animals', 'Vehicle', 'Nature', 'Death', 'Birth'];
const DREAM_EMOTIONS = ['Peaceful', 'Anxious', 'Happy', 'Scared', 'Confused', 'Excited', 'Sad', 'Angry', 'Curious', 'Loved'];
const DREAM_THEMES = ['Adventure', 'Conflict', 'Reunion', 'Loss', 'Discovery', 'Transformation', 'Warning', 'Celebration'];

export default function DreamJournal({ onChangeView }: DreamJournalProps) {
  const [activeTab, setActiveTab] = useState<DreamTab>('capture');
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [newDream, setNewDream] = useState('');
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [peopleInput, setPeopleInput] = useState('');
  const [people, setPeople] = useState<string[]>([]);
  const [step, setStep] = useState<'write' | 'tag' | 'reflect'>('write');
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDreams = async () => {
      setLoading(true);
      try {
        const fetchedDreams = await DreamsService.getDreams();
        setDreams(fetchedDreams);
      } catch (error) {
        console.error('Error loading dreams:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDreams();
  }, []);

  const handleAddPerson = () => {
    if (peopleInput.trim() && !people.includes(peopleInput.trim())) {
      setPeople([...people, peopleInput.trim()]);
      setPeopleInput('');
    }
  };

  const toggleSymbol = (symbol: string) => {
    setSelectedSymbols(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
    );
  };

  const handleSaveDream = async () => {
    if (!newDream.trim() || saving) return;

    setSaving(true);
    try {
      const savedDream = await DreamsService.createDream({
        content: newDream,
        symbols: selectedSymbols,
        emotions: selectedEmotions,
        people,
        theme: selectedTheme || undefined,
        interpretation: interpretation || undefined,
      });

      if (savedDream) {
        setDreams([savedDream, ...dreams]);
      }

      // Reset form
      setNewDream('');
      setSelectedSymbols([]);
      setSelectedEmotions([]);
      setSelectedTheme('');
      setPeople([]);
      setInterpretation('');
      setStep('write');
      setActiveTab('journal');
    } catch (error) {
      console.error('Error saving dream:', error);
    } finally {
      setSaving(false);
    }
  };

  const getRecurringSymbols = () => {
    const symbolCounts: Record<string, number> = {};
    dreams.forEach(dream => {
      dream.symbols.forEach(symbol => {
        symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
      });
    });
    return Object.entries(symbolCounts)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const getEmotionDistribution = () => {
    const emotionCounts: Record<string, number> = {};
    dreams.forEach(dream => {
      dream.emotions.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });
    const total = Object.values(emotionCounts).reduce((a, b) => a + b, 0);
    return Object.entries(emotionCounts)
      .map(([emotion, count]) => ({ emotion, count, percent: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-stone-950 pb-28 lg:pb-10 font-sans text-stone-50">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-sage-900/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-800/20 blur-[100px]" />
      </div>

      {/* Textured Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.4] bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] mix-blend-multiply" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8 px-6 pt-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onChangeView(ViewState.EXPLORE)}
            className="w-10 h-10 rounded-full bg-stone-800/50 text-stone-400 hover:bg-stone-800 hover:text-white flex items-center justify-center transition-all backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-serif text-3xl text-stone-100 flex items-center gap-3">
              <Moon className="text-sage-400" size={28} strokeWidth={1.5} />
              Dream Journal
            </h1>
            <p className="text-stone-500 text-sm font-serif italic">Capture the subconscious</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center pb-4 relative z-10">
        <div className="flex bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md">
          {(['capture', 'journal', 'patterns'] as DreamTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab
                ? 'bg-sage-600 text-white shadow-lg shadow-sage-900/20'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {tab === 'capture' && <Moon size={14} />}
              {tab === 'journal' && <BookOpen size={14} />}
              {tab === 'patterns' && <BarChart2 size={14} />}
              <span>{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-2xl mx-auto relative z-10">

        {/* CAPTURE TAB */}
        {activeTab === 'capture' && (
          <div className="space-y-8 animate-fade-up">
            {step === 'write' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="font-serif text-3xl text-white mb-2">Morning Record</h2>
                  <p className="text-stone-400 font-serif italic">Capture the details before they fade.</p>
                </div>

                <div className="bg-white/5 rounded-3xl p-1 border border-white/10 shadow-xl shadow-black/20">
                  <textarea
                    value={newDream}
                    onChange={(e) => setNewDream(e.target.value)}
                    placeholder="I was in a strange house..."
                    autoFocus
                    className="w-full h-64 bg-transparent rounded-2xl p-6 text-stone-50 placeholder-stone-600 focus:outline-none resize-none font-serif text-xl leading-relaxed"
                  />
                </div>

                <button
                  onClick={() => newDream.trim() && setStep('tag')}
                  disabled={!newDream.trim()}
                  className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all ${newDream.trim()
                    ? 'bg-sage-600 text-white hover:bg-sage-500 shadow-lg shadow-sage-900/20'
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }`}
                >
                  Analyze Dream
                </button>
              </div>
            )}

            {step === 'tag' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl text-white">Tag Details</h2>
                  <button
                    onClick={() => setStep('write')}
                    className="text-xs font-bold text-sage-400 hover:text-sage-300 uppercase tracking-widest"
                  >
                    Edit Text
                  </button>
                </div>

                {/* Symbols */}
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                    <Tag size={14} /> Symbols
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_SYMBOLS.map(symbol => (
                      <button
                        key={symbol}
                        onClick={() => toggleSymbol(symbol)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all border ${selectedSymbols.includes(symbol)
                          ? 'bg-sage-500/20 border-sage-500 text-white'
                          : 'bg-transparent border-white/10 text-stone-400 hover:border-white/30'
                          }`}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emotions */}
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                    <Sparkles size={14} /> Emotions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DREAM_EMOTIONS.map(emotion => (
                      <button
                        key={emotion}
                        onClick={() => toggleEmotion(emotion)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all border ${selectedEmotions.includes(emotion)
                          ? 'bg-sage-500/20 border-sage-500 text-white'
                          : 'bg-transparent border-white/10 text-stone-400 hover:border-white/30'
                          }`}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme */}
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                    <Cloud size={14} /> Theme
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DREAM_THEMES.map(theme => (
                      <button
                        key={theme}
                        onClick={() => setSelectedTheme(selectedTheme === theme ? '' : theme)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all border ${selectedTheme === theme
                          ? 'bg-sage-500/20 border-sage-500 text-white'
                          : 'bg-transparent border-white/10 text-stone-400 hover:border-white/30'
                          }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep('reflect')}
                  className="w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs bg-sage-600 text-white hover:bg-sage-500 shadow-lg shadow-sage-900/20 transition-all"
                >
                  Add Interpretation
                </button>
              </div>
            )}

            {step === 'reflect' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl text-white">Reflection</h2>
                  <button
                    onClick={() => setStep('tag')}
                    className="text-xs font-bold text-sage-400 hover:text-sage-300 uppercase tracking-widest"
                  >
                    Back
                  </button>
                </div>

                <div className="bg-black/20 rounded-3xl p-8 border border-white/10 italic font-serif text-stone-300 leading-relaxed">
                  "{newDream.slice(0, 150)}{newDream.length > 150 ? '...' : ''}"
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sage-300" />
                    <span className="text-xs font-bold uppercase tracking-widest text-sage-300">Meaning</span>
                  </div>
                  <div className="bg-white/5 rounded-3xl p-1 border border-white/10">
                    <textarea
                      value={interpretation}
                      onChange={(e) => setInterpretation(e.target.value)}
                      placeholder="What do you think this dream was telling you?"
                      className="w-full h-32 bg-transparent rounded-2xl p-6 text-stone-100 placeholder-stone-600 focus:outline-none resize-none text-lg"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveDream}
                  disabled={saving}
                  className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${saving ? 'bg-sage-600/50 cursor-wait' : 'bg-sage-600 hover:bg-sage-500 shadow-lg shadow-sage-900/20'
                    }`}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                  {saving ? 'Recording...' : 'Save to Journal'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* JOURNAL TAB */}
        {activeTab === 'journal' && (
          <div className="space-y-6 animate-fade-up">
            {loading ? (
              <div className="text-center py-20 opacity-50">
                <Loader2 className="w-8 h-8 text-sage-400 mx-auto mb-4 animate-spin" />
                <p className="text-xs text-sage-400 font-bold uppercase tracking-widest">Opening Journal...</p>
              </div>
            ) : dreams.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl">
                <Moon className="w-12 h-12 text-sage-500/50 mx-auto mb-4" />
                <p className="text-stone-400 font-serif italic mb-6">No dreams recorded yet.</p>
                <button
                  onClick={() => setActiveTab('capture')}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-stone-300 rounded-full hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
                >
                  Record a Dream
                </button>
              </div>
            ) : (
              dreams.map(dream => (
                <div key={dream.id} className="bg-white/5 rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-sage-400 uppercase tracking-widest">
                      {new Date(dream.created_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {dream.theme && (
                      <span className="px-3 py-1 bg-sage-500/20 border border-sage-500/30 rounded-full text-[10px] font-bold text-sage-300 uppercase tracking-wider">
                        {dream.theme}
                      </span>
                    )}
                  </div>

                  <p className="font-serif text-lg text-stone-200 mb-4 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                    {dream.content}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {dream.symbols.map(s => (
                      <span key={s} className="px-2 py-1 bg-white/5 rounded-lg text-xs text-stone-400 border border-white/5">{s}</span>
                    ))}
                    {dream.emotions.map(e => (
                      <span key={e} className="px-2 py-1 bg-stone-500/20 rounded-lg text-xs text-stone-300 border border-stone-500/20">{e}</span>
                    ))}
                  </div>

                  {dream.interpretation && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles size={12} className="text-sage-300/50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-sage-300/50">Meaning</span>
                      </div>
                      <p className="text-sm text-stone-400 italic">{dream.interpretation}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* PATTERNS TAB */}
        {activeTab === 'patterns' && (
          <div className="space-y-6 animate-fade-up">
            {dreams.length < 3 ? (
              <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl">
                <BarChart2 className="w-12 h-12 text-sage-500/50 mx-auto mb-4" />
                <p className="text-stone-400 font-serif italic">Capture at least 3 dreams to unlock patterns.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sage-700 rounded-3xl p-6 text-center text-white shadow-lg shadow-black/20">
                    <span className="text-4xl font-serif block mb-2">{dreams.length}</span>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Dreams</p>
                  </div>
                  <div className="bg-stone-700 rounded-3xl p-6 text-center text-white shadow-lg shadow-black/20">
                    <span className="text-4xl font-serif block mb-2">
                      {new Set(dreams.flatMap(d => d.symbols)).size}
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Symbols</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                    <Tag size={14} /> Recurring Symbols
                  </h3>
                  {getRecurringSymbols().length > 0 ? (
                    <div className="space-y-4">
                      {getRecurringSymbols().map(([symbol, count]) => (
                        <div key={symbol} className="group">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-stone-300">{symbol}</span>
                            <span className="text-stone-500">{count} occurrences</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-sage-500 rounded-full" style={{ width: `${(count / dreams.length) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-500 italic">No strong patterns yet.</p>
                  )}
                </div>

                <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                    <Sparkles size={14} /> Emotional Tone
                  </h3>
                  <div className="space-y-4">
                    {getEmotionDistribution().map(({ emotion, percent }) => (
                      <div key={emotion}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-stone-300">{emotion}</span>
                          <span className="text-stone-500">{percent}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-sage-500 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
