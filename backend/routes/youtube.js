const express = require('express');
const router = express.Router();
const youtubeService = require('../services/youtubeService');
const videoValidationService = require('../services/videoValidationService');
const smartVideoService = require('../services/smartVideoService');
const { body, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

/**
 * @route   GET /api/youtube/search
 * @desc    Search for videos with privacy controls
 * @access  Public
 * @query   q (required) - Search query
 * @query   maxResults - Maximum number of results (default: 25, max: 50)
 * @query   order - Sort order (relevance, date, rating, viewCount, title)
 * @query   safeSearch - Safe search setting (strict, moderate, none)
 * @query   regionCode - Region code for localized results
 * @query   relevanceLanguage - Language for relevance
 * @query   publishedAfter - Videos published after this date (ISO 8601)
 * @query   publishedBefore - Videos published before this date (ISO 8601)
 * @query   videoDuration - Video duration filter (any, short, medium, long)
 * @query   videoDefinition - Video definition (any, high, standard)
 * @query   channelId - Specific channel ID to search within
 */
router.get('/search', [
  query('q')
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('maxResults')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('maxResults must be between 1 and 50'),
  query('order')
    .optional()
    .isIn(['relevance', 'date', 'rating', 'viewCount', 'title'])
    .withMessage('Invalid order parameter'),
  query('safeSearch')
    .optional()
    .isIn(['strict', 'moderate', 'none'])
    .withMessage('Invalid safeSearch parameter'),
  query('regionCode')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('regionCode must be a 2-letter country code'),
  query('videoDuration')
    .optional()
    .isIn(['any', 'short', 'medium', 'long'])
    .withMessage('Invalid videoDuration parameter'),
  query('videoDefinition')
    .optional()
    .isIn(['any', 'high', 'standard'])
    .withMessage('Invalid videoDefinition parameter')
], handleValidationErrors, async (req, res) => {
  try {
    const {
      q: query,
      maxResults,
      order,
      publishedAfter,
      publishedBefore,
      channelId
    } = req.query;

    const privacyOptions = {
      safeSearch: req.query.safeSearch,
      regionCode: req.query.regionCode,
      relevanceLanguage: req.query.relevanceLanguage,
      videoDuration: req.query.videoDuration,
      videoDefinition: req.query.videoDefinition
    };

    const options = {
      maxResults: maxResults ? parseInt(maxResults) : undefined,
      order,
      publishedAfter,
      publishedBefore,
      channelId
    };

    const result = await youtubeService.searchVideos(query, options, privacyOptions);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('YouTube search error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/youtube/recommendations/skill/:skill
 * @desc    Get skill-based video recommendations
 * @access  Public
 * @param   skill - Skill name (required)
 * @query   level - Skill level (beginner, intermediate, advanced)
 * @query   safeSearch - Safe search setting
 * @query   regionCode - Region code for localized results
 */
router.get('/recommendations/skill/:skill', [
  query('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid skill level'),
  query('safeSearch')
    .optional()
    .isIn(['strict', 'moderate', 'none'])
    .withMessage('Invalid safeSearch parameter'),
  query('regionCode')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('regionCode must be a 2-letter country code')
], handleValidationErrors, async (req, res) => {
  try {
    const { skill } = req.params;
    const { level = 'beginner' } = req.query;

    const privacyOptions = {
      safeSearch: req.query.safeSearch,
      regionCode: req.query.regionCode,
      relevanceLanguage: req.query.relevanceLanguage
    };

    const result = await youtubeService.getSkillRecommendations(skill, level, privacyOptions);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Skill recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/youtube/trending/:category
 * @desc    Get trending educational videos by category
 * @access  Public
 * @param   category - Category name (technology, business, science, etc.)
 * @query   safeSearch - Safe search setting
 * @query   regionCode - Region code for localized results
 */
router.get('/trending/:category', [
  query('safeSearch')
    .optional()
    .isIn(['strict', 'moderate', 'none'])
    .withMessage('Invalid safeSearch parameter'),
  query('regionCode')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('regionCode must be a 2-letter country code')
], handleValidationErrors, async (req, res) => {
  try {
    const { category } = req.params;

    const privacyOptions = {
      safeSearch: req.query.safeSearch,
      regionCode: req.query.regionCode,
      relevanceLanguage: req.query.relevanceLanguage
    };

    const result = await youtubeService.getTrendingEducationalVideos(category, privacyOptions);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Trending videos error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/youtube/video/:videoId
 * @desc    Get detailed information about a specific video
 * @access  Public
 * @param   videoId - YouTube video ID (required)
 */
router.get('/video/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;

    // Validate YouTube video ID format
    const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    if (!videoIdRegex.test(videoId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid YouTube video ID format'
      });
    }

    const result = await youtubeService.getVideoDetails(videoId);
    
    if (result) {
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Video not found or unavailable'
      });
    }
  } catch (error) {
    console.error('Video details error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/youtube/privacy-settings
 * @desc    Get current privacy settings
 * @access  Public
 */
router.get('/privacy-settings', (req, res) => {
  try {
    const privacySettings = youtubeService.getPrivacySettings();
    res.json({
      success: true,
      data: privacySettings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Privacy settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @route   PUT /api/youtube/privacy-settings
 * @desc    Update privacy settings
 * @access  Public (In production, this should be protected)
 * @body    Privacy settings object
 */
router.put('/privacy-settings', [
  body('safeSearch')
    .optional()
    .isIn(['strict', 'moderate', 'none'])
    .withMessage('Invalid safeSearch value'),
  body('regionCode')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('regionCode must be a 2-letter country code'),
  body('maxResults')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('maxResults must be between 1 and 50'),
  body('videoDuration')
    .optional()
    .isIn(['any', 'short', 'medium', 'long'])
    .withMessage('Invalid videoDuration value'),
  body('videoDefinition')
    .optional()
    .isIn(['any', 'high', 'standard'])
    .withMessage('Invalid videoDefinition value')
], handleValidationErrors, (req, res) => {
  try {
    const newSettings = req.body;
    youtubeService.updatePrivacySettings(newSettings);
    
    res.json({
      success: true,
      message: 'Privacy settings updated successfully',
      data: youtubeService.getPrivacySettings(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/youtube/bulk-recommendations
 * @desc    Get recommendations for multiple skills at once
 * @access  Public
 * @body    Array of skills with levels
 */
router.post('/bulk-recommendations', [
  body('skills')
    .isArray({ min: 1, max: 10 })
    .withMessage('Skills must be an array with 1-10 items'),
  body('skills.*.skill')
    .notEmpty()
    .withMessage('Each skill must have a name'),
  body('skills.*.level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid skill level'),
  body('privacyOptions.safeSearch')
    .optional()
    .isIn(['strict', 'moderate', 'none'])
    .withMessage('Invalid safeSearch parameter')
], handleValidationErrors, async (req, res) => {
  try {
    const { skills, privacyOptions = {} } = req.body;
    const results = [];

    for (const skillItem of skills) {
      const { skill, level = 'beginner' } = skillItem;
      const result = await youtubeService.getSkillRecommendations(skill, level, privacyOptions);
      results.push({
        skill,
        level,
        ...result
      });
    }

    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Bulk recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/youtube/categories
 * @desc    Get available categories for trending videos
 * @access  Public
 */
router.get('/categories', (req, res) => {
  try {
    const categories = [
      'technology',
      'programming',
      'data-science',
      'machine-learning',
      'artificial-intelligence',
      'web-development',
      'mobile-development',
      'cybersecurity',
      'cloud-computing',
      'devops',
      'business',
      'marketing',
      'finance',
      'entrepreneurship',
      'leadership',
      'project-management',
      'design',
      'ui-ux',
      'graphic-design',
      'science',
      'mathematics',
      'physics',
      'chemistry',
      'biology',
      'engineering',
      'languages',
      'communication',
      'soft-skills',
      'productivity'
    ];

    res.json({
      success: true,
      data: {
        categories: categories.map(cat => ({
          id: cat,
          name: cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          slug: cat
        }))
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/youtube/validated-search
 * @desc    Search for validated, available videos
 * @access  Public
 */
router.get('/validated-search', [
  query('q')
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('maxResults')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('maxResults must be between 1 and 20')
], handleValidationErrors, async (req, res) => {
  try {
    const { q: query, maxResults } = req.query;
    
    console.log(`🔍 Searching for validated videos: "${query}"`);
    
    const options = {
      maxResults: maxResults ? parseInt(maxResults) : 10
    };
    
    const result = await videoValidationService.searchValidVideos(query, options);
    
    res.json({
      success: true,
      data: result.data,
      message: result.data.videos.length > 0 
        ? `Found ${result.data.videos.length} validated videos`
        : 'No validated videos found. Try different search terms.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Validated search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search for validated videos',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/youtube/working-videos/:skill
 * @desc    Get WORKING videos/resources for a specific skill (no broken links!)
 * @access  Public
 */
router.get('/working-videos/:skill', [
  query('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced')
], handleValidationErrors, async (req, res) => {
  try {
    const { skill } = req.params;
    const { level = 'beginner' } = req.query;
    
    console.log(`🎯 Getting WORKING content for skill: ${skill} (${level})`);
    
    const result = await smartVideoService.getWorkingSkillVideos(skill, level);
    
    res.json({
      success: true,
      data: result.data,
      message: `Found ${result.data.videos.length} working resources for ${skill} - no broken links!`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Working videos error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get working videos',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/youtube/skill-videos/:skill
 * @desc    Get validated videos for a specific skill
 * @access  Public
 */
router.get('/skill-videos/:skill', [
  query('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced')
], handleValidationErrors, async (req, res) => {
  try {
    const { skill } = req.params;
    const { level = 'beginner' } = req.query;
    
    console.log(`🎯 Getting validated videos for skill: ${skill} (${level})`);
    
    const result = await videoValidationService.getValidatedSkillVideos(skill, level);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        message: result.data.videos.length > 0 
          ? `Found ${result.data.videos.length} validated ${skill} videos`
          : `No validated videos found for ${skill}. Using search suggestions.`,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to get skill videos',
        message: 'Unable to fetch validated videos for this skill',
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('Skill videos error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get skill videos',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   POST /api/youtube/validate-video
 * @desc    Validate a specific YouTube video
 * @access  Public
 */
router.post('/validate-video', [
  body('videoId')
    .notEmpty()
    .withMessage('Video ID is required')
    .matches(/^[a-zA-Z0-9_-]{11}$/)
    .withMessage('Invalid YouTube video ID format')
], handleValidationErrors, async (req, res) => {
  try {
    const { videoId } = req.body;
    
    console.log(`✅ Validating video: ${videoId}`);
    
    const validation = await videoValidationService.validateVideo(videoId);
    
    res.json({
      success: true,
      data: {
        videoId,
        isValid: validation.isValid,
        reason: validation.reason,
        message: validation.message,
        videoData: validation.videoData
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Video validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate video',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
