# 🚀 SkillGenie API Documentation - Gemini AI Powered

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer your-token-here
```

---

## 🧞‍♂️ 1. AI Chat API

### Send Message to AI
**POST** `/chat/message`

**Request Body:**
```json
{
  "message": "Your question here",
  "conversationId": "optional-conversation-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "message-id",
    "conversationId": "conv_12345",
    "userMessage": {
      "content": "Your question",
      "timestamp": "2024-01-01T00:00:00Z",
      "type": "user"
    },
    "aiResponse": {
      "content": "Gemini AI response here...",
      "timestamp": "2024-01-01T00:00:01Z",
      "type": "ai",
      "confidence": 0.95,
      "sources": ["Source 1", "Source 2"]
    }
  }
}
```

### Get Suggestions
**GET** `/chat/suggestions`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category": "Current Chapter",
      "questions": ["Question 1", "Question 2", "Question 3"]
    }
  ]
}
```

---

## 🗺️ 2. Roadmap Generation API

### Generate Personalized Roadmap
**POST** `/roadmaps/generate`

**Request Body:**
```json
{
  "preferences": {
    "domains": ["Data Science", "Machine Learning"],
    "timeCommitment": "2 hours/day",
    "learningStyle": "visual",
    "experienceLevel": "beginner",
    "background": "Computer Science"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Roadmap generated successfully with Gemini AI",
  "data": {
    "id": "roadmap_12345",
    "title": "Personalized Learning Path",
    "duration": "6-8 months",
    "phases": [
      {
        "name": "Foundation",
        "duration": "2 months",
        "topics": ["Python Basics", "Statistics"],
        "resources": ["Resource 1", "Resource 2"],
        "projects": ["Project 1"]
      }
    ],
    "milestones": ["Milestone 1", "Milestone 2"],
    "careerOutlook": "Strong demand with average salary $95k-$150k"
  }
}
```

### Get All Roadmaps
**GET** `/roadmaps`

---

## 📝 3. Quiz Generation API

### Generate Quiz for Chapter
**GET** `/quizzes/chapter/:chapterId`

**Query Parameters:**
- `topic` (optional): Topic for the quiz (default: "Data Science")
- `difficulty` (optional): easy, medium, hard (default: "medium")

**Example:**
```
GET /api/quizzes/chapter/3?topic=Python&difficulty=medium
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "quiz_3",
    "chapterId": 3,
    "title": "Python Quiz - Chapter 3",
    "totalQuestions": 10,
    "timeLimit": 600,
    "passingScore": 70,
    "questions": [
      {
        "question": "What is Python?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 0,
        "explanation": "Explanation here..."
      }
    ]
  }
}
```

### Submit Quiz
**POST** `/quizzes/:quizId/submit`

**Request Body:**
```json
{
  "answers": [0, 2, 1, 3, 0]
}
```

---

## 📊 4. Market Analysis API

### Get Market Analysis
**GET** `/analytics/market`

**Query Parameters:**
- `domain` (optional): Field to analyze (default: "data-science")
- `region` (optional): Geographic region (default: "global")

**Example:**
```
GET /api/analytics/market?domain=machine-learning&region=north-america
```

**Response:**
```json
{
  "success": true,
  "data": {
    "domain": "machine-learning",
    "region": "north-america",
    "aiAnalysis": "Detailed Gemini AI analysis...",
    "aiConfidence": 0.95,
    "overview": {
      "totalJobs": 125000,
      "growthRate": 35,
      "averageSalary": 120000
    },
    "forecast": {
      "years": ["2024", "2025", "2026"],
      "demand": [100, 125, 155]
    }
  }
}
```

### Get User Progress Analytics
**GET** `/analytics/user-progress`

---

## 🔑 Environment Variables Required

Add these to your `.env` file:

```env
# Required for Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT (for authentication)
JWT_SECRET=your-secret-key-here
```

---

## 🧪 Testing the APIs

### Using cURL

**Chat API:**
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{"message": "What is machine learning?"}'
```

**Roadmap API:**
```bash
curl -X POST http://localhost:5000/api/roadmaps/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{"preferences": {"domains": ["AI"], "timeCommitment": "2 hours/day", "learningStyle": "visual"}}'
```

**Quiz API:**
```bash
curl http://localhost:5000/api/quizzes/chapter/1?topic=Python \
  -H "Authorization: Bearer test-token"
```

**Analytics API:**
```bash
curl http://localhost:5000/api/analytics/market?domain=data-science \
  -H "Authorization: Bearer test-token"
```

### Using JavaScript/Axios

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
const AUTH_TOKEN = 'Bearer your-token';

// Chat Example
const chatWithAI = async () => {
  const response = await axios.post(
    `${API_BASE}/chat/message`,
    { message: 'How do I learn Python?' },
    { headers: { 'Authorization': AUTH_TOKEN } }
  );
  console.log(response.data.data.aiResponse.content);
};

// Roadmap Example
const generateRoadmap = async () => {
  const response = await axios.post(
    `${API_BASE}/roadmaps/generate`,
    {
      preferences: {
        domains: ['Data Science'],
        timeCommitment: '2 hours/day',
        learningStyle: 'visual'
      }
    },
    { headers: { 'Authorization': AUTH_TOKEN } }
  );
  console.log(response.data.data);
};
```

---

## 🎯 Frontend Integration

In your React components:

```javascript
// Chat Component
const sendMessage = async (message) => {
  const response = await fetch('http://localhost:5000/api/chat/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken
    },
    body: JSON.stringify({ message })
  });
  
  const data = await response.json();
  return data.data.aiResponse.content;
};

// Roadmap Component
const generateRoadmap = async (preferences) => {
  const response = await fetch('http://localhost:5000/api/roadmaps/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken
    },
    body: JSON.stringify({ preferences })
  });
  
  const data = await response.json();
  return data.data;
};
```

---

## 📈 Response Confidence Levels

- **0.95**: Real Gemini AI response
- **0.7-0.8**: Mock/fallback response
- **< 0.7**: Error or default response

---

## 🚨 Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

Common HTTP Status Codes:
- **200**: Success
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid token)
- **500**: Internal Server Error

---

## 🔒 Security Notes

1. **Never expose your GEMINI_API_KEY in frontend code**
2. **Always validate and sanitize user input**
3. **Implement rate limiting for production**
4. **Use proper JWT tokens for authentication**
5. **Enable CORS only for trusted domains**

---

## 🚀 Quick Start

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   node server.js
   ```

2. **Test an endpoint:**
   ```bash
   curl -X POST http://localhost:5000/api/chat/message \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer test-token" \
     -d '{"message": "Hello AI!"}'
   ```

3. **Check if Gemini is working:**
   - Look for `confidence: 0.95` in responses
   - Check server logs for "🚀 Calling Gemini API..."

---

## 📞 Support

For issues or questions:
- Check server logs for detailed error messages
- Ensure GEMINI_API_KEY is set in .env file
- Verify server is running on port 5000
- Test with the provided test scripts

---

**All APIs are now powered by Google Gemini AI! 🧞‍♂️**
