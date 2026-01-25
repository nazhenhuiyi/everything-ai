import { Info, Lightbulb, AlertCircle, AlertTriangle, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertType = 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';

interface AlertProps {
    type: AlertType;
    title?: string;
    children: React.ReactNode;
}

const ALERT_CONFIG: Record<AlertType, { icon: React.ElementType; colorClass: string; title: string }> = {
    NOTE: {
        icon: Info,
        colorClass: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-800',
        title: 'Note',
    },
    TIP: {
        icon: Lightbulb,
        colorClass: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-200 dark:border-green-800',
        title: 'Tip',
    },
    IMPORTANT: {
        icon: AlertCircle,
        colorClass: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-200 dark:border-purple-800',
        title: 'Important',
    },
    WARNING: {
        icon: AlertTriangle,
        colorClass: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800',
        title: 'Warning',
    },
    CAUTION: {
        icon: Flame,
        colorClass: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-200 dark:border-red-800',
        title: 'Caution',
    },
};

export default function Alert({ type, title, children }: AlertProps) {
    const config = ALERT_CONFIG[type] || ALERT_CONFIG.NOTE;
    const Icon = config.icon;

    return (
        <div className={cn(
            "my-6 rounded-lg border p-4 shadow-sm",
            config.colorClass
        )}>
            <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-sm uppercase tracking-wide opacity-90">
                    {title || config.title}
                </span>
            </div>
            <div className="text-sm leading-relaxed opacity-90 [&>p]:my-0">
                {children}
            </div>
        </div>
    );
}
