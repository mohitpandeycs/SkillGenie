const express = require('express');
const router = express.Router();
const aiMentorService = require('../services/aiMentorService');
const { body, query, validationResult } = require('express-validator');

// @route   POST /api/ai-mentor/chat
// @desc    Chat with AI mentor
// @access  Public
router.post('/chat', [
  body('message').notEmpty().withMessage('Message is required'),
  body('context').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { message, context = {} } = req.body;
    
    console.log(`💬 AI Mentor chat request: "${message.substring(0, 50)}..."`);
    
    const response = await aiMentorService.chatMentor(message, context);
    
    res.json(response);
  } catch (error) {
    console.error('AI Mentor chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI mentor response',
      error: error.message
    });
  }
});

// @route   POST /api/ai-mentor/quiz/generate
// @desc    Generate quiz for a chapter
// @access  Public
router.post('/quiz/generate', [
  body('chapterContent').isObject().withMessage('Chapter content is required'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  body('questionCount').optional().isInt({ min: 5, max: 20 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { chapterContent, difficulty = 'medium', questionCount = 10 } = req.body;
    
    console.log(`📝 Generating quiz for: ${chapterContent.title}`);
    
    const quiz = await aiMentorService.generateQuiz(chapterContent, difficulty, questionCount);
    
    res.json(quiz);
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quiz',
      error: error.message
    });
  }
});

// @route   POST /api/ai-mentor/career/analyze
// @desc    Analyze career match
// @access  Public
router.post('/career/analyze', [
  body('userSkills').isArray().withMessage('User skills array is required'),
  body('jobDescription').notEmpty().withMessage('Job description is required'),
  body('targetRole').notEmpty().withMessage('Target role is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { userSkills, jobDescription, targetRole } = req.body;
    
    console.log(`🎯 Analyzing career match for: ${targetRole}`);
    
    const analysis = await aiMentorService.analyzeCareerMatch(userSkills, jobDescription, targetRole);
    
    res.json(analysis);
  } catch (error) {
    console.error('Career analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze career match',
      error: error.message
    });
  }
});

// @route   GET /api/ai-mentor/content/curate
// @desc    Curate learning content
// @access  Public
router.get('/content/curate', [
  query('topic').notEmpty().withMessage('Topic is required'),
  query('skill').notEmpty().withMessage('Skill is required'),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { topic, skill, level = 'beginner' } = req.query;
    
    console.log(`📚 Curating content for: ${skill} - ${topic} (${level})`);
    
    const content = await aiMentorService.curateContent(topic, skill, level);
    
    res.json(content);
  } catch (error) {
    console.error('Content curation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to curate content',
      error: error.message
    });
  }
});

// @route   POST /api/ai-mentor/insights/generate
// @desc    Generate learning insights
// @access  Public
router.post('/insights/generate', [
  body('userProgress').isObject().withMessage('User progress data is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { userProgress } = req.body;
    
    console.log(`📊 Generating insights for: ${userProgress.skill}`);
    
    const insights = await aiMentorService.generateInsights(userProgress);
    
    res.json(insights);
  } catch (error) {
    console.error('Insights generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate insights',
      error: error.message
    });
  }
});

// @route   GET /api/ai-mentor/suggestions
// @desc    Get AI-powered suggestions
// @access  Public
router.get('/suggestions', [
  query('skill').notEmpty().withMessage('Skill is required'),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
  query('context').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { skill, level = 'beginner', context } = req.query;
    
    // Generate contextual suggestions
    const suggestions = {
      success: true,
      suggestions: [
        `Start with ${skill} fundamentals if you're a ${level}`,
        `Practice ${skill} through hands-on projects`,
        `Join ${skill} communities for support`,
        `Build a portfolio showcasing your ${skill} skills`,
        `Stay updated with latest ${skill} trends`
      ],
      nextSteps: [
        `Set up your ${skill} development environment`,
        `Complete a beginner ${skill} tutorial`,
        `Build your first ${skill} project`
      ],
      resources: [
        `Official ${skill} documentation`,
        `${skill} community forums`,
        `${skill} practice platforms`
      ],
      timestamp: new Date().toISOString()
    };
    
    res.json(suggestions);
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions',
      error: error.message
    });
  }
});

module.exports = router;
