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

console.log(`Total keywords loaded: ${allKeywords.length}`);

// Helper to tokenize slug or title
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
    
    const hasNicheOverlap = nicheMatchCount > 0;
    const isPagePurelyGeneric = pageNiche.length === 0;
    
    if (hasNicheOverlap || (isPagePurelyGeneric && genMatchCount > 0)) {
      let score = nicheMatchCount * 10 + genMatchCount * 1;
      
      let categoryBonus = 0;
      if (category === 'templates' && item.file.includes('10_52_48')) categoryBonus = 2;
      if ((category === 'alternatives' || category === 'comparisons') && item.file.includes('10_57_02')) categoryBonus = 2;
      if (category === 'industry' && item.file.includes('10_58_28')) categoryBonus = 2;
      if (category === 'how-to' && item.file.includes('11_00_33')) categoryBonus = 2;
      
      matches.push({
        keyword: item.keyword,
        score: score + categoryBonus
      });
    }
  }
  
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(m => m.keyword);
}

// Target Files in src/data/seo-pages/
const targetFiles = [
  { name: 'verticalAlternativesGroup.ts', category: 'alternatives', isRecord: false },
  { name: 'verticalComparisonsGroup.ts', category: 'comparisons', isRecord: false },
  { name: 'verticalHowtoGroup.ts', category: 'how-to', isRecord: false },
  { name: 'verticalIndustryGroup.ts', category: 'industry', isRecord: false },
  { name: 'verticalTemplatesGroup.ts', category: 'templates', isRecord: true }
];

const seoPagesDir = path.resolve(__dirname, '../src/data/seo-pages');

let totalUpdatedPages = 0;

// Safe replace function with unescaping and escaped quote parsing support
function updateKeywordsInContent(content, slug, matchedKeywords) {
  // Find where the slug is defined
  const slugRegex = new RegExp(`slug:\\s*['"]${slug}['"]`);
  const slugMatch = content.match(slugRegex);
  if (!slugMatch) return content;
  
  const slugIdx = slugMatch.index;
  
  // Find the first keywords definition after the slug, supporting escaped quotes properly
  const keywordsRegex = /keywords:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/;
  const restOfContent = content.substring(slugIdx);
  const keywordsMatch = restOfContent.match(keywordsRegex);
  
  if (keywordsMatch) {
    const isSingle = keywordsMatch[1] !== undefined;
    const originalKwsString = isSingle ? keywordsMatch[1] : keywordsMatch[2];
    
    // Split and clean existing keywords, unescaping quote marks
    const existingKws = originalKwsString
      .split(',')
      .map(s => s.trim())
      .map(s => isSingle ? s.replace(/\\'/g, "'") : s.replace(/\\"/g, '"'))
      .filter(Boolean);
    
    // Combine unique keywords
    const combined = Array.from(new Set([...existingKws, ...matchedKeywords]));
    const combinedString = combined.join(', ');
    
    // Escape quote marks properly for the destination format
    const escapedCombined = isSingle 
      ? combinedString.replace(/'/g, "\\'") 
      : combinedString.replace(/"/g, '\\"');
      
    const quote = isSingle ? "'" : '"';
    const newKeywordsLine = `keywords: ${quote}${escapedCombined}${quote}`;
    
    // Replace only that specific occurrence
    const matchStart = slugIdx + keywordsMatch.index;
    const matchEnd = matchStart + keywordsMatch[0].length;
    
    return content.substring(0, matchStart) + newKeywordsLine + content.substring(matchEnd);
  }
  
  return content;
}

// First parse all pages to update
for (const target of targetFiles) {
  const filePath = path.join(seoPagesDir, target.name);
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  console.log(`\nProcessing ${target.name}...`);
  
  const slugGlobalRegex = /slug:\s*['"]([^'"]+)['"]/g;
  let match;
  const pagesToProcess = [];
  
  while ((match = slugGlobalRegex.exec(content)) !== null) {
    const slug = match[1];
    const slugIdx = match.index;
    
    const rest = content.substring(slugIdx, slugIdx + 500);
    const titleMatch = rest.match(/(?:pageTitle|title):\s*['"]([^'"]+)['"]/);
    const title = titleMatch ? titleMatch[1] : '';
    
    pagesToProcess.push({ slug, title });
  }
  
  let fileUpdated = false;
  for (const page of pagesToProcess) {
    const matchedKws = findMatches(page.slug, page.title, target.category);
    if (matchedKws.length > 0) {
      const originalContent = content;
      content = updateKeywordsInContent(content, page.slug, matchedKws);
      if (content !== originalContent) {
        totalUpdatedPages++;
        fileUpdated = true;
      }
    }
  }
  
  if (fileUpdated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated keywords in ${target.name}`);
  } else {
    console.log(`No changes needed in ${target.name}`);
  }
}

console.log(`\n✅ Finished! Successfully updated keywords for ${totalUpdatedPages} pages across the files.`);
