'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DatabaseService } from '@/lib/database.types';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

interface ServicePageClientProps {
  username: string;
  slug: string;
  service: DatabaseService & {
    profiles?: {
      username: string;
      display_name: string;
      avatar_url: string | null;
    };
  };
}

export default function ServicePageClient({ username, slug, service }: ServicePageClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white pb-20">
      {/* Navigation */}
      <div className="max-w-[1200px] mx-auto px-6 pt-8 mb-8">
        <Link
          href={`/${username}`}
          className="text-sm text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>
      </div>

      {/* Service Header */}
      <div className="max-w-[1000px] mx-auto px-6 text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          {service.name}
        </h1>
        <p className="text-xl text-[var(--text-gray)] max-w-2xl mx-auto">
          {service.description}
        </p>
      </div>

      {/* Service Details */}
      <div className="max-w-[800px] mx-auto px-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-3xl p-8 mb-12">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="text-sm text-[var(--text-muted)] mb-1">Starting at</div>
              <div className="text-4xl font-bold text-white">${service.base_price}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[var(--text-muted)] mb-1">Turnaround</div>
              <div className="text-2xl font-bold text-[var(--accent)]">{service.turnaround_days} days</div>
            </div>
          </div>

          <div className="border-t border-[var(--border-dark)] pt-8 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">What's Included</h3>
            <ul className="space-y-3">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-[var(--text-gray)]">
                  <Check className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
              <li className="flex items-start gap-3 text-[var(--text-gray)]">
                <Check className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                {service.revision_count} revision{service.revision_count !== 1 ? 's' : ''} included
              </li>
            </ul>
          </div>

          {service.requirements && (
            <div className="border-t border-[var(--border-dark)] pt-8 mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Requirements</h3>
              <p className="text-[var(--text-gray)] whitespace-pre-line">{service.requirements}</p>
            </div>
          )}

          <Link
            href={`/${username}/book?service=${service.slug}`}
            className="w-full block text-center py-4 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
