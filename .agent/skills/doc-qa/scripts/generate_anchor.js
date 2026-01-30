const crypto = require('crypto');

// Helper to read input from stdin if no args provided
function getInput() {
  return new Promise((resolve) => {
    if (process.argv[2]) {
      resolve(process.argv[2]);
    } else {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (chunk) => {
        data += chunk;
      });
      process.stdin.on('end', () => {
        resolve(data);
      });
    }
  });
}

function stripMarkdown(text) {
  return text
    // Remove bold/italic markers
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove inline code
    .replace(/`(.*?)`/g, '$1')
    // Remove links [text](url) -> text
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // Remove images ![text](url) -> text
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1')
    // Remove HTML tags if any
    .replace(/<[^>]*>/g, '')
    // Collapse excess whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

function generateAnchor(text) {
  if (!text || !text.trim()) {
    return { hash: '', anchor_text: '' };
  }

  // Use raw-ish normalized text for the hash to maintain stability relative to the source
  const rawNormalized = text.trim().replace(/\s+/g, ' ');
  const hash = crypto.createHash('sha256').update(rawNormalized).digest('hex').substring(0, 16);

  // Strip Markdown for the anchor_text to match what the user sees in the browser
  const cleanText = stripMarkdown(text);
  const anchorText = cleanText.substring(0, 64).trim();

  return {
    hash: hash,
    anchor_text: anchorText
  };
}

getInput().then(input => {
  const result = generateAnchor(input);
  console.log(JSON.stringify(result, null, 2));
});
