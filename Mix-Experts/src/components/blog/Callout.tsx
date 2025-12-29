import { AlertCircle, CheckCircle, Info, Lightbulb, AlertTriangle } from 'lucide-react';
import { ReactNode } from 'react';

interface CalloutProps {
    type?: 'note' | 'tip' | 'warning' | 'danger' | 'success';
    title?: string;
    children: ReactNode;
}

export function Callout({ type = 'note', title, children }: CalloutProps) {
    const styles = {
        note: {
            border: 'border-blue-500/20',
            bg: 'bg-blue-500/5',
            text: 'text-blue-200',
            icon: <Info className="w-5 h-5 text-blue-400" />
        },
        tip: {
            border: 'border-[var(--accent)]/20',
            bg: 'bg-[var(--accent)]/5',
            text: 'text-purple-200',
            icon: <Lightbulb className="w-5 h-5 text-[var(--accent)]" />
        },
        warning: {
            border: 'border-yellow-500/20',
            bg: 'bg-yellow-500/5',
            text: 'text-yellow-200',
            icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />
        },
        danger: {
            border: 'border-red-500/20',
            bg: 'bg-red-500/5',
            text: 'text-red-200',
            icon: <AlertCircle className="w-5 h-5 text-red-400" />
        },
        success: {
            border: 'border-green-500/20',
            bg: 'bg-green-500/5',
            text: 'text-green-200',
            icon: <CheckCircle className="w-5 h-5 text-green-400" />
        }
    };

    const style = styles[type];

    return (
        <div className={`my-8 p-6 rounded-2xl border ${style.border} ${style.bg}`}>
            <div className="flex items-start gap-4">
                <div className="mt-1 shrink-0">{style.icon}</div>
                <div className="flex-1">
                    {title && <h4 className={`font-bold mb-2 ${style.text}`}>{title}</h4>}
                    <div className="text-[var(--text-gray)] [&>p]:mb-0 leading-relaxed text-sm">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
