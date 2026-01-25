'use client';

import Image from 'next/image';
import { useState } from 'react';

interface MarkdownImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt?: string;
}

export default function MarkdownImage({ src, alt, ...props }: MarkdownImageProps) {
    if (!src) return null;

    // Determine if URL is external or local to decide layout strategy
    // For simplicity in this docs starter, we'll assume most images are local or standard URLs
    // and use a responsive wrapper.

    return (
        <figure className="group my-12 not-prose">
            <div className="relative overflow-hidden rounded-sm shadow-xl bg-gray-100 dark:bg-gray-800">
                <img
                    src={src}
                    alt={alt || 'Documentation image'}
                    className="w-full h-auto object-cover block"
                    loading="lazy"
                    {...props}
                />
            </div>
            {alt && (
                <figcaption className="mt-4 text-center text-xs font-sans uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {alt}
                </figcaption>
            )}
        </figure>
    );
}
