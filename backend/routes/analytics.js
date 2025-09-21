const express = require('express');
const router = express.Router();
const dynamicRoadmapService = require('../services/dynamicRoadmapService');
const cleanGeminiService = require('../services/cleanGeminiService');
const workingGeminiService = require('../services/workingGeminiService');
const { body, validationResult } = require('express-validator');
const geminiService = require('../services/geminiService');

// Mock middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  req.userId = 'mock-user-id';
  next();
};

// @route   GET /api/analytics/market/dynamic
// @desc    Get dynamic market analytics using// Generate dynamic market analytics with AI and questionnaire data
router.post('/market/dynamic', async (req, res) => {
  try {
    const { skill, location = 'Global', userProfile } = req.body;
    
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Skill parameter is required'
      });
    }
    
    console.log(`📊 Generating personalized analytics for ${skill} in ${location}`);
    console.log(`👤 User Profile:`, userProfile);
    
    const result = await workingGeminiService.generateAnalytics(skill, location, userProfile);
    
    res.json(result);
  } catch (error) {
    console.error('Error generating dynamic analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate analytics',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/market
// @desc    Get market analytics for skills/careers
// @access  Public
router.get('/market', authenticateToken, async (req, res) => {
  try {
    const { domain = 'data-science', region = 'global' } = req.query;
    
    // Generate market analysis with Gemini AI
    const analysisData = await geminiService.generateAnalysis(
      `Market analysis for ${domain}`,
      { 
        context: `Region: ${region}`,
        metrics: { domain, region }
      }
    );

    const marketData = {
      domain,
      region,
      aiAnalysis: analysisData.analysis,  // Gemini AI analysis
      aiConfidence: analysisData.confidence,
      overview: {
        totalJobs: 125000,
        growthRate: 35,
        averageSalary: 120000,
        competitionIndex: 2.3,
        demandScore: 9.2
      },
      forecast: {
        years: ['2024', '2025', '2026', '2027', '2028', '2029', '2030'],
        demand: [100, 125, 155, 190, 235, 285, 340],
        supply: [80, 85, 95, 110, 125, 145, 170],
        salaryGrowth: [100, 108, 117, 126, 136, 147, 159]
      },
      regionalData: [
        { region: 'North America', opportunities: 45, avgSalary: 130000, growth: 38 },
        { region: 'Europe', opportunities: 30, avgSalary: 95000, growth: 32 },
        { region: 'Asia Pacific', opportunities: 35, avgSalary: 85000, growth: 42 },
        { region: 'Others', opportunities: 15, avgSalary: 70000, growth: 28 }
      ],
      topSkills: [
        { skill: 'Python', demand: 95, growth: '+45%', avgSalary: 125000 },
        { skill: 'Machine Learning', demand: 88, growth: '+60%', avgSalary: 135000 },
        { skill: 'SQL', demand: 92, growth: '+25%', avgSalary: 110000 },
        { skill: 'Deep Learning', demand: 75, growth: '+70%', avgSalary: 145000 },
        { skill: 'Data Visualization', demand: 80, growth: '+35%', avgSalary: 115000 }
      ],
      industryBreakdown: [
        { industry: 'Technology', percentage: 35, avgSalary: 140000 },
        { industry: 'Finance', percentage: 25, avgSalary: 135000 },
        { industry: 'Healthcare', percentage: 20, avgSalary: 125000 },
        { industry: 'Retail', percentage: 12, avgSalary: 110000 },
        { industry: 'Others', percentage: 8, avgSalary: 105000 }
      ],
      experienceLevels: [
        { level: 'Entry Level', percentage: 30, avgSalary: 85000, growth: '+40%' },
        { level: 'Mid Level', percentage: 45, avgSalary: 125000, growth: '+35%' },
        { level: 'Senior Level', percentage: 25, avgSalary: 165000, growth: '+30%' }
      ],
      insights: [
        {
          type: 'opportunity',
          title: 'High Demand, Low Supply',
          description: 'Demand is growing 2.5x faster than supply, creating excellent opportunities for new entrants.',
          impact: 'high'
        },
        {
          type: 'trend',
          title: 'Remote Work Surge',
          description: 'Remote data science positions increased by 65% in the last year.',
          impact: 'medium'
        },
        {
          type: 'skill',
          title: 'AI/ML Skills Premium',
          description: 'Professionals with AI/ML skills earn 25% more than those without.',
          impact: 'high'
        }
      ],
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: marketData
    });
  } catch (error) {
    console.error('Get market analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/analytics/user-progress
// @desc    Get detailed user progress analytics
// @access  Private
router.get('/user-progress', authenticateToken, (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;

    const progressAnalytics = {
      timeframe,
      overview: {
        totalHours: 45,
        completedChapters: 3,
        totalPoints: 2450,
        currentStreak: 7,
        averageSessionTime: 65, // minutes
        weeklyGoal: 10,
        weeklyProgress: 8.5
      },
      learningPattern: {
        dailyActivity: [
          { date: '2024-01-15', hours: 2.5, points: 150 },
          { date: '2024-01-16', hours: 1.8, points: 120 },
          { date: '2024-01-17', hours: 3.2, points: 200 },
          { date: '2024-01-18', hours: 2.1, points: 135 },
          { date: '2024-01-19', hours: 2.8, points: 180 },
          { date: '2024-01-20', hours: 1.5, points: 95 },
          { date: '2024-01-21', hours: 2.9, points: 175 }
        ],
        preferredTimes: [
          { hour: 9, sessions: 15 },
          { hour: 14, sessions: 8 },
          { hour: 20, sessions: 22 },
          { hour: 21, sessions: 18 }
        ],
        weeklyPattern: [
          { day: 'Monday', avgHours: 2.3 },
          { day: 'Tuesday', avgHours: 1.8 },
          { day: 'Wednesday', avgHours: 2.5 },
          { day: 'Thursday', avgHours: 2.1 },
          { day: 'Friday', avgHours: 1.5 },
          { day: 'Saturday', avgHours: 3.2 },
          { day: 'Sunday', avgHours: 2.8 }
        ]
      },
      skillProgress: [
        { skill: 'Python', currentLevel: 85, targetLevel: 90, progress: 94 },
        { skill: 'Statistics', currentLevel: 70, targetLevel: 85, progress: 82 },
        { skill: 'Machine Learning', currentLevel: 45, targetLevel: 75, progress: 60 },
        { skill: 'Data Visualization', currentLevel: 60, targetLevel: 80, progress: 75 }
      ],
      chapterAnalytics: [
        {
          chapterId: 1,
          title: 'Python Fundamentals',
          timeSpent: 25,
          completionRate: 100,
          averageQuizScore: 92,
          retakeCount: 0,
          difficulty: 'Easy'
        },
        {
          chapterId: 2,
          title: 'Data Analysis with Pandas',
          timeSpent: 20,
          completionRate: 100,
          averageQuizScore: 88,
          retakeCount: 1,
          difficulty: 'Medium'
        },
        {
          chapterId: 3,
          title: 'Statistics & Probability',
          timeSpent: 15,
          completionRate: 43,
          averageQuizScore: 85,
          retakeCount: 0,
          difficulty: 'Hard'
        }
      ],
      comparisons: {
        peerAverage: {
          hoursPerWeek: 6.2,
          pointsPerWeek: 420,
          completionRate: 68
        },
        userStats: {
          hoursPerWeek: 8.5,
          pointsPerWeek: 580,
          completionRate: 75
        },
        percentile: 78 // User is in top 22%
      },
      predictions: {
        estimatedCompletionDate: new Date('2024-08-15'),
        projectedFinalScore: 87,
        riskFactors: [
          {
            factor: 'Consistency',
            risk: 'low',
            description: 'Strong learning streak indicates good consistency'
          },
          {
            factor: 'Difficulty Scaling',
            risk: 'medium',
            description: 'Upcoming chapters are more challenging'
          }
        ],
        recommendations: [
          'Maintain current pace to finish 2 weeks early',
          'Focus extra time on Statistics concepts',
          'Consider joining study groups for ML topics'
        ]
      },
      achievements: {
        recent: [
          {
            id: 'week_streak',
            title: 'Week Streak',
            unlockedAt: new Date(),
            points: 200
          }
        ],
        upcoming: [
          {
            id: 'month_streak',
            title: 'Month Streak',
            progress: 23,
            target: 30,
            estimatedUnlock: new Date(Date.now() + 604800000)
          }
        ]
      }
    };

    res.json({
      success: true,
      data: progressAnalytics
    });
  } catch (error) {
    console.error('Get user progress analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/analytics/skill-demand
// @desc    Get skill demand analytics
// @access  Private
router.get('/skill-demand', authenticateToken, (req, res) => {
  try {
    const { skills, region = 'global' } = req.query;
    const skillList = skills ? skills.split(',') : ['Python', 'Machine Learning', 'SQL'];

    const skillDemand = {
      skills: skillList.map(skill => ({
        name: skill,
        demandScore: Math.floor(Math.random() * 30) + 70, // 70-100
        growthRate: `+${Math.floor(Math.random() * 50) + 20}%`, // +20% to +70%
        averageSalary: Math.floor(Math.random() * 50000) + 100000, // $100k-$150k
        jobCount: Math.floor(Math.random() * 10000) + 5000, // 5k-15k jobs
        difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
        timeToLearn: `${Math.floor(Math.random() * 8) + 2}-${Math.floor(Math.random() * 4) + 6} months`,
        relatedSkills: ['Python', 'SQL', 'Statistics', 'Machine Learning'].filter(s => s !== skill).slice(0, 3),
        topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].slice(0, 3),
        certifications: [
          `${skill} Professional Certificate`,
          `Advanced ${skill} Specialization`
        ]
      })),
      marketTrends: {
        emerging: [
          { skill: 'MLOps', growth: '+85%', description: 'Machine Learning Operations' },
          { skill: 'LLM Engineering', growth: '+120%', description: 'Large Language Model Engineering' },
          { skill: 'Edge AI', growth: '+65%', description: 'AI at the Edge Computing' }
        ],
        declining: [
          { skill: 'Legacy BI Tools', growth: '-15%', description: 'Traditional Business Intelligence' },
          { skill: 'Basic Excel', growth: '-8%', description: 'Basic spreadsheet skills' }
        ],
        stable: [
          { skill: 'SQL', growth: '+5%', description: 'Database querying remains essential' },
          { skill: 'Statistics', growth: '+8%', description: 'Statistical analysis fundamentals' }
        ]
      },
      industryDemand: [
        { industry: 'Technology', demandLevel: 'Very High', avgSalary: 145000 },
        { industry: 'Finance', demandLevel: 'High', avgSalary: 135000 },
        { industry: 'Healthcare', demandLevel: 'High', avgSalary: 125000 },
        { industry: 'Retail', demandLevel: 'Medium', avgSalary: 110000 },
        { industry: 'Manufacturing', demandLevel: 'Medium', avgSalary: 105000 }
      ],
      geographicDemand: [
        { location: 'San Francisco Bay Area', demandScore: 95, avgSalary: 165000 },
        { location: 'New York City', demandScore: 88, avgSalary: 155000 },
        { location: 'Seattle', demandScore: 85, avgSalary: 150000 },
        { location: 'Austin', demandScore: 78, avgSalary: 135000 },
        { location: 'Remote', demandScore: 82, avgSalary: 140000 }
      ],
      recommendations: [
        {
          type: 'high_priority',
          skill: 'Machine Learning',
          reason: 'Highest growth potential with premium salaries',
          action: 'Start learning immediately'
        },
        {
          type: 'complement',
          skill: 'MLOps',
          reason: 'Complements your ML skills for production deployment',
          action: 'Add to roadmap after ML basics'
        },
        {
          type: 'foundation',
          skill: 'Statistics',
          reason: 'Essential foundation for all data science roles',
          action: 'Strengthen current knowledge'
        }
      ]
    };

    res.json({
      success: true,
      data: skillDemand
    });
  } catch (error) {
    console.error('Get skill demand analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/analytics/track-event
// @desc    Track user interaction events
// @access  Private
router.post('/track-event', [
  authenticateToken,
  body('event').isString(),
  body('category').isString(),
  body('properties').optional().isObject()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { event, category, properties = {} } = req.body;

    const trackedEvent = {
      id: `event_${Date.now()}`,
      userId: req.userId,
      event,
      category,
      properties,
      timestamp: new Date(),
      sessionId: `session_${Date.now()}`,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    };

    // In production, this would be sent to analytics service
    console.log('Event tracked:', trackedEvent);

    res.json({
      success: true,
      message: 'Event tracked successfully',
      data: {
        eventId: trackedEvent.id,
        timestamp: trackedEvent.timestamp
      }
    });
  } catch (error) {
    console.error('Track event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/analytics/learning-insights
// @desc    Get AI-powered learning insights
// @access  Private
router.get('/learning-insights', authenticateToken, (req, res) => {
  try {
    const insights = {
      personalizedInsights: [
        {
          type: 'strength',
          title: 'Strong Python Foundation',
          description: 'Your Python skills are above average. You completed the fundamentals 20% faster than typical learners.',
          confidence: 0.92,
          actionable: false
        },
        {
          type: 'improvement',
          title: 'Statistics Concepts Need Attention',
          description: 'You\'re spending more time on statistics topics. Consider additional practice with probability distributions.',
          confidence: 0.85,
          actionable: true,
          suggestions: [
            'Review Khan Academy probability course',
            'Practice with additional problem sets',
            'Join statistics study group'
          ]
        },
        {
          type: 'opportunity',
          title: 'Ready for Advanced Topics',
          description: 'Based on your progress, you\'re ready to tackle machine learning concepts earlier than planned.',
          confidence: 0.78,
          actionable: true,
          suggestions: [
            'Start ML fundamentals course',
            'Begin working on first ML project',
            'Explore scikit-learn library'
          ]
        }
      ],
      learningEfficiency: {
        overallScore: 82,
        factors: [
          { factor: 'Consistency', score: 88, impact: 'high' },
          { factor: 'Focus Time', score: 75, impact: 'medium' },
          { factor: 'Resource Utilization', score: 90, impact: 'high' },
          { factor: 'Practice Frequency', score: 70, impact: 'medium' }
        ],
        recommendations: [
          'Increase practice sessions to 3x per week',
          'Try pomodoro technique for better focus',
          'Set specific learning goals for each session'
        ]
      },
      predictiveInsights: [
        {
          prediction: 'Completion Timeline',
          current: '8-10 months',
          optimized: '6-8 months',
          confidence: 0.75,
          factors: ['Current pace', 'Skill acquisition rate', 'Time availability']
        },
        {
          prediction: 'Job Readiness',
          timeline: '5-6 months',
          confidence: 0.68,
          requirements: [
            'Complete ML fundamentals',
            'Build 2-3 portfolio projects',
            'Practice technical interviews'
          ]
        }
      ],
      benchmarking: {
        vsAverage: {
          learningSpeed: '+15%',
          retentionRate: '+22%',
          practiceFrequency: '+8%'
        },
        vsSimilarProfiles: {
          progressRate: '+12%',
          quizScores: '+18%',
          timeToCompletion: '-20%'
        },
        ranking: {
          overall: 'Top 25%',
          consistency: 'Top 15%',
          skillMastery: 'Top 30%'
        }
      },
      nextSteps: [
        {
          priority: 'high',
          action: 'Complete Statistics & Probability chapter',
          timeline: '1-2 weeks',
          impact: 'Unlocks ML fundamentals'
        },
        {
          priority: 'medium',
          action: 'Start first data science project',
          timeline: '2-3 weeks',
          impact: 'Portfolio building'
        },
        {
          priority: 'low',
          action: 'Join data science community',
          timeline: 'This week',
          impact: 'Networking and support'
        }
      ]
    };

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Get learning insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
