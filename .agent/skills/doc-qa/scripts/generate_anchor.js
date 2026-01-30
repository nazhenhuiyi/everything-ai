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

function generateAnchor(text) {
  if (!text || !text.trim()) {
    return { hash: '', anchor_text: '' };
  }

  // Normalize text: remove markdown artifacts if possible, collapse whitespace
  const normalized = text.trim().replace(/\s+/g, ' ');

  // Generate Hash (SHA-256, then truncate to 16 chars for brevity but collision resistance)
  const hash = crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);

  // Generate readable anchor text (first 64 chars, clean special chars)
  // Remove markdown headings, bolding, etc for the filename/anchor safe version
  const cleanText = normalized.replace(/[^\w\u4e00-\u9fa5\s-]/g, '').trim(); 
  const anchorText = cleanText.substring(0, 64);

  return {
    hash: hash,
    anchor_text: anchorText
  };
}

getInput().then(input => {
  const result = generateAnchor(input);
  console.log(JSON.stringify(result, null, 2));
});
