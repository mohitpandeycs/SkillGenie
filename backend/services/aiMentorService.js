const { GoogleGenerativeAI } = require('@google/generative-ai');
const youtubeService = require('./youtubeService');
const axios = require('axios');

class AIMentorService {
  constructor() {
    require('dotenv').config();
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.googleSearchApiKey = process.env.GOOGLE_SEARCH_API_KEY;
    
    console.log('🤖 Initializing AI Mentor Service...');
    
    if (this.geminiApiKey) {
      this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048,
        }
      });
      console.log('✅ AI Mentor initialized with Gemini');
    } else {
      console.warn('⚠️ Using fallback AI responses');
    }
  }

  // 1. AI CHAT MENTOR
  async chatMentor(message, context = {}) {
    const { currentChapter, quizScore, roadmapProgress, skill, weakAreas } = context;
    
    console.log(`💬 AI Mentor responding to: "${message.substring(0, 50)}..."`);
    
    const prompt = `
You are a supportive AI mentor helping a student learn ${skill || 'programming'}.

STUDENT CONTEXT:
- Currently studying: ${currentChapter || 'General concepts'}
- Last quiz score: ${quizScore || 'N/A'}%
- Overall progress: ${roadmapProgress || 0}%
- Weak areas: ${weakAreas || 'None identified'}

Student's question: "${message}"

Provide a helpful, encouraging response (max 250 words) that:
1. Directly answers their question
2. Uses simple analogies and real-world examples
3. Gives actionable tips specific to ${skill || 'their learning'}
4. Encourages continued learning
5. Suggests next steps if appropriate

Be conversational, supportive, and practical.`;

    try {
      if (this.model) {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        
        return {
          success: true,
          message: response.text(),
          suggestions: this.generateSuggestions(message, skill),
          context: context,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Chat mentor error:', error);
    }
    
    // Fallback response
    return {
      success: true,
      message: this.generateFallbackResponse(message, context),
      suggestions: this.generateSuggestions(message, skill),
      context: context,
      timestamp: new Date().toISOString()
    };
  }

  // 2. QUIZ GENERATOR
  async generateQuiz(chapterContent, difficulty = 'medium', questionCount = 10) {
    console.log(`📝 Generating ${difficulty} quiz for: ${chapterContent.title}`);
    
    const prompt = `
Create a comprehensive quiz for this chapter:
Title: ${chapterContent.title}
Description: ${chapterContent.description}
Topics: ${chapterContent.topics?.join(', ') || 'General topics'}

Generate exactly ${questionCount} questions with these types:
- 40% Multiple choice (4 options each)
- 30% True/False
- 20% Short answer
- 10% Code/practical questions

Difficulty level: ${difficulty}

Return valid JSON only:
{
  "title": "Quiz: ${chapterContent.title}",
  "difficulty": "${difficulty}",
  "totalQuestions": ${questionCount},
  "passingScore": 70,
  "timeLimit": ${questionCount * 2},
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "difficulty": "easy",
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why this answer is correct",
      "points": 10,
      "category": "concept"
    }
  ]
}`;

    try {
      if (this.model) {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const quizData = this.parseJSON(response.text());
        
        return {
          success: true,
          quiz: quizData,
          chapter: chapterContent.title,
          generatedAt: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Quiz generation error:', error);
    }
    
    return this.generateFallbackQuiz(chapterContent, difficulty, questionCount);
  }

  // 3. CAREER MATCH ANALYZER
  async analyzeCareerMatch(userSkills, jobDescription, targetRole) {
    console.log(`🎯 Analyzing career match for: ${targetRole}`);
    
    const prompt = `
Analyze how well this candidate matches the job requirements:

CANDIDATE SKILLS:
${Array.isArray(userSkills) ? userSkills.join(', ') : userSkills}

JOB DESCRIPTION:
${jobDescription}

TARGET ROLE: ${targetRole}

Provide detailed analysis in JSON format:
{
  "matchPercentage": 85,
  "overallAssessment": "Strong match with some gaps",
  "matchedSkills": ["skill1", "skill2", "skill3"],
  "missingSkills": [
    {
      "skill": "Missing skill name",
      "importance": "High/Medium/Low",
      "timeToLearn": "2-4 weeks",
      "difficulty": "Easy/Medium/Hard"
    }
  ],
  "recommendations": [
    "Focus on learning X first",
    "Practice Y through projects",
    "Get certified in Z"
  ],
  "actionPlan": {
    "immediate": "What to do in next 2 weeks",
    "shortTerm": "Goals for next 1-2 months", 
    "longTerm": "6-month objectives"
  },
  "estimatedReadiness": "6-8 weeks",
  "alternativeRoles": ["Similar role 1", "Similar role 2"],
  "salaryExpectation": "$XX,000 - $XX,000"
}`;

    try {
      if (this.model) {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const analysis = this.parseJSON(response.text());
        
        return {
          success: true,
          analysis: analysis,
          targetRole: targetRole,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Career match error:', error);
    }
    
    return this.generateFallbackCareerMatch(userSkills, targetRole);
  }

  // 4. CONTENT CURATOR
  async curateContent(topic, skill, level = 'beginner') {
    console.log(`📚 Curating content for: ${skill} - ${topic} (${level})`);
    
    try {
      // Get YouTube videos
      const youtubeQuery = `${skill} ${topic} ${level} tutorial`;
      const youtubeResults = await youtubeService.searchVideos(youtubeQuery, { 
        maxResults: 8,
        safeSearch: 'strict'
      });

      // Get web articles (simplified search)
      const webResults = await this.searchWeb(topic, skill, level);

      // Use AI to curate and rank
      if (this.model && (youtubeResults.success || webResults.length > 0)) {
        const curationPrompt = `
Analyze and curate these learning resources for "${topic}" in ${skill} at ${level} level:

YOUTUBE VIDEOS:
${youtubeResults.success ? youtubeResults.data.videos.map((v, i) => 
  `${i+1}. ${v.title} - ${v.channel?.title} (${v.duration || 'N/A'})`
).join('\n') : 'No videos found'}

WEB ARTICLES:
${webResults.map((a, i) => `${i+1}. ${a.title} - ${a.source}`).join('\n')}

Rank and recommend the best 5 resources. Return JSON:
{
  "recommendedResources": [
    {
      "title": "Resource title",
      "type": "video/article",
      "difficulty": "beginner/intermediate/advanced",
      "quality": 4.5,
      "summary": "Brief 2-line summary",
      "estimatedTime": "30 mins",
      "why": "Why this is recommended",
      "url": "resource URL"
    }
  ],
  "learningPath": "Suggested order to study these resources",
  "totalTime": "3-4 hours",
  "nextSteps": "What to do after completing these resources"
}`;

        const result = await this.model.generateContent(curationPrompt);
        const curated = this.parseJSON(result.response.text());
        
        return {
          success: true,
          curated: curated,
          rawData: {
            youtube: youtubeResults.success ? youtubeResults.data.videos : [],
            articles: webResults
          },
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Content curation error:', error);
    }

    return this.generateFallbackContent(topic, skill, level);
  }

  // 5. ANALYTICS INSIGHTS GENERATOR
  async generateInsights(userProgress) {
    const { 
      completedChapters, 
      totalChapters, 
      averageQuizScore, 
      studyStreak, 
      totalStudyTime, 
      skill,
      weakAreas,
      strongAreas 
    } = userProgress;
    
    console.log(`📊 Generating insights for ${skill} progress`);
    
    const prompt = `
Analyze this student's learning progress and provide actionable insights:

PROGRESS DATA:
- Skill: ${skill}
- Completed: ${completedChapters}/${totalChapters} chapters (${Math.round(completedChapters/totalChapters*100)}%)
- Average quiz score: ${averageQuizScore}%
- Study streak: ${studyStreak} days
- Total study time: ${totalStudyTime} hours
- Strong areas: ${strongAreas?.join(', ') || 'None identified'}
- Weak areas: ${weakAreas?.join(', ') || 'None identified'}

Generate personalized insights in JSON:
{
  "performanceAnalysis": {
    "overall": "Excellent/Good/Needs Improvement",
    "strengths": ["strength1", "strength2"],
    "improvements": ["area1", "area2"],
    "peerComparison": "X% faster/slower than average"
  },
  "predictions": {
    "completionDate": "Estimated completion date",
    "skillLevel": "Current skill level",
    "careerReadiness": "X% ready for entry-level positions"
  },
  "motivationalMessage": "Personalized encouraging message",
  "recommendations": {
    "focus": "What to focus on next",
    "studyTips": ["tip1", "tip2", "tip3"],
    "resources": ["resource1", "resource2"]
  },
  "achievements": {
    "recent": ["achievement1", "achievement2"],
    "nextMilestone": "Next goal to reach",
    "pointsToNext": 150
  },
  "warnings": ["Any concerns about progress"]
}`;

    try {
      if (this.model) {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const insights = this.parseJSON(response.text());
        
        return {
          success: true,
          insights: insights,
          skill: skill,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Insights generation error:', error);
    }
    
    return this.generateFallbackInsights(userProgress);
  }

  // Helper Methods
  parseJSON(text) {
    try {
      let jsonStr = text.trim();
      
      // Remove markdown code blocks
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/\n?```/g, '');
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.replace(/```\n?/g, '');
      }
      
      // Extract JSON object
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('JSON parse error:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  async searchWeb(topic, skill, level) {
    // Simplified web search - in production, use Google Custom Search API
    return [
      {
        title: `${skill} ${topic} Guide for ${level}s`,
        source: 'MDN Web Docs',
        url: `https://developer.mozilla.org/search?q=${encodeURIComponent(topic)}`
      },
      {
        title: `Learn ${topic} in ${skill}`,
        source: 'freeCodeCamp',
        url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(topic)}`
      },
      {
        title: `${skill} ${topic} Tutorial`,
        source: 'GeeksforGeeks',
        url: `https://www.geeksforgeeks.org/${topic.toLowerCase().replace(/\s+/g, '-')}/`
      }
    ];
  }

  generateSuggestions(message, skill) {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('help') || messageLower.includes('stuck')) {
      return [
        `Try breaking down the ${skill} problem into smaller parts`,
        'Look for similar examples online',
        'Practice with simpler exercises first'
      ];
    } else if (messageLower.includes('project') || messageLower.includes('build')) {
      return [
        `Start with a simple ${skill} project`,
        'Plan your project structure first',
        'Build incrementally and test often'
      ];
    } else if (messageLower.includes('career') || messageLower.includes('job')) {
      return [
        `Build a portfolio showcasing your ${skill} skills`,
        'Practice coding interviews',
        'Network with other developers'
      ];
    }
    
    return [
      'Keep practicing regularly',
      'Join online communities',
      'Work on real projects'
    ];
  }

  generateFallbackResponse(message, context) {
    const { skill, currentChapter, quizScore } = context;
    
    if (message.toLowerCase().includes('help')) {
      return `I understand you need help with ${skill}${currentChapter ? ` in ${currentChapter}` : ''}. Break the problem into smaller steps, practice regularly, and don't hesitate to look up documentation. You're doing great${quizScore ? ` with ${quizScore}% on your last quiz` : ''}!`;
    }
    
    if (message.toLowerCase().includes('project')) {
      return `For ${skill} projects, start simple and build complexity gradually. Plan your approach, write clean code, and test frequently. Each project teaches you something new!`;
    }
    
    return `Great question about ${skill}! Remember that learning takes time and practice. Focus on understanding the fundamentals, build projects to apply your knowledge, and stay consistent with your studies. You're making progress!`;
  }

  generateFallbackQuiz(chapterContent, difficulty, questionCount) {
    const questions = [];
    
    for (let i = 1; i <= questionCount; i++) {
      if (i <= questionCount * 0.4) {
        // Multiple choice questions
        questions.push({
          id: i,
          type: 'multiple-choice',
          difficulty: difficulty,
          question: `Which of the following is a key concept in ${chapterContent.title}?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option A',
          explanation: 'This is the correct answer based on the chapter content.',
          points: 10,
          category: 'concept'
        });
      } else if (i <= questionCount * 0.7) {
        // True/False questions
        questions.push({
          id: i,
          type: 'true-false',
          difficulty: difficulty,
          question: `${chapterContent.title} involves complex problem-solving techniques.`,
          correctAnswer: 'True',
          explanation: 'This statement is correct based on the chapter material.',
          points: 8,
          category: 'understanding'
        });
      } else {
        // Short answer questions
        questions.push({
          id: i,
          type: 'short-answer',
          difficulty: difficulty,
          question: `Explain a key benefit of applying ${chapterContent.title} concepts.`,
          correctAnswer: 'Sample answer about the benefits and applications.',
          explanation: 'This answer demonstrates understanding of practical applications.',
          points: 15,
          category: 'application'
        });
      }
    }

    return {
      success: true,
      quiz: {
        title: `Quiz: ${chapterContent.title}`,
        difficulty: difficulty,
        totalQuestions: questionCount,
        passingScore: 70,
        timeLimit: questionCount * 2,
        questions: questions
      },
      chapter: chapterContent.title,
      generatedAt: new Date().toISOString()
    };
  }

  generateFallbackCareerMatch(userSkills, targetRole) {
    const skillsArray = Array.isArray(userSkills) ? userSkills : [userSkills];
    const matchPercentage = Math.min(90, 60 + (skillsArray.length * 5));
    
    return {
      success: true,
      analysis: {
        matchPercentage: matchPercentage,
        overallAssessment: matchPercentage > 80 ? 'Strong match' : matchPercentage > 60 ? 'Good match with some gaps' : 'Needs development',
        matchedSkills: skillsArray.slice(0, 3),
        missingSkills: [
          {
            skill: 'Communication Skills',
            importance: 'High',
            timeToLearn: '2-4 weeks',
            difficulty: 'Medium'
          },
          {
            skill: 'Problem Solving',
            importance: 'High',
            timeToLearn: '1-2 months',
            difficulty: 'Medium'
          }
        ],
        recommendations: [
          'Build more projects to showcase your skills',
          'Practice technical interviews',
          'Develop soft skills through team projects'
        ],
        actionPlan: {
          immediate: 'Update your resume and portfolio',
          shortTerm: 'Complete 2-3 relevant projects',
          longTerm: 'Gain experience through internships or freelance work'
        },
        estimatedReadiness: '6-8 weeks',
        alternativeRoles: [`Junior ${targetRole}`, `${targetRole} Intern`, 'Related Developer Role'],
        salaryExpectation: '$60,000 - $90,000'
      },
      targetRole: targetRole,
      timestamp: new Date().toISOString()
    };
  }

  generateFallbackContent(topic, skill, level) {
    return {
      success: true,
      curated: {
        recommendedResources: [
          {
            title: `${skill} ${topic} Complete Guide`,
            type: 'article',
            difficulty: level,
            quality: 4.2,
            summary: `Comprehensive guide covering ${topic} concepts in ${skill}. Perfect for ${level} learners.`,
            estimatedTime: '45 mins',
            why: 'Well-structured content with practical examples',
            url: `https://developer.mozilla.org/search?q=${encodeURIComponent(topic)}`
          },
          {
            title: `${topic} Tutorial for ${skill}`,
            type: 'video',
            difficulty: level,
            quality: 4.5,
            summary: `Step-by-step video tutorial explaining ${topic} with hands-on examples.`,
            estimatedTime: '30 mins',
            why: 'Visual learning with practical demonstrations',
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' ' + topic)}`
          }
        ],
        learningPath: `Start with the article to understand concepts, then watch the video for practical implementation`,
        totalTime: '1-2 hours',
        nextSteps: `Practice implementing ${topic} in your own ${skill} projects`
      },
      timestamp: new Date().toISOString()
    };
  }

  generateFallbackInsights(userProgress) {
    const { completedChapters, totalChapters, averageQuizScore, studyStreak, skill } = userProgress;
    const progressPercent = Math.round((completedChapters / totalChapters) * 100);
    
    return {
      success: true,
      insights: {
        performanceAnalysis: {
          overall: averageQuizScore >= 80 ? 'Excellent' : averageQuizScore >= 70 ? 'Good' : 'Needs Improvement',
          strengths: ['Consistent study habits', 'Good progress pace'],
          improvements: averageQuizScore < 70 ? ['Quiz performance', 'Concept understanding'] : ['Advanced topics'],
          peerComparison: `${progressPercent > 60 ? '15% faster' : '5% slower'} than average`
        },
        predictions: {
          completionDate: `${Math.ceil((totalChapters - completedChapters) * 2)} weeks`,
          skillLevel: progressPercent > 70 ? 'Intermediate' : 'Beginner',
          careerReadiness: `${Math.min(90, progressPercent + 20)}% ready for entry-level positions`
        },
        motivationalMessage: `Great progress on your ${skill} journey! You've completed ${progressPercent}% of your roadmap. Keep up the momentum!`,
        recommendations: {
          focus: progressPercent < 50 ? 'Master the fundamentals' : 'Work on practical projects',
          studyTips: ['Set daily study goals', 'Practice coding regularly', 'Join study groups'],
          resources: ['Official documentation', 'Practice platforms', 'Community forums']
        },
        achievements: {
          recent: studyStreak > 7 ? ['Week-long study streak!'] : ['Making steady progress'],
          nextMilestone: `Complete ${Math.ceil(totalChapters * 0.1)} more chapters`,
          pointsToNext: 200
        },
        warnings: averageQuizScore < 60 ? ['Consider reviewing previous chapters'] : []
      },
      skill: skill,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new AIMentorService();
