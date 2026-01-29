import Link from 'next/link';
import { getAllThinks } from '@/lib/think';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Thinking",
    description: "深度思考与洞见。",
};

export default function ThinkIndex() {
    const thinks = getAllThinks();

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Thinking</h1>
            <ul className="space-y-4">
                {thinks.map((doc) => (
                    <li key={doc.slug} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <Link href={`/think/${doc.slug}`} className="block">
                            <h2 className="text-xl font-semibold">{doc.meta.title || doc.slug.replace(/-/g, ' ')}</h2>
                            {doc.meta.title && <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 capitalize">{doc.slug.replace(/-/g, ' ')}</p>}
                            {doc.meta.description && <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{doc.meta.description}</p>}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
