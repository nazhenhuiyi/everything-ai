import { visit } from 'unist-util-visit';
import { Annotation } from '@/lib/docs';

// This plugin will search text nodes for the anchor text of annotations
// and wrap them in a <span data-annotation-index="...">
export default function rehypeAnnotate(options: { annotations: Annotation[] }) {
    return (tree: any) => {
        if (!options.annotations || options.annotations.length === 0) {
            // console.log('[rehype-annotate] No annotations provided.');
            return;
        }


        visit(tree, 'text', (node: any, index: number | null | undefined, parent: any) => {
            if (typeof index !== 'number' || !parent) return;
            
            // Avoid warping inside code blocks or other structural elements if possible
            // But rehype operates on HTML AST usually. 
            // If we use rehyp-annotate AFTER remark-rehype, we are in HTML land.
            // We should be careful not to break HTML syntax.
            if (!parent || parent.tagName === 'code' || parent.tagName === 'pre' || parent.tagName === 'script' || (parent.tagName === 'span' && parent.properties?.className?.includes('annotation-highlight'))) {
                 return;
            }

            const value = node.value;
            if (!value) return;

            // Sort annotations by length (longest first) to avoid partial matches of shorter substrings
            const sortedAnnotations = options.annotations
                .map((a, i) => ({ annotation: a, originalIndex: i }))
                .sort((a, b) => (b.annotation.source_anchor?.length || 0) - (a.annotation.source_anchor?.length || 0));

            for (let i = 0; i < sortedAnnotations.length; i++) {
                const { annotation: annot, originalIndex } = sortedAnnotations[i];
                if (!annot.source_anchor || annot.source_anchor.length < 2) continue;

                // 1. Try exact match first (standard)
                let idx = value.indexOf(annot.source_anchor);
                let matchLength = annot.source_anchor.length;

                // 2. If exact match fails, try a more robust "fuzzy" match that ignores punctuation
                if (idx === -1 && annot.source_anchor.length > 5) {
                    // Create a regex that allows optional punctuation/noise between characters
                    // This handles cases where source_anchor was cleaned (e.g. "Words" instead of "Words.")
                    const noise = '[^\\w\\u4e00-\\u9fa5\\s-]*';
                    const escaped = annot.source_anchor.split('').map(c => {
                        if (/\s/.test(c)) return '\\s+'; // Match any whitespace
                        return c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escapeRegExp inline
                    }).join(noise);
                    
                    try {
                        const regex = new RegExp(escaped);
                        const m = value.match(regex);
                        if (m && m.index !== undefined) {
                            idx = m.index;
                            matchLength = m[0].length;
                        }
                    } catch (e) {
                        // Ignore regex errors
                    }
                }

                if (idx !== -1) {
                     // Found a match!
                     const before = value.substring(0, idx);
                     const matchText = value.substring(idx, idx + matchLength);
                     const after = value.substring(idx + matchLength);
                     
                     node.value = before; 
                     
                     const spanNode = {
                        type: 'element',
                        tagName: 'span',
                        properties: {
                            'data-annotation-index': originalIndex,
                            className: 'annotation-highlight'
                        },
                        children: [{ type: 'text', value: matchText }]
                     };

                     const afterNode = {
                        type: 'text',
                        value: after
                     };

                     parent.children.splice(index + 1, 0, spanNode, afterNode);
                     return index;  
                }
            }
        });
    };
}
