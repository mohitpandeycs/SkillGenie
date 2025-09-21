require('dotenv').config();
const googleSearchService = require('./services/googleSearchService');

async function testGoogleSearch() {
  console.log('🔍 Testing Google Search API Configuration...\n');

  // Check API credentials
  console.log('📋 API Configuration:');
  console.log(`GOOGLE_SEARCH_API_KEY: ${process.env.GOOGLE_SEARCH_API_KEY ? '✅ Found' : '❌ Missing'}`);
  console.log(`GOOGLE_SEARCH_ENGINE_ID: ${process.env.GOOGLE_SEARCH_ENGINE_ID ? '✅ Found' : '❌ Missing'}`);
  
  if (process.env.GOOGLE_SEARCH_API_KEY) {
    console.log(`API Key Preview: ${process.env.GOOGLE_SEARCH_API_KEY.substring(0, 10)}...`);
  }
  
  if (process.env.GOOGLE_SEARCH_ENGINE_ID) {
    console.log(`Search Engine ID: ${process.env.GOOGLE_SEARCH_ENGINE_ID}`);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test actual search functionality
  console.log('🧪 Testing Search Functionality...');
  
  try {
    const testQuery = 'javascript developer salary 2024';
    console.log(`🔍 Searching for: "${testQuery}"`);
    
    const startTime = Date.now();
    const searchResults = await googleSearchService.searchMarketData(testQuery, { num: 5 });
    const endTime = Date.now();
    
    console.log(`⏱️ Search completed in ${endTime - startTime}ms`);
    console.log(`📊 Total Results: ${searchResults.totalResults}`);
    console.log(`🔍 Search Time: ${searchResults.searchTime}s`);
    console.log(`📄 Items Retrieved: ${searchResults.items.length}`);
    
    if (searchResults.items.length > 0) {
      console.log('\n📋 Sample Results:');
      searchResults.items.slice(0, 3).forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.title}`);
        console.log(`   🔗 ${item.link}`);
        console.log(`   📝 ${item.snippet.substring(0, 100)}...`);
        console.log(`   🏢 Source: ${item.source}`);
      });
    }
    
    // Check if this is real data or mock data
    if (searchResults.totalResults > 0 && searchResults.items.length > 0) {
      console.log('\n✅ Google Search API is working with REAL data!');
    } else {
      console.log('\n⚠️ Got results but might be mock data');
    }
    
  } catch (error) {
    console.log(`❌ Search test failed: ${error.message}`);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if GOOGLE_SEARCH_API_KEY is valid');
    console.log('   2. Check if GOOGLE_SEARCH_ENGINE_ID is correct');
    console.log('   3. Verify API quotas haven\'t been exceeded');
    console.log('   4. Ensure Custom Search API is enabled in Google Cloud');
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test the search service constructor
  console.log('🔧 Service Configuration Test:');
  try {
    console.log(`Service API Key: ${googleSearchService.apiKey ? '✅ Loaded' : '❌ Not loaded'}`);
    console.log(`Service Engine ID: ${googleSearchService.searchEngineId ? '✅ Loaded' : '❌ Not loaded'}`);
    console.log(`Base URL: ${googleSearchService.baseUrl}`);
  } catch (error) {
    console.log(`❌ Service configuration error: ${error.message}`);
  }

  console.log('\n🏁 Google Search Test Complete!');
}

// Run the test
testGoogleSearch().catch(console.error);
