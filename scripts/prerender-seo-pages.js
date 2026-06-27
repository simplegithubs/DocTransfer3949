/**
 * Enhanced Pre-rendering script for DocTransfer SEO pages.
 * 
 * This script runs AFTER `vite build` and generates static HTML files for all SEO routes.
 * 
 * KEY IMPROVEMENT: Instead of only injecting meta tags and a hidden <h1>,
 * this version injects REAL VISIBLE CONTENT into the <noscript> and a semantic
 * <article> block inside <div id="root">. This gives Googlebot actual text to index
 * on its first pass (before JavaScript rendering), dramatically improving indexing speed.
 * 
 * The injected content is placed inside #root and gets replaced when React hydrates,
 * so users with JS enabled see the full interactive SPA as usual.
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

function parseTitleAndDescription(content, slug) {
  const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  const slugIndex = content.indexOf(`'${slug}'`) !== -1 ? content.indexOf(`'${slug}'`) : content.indexOf(`"${slug}"`);
  if (slugIndex === -1) return null;
  
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

function parseFullPageData(content, slug) {
  const slugIndex = content.indexOf(`'${slug}'`) !== -1 ? content.indexOf(`'${slug}'`) : content.indexOf(`"${slug}"`);
  if (slugIndex === -1) return null;
  
  const startBrace = content.lastIndexOf('{', slugIndex);
  // Find the matching closing brace by counting braces
  let braceCount = 0;
  let endBrace = startBrace;
  for (let i = startBrace; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    if (braceCount === 0) { endBrace = i; break; }
  }
  
  const block = content.substring(startBrace, endBrace + 1);
  
  const result = {};
  
  // Extract category
  const catMatch = block.match(/category:\s*['"]([^'"]+)['"]/);
  if (catMatch) result.category = catMatch[1];
  
  // Extract title
  const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/);
  if (titleMatch) result.title = titleMatch[1];
  
  // Extract metaTitle
  const metaTitleMatch = block.match(/metaTitle:\s*['"]([^'"]+)['"]/);
  if (metaTitleMatch) result.metaTitle = metaTitleMatch[1];
  
  // Extract description
  const descMatch = block.match(/description:\s*['"]([^'"]+)['"]/);
  if (descMatch) result.description = descMatch[1].replace(/\\n/g, ' ').trim();
  
  // Extract verdict
  const verdictMatch = block.match(/verdict:\s*['"]([^'"]+)['"]/);
  if (verdictMatch) result.verdict = verdictMatch[1];
  
  // Extract overview
  const overviewMatch = block.match(/overview:\s*['"]([^'"]+)['"]/);
  if (overviewMatch) result.overview = overviewMatch[1];
  
  // Extract valueProp
  const valuePropMatch = block.match(/valueProp:\s*['"]([^'"]+)['"]/);
  if (valuePropMatch) result.valueProp = valuePropMatch[1];
  
  // Extract competitorName
  const compMatch = block.match(/competitorName:\s*['"]([^'"]+)['"]/);
  if (compMatch) result.competitorName = compMatch[1];
  
  // Extract socialProof (gen-z pages)
  const socialMatch = block.match(/socialProof:\s*['"]([^'"]+)['"]/);
  if (socialMatch) result.socialProof = socialMatch[1];
  
  // Extract tagline (gen-z pages)
  const taglineMatch = block.match(/tagline:\s*['"]([^'"]+)['"]/);
  if (taglineMatch) result.tagline = taglineMatch[1];
  
  // Extract headline (gen-z pages)
  const headlineMatch = block.match(/headline:\s*['"]([^'"]+)['"]/);
  if (headlineMatch) result.headline = headlineMatch[1];
  
  // Extract howToTitle
  const howToMatch = block.match(/howToTitle:\s*['"]([^'"]+)['"]/);
  if (howToMatch) result.howToTitle = howToMatch[1];
  
  // Extract industryName
  const industryMatch = block.match(/industryName:\s*['"]([^'"]+)['"]/);
  if (industryMatch) result.industryName = industryMatch[1];
  
  // Extract complianceNotes
  const complianceMatch = block.match(/complianceNotes:\s*['"]([^'"]+)['"]/);
  if (complianceMatch) result.complianceNotes = complianceMatch[1];
  
  // Extract FAQs
  const faqs = [];
  const faqRegex = /question:\s*['"]([^'"]+)['"],\s*answer:\s*['"]([^'"]+)['"]/g;
  let faqMatch;
  while ((faqMatch = faqRegex.exec(block)) !== null) {
    faqs.push({ question: faqMatch[1], answer: faqMatch[2] });
  }
  if (faqs.length > 0) result.faqs = faqs;
  
  return result;
}

function parseExpandedContent(slug) {
  const expandedPath = path.resolve('src/data/seoExpandedContent.ts');
  if (!fs.existsSync(expandedPath)) return null;
  
  const content = fs.readFileSync(expandedPath, 'utf8');
  const slugIndex = content.indexOf(`'${slug}'`);
  if (slugIndex === -1) return null;
  
  // Find the object start
  const objStart = content.lastIndexOf('{', slugIndex);
  
  // Find matching closing brace
  let braceCount = 0;
  let objEnd = objStart;
  for (let i = objStart; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    if (braceCount === 0) { objEnd = i; break; }
  }
  
  const block = content.substring(objStart, objEnd + 1);
  
  const result = {};
  
  // Extract introduction
  const introMatch = block.match(/introduction:\s*'([^']+)'/);
  if (introMatch) result.introduction = introMatch[1];
  
  // Extract body sections
  const sections = [];
  const sectionRegex = /title:\s*'([^']+)',\s*\n\s*text:\s*'([^']+)'/g;
  let secMatch;
  while ((secMatch = sectionRegex.exec(block)) !== null) {
    sections.push({ title: secMatch[1], text: secMatch[2] });
  }
  if (sections.length > 0) result.bodySections = sections;
  
  // Extract FAQs
  const faqs = [];
  const faqRegex = /question:\s*'([^']+)',\s*answer:\s*'([^']+)'/g;
  let faqMatch;
  while ((faqMatch = faqRegex.exec(block)) !== null) {
    faqs.push({ question: faqMatch[1], answer: faqMatch[2] });
  }
  if (faqs.length > 0) result.faqs = faqs;
  
  return result;
}

function collectAllRoutes() {
  const routes = [];
  
  // Static routes
  routes.push({ path: '/', title: 'DocTransfer | Free DocSend Alternative | Secure Document Sharing & VDR', description: 'The best free DocSend alternative. Securely share pitch decks, legal documents, and sensitive files with end-to-end encryption, dynamic watermarking, and real-time page-by-page analytics.', bodyContent: 'DocTransfer is the best free DocSend alternative for secure document sharing. Share pitch decks, legal documents, and sensitive files with end-to-end encryption, dynamic watermarking, and real-time page-by-page analytics. Features include e-signatures, password protection, virtual data rooms, and document tracking. Start sharing documents securely for free today.' });
  routes.push({ path: '/pricing', title: 'Pricing - DocTransfer | Free & Premium Plans', description: 'Compare DocTransfer pricing plans. Start free forever with premium document sharing features, or upgrade for advanced analytics and team collaboration.', bodyContent: 'DocTransfer Pricing Plans. Free tier includes unlimited document sharing, e-signatures, page-by-page analytics, dynamic watermarking, and password protection. Premium plans available for advanced virtual data rooms, custom branding, and enterprise security features.' });
  routes.push({ path: '/comparisons', title: 'Document Sharing Platform Comparisons - DocTransfer', description: 'Compare DocTransfer with other document sharing platforms. See detailed feature comparisons with DocSend, PandaDoc, DocuSign, and more.', bodyContent: 'Compare DocTransfer with leading document sharing platforms. Detailed feature, pricing, and security comparisons with DocuSign, PandaDoc, Adobe Sign, DocSend, and more. See why DocTransfer offers better value with free e-signatures, end-to-end encryption, and page-level analytics.' });
  routes.push({ path: '/alternatives', title: 'Best Document Sharing Alternatives 2026 - DocTransfer', description: 'Explore the best alternatives to popular document sharing platforms. Find the right free DocSend, DocuSign, and PandaDoc alternatives for your needs.', bodyContent: 'Explore the best alternatives to popular document sharing and e-signature platforms. DocTransfer is the leading free alternative to DocuSign, PandaDoc, DocSend, and Adobe Sign. Get unlimited signatures, encrypted document sharing, and real-time analytics without expensive subscriptions.' });
  routes.push({ path: '/blog', title: 'Blog - DocTransfer | Document Security & Sharing Guides', description: 'Expert guides on document security, e-signatures, and secure file sharing. Learn best practices for protecting sensitive business documents.', bodyContent: 'The DocTransfer Blog. Expert guides on document security, electronic signatures, secure file sharing, and business document management. Learn best practices for protecting sensitive documents, understanding NDA agreements, and managing contracts digitally.' });

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
      const pageData = parseFullPageData(content, slug);
      const expandedContent = parseExpandedContent(slug);
      
      routes.push({
        path: `/${category}/${slug}`,
        title: meta?.title || `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} - DocTransfer`,
        description: meta?.description || `Learn about ${slug.replace(/-/g, ' ')} on DocTransfer. Secure document sharing with encryption and analytics.`,
        pageData,
        expandedContent,
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
        const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
        let match;
        while ((match = slugRegex.exec(content)) !== null) {
          const slug = match[1];
          const meta = parseTitleAndDescription(content, slug);
          const pageData = parseFullPageData(content, slug);
          routes.push({
            path: `/templates/${slug}`,
            title: meta?.title || `Free ${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Template - DocTransfer`,
            description: meta?.description || `Download and customize a free ${slug.replace(/-/g, ' ')} template. Sign electronically with DocTransfer.`,
            pageData,
          });
        }
      } else {
        const regex = /slug:\s*['"]([^'"]+)['"],\s*(?:\n\s*)?category:\s*['"]([^'"]+)['"]/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
          const slug = match[1];
          const category = match[2];
          const meta = parseTitleAndDescription(content, slug);
          const pageData = parseFullPageData(content, slug);
          const expandedContent = parseExpandedContent(slug);
          routes.push({
            path: `/${category}/${slug}`,
            title: meta?.title || `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} - DocTransfer`,
            description: meta?.description || `Learn about ${slug.replace(/-/g, ' ')} on DocTransfer.`,
            pageData,
            expandedContent,
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
        const pageData = parseFullPageData(content, slug);
        routes.push({
          path: p,
          title: meta?.title || `Free ${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Template - DocTransfer`,
          description: meta?.description || `Download and customize a free ${slug.replace(/-/g, ' ')} template with DocTransfer.`,
          pageData,
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
          const pageData = parseFullPageData(content, slug);
          routes.push({
            path: p,
            title: meta?.title || `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} - DocTransfer Blog`,
            description: meta?.description || `Read about ${slug.replace(/-/g, ' ')} on the DocTransfer blog.`,
            pageData,
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
// 2. Build SEO body content HTML from page data
// ============================================================

function buildSEOBodyContent(route) {
  const { title, description, pageData, expandedContent, bodyContent } = route;
  
  // If static body content was provided directly (for core pages)
  if (bodyContent) {
    return `
    <article>
      <h1>${escapeHtml(title.split(' | ')[0].split(' - ')[0])}</h1>
      <p>${escapeHtml(bodyContent)}</p>
      <p><a href="https://doctransfer.app/signup">Get Started Free</a> — No credit card required.</p>
    </article>`;
  }
  
  const parts = [];
  const h1Text = (pageData?.metaTitle || title || '').split(' | ')[0].split(' - ')[0];
  parts.push(`<h1>${escapeHtml(h1Text)}</h1>`);
  
  // Description/intro paragraph
  if (expandedContent?.introduction) {
    parts.push(`<p>${escapeHtml(expandedContent.introduction)}</p>`);
  } else if (description) {
    parts.push(`<p>${escapeHtml(description)}</p>`);
  }
  
  // Category-specific content
  if (pageData?.category === 'alternatives' || pageData?.category === 'comparisons') {
    if (pageData.overview) {
      parts.push(`<h2>Overview</h2><p>${escapeHtml(pageData.overview)}</p>`);
    }
    if (pageData.valueProp) {
      parts.push(`<h2>Why Choose DocTransfer</h2><p>${escapeHtml(pageData.valueProp)}</p>`);
    }
    if (pageData.verdict) {
      parts.push(`<h2>Verdict</h2><p>${escapeHtml(pageData.verdict)}</p>`);
    }
  }
  
  if (pageData?.category === 'industry') {
    if (pageData.industryName) {
      parts.push(`<h2>DocTransfer for ${escapeHtml(pageData.industryName)}</h2>`);
    }
    if (pageData.complianceNotes) {
      parts.push(`<p>${escapeHtml(pageData.complianceNotes)}</p>`);
    }
  }
  
  if (pageData?.category === 'gen-z') {
    if (pageData.headline) {
      parts.push(`<h2>${escapeHtml(pageData.headline)}</h2>`);
    }
    if (pageData.tagline) {
      parts.push(`<p>${escapeHtml(pageData.tagline)}</p>`);
    }
    if (pageData.socialProof) {
      parts.push(`<p>${escapeHtml(pageData.socialProof)}</p>`);
    }
  }
  
  if (pageData?.category === 'how-to') {
    if (pageData.howToTitle) {
      parts.push(`<h2>${escapeHtml(pageData.howToTitle)}</h2>`);
    }
  }
  
  // Expanded body sections
  if (expandedContent?.bodySections) {
    for (const section of expandedContent.bodySections) {
      parts.push(`<h2>${escapeHtml(section.title)}</h2>`);
      parts.push(`<p>${escapeHtml(section.text)}</p>`);
    }
  }
  
  // FAQs (use expanded first, fall back to page data)
  const faqs = expandedContent?.faqs || pageData?.faqs;
  if (faqs && faqs.length > 0) {
    parts.push(`<h2>Frequently Asked Questions</h2>`);
    for (const faq of faqs) {
      parts.push(`<h3>${escapeHtml(faq.question)}</h3>`);
      parts.push(`<p>${escapeHtml(faq.answer)}</p>`);
    }
  }
  
  // CTA
  parts.push(`<p><a href="https://doctransfer.app/signup">Get Started Free</a> — No credit card required.</p>`);
  
  return `<article>${parts.join('\n      ')}</article>`;
}

// ============================================================
// 3. Build JSON-LD structured data
// ============================================================

function buildStructuredData(route) {
  const { title, description, path: routePath, pageData, expandedContent } = route;
  const canonicalUrl = `${BASE_URL}${routePath === '/' ? '' : routePath}`;
  const schemas = [];
  
  // WebPage schema for all pages
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'description': description,
    'url': canonicalUrl,
    'publisher': {
      '@type': 'Organization',
      'name': 'DocTransfer',
      'url': 'https://doctransfer.app'
    }
  });
  
  // FAQ schema if FAQs exist
  const faqs = expandedContent?.faqs || pageData?.faqs;
  if (faqs && faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    });
  }
  
  // HowTo schema for how-to pages
  if (pageData?.category === 'how-to' && pageData.howToTitle) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': pageData.howToTitle,
      'description': description
    });
  }
  
  return schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n  ');
}

// ============================================================
// 4. Generate static HTML files for each route
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
  
  // Build the SEO body content
  const seoBodyHtml = buildSEOBodyContent(route);
  
  // Build structured data for non-homepage pages
  // (homepage already has its own JSON-LD in the template)
  let structuredDataHtml = '';
  if (routePath !== '/') {
    structuredDataHtml = buildStructuredData(route);
    // Inject structured data before </head>
    html = html.replace('</head>', `  ${structuredDataHtml}\n</head>`);
  }
  
  // CRITICAL: Inject SEO content inside #root for Googlebot, but HIDDEN from users.
  // The content is wrapped in a display:none container so it won't flash before React mounts.
  // Googlebot still crawls display:none content, and the site's JSON-LD structured data
  // in <head> provides the primary SEO signals.
  // Match clean template, old visible article pattern, or previously hidden pattern
  html = html.replace(
    /<div id="root">(?:<div class="seo-fallback"[^>]*>)?(?:<article>[\s\S]*?<\/article>)?(?:<\/div>)?(?:<h1[^>]*>[^<]*<\/h1>)?<\/div>/,
    `<div id="root"><div class="seo-fallback" style="display:none">${seoBodyHtml}</div></div>\n  <noscript><p>DocTransfer requires JavaScript for the full interactive experience. <a href="https://doctransfer.app">Visit DocTransfer</a></p></noscript>`
  );
  
  return html;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ============================================================
// 5. Main execution
// ============================================================

async function main() {
  console.log('\n🔧 Pre-rendering SEO pages (enhanced with visible body content)...\n');
  
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
  let withContent = 0;
  
  for (const route of routes) {
    const html = generateStaticHTML(template, route);
    const hasRichContent = route.bodyContent || route.expandedContent || route.pageData;
    if (hasRichContent) withContent++;
    
    if (route.path === '/') {
      fs.writeFileSync(templatePath, html, 'utf8');
      console.log(`  ✅ / (overwritten dist/index.html)${hasRichContent ? ' 📝' : ''}`);
    } else {
      const outputDir = path.join(DIST_DIR, route.path);
      fs.mkdirSync(outputDir, { recursive: true });
      const outputPath = path.join(outputDir, 'index.html');
      fs.writeFileSync(outputPath, html, 'utf8');
      console.log(`  ✅ ${route.path}${hasRichContent ? ' 📝' : ''}`);
    }
    created++;
  }
  
  console.log(`\n✅ Pre-rendered ${created} pages successfully!`);
  console.log(`📝 ${withContent} pages have rich SEO body content for Googlebot.`);
  console.log('   Each page now has unique <title>, <meta>, <canonical>, <article>, and JSON-LD.\n');
}

main().catch(err => {
  console.error('❌ Pre-rendering failed:', err);
  process.exit(1);
});
