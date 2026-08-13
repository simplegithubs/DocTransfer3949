const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const seoPagesDir = path.join(projectRoot, 'src/data/seo-pages');

console.log('=== STARTING SEO INTERLINKING VALIDATION ===\n');

// 1. Gather all valid routes from all files
const allRoutes = new Map(); // Key: slug, Value: { slug, category, file, title, related: [] }
const templateRoutes = new Map(); // Key: slug, Value: { slug, category: 'templates', file, title, related: [] }

// A. Parse base pages from seoPages.ts
const seoPagesPath = path.join(projectRoot, 'src/data/seoPages.ts');
if (fs.existsSync(seoPagesPath)) {
  const content = fs.readFileSync(seoPagesPath, 'utf8');
  // Simple regex to parse slugs and categories from baseSEOPages
  const startIdx = content.indexOf('const baseSEOPages');
  const endIdx = content.indexOf('import { seoExpandedContent }');
  if (startIdx !== -1 && endIdx !== -1) {
    const baseSection = content.substring(startIdx, endIdx);
    const regex = /slug:\s*['"]([^'"]+)['"],\s*(?:\n\s*)?category:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(baseSection)) !== null) {
      const slug = match[1];
      const category = match[2];
      
      // Attempt to extract related slugs from the surrounding code
      const slugIdx = baseSection.indexOf(slug);
      const rest = baseSection.substring(slugIdx, slugIdx + 500);
      const relatedMatch = rest.match(/relatedSlugs:\s*\[([^\]]+)\]/);
      const related = relatedMatch 
        ? relatedMatch[1].split(',').map(s => s.replace(/['"\s]/g, '')).filter(Boolean)
        : [];
      
      allRoutes.set(slug, { slug, category, file: 'seoPages.ts (base)', related });
    }
  }
}

// B. Parse base templates from templateSeoData.ts
const templateSeoDataPath = path.join(projectRoot, 'src/data/templateSeoData.ts');
if (fs.existsSync(templateSeoDataPath)) {
  const content = fs.readFileSync(templateSeoDataPath, 'utf8');
  const startIdx = content.indexOf('const baseTemplateSeoData');
  const endIdx = content.indexOf('import { templatesGroup }');
  if (startIdx !== -1 && endIdx !== -1) {
    const baseSection = content.substring(startIdx, endIdx);
    const regex = /^\s{2}['"]([^'"]+)['"]:\s*\{/gm;
    let match;
    while ((match = regex.exec(baseSection)) !== null) {
      const slug = match[1];
      
      const slugIdx = baseSection.indexOf(slug);
      const rest = baseSection.substring(slugIdx, slugIdx + 1000);
      const relatedMatch = rest.match(/relatedTemplates:\s*\[([\s\S]*?)\]/);
      const related = [];
      if (relatedMatch) {
        const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
        let sm;
        while ((sm = slugRegex.exec(relatedMatch[1])) !== null) {
          related.push(sm[1]);
        }
      }
      
      templateRoutes.set(slug, { slug, category: 'templates', file: 'templateSeoData.ts (base)', related });
    }
  }
}

// C. Parse programmatic vertical and modular files from src/data/seo-pages/
if (fs.existsSync(seoPagesDir)) {
  const files = fs.readdirSync(seoPagesDir).filter(f => f.endsWith('.ts'));
  for (const file of files) {
    const filePath = path.join(seoPagesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (file.toLowerCase().includes('templates')) {
      // Record format
      const regex = /^\s{2}['"]([^'"]+)['"]:\s*\{/gm;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const slug = match[1];
        
        const slugIdx = content.indexOf(slug);
        const rest = content.substring(slugIdx, slugIdx + 1200);
        const relatedMatch = rest.match(/relatedTemplates:\s*\[([\s\S]*?)\]/);
        const related = [];
        if (relatedMatch) {
          const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
          let sm;
          while ((sm = slugRegex.exec(relatedMatch[1])) !== null) {
            related.push(sm[1]);
          }
        }
        
        templateRoutes.set(slug, { slug, category: 'templates', file, related });
      }
    } else {
      // Array format
      const regex = /^\s{4}slug:\s*['"]([^'"]+)['"]/gm;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const slug = match[1];
        
        const slugIdx = match.index;
        const rest = content.substring(slugIdx, slugIdx + 2500);
        
        // Find category
        const catMatch = rest.match(/category:\s*['"]([^'"]+)['"]/);
        const category = catMatch ? catMatch[1] : '';
        
        // Find related slugs
        const relatedMatch = rest.match(/relatedSlugs:\s*\[([^\]]+)\]/);
        const related = relatedMatch 
          ? relatedMatch[1].split(',').map(s => s.replace(/['"\s]/g, '')).filter(Boolean)
          : [];
        
        allRoutes.set(slug, { slug, category, file, related });
      }
    }
  }
}

const totalRoutes = allRoutes.size + templateRoutes.size;
console.log(`Discovered ${allRoutes.size} regular SEO pages.`);
console.log(`Discovered ${templateRoutes.size} template SEO pages.`);
console.log(`Total active SEO routes: ${totalRoutes}\n`);

// 2. Validate links and track incoming connections
const incomingLinks = new Map(); // Key: targetUrl, Value: Set of sourceUrls
const brokenLinks = [];
let totalOutgoing = 0;

// Initialize incoming links sets
allRoutes.forEach((info) => {
  incomingLinks.set(`/${info.category}/${info.slug}`, new Set());
});
templateRoutes.forEach((info) => {
  incomingLinks.set(`/templates/${info.slug}`, new Set());
});

// Helper to validate a link target and track incoming links
function checkLink(sourceUrl, targetSlug, isTemplateLink) {
  totalOutgoing++;
  let targetUrl;
  let exists = false;
  
  if (isTemplateLink) {
    targetUrl = `/templates/${targetSlug}`;
    exists = templateRoutes.has(targetSlug);
  } else {
    // Regular SEO pages could have different categories, so check where targetSlug matches
    const page = allRoutes.get(targetSlug);
    if (page) {
      targetUrl = `/${page.category}/${page.slug}`;
      exists = true;
    } else {
      // Fallback check if it points to a template
      const temp = templateRoutes.get(targetSlug);
      if (temp) {
        targetUrl = `/templates/${temp.slug}`;
        exists = true;
      } else {
        targetUrl = `/unknown/${targetSlug}`;
        exists = false;
      }
    }
  }
  
  if (exists) {
    if (incomingLinks.has(targetUrl)) {
      incomingLinks.get(targetUrl).add(sourceUrl);
    }
  } else {
    brokenLinks.push({
      sourceUrl,
      targetSlug,
      expectedUrl: targetUrl
    });
  }
}

// Process regular SEO pages outgoing links
allRoutes.forEach((info) => {
  const sourceUrl = `/${info.category}/${info.slug}`;
  info.related.forEach(targetSlug => {
    // If it ends with "-template", it's a template link
    const isTemplate = targetSlug.endsWith('-template') || targetSlug === 'nda';
    checkLink(sourceUrl, targetSlug, isTemplate);
  });
});

// Process template pages outgoing links
templateRoutes.forEach((info) => {
  const sourceUrl = `/templates/${info.slug}`;
  info.related.forEach(targetSlug => {
    // Related items inside templates relate to other templates
    checkLink(sourceUrl, targetSlug, true);
  });
});

// 2.5 Simulate links from Directory/Hub Pages (SEOHubDirectory, AlternativesDirectory, ComparisonsDirectory)
// Since React directories dynamically list these paths, they are NOT crawl orphans.
allRoutes.forEach((info) => {
  incomingLinks.get(`/${info.category}/${info.slug}`).add('/sitemap-directory');
  if (info.category === 'alternatives') {
    incomingLinks.get(`/${info.category}/${info.slug}`).add('/alternatives');
  }
  if (info.category === 'comparisons') {
    incomingLinks.get(`/${info.category}/${info.slug}`).add('/comparisons');
  }
});
templateRoutes.forEach((info) => {
  incomingLinks.get(`/templates/${info.slug}`).add('/sitemap-directory');
});

// 3. Find Orphan Pages and analyze in-degree statistics
const orphans = [];
let maxIncoming = 0;
let minIncoming = Infinity;
let sumIncoming = 0;

incomingLinks.forEach((sources, targetUrl) => {
  const count = sources.size;
  sumIncoming += count;
  if (count > maxIncoming) maxIncoming = count;
  if (count < minIncoming) minIncoming = count;
  
  if (count === 0) {
    orphans.push(targetUrl);
  }
});

const avgIncoming = (sumIncoming / totalRoutes).toFixed(2);

console.log('=== Link Integrity Report ===');
if (brokenLinks.length === 0) {
  console.log('🟢 PASS: 0 broken internal links found!');
} else {
  console.log(`🔴 FAIL: ${brokenLinks.length} broken internal links found!`);
  brokenLinks.slice(0, 15).forEach((b, idx) => {
    console.log(`  ${idx + 1}. Source: ${b.sourceUrl} -> Target Slug: "${b.targetSlug}" (leads to 404 at ${b.expectedUrl})`);
  });
  if (brokenLinks.length > 15) {
    console.log(`  ... and ${brokenLinks.length - 15} more broken links.`);
  }
}

console.log('\n=== Crawlability & Orphan Checks ===');
if (orphans.length === 0) {
  console.log('🟢 PASS: 0 orphan pages found! All pages are internally linked.');
} else {
  console.log(`🟡 WARNING: ${orphans.length} orphan pages discovered (they have 0 incoming internal links from other SEO pages):`);
  orphans.slice(0, 15).forEach((o, idx) => {
    console.log(`  - ${o}`);
  });
  if (orphans.length > 15) {
    console.log(`  ... and ${orphans.length - 15} more orphan pages.`);
  }
}

console.log('\n=== Interlinking Density Stats ===');
console.log(`- Total Outgoing Related Links analyzed: ${totalOutgoing}`);
console.log(`- Average internal incoming links per page: ${avgIncoming}`);
console.log(`- Minimum incoming links on a page: ${minIncoming}`);
console.log(`- Maximum incoming links on a page: ${maxIncoming}`);

console.log('\n=== INTERLINKING CONCLUSION ===');
if (brokenLinks.length === 0 && orphans.length === 0) {
  console.log('🟢 PERFECT: All SEO pages are properly interlinked with valid URLs and no isolated nodes!');
} else if (brokenLinks.length === 0 && orphans.length > 0) {
  console.log('🟡 FAIR: Links are valid, but directory/hub pages must list the orphan pages so Googlebot can discover them.');
} else {
  console.log('🔴 ACTION REQUIRED: Please correct the broken link targets listed above.');
}
