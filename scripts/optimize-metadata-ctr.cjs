/**
 * Metadata & CTR Optimization Script for DocTransfer (Pillar 1)
 * 
 * Automatically upgrades metaTitle and description across all 596 programmatic pages
 * to high-CTR formulas designed to increase organic search CTR from 0.2% to 3.5%+.
 * 
 * Uses rock-solid block-based line extraction and JSON.stringify serialization.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../src/data/seo-pages');
const SEO_PAGES_FILE = path.resolve(__dirname, '../src/data/seoPages.ts');
const TEMPLATE_SEO_FILE = path.resolve(__dirname, '../src/data/templateSeoData.ts');

function optimizeTitle(item, category) {
  const competitor = item.competitorName || '';
  const title = item.title || '';
  const slug = item.slug || '';

  if (category === 'alternatives' || category === 'verticalAlternatives') {
    const compClean = competitor || slug.replace(/-alternative.*/i, '').replace(/-/g, ' ');
    const compCap = compClean.replace(/\b\w/g, c => c.toUpperCase());
    return `Top Free ${compCap} Alternative (2026) | DocTransfer`;
  }

  if (category === 'comparisons' || category === 'verticalComparisons') {
    const parts = slug.split('-vs-');
    if (parts.length >= 2) {
      const compA = parts[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const compB = parts[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      return `${compA} vs ${compB} (2026): Pricing & Features Compared`;
    }
    return `${title.replace(/\|.*/, '').trim()} (2026) | DocTransfer`;
  }

  if (category === 'templates' || category === 'verticalTemplates') {
    const tmplName = item.templateName || item.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const cleanTmpl = tmplName.replace(/Free/i, '').replace(/Template/i, '').trim();
    return `Free ${cleanTmpl} Template (PDF & Word) - Fill & Sign Online`;
  }

  if (category === 'how-to' || category === 'verticalHowto') {
    const topic = item.howToTitle || title.replace(/How to/i, '').replace(/\|.*/, '').trim();
    const cleanTopic = topic.replace(/\b\w/g, c => c.toUpperCase()).trim();
    return `How to ${cleanTopic} (2026 Guide) | DocTransfer`;
  }

  if (category === 'industry' || category === 'verticalIndustry') {
    const indName = item.industryName || title.replace(/DocTransfer for/i, '').replace(/\|.*/, '').trim();
    const cleanInd = indName
      .replace(/DocTransfer for/i, '')
      .replace(/Document Sharing/i, '')
      .replace(/Document Management/i, '')
      .replace(/Platform/i, '')
      .replace(/Secure/i, '')
      .replace(/\|.*/, '')
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase());
    return `${cleanInd || 'Industry'} Doc Security & Compliance [2026] | DocTransfer`;
  }

  if (category === 'gen-z') {
    const headline = item.headline || title || '';
    const cleanHead = headline.replace(/\|.*/, '').trim();
    return `${cleanHead} (2026) | DocTransfer`;
  }

  return `${title.replace(/\|.*/, '').trim()} (2026) | DocTransfer`;
}

function optimizeDescription(item, category) {
  const competitor = item.competitorName || '';
  const slug = item.slug || '';
  const title = item.title || '';

  if (category === 'alternatives' || category === 'verticalAlternatives') {
    const compClean = competitor || slug.replace(/-alternative.*/i, '').replace(/-/g, ' ');
    const compCap = compClean.replace(/\b\w/g, c => c.toUpperCase());
    return `[Free & Instant] Best ${compCap} alternative. Share confidential files with zero-knowledge E2EE, page-by-page read analytics, & legal e-signatures. No sign up.`;
  }

  if (category === 'comparisons' || category === 'verticalComparisons') {
    const parts = slug.split('-vs-');
    const compA = parts[0] ? parts[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'DocSend';
    const compB = parts[1] ? parts[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'DocTransfer';
    return `Compare ${compA} vs ${compB}. Learn why DocTransfer's 100% free tier, client-side AES-256 encryption, and second-by-second analytics win for growing teams.`;
  }

  if (category === 'templates' || category === 'verticalTemplates') {
    const tmplName = item.templateName || item.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const cleanTmpl = tmplName.replace(/Free/i, '').replace(/Template/i, '').trim();
    return `[100% Free] Customize, sign, and download your ${cleanTmpl} template in PDF & Word. Track recipient viewing duration with real-time analytics. Export now.`;
  }

  if (category === 'how-to' || category === 'verticalHowto') {
    const topic = item.howToTitle || title.replace(/How to/i, '').replace(/\|.*/, '').trim();
    return `[Step-by-Step] Learn how to ${topic.toLowerCase()} with zero-knowledge encryption, dynamic watermarking, and instant audit trails. Free security guide.`;
  }

  if (category === 'industry' || category === 'verticalIndustry') {
    const indName = item.industryName || title.replace(/DocTransfer for/i, '').replace(/\|.*/, '').trim();
    return `Complete document security & regulatory compliance protocol for ${indName}. Prevent unauthorized forwarding and track client viewing down to the second.`;
  }

  if (category === 'gen-z') {
    return `[100% Free] Next-gen document sharing with real-time viewer tracking, self-destruct timers, and client-side encryption. Stop overpaying for legacy tools.`;
  }

  return `[Free & Instant] Secure document sharing, client-side AES-256 encryption, second-by-second page analytics, and legally-binding e-signatures on DocTransfer.`;
}

function processArrayFile(filePath, category) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);
  const outLines = [];

  let currentSlug = null;
  let currentTitle = null;
  let currentComp = null;
  let currentHowTo = null;
  let currentInd = null;
  let currentHead = null;
  let updatedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect slug
    const slugMatch = line.match(/^\s*slug:\s*['"]([^'"]+)['"]/);
    if (slugMatch) {
      currentSlug = slugMatch[1];
      currentTitle = null;
      currentComp = null;
      currentHowTo = null;
      currentInd = null;
      currentHead = null;
    }

    const titleMatch = line.match(/^\s*title:\s*['"]([^'"]+)['"]/);
    if (titleMatch) currentTitle = titleMatch[1];

    const compMatch = line.match(/^\s*competitorName:\s*['"]([^'"]+)['"]/);
    if (compMatch) currentComp = compMatch[1];

    const howToMatch = line.match(/^\s*howToTitle:\s*['"]([^'"]+)['"]/);
    if (howToMatch) currentHowTo = howToMatch[1];

    const indMatch = line.match(/^\s*industryName:\s*['"]([^'"]+)['"]/);
    if (indMatch) currentInd = indMatch[1];

    const headMatch = line.match(/^\s*headline:\s*['"]([^'"]+)['"]/);
    if (headMatch) currentHead = headMatch[1];

    // Replace metaTitle
    if (currentSlug && /^\s*metaTitle:\s*/.test(line)) {
      const item = {
        slug: currentSlug,
        title: currentTitle,
        competitorName: currentComp,
        howToTitle: currentHowTo,
        industryName: currentInd,
        headline: currentHead
      };
      const optTitle = optimizeTitle(item, category);
      const indent = line.match(/^(\s*)/)[1];
      outLines.push(`${indent}metaTitle: ${JSON.stringify(optTitle)},`);
      updatedCount++;
      continue;
    }

    // Replace description
    if (currentSlug && /^\s*description:\s*/.test(line)) {
      const item = {
        slug: currentSlug,
        title: currentTitle,
        competitorName: currentComp,
        howToTitle: currentHowTo,
        industryName: currentInd,
        headline: currentHead
      };
      const optDesc = optimizeDescription(item, category);
      const indent = line.match(/^(\s*)/)[1];
      outLines.push(`${indent}description: ${JSON.stringify(optDesc)},`);
      continue;
    }

    outLines.push(line);
  }

  fs.writeFileSync(filePath, outLines.join('\n'), 'utf8');
  return updatedCount;
}

function processRecordFile(filePath, category) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);
  const outLines = [];

  let currentSlug = null;
  let currentTmplName = null;
  let currentTitle = null;
  let updatedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect record key: 'slug': {
    const keyMatch = line.match(/^\s*['"]([^'"]+)['"]:\s*\{/);
    if (keyMatch) {
      currentSlug = keyMatch[1];
      currentTmplName = null;
      currentTitle = null;
    }

    const tmplMatch = line.match(/^\s*templateName:\s*['"]([^'"]+)['"]/);
    if (tmplMatch) currentTmplName = tmplMatch[1];

    const titleMatch = line.match(/^\s*(?:title|pageTitle):\s*['"]([^'"]+)['"]/);
    if (titleMatch) currentTitle = titleMatch[1];

    // Replace pageTitle or metaTitle
    if (currentSlug && (/^\s*metaTitle:\s*/.test(line) || /^\s*pageTitle:\s*/.test(line))) {
      const isPageTitle = /^\s*pageTitle:\s*/.test(line);
      const item = {
        slug: currentSlug,
        templateName: currentTmplName,
        title: currentTitle
      };
      const optTitle = optimizeTitle(item, category);
      const indent = line.match(/^(\s*)/)[1];
      outLines.push(`${indent}${isPageTitle ? 'pageTitle' : 'metaTitle'}: ${JSON.stringify(optTitle)},`);
      updatedCount++;
      continue;
    }

    // Replace metaDescription or description
    if (currentSlug && (/^\s*metaDescription:\s*/.test(line) || /^\s*description:\s*/.test(line))) {
      const isMeta = /^\s*metaDescription:\s*/.test(line);
      const item = {
        slug: currentSlug,
        templateName: currentTmplName,
        title: currentTitle
      };
      const optDesc = optimizeDescription(item, category);
      const indent = line.match(/^(\s*)/)[1];
      outLines.push(`${indent}${isMeta ? 'metaDescription' : 'description'}: ${JSON.stringify(optDesc)},`);
      continue;
    }

    outLines.push(line);
  }

  fs.writeFileSync(filePath, outLines.join('\n'), 'utf8');
  return updatedCount;
}

console.log('--- STARTING CLEAN LINE-BY-LINE METADATA OPTIMIZATION ---\n');

let total = 0;
const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(DATA_DIR, file);
  let count = 0;

  let cat = 'general';
  if (file.includes('verticalAlternatives') || file.includes('alternatives')) cat = file.includes('vertical') ? 'verticalAlternatives' : 'alternatives';
  else if (file.includes('verticalComparisons') || file.includes('comparisons')) cat = file.includes('vertical') ? 'verticalComparisons' : 'comparisons';
  else if (file.includes('verticalTemplates') || file.includes('templates')) cat = file.includes('vertical') ? 'verticalTemplates' : 'templates';
  else if (file.includes('verticalHowto') || file.includes('howto')) cat = file.includes('vertical') ? 'verticalHowto' : 'how-to';
  else if (file.includes('verticalIndustry') || file.includes('industry')) cat = file.includes('vertical') ? 'verticalIndustry' : 'industry';
  else if (file.includes('genz')) cat = 'gen-z';
  else if (file.includes('csv')) cat = 'alternatives';

  if (file.toLowerCase().includes('templates')) {
    count = processRecordFile(filePath, cat);
  } else {
    count = processArrayFile(filePath, cat);
  }

  console.log(`✓ Optimized ${count} pages in ${file}`);
  total += count;
}

// Base files
if (fs.existsSync(SEO_PAGES_FILE)) {
  const count = processArrayFile(SEO_PAGES_FILE, 'comparisons');
  console.log(`✓ Optimized ${count} pages in seoPages.ts`);
  total += count;
}

if (fs.existsSync(TEMPLATE_SEO_FILE)) {
  const count = processRecordFile(TEMPLATE_SEO_FILE, 'templates');
  console.log(`✓ Optimized ${count} pages in templateSeoData.ts`);
  total += count;
}

console.log(`\n Total SEO pages upgraded: ${total}`);
console.log('--- CLEAN METADATA OPTIMIZATION COMPLETE ---');
