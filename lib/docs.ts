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

export function getAllDocs() {
  const slugs = getDocSlugs();
  const docs = slugs.map((slug) => getDocBySlug(slug)).filter((doc) => doc !== null);
  return docs;
}
