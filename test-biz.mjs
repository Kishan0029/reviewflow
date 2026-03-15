import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log("Checking businesses...");
  const { data, error } = await supabase.from('businesses').select('*');
  console.log("Businesses:", data, error);
}

run();
