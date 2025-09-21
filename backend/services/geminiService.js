const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    // Ensure dotenv is loaded
    require('dotenv').config();
    
    this.apiKey = process.env.GEMINI_API_KEY;
    console.log('🔑 Gemini API Key status:', this.apiKey ? 'Found' : 'Not found');
    
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY not found in environment variables. Using mock responses.');
      this.genAI = null;
    } else {
      console.log('🧞‍♂️ Initializing Gemini AI...');
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async generateResponse(message, conversationHistory = []) {
    console.log('📝 Generating response for:', message.substring(0, 50) + '...');
    
    // If no API key, fall back to mock responses
    if (!this.genAI) {
      console.log('⚠️ No Gemini API available, using mock response');
      return this.generateMockResponse(message);
    }

    console.log('🚀 Calling Gemini API...');
    try {
      // Get the generative model with timeout configuration
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      });

      // Create a context-aware prompt for SkillGenie
      const systemPrompt = `You are an AI mentor for SkillGenie, a career intelligence platform. Your role is to help users with:
- Career guidance and transitions
- Learning roadmaps and skill development
- Technical questions about programming, data science, and machine learning
- Job market insights and salary information
- Educational resources and best practices

Keep responses helpful, encouraging, and actionable. Use markdown formatting when appropriate.
Focus on practical advice and break down complex topics into digestible steps.`;

      // Build conversation context
      let conversationContext = systemPrompt + '\n\n';
      
      // Add recent conversation history (last 5 messages)
      const recentHistory = conversationHistory.slice(-5);
      recentHistory.forEach(msg => {
        conversationContext += `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      
      conversationContext += `User: ${message}\nAssistant:`;

      // Generate response with timeout
      const result = await Promise.race([
        model.generateContent(conversationContext),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        )
      ]);
      
      const response = await result.response;
      const text = response.text();

      console.log('✅ Gemini API response received:', text.substring(0, 100) + '...');

      return {
        content: text,
        confidence: 0.95, // Gemini typically provides high-quality responses
        sources: this.extractRelevantSources(message),
        timestamp: new Date()
      };

    } catch (error) {
      console.error('❌ Gemini API Error Details:');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Full error:', error);
      
      // Provide more specific error handling
      if (error.message?.includes('timeout') || error.message?.includes('unavailable')) {
        console.log('🔄 Network issue detected, falling back to mock responses');
      } else if (error.message?.includes('API_KEY')) {
        console.log('🔑 API key issue detected');
      } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
        console.log('📊 Rate limit or quota issue detected');
      }
      
      // Fall back to mock response on error
      console.log('🔄 Falling back to mock response');
      return this.generateMockResponse(message);
    }
  }

  generateMockResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    const responses = {
      'gradient descent': `Gradient descent is an optimization algorithm used to minimize the cost function in machine learning models. Here's how it works:

**Concept**: Imagine you're hiking down a mountain in fog and want to reach the bottom. You'd feel the slope and take steps in the steepest downward direction.

**Mathematical Steps**:
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

      'machine learning': `Machine Learning is a subset of AI that enables computers to learn and make decisions from data. Here's a beginner-friendly breakdown:

**Types of ML**:
1. **Supervised Learning**: Learn from labeled examples (like email spam detection)
2. **Unsupervised Learning**: Find patterns in unlabeled data (like customer segmentation)
3. **Reinforcement Learning**: Learn through trial and error (like game AI)

**Common Algorithms**:
- Linear Regression (predicting continuous values)
- Decision Trees (making decisions based on features)
- Random Forest (combining multiple decision trees)
- Neural Networks (mimicking brain neurons)

**Getting Started**:
1. Master Python and statistics first
2. Learn pandas for data manipulation
3. Start with scikit-learn library
4. Practice on real datasets from Kaggle

Which aspect would you like to dive deeper into?`,

      'career': `Here's a roadmap for transitioning into a data science career:

**Phase 1: Foundation (2-3 months)**
- Python programming
- Statistics and probability
- SQL for databases
- Excel/Google Sheets proficiency

**Phase 2: Core Skills (3-4 months)**
- Data manipulation (Pandas, NumPy)
- Data visualization (Matplotlib, Seaborn)
- Basic machine learning (Scikit-learn)
- Jupyter notebooks

**Phase 3: Advanced Topics (2-3 months)**
- Deep learning basics (TensorFlow/PyTorch)
- Big data tools (Spark basics)
- Cloud platforms (AWS/GCP)
- MLOps fundamentals

**Phase 4: Portfolio & Job Search (1-2 months)**
- Build 3-5 end-to-end projects
- Create GitHub portfolio
- Network on LinkedIn
- Apply to entry-level positions

**Timeline**: 8-12 months with consistent effort
**Salary Range**: $70K-$120K for entry-level positions

What's your current background? I can provide more specific guidance!`
    };

    // Keyword matching
    if (lowerMessage.includes('gradient') || lowerMessage.includes('descent')) {
      return {
        content: responses['gradient descent'],
        confidence: 0.8,
        sources: ['Machine Learning Fundamentals', 'Optimization Algorithms'],
        timestamp: new Date()
      };
    } else if (lowerMessage.includes('python') || lowerMessage.includes('coding')) {
      return {
        content: responses['python'],
        confidence: 0.8,
        sources: ['Python Documentation', 'Programming Best Practices'],
        timestamp: new Date()
      };
    } else if (lowerMessage.includes('machine learning') || lowerMessage.includes('ml')) {
      return {
        content: responses['machine learning'],
        confidence: 0.8,
        sources: ['Machine Learning Fundamentals', 'Data Science Handbook'],
        timestamp: new Date()
      };
    } else if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
      return {
        content: responses['career'],
        confidence: 0.8,
        sources: ['Career Transition Guide', 'Industry Reports'],
        timestamp: new Date()
      };
    } else {
      return {
        content: `That's a great question! Based on your current progress in the Data Science roadmap, I'd recommend focusing on the fundamentals first. 

Here are some key points to consider:
- Make sure you have a solid foundation in Python and statistics
- Practice with real datasets to build intuition
- Don't rush through concepts - understanding is more important than speed
- Apply what you learn through small projects

Is there a specific topic from your current chapter that you'd like help with? I can provide detailed explanations, examples, or suggest resources.`,
        confidence: 0.7,
        sources: ['Learning Best Practices', 'Study Methodology'],
        timestamp: new Date()
      };
    }
  }

  extractRelevantSources(message) {
    const lowerMessage = message.toLowerCase();
    const sources = [];

    // Add relevant sources based on message content
    if (lowerMessage.includes('python') || lowerMessage.includes('programming')) {
      sources.push('Python Documentation', 'Programming Best Practices');
    }
    if (lowerMessage.includes('machine learning') || lowerMessage.includes('ml') || lowerMessage.includes('ai')) {
      sources.push('Machine Learning Fundamentals', 'AI Research Papers');
    }
    if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('salary')) {
      sources.push('Industry Reports', 'Career Transition Guide');
    }
    if (lowerMessage.includes('data') || lowerMessage.includes('statistics')) {
      sources.push('Data Science Handbook', 'Statistical Methods');
    }

    // Default sources if no specific matches
    if (sources.length === 0) {
      sources.push('SkillGenie Knowledge Base', 'Learning Resources');
    }

    return sources;
  }

  async generateRoadmap(userProfile) {
    console.log('🗺️ Generating roadmap with Gemini...');
    
    if (!this.genAI) {
      console.log('⚠️ No Gemini API, using mock roadmap');
      return this.generateMockRoadmap(userProfile);
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      });

      const prompt = `Create a detailed learning roadmap for someone with the following profile:
      
      Goal: ${userProfile.goal || 'Data Science'}
      Experience Level: ${userProfile.experienceLevel || 'Beginner'}
      Time Commitment: ${userProfile.timeCommitment || '2 hours/day'}
      Background: ${userProfile.background || 'General'}
      
      Generate a structured JSON roadmap with the following format:
      {
        "title": "Personalized Learning Path",
        "duration": "6-8 months",
        "phases": [
          {
            "name": "Foundation",
            "duration": "2 months",
            "topics": ["Topic 1", "Topic 2"],
            "resources": ["Resource 1", "Resource 2"],
            "projects": ["Project 1"]
          }
        ],
        "milestones": ["Milestone 1", "Milestone 2"],
        "careerOutlook": "Description of career prospects"
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        // Try to parse as JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.log('Failed to parse JSON, returning structured response');
      }
      
      // Return structured response even if JSON parsing fails
      return {
        title: "AI-Generated Learning Roadmap",
        content: text,
        generated: true
      };

    } catch (error) {
      console.error('❌ Roadmap generation error:', error.message);
      return this.generateMockRoadmap(userProfile);
    }
  }

  generateMockRoadmap(userProfile) {
    return {
      title: `Data Science Learning Path`,
      duration: "6-8 months",
      phases: [
        {
          name: "Foundation",
          duration: "2 months",
          topics: ["Python Basics", "Statistics", "Data Manipulation"],
          resources: ["Python Crash Course", "Khan Academy Statistics"],
          projects: ["Data Analysis Portfolio Project"]
        },
        {
          name: "Machine Learning",
          duration: "3 months",
          topics: ["Supervised Learning", "Unsupervised Learning", "Deep Learning Basics"],
          resources: ["Andrew Ng Course", "Fast.ai"],
          projects: ["ML Model Deployment"]
        }
      ],
      milestones: ["Complete First Project", "Deploy ML Model", "Get Certification"],
      careerOutlook: "Strong demand with average salary $95k-$150k"
    };
  }

  async generateAnalysis(topic, data = {}) {
    console.log('📊 Generating analysis with Gemini...');
    
    if (!this.genAI) {
      return this.generateMockAnalysis(topic, data);
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1500,
        }
      });

      const prompt = `Provide a comprehensive analysis for:
      Topic: ${topic}
      ${data.context ? `Context: ${data.context}` : ''}
      ${data.metrics ? `Metrics: ${JSON.stringify(data.metrics)}` : ''}
      
      Include:
      1. Current market trends
      2. Growth projections (5-8 years)
      3. Required skills
      4. Salary ranges
      5. Key insights and recommendations
      
      Format the response in a clear, structured way with sections.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        topic,
        analysis: text,
        timestamp: new Date(),
        confidence: 0.95
      };

    } catch (error) {
      console.error('❌ Analysis generation error:', error.message);
      return this.generateMockAnalysis(topic, data);
    }
  }

  generateMockAnalysis(topic, data) {
    return {
      topic,
      analysis: `
## Market Analysis for ${topic}

### Current Trends
- High demand in tech industry
- Growing adoption across sectors
- Skills gap creating opportunities

### Growth Projections (5-8 years)
- Expected 25% annual growth
- New roles emerging
- Increased specialization

### Required Skills
- Technical: Programming, ML, Statistics
- Soft: Communication, Problem-solving
- Tools: Python, TensorFlow, Cloud platforms

### Salary Range
- Entry: $70k-$90k
- Mid: $100k-$130k
- Senior: $150k+

### Recommendations
- Focus on practical projects
- Build strong portfolio
- Network actively
      `,
      timestamp: new Date(),
      confidence: 0.7
    };
  }

  async generateQuiz(topic, difficulty = 'medium', count = 5) {
    console.log('📝 Generating quiz with Gemini...');
    
    if (!this.genAI) {
      return this.generateMockQuiz(topic, difficulty, count);
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2000,
        }
      });

      const prompt = `Generate ${count} multiple-choice questions about ${topic} at ${difficulty} difficulty level.
      
      Format as JSON array:
      [
        {
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correct": 0,
          "explanation": "Why this answer is correct"
        }
      ]
      
      Make questions thought-provoking and educational.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          return {
            topic,
            difficulty,
            questions,
            generated: true,
            timestamp: new Date()
          };
        }
      } catch (parseError) {
        console.log('Failed to parse quiz JSON');
      }

      // Fallback to mock if parsing fails
      return this.generateMockQuiz(topic, difficulty, count);

    } catch (error) {
      console.error('❌ Quiz generation error:', error.message);
      return this.generateMockQuiz(topic, difficulty, count);
    }
  }

  generateMockQuiz(topic, difficulty, count) {
    const mockQuestions = [
      {
        question: `What is the main purpose of ${topic}?`,
        options: [
          "To solve complex problems",
          "To automate tasks",
          "To analyze data",
          "All of the above"
        ],
        correct: 3,
        explanation: "All these aspects are important in modern technology."
      },
      {
        question: `Which tool is commonly used for ${topic}?`,
        options: [
          "Python",
          "Excel",
          "PowerPoint",
          "Word"
        ],
        correct: 0,
        explanation: "Python is the most popular language for data science and ML."
      }
    ];

    return {
      topic,
      difficulty,
      questions: mockQuestions.slice(0, count),
      generated: false,
      timestamp: new Date()
    };
  }

  async generateSuggestions(userProgress = {}) {
    if (!this.genAI) {
      return this.getDefaultSuggestions();
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Based on a user's learning progress in data science, generate 4 categories of helpful questions they might ask. Each category should have 3 specific questions.

Categories should be:
1. Current Chapter (technical questions about their current learning topic)
2. Skills Development (practical skill improvement questions)
3. Career Guidance (career-related questions)
4. Industry Trends (current market and technology trends)

Format as JSON with this structure:
{
  "suggestions": [
    {
      "category": "Category Name",
      "questions": ["Question 1", "Question 2", "Question 3"]
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const parsed = JSON.parse(text);
        return parsed.suggestions;
      } catch (parseError) {
        console.error('Failed to parse Gemini suggestions response:', parseError);
        return this.getDefaultSuggestions();
      }

    } catch (error) {
      console.error('Gemini suggestions error:', error);
      return this.getDefaultSuggestions();
    }
  }

  getDefaultSuggestions() {
    return [
      {
        category: 'Current Chapter',
        questions: [
          'Explain hypothesis testing with examples',
          'What is the difference between Type I and Type II errors?',
          'How do I interpret p-values?'
        ]
      },
      {
        category: 'Skills Development',
        questions: [
          'How can I improve my Python coding skills?',
          'What are the best practices for data visualization?',
          'Which machine learning algorithm should I learn first?'
        ]
      },
      {
        category: 'Career Guidance',
        questions: [
          'What skills are most in-demand for data scientists?',
          'How do I build a strong data science portfolio?',
          'What should I expect in a data science interview?'
        ]
      },
      {
        category: 'Industry Trends',
        questions: [
          'What are the latest trends in machine learning?',
          'How is AI changing the job market?',
          'Which companies are hiring data scientists?'
        ]
      }
    ];
  }
}

module.exports = new GeminiService();
