
import Link from 'next/link';
import { getAllArchives } from '@/lib/archive';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Archives",
    description: "Browse the complete archives.",
};

export default function ArchiveIndex() {
    const archives = getAllArchives();

    // Group by top-level directory
    const groupedArchives = archives.reduce((acc, doc) => {
        const parts = doc.slug.split('/');
        // If it's a file at root of archive, put it in 'Miscellaneous'
        const topDir = parts.length > 1 ? parts[0] : 'Miscellaneous';

        if (!acc[topDir]) {
            acc[topDir] = [];
        }
        acc[topDir].push(doc);
        return acc;
    }, {} as Record<string, typeof archives>);

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Archives</h1>

            {Object.entries(groupedArchives).map(([category, docs]) => (
                <div key={category} className="mb-8">
                    <h2 className="text-2xl font-serif font-semibold mb-4 capitalize px-2 border-l-4 border-yellow-400">{category.replace(/-/g, ' ')}</h2>
                    <ul className="grid gap-4 sm:grid-cols-2">
                        {docs.map((doc) => (
                            <li key={doc.slug} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <Link href={`/archive/${doc.slug}`} className="block h-full flex flex-col">
                                    <h3 className="text-lg font-medium mb-2">
                                        {doc.meta.title || doc.slug.split('/').pop()?.replace(/-/g, ' ')}
                                    </h3>
                                    {doc.meta.description && <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">{doc.meta.description}</p>}
                                    <div className="mt-4 text-xs text-gray-400 uppercase tracking-wider">
                                        Read more →
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
