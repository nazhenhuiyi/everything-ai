import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import fs from 'fs';

// Mock fs module
vi.mock('fs', () => {
  return {
    default: {
      existsSync: vi.fn(),
      readdirSync: vi.fn(),
      statSync: vi.fn(),
      readFileSync: vi.fn(),
    },
  };
});

// Import the module under test AFTER mocking
import * as docsLib from './docs';

describe('lib/docs.ts', () => {
  const REAL_CWD = process.cwd();
  const DOCS_DIR = path.join(REAL_CWD, 'everything-docs');
  const ANNOTATIONS_DIR = path.join(DOCS_DIR, 'annotations');

  // Helper to setup FS mocks based on a simple object structure
  // Key: absolute path, Value: string (file content) or array (dir entries)
  const setupFsMock = (fileSystem: Record<string, any>) => {
    vi.mocked(fs.existsSync).mockImplementation((pathArg: any) => {
      return Object.prototype.hasOwnProperty.call(fileSystem, pathArg);
    });

    vi.mocked(fs.readdirSync).mockImplementation((pathArg: any) => {
      const entry = fileSystem[pathArg];
      if (Array.isArray(entry)) return entry;
      throw new Error(`ENOTDIR: not a directory, scandir '${pathArg}'`);
    });

    vi.mocked(fs.statSync).mockImplementation((pathArg: any) => {
      const entry = fileSystem[pathArg];
      if (!entry) throw new Error(`ENOENT: no such file or directory '${pathArg}'`);
      return {
        isDirectory: () => Array.isArray(entry),
        isFile: () => !Array.isArray(entry),
      } as any;
    });

    vi.mocked(fs.readFileSync).mockImplementation((pathArg: any) => {
      const entry = fileSystem[pathArg];
      if (typeof entry === 'string') return entry;
      throw new Error(`EISDIR: illegal operation on a directory, read '${pathArg}'`);
    });
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getDocSlugs', () => {
    it('should return empty list if docs directory does not exist', () => {
      setupFsMock({});
      expect(docsLib.getDocSlugs()).toEqual([]);
    });

    it('should list flat markdown files', () => {
      setupFsMock({
        [DOCS_DIR]: ['hello.md', 'world.md', 'ignored.txt', 'image.png'],
        [path.join(DOCS_DIR, 'hello.md')]: 'content',
        [path.join(DOCS_DIR, 'world.md')]: 'content',
        [path.join(DOCS_DIR, 'ignored.txt')]: 'content',
        [path.join(DOCS_DIR, 'image.png')]: 'content',
      });

      const slugs = docsLib.getDocSlugs();
      expect(slugs.sort()).toEqual(['hello', 'world'].sort());
    });

    it('should recurse into subdirectories but ignore annotations dir', () => {
      setupFsMock({
        [DOCS_DIR]: ['root.md', 'subfolder', 'annotations'],
        [path.join(DOCS_DIR, 'root.md')]: 'content',
        [path.join(DOCS_DIR, 'subfolder')]: ['nested.md'],
        [path.join(DOCS_DIR, 'subfolder', 'nested.md')]: 'content',
        [path.join(DOCS_DIR, 'annotations')]: ['anno1.md'],
        [path.join(DOCS_DIR, 'annotations', 'anno1.md')]: 'content',
      });

      const slugs = docsLib.getDocSlugs();
      expect(slugs.sort()).toEqual(['root', 'subfolder/nested'].sort());
    });
  });

  describe('getDocBySlug', () => {
    it('should return null if file does not exist', () => {
      setupFsMock({ [DOCS_DIR]: [] });
      expect(docsLib.getDocBySlug('non-existent')).toBeNull();
    });

    it('should parse frontmatter and content', () => {
      const slug = 'test-doc';
      const absPath = path.join(DOCS_DIR, `${slug}.md`);
      const fileContent = `---
title: My Test Doc
tags: [a, b]
---
# Content Header
This is the body.`;

      setupFsMock({
        [DOCS_DIR]: [`${slug}.md`],
        [absPath]: fileContent,
      });

      const doc = docsLib.getDocBySlug(slug);
      expect(doc).not.toBeNull();
      expect(doc?.slug).toBe(slug);
      expect(doc?.meta.title).toBe('My Test Doc');
      expect(doc?.meta.tags).toEqual(['a', 'b']);
      expect(doc?.content).toContain('# Content Header');
    });

    it('should extract title from H1 if missing in frontmatter', () => {
        const slug = 'no-fm-title';
        const absPath = path.join(DOCS_DIR, `${slug}.md`);
        const fileContent = `---
tags: [c]
---
# Extracted Title
Body content`;
  
        setupFsMock({
          [DOCS_DIR]: [`${slug}.md`],
          [absPath]: fileContent,
        });
  
        const doc = docsLib.getDocBySlug(slug);
        expect(doc?.meta.title).toBe('Extracted Title');
      });
  });

  describe('getAnnotationsForDoc', () => {
    it('should return empty annotations if annotations dir missing', () => {
        setupFsMock({ [DOCS_DIR]: ['doc.md'] });
        expect(docsLib.getAnnotationsForDoc('doc')).toEqual([]);
    });

    it('should return empty if no matching annotations', () => {
        setupFsMock({
            [DOCS_DIR]: ['doc.md', 'annotations'],
            [path.join(DOCS_DIR, 'doc.md')]: 'content',
            [path.join(DOCS_DIR, 'annotations')]: ['anno1.md'],
            [path.join(DOCS_DIR, 'annotations', 'anno1.md')]: `---
source_doc: /some/other/path.md
---
## Question
Q
## Answer
A`
        });
        expect(docsLib.getAnnotationsForDoc('doc')).toEqual([]);
    });

    it('should match annotation by absolute path', () => {
        const docSlug = 'my-doc';
        const docAbsPath = path.join(DOCS_DIR, `${docSlug}.md`);
        const annoName = 'anno.md';
        const annoAbsPath = path.join(ANNOTATIONS_DIR, annoName);
        
        setupFsMock({
            [DOCS_DIR]: [`${docSlug}.md`, 'annotations'],
            [path.join(DOCS_DIR, `${docSlug}.md`)]: 'content',
            [ANNOTATIONS_DIR]: [annoName],
            [annoAbsPath]: `---
source_doc: ${docAbsPath}
source_anchor: My Anchor
---
## Question
What is this?
## Answer
It is a test.`
        });

        const annos = docsLib.getAnnotationsForDoc(docSlug);
        expect(annos).toHaveLength(1);
        expect(annos[0].source_anchor).toBe('My Anchor');
        expect(annos[0].question).toBe('What is this?');
        expect(annos[0].answer).toBe('It is a test.');
    });

    it('should match annotation by basename fallback', () => {
        const docSlug = 'folder/nested-doc';
        const docAbsPath = path.join(DOCS_DIR, `${docSlug}.md`); // .../everything-docs/folder/nested-doc.md
        
        // Simulating a case where source_doc points to old location or flattened path
        const oldPath = path.join(DOCS_DIR, 'nested-doc.md'); 

        const annoName = 'anno-fallback.md';
        const annoAbsPath = path.join(ANNOTATIONS_DIR, annoName);

        setupFsMock({
            [DOCS_DIR]: ['folder', 'annotations'],
            [path.join(DOCS_DIR, 'folder')]: ['nested-doc.md'],
            [docAbsPath]: 'content',
            [ANNOTATIONS_DIR]: [annoName],
            [annoAbsPath]: `---
source_doc: ${oldPath}
---
## Question
Q
## Answer
A`
        });

        const annos = docsLib.getAnnotationsForDoc(docSlug);
        expect(annos).toHaveLength(1);
        expect(annos[0].question).toBe('Q');
    });

    it('should extract anchor from quote if missing in frontmatter', () => {
        const docSlug = 'auto-anchor';
        const docAbsPath = path.join(DOCS_DIR, `${docSlug}.md`);
        const annoName = 'anno-auto.md';

        const quoteContent = `
> [!quote] 原文片段
> This is the **bold** text that should be extracted as anchor.
`;
        const fileContent = `---
source_doc: ${docAbsPath}
---
${quoteContent}

## Question
Q
## Answer
A`;

        setupFsMock({
            [DOCS_DIR]: [`${docSlug}.md`, 'annotations'],
            [DOCS_DIR + '/annotations']: [annoName], // lazy join for test
            [path.join(ANNOTATIONS_DIR, annoName)]: fileContent
        });

        const annos = docsLib.getAnnotationsForDoc(docSlug);
        expect(annos).toHaveLength(1);
        // logic in getAnnotationsForDoc cleans markdown. 
        // "This is the **bold** text that should be extracted as anchor."
        // Split by **...**: "This is the ", "**bold**", " text that should be extracted as anchor."
        // Longest clean part: " text that should be extracted as anchor." (trimmed)
        expect(annos[0].source_anchor).toBe('text that should be extracted as anchor.'); 
    });
  });
});
