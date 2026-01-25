import { getDocBySlug, getDocSlugs } from '@/lib/docs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import Link from 'next/link';
import TableOfContents from './TableOfContents';
import GithubSlugger from 'github-slugger';

export async function generateStaticParams() {
    const slugs = getDocSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const doc = getDocBySlug(slug);

    if (!doc) {
        return (
            <div className="max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold text-red-500">Document not found</h1>
                <Link href="/docs" className="text-blue-500 hover:underline mt-4 inline-block">← Back to Docs</Link>
            </div>
        );
    }

    // Extract headings for Table of Contents
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
        <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <Link href="/docs" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 mb-8 inline-flex items-center transition-colors">
                <span className="mr-2">←</span> Back to Docs
            </Link>

            <div className="lg:grid lg:grid-cols-[1fr_280px] gap-12 items-start">
                <main className="min-w-0">
                    <article className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                        prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300
                        prose-li:text-gray-700 dark:prose-li:text-gray-300
                        prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline
                        prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                        prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                    ">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeSlug]}
                            components={{
                                code({ inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <div className="relative group">
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </div>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {doc.content}
                        </ReactMarkdown>
                    </article>
                </main>

                <aside className='hidden lg:block'>
                    <TableOfContents headings={headings} />
                </aside>
            </div>
        </div>
    );
}
