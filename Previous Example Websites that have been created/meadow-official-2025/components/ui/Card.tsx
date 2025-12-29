import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const variantClasses = {
  default: 'bg-dark-card/80 backdrop-blur-sm border border-dark-border',
  elevated: 'bg-dark-elevated shadow-lg border border-dark-border',
  outlined: 'bg-transparent border-2 border-dark-border',
  glass: 'bg-dark-card/40 backdrop-blur-md border border-dark-border',
  gradient: 'bg-gradient-to-br from-sage/5 to-dark-surface border border-dark-border',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
}) => {
  const hoverClasses = hover
    ? 'cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-glow hover:border-sage-border active:scale-[0.98]'
    : '';

  return (
    <div
      className={`rounded-3xl ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

// Card Header
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`mb-4 ${className}`}>{children}</div>;

// Card Title
export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h3 className={`text-lg font-serif font-semibold text-text-primary ${className}`}>{children}</h3>
);

// Card Description
export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <p className={`text-text-secondary text-sm mt-1 ${className}`}>{children}</p>;

// Card Content
export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={className}>{children}</div>;

// Card Footer
export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`mt-4 pt-4 border-t border-dark-border ${className}`}>{children}</div>;

// Stat Card
interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
}) => {
  const changeColors = {
    positive: 'text-sage',
    negative: 'text-clay',
    neutral: 'text-text-secondary',
  };

  return (
    <Card variant="glass" padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm mb-1">{label}</p>
          <p className="text-2xl font-serif font-semibold text-text-primary">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColors[changeType]}`}>{change}</p>
          )}
        </div>
        {icon && <div className="text-sage/60">{icon}</div>}
      </div>
    </Card>
  );
};

// Feature Card
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onClick }) => (
  <Card variant="gradient" hover={!!onClick} onClick={onClick}>
    <div className="w-12 h-12 rounded-2xl bg-sage-subtle flex items-center justify-center text-sage border border-sage-border mb-4">
      {icon}
    </div>
    <h4 className="text-lg font-serif font-semibold text-text-primary mb-2">{title}</h4>
    <p className="text-text-secondary text-sm">{description}</p>
  </Card>
);

export default Card;
