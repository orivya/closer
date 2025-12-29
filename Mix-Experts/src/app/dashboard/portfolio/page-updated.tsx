'use client';

import React, { useState } from 'react';
import { Plus, Music2 } from 'lucide-react';
import { Toaster } from 'sonner';

import { usePortfolioItems } from '@/hooks/usePortfolioItems';
import { AddPortfolioItemModal } from '@/components/portfolio/AddPortfolioItemModal';
import { PortfolioListWithDnd } from '@/components/portfolio/PortfolioListWithDnd';

export default function PortfolioPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const {
    portfolioItems,
    loading,
    deletePortfolioItem,
    reorderPortfolioItems,
    toggleFeatured,
  } = usePortfolioItems();

  const handleEdit = (id: string) => {
    const item = portfolioItems.find((i) => i.id === id);
    if (item) {
      setEditingItem(item);
      setIsAddModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      await deletePortfolioItem(id);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-8 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Music2 className="w-6 h-6" />
              </div>
              Portfolio Manager
            </h1>
            <p className="text-[var(--text-gray)]">
              Showcase your best work with Before & After audio comparisons.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all shadow-[0_0_20px_var(--accent-glow)] hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Portfolio Item
          </button>
        </div>

        {/* Portfolio List */}
        {loading ? (
          <div className="text-white">Loading portfolio...</div>
        ) : (
          <PortfolioListWithDnd
            items={portfolioItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReorder={reorderPortfolioItems}
            onToggleFeatured={toggleFeatured}
          />
        )}

        {/* Add/Edit Modal */}
        <AddPortfolioItemModal
          isOpen={isAddModalOpen}
          onClose={handleCloseModal}
          initialData={editingItem}
        />
      </div>
    </>
  );
}
