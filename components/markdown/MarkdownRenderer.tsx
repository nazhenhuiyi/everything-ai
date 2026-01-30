// ... imports
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import remarkAlerts from '@/lib/remark-alerts';
import Alert from '@/components/markdown/Alert';
import MarkdownImage from '@/components/markdown/Image';
import CopyButton from '@/components/markdown/CopyButton';
import rehypeAnnotate from '@/lib/rehype-annotate';
import { Annotation as AnnotationType } from '@/lib/docs';
import Annotation from '@/components/markdown/Annotation';

interface MarkdownRendererProps {
    content: string;
    annotations?: AnnotationType[];
    frontmatter?: {
        title?: string;
        tags?: string[];
        summary?: string;
        created_at?: string;
        [key: string]: any;
    };
}

export default function MarkdownRenderer({ content, annotations = [], frontmatter }: MarkdownRendererProps) {
    // If we have a title in frontmatter, we likely want to render a custom header
    // and strip the first H1 from the markdown content to avoid duplication.
    const hasTitle = frontmatter?.title;
    const finalContent = React.useMemo(() => {
        if (!hasTitle) return content;
        // Strip the first H1 (# Title) if it exists at the start of the file, allowing for whitespace/newlines
        return content.replace(/^\s*#\s+[^\n]+(?:\n|$)/, '').trim();
    }, [content, hasTitle]);

    return (
        <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none
            prose-headings:font-serif prose-headings:font-normal
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
            {frontmatter && (
                <header className="not-prose mb-20 text-center max-w-3xl mx-auto">
                    {/* Meta Row: Date & Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs font-bold font-sans uppercase tracking-[0.2em] text-zinc-400">
                        {frontmatter.created_at && (
                            <time className="shrink-0">
                                {new Date(frontmatter.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </time>
                        )}

                        {frontmatter.tags && frontmatter.tags.length > 0 && (
                            <>
                                <span className="text-zinc-300">/</span>
                                <div className="flex gap-3">
                                    {frontmatter.tags.map(tag => (
                                        <span key={tag} className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Title */}
                    {frontmatter.title && (
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-zinc-900 dark:text-zinc-100 mb-8 leading-tight tracking-tight">
                            {frontmatter.title}
                        </h1>
                    )}

                    {/* Summary */}
                    {frontmatter.summary && (
                        <div className="relative">
                            <div className="text-2xl md:text-3xl font-serif italic text-zinc-500 dark:text-zinc-400 leading-relaxed px-8">
                                {frontmatter.summary}
                            </div>
                            <div className="w-24 h-1 bg-yellow-400 mx-auto mt-10 rounded-full opacity-60"></div>
                        </div>
                    )}
                </header>
            )}
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkAlerts, remarkUnwrapImages, remarkMath]}
                rehypePlugins={[
                    rehypeSlug,
                    rehypeKatex,
                    [rehypeAnnotate, { annotations }]
                ]}
                components={{
                    code({ inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        const codeString = String(children).replace(/\n$/, '');
                        //@ts-ignore
                        return !inline && match ? (
                            <div className="relative group not-prose my-10 font-mono text-sm">
                                <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
                                    <div className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        {match[1]}
                                    </div>
                                    <CopyButton content={codeString} />
                                </div>
                                <pre className="!bg-zinc-900 !text-zinc-300 rounded-lg p-6 overflow-x-auto shadow-inner border border-zinc-800">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        ) : (
                            <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-sm text-pink-600" {...props}>
                                {children}
                            </code>
                        )
                    },
                    img: (props: any) => (
                        <MarkdownImage {...props} />
                    ),
                    span: (props: any) => {
                        // Check for annotation index
                        if (props['data-annotation-index'] !== undefined) {
                            const index = parseInt(props['data-annotation-index'], 10);
                            const annotation = annotations[index];
                            if (annotation) {
                                return (
                                    <Annotation annotation={annotation}>
                                        {props.children}
                                    </Annotation>
                                );
                            }
                        }
                        return <span {...props} />
                    },
                    blockquote: (props: any) => {
                        const { children, ...rest } = props;
                        const alertType = props['data-alert-type'];

                        if (alertType) {
                            return (
                                <div className="not-prose my-8">
                                    <Alert type={alertType}>
                                        {children}
                                    </Alert>
                                </div>
                            );
                        }

                        return (
                            <blockquote {...rest}>
                                {children}
                            </blockquote>
                        )
                    },
                    // Custom paragraph wrapper to handle drop caps if needed in future
                    p: (props: any) => {
                        return <p className="mb-8" {...props}>{props.children}</p>
                    }
                }}
            >
                {finalContent}
            </ReactMarkdown>
        </div>
    );
}
