import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
}

export function NoteModal({ isOpen, onClose, onSave }: NoteModalProps) {
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (note.trim()) {
      onSave(note.trim());
      setNote("");
      onClose();
    }
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] transition-all duration-300",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}
      onClick={onClose}
    >
      <div 
        className={cn(
          "w-[90%] max-w-[480px] bg-elevated border border-border rounded-lg overflow-hidden transition-transform duration-300",
          isOpen ? "translate-y-0" : "translate-y-5"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-subtle flex items-center justify-between">
          <span className="text-[15px] font-semibold text-foreground">Add a Note</span>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-sm text-text-muted hover:bg-hover hover:text-foreground transition-all duration-150"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a personal reflection, reminder, or observation..."
            className="w-full min-h-[120px] p-4 bg-surface border border-border rounded-md text-sm text-foreground placeholder:text-text-muted resize-y focus:border-sage-muted focus:ring-[3px] focus:ring-sage-subtle transition-all duration-150 outline-none"
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-subtle flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-transparent border border-border rounded-sm text-[13px] text-muted-foreground hover:bg-hover hover:text-foreground transition-all duration-150 active:scale-[0.97]"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-sage border border-sage rounded-sm text-[13px] font-medium text-white hover:bg-sage-light transition-all duration-150 active:scale-[0.97]"
          >
            Save to Library
          </button>
        </div>
      </div>
    </div>
  );
}
