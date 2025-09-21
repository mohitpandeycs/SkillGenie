import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Brain, 
  User, 
  Lightbulb, 
  BookOpen, 
  Code, 
  TrendingUp,
  MessageCircle,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { getApiUrl } from '../config/api';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI mentor for Data Science and Machine Learning. I'm here to help you with any questions about your learning journey. What would you like to know?",
      timestamp: new Date(Date.now() - 300000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestedQuestions = [
    {
      icon: <BookOpen className="w-4 h-4" />,
      text: "Explain gradient descent with an example",
      category: "Concepts"
    },
    {
      icon: <Code className="w-4 h-4" />,
      text: "How do I improve my Python coding skills?",
      category: "Skills"
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      text: "What are the current trends in ML?",
      category: "Industry"
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      text: "Suggest a project for my portfolio",
      category: "Projects"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the real Gemini API
      const response = await fetch(getApiUrl('CHAT'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token' // Replace with real auth token
        },
        body: JSON.stringify({
          message: messageText.trim(),
          conversationId: `conv_${Date.now()}`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.data.aiResponse.content,
          timestamp: new Date(),
          confidence: data.data.aiResponse.confidence,
          sources: data.data.aiResponse.sources
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      // Show real error instead of mock response
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `❌ **API Error**: Failed to connect to Gemini AI. Please check if the backend server is running on port 5000.\n\nError: ${error.message}\n\n🔧 **To fix**: Make sure your backend server is running and Gemini API key is configured.`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (userMessage) => {
    const responses = {
      'gradient descent': `Gradient descent is an optimization algorithm used to minimize the cost function in machine learning models. Here's how it works:

**Concept**: Imagine you're hiking down a mountain in fog and want to reach the bottom. You'd feel the slope and take steps in the steepest downward direction.

**Example**: 
1. Start with random parameters (θ)
2. Calculate the cost function J(θ)
3. Compute the gradient ∇J(θ) 
4. Update: θ = θ - α∇J(θ)
5. Repeat until convergence

**Learning Rate (α)**: Controls step size
- Too large: May overshoot minimum
- Too small: Slow convergence

Would you like me to explain any specific part in more detail?`,

      'python': `Great question! Here are effective ways to improve your Python skills:

**1. Practice Regularly**
- Solve coding challenges on HackerRank, LeetCode
- Work on small projects daily (even 30 minutes helps)

**2. Read Quality Code**
- Study open-source projects on GitHub
- Follow Python style guides (PEP 8)

**3. Build Projects**
- Start with simple scripts, progress to complex applications
- Focus on data science projects since that's your path

**4. Learn Libraries**
- Master NumPy, Pandas, Matplotlib
- Explore Scikit-learn for ML

**5. Join Communities**
- Python Discord, Reddit r/Python
- Attend local Python meetups

What specific area of Python would you like to focus on?`,

      'trends': `Here are the hottest trends in Machine Learning for 2024:

**🔥 Top Trends:**

**1. Large Language Models (LLMs)**
- GPT-4, Claude, Llama 2
- Fine-tuning for specific domains
- Prompt engineering as a skill

**2. Multimodal AI**
- Models that understand text, images, audio
- Applications in robotics, healthcare

**3. MLOps & Production**
- Model monitoring and versioning
- Automated ML pipelines
- Edge AI deployment

**4. Responsible AI**
- Bias detection and mitigation
- Explainable AI (XAI)
- Privacy-preserving ML

**5. AutoML Evolution**
- No-code/low-code ML platforms
- Automated feature engineering

Which trend interests you most? I can provide more specific guidance!`,

      'project': `Here are some excellent portfolio project ideas based on your current level:

**🎯 Beginner Projects:**
1. **Customer Churn Prediction**
   - Use telecom/banking data
   - Classification problem
   - Great for showcasing data cleaning & visualization

2. **Stock Price Prediction**
   - Time series analysis
   - Feature engineering with technical indicators
   - Shows understanding of financial data

**🚀 Intermediate Projects:**
3. **Recommendation System**
   - Movie/book recommendations
   - Collaborative filtering
   - Demonstrates understanding of user behavior

4. **Sentiment Analysis Dashboard**
   - Twitter/Reddit data
   - NLP techniques
   - Interactive visualization with Streamlit

**💡 Tips:**
- Document your process thoroughly
- Deploy on Heroku/Streamlit Cloud
- Include business insights, not just technical details

Which type of project excites you most? I can help you plan the implementation!`
    };

    // Simple keyword matching for demo
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('gradient') || lowerMessage.includes('descent')) {
      return responses['gradient descent'];
    } else if (lowerMessage.includes('python') || lowerMessage.includes('coding')) {
      return responses['python'];
    } else if (lowerMessage.includes('trend') || lowerMessage.includes('current')) {
      return responses['trends'];
    } else if (lowerMessage.includes('project') || lowerMessage.includes('portfolio')) {
      return responses['project'];
    } else {
      return `That's a great question! Based on your current progress in the Data Science roadmap, I'd recommend focusing on the fundamentals first. 

Here are some key points to consider:
- Make sure you have a solid foundation in Python and statistics
- Practice with real datasets to build intuition
- Don't rush through concepts - understanding is more important than speed
- Apply what you learn through small projects

Is there a specific topic from your current chapter (Statistics & Probability) that you'd like help with?`;
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-dark-primary flex">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="bg-dark-secondary/50 border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="gradient-bg p-2 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Mentor Chat</h1>
              <p className="text-gray-400">Your personal Data Science & ML assistant</p>
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="gradient-bg w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-3xl ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div className={`p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-neon-blue text-white ml-auto' 
                      : 'light-card'
                  }`}>
                    <div className={`prose prose-sm max-w-none ${
                      message.type === 'user' ? 'prose-invert' : ''
                    }`}>
                      {message.content.split('\n').map((line, index) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <h4 key={index} className="font-semibold mt-4 mb-2 text-gray-800">
                              {line.replace(/\*\*/g, '')}
                            </h4>
                          );
                        } else if (line.startsWith('- ')) {
                          return (
                            <li key={index} className="ml-4 text-gray-700">
                              {line.substring(2)}
                            </li>
                          );
                        } else if (line.match(/^\d+\./)) {
                          return (
                            <li key={index} className="ml-4 text-gray-700 list-decimal">
                              {line.replace(/^\d+\.\s*/, '')}
                            </li>
                          );
                        } else if (line.trim() === '') {
                          return <br key={index} />;
                        } else {
                          return (
                            <p key={index} className={`${
                              message.type === 'user' ? 'text-white' : 'text-gray-700'
                            } ${line.startsWith('🔥') || line.startsWith('🎯') || line.startsWith('🚀') || line.startsWith('💡') ? 'font-semibold text-lg' : ''}`}>
                              {line}
                            </p>
                          );
                        }
                      })}
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{formatTimestamp(message.timestamp)}</span>
                    {message.type === 'ai' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyMessage(message.content)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy message"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="gradient-bg w-10 h-10 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="light-card p-4 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="p-6 border-t border-white/10">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Suggested questions:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question.text)}
                    className="light-card p-4 text-left hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 rounded-lg group-hover:from-neon-blue/20 group-hover:to-neon-purple/20 transition-colors">
                        {question.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{question.text}</p>
                        <p className="text-sm text-gray-500">{question.category}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-white/10">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about Data Science, ML, or your learning journey..."
                  className="w-full p-4 pr-12 bg-dark-accent border border-gray-600 rounded-xl focus:border-neon-blue focus:outline-none text-white placeholder-gray-400"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-neon-blue hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI responses are generated for demonstration. In production, this would connect to advanced language models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
