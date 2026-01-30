import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const thinkDirectory = path.join(process.cwd(), 'think');

function getAllMdFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllMdFiles(fullPath));
    } else if (item.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

export function getThinkSlugs() {
  const files = getAllMdFiles(thinkDirectory);
  return files.map(file => {
    const relativePath = path.relative(thinkDirectory, file);
    return relativePath.replace(/\.md$/, '').split(path.sep);
  });
}

function findMdFile(dir: string, slugParts: string[]): string | null {
  const possiblePath = path.join(dir, ...slugParts) + '.md';
  if (fs.existsSync(possiblePath)) {
    return possiblePath;
  }
  return null;
}

export function getThinkBySlug(slug: string | string[]) {
  // Normalize slug to array
  const slugArray = Array.isArray(slug) ? slug : [slug];
  
  // Handle URL decoding
  const decodedSlugArray = slugArray.map(part => decodeURIComponent(part));
  
  const fullPath = findMdFile(thinkDirectory, decodedSlugArray);
  
  if (!fullPath || !fs.existsSync(fullPath)) {
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
    slug: decodedSlugArray.join('/'),
    meta: data,
    content,
  };
}

// ... imports
export interface Annotation {
    source_anchor: string;
    source_hash?: string;
    question: string;
    answer: string;
    tags?: string[];
    created_at?: string;
}

export function getAnnotationsForThink(slug: string | string[]): Annotation[] {
    const slugArray = Array.isArray(slug) ? slug : [slug];
    const decodedSlugArray = slugArray.map(part => decodeURIComponent(part));
    const fullPath = findMdFile(thinkDirectory, decodedSlugArray);

    if (!fullPath || !fs.existsSync(fullPath)) {
        return [];
    }

    const docDir = path.dirname(fullPath);
    const annotationsDir = path.join(docDir, 'annotations');
    
    if (!fs.existsSync(annotationsDir)) {
        return [];
    }

    const files = fs.readdirSync(annotationsDir).filter(file => file.endsWith('.md'));
    const annotations: Annotation[] = [];

    for (const file of files) {
        const annotationPath = path.join(annotationsDir, file);
        const fileContents = fs.readFileSync(annotationPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Check source_doc strict equality
        if (data.source_doc === fullPath) {
             const questionMatch = content.match(/## (?:提问|Question)\s+([\s\S]*?)(?=## (?:回答|Answer)|$)/);
             const answerMatch = content.match(/## (?:回答|Answer)\s+([\s\S]*?)(?=---|$)/);

            if (questionMatch && answerMatch) {
                 annotations.push({
                    source_anchor: data.source_anchor || '',
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

export function getAllThinks() {
  const slugs = getThinkSlugs();
  const thinks = slugs.map((slug) => getThinkBySlug(slug)).filter((doc) => doc !== null);
  return thinks;
}
