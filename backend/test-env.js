require('dotenv').config();

console.log('Environment Variables Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('YOUTUBE_API_KEY exists:', !!process.env.YOUTUBE_API_KEY);
console.log('YOUTUBE_API_KEY length:', process.env.YOUTUBE_API_KEY ? process.env.YOUTUBE_API_KEY.length : 0);
console.log('YOUTUBE_API_KEY first 10 chars:', process.env.YOUTUBE_API_KEY ? process.env.YOUTUBE_API_KEY.substring(0, 10) + '...' : 'Not found');

if (!process.env.YOUTUBE_API_KEY) {
  console.log('\n❌ YOUTUBE_API_KEY is not set in environment variables!');
  console.log('Please add it to your .env file:');
  console.log('YOUTUBE_API_KEY=your-youtube-api-key-here');
} else {
  console.log('\n✅ YOUTUBE_API_KEY is properly loaded');
}
