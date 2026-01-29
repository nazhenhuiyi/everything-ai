import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const thinkDirectory = path.join(process.cwd(), 'think');

export function getThinkSlugs() {
  if (!fs.existsSync(thinkDirectory)) {
    return [];
  }
  return fs.readdirSync(thinkDirectory)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''));
}

export function getThinkBySlug(slug: string) {
  // Handle URL decoding in case slug contains non-ASCII characters (often happens with Chinese filenames)
  const decodedSlug = decodeURIComponent(slug);
  const fullPath = path.join(thinkDirectory, `${decodedSlug}.md`);
  
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

export function getAllThinks() {
  const slugs = getThinkSlugs();
  const thinks = slugs.map((slug) => getThinkBySlug(slug)).filter((doc) => doc !== null);
  return thinks;
}
