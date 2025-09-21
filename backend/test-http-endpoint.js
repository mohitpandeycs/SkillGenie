// Test HTTP endpoint specifically
const axios = require('axios');

async function testHTTPEndpoint() {
  console.log('🌐 Testing HTTP chat endpoint...');
  
  const testMessage = "Explain React hooks in simple terms";
  console.log('📤 Sending message:', testMessage);
  
  try {
    const response = await axios.post('http://localhost:5000/api/chat/message', {
      message: testMessage,
      conversationId: 'test-conv-' + Date.now()
    }, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('\n✅ HTTP Response received:');
    console.log('Status:', response.status);
    console.log('User message:', response.data.data.userMessage.content);
    console.log('AI response preview:', response.data.data.aiResponse.content.substring(0, 150) + '...');
    console.log('Confidence:', response.data.data.aiResponse.confidence);
    console.log('Sources:', response.data.data.aiResponse.sources);
    
    // Check if it's real Gemini
    if (response.data.data.aiResponse.confidence >= 0.95) {
      console.log('\n🎉 SUCCESS: HTTP endpoint is using REAL Gemini AI!');
    } else {
      console.log('\n⚠️ WARNING: HTTP endpoint is still using mock responses');
      console.log('Expected confidence: 0.95, Got:', response.data.data.aiResponse.confidence);
    }
    
  } catch (error) {
    console.error('❌ HTTP Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testHTTPEndpoint();
