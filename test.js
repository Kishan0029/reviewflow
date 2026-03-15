require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log("Checking locations...");
  const { data, error } = await supabase.from('locations').select('*');
  console.log("Locations:", data, error);
}

run();
