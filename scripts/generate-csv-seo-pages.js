import fs from 'fs';
import path from 'path';

const csvPath = path.resolve('data.csv/Keyword Stats 2026-07-30 at 11_42_56.csv');
const seoPagesDir = path.resolve('src/data/seo-pages');
const targetFilePath = path.join(seoPagesDir, 'csvGroup.ts');

try {
    if (!fs.existsSync(csvPath)) {
        console.error("CSV file not found at:", csvPath);
        process.exit(1);
    }

    if (!fs.existsSync(seoPagesDir)) {
        fs.mkdirSync(seoPagesDir, { recursive: true });
    }

    // Read the file as UTF-16LE
    const content = fs.readFileSync(csvPath, 'utf16le');
    const lines = content.split(/\r?\n/);

    // Locate header row
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

    const headers = lines[headerIndex].split('\t').map(h => h.trim());
    const keywordIdx = headers.indexOf('Keyword');
    const searchesIdx = headers.indexOf('Avg. monthly searches');

    if (keywordIdx === -1 || searchesIdx === -1) {
        console.error("Required columns ('Keyword' and/or 'Avg. monthly searches') not found.");
        process.exit(1);
    }

    const keywordsMap = new Map();

    // Helper to capitalize words
    const capitalize = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Filter rules
    const targetSubstrings = ['sign', 'signature', 'pdf', 'share', 'file', 'doc', 'contract', 'agreement', 'esign'];

    for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split('\t');
        if (cols.length <= Math.max(keywordIdx, searchesIdx)) continue;

        const keyword = cols[keywordIdx].trim().toLowerCase();
        const searchesStr = cols[searchesIdx].trim();
        const searches = parseInt(searchesStr.replace(/,/g, ''), 10) || 0;

        // Apply filter: searches >= 5000 and contains at least one target substring
        if (searches >= 5000 && targetSubstrings.some(sub => keyword.includes(sub))) {
            // Generate clean slug
            let baseSlug = keyword.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            if (!baseSlug.startsWith('how-to-') && !keyword.startsWith('how to')) {
                baseSlug = `how-to-${baseSlug}`;
            } else if (keyword.startsWith('how to')) {
                // Ensure starts with how-to-
                baseSlug = baseSlug.replace(/^how-to/, 'how-to');
            }

            // Deduplicate: keep the one with higher search volume
            if (keywordsMap.has(baseSlug)) {
                const existing = keywordsMap.get(baseSlug);
                if (existing.searches < searches) {
                    keywordsMap.set(baseSlug, { keyword, searches });
                }
            } else {
                keywordsMap.set(baseSlug, { keyword, searches });
            }
        }
    }

    const selectedKeywords = Array.from(keywordsMap.entries()).map(([slug, item]) => {
        return {
            slug,
            keyword: item.keyword,
            searches: item.searches
        };
    });

    // Sort by search volume descending
    selectedKeywords.sort((a, b) => b.searches - a.searches);

    console.log(`Selected ${selectedKeywords.length} unique high-volume keywords.`);

    // Generator function for body paragraphs
    const generateParagraphs = (kw) => {
        const titleKw = capitalize(kw);
        const p1 = `Performing the task of ${kw} is a fundamental requirement for modern professionals, remote companies, and growing startups. Traditional methods of handling agreements often rely on unsecure email attachments, physical printing, or expensive proprietary document portals that burden your team. By adopting a modern approach to ${kw}, you establish a fast, compliant, and highly secure environment. With end-to-end client-side encryption and standard cryptographic locking, sensitive terms, contracts, and personal records remain fully private.`;
        
        const p2 = `A primary consideration when selecting a platform to ${kw} is the security model. Unlike legacy vendors that store raw files and decryption keys on their databases, a zero-knowledge framework encrypts files locally inside your web browser. This ensures that only you and the designated signer hold the unique keys. In addition to local encryption, features like dynamic recipient watermarking, passcode verification, and access expiry let you retain total control over your shared files at all times.`;
        
        const p3 = `Beyond compliance and file protection, optimizing how you ${kw} includes gaining real-time document insights. Simple file transfers leave you in the dark once you hit send. Advanced reading metrics solve this by recording exactly when the client opens your document and how many seconds they spend on each page. For contracts, proposals, or pitch decks, these page-level duration logs pinpoint exactly what section (like pricing or intellectual property terms) the client is reviewing, allowing you to follow up with precision.`;
        
        const p4 = `Finally, any tool used to ${kw} must generate legally binding results. E-signatures gathered through compliant web applications strictly adhere to the United States ESIGN Act, the Uniform Electronic Transactions Act (UETA), and European Union eIDAS regulations. Once all parties sign, the PDF is cryptographically sealed to prevent subsequent tampering. The resulting court-admissible audit log captures verified email accounts, IP addresses, and timestamps to establish clear, ironclad proof of consent.`;

        return [
            { title: `1. The Strategic Advantage of Online ${titleKw}`, text: p1 },
            { title: `2. Browser-Based Cryptography & Privacy Protection`, text: p2 },
            { title: `3. Second-by-Second Page Engagement Analytics`, text: p3 },
            { title: `4. Legally-Binding E-Signatures & Compliant Audit Trails`, text: p4 }
        ];
    };

    // Generator function for FAQs
    const generateFAQs = (kw) => {
        const titleKw = capitalize(kw);
        return [
            {
                question: `How can I safely ${kw} online?`,
                answer: `You can safely perform ${kw} by uploading your documents to a secure zero-knowledge platform like DocTransfer. We encrypt your files in the browser before they hit the cloud, so only you and the recipient can open them. You can also add email verification or password requirements for extra protection.`
            },
            {
                question: `Do my clients need an account to sign or review files?`,
                answer: `No. Your clients, signers, or recipients do not need to sign up for an account, register, or download any software to review or sign documents. They can complete the entire process directly in their desktop or mobile browser.`
            },
            {
                question: `Are digital signatures gathered in this process legally binding?`,
                answer: `Yes. Every signature gathered through DocTransfer complies with key international digital laws, including the US ESIGN Act, UETA, and the EU's eIDAS regulations. Each completed document features a tamper-evident seal and a complete audit log.`
            },
            {
                question: `Can I see if a recipient has opened and read the document?`,
                answer: `Absolutely. You will receive real-time notifications when your link is opened. Our dashboard displays detailed page-level reading times, showing you exactly how many seconds the viewer spent reading each specific page.`
            },
            {
                question: `How do I prevent unauthorized sharing or printing?`,
                answer: `You can disable file downloads to force online-only viewing, add dynamic overlays that watermark the reader's email address and IP on the pages, set expiration timers on links, and revoke access at any time.`
            }
        ];
    };

    // Build TypeScript content
    let tsContent = `import type { HowToPageData } from '../seoPages';\n\n`;
    tsContent += `export const csvGroup: HowToPageData[] = [\n`;

    selectedKeywords.forEach(item => {
        const formattedKw = capitalize(item.keyword);
        const body = generateParagraphs(item.keyword);
        const faqs = generateFAQs(item.keyword);

        tsContent += `  {\n`;
        tsContent += `    slug: ${JSON.stringify(item.slug)},\n`;
        tsContent += `    category: 'how-to',\n`;
        tsContent += `    title: 'How to ${formattedKw} - Free & Secure | DocTransfer',\n`;
        tsContent += `    metaTitle: 'How to ${formattedKw} - Step-by-Step Guide | DocTransfer',\n`;
        tsContent += `    description: 'Learn how to ${item.keyword} step-by-step for free. Protect your files, track document views page-by-page, and collect compliant e-signatures.',\n`;
        tsContent += `    keywords: ${JSON.stringify(`${item.keyword}, sign pdf, electronic signature free, online e-signature`)},\n`;
        tsContent += `    howToTitle: 'How to ${formattedKw}',\n`;
        tsContent += `    relatedSlugs: ['how-to-sign-contract-online', 'how-to-track-pdf-opens', 'how-to-add-pdf-watermark'],\n`;
        tsContent += `    benefits: [\n`;
        tsContent += `      'Zero-knowledge AES-256 local client encryption',\n`;
        tsContent += `      'Real-time second-by-second page duration logs',\n`;
        tsContent += `      'Legally binding signatures (ESIGN & eIDAS compliant)'\n`;
        tsContent += `    ],\n`;
        tsContent += `    steps: [\n`;
        tsContent += `      { stepNumber: 1, title: 'Upload and Encrypt', description: 'Drag and drop your file into the DocTransfer dashboard. Choose to enable local client-side E2EE encryption.' },\n`;
        tsContent += `      { stepNumber: 2, title: 'Add Form Fields', description: 'Place signature fields, initials, input textboxes, and date selectors on the required pages.' },\n`;
        tsContent += `      { stepNumber: 3, title: 'Configure Security & Share', description: 'Enable recipient email filters, dynamic watermarks, or link passwords. Share the secure link.' },\n`;
        tsContent += `      { stepNumber: 4, title: 'Seal & Review Audit Trail', description: 'The recipient signs the document. The final PDF is cryptographically sealed, and a full audit log is generated.' }\n`;
        tsContent += `    ],\n`;
        tsContent += `    bodySections: ${JSON.stringify(body, null, 6)},\n`;
        tsContent += `    faqs: ${JSON.stringify(faqs, null, 6)}\n`;
        tsContent += `  },\n`;
    });

    tsContent = tsContent.slice(0, -2) + `\n];\n`;

    fs.writeFileSync(targetFilePath, tsContent, 'utf8');
    console.log(`✅ Success: Generated ${selectedKeywords.length} SEO pages inside ${targetFilePath}`);

} catch (err) {
    console.error("An error occurred during SEO page generation:", err);
    process.exit(1);
}
