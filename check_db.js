import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    console.log("Fetching documents...");
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('storage_type', 'google_drive')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Last 5 Google Drive links:");
        data.forEach(d => {
            console.log(`- ID: ${d.id}, Name: ${d.name}, email_verif: ${d.email_verification}, allowed: ${d.allowed_email}, user_id: ${d.user_id}`);
        });
    }
}
check();
