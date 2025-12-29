'use client';

import React, { useState, useRef } from 'react';
import { X, Save, Trash2, Upload, Music, Image as ImageIcon, FileBox, Shield, FileText } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ProductEditorProps {
    product: Product | null;
    onSave: (product: Partial<Product>) => void;
    onCancel: () => void;
    onDelete?: (id: string) => void;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({ product, onSave, onCancel, onDelete }) => {
    const { profile } = useAuth();
    const [activeTab, setActiveTab] = useState<'details' | 'license' | 'files'>('details');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>('');

    const coverImageInputRef = useRef<HTMLInputElement>(null);
    const productFileInputRef = useRef<HTMLInputElement>(null);
    const previewAudioInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<Partial<Product>>(product || {
        name: '',
        description: '',
        category: 'preset',
        price: 0,
        currency: 'USD',
        cover_image_url: null,
        preview_url: null,
        file_url: null,
        file_size_mb: null,
        license_type: 'personal',
        license_terms: '',
        tags: [],
        metadata: {},
        is_active: true,
        display_order: 0,
    });

    const isEditing = !!product;

    const uploadFile = async (file: File, bucket: string, folder: string = ''): Promise<string | null> => {
        try {
            if (!profile) {
                throw new Error('Not authenticated');
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${profile.id}/${folder}${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL for public buckets, or store path for private buckets
            if (bucket === 'products') {
                // Private bucket - just store the path
                return fileName;
            } else {
                // Public buckets - get public URL
                const { data } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(fileName);

                return data.publicUrl;
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return null;
        }
    };

    const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB');
            return;
        }

        setUploading(true);
        setUploadProgress('Uploading cover image...');

        const url = await uploadFile(file, 'portfolio-images', 'product-covers/');

        if (url) {
            setFormData({ ...formData, cover_image_url: url });
        }

        setUploading(false);
        setUploadProgress('');
    };

    const handleProductFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Calculate file size in MB
        const fileSizeMB = file.size / (1024 * 1024);

        setUploading(true);
        setUploadProgress('Uploading product file...');

        const path = await uploadFile(file, 'products', 'files/');

        if (path) {
            setFormData({
                ...formData,
                file_url: path,
                file_size_mb: parseFloat(fileSizeMB.toFixed(2))
            });
        }

        setUploading(false);
        setUploadProgress('');
    };

    const handlePreviewAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('audio/')) {
            alert('Please upload an audio file');
            return;
        }

        setUploading(true);
        setUploadProgress('Uploading preview audio...');

        const url = await uploadFile(file, 'product-previews', 'audio/');

        if (url) {
            setFormData({ ...formData, preview_url: url });
        }

        setUploading(false);
        setUploadProgress('');
    };

    const handleSubmit = () => {
        // Validate required fields
        if (!formData.name?.trim()) {
            alert('Please enter a product name');
            return;
        }

        if (!formData.price || formData.price <= 0) {
            alert('Please enter a valid price');
            return;
        }

        if (!formData.file_url) {
            alert('Please upload a product file');
            return;
        }

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative w-full max-w-2xl h-full bg-[var(--bg-elevated)] border-l border-[var(--border-dark)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-dark)]">
                    <div>
                        <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Product' : 'New Product'}</h2>
                        <p className="text-sm text-[var(--text-muted)]">Configure product details and licenses</p>
                    </div>
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-white/5 text-[var(--text-gray)] hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 p-2 border-b border-[var(--border-dark)] bg-[var(--bg-base)]">
                    {[
                        { id: 'details', label: 'Details', icon: FileText },
                        { id: 'files', label: 'Files', icon: FileBox },
                        { id: 'license', label: 'License', icon: Shield },
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

                {/* Upload Progress */}
                {uploading && (
                    <div className="px-6 py-3 bg-[var(--accent)]/10 border-b border-[var(--accent)]/20">
                        <div className="text-sm text-[var(--accent)] font-medium">{uploadProgress}</div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* DETAILS TAB */}
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Deep House Serum Presets Vol. 1"
                                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Price ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                        className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none appearance-none"
                                    >
                                        <option value="preset">Preset Pack</option>
                                        <option value="sample_pack">Sample Pack</option>
                                        <option value="template">DAW Template</option>
                                        <option value="course">Video Course</option>
                                        <option value="ebook">E-Book</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Description</label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    placeholder="Describe your product..."
                                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.tags?.join(', ') || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                    })}
                                    placeholder="e.g. house, techno, bass"
                                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 rounded border-[var(--border-dark)] bg-[var(--bg-elevated)] text-[var(--accent)] focus:ring-0"
                                />
                                <label htmlFor="is_active" className="text-sm text-white font-medium">
                                    Product is active and visible to buyers
                                </label>
                            </div>
                        </div>
                    )}

                    {/* FILES TAB */}
                    {activeTab === 'files' && (
                        <div className="space-y-6">
                            {/* Cover Image */}
                            <div>
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 block">Cover Image</label>
                                <input
                                    ref={coverImageInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <div
                                    onClick={() => !uploading && coverImageInputRef.current?.click()}
                                    className="group relative border-2 border-dashed border-[var(--border-dark)] hover:border-[var(--accent)] rounded-xl p-8 transition-colors text-center cursor-pointer bg-[var(--bg-base)]"
                                >
                                    {formData.cover_image_url ? (
                                        <div className="space-y-3">
                                            <img
                                                src={formData.cover_image_url}
                                                alt="Cover"
                                                className="w-32 h-32 object-cover rounded-lg mx-auto"
                                            />
                                            <p className="text-sm text-[var(--accent)]">Click to change image</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-gray)] group-hover:text-white group-hover:bg-[var(--accent)] transition-all">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-bold text-white">Upload Cover Art</span>
                                                <span className="text-[var(--text-gray)]"> or drag and drop</span>
                                            </div>
                                            <span className="text-xs text-[var(--text-muted)]">PNG, JPG up to 5MB (1:1 Ratio)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product File */}
                            <div>
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 block">Product File (Required)</label>
                                <input
                                    ref={productFileInputRef}
                                    type="file"
                                    onChange={handleProductFileUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <div
                                    onClick={() => !uploading && productFileInputRef.current?.click()}
                                    className="group relative border-2 border-dashed border-[var(--border-dark)] hover:border-[var(--accent)] rounded-xl p-8 transition-colors text-center cursor-pointer bg-[var(--bg-base)]"
                                >
                                    {formData.file_url ? (
                                        <div className="space-y-2">
                                            <FileBox className="w-12 h-12 mx-auto text-[var(--accent)]" />
                                            <p className="text-sm font-medium text-white">File uploaded ({formData.file_size_mb}MB)</p>
                                            <p className="text-xs text-[var(--text-muted)]">Click to replace</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-gray)] group-hover:text-white group-hover:bg-[var(--accent)] transition-all">
                                                <FileBox className="w-6 h-6" />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-bold text-white">Upload Product File</span>
                                                <span className="text-[var(--text-gray)]"> (ZIP, RAR, etc)</span>
                                            </div>
                                            <span className="text-xs text-[var(--text-muted)]">This file will be delivered automatically after purchase.</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Preview Audio */}
                            <div>
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 block">Preview Audio (Optional)</label>
                                <input
                                    ref={previewAudioInputRef}
                                    type="file"
                                    accept="audio/*"
                                    onChange={handlePreviewAudioUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <div
                                    onClick={() => !uploading && previewAudioInputRef.current?.click()}
                                    className="group relative border-2 border-dashed border-[var(--border-dark)] hover:border-[var(--accent)] rounded-xl p-6 transition-colors cursor-pointer bg-[var(--bg-base)] flex flex-row items-center gap-4 text-left"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-gray)] group-hover:text-white group-hover:bg-[var(--accent)] transition-all shrink-0">
                                        <Music className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-white">
                                            {formData.preview_url ? 'Preview uploaded - Click to replace' : 'Upload Audio Preview'}
                                        </div>
                                        <div className="text-xs text-[var(--text-muted)]">MP3 (320kbps recommended). Used for the on-page player.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LICENSE TAB */}
                    {activeTab === 'license' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">License Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'personal', label: 'Personal' },
                                        { value: 'commercial', label: 'Commercial' },
                                        { value: 'exclusive', label: 'Exclusive' },
                                    ].map((type) => (
                                        <button
                                            key={type.value}
                                            onClick={() => setFormData({ ...formData, license_type: type.value as any })}
                                            className={cn(
                                                "px-4 py-3 rounded-xl border text-sm font-medium transition-all capitalize",
                                                formData.license_type === type.value
                                                    ? "bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]"
                                                    : "bg-[var(--bg-base)] border-[var(--border-dark)] text-[var(--text-muted)] hover:text-white hover:border-[var(--text-gray)]"
                                            )}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">License Terms (Optional)</label>
                                <textarea
                                    value={formData.license_terms || ''}
                                    onChange={(e) => setFormData({ ...formData, license_terms: e.target.value })}
                                    rows={10}
                                    placeholder="Enter custom license terms or usage restrictions..."
                                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none resize-none font-mono text-sm"
                                />
                                <p className="text-xs text-[var(--text-muted)]">
                                    These terms will be shown to buyers before purchase.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border-dark)] flex items-center justify-between bg-[var(--bg-card)]">
                    {isEditing ? (
                        <button
                            onClick={() => product && onDelete?.(product.id)}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-semibold"
                            disabled={uploading}
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    ) : <div></div>}

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2.5 text-sm font-semibold text-[var(--text-gray)] hover:text-white transition-colors"
                            disabled={uploading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={uploading}
                            className="px-6 py-2.5 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all shadow-[0_0_15px_-5px_var(--accent-glow)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            {uploading ? 'Uploading...' : 'Save Product'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
