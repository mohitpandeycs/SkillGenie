const { GoogleGenerativeAI } = require('@google/generative-ai');

class WorkingGeminiService {
  constructor() {
    require('dotenv').config();
    this.apiKey = process.env.GEMINI_API_KEY;
    
    console.log('🔧 Initializing Working Gemini Service...');
    console.log('API Key status:', this.apiKey ? '✅ Available' : '❌ Missing');
    
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      console.log('✅ Gemini AI client initialized');
    } else {
      console.warn('⚠️ No Gemini API key - using enhanced fallbacks');
    }
  }

  async generateRoadmap(skill, level = 'beginner', duration = '3-6 months') {
    console.log(`🚀 [WORKING GEMINI] generateRoadmap called for ${skill}`);
    
    if (!this.apiKey) {
      return this.getEnhancedFallbackRoadmap(skill, level, duration);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Create a comprehensive learning roadmap for ${skill} at ${level} level over ${duration}.
      
Return ONLY valid JSON in this exact format:
{
  "skill": "${skill}",
  "level": "${level}",
  "duration": "${duration}",
  "chapters": [
    {
      "id": 1,
      "title": "Chapter Title",
      "description": "Chapter description",
      "estimatedTime": "2 weeks",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "projects": ["Project 1", "Project 2"],
      "resources": ["Resource 1", "Resource 2"]
    }
  ],
  "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
  "careerOutcomes": ["Career 1", "Career 2"],
  "estimatedSalaryRange": "$60,000 - $120,000"
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const roadmapData = JSON.parse(text);
        return {
          success: true,
          data: roadmapData,
          generatedBy: 'Working Gemini Service',
          timestamp: new Date().toISOString()
        };
      } catch (parseError) {
        console.log('Failed to parse Gemini response, using fallback');
        return this.getEnhancedFallbackRoadmap(skill, level, duration);
      }
      
    } catch (error) {
      console.error('Gemini error:', error.message);
      return this.getEnhancedFallbackRoadmap(skill, level, duration);
    }
  }

  async generateAnalytics(skill, location = 'India', marketData = null) {
    console.log(`📊 [WORKING GEMINI] generateAnalytics for ${skill} in ${location}`);
    
    if (!this.apiKey) {
      return this.getEnhancedFallbackAnalytics(skill, location, marketData);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Analyze the job market for ${skill} in ${location}. 
      
Return ONLY valid JSON with market analysis, salary ranges, job trends, and career insights.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const analyticsData = JSON.parse(text);
        return {
          success: true,
          data: analyticsData,
          generatedBy: 'Working Gemini Service',
          timestamp: new Date().toISOString()
        };
      } catch (parseError) {
        return this.getEnhancedFallbackAnalytics(skill, location, marketData);
      }
      
    } catch (error) {
      console.error('Analytics error:', error.message);
      return this.getEnhancedFallbackAnalytics(skill, location, marketData);
    }
  }

  async chatMentor(message, context = {}) {
    console.log(`💬 [WORKING GEMINI] Chat mentor called`);
    
    if (!this.apiKey) {
      return this.getFallbackChatResponse(message, context);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `You are a helpful coding mentor. Respond to: "${message}"
      
Context: ${JSON.stringify(context)}

Provide helpful, encouraging advice in a conversational tone.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        message: response.text(),
        context: context,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Chat mentor error:', error.message);
      return this.getFallbackChatResponse(message, context);
    }
  }

  getEnhancedFallbackRoadmap(skill, level, duration) {
    console.log(`📋 [WORKING GEMINI] Using fallback roadmap for ${skill}`);
    
    const roadmapData = {
      skill: skill,
      level: level,
      duration: duration,
      chapters: [
        {
          id: 1,
          title: `${skill} Fundamentals`,
          description: `Learn the core concepts and basics of ${skill}`,
          estimatedTime: "2-3 weeks",
          topics: [`${skill} Syntax`, `Basic Concepts`, "Getting Started", "Development Environment"],
          projects: [`Simple ${skill} Project`, `${skill} Calculator`],
          resources: [`${skill} Documentation`, "Online Tutorials", "Practice Exercises"]
        },
        {
          id: 2,
          title: `Intermediate ${skill}`,
          description: `Build upon fundamentals with more advanced concepts`,
          estimatedTime: "3-4 weeks",
          topics: ["Advanced Features", "Best Practices", "Code Organization", "Debugging"],
          projects: [`${skill} Web App`, `${skill} API Project`],
          resources: ["Advanced Tutorials", "Community Forums", "Code Reviews"]
        },
        {
          id: 3,
          title: `${skill} Projects`,
          description: `Apply your knowledge with real-world projects`,
          estimatedTime: "4-6 weeks",
          topics: ["Project Planning", "Implementation", "Testing", "Deployment"],
          projects: [`Portfolio ${skill} Project`, `${skill} Full-Stack App`],
          resources: ["Project Templates", "Deployment Guides", "Portfolio Examples"]
        }
      ],
      prerequisites: ["Basic programming knowledge", "Computer with internet access"],
      careerOutcomes: [`${skill} Developer`, `Software Engineer`, `${skill} Specialist`],
      estimatedSalaryRange: level === 'beginner' ? "$50,000 - $80,000" : "$70,000 - $120,000"
    };

    return {
      success: true,
      data: roadmapData,
      generatedBy: 'Working Fallback System',
      timestamp: new Date().toISOString()
    };
  }

  getEnhancedFallbackAnalytics(skill, location, realMarketData) {
    console.log(`📊 [WORKING GEMINI] Using fallback analytics for ${skill}`);
    
    const currencySymbol = location === 'India' ? '₹' : '$';
    const salaryMultiplier = location === 'India' ? 1 : 12;
    
    const baseAnalytics = {
      skill: skill,
      location: location,
      marketOverview: {
        demandLevel: "High",
        growthRate: "15%",
        averageSalary: location === 'India' ? "₹8,00,000" : "$85,000",
        jobOpenings: location === 'India' ? "50,000+" : "10,000+",
        competitionLevel: "Medium"
      },
      topCompanies: [
        { name: "Google", openings: 150, averageSalary: `${currencySymbol}${140000 * salaryMultiplier}` },
        { name: "Microsoft", openings: 120, averageSalary: `${currencySymbol}${135000 * salaryMultiplier}` },
        { name: "Amazon", openings: 200, averageSalary: `${currencySymbol}${130000 * salaryMultiplier}` }
      ],
      careerPaths: [
        { role: `Junior ${skill} Developer`, experience: "0-2 years", salary: `${currencySymbol}${65000 * salaryMultiplier}` },
        { role: `${skill} Developer`, experience: "2-5 years", salary: `${currencySymbol}${85000 * salaryMultiplier}` },
        { role: `Senior ${skill} Developer`, experience: "5+ years", salary: `${currencySymbol}${120000 * salaryMultiplier}` }
      ]
    };

    return {
      success: true,
      data: baseAnalytics,
      generatedBy: 'Working Fallback System',
      timestamp: new Date().toISOString()
    };
  }

  getFallbackChatResponse(message, context) {
    console.log(`💬 [WORKING GEMINI] Using fallback chat response`);
    
    const { skill, currentChapter, quizScore } = context;
    
    const responses = [
      {
        greeting: `🎉 Great progress on ${skill || 'programming'}!`,
        tips: [
          "💡 Break complex problems into smaller pieces",
          "🔄 Practice regularly with hands-on coding",
          "🧪 Experiment with different approaches",
          "📚 Focus on understanding fundamentals"
        ],
        encouragement: "Keep up the fantastic work! 🚀"
      },
      {
        greeting: `👋 Hello there, ${skill || 'programming'} learner!`,
        tips: [
          "🎯 Set small, achievable daily goals",
          "🏗️ Build projects that interest you",
          "👥 Join coding communities",
          "🔍 Use errors as learning opportunities"
        ],
        encouragement: "Each challenge makes you stronger! 💪"
      }
    ];

    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const formattedMessage = {
      type: 'structured',
      greeting: selectedResponse.greeting,
      tips: selectedResponse.tips,
      encouragement: selectedResponse.encouragement,
      plainText: `${selectedResponse.greeting}\n\n${selectedResponse.tips.join('\n')}\n\n${selectedResponse.encouragement}`
    };

    return {
      success: true,
      message: formattedMessage,
      context: context,
      timestamp: new Date().toISOString()
    };
  }

  async generateChapterBasedQuiz(skill, chapter, difficulty = 'medium', chapterData = null) {
    console.log(`🗺️ [WORKING GEMINI] Generating roadmap-based quiz for ${skill} - ${chapter}`);
    
    if (!this.apiKey) {
      return this.getFallbackQuiz(skill, chapter, difficulty);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Build comprehensive prompt using actual chapter data
      let chapterContent = '';
      let topics = [];
      let subChapters = [];
      
      if (chapterData) {
        chapterContent = `
CHAPTER DETAILS:
- Title: ${chapterData.title}
- Description: ${chapterData.description}
- Duration: ${chapterData.duration || 'Not specified'}
- Difficulty: ${chapterData.difficulty || difficulty}`;

        if (chapterData.topics && Array.isArray(chapterData.topics)) {
          topics = chapterData.topics;
          chapterContent += `
- Topics to Cover: ${topics.join(', ')}`;
        }

        if (chapterData.subChapters && Array.isArray(chapterData.subChapters)) {
          subChapters = chapterData.subChapters;
          chapterContent += `
- Sub-chapters: ${subChapters.map(sc => sc.title || sc).join(', ')}`;
        }

        if (chapterData.resources && Array.isArray(chapterData.resources)) {
          chapterContent += `
- Available Resources: ${chapterData.resources.map(r => r.title || r).join(', ')}`;
        }
      }
      
      const prompt = `You are an expert educator creating a comprehensive quiz based on SPECIFIC ROADMAP CHAPTER CONTENT.

SKILL: ${skill}
CHAPTER: ${chapter}
${chapterContent}

CREATE EXACTLY 10 MULTIPLE CHOICE QUESTIONS that test understanding of THIS SPECIFIC CHAPTER content.

REQUIREMENTS:
1. Questions MUST be based on the chapter topics and sub-chapters listed above
2. Cover different aspects: definitions, practical application, implementation, best practices
3. Each question should test a specific topic from the chapter
4. Difficulty level: ${difficulty}
5. Questions must be 100% relevant to ${skill} and this chapter's content

${topics.length > 0 ? `
FOCUS AREAS (create questions covering these topics):
${topics.map((topic, index) => `${index + 1}. ${topic}`).join('\n')}
` : ''}

${subChapters.length > 0 ? `
SUB-CHAPTER CONTENT (create questions testing these areas):
${subChapters.map((sub, index) => `${index + 1}. ${sub.title || sub}`).join('\n')}
` : ''}

Return ONLY valid JSON in this EXACT format:
{
  "skill": "${skill}",
  "chapter": "${chapter}",
  "difficulty": "${difficulty}",
  "chapter_title": "${chapterData?.title || chapter}",
  "chapter_description": "${chapterData?.description || 'Chapter content for ' + skill}",
  "topics_covered": ${JSON.stringify(topics.length > 0 ? topics : [`${skill} fundamentals`])},
  "questions": [
    {
      "id": 1,
      "question": "Question based on specific chapter topic?",
      "type": "multiple_choice",
      "options": [
        "Option A - specific to chapter content",
        "Option B - specific to chapter content",
        "Option C - specific to chapter content", 
        "Option D - specific to chapter content"
      ],
      "correct": 0,
      "difficulty_tag": "${difficulty}",
      "points": 15,
      "explanation": "Educational explanation based on chapter content",
      "chapter_topic": "specific topic from the chapter",
      "sub_chapter": "relevant sub-chapter if applicable"
    }
  ]
}

CRITICAL: 
- Base ALL questions on the actual chapter content provided
- Do NOT use generic ${skill} questions
- Each question should reference specific topics/concepts from THIS chapter
- Make questions practical and relevant to what the student learned in this chapter`;

      console.log(`🤖 [WORKING GEMINI] Generating chapter-based quiz for "${chapterData?.title || chapter}"...`);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ [WORKING GEMINI] Received chapter-based response: ${text.substring(0, 200)}...`);
      
      try {
        // Clean the response to extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        
        const quizData = JSON.parse(jsonMatch[0]);
        
        // Validate the response
        if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
          throw new Error('Invalid questions in response');
        }
        
        // Ensure all questions are properly formatted and chapter-specific
        const validatedQuestions = quizData.questions.map((q, index) => ({
          id: q.id || (index + 1),
          question: q.question || `Question ${index + 1} about ${chapterData?.title || chapter}`,
          type: q.type || 'multiple_choice',
          options: Array.isArray(q.options) && q.options.length === 4 ? q.options : [
            `Option A for ${chapterData?.title || chapter}`,
            `Option B for ${chapterData?.title || chapter}`,
            `Option C for ${chapterData?.title || chapter}`,
            `Option D for ${chapterData?.title || chapter}`
          ],
          correct: typeof q.correct === 'number' ? q.correct : 0,
          difficulty_tag: q.difficulty_tag || difficulty,
          points: q.points || 15,
          explanation: q.explanation || `This tests your understanding of ${chapterData?.title || chapter}.`,
          chapter_topic: q.chapter_topic || (chapterData?.topics?.[index % (chapterData.topics.length || 1)] || `${skill} concepts`),
          sub_chapter: q.sub_chapter || (chapterData?.subChapters?.[index % (chapterData.subChapters.length || 1)]?.title || '')
        }));
        
        console.log(`✅ [WORKING GEMINI] Generated ${validatedQuestions.length} chapter-based questions for "${chapterData?.title || chapter}"`);
        
        return {
          success: true,
          skill: skill,
          chapter: chapter,
          difficulty: difficulty,
          chapter_title: chapterData?.title || chapter,
          chapter_description: chapterData?.description || `Chapter content for ${skill}`,
          topics_covered: topics.length > 0 ? topics : [`${skill} fundamentals`],
          sub_chapters: subChapters.map(sc => sc.title || sc),
          questions: validatedQuestions,
          generatedBy: 'Working Gemini Service - Chapter Based',
          aiGenerated: true,
          chapterBased: true,
          timestamp: new Date().toISOString()
        };
        
      } catch (parseError) {
        console.error('Failed to parse chapter-based quiz response:', parseError);
        console.log('Raw response:', text.substring(0, 500));
        return this.getFallbackQuiz(skill, chapter, difficulty);
      }
      
    } catch (error) {
      console.error('Chapter-based quiz generation error:', error.message);
      return this.getFallbackQuiz(skill, chapter, difficulty);
    }
  }

  async generateQuiz(skill, chapter, difficulty = 'medium', userPerformance = null) {
    console.log(`🧠 [WORKING GEMINI] Generating AI-driven quiz for ${skill} - ${chapter}`);
    
    if (!this.apiKey) {
      return this.getFallbackQuiz(skill, chapter, difficulty);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Enhanced prompt with proper inputs as specified
      const prompt = `You are an expert educator creating a comprehensive quiz for ${skill} - ${chapter}.

INPUTS FOR QUIZ GENERATION:
- Subject: ${skill}
- Chapter: ${chapter}
- Difficulty Level: ${difficulty}
- User Past Performance: ${userPerformance ? JSON.stringify(userPerformance) : 'No previous data'}

GENERATE EXACTLY 10 MULTIPLE CHOICE QUESTIONS following this structure:

For ${skill} - ${chapter}, create questions that test:
1. Core concepts and definitions
2. Practical application
3. Problem-solving scenarios
4. Best practices
5. Common pitfalls and debugging

Each question should:
- Be specific to ${skill} (NOT data science or statistics unless that's the skill)
- Test understanding of ${chapter} concepts
- Have 4 clear, distinct answer options
- Include a helpful explanation
- Be tagged with appropriate difficulty

Return ONLY valid JSON in this EXACT format:
{
  "skill": "${skill}",
  "chapter": "${chapter}",
  "difficulty": "${difficulty}",
  "topic_summary": "Brief summary of what this chapter covers in ${skill}",
  "concept_list": ["concept1", "concept2", "concept3"],
  "questions": [
    {
      "id": 1,
      "question": "Clear, concise question about ${skill} concept?",
      "type": "multiple_choice",
      "options": [
        "Option A - specific to ${skill}",
        "Option B - specific to ${skill}", 
        "Option C - specific to ${skill}",
        "Option D - specific to ${skill}"
      ],
      "correct": 0,
      "difficulty_tag": "easy|medium|hard",
      "points": 15,
      "explanation": "Short reasoning why this answer is correct, specific to ${skill}",
      "concept_tested": "specific ${skill} concept"
    }
  ]
}

IMPORTANT: 
- Questions must be 100% relevant to ${skill}
- NO generic programming questions unless ${skill} is a programming language
- NO data science content unless skill is "Data Science"
- Each question should test a different aspect of ${skill}
- Explanations should be educational and skill-specific`;

      console.log(`🤖 [WORKING GEMINI] Sending enhanced prompt for ${skill}...`);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ [WORKING GEMINI] Received response: ${text.substring(0, 200)}...`);
      
      try {
        // Clean the response to extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        
        const quizData = JSON.parse(jsonMatch[0]);
        
        // Validate the response
        if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
          throw new Error('Invalid questions in response');
        }
        
        // Ensure all questions are properly formatted
        const validatedQuestions = quizData.questions.map((q, index) => ({
          id: q.id || (index + 1),
          question: q.question || `Question ${index + 1} about ${skill}`,
          type: q.type || 'multiple_choice',
          options: Array.isArray(q.options) && q.options.length === 4 ? q.options : [
            `Option A for ${skill}`,
            `Option B for ${skill}`,
            `Option C for ${skill}`,
            `Option D for ${skill}`
          ],
          correct: typeof q.correct === 'number' ? q.correct : 0,
          difficulty_tag: q.difficulty_tag || difficulty,
          points: q.points || 15,
          explanation: q.explanation || `This tests your understanding of ${skill} concepts.`,
          concept_tested: q.concept_tested || `${skill} fundamentals`
        }));
        
        console.log(`✅ [WORKING GEMINI] Generated ${validatedQuestions.length} validated questions for ${skill}`);
        
        return {
          success: true,
          skill: skill,
          chapter: chapter,
          difficulty: difficulty,
          topic_summary: quizData.topic_summary || `This chapter covers key concepts in ${skill}`,
          concept_list: quizData.concept_list || [`${skill} basics`, `${skill} applications`],
          questions: validatedQuestions,
          generatedBy: 'Working Gemini Service',
          aiGenerated: true,
          timestamp: new Date().toISOString()
        };
        
      } catch (parseError) {
        console.error('Failed to parse Gemini quiz response:', parseError);
        console.log('Raw response:', text.substring(0, 500));
        return this.getFallbackQuiz(skill, chapter, difficulty);
      }
      
    } catch (error) {
      console.error('Quiz generation error:', error.message);
      return this.getFallbackQuiz(skill, chapter, difficulty);
    }
  }

  async generateAnalytics(skill, location, userProfile = null) {
    console.log(`📊 [WORKING GEMINI] Generating personalized analytics for ${skill} in ${location}`);
    console.log(`👤 User Profile:`, userProfile);
    
    if (!this.apiKey) {
      return this.getFallbackAnalytics(skill, location, userProfile);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Build comprehensive prompt using questionnaire data
      const userContext = userProfile ? `
USER PROFILE ANALYSIS:
- Education: ${userProfile.education}
- Experience Level: ${userProfile.experience}
- Current Skills: ${userProfile.skills?.join(', ') || 'None specified'}
- Career Goals: ${userProfile.careerGoals}
- Preferred Domains: ${userProfile.preferredDomains?.join(', ') || 'Not specified'}
- Interests: ${userProfile.interests?.join(', ') || 'Not specified'}` : 'No user profile data available';
      
      const prompt = `You are an expert market analyst creating a comprehensive, personalized analytics report.

TASK: Generate detailed analytics for ${skill} career in ${location} market.

${userContext}

Generate a comprehensive analytics report covering:

1. MARKET OVERVIEW (specific to ${skill} in ${location})
   - Current job market size
   - Average salary ranges (use local currency for ${location})
   - Growth rate projections
   - Competition level
   - Job availability score

2. PERSONALIZED INSIGHTS (based on user profile)
   - How user's background aligns with ${skill} market
   - Skill gaps to address
   - Timeline to job readiness
   - Salary potential based on their experience
   - Career progression path

3. MARKET TRENDS (5-year forecast)
   - Demand vs supply projections
   - Salary growth predictions
   - Emerging opportunities
   - Skills in high demand

4. REGIONAL DATA (specific to ${location})
   - Top hiring companies
   - Popular job locations
   - Remote work opportunities
   - Industry breakdown

5. ACTIONABLE RECOMMENDATIONS
   - Next steps for the user
   - Skills to prioritize
   - Timeline suggestions
   - Career strategy

Return ONLY valid JSON in this EXACT format:
{
  "skill": "${skill}",
  "location": "${location}",
  "userProfile": ${JSON.stringify(userProfile)},
  "marketOverview": {
    "totalJobs": <number>,
    "growthRate": <percentage>,
    "averageSalary": "<salary range in local currency>",
    "competitionIndex": <1.0-5.0>,
    "demandScore": <1-10>,
    "marketDescription": "Brief market summary"
  },
  "personalizedInsights": {
    "alignmentScore": <0-100>,
    "skillGaps": ["gap1", "gap2", "gap3"],
    "timeToJobReady": "<time estimate>",
    "salaryPotential": "<personalized salary range>",
    "careerPath": ["step1", "step2", "step3"],
    "strengthsAnalysis": "User's current strengths analysis",
    "recommendedFocus": "What user should focus on first"
  },
  "forecast": {
    "years": ["2024", "2025", "2026", "2027", "2028"],
    "demand": [<current demand>, <year1>, <year2>, <year3>, <year4>],
    "supply": [<current supply>, <year1>, <year2>, <year3>, <year4>],
    "salaryGrowth": [100, <year1>, <year2>, <year3>, <year4>]
  },
  "regionalData": [
    {
      "region": "Primary region in ${location}",
      "opportunities": <percentage>,
      "avgSalary": <number>,
      "growth": <percentage>,
      "companies": ["company1", "company2", "company3"]
    }
  ],
  "topSkills": [
    {
      "skill": "skill name",
      "demand": <0-100>,
      "growth": "<percentage>",
      "avgSalary": <number>,
      "relevanceToUser": <0-100>
    }
  ],
  "actionableRecommendations": [
    {
      "priority": "high|medium|low",
      "action": "specific action",
      "timeline": "time estimate",
      "impact": "expected impact",
      "personalizedReason": "why this is important for this user"
    }
  ],
  "industryBreakdown": [
    {
      "industry": "industry name",
      "percentage": <market share>,
      "avgSalary": <number>,
      "userFit": <0-100>
    }
  ]
}

CRITICAL REQUIREMENTS:
- Use REAL data and analysis for ${skill} in ${location}
- Make insights SPECIFIC to the user's profile
- Provide ACTIONABLE recommendations
- Use appropriate currency for ${location}
- Base all recommendations on user's current situation`;

      console.log(`🤖 [WORKING GEMINI] Generating personalized analytics for ${skill}...`);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ [WORKING GEMINI] Received analytics response: ${text.substring(0, 200)}...`);
      
      try {
        // Clean the response to extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        
        const analyticsData = JSON.parse(jsonMatch[0]);
        
        // Validate the response
        if (!analyticsData.marketOverview || !analyticsData.personalizedInsights) {
          throw new Error('Invalid analytics structure in response');
        }
        
        console.log(`✅ [WORKING GEMINI] Generated personalized analytics for ${skill}`);
        
        return {
          success: true,
          data: {
            ...analyticsData,
            generatedBy: 'Working Gemini Service - Personalized Analytics',
            aiGenerated: true,
            personalized: true,
            timestamp: new Date().toISOString(),
            generationTime: Date.now()
          }
        };
        
      } catch (parseError) {
        console.error('Failed to parse analytics response:', parseError);
        console.log('Raw response:', text.substring(0, 500));
        return this.getFallbackAnalytics(skill, location, userProfile);
      }
      
    } catch (error) {
      console.error('Analytics generation error:', error.message);
      return this.getFallbackAnalytics(skill, location, userProfile);
    }
  }

  getFallbackAnalytics(skill, location, userProfile) {
    console.log(`📝 [WORKING GEMINI] Using personalized fallback analytics for ${skill} in ${location}`);
    
    // Generate personalized fallback based on user profile
    const experienceMultiplier = {
      'beginner': 0.8,
      'some_experience': 1.0,
      'experienced': 1.3,
      'expert': 1.6
    };
    
    const locationSalaryBase = {
      'India': 800000,
      'USA': 100000,
      'UK': 60000,
      'Canada': 85000,
      'Germany': 65000
    };
    
    const skillSalaryMultiplier = {
      'machine learning': 1.4,
      'ai': 1.5,
      'data science': 1.3,
      'web development': 1.0,
      'mobile development': 1.1,
      'cybersecurity': 1.2,
      'cloud computing': 1.25,
      'devops': 1.2
    };
    
    const expLevel = userProfile?.experience || 'beginner';
    const baseSalary = locationSalaryBase[location] || locationSalaryBase['India'];
    const skillMultiplier = skillSalaryMultiplier[skill.toLowerCase()] || 1.0;
    const personalizedSalary = Math.round(baseSalary * skillMultiplier * experienceMultiplier[expLevel]);
    
    // Generate skill gaps based on user profile
    const allSkills = ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Data Visualization'];
    const userSkills = userProfile?.skills || [];
    const skillGaps = allSkills.filter(skill => !userSkills.includes(skill)).slice(0, 3);
    
    return {
      success: true,
      data: {
        skill: skill,
        location: location,
        userProfile: userProfile,
        marketOverview: {
          totalJobs: Math.floor(Math.random() * 50000) + 25000,
          growthRate: Math.floor(Math.random() * 30) + 20,
          averageSalary: location === 'India' ? 
            `₹${Math.floor(personalizedSalary/100000)}-${Math.floor(personalizedSalary/100000 * 2)} LPA` :
            `$${Math.floor(personalizedSalary/1000)}k-${Math.floor(personalizedSalary/1000 * 1.5)}k`,
          competitionIndex: 2.1 + (Math.random() * 1.5),
          demandScore: 7 + Math.floor(Math.random() * 3),
          marketDescription: `${skill} market in ${location} shows strong growth with increasing demand.`
        },
        personalizedInsights: {
          alignmentScore: userProfile ? 75 + Math.floor(Math.random() * 20) : 60,
          skillGaps: skillGaps,
          timeToJobReady: expLevel === 'beginner' ? '6-9 months' : 
                         expLevel === 'some_experience' ? '3-6 months' : '1-3 months',
          salaryPotential: location === 'India' ? 
            `₹${Math.floor(personalizedSalary/100000)}-${Math.floor(personalizedSalary/100000 * 1.8)} LPA` :
            `$${Math.floor(personalizedSalary/1000)}k-${Math.floor(personalizedSalary/1000 * 1.8)}k`,
          careerPath: [
            `${skill} Intern/Junior`,
            `${skill} Specialist`, 
            `Senior ${skill} Expert`,
            `${skill} Lead/Manager`
          ],
          strengthsAnalysis: userProfile?.careerGoals || `Strong interest in ${skill} development`,
          recommendedFocus: skillGaps.length > 0 ? skillGaps[0] : `Advanced ${skill} concepts`
        },
        forecast: {
          years: ['2024', '2025', '2026', '2027', '2028'],
          demand: [100, 125, 155, 190, 235],
          supply: [100, 110, 125, 145, 170],
          salaryGrowth: [100, 108, 117, 127, 138]
        },
        regionalData: [
          {
            region: location === 'India' ? 'Bangalore/Hyderabad' : `${location} Tech Hub`,
            opportunities: 35 + Math.floor(Math.random() * 20),
            avgSalary: personalizedSalary,
            growth: 25 + Math.floor(Math.random() * 15),
            companies: location === 'India' ? 
              ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Tech Mahindra'] :
              ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple']
          }
        ],
        topSkills: [
          {
            skill: 'Python',
            demand: 90 + Math.floor(Math.random() * 10),
            growth: '+' + (30 + Math.floor(Math.random() * 20)) + '%',
            avgSalary: personalizedSalary * 0.9,
            relevanceToUser: userSkills.includes('Python') ? 95 : 85
          }
        ],
        actionableRecommendations: [
          {
            priority: 'high',
            action: skillGaps.length > 0 ? `Learn ${skillGaps[0]}` : `Advance ${skill} skills`,
            timeline: '2-3 months',
            impact: 'Essential for job readiness',
            personalizedReason: `Based on your ${expLevel} experience level and career goals`
          }
        ],
        industryBreakdown: [
          {
            industry: 'Technology',
            percentage: 35,
            avgSalary: personalizedSalary * 1.1,
            userFit: userProfile?.preferredDomains?.includes('web_dev') || 
                    userProfile?.preferredDomains?.includes('ai_ml') ? 90 : 75
          }
        ],
        generatedBy: 'Working Fallback System - Personalized',
        aiGenerated: false,
        personalized: true,
        timestamp: new Date().toISOString()
      }
    };
  }

  getFallbackQuiz(skill, chapter, difficulty) {
    console.log(`📝 [WORKING GEMINI] Using enhanced fallback quiz for ${skill} - ${chapter}`);
    
    const skillQuestions = {
      javascript: [
        {
          question: "What is the correct way to declare a variable in JavaScript?",
          options: ["var name = 'John';", "variable name = 'John';", "v name = 'John';", "String name = 'John';"],
          correct: 0,
          explanation: "In JavaScript, variables are declared using var, let, or const keywords.",
          concept_tested: "Variable Declaration"
        },
        {
          question: "Which method is used to add an element to the end of an array in JavaScript?",
          options: ["push()", "append()", "add()", "insert()"],
          correct: 0,
          explanation: "The push() method adds one or more elements to the end of an array.",
          concept_tested: "Array Methods"
        },
        {
          question: "What does '===' mean in JavaScript?",
          options: ["Assignment", "Equality check", "Strict equality check", "Comparison"],
          correct: 2,
          explanation: "=== checks for strict equality (value and type), while == only checks value.",
          concept_tested: "Operators"
        }
      ],
      python: [
        {
          question: "How do you define a function in Python?",
          options: ["function myFunc():", "def myFunc():", "func myFunc():", "define myFunc():"],
          correct: 1,
          explanation: "In Python, functions are defined using the 'def' keyword.",
          concept_tested: "Function Definition"
        },
        {
          question: "Which data structure is ordered and changeable in Python?",
          options: ["Tuple", "Set", "List", "Dictionary"],
          correct: 2,
          explanation: "Lists are ordered, changeable, and allow duplicate members.",
          concept_tested: "Data Structures"
        },
        {
          question: "What is the correct way to import a module in Python?",
          options: ["include module", "import module", "require module", "use module"],
          correct: 1,
          explanation: "The 'import' keyword is used to import modules in Python.",
          concept_tested: "Modules and Imports"
        }
      ],
      react: [
        {
          question: "What is JSX in React?",
          options: ["A database", "A syntax extension for JavaScript", "A CSS framework", "A testing library"],
          correct: 1,
          explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in React.",
          concept_tested: "JSX Fundamentals"
        },
        {
          question: "Which Hook is used to manage state in functional components?",
          options: ["useEffect", "useState", "useContext", "useReducer"],
          correct: 1,
          explanation: "useState is the Hook used to add state to functional components in React.",
          concept_tested: "React Hooks"
        },
        {
          question: "What is a React component?",
          options: ["A database table", "A reusable piece of UI", "A CSS class", "A JavaScript variable"],
          correct: 1,
          explanation: "React components are reusable pieces of UI that can be composed together.",
          concept_tested: "Components"
        }
      ],
      html: [
        {
          question: "What does HTML stand for?",
          options: ["Hypertext Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
          correct: 0,
          explanation: "HTML stands for Hypertext Markup Language, used for creating web pages.",
          concept_tested: "HTML Basics"
        },
        {
          question: "Which HTML tag is used to create a hyperlink?",
          options: ["<link>", "<a>", "<href>", "<url>"],
          correct: 1,
          explanation: "The <a> tag is used to create hyperlinks in HTML.",
          concept_tested: "HTML Tags"
        }
      ],
      css: [
        {
          question: "What does CSS stand for?",
          options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
          correct: 1,
          explanation: "CSS stands for Cascading Style Sheets, used for styling web pages.",
          concept_tested: "CSS Basics"
        },
        {
          question: "Which property is used to change the background color in CSS?",
          options: ["color", "bgcolor", "background-color", "bg-color"],
          correct: 2,
          explanation: "The background-color property is used to set the background color of an element.",
          concept_tested: "CSS Properties"
        }
      ],
      nodejs: [
        {
          question: "What is Node.js?",
          options: ["A web browser", "A JavaScript runtime", "A database", "A CSS framework"],
          correct: 1,
          explanation: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
          concept_tested: "Node.js Fundamentals"
        }
      ]
    };
    
    const skillKey = skill.toLowerCase();
    const templates = skillQuestions[skillKey] || [
      {
        question: `What is a fundamental concept in ${skill}?`,
        options: [`${skill} core principles`, "Unrelated concept", "Random information", "Generic programming"],
        correct: 0,
        explanation: `Understanding core principles is essential for mastering ${skill}.`,
        concept_tested: `${skill} Fundamentals`
      },
      {
        question: `Which best describes ${skill}?`,
        options: [`A technology for building applications`, "A type of food", "A programming language", "A database system"],
        correct: 0,
        explanation: `${skill} is a technology used in software development.`,
        concept_tested: `${skill} Definition`
      }
    ];
    
    // Generate 10 questions by repeating and modifying templates
    const questions = [];
    for (let i = 0; i < 10; i++) {
      const template = templates[i % templates.length];
      questions.push({
        id: i + 1,
        question: i < templates.length ? template.question : `${template.question} (Question ${i + 1})`,
        type: "multiple_choice",
        options: template.options,
        correct: template.correct,
        difficulty_tag: difficulty,
        points: 15,
        explanation: template.explanation,
        concept_tested: template.concept_tested
      });
    }
    
    return {
      success: true,
      skill: skill,
      chapter: chapter,
      difficulty: difficulty,
      topic_summary: `This chapter covers fundamental concepts in ${skill}`,
      concept_list: [`${skill} basics`, `${skill} syntax`, `${skill} best practices`],
      questions: questions,
      generatedBy: 'Working Fallback System',
      aiGenerated: false,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new WorkingGeminiService();
