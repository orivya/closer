import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick, hoverEffect = true }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-surface backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] 
        rounded-[1.75rem] transition-all duration-300 ease-out
        ${hoverEffect ? 'hover:border-sage-300/50 hover:shadow-[0_8px_30px_-4px_rgba(107,143,122,0.15)] hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', icon, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 active:scale-95";
  
  const variants = {
    primary: "bg-sage-500 text-white shadow-[0_4px_14px_0_rgba(107,143,122,0.39)] hover:shadow-[0_6px_20px_rgba(107,143,122,0.23)] hover:-translate-y-0.5 hover:bg-sage-600 px-6 py-3 text-sm border border-transparent",
    secondary: "bg-white text-sage-900 border border-black/5 hover:border-sage-200 hover:shadow-lg hover:shadow-sage-500/10 px-6 py-3 text-sm",
    ghost: "bg-transparent text-sage-600 hover:bg-sage-50 hover:text-sage-800 px-4 py-2 text-sm",
    icon: "p-2 text-sage-600 hover:bg-sage-50 hover:text-sage-800 rounded-full"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};