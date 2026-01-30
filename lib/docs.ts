import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), 'everything-docs');

export function getDocSlugs() {
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }
  return fs.readdirSync(docsDirectory)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''));
}

export function getDocBySlug(slug: string) {
  const fullPath = path.join(docsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
      return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // If title is not in frontmatter, try to extract it from the first H1 in content
  if (!data.title) {
    const h1Match = content.match(/^#\s+(.*)$/m);
    if (h1Match) {
      data.title = h1Match[1].replace(/[#*`]/g, '').trim();
    }
  }

  return {
    slug,
    meta: data,
    content,
  };
}

export interface Annotation {
    source_anchor: string;
    source_hash?: string;
    question: string;
    answer: string;
    tags?: string[];
    created_at?: string;
}

export function getAnnotationsForDoc(slug: string): Annotation[] {
    const annotationsDir = path.join(docsDirectory, 'annotations');
    
    if (!fs.existsSync(annotationsDir)) {
        return [];
    }

    const files = fs.readdirSync(annotationsDir).filter(file => file.endsWith('.md'));
    const annotations: Annotation[] = [];

    // Optimize: Could map slug to file, but for now linear scan is fine for small scale
    // Or we rely on the user-defined 'source_doc' field in the annotation.
    // Let's assume the annotation file naming or metadata links it.
    // The SKILL says: source_doc: [absolute path].
    
    // We need to resolve the absolute path of the current doc to match.
    const currentDocAbsPath = path.join(docsDirectory, `${slug}.md`);

    for (const file of files) {
        const fullPath = path.join(annotationsDir, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Check if this annotation belongs to the current doc
        // The source_doc field is an absolute path.
        if (data.source_doc === currentDocAbsPath) {
             // Extract Question and Answer from content
            // The content format is: ## 提问 \n ... \n ## 回答 \n ...
            // Let's parse it simply.
            const questionMatch = content.match(/## (?:提问|Question)\s+([\s\S]*?)(?=## (?:回答|Answer)|$)/);
            const answerMatch = content.match(/## (?:回答|Answer)\s+([\s\S]*?)(?=---|$)/);

            if (questionMatch && answerMatch) {
                let anchor = data.source_anchor || '';

                // Fallback: If no anchor in frontmatter, try to extract from the "Original Fragment" quote
                if (!anchor) {
                    try {
                        const quoteMatch = content.match(/> (?:\[!.*?\] )?.*?原文片段.*?:?\s*\n((?:>.*\n?)+)/);
                        if (quoteMatch) {
                             let rawQuote = quoteMatch[1];
                             // Remove '>' prefixes
                             rawQuote = rawQuote.replace(/^> ?/gm, '').trim();

                             // Split by common markdown formatting to find the longest plain text segment
                             // This is necessary because rehype-annotate matches against simple text nodes,
                             // and markdown formatting breaks text nodes.
                             // We split by bold (**...**), italic (*...*), code (`...`), links ([...](...)), images (![...](...))
                             const parts = rawQuote.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\)|!\[.*?\]\(.*?\))/g);
                             
                             let longest = '';
                             for (const part of parts) {
                                 // Check if it's likely a formatted part (starts with reserved char)
                                 if (/^(\*\*|\*|`|\[|!)/.test(part)) continue;
                                 
                                 const clean = part.trim();
                                 if (clean.length > longest.length) {
                                     longest = clean;
                                 }
                             }
                             
                             if (longest.length > 5) { // Minimum length check
                                 anchor = longest;
                             }
                        }
                    } catch (e) {
                        console.warn(`Failed to extract anchor for ${file}:`, e);
                    }
                }

                annotations.push({
                    source_anchor: anchor,
                    source_hash: data.source_hash,
                    question: questionMatch[1].trim(),
                    answer: answerMatch[1].trim(),
                    tags: data.tags,
                    created_at: data.created_at
                });
            }
        }
    }
    return annotations;
}

export function getAllDocs() {
  const slugs = getDocSlugs();
  const docs = slugs.map((slug) => getDocBySlug(slug)).filter((doc) => doc !== null);
  return docs;
}
