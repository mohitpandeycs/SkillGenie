const express = require('express');
const { body, validationResult } = require('express-validator');
const geminiService = require('../services/geminiService');
const workingGeminiService = require('../services/workingGeminiService');
const router = express.Router();

// Mock middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  req.userId = 'mock-user-id';
  next();
};

// Helper function to generate fallback questions
function generateFallbackQuestions(skill, chapterId) {
  const questions = [];
  for (let i = 1; i <= 10; i++) {
    questions.push({
      id: i,
      question: `Question ${i} about ${skill} - Chapter ${chapterId}`,
      type: 'multiple_choice',
      options: [
        `Option A for ${skill}`,
        `Option B for ${skill}`,
        `Option C for ${skill}`,
        `Option D for ${skill}`
      ],
      correct: Math.floor(Math.random() * 4),
      points: 15,
      explanation: `This is the explanation for question ${i} about ${skill}.`
    });
  }
  return questions;
}

// @route   GET /api/quizzes/chapter/:chapterId
// @desc    Get quiz for specific chapter
// @access  Private
router.get('/chapter/:chapterId', authenticateToken, async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { skill, chapter, difficulty = 'medium' } = req.query;

    // Don't default to Data Science - require skill to be provided
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Skill parameter is required. Please provide ?skill=YourSkill'
      });
    }

    console.log(`🧠 Generating quiz for: ${skill} - Chapter ${chapterId}`);

    // Generate quiz with working Gemini service
    let quizData;
    try {
      quizData = await workingGeminiService.generateQuiz(skill, chapter || `Chapter ${chapterId}`, difficulty);
    } catch (error) {
      console.log('Working service failed, using fallback quiz generation');
      quizData = {
        skill: skill,
        chapter: chapter || `Chapter ${chapterId}`,
        difficulty: difficulty,
        questions: generateFallbackQuestions(skill, chapterId)
      };
    }

    const quiz = {
      id: `quiz_${chapterId}`,
      chapterId: parseInt(chapterId),
      title: `${skill} Quiz - Chapter ${chapterId}`,
      description: `Test your understanding of ${skill}`,
      totalQuestions: quizData.questions?.length || 10,
      timeLimit: 600, // 10 minutes in seconds
      passingScore: 70,
      points: 150,
      difficulty: quizData.difficulty || difficulty,
      questions: quizData.questions || generateFallbackQuestions(skill, chapterId),
      skill: skill,
      chapter: chapter || `Chapter ${chapterId}`
    };

    res.json({
      success: true,
      data: quiz,
      generatedBy: quizData.generatedBy || 'Fallback System'
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quiz',
      error: error.message
    });
  }
});

// @route   POST /api/quizzes/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/submit', [
  authenticateToken,
  body('quizId').notEmpty().withMessage('Quiz ID is required'),
  body('answers').isArray().withMessage('Answers must be an array'),
  body('timeSpent').isInt({ min: 0 }).withMessage('Time spent must be a positive integer')
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

    const { quizId, answers, timeSpent } = req.body;
    
    // Calculate score (mock implementation)
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 70;

    const result = {
      id: `result_${Date.now()}`,
      quizId,
      userId: req.userId,
      score,
      passed,
      correctAnswers,
      totalQuestions,
      timeSpent,
      completedAt: new Date(),
      feedback: passed 
        ? `Great job! You scored ${score}%` 
        : `Keep practicing! You scored ${score}%. Review the material and try again.`,
      pointsEarned: passed ? 150 : Math.round(150 * (score / 100))
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
});

// @route   GET /api/quizzes/history
// @desc    Get user's quiz history
// @access  Private
router.get('/history', authenticateToken, async (req, res) => {
  try {
    // Mock quiz history
    const history = [
      {
        id: 'result_1',
        quizTitle: 'JavaScript Basics - Chapter 1',
        score: 85,
        passed: true,
        completedAt: new Date(Date.now() - 86400000),
        pointsEarned: 150
      },
      {
        id: 'result_2',
        quizTitle: 'Python Fundamentals - Chapter 2',
        score: 92,
        passed: true,
        completedAt: new Date(Date.now() - 172800000),
        pointsEarned: 150
      }
    ];

    res.json({
      success: true,
      data: history,
      totalQuizzes: history.length,
      averageScore: Math.round(history.reduce((acc, h) => acc + h.score, 0) / history.length)
    });
  } catch (error) {
    console.error('Quiz history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz history',
      error: error.message
    });
  }
});

// @route   GET /api/quizzes/progress/:chapterId
// @desc    Get quiz progress for a chapter
// @access  Private
router.get('/progress/:chapterId', authenticateToken, async (req, res) => {
  try {
    const { chapterId } = req.params;
    
    // Mock progress data
    const progress = {
      chapterId: parseInt(chapterId),
      completed: Math.random() > 0.5,
      attempts: Math.floor(Math.random() * 3) + 1,
      bestScore: Math.floor(Math.random() * 30) + 70,
      lastAttempt: new Date(Date.now() - Math.random() * 604800000),
      averageScore: Math.floor(Math.random() * 20) + 75
    };

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Quiz progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz progress',
      error: error.message
    });
  }
});

module.exports = router;
