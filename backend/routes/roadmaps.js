const express = require('express');
const router = express.Router();
const dynamicRoadmapService = require('../services/dynamicRoadmapService');
const enhancedGeminiAnalyst = require('../services/enhancedGeminiAnalyst');
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

// @route   GET /api/roadmaps
// @desc    Get user's roadmaps
// @access  Private
router.get('/', authenticateToken, (req, res) => {
  try {
    const roadmaps = [
      {
        id: 'data-science-ml',
        title: 'Data Science & Machine Learning',
        description: 'Complete roadmap from Python basics to advanced ML concepts',
        difficulty: 'Intermediate',
        estimatedDuration: '8-10 months',
        totalChapters: 8,
        completedChapters: 3,
        progress: 37.5,
        status: 'in_progress',
        createdAt: new Date(Date.now() - 86400000 * 30),
        updatedAt: new Date(Date.now() - 3600000),
        chapters: [
          {
            id: 1,
            title: 'Python Fundamentals',
            status: 'completed',
            progress: 100,
            estimatedHours: 25,
            completedHours: 25
          },
          {
            id: 2,
            title: 'Data Analysis with Pandas',
            status: 'completed',
            progress: 100,
            estimatedHours: 20,
            completedHours: 20
          },
          {
            id: 3,
            title: 'Statistics & Probability',
            status: 'in_progress',
            progress: 43,
            estimatedHours: 35,
            completedHours: 15
          },
          {
            id: 4,
            title: 'Data Visualization',
            status: 'locked',
            progress: 0,
            estimatedHours: 18,
            completedHours: 0
          }
        ]
      }
    ];

    res.json({
      success: true,
      data: roadmaps
    });
  } catch (error) {
    console.error('Get roadmaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/roadmaps/generate/dynamic
// @desc    Generate dynamic roadmap using Gemini AI for any skill
// @access  Public
router.post('/generate/dynamic', [
  body('skill').notEmpty().withMessage('Skill is required'),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
  body('duration').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { skill, level = 'beginner', duration = '3-6 months' } = req.body;
    
    console.log(`📚 [ROADMAP API] Request received:`);
    console.log(`   Skill: "${skill}"`);
    console.log(`   Level: ${level}`);
    console.log(`   Duration: ${duration}`);
    
    // Create user profile from request (or use default)
    const userProfile = {
      profile: {
        experience: level,
        education: 'Not specified',
        skills: [],
        careerGoals: `Master ${skill}`
      }
    };
    
    // Use enhancedGeminiAnalyst for detailed roadmap with sub-chapters
    const result = await enhancedGeminiAnalyst.generatePersonalizedRoadmap(
      userProfile, 
      skill, 
      {} // insights can be empty for now
    );
    
    console.log(`✅ [ROADMAP API] Response generated:`);
    console.log(`   Title: "${result.data?.title}"`);
    console.log(`   Chapters: ${result.data?.chapters?.length}`);
    if (result.data?.chapters?.[0]) {
      console.log(`   First chapter: "${result.data.chapters[0].title}"`);
      console.log(`   Sub-chapters: ${result.data.chapters[0].subChapters?.length || 0}`);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error generating dynamic roadmap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate roadmap',
      error: error.message
    });
  }
});

// @route   POST /api/roadmaps/generate
// @desc    Generate new roadmap based on user preferences
// @access  Private
router.post('/generate', [
  authenticateToken,
  body('preferences').isObject(),
  body('preferences.domains').isArray(),
  body('preferences.timeCommitment').isString(),
  body('preferences.learningStyle').isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { preferences } = req.body;

    // Generate roadmap with Gemini AI
    const userProfile = {
      goal: preferences.domains?.join(', ') || 'Data Science',
      experienceLevel: preferences.experienceLevel || 'Beginner',
      timeCommitment: preferences.timeCommitment || '2 hours/day',
      background: preferences.background || 'General',
      learningStyle: preferences.learningStyle || 'Visual'
    };

    const generatedRoadmap = await workingGeminiService.generateRoadmap(userProfile.goal, userProfile.experienceLevel);

    // Ensure consistent structure
    const roadmap = {
      id: `roadmap_${Date.now()}`,
      ...generatedRoadmap,
      preferences,
      createdAt: new Date(),
      status: 'not_started',
      progress: 0,
      completedChapters: 0
    };

    res.json({
      success: true,
      message: 'Roadmap generated successfully with Gemini AI',
      data: roadmap
    });
  } catch (error) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/roadmaps/:id
// @desc    Get specific roadmap details
// @access  Private
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const roadmap = {
      id,
      title: 'Data Science & Machine Learning',
      description: 'Complete roadmap from Python basics to advanced ML concepts',
      difficulty: 'Intermediate',
      estimatedDuration: '8-10 months',
      totalChapters: 8,
      completedChapters: 3,
      progress: 37.5,
      status: 'in_progress',
      createdAt: new Date(Date.now() - 86400000 * 30),
      updatedAt: new Date(Date.now() - 3600000),
      chapters: [
        {
          id: 1,
          title: 'Python Fundamentals',
          description: 'Master Python programming basics and syntax',
          status: 'completed',
          duration: '3 weeks',
          estimatedHours: 25,
          completedHours: 25,
          progress: 100,
          difficulty: 'Beginner',
          subChapters: [
            { title: 'Python Syntax & Variables', completed: true, duration: '2 days' },
            { title: 'Data Types & Structures', completed: true, duration: '3 days' },
            { title: 'Control Flow & Functions', completed: true, duration: '4 days' }
          ],
          resources: [
            { type: 'video', title: 'Python Crash Course', platform: 'YouTube', duration: '4h 30m' },
            { type: 'article', title: 'Python Best Practices', platform: 'Medium', readTime: '15 min' }
          ]
        },
        {
          id: 2,
          title: 'Data Analysis with Pandas',
          description: 'Learn data manipulation and analysis using Pandas',
          status: 'completed',
          duration: '2 weeks',
          estimatedHours: 20,
          completedHours: 20,
          progress: 100,
          difficulty: 'Beginner'
        },
        {
          id: 3,
          title: 'Statistics & Probability',
          description: 'Essential statistical concepts for data science',
          status: 'in_progress',
          duration: '4 weeks',
          estimatedHours: 35,
          completedHours: 15,
          progress: 43,
          difficulty: 'Medium'
        }
      ]
    };

    res.json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/roadmaps/:id/progress
// @desc    Update chapter progress
// @access  Private
router.put('/:id/progress', [
  authenticateToken,
  body('chapterId').isInt(),
  body('progress').isInt({ min: 0, max: 100 }),
  body('hoursSpent').isFloat({ min: 0 })
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

    const { id } = req.params;
    const { chapterId, progress, hoursSpent } = req.body;

    const updatedProgress = {
      roadmapId: id,
      chapterId,
      progress,
      hoursSpent,
      updatedAt: new Date(),
      pointsEarned: Math.floor(progress * 2) // 2 points per percent
    };

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: updatedProgress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/roadmaps/:id/unlock-chapter
// @desc    Unlock next chapter
// @access  Private
router.post('/:id/unlock-chapter', [
  authenticateToken,
  body('chapterId').isInt()
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

    const { id } = req.params;
    const { chapterId } = req.body;

    const unlockedChapter = {
      roadmapId: id,
      chapterId,
      unlockedAt: new Date(),
      status: 'unlocked',
      message: 'Chapter unlocked! You can now start learning.'
    };

    res.json({
      success: true,
      message: 'Chapter unlocked successfully',
      data: unlockedChapter
    });
  } catch (error) {
    console.error('Unlock chapter error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/roadmaps/:id/resources
// @desc    Get chapter resources
// @access  Private
router.get('/:id/resources/:chapterId', authenticateToken, (req, res) => {
  try {
    const { id, chapterId } = req.params;

    const resources = {
      chapterId: parseInt(chapterId),
      roadmapId: id,
      resources: [
        {
          id: 1,
          type: 'video',
          title: 'Python Fundamentals Course',
          platform: 'YouTube',
          url: 'https://youtube.com/watch?v=example',
          duration: '4h 30m',
          difficulty: 'Beginner',
          rating: 4.8,
          description: 'Comprehensive Python course covering all fundamentals'
        },
        {
          id: 2,
          type: 'article',
          title: 'Python Best Practices Guide',
          platform: 'Medium',
          url: 'https://medium.com/example',
          readTime: '15 min',
          difficulty: 'Intermediate',
          rating: 4.6,
          description: 'Essential best practices for writing clean Python code'
        },
        {
          id: 3,
          type: 'practice',
          title: 'Python Coding Challenges',
          platform: 'HackerRank',
          url: 'https://hackerrank.com/example',
          problems: 50,
          difficulty: 'Mixed',
          rating: 4.7,
          description: 'Hands-on coding challenges to reinforce learning'
        }
      ],
      totalResources: 3,
      recommendedOrder: [1, 2, 3]
    };

    res.json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
