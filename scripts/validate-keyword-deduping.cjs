const fs = require('fs');
const path = require('path');

const seoPagesDir = path.resolve(__dirname, '../src/data/seo-pages');
const files = fs.readdirSync(seoPagesDir).filter(f => f.endsWith('.ts'));

const keywordMap = {};
let totalPagesInspected = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(seoPagesDir, file), 'utf8');
  const slugMatches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
  const keywordsMatches = [...content.matchAll(/keywords:\s*['"]([^'"]+)['"]/g)];

  for (let i = 0; i < slugMatches.length; i++) {
    const slug = slugMatches[i] ? slugMatches[i][1] : null;
    const kwString = keywordsMatches[i] ? keywordsMatches[i][1] : '';
    
    if (slug && kwString) {
      totalPagesInspected++;
      const kwList = kwString.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
      for (const kw of kwList) {
        if (!keywordMap[kw]) keywordMap[kw] = [];
        keywordMap[kw].push(slug);
      }
    }
  }
}

console.log('🔍 Validating Phase 2 Keyword Deduping & Disambiguation...\n');
console.log(`- Total Programmatic Pages Analyzed: ${totalPagesInspected}`);
console.log(`- Total Unique Keywords Tracked: ${Object.keys(keywordMap).length}`);

// Find any keywords shared across > 2 pages
const severeDuplicates = Object.entries(keywordMap).filter(([kw, slugs]) => slugs.length > 2);

console.log(`\nResults:`);
if (severeDuplicates.length === 0) {
  console.log('✅ PASS: Zero severe keyword cannibalization found across all vertical pages!');
} else {
  console.warn(`⚠️ Found ${severeDuplicates.length} keywords shared across >2 pages:`);
  severeDuplicates.forEach(([kw, slugs]) => {
    console.warn(`  - "${kw}" (${slugs.length} pages): ${slugs.slice(0, 5).join(', ')}`);
  });
}
