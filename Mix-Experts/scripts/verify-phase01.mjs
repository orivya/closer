import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Run with:');
  console.error('source .env.local && node scripts/verify-phase01.mjs');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyTables() {
  console.log('🔍 Verifying Phase 01 Database Tables...\n');

  const tables = [
    'profiles',
    'social_links',
    'portfolio_items',
    'services',
    'service_addons',
    'turnaround_options',
    'products',
    'orders',
    'order_files',
    'product_purchases',
    'messages',
    'testimonials',
    'credits',
    'subscriptions',
    'analytics_events'
  ];

  let allExist = true;

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(0);
      if (error) {
        console.log(`❌ ${table}: ERROR - ${error.message}`);
        allExist = false;
      } else {
        console.log(`✅ ${table}: EXISTS`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ERROR - ${err.message}`);
      allExist = false;
    }
  }

  console.log('\n' + '='.repeat(50));
  if (allExist) {
    console.log('✅ All Phase 01 tables created successfully!');
  } else {
    console.log('❌ Some tables are missing. Check errors above.');
  }
}

verifyTables();
