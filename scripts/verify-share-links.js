/**
 * Verify Share Links — Post-Deployment Check
 * 
 * Run after deploying to Vercel to confirm that /view/ and /sign/ routes
 * properly serve the SPA instead of returning Vercel 404 errors.
 * 
 * Usage: node scripts/verify-share-links.js [base-url]
 * Example: node scripts/verify-share-links.js https://www.doctransfer.app
 */

const BASE_URL = process.argv[2] || 'https://www.doctransfer.app';

const TEST_PATHS = [
    '/view/test-link-123',
    '/view/abc',
    '/sign/test-signing-link',
    '/dataroom',
    '/pricing',
    '/checkout',
    '/settings',
    '/some-nonexistent-page',  // Should return SPA with React Router 404
];

async function verify() {
    console.log(`\n🔍 Verifying SPA routing on: ${BASE_URL}\n`);
    console.log('─'.repeat(60));

    let passed = 0;
    let failed = 0;

    for (const path of TEST_PATHS) {
        const url = `${BASE_URL}${path}`;
        try {
            const response = await fetch(url, { redirect: 'follow' });
            const html = await response.text();

            const status = response.status;
            const hasSpaRoot = html.includes('<div id="root">') || html.includes('id="root"');
            const isVercel404 = html.includes('NOT_FOUND') && html.includes('Code:');

            if (status === 200 && hasSpaRoot && !isVercel404) {
                console.log(`  ✅ ${path} → ${status} (SPA loaded)`);
                passed++;
            } else if (isVercel404) {
                console.log(`  ❌ ${path} → ${status} (Vercel 404 — SPA NOT reached)`);
                failed++;
            } else {
                console.log(`  ⚠️  ${path} → ${status} (Unexpected: hasSPA=${hasSpaRoot})`);
                failed++;
            }
        } catch (err) {
            console.log(`  ❌ ${path} → ERROR: ${err.message}`);
            failed++;
        }
    }

    console.log('─'.repeat(60));
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${TEST_PATHS.length} tests\n`);

    if (failed > 0) {
        console.log('⚠️  Some routes are still returning 404. Possible causes:');
        console.log('   1. Deployment hasn\'t completed yet — wait and retry');
        console.log('   2. vercel.json changes weren\'t included in the deployment');
        console.log('   3. Vercel environment variables (VITE_*) are missing\n');
        process.exit(1);
    } else {
        console.log('🎉 All routes are serving the SPA correctly!\n');
    }
}

verify();
