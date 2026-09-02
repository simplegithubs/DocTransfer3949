import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyHmacSha256(secret: string, data: string, signature: string): Promise<boolean> {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(data)
    );
    const generated = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    return generated.toLowerCase() === signature.toLowerCase();
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const {
            userId,
            planType,
            billingCycle = 'monthly',
            razorpayPaymentId,
            razorpaySubscriptionId,
            razorpayOrderId,
            razorpaySignature
        } = await req.json();

        if (!userId || !planType || !razorpayPaymentId) {
            throw new Error('Missing required verification parameters: userId, planType, or razorpayPaymentId');
        }

        console.log(`Verifying Razorpay payment for user ${userId}, plan ${planType}, paymentId: ${razorpayPaymentId}`);

        const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
        let isValid = false;

        if (!keySecret) {
            console.warn("WARNING: RAZORPAY_KEY_SECRET not set in Supabase Edge Function secrets. Bypassing external signature check for development.");
            isValid = true;
        } else if (razorpaySignature) {
            // Subscription signature verification: payment_id + "|" + subscription_id
            if (razorpaySubscriptionId) {
                const dataToSign = `${razorpayPaymentId}|${razorpaySubscriptionId}`;
                isValid = await verifyHmacSha256(keySecret, dataToSign, razorpaySignature);
            } 
            // Order signature verification: order_id + "|" + payment_id
            else if (razorpayOrderId) {
                const dataToSign = `${razorpayOrderId}|${razorpayPaymentId}`;
                isValid = await verifyHmacSha256(keySecret, dataToSign, razorpaySignature);
            }
        }

        if (!isValid) {
            throw new Error('Razorpay signature verification failed. Invalid transaction signature.');
        }

        // Initialize Supabase admin client
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Normalize planType: map legacy standard to pro
        const resolvedPlan = planType === 'standard' ? 'pro' : planType;

        // Calculate subscription period: 365 days if annual/yearly, 30 days if monthly
        const isAnnual = billingCycle === 'annual' || billingCycle === 'yearly';
        const days = isAnnual ? 365 : 30;
        const durationText = isAnnual ? '1 Year' : '1 Month';

        const subscriptionEndDate = new Date();
        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + days);

        const periodStartISO = new Date().toISOString();
        const periodEndISO = subscriptionEndDate.toISOString();
        const transactionRef = razorpaySubscriptionId || razorpayPaymentId;

        // 1. Update or Insert into subscriptions table
        const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (existingSub) {
            const { error: subError } = await supabase
                .from('subscriptions')
                .update({
                    plan_type: resolvedPlan,
                    status: 'active',
                    stripe_subscription_id: transactionRef,
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
                    plan_type: resolvedPlan,
                    status: 'active',
                    stripe_subscription_id: transactionRef,
                    current_period_start: periodStartISO,
                    current_period_end: periodEndISO,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            if (subError) throw subError;
        }

        // 2. Update profiles table
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                tier: resolvedPlan,
                subscription_status: 'active',
                subscription_end_date: periodEndISO,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (profileError) {
            console.error('Error updating user profile tier:', profileError);
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: `Razorpay ${resolvedPlan} subscription activated successfully for ${durationText}`,
                planType: resolvedPlan,
                duration: durationText,
                days: days,
                currentPeriodStart: periodStartISO,
                currentPeriodEnd: periodEndISO
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        );

    } catch (error: any) {
        console.error('Error in verify-razorpay-payment:', error);
        return new Response(
            JSON.stringify({ error: error.message || 'Payment verification failed' }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        );
    }
});
