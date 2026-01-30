
import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeAnnotate from './rehype-annotate';
import { Annotation } from './docs';

// Mock Annotation interface if not exported or minimal version
// matching what rehypeAnnotate expects
const createAnnotation = (anchor: string, id: string): Annotation => ({
    source_anchor: anchor,
    question: "Test Question",
    answer: "Test Answer",
    created_at: "2023-01-01"
} as Annotation);

describe('rehypeAnnotate', () => {
    const processor = unified()
        .use(rehypeParse, { fragment: true })
        .use(rehypeStringify);

    it('should wrap exact matching text with a span', async () => {
        const annotations = [createAnnotation('valid', '1')];
        const input = '<p>This is a valid test.</p>';
        const expected = '<p>This is a <span data-annotation-index="0" class="annotation-highlight">valid</span> test.</p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should do nothing if no annotations provided', async () => {
        const input = '<p>This is a valid test.</p>';
        const expected = '<p>This is a valid test.</p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations: [] })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should match multiple annotations', async () => {
        const annotations = [
            createAnnotation('first', '1'),
            createAnnotation('second', '2')
        ];
        const input = '<p>The first and the second.</p>';
        // Note: index depends on the original array order
        const expected = '<p>The <span data-annotation-index="0" class="annotation-highlight">first</span> and the <span data-annotation-index="1" class="annotation-highlight">second</span>.</p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should not match partial words if not intended (current impl matches substrings)', async () => {
        // The current implementation uses indexOf, so it WILL match partials.
        // This test documents current behavior.
        const annotations = [createAnnotation('test', '1')];
        const input = '<p>testing</p>';
        const expected = '<p><span data-annotation-index="0" class="annotation-highlight">test</span>ing</p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should prioritize longer matches', async () => {
        // If we have "testing" and "test", "testing" should be matched if it comes first or if sorted by length?
        // The implementation sorts by length descending.
        const annotations = [
            createAnnotation('test', '1'),
            createAnnotation('testing', '2')
        ];
        const input = '<p>testing</p>';
        // "testing" is longer, so it should be matched first.
        // "testing" annotation has index 1 in the original array.
        const expected = '<p><span data-annotation-index="1" class="annotation-highlight">testing</span></p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });
    
    it('should ignore text inside code blocks', async () => {
        const annotations = [createAnnotation('code', '1')];
        const input = '<p>code outside</p><pre><code>code inside</code></pre>';
        const expected = '<p><span data-annotation-index="0" class="annotation-highlight">code</span> outside</p><pre><code>code inside</code></pre>';
        
         const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });
});
