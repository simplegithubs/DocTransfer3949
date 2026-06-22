/**
 * Pre-rendering script for DocTransfer SEO pages.
 * 
 * This script runs AFTER `vite build` and generates static HTML files for all SEO routes.
 * Instead of using a headless browser (slow, heavy), it injects the correct <title>,
 * <meta>, <link rel="canonical">, and JSON-LD structured data directly into the HTML
 * shell that Vite outputs in dist/index.html.
 * 
 * Why? Google sees only the initial HTML response. For an SPA, that's always the same
 * index.html with <div id="root"></div>. By pre-rendering, each SEO page gets its own
 * unique HTML file with correct meta tags, which Google can index immediately.
 * 
 * Usage: node scripts/prerender-seo-pages.js (runs automatically as part of `npm run build`)
 */

import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const BASE_URL = 'https://doctransfer.app';

// ============================================================
// 1. Collect all SEO route slugs from the data files
// ============================================================

function parseSlugCategory(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const results = [];
  const regex = /slug:\s*['"]([^'"]+)['"],\s*(?:\n\s*)?category:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    results.push({ slug: match[1], category: match[2] });
  }
  return results;
}

function parseSlugsOnly(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const results = [];
  const regex = /slug:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    results.push(match[1]);
  }
  return results;
}

function parseMetaFields(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const pages = [];
  
  // Parse individual page objects with their meta fields
  // Match blocks that have slug, category, title, metaTitle, description
  const blockRegex = /\{[^}]*?slug:\s*['"]([^'"]+)['"][^}]*?category:\s*['"]([^'"]+)['"][^}]*?title:\s*['"]([^'"]+)['"][^}]*?metaTitle:\s*['"]([^'"]+)['"][^}]*?description:\s*[`'"]([^`'"]+)[`'"]/gs;
  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    pages.push({
      slug: match[1],
      category: match[2],
      title: match[3],
      metaTitle: match[4],
      description: match[5].replace(/\\n/g, ' ').trim(),
    });
  }
  return pages;
}

function parseTitleAndDescription(content, slug) {
  // Try to find title and description near the slug
  const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Look for the block containing this slug
  const slugIndex = content.indexOf(`'${slug}'`) !== -1 ? content.indexOf(`'${slug}'`) : content.indexOf(`"${slug}"`);
  if (slugIndex === -1) return null;
  
  // Get a chunk of text around the slug (the object it belongs to)
  const startBrace = content.lastIndexOf('{', slugIndex);
  const endBrace = content.indexOf('},', slugIndex);
  if (startBrace === -1 || endBrace === -1) return null;
  
  const block = content.substring(startBrace, endBrace + 1);
  
  const titleMatch = block.match(/metaTitle:\s*[`'"]([^`'"]+)[`'"]/);
  const descMatch = block.match(/description:\s*[`'"]([^`'"]+)[`'"]/);
  const plainTitleMatch = block.match(/title:\s*[`'"]([^`'"]+)[`'"]/);
  
  return {
    title: titleMatch ? titleMatch[1] : (plainTitleMatch ? plainTitleMatch[1] : null),
    description: descMatch ? descMatch[1].replace(/\\n/g, ' ').trim() : null,
  };
}

function collectAllRoutes() {
  const routes = [];
  
  // Static routes
  routes.push({ path: '/', title: 'DocTransfer | Free DocSend Alternative | Secure Document Sharing & VDR', description: 'The best free DocSend alternative. Securely share pitch decks, legal documents, and sensitive files with end-to-end encryption, dynamic watermarking, and real-time page-by-page analytics.' });
  routes.push({ path: '/pricing', title: 'Pricing - DocTransfer | Free & Premium Plans', description: 'Compare DocTransfer pricing plans. Start free forever with premium document sharing features, or upgrade for advanced analytics and team collaboration.' });
  routes.push({ path: '/comparisons', title: 'Document Sharing Platform Comparisons - DocTransfer', description: 'Compare DocTransfer with other document sharing platforms. See detailed feature comparisons with DocSend, PandaDoc, DocuSign, and more.' });
  routes.push({ path: '/alternatives', title: 'Best Document Sharing Alternatives 2026 - DocTransfer', description: 'Explore the best alternatives to popular document sharing platforms. Find the right free DocSend, DocuSign, and PandaDoc alternatives for your needs.' });
  routes.push({ path: '/blog', title: 'Blog - DocTransfer | Document Security & Sharing Guides', description: 'Expert guides on document security, e-signatures, and secure file sharing. Learn best practices for protecting sensitive business documents.' });

  // Dynamic SEO pages from seoPages.ts
  const seoPagesPath = path.resolve('src/data/seoPages.ts');
  if (fs.existsSync(seoPagesPath)) {
    const content = fs.readFileSync(seoPagesPath, 'utf8');
    const regex = /slug:\s*['"]([^'"]+)['"],\s*(?:\n\s*)?category:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const slug = match[1];
      const category = match[2];
      const meta = parseTitleAndDescription(content, slug);
      routes.push({
        path: `/${category}/${slug}`,
        title: meta?.title || `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} - DocTransfer`,
        description: meta?.description || `Learn about ${slug.replace(/-/g, ' ')} on DocTransfer. Secure document sharing with encryption and analytics.`,
      });
    }
  }

  // Dynamic SEO pages from seo-pages/ directory
  const seoPagesDir = path.resolve('src/data/seo-pages');
  if (fs.existsSync(seoPagesDir)) {
    const files = fs.readdirSync(seoPagesDir).filter(f => f.endsWith('.ts'));
    for (const file of files) {
      const filePath = path.join(seoPagesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (file.includes('templates')) {
        // Template pages
        const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
        let match;
        while ((match = slugRegex.exec(content)) !== null) {
          const slug = match[1];
          const meta = parseTitleAndDescription(content, slug);
          routes.push({
            path: `/templates/${slug}`,
            title: meta?.title || `Free ${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Template - DocTransfer`,
            description: meta?.description || `Download and customize a free ${slug.replace(/-/g, ' ')} template. Sign electronically with DocTransfer.`,
          });
        }
      } else {
        // Category pages (alternatives, comparisons, etc.)
        const regex = /slug:\s*['"]([^'"]+)['"],\s*(?:\n\s*)?category:\s*['"]([^'"]+)['"]/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
          const slug = match[1];
          const category = match[2];
          const meta = parseTitleAndDescription(content, slug);
          routes.push({
            path: `/${category}/${slug}`,
            title: meta?.title || `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} - DocTransfer`,
            description: meta?.description || `Learn about ${slug.replace(/-/g, ' ')} on DocTransfer.`,
          });
        }
      }
    }
  }

  // Template SEO data
  const templateSeoPath = path.resolve('src/data/templateSeoData.ts');
  if (fs.existsSync(templateSeoPath)) {
    const content = fs.readFileSync(templateSeoPath, 'utf8');
    const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
    const existingPaths = new Set(routes.map(r => r.path));
    let match;
    while ((match = slugRegex.exec(content)) !== null) {
      const slug = match[1];
      const p = `/templates/${slug}`;
      if (!existingPaths.has(p)) {
        const meta = parseTitleAndDescription(content, slug);
        routes.push({
          path: p,
          title: meta?.title || `Free ${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Template - DocTransfer`,
          description: meta?.description || `Download and customize a free ${slug.replace(/-/g, ' ')} template with DocTransfer.`,
        });
      }
    }
  }

  // Blog posts
  const blogDataPath = path.resolve('src/data/blogData.ts');
  if (fs.existsSync(blogDataPath)) {
    const content = fs.readFileSync(blogDataPath, 'utf8');
    const lines = content.split(/\r?\n/);
    const existingPaths = new Set(routes.map(r => r.path));
    lines.forEach(line => {
      const match = line.match(/^\s{4}slug:\s*['"]([^'"]+)['"]/);
      if (match) {
        const slug = match[1];
        const p = `/blog/${slug}`;
        if (!existingPaths.has(p)) {
          const meta = parseTitleAndDescription(content, slug);
          routes.push({
            path: p,
            title: meta?.title || `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} - DocTransfer Blog`,
            description: meta?.description || `Read about ${slug.replace(/-/g, ' ')} on the DocTransfer blog.`,
          });
        }
      }
    });
  }

  // System templates
  const systemTemplates = [
    'offer-letter', 'nda', 'w4-form', 'i9-form', 'llc-operating',
    'sublease', 'liability-release', 'sow', 'purchase-order',
    'sales-contract', 'contractor-agreement'
  ];
  const existingPaths = new Set(routes.map(r => r.path));
  systemTemplates.forEach(slug => {
    const p = `/templates/${slug}`;
    if (!existingPaths.has(p)) {
      routes.push({
        path: p,
        title: `Free ${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Template - DocTransfer`,
        description: `Download and use a free ${slug.replace(/-/g, ' ')} template. Customize, sign electronically, and share securely with DocTransfer.`,
      });
    }
  });

  // Deduplicate by path
  const uniqueMap = new Map();
  routes.forEach(r => uniqueMap.set(r.path, r));
  return Array.from(uniqueMap.values());
}

// ============================================================
// 2. Generate static HTML files for each route
// ============================================================

function generateStaticHTML(template, route) {
  const { path: routePath, title, description } = route;
  const canonicalUrl = `${BASE_URL}${routePath === '/' ? '' : routePath}`;
  
  let html = template;
  
  // Replace title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(title)}</title>`
  );
  
  // Replace meta title
  html = html.replace(
    /<meta name="title" content="[^"]*" \/>/,
    `<meta name="title" content="${escapeHtml(title)}" />`
  );
  
  // Replace meta description
  html = html.replace(
    /<meta name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );
  
  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );
  
  // Replace OG tags
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  
  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*" \/>/,
    `<meta name="twitter:url" content="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );
  
  // Add an SEO-friendly <h1> inside the root div as a fallback for crawlers
  // This gives Google a heading to parse even before JS executes
  const h1Text = title.split(' - ')[0].split(' | ')[0];
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><h1 style="position:absolute;left:-9999px;top:-9999px">${escapeHtml(h1Text)}</h1></div>`
  );
  
  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ============================================================
// 3. Main execution
// ============================================================

async function main() {
  console.log('\n🔧 Pre-rendering SEO pages...\n');
  
  // Read the built index.html as template
  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('❌ dist/index.html not found. Run `vite build` first.');
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf8');
  
  // Collect all routes
  const routes = collectAllRoutes();
  console.log(`📄 Found ${routes.length} routes to pre-render.\n`);
  
  let created = 0;
  
  for (const route of routes) {
    const html = generateStaticHTML(template, route);
    
    // Determine output path
    // /pricing -> dist/pricing/index.html
    // /alternatives/docusign-alternatives -> dist/alternatives/docusign-alternatives/index.html
    // / -> dist/index.html (already exists, overwrite with correct meta)
    
    if (route.path === '/') {
      // Overwrite the root index.html with correct homepage meta
      fs.writeFileSync(templatePath, html, 'utf8');
      console.log(`  ✅ / (overwritten dist/index.html)`);
    } else {
      const outputDir = path.join(DIST_DIR, route.path);
      fs.mkdirSync(outputDir, { recursive: true });
      const outputPath = path.join(outputDir, 'index.html');
      fs.writeFileSync(outputPath, html, 'utf8');
      console.log(`  ✅ ${route.path}`);
    }
    created++;
  }
  
  console.log(`\n✅ Pre-rendered ${created} pages successfully!`);
  console.log('   Each page now has unique <title>, <meta>, <canonical>, and <h1> for Google.\n');
}

main().catch(err => {
  console.error('❌ Pre-rendering failed:', err);
  process.exit(1);
});
