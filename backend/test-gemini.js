// Test script for Gemini integration
require('dotenv').config();
const geminiService = require('./services/geminiService');

async function testGeminiIntegration() {
  console.log('🧞‍♂️ Testing Gemini AI Integration for SkillGenie...\n');

  const testMessages = [
    'How do I learn Python for data science?',
    'What is machine learning?',
    'Can you explain gradient descent?',
    'What career advice do you have for a beginner in data science?'
  ];

  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    console.log(`📤 Test ${i + 1}: "${message}"`);
    console.log('⏳ Generating response...\n');

    try {
      const response = await geminiService.generateResponse(message);
      
      console.log('✅ Response received:');
      console.log('📝 Content:', response.content.substring(0, 200) + '...');
      console.log('🎯 Confidence:', response.confidence);
      console.log('📚 Sources:', response.sources.join(', '));
      console.log('⏰ Timestamp:', response.timestamp.toISOString());
      console.log('\n' + '='.repeat(80) + '\n');
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      console.log('\n' + '='.repeat(80) + '\n');
    }
  }

  // Test suggestions
  console.log('🔍 Testing suggestion generation...');
  try {
    const suggestions = await geminiService.generateSuggestions();
    console.log('✅ Suggestions generated:');
    suggestions.forEach((category, index) => {
      console.log(`${index + 1}. ${category.category}:`);
      category.questions.forEach((question, qIndex) => {
        console.log(`   ${qIndex + 1}. ${question}`);
      });
    });
  } catch (error) {
    console.error('❌ Suggestions error:', error.message);
  }

  console.log('\n🎉 Gemini integration test completed!');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('\n⚠️  Note: No GEMINI_API_KEY found in environment variables.');
    console.log('   The service is using mock responses as fallback.');
    console.log('   To use real Gemini AI, set your API key in the .env file.');
  }
}

testGeminiIntegration().catch(console.error);
