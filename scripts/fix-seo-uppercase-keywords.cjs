const fs = require('fs');
const path = require('path');

const seoPagesDir = path.resolve(__dirname, '../src/data/seo-pages');

if (!fs.existsSync(seoPagesDir)) {
  console.error('Directory not found:', seoPagesDir);
  process.exit(1);
}

// Function to convert raw uppercase or awkward keyword phrases to natural Title Case
function cleanKeywordPhrase(phrase) {
  if (!phrase) return phrase;

  const minorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'in', 'of']);

  return phrase
    .toLowerCase()
    .split(/\s+/)
    .map((word, idx) => {
      if (word === 'docsend') return 'DocSend';
      if (word === 'docusign') return 'DocuSign';
      if (word === 'pandadoc') return 'PandaDoc';
      if (word === 'adobe') return 'Adobe';
      if (word === 'zoho') return 'Zoho';
      if (word === 'doctransfer') return 'DocTransfer';
      if (word === 'e2ee' || word === 'e2e') return 'E2EE';
      if (word === 'pdf' || word === 'pdfs') return word.toUpperCase();
      if (word === 'vdr') return 'VDR';
      if (word === 'hipaa') return 'HIPAA';
      if (word === 'cpa') return 'CPA';
      if (word === 'i9') return 'I-9';
      if (word === 'sso') return 'SSO';

      if (idx > 0 && minorWords.has(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Fix section title patterns like "1. The Strategic Importance of the HOW TO SIGN A CONTRACT ONLINE LEGALLY"
function normalizeTitle(title) {
  if (!title) return title;

  return title.replace(
    /^(.*?)(?:of the|of|for|using|with)\s+([A-Z0-9\s\-\/\&]{4,})(.*)$/g,
    (match, prefix, uppercasePhrase, suffix) => {
      const letters = uppercasePhrase.replace(/[^A-Za-z]/g, '');
      const caps = uppercasePhrase.replace(/[^A-Z]/g, '');
      if (letters.length > 0 && caps.length / letters.length >= 0.6) {
        const cleaned = cleanKeywordPhrase(uppercasePhrase.trim());
        return `${prefix.trim()} ${cleaned}${suffix ? ' ' + suffix.trim() : ''}`.trim();
      }
      return match;
    }
  ).replace(/([A-Z\s]{5,})/g, (match) => {
    const letters = match.replace(/[^A-Za-z]/g, '');
    const caps = match.replace(/[^A-Z]/g, '');
    if (letters.length >= 4 && caps.length / letters.length >= 0.8) {
      return cleanKeywordPhrase(match.trim());
    }
    return match;
  });
}

// Fix text body awkward injections
function normalizeText(text) {
  if (!text) return text;

  let cleaned = text;

  cleaned = cleaned.replace(/\b(using|of|for|with|about|targeting|using the|of the)\s+how to ([a-z0-9\s]+)\b/gi, (match, prep, action) => {
    const actionClean = action.trim();
    if (prep.toLowerCase().includes('the')) {
      return `using a platform to ${actionClean}`;
    }
    return `${prep} ${actionClean}`;
  });

  cleaned = cleaned.replace(/\b([A-Z]{4,}(?:\s+[A-Z]{2,})+)\b/g, (match) => {
    if (['HIPAA COMPLIANT', 'ESIGN ACT', 'E2EE VAULT', 'GDPR COMPLIANT', 'AES 256'].includes(match.trim())) {
      return match;
    }
    return cleanKeywordPhrase(match);
  });

  return cleaned;
}

const files = fs.readdirSync(seoPagesDir).filter((f) => f.endsWith('.ts'));

let totalFixedFiles = 0;
let totalFixedSections = 0;

files.forEach((file) => {
  const filePath = path.join(seoPagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  content = content.replace(/"title":\s*"([^"]+)"/g, (match, titleVal) => {
    const newTitle = normalizeTitle(titleVal);
    if (newTitle !== titleVal) {
      totalFixedSections++;
      return `"title": "${newTitle}"`;
    }
    return match;
  });

  content = content.replace(/"question":\s*"([^"]+)"/g, (match, qVal) => {
    const newQ = normalizeTitle(normalizeText(qVal));
    if (newQ !== qVal) {
      totalFixedSections++;
      return `"question": "${newQ}"`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFixedFiles++;
    console.log(`[FIXED] Cleaned titles & text in ${file}`);
  }
});

console.log(`\nCompleted! Updated ${totalFixedSections} titles/texts across ${totalFixedFiles} files.`);
