# 🧞‍♂️ Gemini AI Integration Setup Guide

This guide will help you set up Google's Gemini AI for the SkillGenie chat system.

## 🚀 Quick Start

The chat system is already configured to use Gemini AI! It will work with mock responses by default, but to get real AI responses, follow the setup below.

## 🔑 Getting Your Gemini API Key

### Step 1: Access Google AI Studio
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account

### Step 2: Create API Key
1. Click "Create API Key"
2. Select your Google Cloud project (or create a new one)
3. Copy the generated API key

### Step 3: Configure Environment Variables
1. Navigate to the `backend` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your-actual-gemini-api-key-here
   ```

## 🧪 Testing the Integration

Run the test script to verify everything works:

```bash
cd backend
node test-gemini.js
```

You should see:
- ✅ Successful API calls to Gemini
- 📝 AI-generated responses
- 🎯 Confidence scores
- 📚 Relevant sources

## 🔧 How It Works

### Fallback System
- **With API Key**: Uses real Gemini AI responses
- **Without API Key**: Uses intelligent mock responses
- **On API Error**: Automatically falls back to mock responses

### Features
- **Context-Aware**: Maintains conversation history
- **SkillGenie-Optimized**: Specialized prompts for career guidance
- **Smart Sources**: Automatically suggests relevant learning resources
- **Error Handling**: Graceful fallbacks ensure chat always works

### API Endpoints
- `POST /api/chat/message` - Send message to AI (now uses Gemini)
- `GET /api/chat/suggestions` - Get AI-generated question suggestions
- `GET /api/chat/conversations` - Get conversation history

## 💡 Customization

### Modify AI Behavior
Edit `backend/services/geminiService.js` to:
- Change the system prompt
- Adjust response formatting
- Add new conversation contexts
- Modify fallback responses

### Example Custom Prompt
```javascript
const systemPrompt = `You are an AI mentor for SkillGenie specializing in:
- Data Science and Machine Learning
- Career transitions and guidance  
- Programming best practices
- Industry insights and trends

Always provide practical, actionable advice with specific examples.`;
```

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Monitor API usage** in Google Cloud Console

## 📊 Monitoring & Limits

### API Limits (Free Tier)
- 60 requests per minute
- 1,500 requests per day
- Rate limiting is handled automatically

### Usage Monitoring
Check your usage at [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🐛 Troubleshooting

### Common Issues

**"API key not found"**
- Verify `.env` file exists in `backend/` folder
- Check `GEMINI_API_KEY` is set correctly
- Restart the server after adding the key

**"Rate limit exceeded"**
- Wait a few minutes and try again
- Consider upgrading to paid tier for higher limits

**"Invalid API key"**
- Regenerate key in Google AI Studio
- Ensure no extra spaces in `.env` file

**"Network errors"**
- Check internet connection
- Verify firewall isn't blocking Google APIs

### Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
```

## 🚀 Production Deployment

### Environment Setup
```env
NODE_ENV=production
GEMINI_API_KEY=your-production-api-key
```

### Scaling Considerations
- Monitor API usage and costs
- Implement caching for repeated queries
- Consider request batching for high traffic

## 📈 Next Steps

1. **Test thoroughly** with various question types
2. **Monitor performance** and response quality
3. **Customize prompts** for your specific use case
4. **Implement conversation memory** for better context
5. **Add user feedback** to improve responses

## 🤝 Support

- **Documentation**: [Google AI Studio Docs](https://ai.google.dev/docs)
- **Community**: [Google AI Developer Community](https://developers.googleblog.com/2023/12/google-ai-gemini-api.html)
- **Issues**: Check the SkillGenie GitHub repository

---

**🎉 You're all set!** Your SkillGenie chat is now powered by Google's Gemini AI. Enjoy intelligent, context-aware conversations that help users on their learning journey!
