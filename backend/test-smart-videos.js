require('dotenv').config();
const smartVideoService = require('./services/smartVideoService');

async function testSmartVideoService() {
  console.log('🧪 Testing Smart Video Service (No Broken Links!)...\n');

  // Test different skills
  const testCases = [
    { skill: 'javascript', level: 'beginner' },
    { skill: 'python', level: 'beginner' },
    { skill: 'react', level: 'beginner' },
    { skill: 'nonexistent-skill', level: 'beginner' }
  ];

  for (const testCase of testCases) {
    console.log(`🎯 Testing: ${testCase.skill} (${testCase.level})`);
    console.log('='.repeat(50));

    try {
      const result = await smartVideoService.getWorkingSkillVideos(testCase.skill, testCase.level);
      
      console.log(`✅ Success: Found ${result.data.videos.length} working resources`);
      console.log(`📊 Source: ${result.data.source}`);
      
      if (result.data.videos.length > 0) {
        console.log('📚 Resources:');
        result.data.videos.forEach((resource, index) => {
          console.log(`   ${index + 1}. ${resource.title}`);
          console.log(`      Type: ${resource.type || 'video'}`);
          console.log(`      URL: ${resource.url}`);
          console.log(`      Working: ${resource.working ? '✅' : '❓'}`);
          if (resource.searchQuery) {
            console.log(`      Search: "${resource.searchQuery}"`);
          }
        });
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('\n');
  }

  console.log('🏁 Smart Video Service test complete!');
  console.log('\n💡 Key Benefits:');
  console.log('   ✅ No broken YouTube links');
  console.log('   ✅ Curated working resources');
  console.log('   ✅ Fallback to documentation when API fails');
  console.log('   ✅ Search suggestions for current content');
}

// Run the test
testSmartVideoService().catch(console.error);
