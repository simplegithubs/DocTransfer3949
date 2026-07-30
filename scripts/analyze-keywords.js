import fs from 'fs';
import path from 'path';

const csvPath = path.resolve('data.csv/Keyword Stats 2026-07-30 at 11_42_56.csv');

try {
    if (!fs.existsSync(csvPath)) {
        console.error("CSV file not found at:", csvPath);
        process.exit(1);
    }

    // Read the file as UTF-16LE since that is the encoding from Google Keyword Planner
    const content = fs.readFileSync(csvPath, 'utf16le');
    const lines = content.split(/\r?\n/);

    // Let's locate the header row. Standard Google Keyword Planner CSVs start with a few metadata lines.
    let headerIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Keyword') && lines[i].includes('Avg. monthly searches')) {
            headerIndex = i;
            break;
        }
    }

    if (headerIndex === -1) {
        console.error("Could not find header row in the CSV file.");
        process.exit(1);
    }

    console.log(`Found header row at index ${headerIndex}: "${lines[headerIndex].slice(0, 100)}..."`);

    const headers = lines[headerIndex].split('\t').map(h => h.trim());
    const keywordIdx = headers.indexOf('Keyword');
    const searchesIdx = headers.indexOf('Avg. monthly searches');
    const competitionIdx = headers.indexOf('Competition');

    if (keywordIdx === -1 || searchesIdx === -1) {
        console.error("Required columns ('Keyword' and/or 'Avg. monthly searches') not found.");
        process.exit(1);
    }

    const keywordsList = [];

    for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split('\t');
        if (cols.length <= Math.max(keywordIdx, searchesIdx)) continue;

        const keyword = cols[keywordIdx].trim();
        const searchesStr = cols[searchesIdx].trim();
        const searches = parseInt(searchesStr.replace(/,/g, ''), 10) || 0;
        const competition = competitionIdx !== -1 ? cols[competitionIdx].trim() : 'Unknown';

        if (keyword && searches > 0) {
            keywordsList.push({ keyword, searches, competition });
        }
    }

    // Sort by search volume descending
    keywordsList.sort((a, b) => b.searches - a.searches);

    console.log(`Total parsed keywords: ${keywordsList.length}`);
    console.log("\nTop 50 keywords by search volume:");
    console.log("---------------------------------");
    keywordsList.slice(0, 50).forEach((kw, index) => {
        console.log(`${index + 1}. ${kw.keyword} (Searches: ${kw.searches}, Competition: ${kw.competition})`);
    });

} catch (err) {
    console.error("An error occurred during parsing:", err);
}
