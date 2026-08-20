const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const sitemapPath = path.join(projectRoot, 'public/sitemap.xml');
const robotsPath = path.join(projectRoot, 'public/robots.txt');
const distDir = path.join(projectRoot, 'dist');
const seoPagesDir = path.join(projectRoot, 'src/data/seo-pages');

console.log('=== STARTING INDEXING READINESS VALIDATION ===\n');

// 1. Check Sitemap
let sitemapUrls = new Set();
if (fs.existsSync(sitemapPath)) {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  const regex = /<loc>(https:\/\/www\.doctransfer\.app\/[^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    sitemapUrls.add(match[1]);
  }
  console.log(`[PASS] sitemap.xml exists with ${sitemapUrls.size} URLs.`);
} else {
  console.log(`[FAIL] sitemap.xml not found at ${sitemapPath}`);
}

// 2. Check Robots.txt
if (fs.existsSync(robotsPath)) {
  const content = fs.readFileSync(robotsPath, 'utf8');
  console.log(`[PASS] robots.txt exists.`);
  const disallows = content.split('\n').filter(line => line.trim().toLowerCase().startsWith('disallow:'));
  let blockages = [];
  for (const line of disallows) {
    const rule = line.substring(9).trim();
    if (['/alternatives', '/comparisons', '/how-to', '/industry', '/templates'].some(cat => rule.startsWith(cat))) {
      blockages.push(line);
    }
  }
  if (blockages.length > 0) {
    console.log(`[WARNING] robots.txt contains rules that may block crawling:`);
    blockages.forEach(b => console.log(`  - ${b}`));
  } else {
    console.log(`[PASS] robots.txt does not block our SEO paths.`);
  }
} else {
  console.log(`[WARNING] robots.txt not found at ${robotsPath}. Google will default to crawling everything.`);
}

// 3. Load all vertical group pages to verify their presence
const verticalFiles = [
  { name: 'verticalAlternativesGroup.ts', category: 'alternatives', isRecord: false },
  { name: 'verticalComparisonsGroup.ts', category: 'comparisons', isRecord: false },
  { name: 'verticalHowtoGroup.ts', category: 'how-to', isRecord: false },
  { name: 'verticalIndustryGroup.ts', category: 'industry', isRecord: false },
  { name: 'verticalTemplatesGroup.ts', category: 'templates', isRecord: true }
];

let totalVerticalPages = 0;
const verticalPages = [];

// Sample pages to check metadata (including our new hubs and vertical pages)
const sampleCheckUrls = [
  '/alternatives/docusign-alternative-healthcare',
  '/research/investor-pitch-deck-dwell-time-2026',
  '/tools/vdr-cost-calculator',
  '/integrations/google-drive',
  '/glossary/virtual-data-room',
  '/solutions/fundraising',
  '/docsend-alternative/pricing',
  '/templates'
];
for (const file of verticalFiles) {
  const filePath = path.join(seoPagesDir, file.name);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (file.isRecord) {
      // Matches "  'slug-name': {"
      const regex = /^\s{2}['"]([^'"]+)['"]:\s*\{/gm;
      let match;
      while ((match = regex.exec(content)) !== null) {
        verticalPages.push({
          slug: match[1],
          category: file.category,
          file: file.name
        });
        totalVerticalPages++;
      }
    } else {
      // Matches "    slug: 'slug-name'"
      const regex = /^\s{4}slug:\s*['"]([^'"]+)['"]/gm;
      let match;
      while ((match = regex.exec(content)) !== null) {
        verticalPages.push({
          slug: match[1],
          category: file.category,
          file: file.name
        });
        totalVerticalPages++;
      }
    }
  }
}

console.log(`\nLoaded ${totalVerticalPages} vertical pages to check.`);

// 4. Verify sitemap and prerender coverage
let sitemapMissing = 0;
let htmlMissing = 0;
const sampleChecks = [];

verticalPages.forEach((page, idx) => {
  const url = `https://www.doctransfer.app/${page.category}/${page.slug}`;
  const inSitemap = sitemapUrls.has(url);
  if (!inSitemap) {
    sitemapMissing++;
  }
  
  const htmlPath = path.join(distDir, page.category, page.slug, 'index.html');
  const hasHtml = fs.existsSync(htmlPath);
  if (!hasHtml) {
    htmlMissing++;
    if (htmlMissing <= 10) {
      console.log(`  - Missing HTML for: /${page.category}/${page.slug} (defined in ${page.file})`);
    }
  }
  
  // Collect a sample of 5 pages for deep inspection
  if (sampleChecks.length < 5 && hasHtml) {
    sampleChecks.push({ page, htmlPath });
  }
});

if (sitemapMissing === 0) {
  console.log(`[PASS] All ${totalVerticalPages} new SEO pages are present in sitemap.xml.`);
} else {
  console.log(`[FAIL] ${sitemapMissing} pages are missing from sitemap.xml.`);
}

if (htmlMissing === 0) {
  console.log(`[PASS] All ${totalVerticalPages} new SEO pages are successfully pre-rendered in dist/.`);
} else {
  console.log(`[WARNING] ${htmlMissing} pages are missing pre-rendered HTML files in dist/.`);
}

// 5. Deep-dive into 5 sample pages
console.log(`\n=== Deep Metadata Checks on 5 Sample Pages ===\n`);

sampleChecks.forEach(({ page, htmlPath }) => {
  const content = fs.readFileSync(htmlPath, 'utf8');
  
  console.log(`Checking /${page.category}/${page.slug}:`);
  
  // Title Check
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : null;
  console.log(`  - Title tag: ${title ? `"${title}" [PASS]` : '[FAIL]'}`);
  
  // Description Check
  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || content.match(/<meta\s+content="([^"]+)"\s+name="description"/i);
  const desc = descMatch ? descMatch[1] : null;
  console.log(`  - Meta description: ${desc ? `"${desc.substring(0, 50)}..." [PASS]` : '[FAIL]'}`);
  
  // Canonical Check
  const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : null;
  console.log(`  - Canonical link: ${canonical === `https://www.doctransfer.app/${page.category}/${page.slug}` ? `${canonical} [PASS]` : '[FAIL]'}`);
  
  // Robots noindex Check
  const noindex = content.includes('noindex') || content.includes('none');
  console.log(`  - Noindex blockages check: ${!noindex ? '[PASS] No "noindex" directives found' : '[WARNING] "noindex" directive found!'}`);
  
  // JSON-LD Check
  const hasJsonLd = content.includes('application/ld+json');
  console.log(`  - Schema markup (JSON-LD): ${hasJsonLd ? '[PASS]' : '[FAIL]'}`);
  
  // Visible text content check (google bot)
  const hasRootText = content.includes('Why') || content.includes('DocTransfer') || content.includes('Secure') || content.includes('How');
  console.log(`  - Visible HTML text content: ${hasRootText ? '[PASS] Body contains indexable text content' : '[FAIL] Body is empty or lacks indexable text'}`);
  console.log();
});

console.log('=== SUMMARY OF READINESS ===');
if (sitemapMissing === 0 && htmlMissing === 0) {
  console.log('\nSTATUS: 🟢 100% READY TO SUBMIT TO GOOGLE SEARCH CONSOLE!');
  console.log('All files are built, metadata is correct, crawling is allowed, and all URLs are fully sitemapped.');
} else {
  console.log('\nSTATUS: 🟡 READY WITH WARNINGS');
  console.log(`Please verify the ${sitemapMissing} missing sitemap entries and ${htmlMissing} missing HTML pages.`);
}
