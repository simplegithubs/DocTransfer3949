import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { planType, userId } = await req.json();

        if (!planType || !userId) {
            throw new Error('Missing planType or userId');
        }

        if (planType !== 'standard' && planType !== 'business') {
            throw new Error('Invalid plan type for trial');
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

        // 1. Check if user already has a subscription
        const { data: existingSub, error: fetchError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }

        // 2. Prevent multiple trials if already used or currently in a paid plan
        if (existingSub) {
            if (existingSub.status === 'trialing') {
                throw new Error('You are already in a trial period.');
            }
            if (existingSub.status === 'active' && existingSub.plan_type !== 'free') {
                throw new Error('You already have an active paid subscription.');
            }
            // Optional: Check if they've had a trial before using a custom metadata or column
            // For now, we allow starting a trial if they are on 'free' plan
        }

        const trialDays = 7;
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + trialDays);

        const subData = {
            user_id: userId,
            plan_type: planType,
            status: 'trialing',
            trial_end: trialEnd.toISOString(),
            current_period_end: trialEnd.toISOString(),
            updated_at: new Date().toISOString()
        };

        let result;
        if (existingSub) {
            const { data, error: updateError } = await supabase
                .from('subscriptions')
                .update(subData)
                .eq('user_id', userId)
                .select()
                .single();
            if (updateError) throw updateError;
            result = data;
        } else {
            const { data, error: insertError } = await supabase
                .from('subscriptions')
                .insert(subData)
                .select()
                .single();
            if (insertError) throw insertError;
            result = data;
        }

        return new Response(
            JSON.stringify({ success: true, subscription: result }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        );

    } catch (error: any) {
        console.error('Error in start-free-trial:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        );
    }
});
