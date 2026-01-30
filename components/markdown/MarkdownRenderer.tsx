// ... imports
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
import Popover from '@/components/ui/Popover';
import rehypeAnnotate from '@/lib/rehype-annotate';
import { Annotation } from '@/lib/docs';

interface MarkdownRendererProps {
    content: string;
    annotations?: Annotation[];
}

export default function MarkdownRenderer({ content, annotations = [] }: MarkdownRendererProps) {
    return (
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
                                    <Popover
                                        trigger={props.children}
                                        content={
                                            <div className="space-y-3 font-sans">
                                                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Knowledge Card</div>
                                                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                    {annotation.question}
                                                </div>
                                                <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                                    <ReactMarkdown>{annotation.answer}</ReactMarkdown>
                                                </div>
                                                {annotation.tags && (
                                                    <div className="flex gap-2 pt-2">
                                                        {annotation.tags.map(tag => (
                                                            <span key={tag} className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500">#{tag}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    />
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
                {content}
            </ReactMarkdown>
        </div>
    );
}
