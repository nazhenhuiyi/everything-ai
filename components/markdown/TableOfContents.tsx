'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66%' }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto p-4 hidden lg:block">
            <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                On this page
            </h4>
            <ul className="space-y-2 text-sm">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        className={cn(
                            'transition-all duration-200',
                            heading.level === 3 && 'pl-4'
                        )}
                    >
                        <Link
                            href={`#${heading.id}`}
                            className={cn(
                                'block hover:text-blue-600 dark:hover:text-blue-400',
                                activeId === heading.id
                                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                                    : 'text-gray-500 dark:text-gray-400'
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start' // Or 'center' if you prefer
                                });
                                setActiveId(heading.id); // Immediate feedback
                                // Update URL hash
                                history.pushState(null, '', `#${heading.id}`);
                            }}
                        >
                            {heading.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
