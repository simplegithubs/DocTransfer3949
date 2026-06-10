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
        const { userId, planType } = await req.json();

        if (!userId || !planType || (planType !== 'standard' && planType !== 'business')) {
            throw new Error('Missing or invalid userId or planType parameters');
        }

        console.log(`Starting free trial for user ${userId} on plan ${planType}`);

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Check if user already has a subscription
        const { data: existingSub, error: fetchError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }

        // Prevent multiple trials if they've already had one or have an active plan
        if (existingSub) {
            if (existingSub.status === 'active' && (existingSub.plan_type === 'standard' || existingSub.plan_type === 'business')) {
                throw new Error('User already has an active paid subscription.');
            }
            if (existingSub.trial_end) {
                 // Even if they are 'free' now, if trial_end is set, they've used their trial.
                 throw new Error('User has already used their free trial.');
            }
        }

        // Calculate 14 days from now
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 14);
        const trialEndISO = trialEndDate.toISOString();
        const periodStartISO = new Date().toISOString();

        if (existingSub) {
            const { error: subError } = await supabase
                .from('subscriptions')
                .update({
                    plan_type: planType,
                    status: 'trialing',
                    trial_end: trialEndISO,
                    current_period_start: periodStartISO,
                    current_period_end: trialEndISO, // Align period end with trial end for now
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
                    status: 'trialing',
                    trial_end: trialEndISO,
                    current_period_start: periodStartISO,
                    current_period_end: trialEndISO,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            if (subError) throw subError;
        }

        // Update profiles table if it exists (for legacy/UI usage)
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                tier: planType,
                subscription_status: 'trialing',
                subscription_end_date: trialEndISO,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error updating profile:', profileError);
        }

        return new Response(
            JSON.stringify({ 
                success: true, 
                message: "Free trial activated successfully",
                trial_end: trialEndISO 
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        );

    } catch (error: any) {
        console.error('Error in start-free-trial:', error);
        return new Response(
            JSON.stringify({
                error: error.message || 'Trial activation failed',
                details: error
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        );
    }
});
