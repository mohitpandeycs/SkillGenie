// Simple Gemini test
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiDirect() {
  console.log('Testing direct Gemini API call...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('API Key found:', apiKey ? 'Yes' : 'No');
  
  if (!apiKey) {
    console.log('❌ No API key found');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = "Hello, what is machine learning in simple terms?";
    console.log('📤 Sending prompt:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini Response:');
    console.log(text);
    
  } catch (error) {
    console.error('❌ Gemini Error:', error.message);
  }
}

testGeminiDirect();
