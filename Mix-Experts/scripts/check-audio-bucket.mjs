import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAudioBucket() {
  console.log('🔍 Checking old "audio" bucket...\n');

  const { data: files, error } = await supabase.storage
    .from('audio')
    .list('', { limit: 100 });

  if (error) {
    console.log('❌ Error listing files:', error.message);
    return;
  }

  if (files && files.length > 0) {
    console.log(`⚠️  Found ${files.length} file(s) in "audio" bucket:`);
    files.forEach(f => console.log(`   - ${f.name}`));
    console.log('\n⚠️  You may want to migrate these files before deleting the bucket.');
  } else {
    console.log('✅ "audio" bucket is empty - safe to delete.');
  }
}

checkAudioBucket();
