import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ihxhbhkdwrdfexwbbhxo.supabase.co';
const supabaseKey = 'sb_publishable_jbmIQBJu9OnvYJ3l1ZewYA_7mPAcoCJ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubscriptions() {
    console.log("Fetching subscriptions from Supabase...");
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
            
        if (error) {
            console.error("Error fetching subscriptions:", error);
            return;
        }
        
        console.log(`Successfully fetched ${data.length} recent subscriptions:`);
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Catch error:", e);
    }
}

checkSubscriptions();
