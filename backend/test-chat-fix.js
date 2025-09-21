require('dotenv').config();
const enhancedGeminiAnalyst = require('./services/enhancedGeminiAnalyst');

async function testChatFix() {
  console.log('🧪 Testing Chat Fix - No More Data Science Bias!\n');

  // Test 1: General physics question (should NOT mention data science)
  console.log('1️⃣ Testing physics question without skill context...');
  try {
    const physicsContext = {
      skill: null, // No specific skill context
      currentChapter: null,
      progress: null
    };
    
    const physicsResponse = await enhancedGeminiAnalyst.mentorChat('what is physics', physicsContext);
    console.log('✅ Physics response generated');
    console.log('📝 Response preview:', physicsResponse.message?.substring(0, 200) + '...');
    
    // Check if it mentions data science (it shouldn't)
    const mentionsDataScience = physicsResponse.message?.toLowerCase().includes('data science');
    console.log(`🔍 Mentions Data Science: ${mentionsDataScience ? '❌ YES (PROBLEM!)' : '✅ NO (GOOD!)'}`);
    
  } catch (error) {
    console.log('❌ Physics test failed:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2: Data science question with proper context (should mention data science)
  console.log('2️⃣ Testing data science question WITH skill context...');
  try {
    const dsContext = {
      skill: 'Data Science',
      currentChapter: 'Chapter 1',
      progress: 25
    };
    
    const dsResponse = await enhancedGeminiAnalyst.mentorChat('what is machine learning', dsContext);
    console.log('✅ Data Science response generated');
    console.log('📝 Response preview:', dsResponse.message?.substring(0, 200) + '...');
    
    // Check if it properly uses the data science context
    const mentionsDataScience = dsResponse.message?.toLowerCase().includes('data science');
    console.log(`🔍 Mentions Data Science: ${mentionsDataScience ? '✅ YES (GOOD!)' : '❌ NO (PROBLEM!)'}`);
    
  } catch (error) {
    console.log('❌ Data Science test failed:', error.message);
  }

  console.log('\n🏁 Chat Fix Test Complete!');
  console.log('\n💡 Expected Results:');
  console.log('   ✅ Physics question should NOT be forced into data science context');
  console.log('   ✅ Data science question should properly use data science context');
  console.log('   ✅ Chat should be contextually appropriate to the actual question');
}

// Run the test
testChatFix().catch(console.error);
