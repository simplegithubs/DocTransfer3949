const fs = require('fs');
const path = require('path');

const csvDir = path.resolve(__dirname, '../data.csv');
const files = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));

// Stop words to exclude from matching entirely
const stopWords = new Set(['for', 'and', 'the', 'of', 'in', 'to', 'with', 'on', 'at', 'by', 'a', 'an', 'is', 'are', 'about']);

// Generic words that shouldn't trigger matches on their own
const genericWords = new Set([
  'template', 'templates', 'form', 'forms', 'agreement', 'agreements', 'contract', 'contracts',
  'alternative', 'alternatives', 'vs', 'comparison', 'guide', 'guides', 'how', 'to', 'sharing',
  'file', 'files', 'sharing', 'secure', 'free', 'best', 'online', 'portal', 'portals', 'service',
  'services', 'tool', 'tools', 'software', 'app', 'apps', 'system', 'systems', 'platform', 'platforms',
  'cheaper', 'cheapest', 'cheap', 'competitors', 'equivalent', 'like', 'sign', 'signing', 'e-sign',
  'e-signing', 'download', 'downloads', 'word', 'pdf', 'excel', 'printable', 'print', 'editable', 'edit'
]);

// Read and collect all keywords from all CSVs
const allKeywords = [];
for (const file of files) {
  const filePath = path.join(csvDir, file);
  try {
    const rawBuffer = fs.readFileSync(filePath);
    let content;
    if (rawBuffer[0] === 0xff && rawBuffer[1] === 0xfe) {
      content = rawBuffer.toString('utf16le');
    } else if (rawBuffer.includes(0x00)) {
      content = rawBuffer.toString('utf16le');
    } else {
      content = rawBuffer.toString('utf8');
    }
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    for (let i = 3; i < lines.length; i++) {
      const parts = lines[i].split('\t');
      if (parts[0]) {
        const keyword = parts[0].replace(/^["']|["']$/g, '').trim();
        if (keyword && keyword !== 'Keyword') {
          const split = keyword.toLowerCase().split(/\s+/).filter(w => !stopWords.has(w) && w.length > 1);
          const nicheWords = new Set(split.filter(w => !genericWords.has(w)));
          const genWords = new Set(split.filter(w => genericWords.has(w)));
          allKeywords.push({
            keyword,
            file,
            nicheWords,
            genWords
          });
        }
      }
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
}

console.log(`Total keywords collected: ${allKeywords.length}`);

// Helper to tokenize slug or title into niche and generic words
function tokenize(text) {
  const split = text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/[\s-]+/)
    .filter(w => !stopWords.has(w) && w.length > 1);
  return {
    niche: split.filter(w => !genericWords.has(w)),
    generic: split.filter(w => genericWords.has(w))
  };
}

// Function to find matches for a given slug and title
function findMatches(slug, title, category) {
  const slugTokens = tokenize(slug);
  const titleTokens = tokenize(title);
  
  // Combine unique tokens
  const pageNiche = Array.from(new Set([...slugTokens.niche, ...titleTokens.niche]));
  const pageGeneric = Array.from(new Set([...slugTokens.generic, ...titleTokens.generic]));
  
  const matches = [];
  for (const item of allKeywords) {
    let nicheMatchCount = 0;
    let genMatchCount = 0;
    
    item.nicheWords.forEach(word => {
      if (pageNiche.includes(word)) nicheMatchCount++;
    });
    
    item.genWords.forEach(word => {
      if (pageGeneric.includes(word)) genMatchCount++;
    });
    
    // CRITICAL: We require at least one niche word match if the page has niche words.
    // E.g. "patient" or "consent" or "subcontractor" or "i9".
    // If the page only consists of generic words (very rare), we allow generic matches.
    const hasNicheOverlap = nicheMatchCount > 0;
    const isPagePurelyGeneric = pageNiche.length === 0;
    
    if (hasNicheOverlap || (isPagePurelyGeneric && genMatchCount > 0)) {
      let score = nicheMatchCount * 10 + genMatchCount * 1;
      
      // Prioritize keywords matching the page's category
      let categoryBonus = 0;
      if (category === 'templates' && item.file.includes('10_52_48')) categoryBonus = 2; // Templates CSV
      if ((category === 'alternatives' || category === 'comparisons') && item.file.includes('10_57_02')) categoryBonus = 2; // Alternatives CSV
      if (category === 'industry' && item.file.includes('10_58_28')) categoryBonus = 2; // Industry CSV
      if (category === 'how-to' && item.file.includes('11_00_33')) categoryBonus = 2; // How-to CSV
      
      matches.push({
        keyword: item.keyword,
        score: score + categoryBonus,
        file: item.file
      });
    }
  }
  
  // Sort descending by score, and limit to top 5
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(m => m.keyword);
}

// Let's test a few sample pages from different categories
const samples = [
  { slug: 'patient-consent-form-template', title: 'Free Patient Consent Form Template', category: 'templates' },
  { slug: 'docusign-alternative-healthcare', title: 'Best Free DocuSign Alternative for Healthcare', category: 'alternatives' },
  { slug: 'hipaa-document-sharing', title: 'HIPAA-Compliant Document Sharing for Healthcare', category: 'industry' },
  { slug: 'how-to-verify-academic-credentials', title: 'How to Verify Academic Credentials Securely', category: 'how-to' },
  { slug: 'subcontractor-agreement-template', title: 'Free Subcontractor Agreement Template', category: 'templates' }
];

console.log('\n--- Simulation Results ---');
for (const sample of samples) {
  const matches = findMatches(sample.slug, sample.title, sample.category);
  console.log(`\nPage: ${sample.slug} (${sample.category})`);
  console.log(`Title: ${sample.title}`);
  console.log(`Top matches:`);
  matches.forEach((m, idx) => console.log(`  ${idx + 1}. ${m}`));
}
