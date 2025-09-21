// Fresh test of chat endpoint
require('dotenv').config();

// Import the service directly to test
const geminiService = require('./services/geminiService');

async function testChatService() {
  console.log('🧪 Testing Gemini service directly...');
  
  const testMessage = "What is JavaScript? Give me a short answer.";
  console.log('📤 Test message:', testMessage);
  
  try {
    const response = await geminiService.generateResponse(testMessage);
    
    console.log('\n✅ Service Response:');
    console.log('Content preview:', response.content.substring(0, 150) + '...');
    console.log('Confidence:', response.confidence);
    console.log('Sources:', response.sources);
    console.log('Timestamp:', response.timestamp);
    
    // Check if it's a real Gemini response
    if (response.confidence >= 0.95) {
      console.log('🎉 SUCCESS: This is a REAL Gemini AI response!');
    } else {
      console.log('⚠️ WARNING: This appears to be a mock response');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testChatService();
