const fs = require('fs');
const path = require('path');

const seoPagesDir = path.resolve(__dirname, '../src/data/seo-pages');
const files = fs.readdirSync(seoPagesDir).filter(f => f.endsWith('.ts'));

console.log('🧹 Executing Clean Keyword Sanitization across all 12 data files...\n');

let totalPagesCleaned = 0;

for (const file of files) {
  const filePath = path.join(seoPagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileModified = false;
  
  const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
  const matches = [...content.matchAll(slugRegex)];

  for (let i = 0; i < matches.length; i++) {
    const slugMatch = matches[i];
    const slug = slugMatch[1];
    const startIndex = slugMatch.index;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index : content.length;

    const block = content.substring(startIndex, endIndex);

    // match keywords line, accounting for possible previous malformed quotes
    const keywordsMatch = block.match(/keywords:\s*['"]([^'"\r\n]+)['"]/);
    const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/);

    if (keywordsMatch) {
      const oldKeywords = keywordsMatch[1];
      const title = titleMatch ? titleMatch[1] : '';

      const slugClean = slug
        .replace(/^(templates|how-to|industry|gen-z|alternatives|comparisons)\//, '')
        .replace(/-/g, ' ')
        .replace(/'/g, ''); // remove apostrophes from slug

      const titleClean = title.split('|')[0].split('-')[0].trim().toLowerCase().replace(/'/g, '');

      const uniqueKw1 = slugClean;
      const uniqueKw2 = titleClean && titleClean !== slugClean ? titleClean : `${slugClean} online`;
      const uniqueKw3 = `doctransfer ${slugClean.split(' ')[0]}`;

      const newKeywords = `${uniqueKw1}, ${uniqueKw2}, ${uniqueKw3}`;

      if (oldKeywords !== newKeywords) {
        const targetStr = keywordsMatch[0];
        const replacementStr = `keywords: '${newKeywords}'`;
        
        const updatedBlock = block.replace(targetStr, replacementStr);
        content = content.substring(0, startIndex) + updatedBlock + content.substring(endIndex);
        fileModified = true;
        totalPagesCleaned++;
      }
    }
  }

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Sanitized keywords in [${file}]`);
  }
}

// Manually fix lines 3410 and 3716 in verticalHowtoGroup.ts if any leftover bad string remains
const howToPath = path.join(seoPagesDir, 'verticalHowtoGroup.ts');
let howToContent = fs.readFileSync(howToPath, 'utf8');
howToContent = howToContent.replace(/doctransfer how's/g, 'doctransfer hows');
fs.writeFileSync(howToPath, howToContent, 'utf8');

console.log(`\n🎉 Keyword Sanitization Complete! Updated ${totalPagesCleaned} entries.`);
