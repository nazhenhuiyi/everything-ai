
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

    it('should match fuzzy text (ignoring punctuation)', async () => {
        // Mock cleaning behavior: anchor has punctuations removed
        const annotations = [createAnnotation('1815年印尼坦博拉', '1')];
        const input = '<p>1815年，印尼坦博拉火山爆发。</p>';
        const expected = '<p><span data-annotation-index="0" class="annotation-highlight">1815年，印尼坦博拉</span>火山爆发。</p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });


    it('should match multiple annotations in the same paragraph', async () => {
        const annotations = [
            createAnnotation('first part', '1'),
            createAnnotation('second part', '2')
        ];
        const input = '<p>This is the first part and this is the second part.</p>';
        const expected = '<p>This is the <span data-annotation-index="0" class="annotation-highlight">first part</span> and this is the <span data-annotation-index="1" class="annotation-highlight">second part</span>.</p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should match across multiple nested tags', async () => {
        const annotations = [createAnnotation('Nested Highlight', '1')];
        const input = '<p>This is a <strong><em>Nested Highlight</em></strong> test.</p>';
        const expected = '<p>This is a <strong><em><span data-annotation-index="0" class="annotation-highlight">Nested Highlight</span></em></strong> test.</p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should match text spanning across a tag boundary', async () => {
        const annotations = [createAnnotation('partially bold', '1')];
        const input = '<p>This is <strong>partially</strong> bold text.</p>';
        // The logic applies highlights to each text node. 
        // "partially bold" -> "partially" (in strong) and " bold" (outside)
        const expected = '<p>This is <strong><span data-annotation-index="0" class="annotation-highlight">partially</span></strong><span data-annotation-index="0" class="annotation-highlight"> bold</span> text.</p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should match text inside an anchor (link) tag', async () => {
        const annotations = [createAnnotation('clickable link', '1')];
        const input = '<p>Check this <a href="#">clickable link</a> now.</p>';
        const expected = '<p>Check this <a href="#"><span data-annotation-index="0" class="annotation-highlight">clickable link</span></a> now.</p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should ignore text inside script and style tags', async () => {
        const annotations = [createAnnotation('secret', '1')];
        const input = '<p>visible</p><script>const secret = "true";</script><style>.secret { color: red; }</style>';
        // Should not highlight inside script/style
        const expected = '<p>visible</p><script>const secret = "true";</script><style>.secret { color: red; }</style>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should only highlight inside specified container tags', async () => {
        const annotations = [createAnnotation('ignored', '1'), createAnnotation('matched', '2')];
        const input = '<footer>ignored</footer><p>matched</p>';
        const expected = '<footer>ignored</footer><p><span data-annotation-index="1" class="annotation-highlight">matched</span></p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should ignore annotations with length less than 2', async () => {
        const annotations = [createAnnotation('a', '1'), createAnnotation('aa', '2')];
        const input = '<p>a aa</p>';
        // 'a' should be ignored, 'aa' should be matched
        const expected = '<p>a <span data-annotation-index="1" class="annotation-highlight">aa</span></p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should match multiple occurrences of the same annotation', async () => {
        const annotations = [createAnnotation('test', '0')];
        const input = '<p>test and test and test</p>';
        const expected = '<p><span data-annotation-index="0" class="annotation-highlight">test</span> and <span data-annotation-index="0" class="annotation-highlight">test</span> and <span data-annotation-index="0" class="annotation-highlight">test</span></p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should handle fuzzy matching with varying whitespace', async () => {
        const annotations = [createAnnotation('multi word anchor', '0')];
        // Input has multiple spaces and a newline
        const input = '<p>multi   word\nanchor</p>';
        const expected = '<p><span data-annotation-index="0" class="annotation-highlight">multi   word\nanchor</span></p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should match fuzzy text with interjected punctuation (noise)', async () => {
        const annotations = [createAnnotation('坦博拉火山爆发', '0')];
        // Text has a comma/noise in between
        const input = '<p>坦博拉，火山爆发于1815年。</p>';
        const expected = '<p><span data-annotation-index="0" class="annotation-highlight">坦博拉，火山爆发</span>于1815年。</p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
    });

    it('should not re-match text that is already highlighted', async () => {
        const annotations = [
            createAnnotation('inner', '0'),
            createAnnotation('outer inner', '1')
        ];
        // If 'inner' is matched first or 'outer inner' is matched.
        // The implementation sorts by length: 'outer inner' (11) > 'inner' (5).
        // So 'outer inner' should be matched first.
        const input = '<p>outer inner</p>';
        const expected = '<p><span data-annotation-index="1" class="annotation-highlight">outer inner</span></p>';

        const file = await processor()
            .use(rehypeAnnotate, { annotations })
            .process(input);

        expect(String(file)).toBe(expected);
        
        // Now test the other way: if a smaller one is already there (simulated by processing twice)
        // But the current impl re-gathers pointers and skips nodes with 'annotation-highlight'
        const file2 = await processor()
            .use(rehypeAnnotate, { annotations: [createAnnotation('inner', '0')] })
            .use(rehypeAnnotate, { annotations: [createAnnotation('inner', '2')] })
            .process(input);
        
        // It should match once, and then the second pass should find nothing because 'inner' is already inside a span.
        expect(String(file2)).toBe('<p>outer <span data-annotation-index="0" class="annotation-highlight">inner</span></p>');
    });
});
