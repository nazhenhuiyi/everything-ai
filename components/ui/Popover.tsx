'use client';

import React, { useState, useRef, useEffect } from 'react';

interface PopoverProps {
    trigger: React.ReactNode;
    content: React.ReactNode;
}

export default function Popover({ trigger, content }: PopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLSpanElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <span className="relative inline-block" ref={containerRef}>
            <span
                className="cursor-pointer border-b-2 border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors rounded-sm px-0.5"
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
            // We don't close on mouse leave immediately to allow interaction, but for simplicity let's stick to click or hover-intent. 
            // For "clean" experience, let's keep it simple: Click toggles, Hover opens, Leave closes? 
            // Creating a stable hover popover without libraries is tricky (layout thrashing etc).
            // Let's rely on Click for stability and "pinned" state, or Hover.
            // Given the user wants "Annotation", clicking to "pin" the card while reading is good.
            // Let's start with Click OR Hover.
            // Actually, let's just use click for mobile friendliness and stability.
            >
                {trigger}
            </span>
            {isOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 max-w-[90vw] z-50">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl p-4 text-left animate-in fade-in zoom-in-95 duration-200">
                        {content}
                    </div>
                </div>
            )}
        </span>
    );
}
