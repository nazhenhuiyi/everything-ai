'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CopyButton({ content, className }: { content: string, className?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={cn(
                "p-2 rounded-md transition-all duration-200 border border-transparent",
                "bg-zinc-700/50 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100",
                "opacity-0 group-hover:opacity-100 focus:opacity-100", // Only show on hover of parent
                className
            )}
            aria-label="Copy code"
        >
            {copied ? (
                <Check className="w-4 h-4 text-green-400" />
            ) : (
                <Copy className="w-4 h-4" />
            )}
        </button>
    );
}
