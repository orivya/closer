import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'shimmer',
}) => {
  const baseClasses = 'bg-dark-hover';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-2xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'skeleton-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Pre-configured skeleton layouts
export const EntryCardSkeleton: React.FC = () => (
  <div className="bg-dark-card/60 backdrop-blur-sm rounded-3xl p-6 border border-dark-border">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2">
          <Skeleton width={100} height={14} />
          <Skeleton width={60} height={12} />
        </div>
      </div>
      <Skeleton variant="rounded" width={60} height={28} />
    </div>
    <div className="space-y-2 mb-4">
      <Skeleton width="100%" height={16} />
      <Skeleton width="90%" height={16} />
      <Skeleton width="75%" height={16} />
    </div>
    <div className="flex items-center gap-4">
      <Skeleton width={80} height={12} />
      <Skeleton width={60} height={12} />
    </div>
  </div>
);

export const InsightCardSkeleton: React.FC = () => (
  <div className="bg-dark-card/60 backdrop-blur-sm rounded-3xl p-6 border border-dark-border">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton variant="rounded" width={48} height={48} />
      <div className="space-y-2 flex-1">
        <Skeleton width="60%" height={18} />
        <Skeleton width="40%" height={14} />
      </div>
    </div>
    <div className="h-32 mb-4">
      <Skeleton variant="rounded" width="100%" height="100%" />
    </div>
  </div>
);

export const PromptCardSkeleton: React.FC = () => (
  <div className="bg-gradient-to-br from-sage/5 to-dark-surface rounded-3xl p-6 border border-dark-border">
    <Skeleton variant="circular" width={32} height={32} className="mb-4" />
    <div className="space-y-2 mb-4">
      <Skeleton width="85%" height={20} />
      <Skeleton width="70%" height={20} />
    </div>
    <Skeleton variant="rounded" width={120} height={36} className="mt-4" />
  </div>
);

export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 200 }) => (
  <div className="bg-dark-card/60 backdrop-blur-sm rounded-3xl p-6 border border-dark-border">
    <div className="flex justify-between items-center mb-4">
      <Skeleton width={150} height={20} />
      <Skeleton variant="rounded" width={100} height={32} />
    </div>
    <Skeleton variant="rounded" width="100%" height={height} />
  </div>
);

export const SidebarSkeleton: React.FC = () => (
  <div className="w-64 p-6 space-y-6">
    <div className="flex items-center gap-3 mb-8">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="space-y-2">
        <Skeleton width={100} height={14} />
        <Skeleton width={60} height={12} />
      </div>
    </div>
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} variant="rounded" width="100%" height={44} />
    ))}
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="flex flex-col items-center p-8">
    <Skeleton variant="circular" width={96} height={96} className="mb-4" />
    <Skeleton width={150} height={24} className="mb-2" />
    <Skeleton width={200} height={16} />
  </div>
);

// Grid of skeleton cards
export const EntryGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, i) => (
      <EntryCardSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton;
