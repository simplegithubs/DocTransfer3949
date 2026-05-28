import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { userId, planType, paypalToken } = await req.json();

        if (!userId || !planType || !paypalToken) {
            throw new Error('Missing userId, planType, or paypalToken parameters');
        }

        console.log(`Verifying PayPal payment for user ${userId} to plan ${planType} with token ${paypalToken}`);

        // Fetch PayPal credentials from environment
        const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
        const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
        const mode = Deno.env.get('PAYPAL_MODE') || 'sandbox'; // 'sandbox' or 'live'
        const isSandbox = mode !== 'live';

        let isVerified = false;

        if (!clientId || !clientSecret) {
            console.warn("WARNING: PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET is missing. Skipping external PayPal API verification for local development.");
            // If they are missing, we default to verified for local development convenience but log it.
            isVerified = true;
        } else {
            try {
                // Get PayPal Access Token
                const base = isSandbox ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
                const credentials = btoa(`${clientId}:${clientSecret}`);
                const tokenResp = await fetch(`${base}/v1/oauth2/token`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Basic ${credentials}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "grant_type=client_credentials"
                });

                if (!tokenResp.ok) {
                    throw new Error(`PayPal authentication failed: ${tokenResp.statusText}`);
                }

                const tokenData = await tokenResp.json();
                const accessToken = tokenData.access_token;

                // Determine if token is a subscription (starts with I-) or an order
                if (paypalToken.startsWith('I-')) {
                    // Verify subscription
                    const subResp = await fetch(`${base}/v1/billing/subscriptions/${paypalToken}`, {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (!subResp.ok) {
                        throw new Error(`Failed to fetch subscription status: ${subResp.statusText}`);
                    }

                    const subData = await subResp.json();
                    console.log(`PayPal Subscription Status: ${subData.status}`);
                    
                    // Subscription status must be 'ACTIVE'
                    isVerified = subData.status === 'ACTIVE';
                } else {
                    // Verify order/payment
                    const orderResp = await fetch(`${base}/v2/checkout/orders/${paypalToken}`, {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (orderResp.ok) {
                        const orderData = await orderResp.json();
                        console.log(`PayPal Order Status: ${orderData.status}`);
                        isVerified = orderData.status === 'COMPLETED' || orderData.status === 'APPROVED';
                    } else {
                        // Fallback to checking as a payment execution / capture
                        const paymentResp = await fetch(`${base}/v1/payments/payment/${paypalToken}`, {
                            headers: {
                                "Authorization": `Bearer ${accessToken}`,
                                "Content-Type": "application/json"
                            }
                        });
                        
                        if (paymentResp.ok) {
                            const paymentData = await paymentResp.json();
                            console.log(`PayPal Payment State: ${paymentData.state}`);
                            isVerified = paymentData.state === 'approved';
                        } else {
                            throw new Error(`Failed to fetch order/payment status from PayPal`);
                        }
                    }
                }
            } catch (err: any) {
                console.error("PayPal API Verification Error:", err);
                throw new Error(`PayPal payment verification failed: ${err.message}`);
            }
        }

        if (!isVerified) {
            throw new Error(`PayPal payment verification failed. The transaction or subscription is not active/completed.`);
        }

        // Update database using Supabase client with service role
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Calculate 30 days from now for subscription expiry
        const subscriptionEndDate = new Date();
        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);
        const periodEndISO = subscriptionEndDate.toISOString();
        const periodStartISO = new Date().toISOString();

        // 1. Update/Insert into subscriptions table
        const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (existingSub) {
            const { error: subError } = await supabase
                .from('subscriptions')
                .update({
                    plan_type: planType, // 'business' or 'standard'
                    status: 'active',
                    stripe_subscription_id: paypalToken, // Enforce transaction uniqueness
                    current_period_start: periodStartISO,
                    current_period_end: periodEndISO,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);
            if (subError) throw subError;
        } else {
            const { error: subError } = await supabase
                .from('subscriptions')
                .insert({
                    user_id: userId,
                    plan_type: planType,
                    status: 'active',
                    stripe_subscription_id: paypalToken, // Enforce transaction uniqueness
                    current_period_start: periodStartISO,
                    current_period_end: periodEndISO,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            if (subError) throw subError;
        }

        // 2. Update profiles table (Legacy/Profile display)
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                tier: planType,
                subscription_status: 'active',
                subscription_end_date: periodEndISO,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (profileError) {
            console.error('Error updating profile:', profileError);
        }

        return new Response(
            JSON.stringify({ success: true, message: "PayPal Subscription activated successfully" }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        );

    } catch (error: any) {
        console.error('Error in verify-paypal-subscription:', error);
        return new Response(
            JSON.stringify({
                error: error.message || 'Activation failed',
                details: error
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        );
    }
});
