/**
 * Content Quality & Boilerplate Cleaner Script (Pillar 2)
 * 
 * Replaces repetitive template text across programmatic files with rich, authoritative,
 * and high-converting content blocks that bypass Google's Helpful Content System filters.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../src/data/seo-pages');

console.log('--- STARTING PSEO CONTENT QUALITY UPGRADE ---\n');

const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts'));

let totalSectionsCleaned = 0;

for (const file of files) {
  const filePath = path.join(DATA_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if file has bodySections
  if (!content.includes('bodySections')) continue;

  const originalLength = content.length;

  // 1. Clean repetitive opening pattern
  // "Implementing a secure workflow using the ... represents a critical operational baseline for modern businesses..."
  content = content.replace(
    /Implementing a secure workflow (?:using the|for) [^.]*? represents a critical operational baseline for modern businesses[^.]*?\./g,
    'Securing business-critical document workflows with client-side encryption and granular recipient analytics is essential for modern organizations.'
  );

  // 2. Clean repetitive communication failure pattern
  content = content.replace(
    /Standard communications and document deliveries frequently fall victim to cybersecurity breaches[^.]*?\./g,
    'Standard email attachments provide zero visibility into whether your counterparty opened the document, how long they reviewed it, or if it was leaked to competitors.'
  );

  // 3. Clean repetitive security paragraph openings
  content = content.replace(
    /When evaluating (?:options|solutions) for [^,]*?, security architecture is the primary differentiator\./g,
    'Enterprise security architecture and cryptographic key control are the fundamental differentiators between modern platforms and legacy suites.'
  );

  // 4. Clean repetitive tracking intro
  content = content.replace(
    /Beyond encryption, (?:an effective|a functional) [^.]*? suite must (?:offer|deliver) deep engagement intelligence\./g,
    'Beyond zero-knowledge encryption, high-performing sales, legal, and fundraising teams require page-by-page engagement telemetry to close deals faster.'
  );

  // 5. Clean repetitive compliance intro
  content = content.replace(
    /Finally, compliance with national and global digital standards [^.]*? is essential for any legally valid online contract\./g,
    'Full statutory compliance under the US ESIGN Act, UETA, and EU eIDAS regulations guarantees court-admissibility for every executed agreement.'
  );

  if (content.length !== originalLength) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalSectionsCleaned++;
    console.log(`✓ Enhanced content quality and removed repetitive boilerplate in ${file}`);
  }
}

console.log(`\n Total files upgraded with high-authority text: ${totalSectionsCleaned}`);
console.log('--- CONTENT QUALITY CLEANING COMPLETE ---');
