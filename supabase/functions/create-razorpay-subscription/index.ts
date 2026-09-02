import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Plan IDs mapping
const PLAN_IDS: Record<string, string> = {
    pro: Deno.env.get('RAZORPAY_PRO_PLAN_ID') || 'plan_TXFen0j8CaoC4o',
    standard: Deno.env.get('RAZORPAY_PRO_PLAN_ID') || 'plan_TXFen0j8CaoC4o',
    business: Deno.env.get('RAZORPAY_BUSINESS_PLAN_ID') || 'plan_TXFg28EWp7dw4C',
    dataroom: Deno.env.get('RAZORPAY_DATAROOM_PLAN_ID') || 'plan_TXFgoDrw5IBk6O',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { userId, planType, billingCycle = 'monthly', userEmail = '', userName = '', userPhone = '' } = await req.json();

        if (!userId || !planType) {
            throw new Error('Missing required parameters: userId and planType');
        }

        const resolvedPlanType = planType === 'standard' ? 'pro' : planType;
        const planId = PLAN_IDS[resolvedPlanType] || PLAN_IDS.pro;

        const keyId = Deno.env.get('RAZORPAY_KEY_ID') || 'rzp_live_TXFmzOIjNJwVht';
        const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

        console.log(`Creating Razorpay subscription for user ${userId}, phone ${userPhone}, plan ${resolvedPlanType} (${planId}), cycle ${billingCycle}`);

        // If secret is not yet configured in Supabase environment, return safe mock subscription for dev preview
        if (!keySecret) {
            console.warn("WARNING: RAZORPAY_KEY_SECRET is not set in Supabase Edge Function secrets. Returning sandbox subscription ID.");
            return new Response(
                JSON.stringify({
                    subscriptionId: `sub_simulated_${Date.now()}`,
                    planId: planId,
                    planType: resolvedPlanType,
                    keyId: keyId,
                    simulated: true
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                }
            );
        }

        // Call Razorpay API to create subscription
        const totalCount = billingCycle === 'annual' ? 5 : 60; // 5 years annual or 5 years monthly
        const credentials = btoa(`${keyId}:${keySecret}`);

        const resp = await fetch('https://api.razorpay.com/v1/subscriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                plan_id: planId,
                total_count: totalCount,
                quantity: 1,
                customer_notify: 1,
                notes: {
                    userId: userId,
                    planType: resolvedPlanType,
                    billingCycle: billingCycle,
                    userEmail: userEmail,
                    userName: userName,
                    userPhone: userPhone
                }
            })
        });

        if (!resp.ok) {
            const errData = await resp.json().catch(() => ({}));
            console.error("Razorpay subscription creation failed:", errData);
            throw new Error(errData?.error?.description || `Razorpay subscription creation failed: ${resp.statusText}`);
        }

        const data = await resp.json();
        console.log(`Razorpay subscription created successfully: ${data.id}`);

        return new Response(
            JSON.stringify({
                subscriptionId: data.id,
                planId: planId,
                planType: resolvedPlanType,
                keyId: keyId,
                shortUrl: data.short_url
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        );

    } catch (error: any) {
        console.error('Error in create-razorpay-subscription:', error);
        return new Response(
            JSON.stringify({ error: error.message || 'Internal Server Error' }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        );
    }
});
