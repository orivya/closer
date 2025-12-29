'use client';

import React, { useState } from 'react';
import { ProductList } from '@/components/dashboard/products/ProductList';
import { ProductEditor } from '@/components/dashboard/products/ProductEditor';
import { useProducts, Product } from '@/hooks/useProducts';
import { ShoppingBag } from 'lucide-react';

export default function ProductsPage() {
    const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleCreate = () => {
        setEditingProduct(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsEditorOpen(true);
    };

    const handleSave = async (productData: Partial<Product>) => {
        if (editingProduct) {
            // Update existing product
            const { error } = await updateProduct(editingProduct.id, productData);
            if (!error) {
                setIsEditorOpen(false);
            } else {
                alert(error);
            }
        } else {
            // Create new product
            const { error } = await createProduct(productData);
            if (!error) {
                setIsEditorOpen(false);
            } else {
                alert(error);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            const { error } = await deleteProduct(id);
            if (!error) {
                setIsEditorOpen(false);
            } else {
                alert(error);
            }
        }
    };

    if (loading) {
        return (
            <div className="max-w-[1600px] mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        Products
                    </h1>
                    <p className="text-[var(--text-gray)]">Manage your digital products, presets, and sample packs.</p>
                </div>
                <div className="flex items-center justify-center py-20">
                    <div className="text-[var(--text-muted)]">Loading products...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    Products
                </h1>
                <p className="text-[var(--text-gray)]">Manage your digital products, presets, and sample packs.</p>
            </div>

            {/* List */}
            <ProductList
                products={products}
                onEdit={handleEdit}
                onCreate={handleCreate}
            />

            {/* Editor Modal */}
            {isEditorOpen && (
                <ProductEditor
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={() => setIsEditorOpen(false)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
