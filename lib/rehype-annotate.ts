import { visit } from 'unist-util-visit';
import { Annotation } from '@/lib/docs';

// This plugin will search text nodes for the anchor text of annotations
// and wrap them in a <span data-annotation-index="...">
export default function rehypeAnnotate(options: { annotations: Annotation[] }) {
    return (tree: any) => {
        if (!options.annotations || options.annotations.length === 0) return;

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

            // Simple exact match replacement
            // Note: This simple approach only works if the anchor text is continuously in one text node.

            // We need to handle multiple annotations in one text node
            // But simple replace is tricky with overlapping. 
            // Let's just look for the first match for simplicity or iterate.
            
            // Sort annotations by length (longest first) to avoid partial matches of shorter substrings
            // Map to preserve original index
            const sortedAnnotations = options.annotations
                .map((a, i) => ({ annotation: a, originalIndex: i }))
                .sort((a, b) => b.annotation.source_anchor.length - a.annotation.source_anchor.length);

            // Find valid matches
            // This is O(N*M) - acceptable for document size < 100kb and < 20 annot.
            for (let i = 0; i < sortedAnnotations.length; i++) {
                const { annotation: annot, originalIndex } = sortedAnnotations[i];
                if (!annot.source_anchor || annot.source_anchor.length < 2) continue; // Skip too short

                const idx = value.indexOf(annot.source_anchor);
                if (idx !== -1) {
                     // Found a match!
                     // Split the node.
                     const before = value.substring(0, idx);
                     const match = value.substring(idx, idx + annot.source_anchor.length);
                     const after = value.substring(idx + annot.source_anchor.length);

                     // We need to return a new set of nodes to replace the current matches
                     // But since we are inside a visit loop, editing the tree is standard but tricky.
                     // Let's just do one match per node to avoid infinite loops or complexity for now.
                     
                     node.value = before; // Update current node to be "before"
                     
                     const spanNode = {
                        type: 'element',
                        tagName: 'span',
                        properties: {
                            'data-annotation-index': originalIndex, // Use the original index from the unsorted array
                            className: 'annotation-highlight'
                        },
                        children: [{ type: 'text', value: match }]
                     };

                     const afterNode = {
                        type: 'text',
                        value: after
                     };

                     // Insert into parent
                     // parent.children.splice(index + 1, 0, spanNode, afterNode);
                     
                     // Actually, better to replace the current node with [beforeNode, spanNode, afterNode]
                     // But `visit` allows mutating the current node.
                     // If we mutate `node`, we are fine.
                     // But we need to insert the others.
                     
                     parent.children.splice(index + 1, 0, spanNode, afterNode);
                     
                     // Stop processing this node to avoid re-matching the same text or infinite loops
                     // visitor standard behavior: usually we need to return the new index to continue.
                     // We return index to re-process the current node (which is now the 'before' part)
                     // This ensures we catch matches that were effectively moved to 'before' because a later/longer match was processed first.
                     return index;  
                }
            }
        });
    };
}
