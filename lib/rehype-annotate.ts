import { visit } from 'unist-util-visit';
import { Annotation } from '@/lib/docs';

interface TextPointer {
    text: string;
    node: any;
    parent: any;
}

const ATOMIC_TAGS = ['code', 'pre', 'script', 'style', 'canvas', 'svg'];

export default function rehypeAnnotate(options: { annotations: Annotation[] }) {
    return (tree: any) => {
        if (!options.annotations || options.annotations.length === 0) {
            return;
        }

        const sortedAnnotations = options.annotations
            .map((a, i) => ({ annotation: a, originalIndex: i }))
            .filter(a => a.annotation.source_anchor && a.annotation.source_anchor.length >= 2)
            .sort((a, b) => (b.annotation.source_anchor?.length || 0) - (a.annotation.source_anchor?.length || 0));

        const containers = ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'blockquote'];
        
        visit(tree, 'element', (container: any) => {
            if (!containers.includes(container.tagName)) return;

            // Simple loop to allow multiple matches in one container
            // We re-gather pointers after each successful highlight to stay safe with tree changes
            let attempts = 0;
            const maxAttempts = 100; // Increased guard to handle many occurrences in one container

            while (attempts < maxAttempts) {
                const pointers: TextPointer[] = [];
                const gatherText = (node: any, parent: any) => {
                    if (ATOMIC_TAGS.includes(node.tagName)) return;
                    if (node.properties?.className?.includes('annotation-highlight')) return; // Avoid re-matching highlights
                    
                    if (node.type === 'text') {
                        pointers.push({ text: node.value, node, parent });
                    } else if (node.children) {
                        node.children.forEach((child: any) => gatherText(child, node));
                    }
                };
                gatherText(container, tree);
                if (pointers.length === 0) break;

                const fullText = pointers.map(p => p.text).join('');
                let foundMatch = false;

                for (const { annotation: annot, originalIndex } of sortedAnnotations) {
                    const anchor = annot.source_anchor;
                    if (!anchor) continue;

                    let matchIdx = fullText.indexOf(anchor);
                    let matchLength = anchor.length;

                    // Fuzzy matching logic
                    if (matchIdx === -1 && anchor.length > 5) {
                        const noise = '[^\\w\\u4e00-\\u9fa5\\s-]*';
                        const escaped = anchor.split('').map(c => {
                            if (/\s/.test(c)) return '\\s+';
                            return c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        }).join(noise);
                        
                        try {
                            const regex = new RegExp(escaped);
                            const m = fullText.match(regex);
                            if (m && m.index !== undefined) {
                                matchIdx = m.index;
                                matchLength = m[0].length;
                            }
                        } catch (e) {}
                    }

                    if (matchIdx !== -1) {
                        highlightRange(pointers, matchIdx, matchLength, originalIndex);
                        foundMatch = true;
                        break; 
                    }
                }

                if (!foundMatch) break;
                attempts++;
            }
        });
    };
}

function highlightRange(pointers: TextPointer[], start: number, length: number, annotationIndex: number) {
    let currentOffset = 0;
    const end = start + length;

    const affected: { pointer: TextPointer, localStart: number, localEnd: number }[] = [];

    for (const p of pointers) {
        const pStart = currentOffset;
        const pEnd = currentOffset + p.text.length;
        const overlapStart = Math.max(start, pStart);
        const overlapEnd = Math.min(end, pEnd);

        if (overlapStart < overlapEnd) {
            affected.push({
                pointer: p,
                localStart: overlapStart - pStart,
                localEnd: overlapEnd - pStart
            });
        }
        currentOffset = pEnd;
    }

    // Apply changes in reverse order of nodes to handle multiple text nodes in same parent correctly?
    // Actually, each pointer has a direct reference to its node and parent.
    for (const { pointer, localStart, localEnd } of affected) {
        const { node, parent, text } = { ...pointer, text: pointer.node.value };
        const before = text.substring(0, localStart);
        const match = text.substring(localStart, localEnd);
        const after = text.substring(localEnd);

        const newNodes: any[] = [];
        if (before) newNodes.push({ type: 'text', value: before });
        newNodes.push({
            type: 'element',
            tagName: 'span',
            properties: {
                'data-annotation-index': annotationIndex,
                className: 'annotation-highlight'
            },
            children: [{ type: 'text', value: match }]
        });
        if (after) newNodes.push({ type: 'text', value: after });

        const idx = parent.children.indexOf(node);
        if (idx !== -1) {
            parent.children.splice(idx, 1, ...newNodes);
        }
    }
}
