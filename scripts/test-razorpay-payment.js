/**
 * Test script for Razorpay subscription creation and verification endpoints
 */
const SC_URL = 'https://ihxhbhkdwrdfexwbbhxo.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGhiaGtkd3JkZmV4d2JiaHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NDg1MjksImV4cCI6MjA5MzAyNDUyOX0.M4gaysd6zLC0FinjvSOkMssIT3wq7wGx0bpf8zBhjvQ';

async function testRazorpayEndpoints() {
    console.log("=== Testing Razorpay Integration Contract ===");
    const testUserId = 'test_razorpay_user_' + Date.now();

    // 1. Test Subscription Creation
    console.log("\n1. Testing create-razorpay-subscription edge function...");
    try {
        const createResp = await fetch(`${SC_URL}/functions/v1/create-razorpay-subscription`, {
            method: 'POST',
            headers: {
                'apikey': ANON_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: testUserId,
                planType: 'pro',
                billingCycle: 'monthly',
                userEmail: 'test@example.com',
                userName: 'Test Founder'
            })
        });

        console.log("Create Subscription Status:", createResp.status);
        const createData = await createResp.text();
        console.log("Create Subscription Body:", createData);
    } catch (e) {
        console.error("Subscription create test error:", e);
    }

    // 2. Test Payment Verification
    console.log("\n2. Testing verify-razorpay-payment edge function...");
    try {
        const verifyResp = await fetch(`${SC_URL}/functions/v1/verify-razorpay-payment`, {
            method: 'POST',
            headers: {
                'apikey': ANON_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: testUserId,
                planType: 'pro',
                billingCycle: 'monthly',
                razorpayPaymentId: 'pay_test_' + Date.now(),
                razorpaySubscriptionId: 'sub_test_' + Date.now(),
                razorpaySignature: 'simulated_signature'
            })
        });

        console.log("Verify Payment Status:", verifyResp.status);
        const verifyData = await verifyResp.text();
        console.log("Verify Payment Body:", verifyData);
    } catch (e) {
        console.error("Payment verify test error:", e);
    }
}

testRazorpayEndpoints();
