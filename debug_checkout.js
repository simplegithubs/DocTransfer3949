
import fs from 'fs';
import path from 'path';

// Removed require since Node 22 has global fetch
async function run() {
    // Parse .env manually from workspace
    const envPath = path.resolve('.env');
    const env = {};
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split(/\r?\n/).forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
                if (key && val) {
                    env[key] = val;
                }
            }
        });
    }

    const supabaseUrl = env.VITE_SUPABASE_URL;
    const anonKey = env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
        console.error("Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env!");
        process.exit(1);
    }

    const url = `${supabaseUrl}/functions/v1/create-checkout-session`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${anonKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                priceId: "price_1SgyE83Cjm2NVorHaMQTmC0T",
                userId: "test-user",
                planType: "standard"
            })
        });

        const status = response.status;
        const text = await response.text();

        console.log(`Status: ${status}`);
        console.log(`Body: ${text}`);
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
