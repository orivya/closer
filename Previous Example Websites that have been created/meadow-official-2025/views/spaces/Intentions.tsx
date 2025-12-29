import React, { useEffect, useState } from 'react';
import { ViewState } from '../../types';
import { Target, Plus, ArrowRight, Heart, Briefcase, BookOpen, PenTool, TrendingUp, Lightbulb, Trash2, Loader2, X, Users, DollarSign, Palette } from 'lucide-react';
import { IntentionsService, Intention } from '../../services/intentions';
import { toast } from '../../hooks/use-toast';

// Intention Modal Component
interface IntentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; category: string }) => void;
  initialData?: Partial<Intention>;
}

const IntentionModal: React.FC<IntentionModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'personal');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setDescription(initialData?.description || '');
      setCategory(initialData?.category || 'personal');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const categories = [
    { id: 'personal', label: 'Personal', icon: Heart },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'relationships', label: 'Relationships', icon: Users },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'health', label: 'Health', icon: TrendingUp },
    { id: 'growth', label: 'Growth', icon: Lightbulb }
  ];

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), category });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[32px] p-8 max-w-lg w-full animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-stone-400 hover:text-text-primary rounded-full hover:bg-stone-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-sage/10 flex items-center justify-center mx-auto mb-4">
            <Target size={24} className="text-sage" />
          </div>
          <h2 className="font-serif text-2xl text-text-primary">
            {initialData ? 'Edit Intention' : 'Set New Intention'}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
              What's your intention?
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Be more present with family"
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-text-primary placeholder:text-stone-300 focus:outline-none focus:border-sage transition-colors"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
              Why does this matter? (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will achieving this mean for you?"
              rows={3}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-text-primary placeholder:text-stone-300 focus:outline-none focus:border-sage resize-none transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all
                    ${category === cat.id
                      ? 'bg-sage text-white'
                      : 'bg-stone-100 text-text-secondary hover:bg-stone-200'}
                  `}
                >
                  <cat.icon size={14} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-stone-100 text-text-secondary rounded-full font-medium hover:bg-stone-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="flex-1 px-6 py-3 bg-sage text-white rounded-full font-medium disabled:opacity-50 hover:bg-sage-dark transition-colors"
          >
            {initialData ? 'Save Changes' : 'Set Intention'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface IntentionsProps {
    onChangeView: (view: ViewState, data?: any) => void;
}

const Intentions: React.FC<IntentionsProps> = ({ onChangeView }) => {
    const [intentions, setIntentions] = useState<Intention[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [focusIntention, setFocusIntention] = useState<Intention | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        loadIntentions();
    }, []);

    const loadIntentions = async () => {
        try {
            const data = await IntentionsService.getIntentions();
            setIntentions(data);
            if (data.length > 0) setFocusIntention(data[0]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setShowModal(true);
    };

    const handleSaveIntention = async (data: { title: string; description: string; category: string }) => {
        try {
            setIsCreating(true);
            await IntentionsService.createIntention(data.title, data.description, data.category);
            await loadIntentions();
            toast({ title: "Intention set", description: "Your compass is set." });
        } catch (e) {
            toast({ title: "Error", description: "Failed to set intention", variant: "destructive" });
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setShowDeleteConfirm(id);
    };

    const confirmDelete = async (id: string) => {
        try {
            await IntentionsService.deleteIntention(id);
            setIntentions(prev => prev.filter(i => i.id !== id));
            if (focusIntention?.id === id) setFocusIntention(intentions.find(i => i.id !== id) || null);
            toast({ title: "Archived" });
        } catch (e) {
            console.error(e);
        } finally {
            setShowDeleteConfirm(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin text-sage" />
            </div>
        );
    }

    return (
        <div className="animate-fade-up max-w-4xl mx-auto pb-20">

            {/* Hero Header */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 border border-stone-200/60 shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Target size={18} className="text-sage" />
                        <span className="text-xs font-bold text-sage uppercase tracking-widest">North Star</span>
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-2">Intentions Hub</h2>
                    <p className="text-text-secondary font-light max-w-md">
                        Your compass. Align your daily actions with who you want to become.
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="px-6 py-3 bg-text-primary text-white rounded-full font-medium shadow-lg hover:bg-black transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                    <Plus size={18} /> {isCreating ? 'Setting...' : 'Set New Intention'}
                </button>
            </div>

            {focusIntention && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Focus Card - Highlighted */}
                    <div className="bg-gradient-to-br from-[#faf9f7] to-white p-8 rounded-[32px] border border-stone-200 shadow-card col-span-1 md:col-span-2 flex flex-col md:flex-row gap-8 relative group">
                        <button
                            onClick={(e) => handleDelete(e, focusIntention.id)}
                            className="absolute top-6 right-6 p-2 text-stone-300 hover:text-red-400 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Current Focus</span>
                            </div>
                            <h3 className="font-serif text-3xl text-text-primary mb-2">{focusIntention.title}</h3>
                            <p className="text-lg text-text-secondary font-light italic mb-6">"{focusIntention.description}"</p>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => onChangeView(ViewState.EDITOR, { prompt: `Reflecting on my intention of '${focusIntention.title}': What progress am I noticing?` })}
                                    className="px-5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-text-secondary hover:border-sage hover:text-sage-dark transition-all flex items-center gap-2"
                                >
                                    <PenTool size={14} /> Reflect
                                </button>
                            </div>
                        </div>

                        <div className="w-full md:w-64 bg-white rounded-2xl p-5 border border-stone-100 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-text-muted uppercase">Momentum</span>
                                <span className="text-sage-dark font-bold text-sm">{focusIntention.progress >= 50 ? 'High' : 'Building'}</span>
                            </div>
                            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden mb-4">
                                <div className="h-full bg-sage rounded-full" style={{ width: `${focusIntention.progress}%` }} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-sm text-text-secondary">
                                    <div className="w-8 h-8 rounded-lg bg-sage/10 text-sage-dark flex items-center justify-center"><BookOpen size={14} /></div>
                                    <span>{focusIntention.entryCount} Entries</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6 px-1">Active Intentions</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {intentions.filter(i => i.id !== focusIntention?.id).map(intention => {
                    const colors: any = {
                        clay: 'text-clay bg-clay/10 border-clay/20',
                        stone: 'text-text-secondary bg-stone-100 border-stone-200',
                        sage: 'text-sage-dark bg-sage/10 border-sage/20'
                    };
                    const theme = colors[intention.color || 'stone'] || colors.stone;

                    return (
                        <div
                            key={intention.id}
                            onClick={() => setFocusIntention(intention)}
                            className="bg-white p-6 rounded-[28px] border border-stone-200/60 hover:shadow-card hover:border-sage/30 transition-all cursor-pointer group flex flex-col relative"
                        >
                            <div className={`w-12 h-12 rounded-xl ${theme} flex items-center justify-center mb-4`}>
                                {intention.category === 'relationships' || intention.category === 'personal' ? <Heart size={20} /> : <Briefcase size={20} />}
                            </div>
                            <h4 className="font-serif text-xl text-text-primary mb-2 group-hover:text-sage-dark transition-colors">{intention.title}</h4>
                            <p className="text-sm text-text-secondary font-light leading-relaxed mb-6 line-clamp-2">{intention.description}</p>

                            <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{intention.entryCount} Entries</span>
                                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 group-hover:bg-text-primary group-hover:text-white transition-all">
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Add New Small Card */}
                <button
                    onClick={handleCreate}
                    className="border-2 border-dashed border-stone-200 rounded-[28px] flex flex-col items-center justify-center p-6 text-stone-300 hover:border-sage/40 hover:text-sage hover:bg-sage/5 transition-all min-h-[240px]"
                >
                    <Plus size={32} strokeWidth={1} className="mb-2" />
                    <span className="font-serif text-lg">Add Area</span>
                </button>
            </div>

            {/* Intention Modal */}
            <IntentionModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveIntention}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
                        onClick={() => setShowDeleteConfirm(null)}
                    />
                    <div className="relative bg-white rounded-[24px] p-8 max-w-sm w-full animate-scale-in text-center">
                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h3 className="font-serif text-xl text-text-primary mb-2">Archive Intention?</h3>
                        <p className="text-text-secondary text-sm mb-6">
                            This intention will be archived and hidden from your view.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 px-6 py-3 bg-stone-100 text-text-secondary rounded-full font-medium hover:bg-stone-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmDelete(showDeleteConfirm)}
                                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                            >
                                Archive
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Intentions;
