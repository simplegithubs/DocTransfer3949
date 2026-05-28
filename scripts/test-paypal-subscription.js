const SC_URL = 'https://ihxhbhkdwrdfexwbbhxo.supabase.co';
const ANON_KEY = 'sb_publishable_jbmIQBJu9OnvYJ3l1ZewYA_7mPAcoCJ';

async function testPaypalSubscription() {
    console.log("Testing verify-paypal-subscription edge function...");
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
                userId: testUserId
            })
        });

        const status = response.status;
        const text = await response.text();
        console.log("\n--- Verification Results ---");
        console.log("Response Status:", status);
        console.log("Response Body:", text);
        
        if (status === 200) {
            console.log("\n✅ SUCCESS! The Edge Function successfully verified/activated the PayPal subscription!");
            
            // Now verify by querying the database using the anon client
            // Note: Users can view their own subscription if they are authenticated, 
            // but since we are using anon client without authentication, let's see if we can read it.
            // Wait, standard RLS allows select for `user_id = auth.uid()::text`. 
            // Since we are anonymous, let's see if the RPC or standard query works, or if we get an error.
            // If the write succeeded, it should be in the DB.
        } else {
            console.log("\n❌ FAILED: Edge Function responded with error.");
        }
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testPaypalSubscription();
