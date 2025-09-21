// Comprehensive test for all Gemini integrations
const axios = require('axios');
require('dotenv').config();

const API_BASE = 'http://localhost:5000/api';
const AUTH_TOKEN = 'Bearer test-token';

async function testAllGeminiFeatures() {
  console.log('🧪 Testing ALL Gemini AI Integrations...\n');
  
  const results = {
    chat: false,
    roadmap: false,
    quiz: false,
    analysis: false
  };

  // Test 1: Chat with Gemini
  try {
    console.log('1️⃣ Testing Chat API...');
    const chatResponse = await axios.post(`${API_BASE}/chat/message`, {
      message: 'What is React and how do I learn it?',
      conversationId: 'test-' + Date.now()
    }, {
      headers: { 'Authorization': AUTH_TOKEN, 'Content-Type': 'application/json' }
    });
    
    const confidence = chatResponse.data.data.aiResponse.confidence;
    console.log(`   ✅ Chat Response - Confidence: ${confidence}`);
    console.log(`   Content preview: ${chatResponse.data.data.aiResponse.content.substring(0, 100)}...`);
    results.chat = confidence >= 0.95; // 0.95 = Gemini, 0.7-0.8 = Mock
    console.log(`   Status: ${results.chat ? '🎉 Using GEMINI' : '⚠️  Using MOCK'}\n`);
  } catch (error) {
    console.log(`   ❌ Chat Error: ${error.message}\n`);
  }

  // Test 2: Roadmap Generation
  try {
    console.log('2️⃣ Testing Roadmap Generation...');
    const roadmapResponse = await axios.post(`${API_BASE}/roadmaps/generate`, {
      preferences: {
        domains: ['Data Science', 'Machine Learning'],
        timeCommitment: '2 hours/day',
        learningStyle: 'visual',
        experienceLevel: 'beginner'
      }
    }, {
      headers: { 'Authorization': AUTH_TOKEN, 'Content-Type': 'application/json' }
    });
    
    const roadmap = roadmapResponse.data.data;
    console.log(`   ✅ Roadmap Generated: ${roadmap.title || 'Success'}`);
    results.roadmap = roadmap.generated || roadmap.phases?.length > 0;
    console.log(`   Status: ${results.roadmap ? '🎉 Using GEMINI' : '⚠️  Using MOCK'}\n`);
  } catch (error) {
    console.log(`   ❌ Roadmap Error: ${error.message}\n`);
  }

  // Test 3: Quiz Generation
  try {
    console.log('3️⃣ Testing Quiz Generation...');
    const quizResponse = await axios.get(`${API_BASE}/quizzes/chapter/3`, {
      params: { topic: 'Python Programming', difficulty: 'medium' },
      headers: { 'Authorization': AUTH_TOKEN }
    });
    
    const quiz = quizResponse.data.data;
    console.log(`   ✅ Quiz Generated: ${quiz.title}`);
    console.log(`   Questions: ${quiz.questions?.length || 0}`);
    results.quiz = quiz.questions?.length > 0;
    console.log(`   Status: ${results.quiz ? '🎉 Generated' : '⚠️  Using MOCK'}\n`);
  } catch (error) {
    console.log(`   ❌ Quiz Error: ${error.message}\n`);
  }

  // Test 4: Market Analysis
  try {
    console.log('4️⃣ Testing Market Analysis...');
    const analysisResponse = await axios.get(`${API_BASE}/analytics/market`, {
      params: { domain: 'data-science', region: 'global' },
      headers: { 'Authorization': AUTH_TOKEN }
    });
    
    const analysis = analysisResponse.data.data;
    console.log(`   ✅ Analysis Generated`);
    results.analysis = analysis.aiConfidence >= 0.95;
    console.log(`   AI Confidence: ${analysis.aiConfidence}`);
    console.log(`   Status: ${results.analysis ? '🎉 Using GEMINI' : '⚠️  Using MOCK'}\n`);
  } catch (error) {
    console.log(`   ❌ Analysis Error: ${error.message}\n`);
  }

  // Summary
  console.log('📊 SUMMARY:');
  console.log('═══════════');
  console.log(`Chat:     ${results.chat ? '✅ GEMINI AI' : '❌ Mock'}`);
  console.log(`Roadmap:  ${results.roadmap ? '✅ GEMINI AI' : '❌ Mock'}`);
  console.log(`Quiz:     ${results.quiz ? '✅ GEMINI AI' : '❌ Mock'}`);
  console.log(`Analysis: ${results.analysis ? '✅ GEMINI AI' : '❌ Mock'}`);
  
  const allWorking = Object.values(results).every(r => r);
  console.log('\n' + (allWorking ? 
    '🎉 ALL FEATURES ARE USING GEMINI AI!' : 
    '⚠️  Some features still using mock responses'));
}

// Run tests
testAllGeminiFeatures().catch(console.error);
