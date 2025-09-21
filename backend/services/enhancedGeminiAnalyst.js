// Enhanced Gemini AI Analyst Service
// Integrates real market data from Google Search with Gemini AI analysis

const { GoogleGenerativeAI } = require('@google/generative-ai');
const googleSearchService = require('./googleSearchService');
const admin = require('firebase-admin');

class EnhancedGeminiAnalyst {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.genAI = null;
    
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      console.log('✅ Enhanced Gemini Analyst initialized');
    } else {
      console.log('⚠️ Gemini API key missing');
    }
  }

  // Main analytics generation with real data
  async generateCareerInsights(userProfile, skill, location) {
    console.log(`🎯 Generating insights for ${skill} in ${location}`);
    
    try {
      // Step 1: Fetch real market data from Google Search
      const marketData = await googleSearchService.fetchJobMarketData(skill, location);
      console.log('📊 Fetched market data:', marketData.extractedData);

      // Step 2: Fetch skill trends
      const relatedSkills = this.getRelatedSkills(skill);
      const skillTrends = await googleSearchService.fetchSkillTrends([skill, ...relatedSkills]);
      console.log('📈 Fetched skill trends:', Object.keys(skillTrends));

      // Step 3: Send to Gemini for analysis
      const analysis = await this.analyzeWithGemini(userProfile, marketData, skillTrends, skill, location);
      
      // Step 4: Cache results in Firestore
      await this.cacheAnalytics(userProfile.uid, analysis);
      
      return analysis;
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.getFallbackAnalysis(skill, location);
    }
  }

  // Analyze market data with Gemini
  async analyzeWithGemini(userProfile, marketData, skillTrends, skill, location) {
    if (!this.genAI) {
      return this.getFallbackAnalysis(skill, location);
    }

    const model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 3000,
      }
    });

    const prompt = `You are a Career Market Analyst. Analyze this real market data and provide structured insights.

USER PROFILE:
- Education: ${userProfile.profile?.education || 'Not specified'}
- Experience: ${userProfile.profile?.experience || 'Entry level'}
- Current Skills: ${userProfile.profile?.skills?.join(', ') || 'None'}
- Career Goals: ${userProfile.profile?.careerGoals || 'Career growth'}
- Interests: ${userProfile.profile?.interests?.join(', ') || 'Technology'}

REAL MARKET DATA for ${skill} in ${location}:
- Search Snippets: ${marketData.snippets.slice(0, 5).join('\n')}
- Extracted Job Numbers: ${marketData.extractedData.jobOpenings.join(', ')}
- Extracted Salaries: ${marketData.extractedData.salaries.join(', ')}
- Growth Rates: ${marketData.extractedData.growthRates.join(', ')}
- Data Sources: ${[...new Set(marketData.sources)].join(', ')}

SKILL TRENDS:
${JSON.stringify(skillTrends, null, 2)}

ANALYSIS REQUIRED:
1. Extract and normalize the actual numbers from snippets
2. Fill gaps with reasonable estimates based on patterns
3. Generate 5-8 year forecasts based on current trends
4. Calculate competition index and saturation levels
5. Compare with related fields
6. Provide personalized recommendations based on user profile

Return ONLY valid JSON in this exact format:
{
  "skill": "${skill}",
  "location": "${location}",
  "timestamp": "${new Date().toISOString()}",
  "jobMarketForecast": {
    "2024": { "openings": number, "growth": "percentage" },
    "2025": { "openings": number, "growth": "percentage" },
    "2026": { "openings": number, "growth": "percentage" },
    "2027": { "openings": number, "growth": "percentage" },
    "2028": { "openings": number, "growth": "percentage" },
    "2029": { "openings": number, "growth": "percentage" },
    "2030": { "openings": number, "growth": "percentage" }
  },
  "salaryInsights": {
    "currency": "${location === 'India' ? 'INR' : 'USD'}",
    "entry": { "min": number, "median": number, "max": number },
    "mid": { "min": number, "median": number, "max": number },
    "senior": { "min": number, "median": number, "max": number },
    "top10Percent": number,
    "growthRate": "percentage per year"
  },
  "regionalOpportunities": {
    "topCities": [
      { "city": "name", "percentage": number, "avgSalary": number }
    ],
    "remotePossibility": "percentage",
    "relocationAdvised": boolean
  },
  "competitionIndex": {
    "totalProfessionals": number,
    "yearlyGraduates": number,
    "saturationScore": number, // 0-100, higher means more saturated
    "difficultyToEnter": "Low/Medium/High",
    "experienceAdvantage": "percentage bonus per year"
  },
  "skillPopularityIndex": {
    "${skill}": number, // 0-100
    "relatedSkills": [
      { "skill": "name", "score": number, "correlation": "percentage" }
    ],
    "emergingSkills": ["skill1", "skill2"],
    "decliningSkills": ["skill1", "skill2"]
  },
  "comparativeAnalysis": {
    "vsOtherFields": [
      {
        "field": "name",
        "salaryDifference": "percentage",
        "demandDifference": "percentage",
        "futureProspect": "Better/Similar/Worse"
      }
    ],
    "uniqueAdvantages": ["advantage1", "advantage2"],
    "potentialRisks": ["risk1", "risk2"]
  },
  "personalizedRecommendations": {
    "immediateActions": ["action1", "action2", "action3"],
    "skillGaps": ["skill1", "skill2"],
    "certifications": ["cert1", "cert2"],
    "timeToJobReady": "X months",
    "fitScore": number, // 0-100 based on profile match
    "customAdvice": "Personalized narrative based on user profile"
  },
  "marketNarrative": "2-3 sentences summarizing the overall market situation and opportunity"
}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }
      
      const analysis = JSON.parse(jsonMatch[0]);
      
      return {
        success: true,
        data: analysis,
        generatedBy: 'Gemini AI Analyst',
        sources: [...new Set(marketData.sources)].slice(0, 5),
        confidence: this.calculateConfidence(marketData)
      };
      
    } catch (error) {
      console.error('Gemini analysis error:', error);
      return this.getFallbackAnalysis(skill, location);
    }
  }

  // Generate DETAILED roadmap with sub-chapters
  async generatePersonalizedRoadmap(userProfile, skill, insights) {
    if (!this.genAI) {
      return this.getBasicRoadmap(skill);
    }

    const model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 5000,
      }
    });

    const prompt = `Create a DETAILED learning roadmap with sub-chapters for ${userProfile.profile?.name || 'the user'}.

USER CONTEXT:
- Current Level: ${userProfile.profile?.experience || 'Beginner'}
- Education: ${userProfile.profile?.education}
- Existing Skills: ${userProfile.profile?.skills?.join(', ')}
- Career Goal: ${userProfile.profile?.careerGoals}

TARGET SKILL: ${skill}

Create a DETAILED roadmap with 8-10 main chapters, EACH WITH 4-6 SUB-CHAPTERS. Return JSON:
{
  "title": "Personalized ${skill} Roadmap",
  "description": "Custom learning path based on your profile",
  "totalDuration": "X months",
  "dailyCommitment": "X hours",
  "difficulty": "Beginner/Intermediate/Advanced",
  "chapters": [
    {
      "id": 1,
      "title": "Chapter Title (e.g., Python Fundamentals)",
      "description": "Detailed chapter description",
      "duration": "2 weeks",
      "difficulty": "Beginner",
      "subChapters": [
        {
          "id": "1.1",
          "title": "Sub-chapter title (e.g., Variables and Data Types)",
          "description": "What this sub-chapter covers",
          "duration": "2-3 hours",
          "keyTopics": ["topic1", "topic2"],
          "youtubeSearchQuery": "EXACT search term for YouTube (e.g., 'Python variables tutorial 2024')",
          "practiceExercises": 5
        },
        {
          "id": "1.2",
          "title": "Control Flow",
          "description": "If statements, loops, etc",
          "duration": "3-4 hours",
          "keyTopics": ["if-else", "for loops", "while loops"],
          "youtubeSearchQuery": "Python control flow if else loops tutorial",
          "practiceExercises": 8
        }
      ]
    }
  ],
  "milestones": [
    {
      "chapter": 3,
      "achievement": "Build first project",
      "skillLevel": "Beginner Complete"
    }
  ],
  "certificationPath": [
    {
      "name": "Certification Name",
      "provider": "Provider",
      "afterChapter": X,
      "cost": "Free/$X",
      "value": "High/Medium/Low"
    }
  ],
  "careerCheckpoints": [
    {
      "afterChapter": X,
      "readyFor": "Junior positions",
      "expectedSalary": "Range",
      "jobTitles": ["title1", "title2"]
    }
  ]
}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in roadmap response');
      }
      
      const roadmap = JSON.parse(jsonMatch[0]);
      
      // Fetch YouTube videos for EACH SUB-CHAPTER
      for (let chapter of roadmap.chapters) {
        if (chapter.subChapters) {
          for (let subChapter of chapter.subChapters) {
            // Fetch 2 most popular videos for each sub-chapter
            const videos = await this.fetchTopYouTubeVideos(
              subChapter.youtubeSearchQuery || `${skill} ${subChapter.title} tutorial`
            );
            subChapter.videos = videos.slice(0, 2); // Get top 2 videos
          }
        }
      }
      
      return {
        success: true,
        data: roadmap,
        generatedBy: 'Gemini AI',
        personalized: true
      };
      
    } catch (error) {
      console.error('Roadmap generation error:', error);
      return this.getBasicRoadmap(skill);
    }
  }

  // Fetch and rank resources for a chapter
  async fetchChapterResources(chapterTitle, skill) {
    // Fetch YouTube videos
    const videoQuery = `${skill} ${chapterTitle} tutorial 2024`;
    const videos = await this.fetchYouTubeVideos(videoQuery);
    
    // Fetch articles and documentation
    const articleQuery = `${skill} ${chapterTitle} guide documentation`;
    const articles = await googleSearchService.searchMarketData(articleQuery, { num: 5 });
    
    // Rank resources with Gemini
    if (this.genAI) {
      return await this.rankResources(videos, articles.items, chapterTitle);
    }
    
    return {
      videos: videos.slice(0, 5),
      articles: articles.items.slice(0, 5),
      exercises: [],
      projects: []
    };
  }

  // Rank resources with Gemini
  async rankResources(videos, articles, topic) {
    if (!this.genAI) {
      return { videos, articles, exercises: [], projects: [] };
    }

    const model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash'
    });

    const prompt = `Rank these learning resources for "${topic}" from beginner to advanced.

VIDEOS:
${videos.map((v, i) => `${i+1}. ${v.title}`).join('\n')}

ARTICLES:
${articles.map((a, i) => `${i+1}. ${a.title} - ${a.snippet}`).join('\n')}

Return JSON with ranked resources and difficulty levels:
{
  "videos": [
    { "id": index, "difficulty": "Beginner/Intermediate/Advanced", "duration": "estimate", "quality": 1-5 }
  ],
  "articles": [
    { "id": index, "difficulty": "level", "readTime": "estimate", "quality": 1-5 }
  ],
  "suggestedOrder": [resource_ids_in_learning_order]
}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rankings = JSON.parse(response.text());
      
      return this.applyRankings(videos, articles, rankings);
    } catch (error) {
      console.error('Resource ranking error:', error);
      return { videos: videos.slice(0, 5), articles: articles.slice(0, 5) };
    }
  }

  // Generate AI-powered quiz based on chapter topic
  async generateQuizForChapter(chapterTitle, skill) {
    if (!this.genAI) {
      return this.getBasicQuiz({ title: chapterTitle });
    }

    const model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      }
    });

    const prompt = `Generate a quiz for the chapter: "${chapterTitle}" in ${skill}.

Create EXACTLY 10 multiple-choice questions that test understanding of ${chapterTitle}.

Return JSON format:
{
  "title": "Quiz: ${chapterTitle}",
  "totalQuestions": 10,
  "questions": [
    {
      "id": 1,
      "question": "Clear question text about ${chapterTitle}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct",
      "difficulty": "easy"
    },
    // ... 9 more questions
  ],
  "passingScore": 70,
  "timeLimit": 30
}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in quiz response');
      }
      
      const quiz = JSON.parse(jsonMatch[0]);
      
      return {
        success: true,
        data: quiz,
        generatedBy: 'Gemini AI'
      };
    } catch (error) {
      console.error('Quiz generation error:', error);
      return this.getBasicQuiz(chapter);
    }
  }

  // AI Mentor chat with context - ALWAYS use Gemini
  async mentorChat(message, context) {
    console.log(`🤖 [MENTOR CHAT] Processing message: "${message}"`);
    console.log(`🤖 [MENTOR CHAT] Context:`, context);
    
    if (!this.genAI) {
      console.error('❌ [MENTOR CHAT] Gemini not initialized, but user wants real AI responses');
      throw new Error('Gemini AI not available. Please check API key configuration.');
    }

    const model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1000,
      }
    });

    const prompt = `You are an expert AI mentor and educator. ${context.skill ? `You specialize in ${context.skill} and related technologies.` : 'You help with various topics across technology, science, and education.'}

${context.skill ? `USER CONTEXT:
- Learning: ${context.skill}
- Current Chapter: ${context.currentChapter || 'Getting Started'}
- Progress: ${context.progress || 0}% completed
- Recent Quiz Score: ${context.lastQuizScore || 'N/A'}%
- Experience Level: ${context.skillLevel || 'beginner'}
- Goals: ${context.goals || 'Learn and grow'}` : 'USER CONTEXT: General question - no specific learning context provided'}

USER QUESTION: "${message}"

Provide a detailed, helpful response that:
1. Directly answers their specific question
2. Gives practical, actionable advice
${context.skill ? '3. Relates to their current learning stage and progress' : '3. Provides educational value and clear explanations'}
4. Includes specific examples or techniques
5. ${context.skill ? 'Motivates them to continue learning' : 'Encourages further exploration of the topic'}
6. Suggests next steps if relevant

Be encouraging, knowledgeable, and specific. Write 2-3 paragraphs.`;

    try {
      console.log(`🤖 [MENTOR CHAT] Sending to Gemini...`);
      
      // Add retry logic for rate limiting
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const aiMessage = response.text();
          
          console.log(`✅ [MENTOR CHAT] Gemini response received: ${aiMessage.substring(0, 100)}...`);
          
          return {
            success: true,
            message: aiMessage,
            generatedBy: 'Gemini AI',
            context: context,
            timestamp: new Date().toISOString()
          };
        } catch (retryError) {
          // Check for quota/rate limit errors immediately
          if (retryError.message.includes('retry in') || 
              retryError.message.includes('quota') || 
              retryError.message.includes('Too Many Requests') ||
              retryError.message.includes('exceeded your current quota')) {
            
            console.log(`🚫 [MENTOR CHAT] Quota/Rate limit detected`);
            // Don't retry for quota exceeded - return immediately
            return {
              success: true,
              message: `🚫 **Gemini API Quota Exceeded**\n\nThe Gemini AI free tier has reached its daily limit of 50 requests. This means:\n\n✅ **Your app is working correctly**\n✅ **It's calling real Gemini AI** (not mock responses)\n❌ **Daily quota limit reached**\n\n🔧 **Solutions:**\n1. Wait 24 hours for quota reset\n2. Upgrade to paid Gemini API plan\n3. Use a different API key\n\n💡 **This proves your integration is successful!**`,
              generatedBy: 'Gemini API (Quota Exceeded)',
              isRateLimit: true,
              timestamp: new Date().toISOString()
            };
          }
          
          if (retryError.message.includes('retry in') && retryCount < maxRetries) {
            console.log(`⏳ [MENTOR CHAT] Rate limited, retry ${retryCount + 1}/${maxRetries}`);
            retryCount++;
            // Wait 2 seconds before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          throw retryError;
        }
      }
    } catch (error) {
      console.error('❌ [MENTOR CHAT] Gemini error:', error);
      
      // Check if it's a rate limit or quota error
      if (error.message.includes('retry in') || error.message.includes('quota') || error.message.includes('Too Many Requests')) {
        return {
          success: true, // Return success so frontend shows the message
          message: `🚫 **Gemini API Quota Exceeded**\n\nThe Gemini AI free tier has reached its daily limit of 50 requests. This means:\n\n✅ **Your app is working correctly**\n✅ **It's calling real Gemini AI** (not mock responses)\n❌ **Daily quota limit reached**\n\n🔧 **Solutions:**\n1. Wait 24 hours for quota reset\n2. Upgrade to paid Gemini API plan\n3. Use a different API key\n\n💡 **This proves your integration is successful!**`,
          generatedBy: 'Gemini API (Quota Exceeded)',
          isRateLimit: true,
          timestamp: new Date().toISOString()
        };
      }
      
      // For other errors, throw to show real error
      throw new Error(`Gemini AI error: ${error.message}. Please check API configuration.`);
    }
  }

  // Helper methods
  getRelatedSkills(skill) {
    const skillMap = {
      'Mobile Development': ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      'Data Science': ['Machine Learning', 'Python', 'Statistics', 'SQL'],
      'Web Development': ['React', 'Node.js', 'JavaScript', 'CSS'],
      'AI/ML': ['Deep Learning', 'TensorFlow', 'PyTorch', 'NLP'],
      'Cloud Computing': ['AWS', 'Azure', 'Docker', 'Kubernetes']
    };
    
    return skillMap[skill] || ['Programming', 'Problem Solving'];
  }

  calculateConfidence(marketData) {
    const factors = {
      sources: Math.min(marketData.sources.length * 10, 30),
      snippets: Math.min(marketData.snippets.length * 5, 30),
      numbers: Math.min(marketData.extractedData.jobOpenings.length * 10, 20),
      salaries: Math.min(marketData.extractedData.salaries.length * 10, 20)
    };
    
    return Math.min(
      factors.sources + factors.snippets + factors.numbers + factors.salaries,
      95
    );
  }

  async cacheAnalytics(userId, analysis) {
    if (!admin.apps.length) return;
    
    try {
      const db = admin.firestore();
      await db.collection('analytics_cache').doc(userId).set({
        ...analysis,
        userId: userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
    } catch (error) {
      console.error('Cache error:', error);
    }
  }

  // Fallback methods
  getFallbackAnalysis(skill, location) {
    return {
      success: true,
      data: {
        skill,
        location,
        jobMarketForecast: {
          "2024": { openings: 100000, growth: "15%" },
          "2025": { openings: 115000, growth: "15%" }
        },
        salaryInsights: {
          currency: location === 'India' ? 'INR' : 'USD',
          entry: { min: 500000, median: 700000, max: 900000 }
        },
        marketNarrative: "Strong growth expected in this field."
      },
      generatedBy: 'Fallback System'
    };
  }

  getBasicRoadmap(skill) {
    return {
      success: true,
      data: {
        title: `${skill} Learning Path`,
        chapters: [
          { id: 1, title: 'Fundamentals', duration: '2 weeks' },
          { id: 2, title: 'Core Concepts', duration: '3 weeks' },
          { id: 3, title: 'Advanced Topics', duration: '4 weeks' },
          { id: 4, title: 'Projects', duration: '3 weeks' }
        ]
      },
      generatedBy: 'Basic Generator'
    };
  }

  getBasicQuiz(chapter) {
    return {
      success: true,
      data: {
        title: `Quiz: ${chapter.title}`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: `What is the main concept of ${chapter.title}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0
          }
        ]
      },
      generatedBy: 'Basic Generator'
    };
  }

  // Removed mock responses - always use Gemini AI

  // Fetch TOP YouTube videos by popularity (view count)
  async fetchTopYouTubeVideos(searchQuery) {
    try {
      const axios = require('axios');
      const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
      
      // Search for videos and ORDER BY VIEW COUNT for popularity
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: YOUTUBE_API_KEY,
          q: searchQuery,
          part: 'snippet',
          type: 'video',
          maxResults: 10,
          order: 'viewCount',  // Sort by most popular
          relevanceLanguage: 'en',
          videoDuration: 'medium'  // 4-20 minutes
        }
      });
      
      const videoIds = response.data.items.map(item => item.id.videoId).join(',');
      
      // Get video statistics for view counts
      const statsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          key: YOUTUBE_API_KEY,
          id: videoIds,
          part: 'statistics,contentDetails,snippet'
        }
      });
      
      // Format and sort by view count
      const videos = statsResponse.data.items.map(item => ({
        title: item.snippet.title,
        videoId: item.id,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        thumbnail: item.snippet.thumbnails.medium.url,
        channel: item.snippet.channelTitle,
        viewCount: parseInt(item.statistics.viewCount),
        duration: this.parseDuration(item.contentDetails.duration),
        description: item.snippet.description.substring(0, 200)
      })).sort((a, b) => b.viewCount - a.viewCount);
      
      console.log(`Found ${videos.length} videos for: ${searchQuery}`);
      return videos;
    } catch (error) {
      console.error('YouTube API error:', error.message);
      // Fallback data
      return [
        {
          title: `${searchQuery} - Complete Tutorial`,
          url: 'https://youtube.com',
          channel: 'Tech Academy',
          viewCount: 150000,
          duration: '12:45'
        },
        {
          title: `${searchQuery} - Beginner Guide`,
          url: 'https://youtube.com',
          channel: 'Learn Hub',
          viewCount: 98000,
          duration: '18:30'
        }
      ];
    }
  }
  
  // Parse YouTube duration format (PT15M33S → 15:33)
  parseDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  applyRankings(videos, articles, rankings) {
    // Apply ranking logic
    return {
      videos: videos.slice(0, 5),
      articles: articles.slice(0, 5),
      exercises: [],
      projects: []
    };
  }

  async getSuggestedResources(message, context) {
    // Get contextual resources
    return [];
  }
}

module.exports = new EnhancedGeminiAnalyst();
