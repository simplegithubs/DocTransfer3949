import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Razorpay from "npm:razorpay@2.9.2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { planType, userId } = await req.json();

        if (!planType || !userId) {
            throw new Error('Missing planType or userId');
        }

        // Map plan types to their respective Razorpay subscription Plan IDs
        let planId = "";
        if (planType === 'standard') {
            planId = "plan_SqmcmZgCXax642"; // $25 standard plan
        } else if (planType === 'business') {
            planId = "plan_Sqmdi8LRlGTkeF"; // $39 business plan
        } else {
            throw new Error('Invalid plan type. Must be standard or business');
        }

        const key_id = Deno.env.get('RAZORPAY_KEY_ID') || Deno.env.get('VITE_RAZORPAY_KEY_ID') || 'rzp_live_Sqmswzj0yq1x8N';
        const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';

        if (!key_secret) {
            throw new Error('Missing Razorpay API Key Secret in Server Environment');
        }

        const instance = new Razorpay({
            key_id,
            key_secret,
        });

        // Set total_count to a high number (e.g. 120 months / 10 years of recurring billing)
        const subscriptionOptions = {
            plan_id: planId,
            total_count: 120, 
            quantity: 1,
            customer_notify: 1,
            notes: {
                userId: userId,
                planType: planType
            }
        };

        console.log(`Creating Razorpay subscription for user ${userId} with plan ${planType} (${planId})`);
        
        const subscription = await instance.subscriptions.create(subscriptionOptions);

        return new Response(
            JSON.stringify(subscription),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        );

    } catch (error: any) {
        console.error('Error in create-razorpay-subscription:', error);

        // Razorpay SDK error descriptions are often inside error.error.description or error.description
        const razorpayErrorDescription = error.error?.description || error.description || error.message || 'An internal server error occurred';

        return new Response(
            JSON.stringify({
                error: razorpayErrorDescription,
                details: error
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        );
    }
});
