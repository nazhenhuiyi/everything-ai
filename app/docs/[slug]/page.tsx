import Link from 'next/link';
import TableOfContents from '@/components/markdown/TableOfContents';
import GithubSlugger from 'github-slugger';
import React from 'react';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';
import { getDocBySlug, getDocSlugs, getAnnotationsForDoc } from '@/lib/docs';
import { Metadata } from 'next';

export async function generateStaticParams() {
    const slugs = getDocSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const doc = getDocBySlug(slug);

    if (!doc) {
        return {
            title: '未找到文档',
        };
    }

    return {
        title: doc.meta.title || slug.replace(/-/g, ' '),
        description: doc.meta.description || `关于 ${doc.meta.title || slug} 的深度拆解与探索。`,
        openGraph: {
            title: doc.meta.title,
            description: doc.meta.description,
            type: 'article',
        },
    };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const doc = getDocBySlug(slug);
    const annotations = getAnnotationsForDoc(slug);

    if (!doc) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 text-center">
                <h1 className="text-3xl font-serif text-red-500 mb-4">Document not found</h1>
                <Link href="/docs" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">← Back to Library</Link>
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

    return (
        <div className="bg-[#fcfbf9] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100 font-sans selection:bg-yellow-200 dark:selection:bg-yellow-900/30">
            {/* Navigation Bar */}
            <nav className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-[#fcfbf9]/80 dark:bg-zinc-950/80 backdrop-blur-md z-50">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/docs" className="text-sm font-medium tracking-wide text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors uppercase">
                        Other Stories
                    </Link>
                    <div className="font-serif italic text-xl">Everything AI</div>
                    <div className="w-20"></div> {/* Spacer for centering */}
                </div>
            </nav>

            <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-[1fr_240px] gap-16 items-start">
                    <main className="min-w-0">
                        <article>

                            {/* Content */}
                            <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none
                                prose-headings:font-serif prose-headings:font-normal
                                prose-h1:text-6xl prose-h1:leading-tight prose-h1:mb-8 prose-h1:text-center prose-h1:tracking-tight
                                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-zinc-800 dark:prose-h2:text-zinc-100
                                prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:font-sans prose-h3:font-bold prose-h3:uppercase prose-h3:tracking-wide prose-h3:text-zinc-500 dark:prose-h3:text-zinc-500
                                prose-p:leading-8 prose-p:text-xl prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:font-serif
                                prose-strong:font-bold prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100
                                prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:pl-8 prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-serif prose-blockquote:text-zinc-800 dark:prose-blockquote:text-zinc-200 prose-blockquote:bg-transparent
                                prose-img:rounded-sm prose-img:shadow-xl prose-img:w-full prose-img:my-12
                                prose-li:text-lg prose-li:text-zinc-600 dark:prose-li:text-zinc-400
                                prose-ul:pl-10 prose-ol:pl-11
                                prose-li:my-4
                                prose-li:marker:text-zinc-300 dark:prose-li:marker:text-zinc-700
                                prose-ol:marker:font-medium
                                [&_ul]:mt-4 [&_ol]:mt-4
                                hover:prose-a:text-yellow-600 transition-colors
                            ">
                                <MarkdownRenderer content={doc.content} annotations={annotations} />
                            </div>

                            {/* Footer / Author section could go here */}
                            <div className="mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-zinc-400 text-sm font-sans uppercase tracking-widest">
                                <span>Published in Everything AI</span>
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
