const fs = require('fs');
const path = require('path');

const csvDir = path.resolve(__dirname, '../data.csv');
const files = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));

const allKeywords = {};

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
    const kwList = [];
    
    // Header is on line 3, data starts on line 4
    for (let i = 3; i < lines.length; i++) {
      const parts = lines[i].split('\t');
      if (parts[0]) {
        // Strip quotes if any
        const keyword = parts[0].replace(/^["']|["']$/g, '').trim();
        if (keyword && keyword !== 'Keyword') {
          kwList.push(keyword);
        }
      }
    }
    allKeywords[file] = kwList;
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
}

for (const [file, keywords] of Object.entries(allKeywords)) {
  console.log(`\n=== ${file} (${keywords.length} keywords) ===`);
  console.log(keywords.slice(0, 20).join('\n'));
  if (keywords.length > 20) {
    console.log(`... and ${keywords.length - 20} more`);
  }
}
