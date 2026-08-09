const fs = require('fs');
const path = require('path');

const csvDir = path.resolve(__dirname, '../data.csv');

if (!fs.existsSync(csvDir)) {
  console.error('Directory does not exist:', csvDir);
  process.exit(1);
}

const files = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));

for (const file of files) {
  const filePath = path.join(csvDir, file);
  console.log(`\n=== File: ${file} ===`);
  try {
    const rawBuffer = fs.readFileSync(filePath);
    
    // Check if UTF-16LE (often starts with BOM 0xFF 0xFE or contains null bytes)
    let content;
    if (rawBuffer[0] === 0xff && rawBuffer[1] === 0xfe) {
      content = rawBuffer.toString('utf16le');
    } else if (rawBuffer.includes(0x00)) {
      content = rawBuffer.toString('utf16le');
    } else {
      content = rawBuffer.toString('utf8');
    }
    
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    console.log(`Total lines: ${lines.length}`);
    console.log('First 5 lines:');
    lines.slice(0, 5).forEach((line, idx) => {
      console.log(`  Line ${idx + 1}: ${line.substring(0, 150)}`);
    });
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
}
