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

export function getAllThinks() {
  const slugs = getThinkSlugs();
  const thinks = slugs.map((slug) => getThinkBySlug(slug)).filter((doc) => doc !== null);
  return thinks;
}
