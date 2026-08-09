const fs = require('fs');
const path = require('path');

const seoPagesPath = path.resolve(__dirname, '../src/data/seoPages.ts');
const templateSeoDataPath = path.resolve(__dirname, '../src/data/templateSeoData.ts');
const seoPagesDir = path.resolve(__dirname, '../src/data/seo-pages');

// Helper to count slugs in a text block
function countSlugsInArrayText(text) {
  const regex = /^\s{4}slug:\s*['"]([^'"]+)['"]/gm;
  let match;
  let count = 0;
  const slugs = [];
  while ((match = regex.exec(text)) !== null) {
    slugs.push(match[1]);
    count++;
  }
  return { count, slugs };
}

// Helper to count keys in a Record text block
function countKeysInRecordText(text) {
  const regex = /^\s{2}['"]([^'"]+)['"]:\s*\{/gm;
  let match;
  let count = 0;
  const keys = [];
  while ((match = regex.exec(text)) !== null) {
    keys.push(match[1]);
    count++;
  }
  return { count, keys };
}

console.log('--- STARTING SEO PAGE COUNTING ---\n');

// 1. Base SEO Pages from seoPages.ts
let baseCount = 0;
let baseSlugs = [];
if (fs.existsSync(seoPagesPath)) {
  const content = fs.readFileSync(seoPagesPath, 'utf8');
  const startIdx = content.indexOf('const baseSEOPages');
  const endIdx = content.indexOf('import { seoExpandedContent }');
  if (startIdx !== -1 && endIdx !== -1) {
    const baseSection = content.substring(startIdx, endIdx);
    const res = countSlugsInArrayText(baseSection);
    baseCount = res.count;
    baseSlugs = res.slugs;
  } else {
    const res = countSlugsInArrayText(content);
    baseCount = res.count;
    baseSlugs = res.slugs;
  }
}

// 2. Base Template SEO Pages from templateSeoData.ts
let baseTemplateCount = 0;
let baseTemplateKeys = [];
if (fs.existsSync(templateSeoDataPath)) {
  const content = fs.readFileSync(templateSeoDataPath, 'utf8');
  const startIdx = content.indexOf('const baseTemplateSeoData');
  const endIdx = content.indexOf('import { templatesGroup }');
  if (startIdx !== -1 && endIdx !== -1) {
    const baseSection = content.substring(startIdx, endIdx);
    const res = countKeysInRecordText(baseSection);
    baseTemplateCount = res.count;
    baseTemplateKeys = res.keys;
  } else {
    const res = countKeysInRecordText(content);
    baseTemplateCount = res.count;
    baseTemplateKeys = res.keys;
  }
}

// 3. Programmatic groups in src/data/seo-pages/
const groupResults = {};
let totalProgrammatic = 0;

if (fs.existsSync(seoPagesDir)) {
  const files = fs.readdirSync(seoPagesDir).filter(f => f.endsWith('.ts'));
  for (const file of files) {
    const filePath = path.join(seoPagesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    let res;
    if (file.toLowerCase().includes('templates')) {
      res = countKeysInRecordText(content);
    } else {
      res = countSlugsInArrayText(content);
    }
    
    groupResults[file] = {
      count: res.count,
      slugs: res.slugs || res.keys
    };
    totalProgrammatic += res.count;
  }
}

console.log('### Summary by File:\n');
console.log(`| File/Source | Page Count | Type | Status |`);
console.log(`|---|---|---|---|`);
console.log(`| [base] seoPages.ts (baseSEOPages) | ${baseCount} | Array | Existing |`);
console.log(`| [base] templateSeoData.ts (baseTemplateSeoData) | ${baseTemplateCount} | Record | Existing |`);

const newFiles = [
  'verticalAlternativesGroup.ts',
  'verticalComparisonsGroup.ts',
  'verticalHowtoGroup.ts',
  'verticalIndustryGroup.ts',
  'verticalTemplatesGroup.ts'
];

for (const [file, info] of Object.entries(groupResults)) {
  const isNew = newFiles.includes(file);
  const status = isNew ? '**New (Untracked)**' : 'Existing (Modified/Tracked)';
  console.log(`| seo-pages/${file} | ${info.count} | ${file.toLowerCase().includes('templates') ? 'Record' : 'Array'} | ${status} |`);
}

const grandTotal = baseCount + baseTemplateCount + totalProgrammatic;
console.log(`\n**Total Programmatic Pages**: ${totalProgrammatic}`);
console.log(`**GRAND TOTAL SEO PAGES**: ${grandTotal}`);

// Log out details about new SEO pages specifically
console.log('\n### Breakdown of New (Untracked) SEO Pages:');
let totalNew = 0;
for (const file of newFiles) {
  if (groupResults[file]) {
    console.log(`- **${file}**: ${groupResults[file].count} pages`);
    totalNew += groupResults[file].count;
  }
}
console.log(`\n**Total Newly Created SEO Pages**: **${totalNew}**`);
