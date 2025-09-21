// Test the chat endpoint with real user input
const axios = require('axios');

async function testChatEndpoint() {
  console.log('🧪 Testing chat endpoint with real user input...');
  
  const testMessage = "What is React and how do I learn it?";
  
  try {
    const response = await axios.post('http://localhost:5000/api/chat/message', {
      message: testMessage,
      conversationId: 'test-conv-123'
    }, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Chat endpoint response:');
    console.log('User message:', response.data.data.userMessage.content);
    console.log('AI response:', response.data.data.aiResponse.content.substring(0, 200) + '...');
    console.log('Confidence:', response.data.data.aiResponse.confidence);
    console.log('Sources:', response.data.data.aiResponse.sources);
    
  } catch (error) {
    console.error('❌ Error testing chat endpoint:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testChatEndpoint();
