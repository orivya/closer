import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from '../../types';
import { Scale, Plus, ThumbsUp, ThumbsDown, PenTool, BookOpen, AlertCircle, ChevronLeft, Trash2, CheckCircle, BrainCircuit, X } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';
import { DecisionLabService, Decision } from '../../services/decisionLab';
import { toast } from '../../hooks/use-toast';
import { useDebounce } from '../../hooks/use-debounce';

// Input Modal Component for simple text inputs
interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  placeholder?: string;
  buttonLabel?: string;
}

const InputModal: React.FC<InputModalProps> = ({ isOpen, onClose, onSubmit, title, placeholder, buttonLabel = 'Add' }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] p-6 max-w-md w-full animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-text-primary rounded-full hover:bg-stone-100 transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="font-serif text-xl text-text-primary mb-4">{title}</h3>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-text-primary placeholder:text-stone-300 focus:outline-none focus:border-sage transition-colors mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-stone-100 text-text-secondary rounded-full font-medium hover:bg-stone-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="flex-1 px-6 py-3 bg-sage text-white rounded-full font-medium disabled:opacity-50 hover:bg-sage-dark transition-colors"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] p-6 max-w-sm w-full animate-scale-in text-center">
        <div className={`w-14 h-14 rounded-full ${danger ? 'bg-red-50' : 'bg-amber-50'} flex items-center justify-center mx-auto mb-4`}>
          {danger ? <Trash2 size={24} className="text-red-500" /> : <AlertCircle size={24} className="text-amber-500" />}
        </div>
        <h3 className="font-serif text-xl text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-stone-100 text-text-secondary rounded-full font-medium hover:bg-stone-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-6 py-3 ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'} text-white rounded-full font-medium transition-colors`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

interface DecisionLabProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const DecisionLab: React.FC<DecisionLabProps> = ({ onChangeView }) => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [activeDecision, setActiveDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadDecisions();
  }, []);

  const loadDecisions = async () => {
    try {
      const data = await DecisionLabService.getDecisions();
      setDecisions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (title: string) => {
    try {
      const newDecision = await DecisionLabService.createDecision(title);
      setDecisions([newDecision, ...decisions]);
      setActiveDecision(newDecision);
    } catch (e) {
      toast({ title: "Error", description: "Could not start decision", variant: "destructive" });
    }
  };

  if (activeDecision) {
    return (
      <DecisionEditor
        decision={activeDecision}
        onChangeView={onChangeView}
        onBack={() => { setActiveDecision(null); loadDecisions(); }}
        onUpdate={(updated) => {
          setActiveDecision(updated);
          setDecisions(decisions.map(d => d.id === updated.id ? updated : d));
        }}
        onDelete={async () => {
          await DecisionLabService.deleteDecision(activeDecision.id);
          setDecisions(decisions.filter(d => d.id !== activeDecision.id));
          setActiveDecision(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-up pb-20">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-amber-50/50 text-amber-600 flex items-center justify-center mx-auto mb-6 border border-amber-100">
          <Scale size={28} strokeWidth={1.5} />
        </div>
        <h2 className="font-serif text-3xl font-medium text-text-primary mb-2">Decision Lab</h2>
        <p className="text-text-secondary font-light">Structure your thinking to find clarity</p>
      </div>

      {decisions.length > 0 && (
        <div className="flex justify-center mb-12">
          <button
            onClick={handleCreate}
            className="px-8 py-3 bg-text-primary text-white rounded-full font-medium shadow-lg hover:bg-black transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New Decision
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {decisions.map(d => (
          <div
            key={d.id}
            onClick={() => setActiveDecision(d)}
            className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-amber-400/50 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <h3 className="font-serif text-xl text-text-primary mb-1">{d.title}</h3>
              <div className="flex gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1"><ThumbsUp size={12} /> {d.pros?.length || 0} Pros</span>
                <span className="flex items-center gap-1"><ThumbsDown size={12} /> {d.cons?.length || 0} Cons</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-stone-50 text-stone-300 flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
              <ChevronLeft size={16} className="rotate-180" />
            </div>
          </div>
        ))}
        {decisions.length === 0 && !isLoading && (
          <EmptyState
            icon={BrainCircuit}
            title="Clear your mind"
            description="Use the Decision Lab to weigh pros and cons, visualize outcomes, and make choices with confidence."
            actionLabel="Start a New Decision"
            onAction={handleCreate}
            variant="card"
            iconColor="sage"
          />
        )}
      </div>

      {/* Create Decision Modal */}
      <InputModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
        title="What are you trying to decide?"
        placeholder="e.g., Should I take the new job offer?"
        buttonLabel="Start Decision"
      />
    </div>
  );
};

// --- EDITOR COMPONENT ---

const DecisionEditor = ({ decision, onChangeView, onBack, onUpdate, onDelete }: any) => {
  const [title, setTitle] = useState(decision.title);
  const [debouncedTitle] = useDebounce(title, 1000);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showProModal, setShowProModal] = useState(false);
  const [showConModal, setShowConModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [title]);

  useEffect(() => {
    if (debouncedTitle !== decision.title) {
      save({ title: debouncedTitle });
    }
  }, [debouncedTitle]);

  const save = async (updates: Partial<Decision>) => {
    try {
      const updated = await DecisionLabService.updateDecision(decision.id, updates);
      onUpdate(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const addPro = (text: string) => {
    save({ pros: [...(decision.pros || []), text] });
  };

  const addCon = (text: string) => {
    save({ cons: [...(decision.cons || []), text] });
  };

  const removePro = (idx: number) => {
    const newPros = [...(decision.pros || [])];
    newPros.splice(idx, 1);
    save({ pros: newPros });
  };

  const removeCon = (idx: number) => {
    const newCons = [...(decision.cons || [])];
    newCons.splice(idx, 1);
    save({ cons: newCons });
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <button onClick={onBack} className="flex items-center gap-2 text-stone-400 hover:text-text-primary mb-6 transition-colors">
        <ChevronLeft size={18} /> Back to Lab
      </button>

      <div className="mb-12 relative group">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-3 text-center">Deciding on</label>
        <textarea
          ref={textareaRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={1}
          className="w-full text-center font-serif text-2xl lg:text-3xl text-text-primary border-b-2 border-stone-200 focus:border-sage bg-transparent pb-4 focus:outline-none transition-colors resize-none overflow-hidden"
        />
        <button onClick={handleDeleteClick} className="absolute top-0 right-0 p-2 text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Pros */}
        <div className="bg-white p-8 rounded-[32px] border-t-4 border-t-sage border-r border-b border-l border-stone-200/60 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-sage-dark font-medium justify-center md:justify-start">
            <ThumbsUp size={18} />
            <span>Reasons For</span>
          </div>
          <ul className="space-y-3 mb-6">
            {(decision.pros || []).map((pro: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary group">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-dark mt-1.5 shrink-0" />
                <span className="flex-1">{pro}</span>
                <button onClick={() => removePro(i)} className="text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowProModal(true)} className="w-full py-3 border border-dashed border-stone-300 rounded-xl text-sm text-text-muted hover:text-sage-dark hover:border-sage transition-colors flex items-center justify-center gap-2">
            <Plus size={16} /> Add Reason
          </button>
        </div>

        {/* Cons */}
        <div className="bg-white p-8 rounded-[32px] border-t-4 border-t-clay border-r border-b border-l border-stone-200/60 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-clay font-medium justify-center md:justify-start">
            <ThumbsDown size={18} />
            <span>Reasons Against</span>
          </div>
          <ul className="space-y-3 mb-6">
            {(decision.cons || []).map((con: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary group">
                <span className="w-1.5 h-1.5 rounded-full bg-clay mt-1.5 shrink-0" />
                <span className="flex-1">{con}</span>
                <button onClick={() => removeCon(i)} className="text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowConModal(true)} className="w-full py-3 border border-dashed border-stone-300 rounded-xl text-sm text-text-muted hover:text-clay hover:border-clay transition-colors flex items-center justify-center gap-2">
            <Plus size={16} /> Add Reason
          </button>
        </div>
      </div>

      <h3 className="font-serif text-xl text-text-primary mb-6 text-center">Deepening Tools</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ToolCard
          icon={PenTool}
          title="Letter to Future Self"
          desc="Write to yourself 6 months from now about this choice."
          onClick={() => onChangeView(ViewState.EDITOR, { prompt: `Letter to myself 6 months after deciding: "${decision.title}"` })}
        />
        <ToolCard
          icon={BookOpen}
          title="Mentor's Advice"
          desc="What would your wisest mentor tell you to do?"
          onClick={() => onChangeView(ViewState.EDITOR, { prompt: `What would my mentor say about: "${decision.title}"?` })}
        />
        <ToolCard
          icon={AlertCircle}
          title="Fear Setting"
          desc="What exactly are you afraid will happen?"
          onClick={() => onChangeView(ViewState.EDITOR, { prompt: `Defining the fears around: "${decision.title}"` })}
        />
      </div>

      {/* Add Pro Modal */}
      <InputModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        onSubmit={addPro}
        title="Add a reason for"
        placeholder="Why is this a good choice?"
        buttonLabel="Add"
      />

      {/* Add Con Modal */}
      <InputModal
        isOpen={showConModal}
        onClose={() => setShowConModal(false)}
        onSubmit={addCon}
        title="Add a reason against"
        placeholder="What's a potential downside?"
        buttonLabel="Add"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={onDelete}
        title="Delete Decision?"
        message="This will permanently delete this decision log and all its pros and cons."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
};

const ToolCard = ({ icon: Icon, title, desc, onClick }: any) => (
  <button
    onClick={onClick}
    className="bg-white p-6 rounded-2xl border border-stone-200 text-left hover:border-sage/40 hover:shadow-md transition-all group"
  >
    <div className="w-10 h-10 rounded-xl bg-stone-50 text-text-muted flex items-center justify-center mb-4 group-hover:bg-sage/10 group-hover:text-sage transition-colors">
      <Icon size={20} strokeWidth={1.5} />
    </div>
    <h4 className="font-medium text-text-primary mb-1">{title}</h4>
    <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
  </button>
)

export default DecisionLab;
