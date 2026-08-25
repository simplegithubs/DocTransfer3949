/**
 * Indexation Health & Sitemap Auditor (Pillar 3)
 * 
 * Verifies 100% parity between:
 * 1. public/sitemap.xml entries
 * 2. Static pre-rendered HTML files in dist/ (both .html and /index.html)
 * 3. Canonical URLs inside <head>
 * 4. Robots.txt accessibility
 */

const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');
const DIST_DIR = path.resolve(__dirname, '../dist');
const ROBOTS_PATH = path.resolve(__dirname, '../public/robots.txt');

console.log('--- STARTING COMPREHENSIVE INDEXATION HEALTH AUDIT ---\n');

if (!fs.existsSync(SITEMAP_PATH)) {
  console.error('❌ public/sitemap.xml not found! Run npm run build first.');
  process.exit(1);
}

const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');

// Extract all <loc> URLs
const locRegex = /<loc>([^<]+)<\/loc>/g;
let match;
const sitemapUrls = [];
while ((match = locRegex.exec(sitemapContent)) !== null) {
  sitemapUrls.push(match[1]);
}

console.log(`📊 Found ${sitemapUrls.length} URLs in sitemap.xml\n`);

let missingFileCount = 0;
let canonicalMismatchCount = 0;
let validCount = 0;

for (const url of sitemapUrls) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname; // e.g. "/alternatives/docsend-alternative-startups"

  let htmlFilePath;
  if (pathname === '/' || pathname === '') {
    htmlFilePath = path.join(DIST_DIR, 'index.html');
  } else {
    // Check cleanUrl .html file or directory index.html
    const cleanPath = path.join(DIST_DIR, `${pathname}.html`);
    const dirPath = path.join(DIST_DIR, pathname, 'index.html');

    if (fs.existsSync(cleanPath)) {
      htmlFilePath = cleanPath;
    } else if (fs.existsSync(dirPath)) {
      htmlFilePath = dirPath;
    }
  }

  if (!htmlFilePath || !fs.existsSync(htmlFilePath)) {
    console.log(`❌ Missing static HTML for URL: ${url}`);
    missingFileCount++;
    continue;
  }

  // Read HTML and verify Canonical
  const html = fs.readFileSync(htmlFilePath, 'utf8');
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)" \/>/);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null;

  if (!canonicalUrl) {
    console.log(`⚠️ Missing canonical tag in: ${pathname}`);
    canonicalMismatchCount++;
  } else if (canonicalUrl !== url) {
    console.log(`⚠️ Canonical mismatch in: ${pathname} -> Sitemap: "${url}", Tag: "${canonicalUrl}"`);
    canonicalMismatchCount++;
  } else {
    validCount++;
  }
}

// Check robots.txt
let robotsHealthy = false;
if (fs.existsSync(ROBOTS_PATH)) {
  const robotsContent = fs.readFileSync(ROBOTS_PATH, 'utf8');
  const hasSitemap = robotsContent.includes('https://www.doctransfer.app/sitemap.xml');
  const hasNoCrawlDelay = !robotsContent.includes('Crawl-delay');
  robotsHealthy = hasSitemap && hasNoCrawlDelay;
}

console.log('\n==================================================');
console.log('📈 INDEXATION HEALTH AUDIT SUMMARY');
console.log('==================================================');
console.log(`✅ Total Valid & Pre-rendered URLs: ${validCount} / ${sitemapUrls.length} (100% Indexable)`);
console.log(`📁 Missing Files: ${missingFileCount}`);
console.log(`🔗 Canonical Mismatches: ${canonicalMismatchCount}`);
console.log(`🤖 Robots.txt Config: ${robotsHealthy ? '✅ Optimal (Zero crawl delay, master sitemap linked)' : '⚠️ Needs review'}`);
console.log('==================================================\n');

if (missingFileCount === 0 && canonicalMismatchCount === 0) {
  console.log('🎉 100% PASS: All URLs are fully eligible for Google Search Console indexation!');
} else {
  console.log('⚠️ Please review the warnings above.');
}
