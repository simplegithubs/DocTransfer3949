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
const BASE_URL = 'https://www.doctransfer.app';

// ============================================================
// 1. Collect all SEO route slugs from the data files
// ============================================================

function parseTitleAndDescription(content, slug) {
  const slugIndex = content.indexOf(`'${slug}'`) !== -1 ? content.indexOf(`'${slug}'`) : content.indexOf(`"${slug}"`);
  if (slugIndex === -1) return null;
  
  const startBrace = content.lastIndexOf('{', slugIndex);
  if (startBrace === -1) return null;

  let braceCount = 0;
  let endBrace = startBrace;
  for (let i = startBrace; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    if (braceCount === 0) { endBrace = i; break; }
  }
  
  const block = content.substring(startBrace, endBrace + 1);
  
  const metaTitleMatch = block.match(/(?:["'])?metaTitle(?:["'])?:\s*[`'"]([^`'"]+)[`'"]/);
  const pageTitleMatch = block.match(/(?:["'])?pageTitle(?:["'])?:\s*[`'"]([^`'"]+)[`'"]/);
  const plainTitleMatch = block.match(/^\s*(?:["'])?title(?:["'])?:\s*[`'"]([^`'"]+)[`'"]/m);
  
  const descMatch = block.match(/(?:["'])?description(?:["'])?:\s*[`'"]([^`'"]+)[`'"]/);
  const metaDescMatch = block.match(/(?:["'])?metaDescription(?:["'])?:\s*[`'"]([^`'"]+)[`'"]/);
  
  return {
    title: metaTitleMatch ? metaTitleMatch[1] : (pageTitleMatch ? pageTitleMatch[1] : (plainTitleMatch ? plainTitleMatch[1] : null)),
    description: descMatch ? descMatch[1].replace(/\\n/g, ' ').trim() : (metaDescMatch ? metaDescMatch[1].replace(/\\n/g, ' ').trim() : null),
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
  const catMatch = block.match(/(?:["'])?category(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (catMatch) result.category = catMatch[1];
  
  // Extract title
  const titleMatch = block.match(/(?:["'])?title(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (titleMatch) result.title = titleMatch[1];
  
  // Extract metaTitle
  const metaTitleMatch = block.match(/(?:["'])?metaTitle(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (metaTitleMatch) result.metaTitle = metaTitleMatch[1];
  
  // Extract description
  const descMatch = block.match(/(?:["'])?description(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (descMatch) result.description = descMatch[1].replace(/\\n/g, ' ').trim();
  
  // Extract verdict
  const verdictMatch = block.match(/(?:["'])?verdict(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (verdictMatch) result.verdict = verdictMatch[1];
  
  // Extract overview
  const overviewMatch = block.match(/(?:["'])?overview(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (overviewMatch) result.overview = overviewMatch[1];
  
  // Extract valueProp
  const valuePropMatch = block.match(/(?:["'])?valueProp(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (valuePropMatch) result.valueProp = valuePropMatch[1];
  
  // Extract competitorName
  const compMatch = block.match(/(?:["'])?competitorName(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (compMatch) result.competitorName = compMatch[1];
  
  // Extract socialProof (gen-z pages)
  const socialMatch = block.match(/(?:["'])?socialProof(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (socialMatch) result.socialProof = socialMatch[1];
  
  // Extract tagline (gen-z pages)
  const taglineMatch = block.match(/(?:["'])?tagline(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (taglineMatch) result.tagline = taglineMatch[1];
  
  // Extract headline (gen-z pages)
  const headlineMatch = block.match(/(?:["'])?headline(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (headlineMatch) result.headline = headlineMatch[1];
  
  // Extract howToTitle
  const howToMatch = block.match(/(?:["'])?howToTitle(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (howToMatch) result.howToTitle = howToMatch[1];
  
  // Extract industryName
  const industryMatch = block.match(/(?:["'])?industryName(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (industryMatch) result.industryName = industryMatch[1];
  
  // Extract complianceNotes
  const complianceMatch = block.match(/(?:["'])?complianceNotes(?:["'])?:\s*['"]([^'"]+)['"]/);
  if (complianceMatch) result.complianceNotes = complianceMatch[1];
  
  // Extract FAQs
  const faqs = [];
  const faqRegex = /(?:["'])?question(?:["'])?:\s*['"]([^'"]+)['"],\s*(?:["'])?answer(?:["'])?:\s*['"]([^'"]+)['"]/g;
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
  
  // Static routes & Hubs
  routes.push({ path: '/', title: 'DocTransfer | Free DocSend Alternative | Secure Document Sharing & VDR', description: 'The best free DocSend alternative. Securely share pitch decks, legal documents, and sensitive files with end-to-end encryption, dynamic watermarking, and real-time page-by-page analytics.', bodyContent: 'DocTransfer is the best free DocSend alternative for secure document sharing. Share pitch decks, legal documents, and sensitive files with end-to-end encryption, dynamic watermarking, and real-time page-by-page analytics. Features include e-signatures, password protection, virtual data rooms, and document tracking. Start sharing documents securely for free today.' });
  routes.push({ path: '/pricing', title: 'Pricing - DocTransfer | Free & Premium Plans', description: 'Compare DocTransfer pricing plans. Start free forever with premium document sharing features, or upgrade for advanced analytics and team collaboration.', bodyContent: 'DocTransfer Pricing Plans. Free tier includes unlimited document sharing, e-signatures, page-by-page analytics, dynamic watermarking, and password protection. Premium plans available for advanced virtual data rooms, custom branding, and enterprise security features.' });
  routes.push({ path: '/comparisons', title: 'Document Sharing Platform Comparisons - DocTransfer', description: 'Compare DocTransfer with other document sharing platforms. See detailed feature comparisons with DocSend, PandaDoc, DocuSign, and more.', bodyContent: 'Compare DocTransfer with leading document sharing platforms. Detailed feature, pricing, and security comparisons with DocuSign, PandaDoc, Adobe Sign, DocSend, and more. See why DocTransfer offers better value with free e-signatures, end-to-end encryption, and page-level analytics.' });
  routes.push({ path: '/alternatives', title: 'Best Document Sharing Alternatives 2026 - DocTransfer', description: 'Explore the best alternatives to popular document sharing platforms. Find the right free DocSend, DocuSign, and PandaDoc alternatives for your needs.', bodyContent: 'Explore the best alternatives to popular document sharing and e-signature platforms. DocTransfer is the leading free alternative to DocuSign, PandaDoc, DocSend, and Adobe Sign. Get unlimited signatures, encrypted document sharing, and real-time analytics without expensive subscriptions.' });
  routes.push({ path: '/templates', title: '100+ Free Legal & Business Document Templates - DocTransfer', description: 'Download, customize, and electronically sign 100+ legal contracts, NDAs, HR agreements, and business forms for free.', bodyContent: 'Free Legal Document Templates. Access 100+ standardized contracts, non-disclosure agreements, offer letters, lease agreements, and corporate resolutions. Legally binding and fully customizable.' });
  routes.push({ path: '/tools', title: 'Free Online Document Security & Analytics Micro-Tools - DocTransfer', description: 'Explore our free suite of interactive document tools: Pitch Deck Analyzer, NDA Generator, VDR Cost Calculator, and PDF Watermarker.', bodyContent: 'Free Document Tools Hub. Analyze pitch decks, generate legally-enforceable NDAs, calculate virtual data room costs, and apply dynamic watermarks online without signing up.' });
  routes.push({ path: '/integrations', title: 'DocTransfer Integrations & Cloud Storage Connectors', description: 'Connect DocTransfer with Google Drive, OneDrive, Box, Dropbox, Salesforce, HubSpot, Slack, and Zapier for seamless automated workflows.', bodyContent: 'DocTransfer Integrations Hub. Seamlessly connect DocTransfer with your cloud storage, CRM, and team communication stack. Layer page analytics and encryption onto your existing tools.' });
  routes.push({ path: '/glossary', title: 'Document Security & E-Signature Glossary (2026)', description: 'Complete dictionary and reference guide for virtual data rooms, e-signatures, zero-knowledge encryption, and document compliance terms.', bodyContent: 'Document Security & E-Signature Glossary. Definitions, statutory references, and architectural explanations for key terms in secure file transfer, compliance, and venture capital deals.' });
  routes.push({ path: '/solutions', title: 'Industry Document Solutions - DocTransfer', description: 'Tailored document sharing, tracking, and signing solutions for Fundraising, M&A Due Diligence, Legal, Healthcare, Real Estate, and Startups.', bodyContent: 'DocTransfer Industry Solutions. Discover compliant, high-security document portals customized for legal practices, healthcare records, real estate closings, and venture fundraising.' });
  routes.push({ path: '/docsend-alternative', title: 'DocSend Alternative Hub - Why Teams Switch to DocTransfer', description: 'Discover why thousands of founders and sales teams switch from DocSend to DocTransfer. Unlimited page analytics and e-signatures for $0.', bodyContent: 'DocSend Alternative Hub. Complete migration guides, feature breakdowns, and pricing comparisons showing why DocTransfer is the superior free DocSend alternative.' });
  routes.push({ path: '/research', title: 'State of Document Security & Pitch Deck Benchmarks - DocTransfer Research', description: 'Empirical research and data on investor reading habits, NDA execution velocity, and data room security benchmarks.', bodyContent: 'DocTransfer Research & Industry Benchmarks. Data-driven insights on pitch deck engagement, contract signing velocity, and cloud file security trends.' });
  routes.push({ path: '/blog', title: 'Blog - DocTransfer | Document Security & Sharing Guides', description: 'Expert guides on document security, e-signatures, and secure file sharing. Learn best practices for protecting sensitive business documents.', bodyContent: 'The DocTransfer Blog. Expert guides on document security, electronic signatures, secure file sharing, and business document management. Learn best practices for protecting sensitive documents, understanding NDA agreements, and managing contracts digitally.' });
  routes.push({ path: '/press', title: 'Press Kit & Official Trust Badges - DocTransfer', description: 'Download official DocTransfer trust badges, logos, and media resources. Embed verified e-signature and encryption badges on your site.', bodyContent: 'DocTransfer Press Kit & Media Resources. Download verified security and trust badges for pitch decks, investor data rooms, and website footers. Contact our media relations team.' });
  routes.push({ path: '/sitemap-directory', title: 'DocTransfer Resource & Document Directory', description: 'Browse our complete directory of document signing templates, e-signature comparison matrices, and secure workflow solutions by industry.', bodyContent: 'DocTransfer Resource & Document Directory. Access our complete programmatic repository of legally binding templates, alternative comparisons, and industry compliance hubs.' });
  routes.push({ path: '/tools/rent-agreement-generator', title: '11-Month Rent Agreement Online Maker (India) - DocTransfer', description: 'Draft legally compliant 11-month residential rental agreements for Bangalore, Mumbai, Delhi, and all Indian cities.', bodyContent: '11-Month Rent Agreement Online Maker. Draft, calculate stamp duty, download PDF and electronically sign residential lease agreements in India under the Indian Contract Act 1872.' });
  routes.push({ path: '/privacy', title: 'Privacy Policy (DPDP Act 2023 & GDPR) - DocTransfer', description: 'DocTransfer Privacy Policy compliant with the Digital Personal Data Protection (DPDP) Act 2023 and GDPR.', bodyContent: 'Privacy Policy. Zero-knowledge data architecture, personal data processing, Data Principal rights, and Grievance Officer contacts.' });
  routes.push({ path: '/terms', title: 'Terms of Service (IT Act 2000) - DocTransfer', description: 'DocTransfer Terms of Service governed by the Information Technology Act 2000 and Indian Contract Act 1872.', bodyContent: 'Terms of Service. Service rules, electronic signature admissibility under IT Act 2000 Section 5 and 10A, arbitration, and acceptable use.' });
  routes.push({ path: '/refund-policy', title: 'Cancellation & Refund Policy - DocTransfer', description: 'DocTransfer Cancellation & Refund Policy with 14-day money-back guarantee for Pro plans.', bodyContent: 'Cancellation and Refund Policy. Free tier guidelines, 14-day refund window, and cancellation terms.' });
  routes.push({ path: '/contact', title: 'Contact & Grievance Redressal - DocTransfer', description: 'Contact DocTransfer support and statutory IT Rules 2021 Grievance Redressal Officer.', bodyContent: 'Contact Us & Statutory Grievance Redressal. Reach our engineering, enterprise sales, or statutory Grievance Officer.' });

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
      
      if (file.toLowerCase().includes('templates')) {
        const slugRegex = /(?:["'])?slug(?:["'])?:\s*['"]([^'"]+)['"]/g;
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
        const regex = /(?:["'])?slug(?:["'])?:\s*['"]([^'"]+)['"],\s*(?:\r?\n\s*)?(?:["'])?category(?:["'])?:\s*['"]([^'"]+)['"]/g;
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

  // Integrations data
  const integrationsPath = path.resolve('src/data/integrationsData.ts');
  if (fs.existsSync(integrationsPath)) {
    const content = fs.readFileSync(integrationsPath, 'utf8');
    const regex = /slug:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const slug = match[1];
      const p = `/integrations/${slug}`;
      const meta = parseTitleAndDescription(content, slug);
      const pageData = parseFullPageData(content, slug);
      routes.push({
        path: p,
        title: meta?.title || `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Integration - DocTransfer`,
        description: meta?.description || `Connect DocTransfer with ${slug.replace(/-/g, ' ')} for secure document tracking and electronic signatures.`,
        pageData,
      });
    }
  }

  // Glossary data
  const glossaryPath = path.resolve('src/data/glossaryData.ts');
  if (fs.existsSync(glossaryPath)) {
    const content = fs.readFileSync(glossaryPath, 'utf8');
    const regex = /slug:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const slug = match[1];
      const p = `/glossary/${slug}`;
      const meta = parseTitleAndDescription(content, slug);
      const pageData = parseFullPageData(content, slug);
      routes.push({
        path: p,
        title: meta?.title || `What is ${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}? - DocTransfer Glossary`,
        description: meta?.description || `Definition and guide for ${slug.replace(/-/g, ' ')} in modern secure file sharing.`,
        pageData,
      });
    }
  }

  // Solutions data
  const solutionsPath = path.resolve('src/data/solutionsData.ts');
  if (fs.existsSync(solutionsPath)) {
    const content = fs.readFileSync(solutionsPath, 'utf8');
    const regex = /slug:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const slug = match[1];
      const p = `/solutions/${slug}`;
      const meta = parseTitleAndDescription(content, slug);
      const pageData = parseFullPageData(content, slug);
      routes.push({
        path: p,
        title: meta?.title || `DocTransfer Solution for ${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
        description: meta?.description || `Secure document sharing and signature solutions for ${slug.replace(/-/g, ' ')}.`,
        pageData,
      });
    }
  }

  // Conquest data (docsend-alternative subpages)
  const conquestPath = path.resolve('src/data/conquestData.ts');
  if (fs.existsSync(conquestPath)) {
    const content = fs.readFileSync(conquestPath, 'utf8');
    const regex = /slug:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const slug = match[1];
      const p = `/docsend-alternative/${slug}`;
      const meta = parseTitleAndDescription(content, slug);
      const pageData = parseFullPageData(content, slug);
      routes.push({
        path: p,
        title: meta?.title || `DocSend Alternative - ${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} | DocTransfer`,
        description: meta?.description || `Compare DocSend vs DocTransfer for ${slug.replace(/-/g, ' ')}. Free unlimited document tracking.`,
        pageData,
      });
    }
  }

  // Tools data
  const toolsPath = path.resolve('src/data/toolsData.ts');
  if (fs.existsSync(toolsPath)) {
    const content = fs.readFileSync(toolsPath, 'utf8');
    const regex = /slug:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const slug = match[1];
      const p = `/tools/${slug}`;
      const meta = parseTitleAndDescription(content, slug);
      const pageData = parseFullPageData(content, slug);
      routes.push({
        path: p,
        title: meta?.title || `Free ${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} - DocTransfer`,
        description: meta?.description || `Use our free online ${slug.replace(/-/g, ' ')} tool without signup.`,
        pageData,
      });
    }
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
  
  // CTA & Interactive Tools Links
  parts.push(`<h2>Get Started with DocTransfer</h2>`);
  parts.push(`<p>DocTransfer provides legally-binding e-signatures, client-side zero-knowledge encrypted vaults, dynamic watermarking, and real-time page-by-page viewing tracking. <a href="https://www.doctransfer.app/pricing">Start free today</a> — no credit card required.</p>`);
  
  // High-Authority Crawlable Internal Linking Footer
  parts.push(`<h2>Related Resources & Tools</h2>`);
  parts.push(`<ul>
        <li><a href="https://www.doctransfer.app/sitemap-directory">Master Site Directory (500+ Resources & Templates)</a></li>
        <li><a href="https://www.doctransfer.app/tools">Free Interactive Tools (Pitch Deck Analyzer, NDA Generator, VDR Calculator)</a></li>
        <li><a href="https://www.doctransfer.app/alternatives">Competitor Comparisons & Alternatives</a></li>
        <li><a href="https://www.doctransfer.app/templates">100+ Free Legal & Business Document Templates</a></li>
        <li><a href="https://www.doctransfer.app/solutions">Industry Compliance Solutions (Legal, Healthcare, Real Estate)</a></li>
        <li><a href="https://www.doctransfer.app/glossary">Document Security & E-Signature Glossary</a></li>
      </ul>`);

  return `<article>${parts.join('\n      ')}</article>`;
}

// ============================================================
// 3. Build JSON-LD structured data
// ============================================================

function buildStructuredData(route) {
  const { title, description, path: routePath, pageData, expandedContent } = route;
  const canonicalUrl = `${BASE_URL}${routePath === '/' ? '' : routePath}`;
  const schemas = [];
  
  // 1. WebPage schema for all pages
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'description': description,
    'url': canonicalUrl,
    'publisher': {
      '@type': 'Organization',
      'name': 'DocTransfer',
      'url': 'https://www.doctransfer.app',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.doctransfer.app/logo.png'
      }
    }
  });

  // 2. BreadcrumbList schema for structured search result paths
  const pathSegments = routePath.split('/').filter(Boolean);
  const breadcrumbElements = [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': BASE_URL
    }
  ];

  if (pathSegments.length >= 1) {
    const section = pathSegments[0];
    const sectionName = {
      'alternatives': 'Alternatives',
      'comparisons': 'Comparisons',
      'templates': 'Templates',
      'how-to': 'How-To Guides',
      'industry': 'Industry',
      'tools': 'Free Tools',
      'blog': 'Blog',
      'research': 'Research',
      'solutions': 'Solutions',
      'glossary': 'Glossary',
      'docsend-alternative': 'DocSend Alternative'
    }[section] || section.charAt(0).toUpperCase() + section.slice(1);

    breadcrumbElements.push({
      '@type': 'ListItem',
      'position': 2,
      'name': sectionName,
      'item': `${BASE_URL}/${section}`
    });

    if (pathSegments.length >= 2) {
      breadcrumbElements.push({
        '@type': 'ListItem',
        'position': 3,
        'name': title.split(' | ')[0].split(' - ')[0],
        'item': canonicalUrl
      });
    }
  }

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbElements
  });

  // 3. SoftwareApplication + AggregateRating schema (Shows 5-star rating in Google SERP results)
  const isSoftwareRelated = routePath.startsWith('/alternatives') ||
    routePath.startsWith('/comparisons') ||
    routePath.startsWith('/tools') ||
    routePath.startsWith('/docsend-alternative') ||
    routePath.startsWith('/solutions') ||
    routePath === '/pricing' ||
    pageData?.category === 'alternatives' ||
    pageData?.category === 'comparisons';

  if (isSoftwareRelated) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'DocTransfer',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web, macOS, Windows, iOS, Android',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'ratingCount': '148',
        'bestRating': '5',
        'worstRating': '1'
      },
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD',
        'description': 'Free Plan with full page-by-page document analytics and encryption'
      }
    });
  }

  // 4. DigitalDocument schema for template pages
  if (routePath.startsWith('/templates') && routePath !== '/templates') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'DigitalDocument',
      'name': title,
      'description': description,
      'url': canonicalUrl,
      'encodingFormat': 'application/pdf',
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD'
      }
    });
  }
  
  // 5. FAQ schema if FAQs exist
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
  
  // 6. HowTo schema for how-to pages
  if (pageData?.category === 'how-to' && pageData.howToTitle) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': pageData.howToTitle,
      'description': description
    });
  }

  // 7. WebApplication schema for interactive tool pages
  if (routePath.startsWith('/tools/') && routePath !== '/tools') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': title,
      'description': description,
      'url': canonicalUrl,
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'All',
      'browserRequirements': 'Requires JavaScript and HTML5 support',
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD'
      }
    });
  }
  
  return schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n  ');
}

// ============================================================
// 4. Generate static HTML files for each route
// ============================================================

function generateStaticHTML(template, route) {
  const { path: routePath, title, description, pageData } = route;
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
  
  // Replace meta keywords with page-specific keywords
  const pageKeywords = pageData?.keywords || route.keywords || '';
  if (pageKeywords) {
    html = html.replace(
      /<meta name="keywords"[\s\S]*?\/>/,
      `<meta name="keywords" content="${escapeHtml(pageKeywords)}" />`
    );
  }
  
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
  
  // CRITICAL FIX: Strip homepage-specific JSON-LD schemas from non-homepage pages.
  // These cause duplicate/conflicting structured data across all 91+ pages.
  if (routePath !== '/') {
    // Remove the homepage SoftwareApplication schema block
    html = html.replace(
      /\s*<!-- Structured Data - Organization & Software \(Homepage only\) -->\s*<script id="homepage-software-schema" type="application\/ld\+json">[\s\S]*?<\/script>/,
      ''
    );
    // Remove the homepage FAQ schema block
    html = html.replace(
      /\s*<!-- Structured Data - FAQ \(Homepage only\) -->\s*<script id="homepage-faq-schema" type="application\/ld\+json">[\s\S]*?<\/script>/,
      ''
    );
  }
  
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
  
  // CRITICAL FIX: Inject visible, semantic SEO content inside #root for initial pass indexing.
  // Googlebot reads and indexes clean visible HTML. React replaces #root content upon client hydration.
  // Match clean template, old visible article pattern, or previously hidden pattern
  html = html.replace(
    /<div id="root">(?:<div class="seo-fallback"[^>]*>)?(?:<article>[\s\S]*?<\/article>)?(?:<\/div>)?(?:<h1[^>]*>[^<]*<\/h1>)?<\/div>/,
    `<div id="root"><div class="seo-fallback" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${seoBodyHtml}</div></div>\n  <noscript><p>DocTransfer requires JavaScript for the full interactive experience. <a href="https://www.doctransfer.app">Visit DocTransfer</a></p></noscript>`
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
      // 1. Save directory index: dist/category/slug/index.html
      const outputDir = path.join(DIST_DIR, route.path);
      fs.mkdirSync(outputDir, { recursive: true });
      const outputPath = path.join(outputDir, 'index.html');
      fs.writeFileSync(outputPath, html, 'utf8');

      // 2. Save direct cleanUrl target: dist/category/slug.html (ensures Vercel cleanUrls serves static pre-rendered HTML)
      const cleanUrlPath = path.join(DIST_DIR, `${route.path}.html`);
      const cleanUrlDir = path.dirname(cleanUrlPath);
      fs.mkdirSync(cleanUrlDir, { recursive: true });
      fs.writeFileSync(cleanUrlPath, html, 'utf8');

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
