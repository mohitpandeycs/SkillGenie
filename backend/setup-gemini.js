// Gemini API Setup Guide and Test
const fs = require('fs');
const path = require('path');

console.log('🔧 GEMINI API SETUP GUIDE');
console.log('='*50);

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

console.log('\n1. CHECKING ENVIRONMENT FILES...');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
  
  // Read current .env content
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('GEMINI_API_KEY')) {
    console.log('✅ GEMINI_API_KEY found in .env');
    
    // Check if it has a value
    const lines = envContent.split('\n');
    const geminiLine = lines.find(line => line.startsWith('GEMINI_API_KEY'));
    
    if (geminiLine && geminiLine.includes('=') && geminiLine.split('=')[1].trim()) {
      console.log('✅ GEMINI_API_KEY has a value');
      console.log('Current key:', geminiLine.split('=')[1].substring(0, 10) + '...');
    } else {
      console.log('❌ GEMINI_API_KEY is empty');
      console.log('\n🔑 TO FIX: Add your Gemini API key to .env file:');
      console.log('GEMINI_API_KEY=your_actual_api_key_here');
    }
  } else {
    console.log('❌ GEMINI_API_KEY not found in .env');
    console.log('\n🔑 TO FIX: Add this line to your .env file:');
    console.log('GEMINI_API_KEY=your_actual_api_key_here');
  }
} else {
  console.log('❌ .env file does not exist');
  
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copying .env.example to .env...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
    console.log('\n🔑 NOW: Edit .env file and add your Gemini API key');
  } else {
    console.log('❌ .env.example also missing');
    
    // Create basic .env file
    const basicEnv = `# SkillGenie Environment Variables
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/skillgenie

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# YouTube API
YOUTUBE_API_KEY=your-youtube-api-key-here

# Google Search API
GOOGLE_SEARCH_API_KEY=your-google-search-api-key-here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
`;
    
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Created basic .env file');
  }
}

console.log('\n2. HOW TO GET GEMINI API KEY:');
console.log('='*30);
console.log('1. Go to: https://makersuite.google.com/app/apikey');
console.log('2. Sign in with your Google account');
console.log('3. Click "Create API Key"');
console.log('4. Copy the generated API key');
console.log('5. Add it to your .env file as: GEMINI_API_KEY=your_key_here');

console.log('\n3. TESTING CURRENT SETUP...');
console.log('='*30);

// Test current setup
require('dotenv').config();

const geminiKey = process.env.GEMINI_API_KEY;
console.log('Gemini API Key status:', geminiKey ? '✅ Found' : '❌ Missing');

if (geminiKey) {
  console.log('Key preview:', geminiKey.substring(0, 10) + '...');
  
  // Test Gemini API
  testGeminiAPI();
} else {
  console.log('\n❌ Cannot test Gemini API - no key found');
  console.log('Please add GEMINI_API_KEY to your .env file');
}

async function testGeminiAPI() {
  console.log('\n4. TESTING GEMINI API CONNECTION...');
  
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });

    console.log('🧪 Testing with simple prompt...');
    
    const result = await model.generateContent('Say "Hello from Gemini!" and confirm you are working.');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ GEMINI API IS WORKING!');
    console.log('Response:', text);
    
    return true;
  } catch (error) {
    console.log('❌ GEMINI API TEST FAILED');
    console.log('Error:', error.message);
    
    if (error.message.includes('API_KEY')) {
      console.log('\n🔑 SOLUTION: Check your API key');
      console.log('- Make sure it\'s correctly copied');
      console.log('- Verify it\'s enabled in Google AI Studio');
      console.log('- Check for any typos or extra spaces');
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      console.log('\n📊 SOLUTION: API quota issue');
      console.log('- Check your Google AI Studio quota');
      console.log('- Wait a moment and try again');
      console.log('- Consider upgrading your plan if needed');
    } else {
      console.log('\n🌐 SOLUTION: Network or configuration issue');
      console.log('- Check your internet connection');
      console.log('- Verify the API key is active');
      console.log('- Try restarting the server');
    }
    
    return false;
  }
}

console.log('\n' + '='*50);
console.log('🚀 SETUP COMPLETE - Check the results above');
console.log('='*50);
