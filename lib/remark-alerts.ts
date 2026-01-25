import { visit } from 'unist-util-visit';

export default function remarkAlerts() {
  return (tree: any) => {
    visit(tree, 'blockquote', (node: any) => {
      // Helper to find the first paragraph and text
      if (!node.children || node.children.length === 0) return;
      const firstChild = node.children[0];
      if (firstChild.type !== 'paragraph' || !firstChild.children || firstChild.children.length === 0) return;
      
      const firstTextNode = firstChild.children[0];
      if (firstTextNode.type !== 'text') return;

      const text = firstTextNode.value;
      const match = text.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/);

      if (match) {
        const type = match[1];
        
        // Add data attribute to the blockquote node
        // rehype will pick this up if we pass it correctly, or react-markdown will see it in props
        if (!node.data) node.data = {};
        if (!node.data.hProperties) node.data.hProperties = {};
        
        node.data.hProperties['data-alert-type'] = type;

        // Strip the marker from the text
        const newText = text.replace(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/, '');
        firstTextNode.value = newText;
      }
    });
  };
}
