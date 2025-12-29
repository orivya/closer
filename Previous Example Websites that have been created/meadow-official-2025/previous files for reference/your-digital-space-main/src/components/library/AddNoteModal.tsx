import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: { title: string; content: string; category: string }) => void;
}

export function AddNoteModal({ isOpen, onClose, onSave }: AddNoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const handleSave = () => {
    if (content.trim()) {
      onSave({ title: title.trim(), content: content.trim(), category });
      setTitle("");
      setContent("");
      setCategory("");
      onClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setCategory("");
    onClose();
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] transition-all duration-150",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}
      onClick={handleClose}
    >
      <div 
        className={cn(
          "w-full max-w-[500px] mx-4 bg-elevated border border-border rounded-lg overflow-hidden transition-transform duration-200",
          isOpen ? "translate-y-0" : "translate-y-5"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-subtle flex items-center justify-between">
          <span className="text-base font-semibold text-foreground">New Note</span>
          <button 
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-sm text-text-muted hover:bg-hover hover:text-foreground transition-all duration-150 active:scale-[0.95]"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full p-4 mb-4 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-text-muted focus:border-sage-muted transition-all duration-150 outline-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your reflection, observation, or reminder..."
            className="w-full min-h-[120px] p-4 mb-4 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-text-muted resize-y leading-relaxed focus:border-sage-muted transition-all duration-150 outline-none"
            autoFocus
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-background border border-border rounded-sm text-[13px] text-muted-foreground focus:border-sage-muted transition-all duration-150 outline-none"
          >
            <option value="">Select category (optional)</option>
            <option value="Self">Self</option>
            <option value="Work">Work</option>
            <option value="Relationships">Relationships</option>
            <option value="Health">Health</option>
            <option value="Growth">Growth</option>
          </select>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-subtle flex justify-end gap-3">
          <button 
            onClick={handleClose}
            className="px-4 py-2 bg-transparent border border-border rounded-sm text-[13px] text-muted-foreground hover:bg-hover hover:text-foreground transition-all duration-150 active:scale-[0.97]"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!content.trim()}
            className="px-4 py-2 bg-sage border border-sage rounded-sm text-[13px] font-medium text-white hover:bg-sage-light transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
