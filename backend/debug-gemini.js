// Debug Gemini integration
require('dotenv').config();
const geminiService = require('./services/geminiService');

async function debugGemini() {
  console.log('🔍 Debugging Gemini integration...');
  
  // Test 1: Check environment variables
  console.log('\n1. Environment Variables:');
  console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
  console.log('API Key length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
  
  // Test 2: Check service initialization
  console.log('\n2. Service Status:');
  console.log('Service has genAI instance:', !!geminiService.genAI);
  
  // Test 3: Try a simple message
  console.log('\n3. Testing message generation:');
  try {
    const response = await geminiService.generateResponse('Hello, what is 2+2?');
    console.log('Response type:', typeof response);
    console.log('Response confidence:', response.confidence);
    console.log('Response content preview:', response.content.substring(0, 100));
    console.log('Is this a mock response?', response.confidence < 0.9 ? 'YES' : 'NO');
  } catch (error) {
    console.error('Error during generation:', error.message);
  }
}

debugGemini();
