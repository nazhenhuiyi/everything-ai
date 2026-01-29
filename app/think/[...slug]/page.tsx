import Link from 'next/link';
import TableOfContents from '@/components/markdown/TableOfContents';
import GithubSlugger from 'github-slugger';
import React from 'react';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';
import { getThinkBySlug, getThinkSlugs } from '@/lib/think';
import { Metadata } from 'next';

export async function generateStaticParams() {
    const slugs = getThinkSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
    const { slug } = await params;
    const doc = getThinkBySlug(slug);

    if (!doc) {
        return {
            title: '未找到文档',
        };
    }

    // Normalize string representation for title
    const slugStr = Array.isArray(slug) ? slug.join(' ') : slug;

    return {
        title: doc.meta.title || slugStr,
        description: doc.meta.description || `关于 ${doc.meta.title || slugStr} 的深度思考。`,
        openGraph: {
            title: doc.meta.title,
            description: doc.meta.description,
            type: 'article',
        },
    };
}

export default async function ThinkPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    // Handle potential URL encoding issues in the slug itself if passed from URL
    const doc = getThinkBySlug(slug);

    if (!doc) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 text-center">
                <h1 className="text-3xl font-serif text-red-500 mb-4">Document not found</h1>
                <Link href="/" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">← Back to Home</Link>
            </div>
        );
    }

    const slugger = new GithubSlugger();
    const headings = doc.content.split('\n')
        .filter(line => line.match(/^#{2,3}\s/))
        .map(line => {
            const level = line.match(/^#+/)?.[0].length || 0;
            const text = line.replace(/^#+\s/, '');
            const id = slugger.slug(text);
            return { id, text, level };
        });

    // Check for original version link
    let originalLink = null;
    if (Array.isArray(slug) && slug.length > 0 && slug[0] === 'ai-revised') {
        originalLink = `/think/origin/${slug.slice(1).join('/')}`;
    }

    return (
        <div className="bg-[#fcfbf9] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100 font-sans selection:bg-yellow-200 dark:selection:bg-yellow-900/30">
            {/* Navigation Bar */}
            <nav className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-[#fcfbf9]/80 dark:bg-zinc-950/80 backdrop-blur-md z-50">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="text-sm font-medium tracking-wide text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors uppercase">
                        Home
                    </Link>
                    <div className="font-serif italic text-xl">Thinking</div>
                    <div className="w-20"></div> {/* Spacer for centering */}
                </div>
            </nav>

            <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-[1fr_240px] gap-16 items-start">
                    <main className="min-w-0">
                        <article>
                            {/* Header with Original Link if applicable */}
                            {originalLink && (
                                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg flex items-center justify-between">
                                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                        You are viewing an AI-revised version.
                                    </div>
                                    <Link href={originalLink} className="text-sm font-medium text-yellow-900 dark:text-yellow-100 underline decoration-yellow-500/50 hover:decoration-yellow-500 transition-all">
                                        View Original →
                                    </Link>
                                </div>
                            )}

                            {/* Content */}
                            <MarkdownRenderer content={doc.content} />

                            {/* Footer / Author section */}
                            <div className="mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-zinc-400 text-sm font-sans uppercase tracking-widest">
                                <span>Published in Thinking</span>
                                <span>&copy; {new Date().getFullYear()}</span>
                            </div>
                        </article>
                    </main>

                    <aside className='hidden lg:block sticky top-32'>
                        <div className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">On this page</div>
                        <TableOfContents headings={headings} />
                    </aside>
                </div >
            </div >
        </div >
    );
}
