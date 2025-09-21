require('dotenv').config();
const videoValidationService = require('./services/videoValidationService');

async function testVideoValidation() {
  console.log('🧪 Testing Video Validation Service...\n');

  // Test 1: Search for validated JavaScript videos
  console.log('1️⃣ Testing validated search for JavaScript videos...');
  try {
    const result = await videoValidationService.searchValidVideos('javascript tutorial 2024', { maxResults: 5 });
    console.log(`✅ Found ${result.data.videos.length} validated videos`);
    
    if (result.data.videos.length > 0) {
      console.log('📺 First video:', {
        title: result.data.videos[0].title,
        url: result.data.videos[0].url,
        validated: result.data.videos[0].validated
      });
    }
  } catch (error) {
    console.log('❌ Search test failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Get skill-specific videos
  console.log('2️⃣ Testing skill-specific video search...');
  try {
    const skillResult = await videoValidationService.getValidatedSkillVideos('python', 'beginner');
    console.log(`✅ Found ${skillResult.data.videos.length} validated Python videos`);
    
    if (skillResult.data.videos.length > 0) {
      console.log('📺 Sample videos:');
      skillResult.data.videos.slice(0, 3).forEach((video, index) => {
        console.log(`   ${index + 1}. ${video.title}`);
        console.log(`      URL: ${video.url}`);
        console.log(`      Validated: ${video.validated ? '✅' : '❌'}`);
      });
    }
  } catch (error) {
    console.log('❌ Skill video test failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Validate a specific video (using a known good video ID)
  console.log('3️⃣ Testing individual video validation...');
  try {
    // Test with a known YouTube video ID (replace with actual ID if needed)
    const testVideoId = 'dQw4w9WgXcQ'; // Rick Roll - usually available
    const validation = await videoValidationService.validateVideo(testVideoId);
    
    console.log(`Video ID: ${testVideoId}`);
    console.log(`Valid: ${validation.isValid ? '✅' : '❌'}`);
    console.log(`Reason: ${validation.reason}`);
    
    if (validation.videoData) {
      console.log(`Title: ${validation.videoData.title}`);
    }
  } catch (error) {
    console.log('❌ Video validation test failed:', error.message);
  }

  console.log('\n🏁 Testing complete!');
}

// Run the test
testVideoValidation().catch(console.error);
