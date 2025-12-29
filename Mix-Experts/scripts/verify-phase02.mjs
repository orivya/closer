import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyBuckets() {
  console.log('🔍 Verifying Phase 02 Storage Buckets...\n');

  const expectedBuckets = [
    { name: 'avatars', public: true },
    { name: 'banners', public: true },
    { name: 'portfolio-audio', public: true },
    { name: 'portfolio-images', public: true },
    { name: 'products', public: false },
    { name: 'product-previews', public: true },
    { name: 'order-files', public: false },
    { name: 'credit-logos', public: true }
  ];

  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error('❌ Error listing buckets:', error.message);
    return;
  }

  let allExist = true;

  for (const expected of expectedBuckets) {
    const found = buckets.find(b => b.name === expected.name);
    if (found) {
      const publicMatch = found.public === expected.public;
      if (publicMatch) {
        console.log(`✅ ${expected.name}: EXISTS (public: ${found.public})`);
      } else {
        console.log(`⚠️  ${expected.name}: EXISTS but public=${found.public} (expected ${expected.public})`);
      }
    } else {
      console.log(`❌ ${expected.name}: MISSING`);
      allExist = false;
    }
  }

  console.log('\n' + '='.repeat(50));
  if (allExist) {
    console.log('✅ All Phase 02 storage buckets created successfully!');
  } else {
    console.log('❌ Some buckets are missing. Check errors above.');
  }

  console.log('\n📋 All buckets in database:');
  buckets.forEach(b => {
    console.log(`   - ${b.name} (public: ${b.public})`);
  });
}

verifyBuckets();
