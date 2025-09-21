const { google } = require('googleapis');
require('dotenv').config();

async function testYouTubeAPI() {
  console.log('🎥 Testing YouTube API Connection...\n');

  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });

    console.log('API Key loaded:', process.env.YOUTUBE_API_KEY ? 'Yes' : 'No');
    console.log('API Key length:', process.env.YOUTUBE_API_KEY ? process.env.YOUTUBE_API_KEY.length : 0);

    // Test a simple search
    const response = await youtube.search.list({
      part: 'snippet',
      q: 'JavaScript tutorial',
      type: 'video',
      maxResults: 3,
      safeSearch: 'strict'
    });

    console.log('✅ YouTube API test successful!');
    console.log('Found videos:', response.data.items.length);
    
    if (response.data.items.length > 0) {
      console.log('\nFirst video:');
      console.log('Title:', response.data.items[0].snippet.title);
      console.log('Channel:', response.data.items[0].snippet.channelTitle);
      console.log('Video ID:', response.data.items[0].id.videoId);
    }

  } catch (error) {
    console.log('❌ YouTube API test failed:');
    console.log('Error:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Status Text:', error.response.statusText);
      console.log('Data:', error.response.data);
    }
  }
}

testYouTubeAPI();
