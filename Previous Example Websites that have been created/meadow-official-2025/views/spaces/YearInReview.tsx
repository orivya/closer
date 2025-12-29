import React, { useEffect, useMemo, useState } from 'react';
import { ViewState } from '../../types';
import { Share2 } from 'lucide-react';
import { MetricsService, type YearAnalytics } from '../../services/metrics';
import { EmptyState } from '../../components/ui/EmptyState';

interface YearInReviewProps {
  onChangeView: (view: ViewState) => void;
}

const formatCompact = (n: number) =>
  n >= 1_000_000 ? `${Math.round(n / 100_000) / 10}M` : n >= 1000 ? `${Math.round(n / 100) / 10}k` : `${n}`;

const YearInReview: React.FC<YearInReviewProps> = () => {
  const year = new Date().getFullYear();
  const [data, setData] = useState<YearAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const a = await MetricsService.getYearAnalytics(year);
        setData(a);
      } catch (e) {
        console.error('Failed to load year analytics:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [year]);

  const shareText = useMemo(() => {
    const entries = data?.entries ?? 0;
    const words = data?.words ?? 0;
    const longest = data?.longestStreak ?? 0;
    const top = (data?.topTags ?? []).map((t) => `${t.tag} (${t.count})`).join(', ');
    return `My Meadow Year in Review (${year})\n\nEntries: ${entries}\nWords: ${words.toLocaleString()}\nLongest streak: ${longest} days\nTop themes: ${top || '—'}`;
  }, [data, year]);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // Prefer native share if available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nav: any = navigator;
      if (nav.share) {
        await nav.share({ title: `Meadow ${year} Year in Review`, text: shareText });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        alert('Copied to clipboard!');
      } else {
        alert(shareText);
      }
    } catch (e) {
      console.error('Share failed:', e);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="animate-fade-up max-w-3xl mx-auto pb-20">
      
      <div className="text-center py-16 bg-gradient-to-br from-sage-subtle to-white border border-sage/10 rounded-[48px] mb-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-sage/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <h1 className="font-serif text-6xl text-sage mb-4 relative z-10">{year}</h1>
         <p className="text-xl text-text-secondary font-light relative z-10">A year in words</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-6 mb-16">
          <YearStat value="—" label="Entries" />
          <YearStat value="—" label="Words" />
          <YearStat value="—" label="Best Streak" />
        </div>
      ) : (data?.entries ?? 0) === 0 ? (
        <EmptyState
          title="No year to review yet"
          description="Write a few entries to start building your Year in Review."
          variant="card"
          iconColor="sage"
        />
      ) : (
        <div className="grid grid-cols-3 gap-6 mb-16">
          <YearStat value={String(data?.entries ?? 0)} label="Entries" />
          <YearStat value={formatCompact(data?.words ?? 0)} label="Words" />
          <YearStat value={String(data?.longestStreak ?? 0)} label="Best Streak" />
        </div>
      )}

      {(data?.entries ?? 0) > 0 && (
        <div className="space-y-8">
          <Chapter
            number="01"
            title="Your strongest themes"
            text={
              data?.topTags?.length
                ? `Top themes: ${data.topTags.map((t) => `${t.tag} (${t.count})`).join(', ')}.`
                : 'Add tags to entries to see your themes appear here.'
            }
          />
          <Chapter
            number="02"
            title="Your writing rhythm"
            text={`You most often write around ${data?.peakHourLabel ?? '—'}. Your best weekday (by average length) is ${data?.bestWeekday ?? '—'}.`}
          />
          <Chapter
            number="03"
            title="Consistency"
            text={`Your best streak was ${data?.longestStreak ?? 0} days. Your current streak is ${data?.currentStreak ?? 0} days.`}
          />
        </div>
      )}

      <div className="mt-16 text-center">
         <button
           onClick={handleShare}
           disabled={isLoading || (data?.entries ?? 0) === 0 || isSharing}
           className="inline-flex items-center gap-2 px-8 py-4 bg-sage text-white rounded-full font-medium shadow-xl hover:bg-sage-dark hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:-translate-y-0"
         >
            <Share2 size={20} />
            {isSharing ? 'Sharing…' : 'Share Your Year'}
         </button>
      </div>
    </div>
  );
};

const YearStat = ({ value, label }: any) => (
   <div className="text-center p-6 bg-white border border-stone-200 rounded-[24px]">
      <div className="font-serif text-3xl font-medium text-text-primary mb-1">{value}</div>
      <div className="text-xs font-bold text-text-muted uppercase tracking-widest">{label}</div>
   </div>
);

const Chapter = ({ number, title, text }: any) => (
   <div className="bg-white p-10 rounded-[32px] border border-stone-200/60 shadow-sm hover:shadow-card-hover transition-all">
      <div className="text-xs font-bold text-sage uppercase tracking-widest mb-3">Chapter {number}</div>
      <h3 className="font-serif text-2xl text-text-primary mb-4">{title}</h3>
      <p className="text-text-secondary leading-relaxed font-light">{text}</p>
   </div>
)

export default YearInReview;
