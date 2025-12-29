'use client';

import React, { useState } from 'react';
import { InboxList } from '@/components/dashboard/inbox/InboxList';
import { InboxThread } from '@/components/dashboard/inbox/InboxThread';

export default function InboxPage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <div className="flex h-[calc(100vh-100px)] border border-[var(--border-dark)] rounded-2xl overflow-hidden bg-[var(--bg-base)] shadow-2xl">
            {/* Left Pane: List */}
            <InboxList
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
            />

            {/* Right Pane: Thread Detail */}
            <div className="flex-1 hidden md:flex border-l border-[var(--border-dark)]">
                <InboxThread id={selectedId} />
            </div>
        </div>
    );
}
