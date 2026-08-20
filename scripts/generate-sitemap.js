import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Parse .env manually for Supabase connection
let supabaseUrl = '';
let supabaseKey = '';

try {
    const envPath = path.resolve('.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split(/\r?\n/).forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex > 0) {
                const key = trimmed.slice(0, eqIndex).trim();
                const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, '');
                if (key === 'VITE_SUPABASE_URL') supabaseUrl = value;
                if (key === 'VITE_SUPABASE_ANON_KEY') supabaseKey = value;
            }
        });
    }
} catch (envErr) {
    console.warn("Failed to load .env manually:", envErr.message);
}

const BASE_URL = 'https://www.doctransfer.app';

// Predefined static template IDs (the ones in the application routes)
const systemTemplates = [
    'offer-letter',
    'nda',
    'w4-form',
    'i9-form',
    'llc-operating',
    'sublease',
    'liability-release',
    'sow',
    'purchase-order',
    'sales-contract',
    'contractor-agreement'
];

async function generateSitemap() {
    console.log("Generating sitemap dynamically...");
    
    // Core static entries
    const entries = [
        { loc: `${BASE_URL}`, priority: '1.0', changefreq: 'daily' },
        { loc: `${BASE_URL}/pricing`, priority: '0.8', changefreq: 'weekly' },
        { loc: `${BASE_URL}/alternatives`, priority: '0.85', changefreq: 'weekly' },
        { loc: `${BASE_URL}/comparisons`, priority: '0.85', changefreq: 'weekly' },
        { loc: `${BASE_URL}/blog`, priority: '0.85', changefreq: 'weekly' },
        { loc: `${BASE_URL}/research`, priority: '0.9', changefreq: 'weekly' },
        { loc: `${BASE_URL}/tools`, priority: '0.9', changefreq: 'weekly' },
        { loc: `${BASE_URL}/tools/pitch-deck-analyzer`, priority: '0.95', changefreq: 'weekly' },
        { loc: `${BASE_URL}/tools/nda-generator`, priority: '0.95', changefreq: 'weekly' },
        { loc: `${BASE_URL}/tools/vdr-cost-calculator`, priority: '0.9', changefreq: 'weekly' },
        { loc: `${BASE_URL}/tools/pdf-watermarking-tool`, priority: '0.9', changefreq: 'weekly' },
        { loc: `${BASE_URL}/integrations`, priority: '0.9', changefreq: 'weekly' },
        { loc: `${BASE_URL}/glossary`, priority: '0.9', changefreq: 'weekly' },
        { loc: `${BASE_URL}/solutions`, priority: '0.9', changefreq: 'weekly' },
        { loc: `${BASE_URL}/templates`, priority: '0.95', changefreq: 'weekly' },
        { loc: `${BASE_URL}/docsend-alternative`, priority: '0.95', changefreq: 'weekly' },
        { loc: `${BASE_URL}/sitemap-directory`, priority: '0.9', changefreq: 'weekly' }
    ];

    // Append predefined system templates
    systemTemplates.forEach(tId => {
        entries.push({
            loc: `${BASE_URL}/templates/${tId}`,
            priority: '0.8',
            changefreq: 'weekly'
        });
    });

    // Dynamically parse category SEO pages from seoPages.ts
    try {
        const seoPagesPath = path.resolve('src/data/seoPages.ts');
        if (fs.existsSync(seoPagesPath)) {
            const content = fs.readFileSync(seoPagesPath, 'utf8');
            // Regex to find slug and category in JavaScript objects:
            // slug: 'docusign-alternatives-legal',
            // category: 'alternatives',
            const regex = /slug:\s*['"]([^'"]+)['"],\s*category:\s*['"]([^'"]+)['"]/g;
            let match;
            let count = 0;
            while ((match = regex.exec(content)) !== null) {
                const slug = match[1];
                const category = match[2];
                entries.push({
                    loc: `${BASE_URL}/${category}/${slug}`,
                    priority: category === 'alternatives' || category === 'comparisons' ? '0.9' : '0.8',
                    changefreq: 'weekly'
                });
                count++;
            }
            console.log(`Parsed ${count} programmatic category pages from seoPages.ts.`);
        }
    } catch (parseErr) {
        console.warn("Warning: Failed to parse seoPages.ts dynamically:", parseErr.message);
    }

    // Dynamically parse additional modular SEO pages from src/data/seo-pages/
    try {
        const seoPagesDir = path.resolve('src/data/seo-pages');
        if (fs.existsSync(seoPagesDir)) {
            const files = fs.readdirSync(seoPagesDir).filter(f => f.endsWith('.ts'));
            let count = 0;
            for (const file of files) {
                const filePath = path.join(seoPagesDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                // If it is templates group, parse templates slug
                if (file.toLowerCase().includes('templates')) {
                    // Match the object keys in Record<string, TemplateSEOContent> format
                    // Pattern: 'slug-name': { at the start of an entry  
                    const keyRegex = /^\s{2,4}'([^']+)':\s*\{/gm;
                    let match;
                    const templateSlugs = new Set();
                    while ((match = keyRegex.exec(content)) !== null) {
                        templateSlugs.add(match[1]);
                    }
                    templateSlugs.forEach(slug => {
                        entries.push({
                            loc: `${BASE_URL}/templates/${slug}`,
                            priority: '0.85',
                            changefreq: 'weekly'
                        });
                        count++;
                    });
                } else {
                    // For alternatives, comparisons, industry, howto, genz groups
                    const regex = /slug:\s*['"]([^'"]+)['"],\s*category:\s*['"]([^'"]+)['"]/g;
                    let match;
                    while ((match = regex.exec(content)) !== null) {
                        const slug = match[1];
                        const category = match[2];
                        entries.push({
                            loc: `${BASE_URL}/${category}/${slug}`,
                            priority: category === 'alternatives' || category === 'comparisons' ? '0.9' : '0.8',
                            changefreq: 'weekly'
                        });
                        count++;
                    }
                }
            }
            console.log(`Parsed ${count} modular programmatic pages from src/data/seo-pages/.`);
        }
    } catch (parseErr) {
        console.warn("Warning: Failed to parse modular seo-pages directory:", parseErr.message);
    }

    // Dynamically parse template SEO pages from templateSeoData.ts
    try {
        const templateSeoPath = path.resolve('src/data/templateSeoData.ts');
        if (fs.existsSync(templateSeoPath)) {
            const content = fs.readFileSync(templateSeoPath, 'utf8');
            // Regex to find slug definitions in templateSeoData:
            // slug: 'rofr-template',
            const regex = /slug:\s*['"]([^'"]+)['"]/g;
            let match;
            const foundSlugs = new Set();
            while ((match = regex.exec(content)) !== null) {
                foundSlugs.add(match[1]);
            }
            foundSlugs.forEach(slug => {
                entries.push({
                    loc: `${BASE_URL}/templates/${slug}`,
                    priority: '0.85',
                    changefreq: 'weekly'
                });
            });
            console.log(`Parsed ${foundSlugs.size} programmatic templates from templateSeoData.ts.`);
        }
    } catch (parseErr) {
        console.warn("Warning: Failed to parse templateSeoData.ts dynamically:", parseErr.message);
    }

    // Dynamically parse blog pages from blogData.ts
    try {
        const blogDataPath = path.resolve('src/data/blogData.ts');
        if (fs.existsSync(blogDataPath)) {
            const content = fs.readFileSync(blogDataPath, 'utf8');
            const lines = content.split(/\r?\n/);
            let count = 0;
            lines.forEach(line => {
                const match = line.match(/^\s{4}slug:\s*['"]([^'"]+)['"]/);
                if (match) {
                    const slug = match[1];
                    entries.push({
                        loc: `${BASE_URL}/blog/${slug}`,
                        priority: '0.8',
                        changefreq: 'weekly'
                    });
                    count++;
                }
            });
            console.log(`Parsed ${count} blog posts from blogData.ts.`);
        }
    } catch (parseErr) {
        console.warn("Warning: Failed to parse blogData.ts dynamically:", parseErr.message);
    }

    // Dynamically parse integration pages from integrationsData.ts
    try {
        const integrationsPath = path.resolve('src/data/integrationsData.ts');
        if (fs.existsSync(integrationsPath)) {
            const content = fs.readFileSync(integrationsPath, 'utf8');
            const lines = content.split(/\r?\n/);
            let count = 0;
            lines.forEach(line => {
                const match = line.match(/^\s{4}slug:\s*['"]([^'"]+)['"]/);
                if (match) {
                    const slug = match[1];
                    entries.push({
                        loc: `${BASE_URL}/integrations/${slug}`,
                        priority: '0.85',
                        changefreq: 'weekly'
                    });
                    count++;
                }
            });
            console.log(`Parsed ${count} integration pages from integrationsData.ts.`);
        }
    } catch (parseErr) {
        console.warn("Warning: Failed to parse integrationsData.ts dynamically:", parseErr.message);
    }

    // Dynamically parse glossary pages from glossaryData.ts
    try {
        const glossaryPath = path.resolve('src/data/glossaryData.ts');
        if (fs.existsSync(glossaryPath)) {
            const content = fs.readFileSync(glossaryPath, 'utf8');
            const lines = content.split(/\r?\n/);
            let count = 0;
            lines.forEach(line => {
                const match = line.match(/^\s{4}slug:\s*['"]([^'"]+)['"]/);
                if (match) {
                    const slug = match[1];
                    entries.push({
                        loc: `${BASE_URL}/glossary/${slug}`,
                        priority: '0.85',
                        changefreq: 'weekly'
                    });
                    count++;
                }
            });
            console.log(`Parsed ${count} glossary term pages from glossaryData.ts.`);
        }
    } catch (parseErr) {
        console.warn("Warning: Failed to parse glossaryData.ts dynamically:", parseErr.message);
    }

    // Dynamically parse solutions pages from solutionsData.ts
    try {
        const solutionsPath = path.resolve('src/data/solutionsData.ts');
        if (fs.existsSync(solutionsPath)) {
            const content = fs.readFileSync(solutionsPath, 'utf8');
            const lines = content.split(/\r?\n/);
            let count = 0;
            lines.forEach(line => {
                const match = line.match(/^\s{4}slug:\s*['"]([^'"]+)['"]/);
                if (match) {
                    const slug = match[1];
                    entries.push({
                        loc: `${BASE_URL}/solutions/${slug}`,
                        priority: '0.9',
                        changefreq: 'weekly'
                    });
                    count++;
                }
            });
            console.log(`Parsed ${count} solution pages from solutionsData.ts.`);
        }
    } catch (parseErr) {
        console.warn("Warning: Failed to parse solutionsData.ts dynamically:", parseErr.message);
    }

    // Dynamically parse conquest pages from conquestData.ts
    try {
        const conquestPath = path.resolve('src/data/conquestData.ts');
        if (fs.existsSync(conquestPath)) {
            const content = fs.readFileSync(conquestPath, 'utf8');
            const lines = content.split(/\r?\n/);
            let count = 0;
            lines.forEach(line => {
                const match = line.match(/^\s{4}slug:\s*['"]([^'"]+)['"]/);
                if (match) {
                    const slug = match[1];
                    entries.push({
                        loc: `${BASE_URL}/docsend-alternative/${slug}`,
                        priority: '0.95',
                        changefreq: 'weekly'
                    });
                    count++;
                }
            });
            console.log(`Parsed ${count} conquest pages from conquestData.ts.`);
        }
    } catch (parseErr) {
        console.warn("Warning: Failed to parse conquestData.ts dynamically:", parseErr.message);
    }

    // Fetch dynamic custom templates from Supabase database
    if (supabaseUrl && supabaseKey) {
        try {
            console.log("Connecting to Supabase to fetch custom templates...");
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data: templates, error } = await supabase
                .from('document_templates')
                .select('id')
                .eq('is_system', false);

            if (error) {
                console.error("Warning: Failed to fetch database templates:", error.message);
            } else if (templates) {
                // Filter out UUID-based IDs — only include human-readable slugs
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                const slugTemplates = templates.filter(t => !uuidRegex.test(t.id));
                console.log(`Fetched ${templates.length} custom templates from database (${templates.length - slugTemplates.length} UUID-based entries filtered out).`);
                slugTemplates.forEach(t => {
                    entries.push({
                        loc: `${BASE_URL}/templates/${t.id}`,
                        priority: '0.8',
                        changefreq: 'weekly'
                    });
                });
            }
        } catch (dbErr) {
            console.error("Warning: Database connection failed:", dbErr.message);
        }
    } else {
        console.warn("Warning: Supabase credentials missing. Generating sitemap with static/programmatic templates only.");
    }

    // Deduplicate entries by loc
    const uniqueEntriesMap = new Map();
    entries.forEach(e => {
        uniqueEntriesMap.set(e.loc, e);
    });
    const uniqueEntries = Array.from(uniqueEntriesMap.values());

    // Compile XML
    const xmlUrlElements = uniqueEntries.map(entry => {
        return `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrlElements.join('\n')}
</urlset>`;

    try {
        const outputPath = path.resolve('public/sitemap.xml');
        fs.writeFileSync(outputPath, sitemapContent, 'utf8');
        console.log(`✅ Sitemap successfully written to: ${outputPath}`);
        console.log(`Total indexed pages: ${uniqueEntries.length}`);
    } catch (writeErr) {
        console.error("Error writing sitemap.xml:", writeErr.message);
        process.exit(1);
    }
}

generateSitemap();
