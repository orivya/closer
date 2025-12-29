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
        relative overflow-hidden
        bg-white/60 backdrop-blur-2xl
        border border-white/80
        shadow-[0_2px_20px_-8px_rgba(44,60,51,0.04)]
        rounded-[2rem]
        transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1)
        group
        ${hoverEffect ? 'hover:bg-white/80 hover:shadow-[0_8px_30px_-12px_rgba(107,143,122,0.12)] hover:border-white hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Subtle shine effect on top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', icon, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 active:scale-95";
  
  const variants = {
    primary: "bg-[#2C3C33] text-white shadow-lg shadow-[#2C3C33]/20 hover:shadow-xl hover:shadow-[#2C3C33]/30 hover:bg-[#1f2b24] hover:-translate-y-0.5 px-6 py-3.5 text-sm border border-transparent",
    secondary: "bg-white text-sage-900 border border-sage-100 shadow-sm hover:border-sage-300 hover:shadow-md hover:bg-sage-50/50 px-6 py-3.5 text-sm",
    ghost: "bg-transparent text-sage-600 hover:bg-sage-100/50 hover:text-sage-900 px-4 py-2 text-sm",
    icon: "p-2.5 text-sage-600 hover:bg-white hover:shadow-sm hover:text-sage-900 border border-transparent hover:border-sage-100 rounded-full"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};
