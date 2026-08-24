const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
console.log('🔍 Validating Phase 1 Internal Linking & Navigation Overhaul...\n');

// 1. Check Homepage dist/index.html
const indexHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error('❌ dist/index.html does not exist!');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

const requiredLinks = [
  '/sitemap-directory',
  '/alternatives',
  '/comparisons',
  '/templates',
  '/tools',
  '/solutions',
  '/glossary',
  '/blog',
  '/research',
  '/pricing'
];

console.log('1. Checking Homepage Internal Links:');
let missingLinks = 0;
for (const link of requiredLinks) {
  if (indexContent.includes(link)) {
    console.log(`  ✅ Found link: ${link}`);
  } else {
    console.warn(`  ⚠️ Missing link: ${link}`);
    missingLinks++;
  }
}

// 2. Check Static Pre-rendered Sub-pages
console.log('\n2. Checking Pre-rendered HTML Pages for Internal Navigation:');
const checkFiles = [
  'alternatives/docusign-alternative/index.html',
  'comparisons/docusign-vs-doctransfer/index.html',
  'how-to/how-to-sign-pdf-online/index.html',
  'templates/nda-template/index.html',
  'industry/real-estate-contracts/index.html',
  'blog/mutual-vs-unilateral-nda-guide/index.html'
];

let validSubPages = 0;
for (const relPath of checkFiles) {
  const fullPath = path.join(distDir, relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasArticle = content.includes('<article>') && content.includes('</article>');
    const hasDirectoryLink = content.includes('sitemap-directory');
    const hasToolsLink = content.includes('/tools');
    
    if (hasArticle && hasDirectoryLink && hasToolsLink) {
      console.log(`  ✅ ${relPath} (Article + Internal Link Mesh verified)`);
      validSubPages++;
    } else {
      console.warn(`  ⚠️ ${relPath} missing article or links: hasArticle=${hasArticle}, hasDirectoryLink=${hasDirectoryLink}, hasToolsLink=${hasToolsLink}`);
    }
  } else {
    console.warn(`  ⚠️ File not found: ${relPath}`);
  }
}

console.log(`\n🎉 Phase 1 Internal Linking Validation Complete!`);
console.log(`   - Homepage Links checked: ${requiredLinks.length - missingLinks}/${requiredLinks.length}`);
console.log(`   - Verified Sub-page Samples: ${validSubPages}/${checkFiles.length}\n`);
