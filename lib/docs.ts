import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), 'everything-docs');

export function getDocSlugs() {
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }

  const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
      const files = fs.readdirSync(dirPath);
      files.forEach((file) => {
          const fullPath = path.join(dirPath, file);
          if (fs.statSync(fullPath).isDirectory()) {
              if (file !== 'annotations') {
                  getAllFiles(fullPath, arrayOfFiles);
              }
          } else {
              if (file.endsWith('.md')) {
                  arrayOfFiles.push(path.relative(docsDirectory, fullPath));
              }
          }
      });
      return arrayOfFiles;
  };

  return getAllFiles(docsDirectory).map(file => file.replace(/\.md$/, ''));
}

export function getDocBySlug(slug: string) {
  // slug can be "military/aircraft-carrier"
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
    const annotations: Annotation[] = [];
    const currentDocAbsPath = path.join(docsDirectory, `${slug}.md`);

    // Define directories to check
    const dirsToCheck = [
        path.join(docsDirectory, 'annotations'), // Global
        path.join(path.dirname(currentDocAbsPath), 'annotations') // Local
    ];

    // Deduplicate directories
    const uniqueDirs = [...new Set(dirsToCheck)];

    for (const annotationsDir of uniqueDirs) {
        if (!fs.existsSync(annotationsDir)) {
            continue;
        }

        const files = fs.readdirSync(annotationsDir).filter(file => file.endsWith('.md'));

        for (const file of files) {
            const fullPath = path.join(annotationsDir, file);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            // Check if this annotation belongs to the current doc
            let isMatch = false;
            if (data.source_doc === currentDocAbsPath) {
                isMatch = true;
            } else if (data.source_doc && path.basename(data.source_doc) === path.basename(currentDocAbsPath)) {
                 isMatch = true;
            }

            if (!isMatch) continue;

            const questionMatch = content.match(/## .*?(?:提问|Question)\s+([\s\S]*?)(?=## .*?(?:回答|Answer)|$)/i);
            const answerMatch = content.match(/## .*?(?:回答|Answer)\s+([\s\S]*?)(?=---|$)/i);

            if (questionMatch && answerMatch) {
                let anchor = data.source_anchor || '';

                if (!anchor) {
                    try {
                        const quoteMatch = content.match(/> (?:\[!.*?\] )?.*?原文片段.*?:?\s*\n((?:>.*\n?)+)/);
                        if (quoteMatch) {
                             let rawQuote = quoteMatch[1];
                             rawQuote = rawQuote.replace(/^> ?/gm, '').trim();
                             const parts = rawQuote.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\)|!\[.*?\]\(.*?\))/g);
                             
                             let longest = '';
                             for (const part of parts) {
                                 if (/^(\*\*|\*|`|\[|!)/.test(part)) continue;
                                 const clean = part.trim();
                                 if (clean.length > longest.length) {
                                     longest = clean;
                                 }
                             }
                             
                             if (longest.length > 5) {
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
