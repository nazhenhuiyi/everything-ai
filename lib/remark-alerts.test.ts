
import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkAlerts from './remark-alerts';

describe('remarkAlerts', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkAlerts)
    .use(remarkRehype)
    .use(rehypeStringify);

  it('should transform NOTE alert', async () => {
    const input = '> [!NOTE]\n> This is a note.';
    // Expect the blockquote to have the data attribute and the text to be cleaned
    const result = await processor.process(input);
    expect(String(result).trim()).toContain('<blockquote data-alert-type="NOTE">');
    expect(String(result)).toContain('This is a note.');
    expect(String(result)).not.toContain('[!NOTE]');
  });

  it('should transform TIP alert', async () => {
    const input = '> [!TIP]\n> This is a tip.';
    const result = await processor.process(input);
    expect(String(result).trim()).toContain('<blockquote data-alert-type="TIP">');
  });

  it('should transform IMPORTANT alert', async () => {
    const input = '> [!IMPORTANT]\n> This is important.';
    const result = await processor.process(input);
    expect(String(result).trim()).toContain('<blockquote data-alert-type="IMPORTANT">');
  });

  it('should transform WARNING alert', async () => {
    const input = '> [!WARNING]\n> This is a warning.';
    const result = await processor.process(input);
    expect(String(result).trim()).toContain('<blockquote data-alert-type="WARNING">');
  });

  it('should transform CAUTION alert', async () => {
    const input = '> [!CAUTION]\n> This is a caution.';
    const result = await processor.process(input);
    expect(String(result).trim()).toContain('<blockquote data-alert-type="CAUTION">');
  });

  it('should not transform normal blockquotes', async () => {
    const input = '> This is a normal quote.';
    const result = await processor.process(input);
    expect(String(result)).not.toContain('data-alert-type');
    expect(String(result)).toContain('<blockquote>');
    expect(String(result)).toContain('This is a normal quote.');
  });

  it('should not transform unknown alert types', async () => {
    const input = '> [!UNKNOWN]\n> This is unknown.';
    const result = await processor.process(input);
    expect(String(result)).not.toContain('data-alert-type');
    expect(String(result)).toContain('[!UNKNOWN]');
  });

  it('should handle multiline alerts', async () => {
    const input = '> [!NOTE]\n> This is a note.\n> It has multiple lines.';
    const result = await processor.process(input);
    expect(String(result)).toContain('<blockquote data-alert-type="NOTE">');
    expect(String(result)).toContain('This is a note.');
    expect(String(result)).toContain('It has multiple lines.');
  });
  
  it('should handle alerts with nested content (if remark-parse supports it inside blockquotes)', async () => {
      // While the current implementation checks the first child, it's good to ensure it doesn't break
      const input = '> [!NOTE]\n> **Bold** text.';
      const result = await processor.process(input);
      expect(String(result)).toContain('<blockquote data-alert-type="NOTE">');
      expect(String(result)).toContain('<strong>Bold</strong>');
  });
});
