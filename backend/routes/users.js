const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  // In production, verify JWT token here
  req.userId = 'mock-user-id';
  next();
};

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, (req, res) => {
  try {
    // Mock user data
    const userProfile = {
      id: req.userId,
      email: 'user@example.com',
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/150x150/3B82F6/white?text=JD',
      profile: {
        education: 'undergraduate',
        experience: 'some_experience',
        skills: ['Python', 'Data Analysis', 'Machine Learning'],
        interests: ['Technology', 'Science'],
        learningStyle: 'mixed',
        goals: 'Become a data scientist',
        timeCommitment: '4-7'
      },
      progress: {
        completedChapters: 3,
        totalChapters: 8,
        totalPoints: 2450,
        currentStreak: 7,
        hoursLearned: 45,
        level: 'Intermediate'
      },
      preferences: {
        notifications: true,
        emailUpdates: true,
        theme: 'dark'
      },
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date()
    };

    res.json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  authenticateToken,
  body('name').optional().trim().isLength({ min: 2 }),
  body('profile.education').optional().isIn(['high_school', 'undergraduate', 'graduate', 'professional']),
  body('profile.experience').optional().isIn(['beginner', 'some_experience', 'experienced', 'expert']),
  body('profile.learningStyle').optional().isIn(['visual', 'practical', 'reading', 'mixed'])
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

    const updates = req.body;
    
    // Mock update response
    const updatedProfile = {
      id: req.userId,
      ...updates,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/users/progress
// @desc    Get user learning progress
// @access  Private
router.get('/progress', authenticateToken, (req, res) => {
  try {
    const progressData = {
      overall: {
        completedChapters: 3,
        totalChapters: 8,
        progress: 37.5,
        totalPoints: 2450,
        currentStreak: 7,
        hoursLearned: 45,
        level: 'Intermediate'
      },
      roadmaps: [
        {
          id: 'data-science-ml',
          title: 'Data Science & Machine Learning',
          progress: 37.5,
          completedChapters: 3,
          totalChapters: 8,
          estimatedCompletion: '2024-08-15'
        }
      ],
      recentActivity: [
        {
          type: 'quiz_completed',
          title: 'Statistics & Probability Quiz',
          score: 85,
          points: 150,
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          type: 'chapter_completed',
          title: 'Data Analysis with Pandas',
          points: 200,
          timestamp: new Date(Date.now() - 86400000)
        }
      ],
      achievements: [
        {
          id: 'first_quiz',
          title: 'First Quiz Completed',
          description: 'Complete your first quiz',
          unlockedAt: new Date(Date.now() - 86400000 * 5)
        },
        {
          id: 'week_streak',
          title: 'Week Streak',
          description: 'Learn for 7 days in a row',
          unlockedAt: new Date()
        }
      ]
    };

    res.json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/users/progress/update
// @desc    Update user progress
// @access  Private
router.post('/progress/update', [
  authenticateToken,
  body('type').isIn(['chapter_completed', 'quiz_completed', 'milestone_reached']),
  body('points').isInt({ min: 0 }),
  body('data').isObject()
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

    const { type, points, data } = req.body;

    // Mock progress update
    const updatedProgress = {
      type,
      points,
      data,
      timestamp: new Date(),
      newTotal: 2450 + points
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

// @route   GET /api/users/achievements
// @desc    Get user achievements
// @access  Private
router.get('/achievements', authenticateToken, (req, res) => {
  try {
    const achievements = {
      unlocked: [
        {
          id: 'first_login',
          title: 'Welcome Aboard!',
          description: 'Complete your first login',
          icon: '🎉',
          points: 50,
          unlockedAt: new Date(Date.now() - 86400000 * 10)
        },
        {
          id: 'first_quiz',
          title: 'Quiz Master',
          description: 'Complete your first quiz',
          icon: '📝',
          points: 100,
          unlockedAt: new Date(Date.now() - 86400000 * 5)
        },
        {
          id: 'week_streak',
          title: 'Consistency King',
          description: 'Learn for 7 days in a row',
          icon: '🔥',
          points: 200,
          unlockedAt: new Date()
        }
      ],
      locked: [
        {
          id: 'month_streak',
          title: 'Dedication Master',
          description: 'Learn for 30 days in a row',
          icon: '💎',
          points: 500,
          progress: 23,
          target: 30
        },
        {
          id: 'perfect_score',
          title: 'Perfectionist',
          description: 'Score 100% on any quiz',
          icon: '⭐',
          points: 300,
          progress: 0,
          target: 1
        }
      ],
      totalPoints: 350,
      totalUnlocked: 3
    };

    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  authenticateToken,
  body('notifications').optional().isBoolean(),
  body('emailUpdates').optional().isBoolean(),
  body('theme').optional().isIn(['light', 'dark'])
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

    const preferences = req.body;

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
