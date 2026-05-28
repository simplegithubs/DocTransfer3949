const SC_URL = 'https://ihxhbhkdwrdfexwbbhxo.supabase.co';
const ANON_KEY = 'sb_publishable_jbmIQBJu9OnvYJ3l1ZewYA_7mPAcoCJ';

async function testSubscription() {
    console.log("Testing create-razorpay-subscription edge function...");
    try {
        const response = await fetch(`${SC_URL}/functions/v1/create-razorpay-subscription`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                planType: 'standard',
                userId: 'test_validation_user'
            })
        });

        const status = response.status;
        const text = await response.text();
        console.log("\n--- Verification Results ---");
        console.log("Response Status:", status);
        console.log("Response Body:", text);
        
        if (status === 200) {
            console.log("\n✅ SUCCESS! The Edge Function successfully created a subscription with Razorpay!");
        } else if (text.includes("Missing Razorpay API Key Secret")) {
            console.log("\n❌ FAILED: The Edge Function is still missing the RAZORPAY_KEY_SECRET environment variable.");
        } else {
            console.log("\n⚠️ Edge Function responded, check details above.");
        }
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testSubscription();
