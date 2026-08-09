const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/data/seo-pages/verticalTemplatesGroup.ts');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /^\s{2}['"]([^'"]+)['"]:\s*\{/gm;
  let match;
  const slugs = [];
  while ((match = regex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  console.log(`Total template slugs: ${slugs.length}`);
  console.log('First 20 slugs:');
  console.log(slugs.slice(0, 20).join('\n'));
} else {
  console.error('File not found:', filePath);
}
