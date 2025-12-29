'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus, Settings, Clock, Package } from 'lucide-react';
import { ServiceWithDetails } from '@/lib/database.types';
import { cn } from '@/lib/utils';

interface ServiceEditorProps {
    service: ServiceWithDetails | null;
    onSave: (data: any) => void;
    onCancel: () => void;
    onDelete?: (id: string) => void;
    saving?: boolean;
}

export const ServiceEditor: React.FC<ServiceEditorProps> = ({
    service,
    onSave,
    onCancel,
    onDelete,
    saving = false
}) => {
    const [activeTab, setActiveTab] = useState<'details' | 'terms' | 'turnaround' | 'addons'>('details');
    const isEditing = !!service;

    // Form state
    const [name, setName] = useState(service?.name || '');
    const [slug, setSlug] = useState(service?.slug || '');
    const [description, setDescription] = useState(service?.description || '');
    const [basePrice, setBasePrice] = useState(service?.base_price?.toString() || '');
    const [turnaroundDays, setTurnaroundDays] = useState(service?.turnaround_days?.toString() || '3');
    const [revisionCount, setRevisionCount] = useState(service?.revision_count?.toString() || '2');
    const [extraRevisionPrice, setExtraRevisionPrice] = useState(service?.extra_revision_price?.toString() || '50');
    const [features, setFeatures] = useState<string[]>(service?.features || ['']);
    const [deliveryFormats, setDeliveryFormats] = useState<string[]>(
        service?.delivery_formats || ['WAV 24bit', 'MP3 320kbps']
    );
    const [requirements, setRequirements] = useState(service?.requirements || '');
    const [termsConditions, setTermsConditions] = useState(service?.terms_conditions || '');
    const [isActive, setIsActive] = useState(service?.is_active ?? true);

    // Addons state
    const [addons, setAddons] = useState<Array<{ id?: string; name: string; description: string; price: number }>>(
        service?.addons?.map(a => ({ id: a.id, name: a.name, description: a.description || '', price: a.price })) || []
    );

    // Turnaround options state
    const [turnaroundOptions, setTurnaroundOptions] = useState<Array<{ id?: string; name: string; days: number; price_multiplier: number; is_default: boolean }>>(
        service?.turnaround_options?.map(t => ({
            id: t.id,
            name: t.name,
            days: t.days,
            price_multiplier: t.price_multiplier,
            is_default: t.is_default
        })) || [
            { name: 'Standard', days: 3, price_multiplier: 1, is_default: true }
        ]
    );

    // Auto-generate slug from name
    useEffect(() => {
        if (!isEditing && name) {
            const generatedSlug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setSlug(generatedSlug);
        }
    }, [name, isEditing]);

    const handleAddFeature = () => {
        setFeatures([...features, '']);
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };

    const handleRemoveFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const handleAddAddon = () => {
        setAddons([...addons, { name: '', description: '', price: 0 }]);
    };

    const handleUpdateAddon = (index: number, field: string, value: any) => {
        const newAddons = [...addons];
        newAddons[index] = { ...newAddons[index], [field]: value };
        setAddons(newAddons);
    };

    const handleRemoveAddon = (index: number) => {
        setAddons(addons.filter((_, i) => i !== index));
    };

    const handleAddTurnaroundOption = () => {
        setTurnaroundOptions([
            ...turnaroundOptions,
            { name: '', days: 1, price_multiplier: 1.5, is_default: false }
        ]);
    };

    const handleUpdateTurnaroundOption = (index: number, field: string, value: any) => {
        const newOptions = [...turnaroundOptions];

        // If setting this as default, unset others
        if (field === 'is_default' && value === true) {
            newOptions.forEach((opt, i) => {
                opt.is_default = i === index;
            });
        } else {
            newOptions[index] = { ...newOptions[index], [field]: value };
        }

        setTurnaroundOptions(newOptions);
    };

    const handleRemoveTurnaroundOption = (index: number) => {
        // Don't allow removing if it's the only option
        if (turnaroundOptions.length === 1) {
            alert('You must have at least one turnaround option');
            return;
        }
        setTurnaroundOptions(turnaroundOptions.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        // Validation
        if (!name.trim()) {
            alert('Please enter a service name');
            return;
        }
        if (!slug.trim()) {
            alert('Please enter a slug');
            return;
        }
        if (!basePrice || parseFloat(basePrice) <= 0) {
            alert('Please enter a valid base price');
            return;
        }

        // Filter out empty features
        const cleanFeatures = features.filter(f => f.trim() !== '');
        if (cleanFeatures.length === 0) {
            alert('Please add at least one feature');
            return;
        }

        const data = {
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            base_price: parseFloat(basePrice),
            turnaround_days: parseInt(turnaroundDays),
            revision_count: parseInt(revisionCount),
            extra_revision_price: parseFloat(extraRevisionPrice),
            features: cleanFeatures,
            delivery_formats: deliveryFormats.filter(f => f.trim() !== ''),
            requirements,
            terms_conditions: termsConditions,
            is_active: isActive,
            addons: addons.filter(a => a.name.trim() !== ''),
            turnaround_options: turnaroundOptions.filter(t => t.name.trim() !== ''),
        };

        onSave(data);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative w-full max-w-2xl h-full bg-[var(--bg-elevated)] border-l border-[var(--border-dark)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-dark)]">
                    <div>
                        <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Service' : 'New Service'}</h2>
                        <p className="text-sm text-[var(--text-muted)]">Configure your service details and policies</p>
                    </div>
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-white/5 text-[var(--text-gray)] hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="flex items-center gap-1 p-2 border-b border-[var(--border-dark)] bg-[var(--bg-base)]">
                    {[
                        { id: 'details', label: 'Details', icon: Settings },
                        { id: 'terms', label: 'Terms & Policies', icon: Package },
                        { id: 'turnaround', label: 'Turnaround', icon: Clock },
                        { id: 'addons', label: 'Add-Ons', icon: Plus }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
                                activeTab === tab.id
                                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                                    : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-elevated)]"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* DETAILS TAB */}
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Service Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Full Mix & Master"
                                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">URL Slug</label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="full-mix-master"
                                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none font-mono text-sm"
                                />
                                <p className="text-xs text-[var(--text-muted)]">Used in the service URL (lowercase, hyphens only)</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Base Price ($)</label>
                                    <input
                                        type="number"
                                        value={basePrice}
                                        onChange={(e) => setBasePrice(e.target.value)}
                                        className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Turnaround (Days)</label>
                                    <input
                                        type="number"
                                        value={turnaroundDays}
                                        onChange={(e) => setTurnaroundDays(e.target.value)}
                                        className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none resize-none"
                                    placeholder="Describe what's included in this service..."
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Features Included</label>
                                    <button onClick={handleAddFeature} className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-1 rounded hover:bg-[var(--accent)] hover:text-white transition-colors">
                                        + Add Feature
                                    </button>
                                </div>
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                            placeholder="e.g. Unlimited revisions"
                                            className="flex-1 px-4 py-2 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg text-white text-sm focus:border-[var(--accent)] focus:outline-none"
                                        />
                                        <button onClick={() => handleRemoveFeature(idx)} className="p-2 text-[var(--text-muted)] hover:text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-xl border border-[var(--border-dark)]">
                                <div>
                                    <h3 className="font-bold text-white">Service Status</h3>
                                    <p className="text-xs text-[var(--text-muted)]">Control if this service is visible to clients</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* TERMS TAB */}
                    {activeTab === 'terms' && (
                        <div className="space-y-6">
                            <div className="p-4 bg-[var(--bg-base)] rounded-xl border border-[var(--border-dark)] space-y-4">
                                <h3 className="font-bold text-white">Revisions Policy</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-muted)]">Included Revisions</label>
                                        <input
                                            type="number"
                                            value={revisionCount}
                                            onChange={(e) => setRevisionCount(e.target.value)}
                                            className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-white font-mono"
                                            min="0"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[var(--text-muted)]">Extra Revision Price ($)</label>
                                        <input
                                            type="number"
                                            value={extraRevisionPrice}
                                            onChange={(e) => setExtraRevisionPrice(e.target.value)}
                                            className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-white font-mono"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Requirements</label>
                                <textarea
                                    value={requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                    rows={3}
                                    placeholder="What do clients need to provide? (e.g., stems, reference tracks)"
                                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Terms & Conditions</label>
                                <textarea
                                    value={termsConditions}
                                    onChange={(e) => setTermsConditions(e.target.value)}
                                    rows={4}
                                    placeholder="General terms, refund policy, etc..."
                                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* TURNAROUND TAB */}
                    {activeTab === 'turnaround' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <p className="text-sm text-blue-400">
                                    Create multiple turnaround options with different price multipliers.
                                    The base price will be multiplied by the selected multiplier.
                                </p>
                            </div>

                            {turnaroundOptions.map((option, idx) => (
                                <div key={idx} className="p-4 bg-[var(--bg-base)] rounded-xl border border-[var(--border-dark)] relative group">
                                    {turnaroundOptions.length > 1 && (
                                        <button
                                            onClick={() => handleRemoveTurnaroundOption(idx)}
                                            className="absolute top-2 right-2 p-1.5 text-[var(--text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-3 gap-4 mb-3">
                                        <div className="col-span-1 space-y-1">
                                            <label className="text-[10px] uppercase text-[var(--text-muted)]">Name</label>
                                            <input
                                                type="text"
                                                value={option.name}
                                                onChange={(e) => handleUpdateTurnaroundOption(idx, 'name', e.target.value)}
                                                placeholder="e.g. Standard"
                                                className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-white text-sm focus:border-[var(--accent)] focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-[var(--text-muted)]">Days</label>
                                            <input
                                                type="number"
                                                value={option.days}
                                                onChange={(e) => handleUpdateTurnaroundOption(idx, 'days', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-white text-sm focus:border-[var(--accent)] focus:outline-none"
                                                min="1"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-[var(--text-muted)]">Multiplier</label>
                                            <input
                                                type="number"
                                                value={option.price_multiplier}
                                                onChange={(e) => handleUpdateTurnaroundOption(idx, 'price_multiplier', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-white text-sm focus:border-[var(--accent)] focus:outline-none"
                                                min="0.1"
                                                step="0.1"
                                            />
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={option.is_default}
                                            onChange={(e) => handleUpdateTurnaroundOption(idx, 'is_default', e.target.checked)}
                                            className="rounded border-[var(--border-dark)] bg-[var(--bg-elevated)]"
                                        />
                                        <span className="text-[var(--text-muted)]">Default option</span>
                                    </label>
                                </div>
                            ))}

                            <button
                                onClick={handleAddTurnaroundOption}
                                className="w-full py-4 border border-dashed border-[var(--border-dark)] rounded-xl text-[var(--text-muted)] hover:text-white hover:border-[var(--accent)/50] hover:bg-[var(--accent)/5] transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add Turnaround Option</span>
                            </button>
                        </div>
                    )}

                    {/* ADD-ONS TAB */}
                    {activeTab === 'addons' && (
                        <div className="space-y-4">
                            {addons.map((addon, idx) => (
                                <div key={idx} className="p-4 bg-[var(--bg-base)] rounded-xl border border-[var(--border-dark)] relative group">
                                    <button
                                        onClick={() => handleRemoveAddon(idx)}
                                        className="absolute top-2 right-2 p-1.5 text-[var(--text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <div className="grid grid-cols-3 gap-4 mb-3">
                                        <div className="col-span-2 space-y-1">
                                            <label className="text-[10px] uppercase text-[var(--text-muted)]">Name</label>
                                            <input
                                                type="text"
                                                value={addon.name}
                                                onChange={(e) => handleUpdateAddon(idx, 'name', e.target.value)}
                                                placeholder="e.g. Stem Delivery"
                                                className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-white text-sm focus:border-[var(--accent)] focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-[var(--text-muted)]">Price ($)</label>
                                            <input
                                                type="number"
                                                value={addon.price}
                                                onChange={(e) => handleUpdateAddon(idx, 'price', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-white text-sm focus:border-[var(--accent)] focus:outline-none"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        value={addon.description}
                                        onChange={(e) => handleUpdateAddon(idx, 'description', e.target.value)}
                                        placeholder="Optional description..."
                                        className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-[var(--text-gray)] text-xs focus:border-[var(--accent)] focus:outline-none"
                                    />
                                </div>
                            ))}

                            <button
                                onClick={handleAddAddon}
                                className="w-full py-4 border border-dashed border-[var(--border-dark)] rounded-xl text-[var(--text-muted)] hover:text-white hover:border-[var(--accent)/50] hover:bg-[var(--accent)/5] transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Create New Add-On</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border-dark)] flex items-center justify-between bg-[var(--bg-card)]">
                    {isEditing ? (
                        <button
                            onClick={() => service && onDelete?.(service.id)}
                            disabled={saving}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-semibold disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    ) : <div></div>}

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCancel}
                            disabled={saving}
                            className="px-6 py-2.5 text-sm font-semibold text-[var(--text-gray)] hover:text-white transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="px-6 py-2.5 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all shadow-[0_0_15px_-5px_var(--accent-glow)] flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
