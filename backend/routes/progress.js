const express = require('express');
const router = express.Router();
const progressTrackingService = require('../services/progressTrackingService');

// Mock middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  req.userId = 'mock-user-id';
  next();
};

// @route   GET /api/progress
// @desc    Get user's overall progress
// @access  Private
router.get('/', authenticateToken, (req, res) => {
  try {
    const progress = progressTrackingService.getUserProgress(req.userId);
    res.json(progress);
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress',
      error: error.message
    });
  }
});

// @route   GET /api/progress/dashboard
// @desc    Get comprehensive dashboard statistics
// @access  Private
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const stats = await progressTrackingService.getDashboardStats(req.userId);
    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
});

// @route   GET /api/progress/roadmap/:roadmapId
// @desc    Get roadmap-specific progress
// @access  Private
router.get('/roadmap/:roadmapId', authenticateToken, (req, res) => {
  try {
    const { roadmapId } = req.params;
    const progress = progressTrackingService.getRoadmapProgress(req.userId, roadmapId);
    res.json(progress);
  } catch (error) {
    console.error('Roadmap progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roadmap progress',
      error: error.message
    });
  }
});

// @route   POST /api/progress/chapter/:chapterId
// @desc    Update chapter progress
// @access  Private
router.post('/chapter/:chapterId', authenticateToken, (req, res) => {
  try {
    const { chapterId } = req.params;
    const { progress, status, quizScore } = req.body;
    
    const result = progressTrackingService.updateChapterProgress(
      req.userId,
      parseInt(chapterId),
      { progress, status, quizScore }
    );
    
    res.json(result);
  } catch (error) {
    console.error('Chapter progress update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update chapter progress',
      error: error.message
    });
  }
});

// @route   POST /api/progress/skill/:skill
// @desc    Update skill progress
// @access  Private
router.post('/skill/:skill', authenticateToken, (req, res) => {
  try {
    const { skill } = req.params;
    const { progress } = req.body;
    
    const result = progressTrackingService.updateSkillProgress(
      req.userId,
      skill,
      progress
    );
    
    res.json(result);
  } catch (error) {
    console.error('Skill progress update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update skill progress',
      error: error.message
    });
  }
});

// @route   POST /api/progress/activity
// @desc    Log learning activity
// @access  Private
router.post('/activity', authenticateToken, (req, res) => {
  try {
    const { type, title, description, timeSpent, pointsEarned, chapterId } = req.body;
    
    const result = progressTrackingService.logActivity(
      req.userId,
      { type, title, description, timeSpent, pointsEarned, chapterId }
    );
    
    res.json(result);
  } catch (error) {
    console.error('Activity log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log activity',
      error: error.message
    });
  }
});

// @route   GET /api/progress/analytics
// @desc    Get detailed progress analytics
// @access  Private
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const analytics = await progressTrackingService.getProgressAnalytics(req.userId);
    res.json(analytics);
  } catch (error) {
    console.error('Progress analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress analytics',
      error: error.message
    });
  }
});

// @route   GET /api/progress/streak
// @desc    Get current learning streak information
// @access  Private
router.get('/streak', authenticateToken, (req, res) => {
  try {
    const streak = progressTrackingService.calculateLearningStreak(req.userId);
    res.json({ success: true, data: streak });
  } catch (error) {
    console.error('Streak fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch streak data',
      error: error.message
    });
  }
});

// @route   GET /api/progress/skills
// @desc    Get skills mastery data
// @access  Private
router.get('/skills', authenticateToken, (req, res) => {
  try {
    const skills = progressTrackingService.calculateSkillsMastery(req.userId);
    res.json({ success: true, data: skills });
  } catch (error) {
    console.error('Skills mastery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills mastery',
      error: error.message
    });
  }
});

// @route   POST /api/progress/reset
// @desc    Reset user progress (for testing or starting over)
// @access  Private
router.post('/reset', authenticateToken, (req, res) => {
  try {
    const result = progressTrackingService.resetUserProgress(req.userId);
    res.json(result);
  } catch (error) {
    console.error('Progress reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset progress',
      error: error.message
    });
  }
});

module.exports = router;
