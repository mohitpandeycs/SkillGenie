const youtubeService = require('./services/youtubeService');
require('dotenv').config();

async function testYouTubeIntegration() {
  console.log('🎥 Testing YouTube Integration...\n');

  // Test 1: Basic video search
  console.log('1. Testing basic video search...');
  try {
    const searchResult = await youtubeService.searchVideos('JavaScript tutorial', {
      maxResults: 5
    });
    
    if (searchResult.success) {
      console.log('✅ Search successful!');
      console.log(`Found ${searchResult.data.videos.length} videos`);
      console.log('First video:', searchResult.data.videos[0]?.title);
    } else {
      console.log('❌ Search failed:', searchResult.error);
    }
  } catch (error) {
    console.log('❌ Search error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Skill recommendations
  console.log('2. Testing skill recommendations...');
  try {
    const skillResult = await youtubeService.getSkillRecommendations('Python', 'beginner');
    
    if (skillResult.success) {
      console.log('✅ Skill recommendations successful!');
      console.log(`Found ${skillResult.data.recommendations.length} recommendations`);
      console.log('Skills:', skillResult.data.skill, 'Level:', skillResult.data.level);
    } else {
      console.log('❌ Skill recommendations failed:', skillResult.error);
    }
  } catch (error) {
    console.log('❌ Skill recommendations error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Trending educational videos
  console.log('3. Testing trending educational videos...');
  try {
    const trendingResult = await youtubeService.getTrendingEducationalVideos('technology');
    
    if (trendingResult.success) {
      console.log('✅ Trending videos successful!');
      console.log(`Found ${trendingResult.data.trendingVideos.length} trending videos`);
      console.log('Category:', trendingResult.data.category);
    } else {
      console.log('❌ Trending videos failed:', trendingResult.error);
    }
  } catch (error) {
    console.log('❌ Trending videos error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: Privacy settings
  console.log('4. Testing privacy settings...');
  try {
    const privacySettings = youtubeService.getPrivacySettings();
    console.log('✅ Privacy settings retrieved!');
    console.log('Safe Search:', privacySettings.safeSearch);
    console.log('Region Code:', privacySettings.regionCode);
    console.log('Max Results:', privacySettings.maxResults);
  } catch (error) {
    console.log('❌ Privacy settings error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 5: Search with privacy options
  console.log('5. Testing search with privacy options...');
  try {
    const privacySearchResult = await youtubeService.searchVideos('React tutorial', {
      maxResults: 3
    }, {
      safeSearch: 'strict',
      regionCode: 'US',
      videoDuration: 'medium'
    });
    
    if (privacySearchResult.success) {
      console.log('✅ Privacy search successful!');
      console.log(`Found ${privacySearchResult.data.videos.length} videos with privacy controls`);
      console.log('Privacy Settings Applied:', privacySearchResult.data.privacySettings);
    } else {
      console.log('❌ Privacy search failed:', privacySearchResult.error);
    }
  } catch (error) {
    console.log('❌ Privacy search error:', error.message);
  }

  console.log('\n🎉 YouTube integration testing completed!');
}

// Run the test
if (require.main === module) {
  testYouTubeIntegration().catch(console.error);
}

module.exports = testYouTubeIntegration;
