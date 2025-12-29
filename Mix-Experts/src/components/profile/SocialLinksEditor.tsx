'use client';

import React, { useState } from 'react';
import { Globe, Instagram, Twitter, Facebook, Linkedin, Youtube, Plus, X, GripVertical } from 'lucide-react';
import { useSocialLinks } from '@/hooks/useSocialLinks';
import { cn } from '@/lib/utils';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'pink-500' },
  { value: 'twitter', label: 'Twitter/X', icon: Twitter, color: 'blue-400' },
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'blue-600' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'blue-700' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'red-600' },
  { value: 'website', label: 'Website', icon: Globe, color: 'purple-500' },
];

export function SocialLinksEditor() {
  const { socialLinks, loading, addSocialLink, updateSocialLink, deleteSocialLink } = useSocialLinks();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlatform, setNewPlatform] = useState('instagram');
  const [newUrl, setNewUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');

  const handleAddLink = async () => {
    if (!newUrl.trim()) return;

    const success = await addSocialLink(newPlatform, newUrl);
    if (success) {
      setNewUrl('');
      setShowAddForm(false);
    }
  };

  const handleUpdateLink = async (id: string) => {
    if (!editUrl.trim()) return;

    const success = await updateSocialLink(id, editUrl);
    if (success) {
      setEditingId(null);
      setEditUrl('');
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (confirm('Are you sure you want to remove this link?')) {
      await deleteSocialLink(id);
    }
  };

  const getPlatformInfo = (platformValue: string) => {
    return PLATFORMS.find(p => p.value === platformValue) || PLATFORMS[5]; // Default to website
  };

  if (loading) {
    return <div className="text-[var(--text-muted)]">Loading social links...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-[var(--accent)]" />
          Social & Links
        </h4>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl p-4 space-y-3">
          <select
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--accent)]"
          >
            {PLATFORMS.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--accent)]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddLink}
              className="flex-1 px-4 py-2 bg-[var(--accent)] text-white font-medium rounded-lg hover:bg-[var(--accent-light)] transition-colors text-sm"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewUrl('');
              }}
              className="px-4 py-2 bg-[var(--bg-elevated)] text-[var(--text-gray)] font-medium rounded-lg hover:bg-[var(--bg-card)] transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-2">
        {socialLinks.map((link) => {
          const platform = getPlatformInfo(link.platform);
          const Icon = platform.icon;
          const isEditing = editingId === link.id;

          return (
            <div
              key={link.id}
              className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl p-3"
            >
              <GripVertical className="w-4 h-4 text-[var(--text-muted)] cursor-move" />
              <div className={cn('text-' + platform.color)}>
                <Icon className="w-5 h-5" />
              </div>
              {isEditing ? (
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-[var(--accent)]"
                  autoFocus
                />
              ) : (
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{platform.label}</p>
                  <p className="text-[var(--text-muted)] text-xs truncate">{link.url}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleUpdateLink(link.id)}
                      className="text-xs text-[var(--accent)] hover:text-[var(--accent-light)] font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditUrl('');
                      }}
                      className="text-xs text-[var(--text-gray)] hover:text-white"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(link.id);
                        setEditUrl(link.url);
                      }}
                      className="text-xs text-[var(--text-gray)] hover:text-white font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {socialLinks.length === 0 && !showAddForm && (
        <p className="text-sm text-[var(--text-muted)] text-center py-4">
          No social links added yet. Click "Add Link" to get started.
        </p>
      )}
    </div>
  );
}
