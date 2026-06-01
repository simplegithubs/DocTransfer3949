const SC_URL = 'https://ihxhbhkdwrdfexwbbhxo.supabase.co';
const ANON_KEY = 'sb_publishable_jbmIQBJu9OnvYJ3l1ZewYA_7mPAcoCJ';

async function testPaypalSubscriptionLive() {
    console.log("Testing verify-paypal-subscription edge function with paypalToken...");
    const testUserId = 'test_paypal_validation_user_' + Date.now();
    try {
        const response = await fetch(`${SC_URL}/functions/v1/verify-paypal-subscription`, {
            method: 'POST',
            headers: {
                'apikey': ANON_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                planType: 'business',
                userId: testUserId,
                paypalToken: 'I-TESTTOKEN12345'
            })
        });

        const status = response.status;
        const text = await response.text();
        console.log("\n--- Verification Results ---");
        console.log("Response Status:", status);
        console.log("Response Body:", text);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testPaypalSubscriptionLive();
