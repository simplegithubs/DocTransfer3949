import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    console.log("=== Analytics Diagnostics ===");
    
    // 1. Check daily_document_stats
    console.log("\nChecking daily_document_stats view...");
    const { data: daily, error: dailyErr } = await supabase
        .from('daily_document_stats')
        .select('*')
        .limit(5);
    
    if (dailyErr) {
        console.error("❌ daily_document_stats error:", dailyErr.message);
    } else {
        console.log("✅ daily_document_stats rows:", daily?.length || 0);
    }

    // 2. Check document_access_sessions
    console.log("\nChecking document_access_sessions table...");
    const { data: sessions, error: sessionErr } = await supabase
        .from('document_access_sessions')
        .select('*')
        .limit(5);
    
    if (sessionErr) {
        console.error("❌ document_access_sessions error:", sessionErr.message);
    } else {
        console.log("✅ document_access_sessions rows:", sessions?.length || 0);
    }

    // 3. Check document_downloads
    console.log("\nChecking document_downloads table...");
    const { data: downloads, error: dlErr } = await supabase
        .from('document_downloads')
        .select('*')
        .limit(5);
    
    if (dlErr) {
        console.error("❌ document_downloads error:", dlErr.message);
    } else {
        console.log("✅ document_downloads rows:", downloads?.length || 0);
    }
}

check();
