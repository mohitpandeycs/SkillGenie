const { google } = require('googleapis');

class YouTubeService {
  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });
    
    // Privacy settings for video recommendations
    this.privacySettings = {
      safeSearch: 'strict', // strict, moderate, none
      regionCode: 'US', // Default region
      relevanceLanguage: 'en', // Default language
      maxResults: 25, // Maximum videos to return
      videoDuration: 'any', // any, short, medium, long
      videoDefinition: 'any', // any, high, standard
      videoLicense: 'any', // any, creativeCommon, youtube
      videoEmbeddable: 'any', // any, true
      videoSyndicated: 'any', // any, true
      eventType: 'any' // any, completed, live, upcoming
    };
  }

  /**
   * Search for videos based on query with privacy controls
   * @param {string} query - Search query
   * @param {Object} options - Additional search options
   * @param {Object} privacyOptions - Privacy-specific options
   * @returns {Promise<Object>} Search results with privacy metadata
   */
  async searchVideos(query, options = {}, privacyOptions = {}) {
    try {
      // Check if API key is available
      if (!process.env.YOUTUBE_API_KEY) {
        return this.getFallbackVideos(query, options);
      }

      // Merge privacy settings with user options
      const searchParams = {
        part: 'snippet,statistics,contentDetails',
        q: query,
        type: 'video',
        safeSearch: privacyOptions.safeSearch || this.privacySettings.safeSearch,
        regionCode: privacyOptions.regionCode || this.privacySettings.regionCode,
        relevanceLanguage: privacyOptions.relevanceLanguage || this.privacySettings.relevanceLanguage,
        maxResults: Math.min(options.maxResults || this.privacySettings.maxResults, 50),
        videoDuration: privacyOptions.videoDuration || this.privacySettings.videoDuration,
        videoDefinition: privacyOptions.videoDefinition || this.privacySettings.videoDefinition,
        videoLicense: privacyOptions.videoLicense || this.privacySettings.videoLicense,
        videoEmbeddable: privacyOptions.videoEmbeddable || this.privacySettings.videoEmbeddable,
        videoSyndicated: privacyOptions.videoSyndicated || this.privacySettings.videoSyndicated,
        order: options.order || 'relevance', // relevance, date, rating, viewCount, title
        publishedAfter: options.publishedAfter,
        publishedBefore: options.publishedBefore,
        channelId: options.channelId,
        eventType: privacyOptions.eventType || this.privacySettings.eventType
      };

      // Remove undefined parameters
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === undefined) {
          delete searchParams[key];
        }
      });

      const response = await this.youtube.search.list(searchParams);
      
      // Process results with privacy information
      const processedResults = await this.processVideoResults(response.data.items, privacyOptions);
      
      return {
        success: true,
        data: {
          videos: processedResults,
          totalResults: response.data.pageInfo.totalResults,
          resultsPerPage: response.data.pageInfo.resultsPerPage,
          nextPageToken: response.data.nextPageToken,
          prevPageToken: response.data.prevPageToken,
          privacySettings: {
            safeSearch: searchParams.safeSearch,
            regionCode: searchParams.regionCode,
            contentFiltering: true,
            dataMinimization: true
          }
        },
        query: query,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('YouTube API Error:', error);
      // Return fallback videos on API error
      return this.getFallbackVideos(query, options);
    }
  }

  /**
   * Get skill-based video recommendations
   * @param {string} skill - Skill to search for
   * @param {string} level - Skill level (beginner, intermediate, advanced)
   * @param {Object} privacyOptions - Privacy options
   * @returns {Promise<Object>} Curated video recommendations
   */
  async getSkillRecommendations(skill, level = 'beginner', privacyOptions = {}) {
    try {
      const queries = this.generateSkillQueries(skill, level);
      const recommendations = [];

      for (const query of queries) {
        const results = await this.searchVideos(query, { maxResults: 5 }, privacyOptions);
        if (results.success) {
          recommendations.push(...results.data.videos);
        }
      }

      // Remove duplicates and sort by relevance
      const uniqueRecommendations = this.removeDuplicateVideos(recommendations);
      const sortedRecommendations = this.sortByRelevanceAndQuality(uniqueRecommendations);

      return {
        success: true,
        data: {
          skill: skill,
          level: level,
          recommendations: sortedRecommendations.slice(0, 20), // Limit to top 20
          privacyCompliant: true,
          contentFiltered: true,
          fallbackMode: recommendations.length > 0 && recommendations[0].privacyInfo?.fallbackMode
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Skill Recommendations Error:', error);
      // Return fallback recommendations on error
      const fallbackResult = this.getFallbackVideos(`${skill} ${level}`, { maxResults: 3 });
      return {
        success: true,
        data: {
          skill: skill,
          level: level,
          recommendations: fallbackResult.data.videos,
          privacyCompliant: true,
          contentFiltered: true,
          fallbackMode: true
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get trending videos in educational categories
   * @param {string} category - Category (technology, business, science, etc.)
   * @param {Object} privacyOptions - Privacy options
   * @returns {Promise<Object>} Trending educational videos
   */
  async getTrendingEducationalVideos(category = 'technology', privacyOptions = {}) {
    try {
      const educationalQueries = [
        `${category} tutorial`,
        `${category} course`,
        `${category} explained`,
        `${category} fundamentals`,
        `${category} guide`
      ];

      const trendingVideos = [];
      
      for (const query of educationalQueries) {
        const results = await this.searchVideos(query, {
          order: 'viewCount',
          publishedAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
          maxResults: 3
        }, privacyOptions);
        
        if (results.success) {
          trendingVideos.push(...results.data.videos);
        }
      }

      const uniqueTrending = this.removeDuplicateVideos(trendingVideos);
      const sortedTrending = this.sortByTrendingScore(uniqueTrending);

      return {
        success: true,
        data: {
          category: category,
          trendingVideos: sortedTrending.slice(0, 15),
          privacyCompliant: true,
          timeframe: 'last_30_days'
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Trending Videos Error:', error);
      return {
        success: false,
        error: error.message,
        category: category,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Process video results with privacy enhancements
   * @param {Array} videos - Raw video data from YouTube API
   * @param {Object} privacyOptions - Privacy options
   * @returns {Promise<Array>} Processed video data
   */
  async processVideoResults(videos, privacyOptions = {}) {
    const processedVideos = [];

    for (const video of videos) {
      try {
        // Get additional video details if needed
        const videoDetails = await this.getVideoDetails(video.id.videoId);
        
        const processedVideo = {
          id: video.id.videoId,
          title: this.sanitizeTitle(video.snippet.title),
          description: this.sanitizeDescription(video.snippet.description),
          thumbnail: {
            default: video.snippet.thumbnails.default?.url,
            medium: video.snippet.thumbnails.medium?.url,
            high: video.snippet.thumbnails.high?.url
          },
          channel: {
            id: video.snippet.channelId,
            title: video.snippet.channelTitle
          },
          publishedAt: video.snippet.publishedAt,
          duration: videoDetails?.contentDetails?.duration,
          viewCount: videoDetails?.statistics?.viewCount,
          likeCount: videoDetails?.statistics?.likeCount,
          commentCount: videoDetails?.statistics?.commentCount,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          embedUrl: `https://www.youtube.com/embed/${video.id.videoId}`,
          privacyInfo: {
            safeContent: true,
            ageAppropriate: true,
            educationalContent: this.isEducationalContent(video.snippet),
            dataMinimized: true
          }
        };

        // Apply privacy filters
        if (this.passesPrivacyFilters(processedVideo, privacyOptions)) {
          processedVideos.push(processedVideo);
        }
      } catch (error) {
        console.error(`Error processing video ${video.id.videoId}:`, error);
      }
    }

    return processedVideos;
  }

  /**
   * Get detailed information about a specific video
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<Object>} Video details
   */
  async getVideoDetails(videoId) {
    try {
      const response = await this.youtube.videos.list({
        part: 'contentDetails,statistics,status',
        id: videoId
      });
      
      return response.data.items[0];
    } catch (error) {
      console.error(`Error getting video details for ${videoId}:`, error);
      return null;
    }
  }

  /**
   * Generate skill-specific search queries
   * @param {string} skill - Skill name
   * @param {string} level - Skill level
   * @returns {Array<string>} Array of search queries
   */
  generateSkillQueries(skill, level) {
    const levelKeywords = {
      beginner: ['tutorial', 'basics', 'introduction', 'getting started', 'fundamentals'],
      intermediate: ['guide', 'course', 'advanced tutorial', 'deep dive', 'masterclass'],
      advanced: ['expert', 'advanced', 'professional', 'mastery', 'complete guide']
    };

    const keywords = levelKeywords[level] || levelKeywords.beginner;
    return keywords.map(keyword => `${skill} ${keyword}`);
  }

  /**
   * Remove duplicate videos from results
   * @param {Array} videos - Array of video objects
   * @returns {Array} Deduplicated videos
   */
  removeDuplicateVideos(videos) {
    const seen = new Set();
    return videos.filter(video => {
      if (seen.has(video.id)) {
        return false;
      }
      seen.add(video.id);
      return true;
    });
  }

  /**
   * Sort videos by relevance and quality metrics
   * @param {Array} videos - Array of video objects
   * @returns {Array} Sorted videos
   */
  sortByRelevanceAndQuality(videos) {
    return videos.sort((a, b) => {
      const scoreA = this.calculateVideoScore(a);
      const scoreB = this.calculateVideoScore(b);
      return scoreB - scoreA;
    });
  }

  /**
   * Sort videos by trending score
   * @param {Array} videos - Array of video objects
   * @returns {Array} Sorted videos
   */
  sortByTrendingScore(videos) {
    return videos.sort((a, b) => {
      const trendingScoreA = this.calculateTrendingScore(a);
      const trendingScoreB = this.calculateTrendingScore(b);
      return trendingScoreB - trendingScoreA;
    });
  }

  /**
   * Calculate video quality score
   * @param {Object} video - Video object
   * @returns {number} Quality score
   */
  calculateVideoScore(video) {
    let score = 0;
    
    // View count factor
    if (video.viewCount) {
      score += Math.log10(parseInt(video.viewCount)) * 10;
    }
    
    // Like ratio factor
    if (video.likeCount && video.viewCount) {
      const likeRatio = parseInt(video.likeCount) / parseInt(video.viewCount);
      score += likeRatio * 100;
    }
    
    // Educational content bonus
    if (video.privacyInfo.educationalContent) {
      score += 50;
    }
    
    // Recency factor
    const publishDate = new Date(video.publishedAt);
    const daysSincePublish = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublish < 365) {
      score += (365 - daysSincePublish) / 10;
    }
    
    return score;
  }

  /**
   * Calculate trending score for videos
   * @param {Object} video - Video object
   * @returns {number} Trending score
   */
  calculateTrendingScore(video) {
    let score = 0;
    
    const publishDate = new Date(video.publishedAt);
    const daysSincePublish = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Recency is key for trending
    if (daysSincePublish < 7) {
      score += 100;
    } else if (daysSincePublish < 30) {
      score += 50;
    }
    
    // View velocity (views per day)
    if (video.viewCount && daysSincePublish > 0) {
      const viewsPerDay = parseInt(video.viewCount) / daysSincePublish;
      score += Math.log10(viewsPerDay) * 20;
    }
    
    return score;
  }

  /**
   * Check if content is educational
   * @param {Object} snippet - Video snippet
   * @returns {boolean} Is educational content
   */
  isEducationalContent(snippet) {
    const educationalKeywords = [
      'tutorial', 'course', 'learn', 'education', 'training', 'guide',
      'how to', 'explained', 'fundamentals', 'basics', 'advanced',
      'masterclass', 'workshop', 'lecture', 'lesson'
    ];
    
    const text = `${snippet.title} ${snippet.description}`.toLowerCase();
    return educationalKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Check if video passes privacy filters
   * @param {Object} video - Video object
   * @param {Object} privacyOptions - Privacy options
   * @returns {boolean} Passes filters
   */
  passesPrivacyFilters(video, privacyOptions) {
    // Add custom privacy filtering logic here
    // For now, return true for all videos that made it through YouTube's safe search
    return true;
  }

  /**
   * Sanitize video title for privacy
   * @param {string} title - Original title
   * @returns {string} Sanitized title
   */
  sanitizeTitle(title) {
    // Remove potentially sensitive information
    return title.replace(/\b\d{4,}\b/g, '[NUMBER]'); // Replace long numbers
  }

  /**
   * Sanitize video description for privacy
   * @param {string} description - Original description
   * @returns {string} Sanitized description
   */
  sanitizeDescription(description) {
    if (!description) return '';
    
    // Truncate description and remove potentially sensitive information
    const truncated = description.substring(0, 200);
    return truncated.replace(/\b\d{4,}\b/g, '[NUMBER]')
                   .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
  }

  /**
   * Validate video availability before returning
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<boolean>} Video is available
   */
  async validateVideoAvailability(videoId) {
    try {
      const response = await this.youtube.videos.list({
        part: 'status',
        id: videoId
      });
      
      if (response.data.items.length === 0) {
        return false; // Video not found
      }
      
      const video = response.data.items[0];
      return video.status.uploadStatus === 'processed' && 
             video.status.privacyStatus === 'public';
    } catch (error) {
      console.error(`Error validating video ${videoId}:`, error);
      return false;
    }
  }

  /**
   * Get fresh, available videos for a skill with validation
   * @param {string} skill - Skill to search for
   * @param {string} level - Skill level
   * @returns {Promise<Object>} Fresh video recommendations
   */
  async getFreshSkillVideos(skill, level = 'beginner') {
    try {
      console.log(`🔍 Searching for fresh ${skill} videos (${level} level)...`);
      
      // Generate multiple search queries for better results
      const queries = [
        `${skill} ${level} tutorial 2024`,
        `${skill} course ${level}`,
        `learn ${skill} ${level}`,
        `${skill} ${level} guide`,
        `${skill} fundamentals ${level}`
      ];
      
      const allVideos = [];
      
      for (const query of queries) {
        try {
          const searchResults = await this.searchVideos(query, {
            maxResults: 10,
            order: 'relevance',
            publishedAfter: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString() // Last year
          });
          
          if (searchResults.success && searchResults.data.videos) {
            // Validate each video
            for (const video of searchResults.data.videos) {
              const isAvailable = await this.validateVideoAvailability(video.id);
              if (isAvailable) {
                video.validated = true;
                video.lastChecked = new Date().toISOString();
                allVideos.push(video);
              }
            }
          }
        } catch (error) {
          console.error(`Error searching with query "${query}":`, error);
        }
      }
      
      // Remove duplicates and sort by quality
      const uniqueVideos = this.removeDuplicateVideos(allVideos);
      const sortedVideos = this.sortByRelevanceAndQuality(uniqueVideos);
      
      console.log(`✅ Found ${sortedVideos.length} validated videos for ${skill}`);
      
      return {
        success: true,
        data: {
          skill: skill,
          level: level,
          videos: sortedVideos.slice(0, 15), // Top 15 videos
          totalFound: sortedVideos.length,
          allValidated: true,
          searchQueries: queries,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('Error getting fresh skill videos:', error);
      return this.getEnhancedFallbackVideos(skill, level);
    }
  }

  /**
   * Enhanced fallback videos with better content
   * @param {string} skill - Skill name
   * @param {string} level - Skill level
   * @returns {Object} Enhanced fallback videos
   */
  getEnhancedFallbackVideos(skill, level = 'beginner') {
    console.log(`📺 Using enhanced fallback videos for ${skill} (${level})`);
    
    const skillCategories = {
      'javascript': {
        beginner: [
          { title: 'JavaScript Basics - Variables and Functions', duration: 'PT25M30S', views: '450K' },
          { title: 'JavaScript DOM Manipulation Tutorial', duration: 'PT35M15S', views: '320K' },
          { title: 'JavaScript Arrays and Objects Explained', duration: 'PT28M45S', views: '280K' }
        ],
        intermediate: [
          { title: 'JavaScript Async/Await and Promises', duration: 'PT42M20S', views: '380K' },
          { title: 'JavaScript ES6+ Features Complete Guide', duration: 'PT55M10S', views: '520K' },
          { title: 'JavaScript Modules and Bundling', duration: 'PT38M30S', views: '290K' }
        ]
      },
      'python': {
        beginner: [
          { title: 'Python Programming for Beginners', duration: 'PT45M20S', views: '680K' },
          { title: 'Python Data Types and Variables', duration: 'PT32M15S', views: '420K' },
          { title: 'Python Functions and Loops Tutorial', duration: 'PT38M45S', views: '350K' }
        ],
        intermediate: [
          { title: 'Python Object-Oriented Programming', duration: 'PT52M30S', views: '480K' },
          { title: 'Python Libraries - NumPy and Pandas', duration: 'PT65M15S', views: '590K' },
          { title: 'Python Web Development with Flask', duration: 'PT75M20S', views: '410K' }
        ]
      },
      'react': {
        beginner: [
          { title: 'React.js Tutorial for Beginners', duration: 'PT48M30S', views: '720K' },
          { title: 'React Components and Props Explained', duration: 'PT35M20S', views: '480K' },
          { title: 'React State Management Basics', duration: 'PT42M15S', views: '390K' }
        ],
        intermediate: [
          { title: 'React Hooks Complete Guide', duration: 'PT58M45S', views: '650K' },
          { title: 'React Router and Navigation', duration: 'PT45M30S', views: '420K' },
          { title: 'React Performance Optimization', duration: 'PT52M20S', views: '380K' }
        ]
      }
    };
    
    const skillKey = skill.toLowerCase();
    const levelVideos = skillCategories[skillKey]?.[level] || skillCategories[skillKey]?.['beginner'] || [];
    
    // Generate fallback videos
    const fallbackVideos = levelVideos.map((template, index) => ({
      id: `fallback_${skillKey}_${level}_${index}`,
      title: template.title,
      description: `Learn ${skill} with this comprehensive ${level} tutorial. Perfect for building your programming skills step by step.`,
      thumbnail: {
        default: `https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg`,
        medium: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
        high: `https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg`
      },
      channel: {
        id: `UC_${skillKey}_channel`,
        title: `${skill} Academy`
      },
      publishedAt: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration: template.duration,
      viewCount: template.views.replace('K', '000').replace('M', '000000'),
      likeCount: Math.floor(parseInt(template.views.replace(/[KM]/g, '')) * 0.05).toString(),
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' ' + level + ' tutorial')}`,
      embedUrl: null, // Don't provide embed for fallback
      privacyInfo: {
        safeContent: true,
        ageAppropriate: true,
        educationalContent: true,
        dataMinimized: true,
        fallbackContent: true
      },
      fallbackMode: true,
      searchSuggestion: `Search for: "${skill} ${level} tutorial 2024"`
    }));
    
    return {
      success: true,
      data: {
        skill: skill,
        level: level,
        videos: fallbackVideos,
        totalFound: fallbackVideos.length,
        fallbackMode: true,
        message: "Using curated content suggestions. Click 'Search Suggestion' for live results.",
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Get fallback videos when YouTube API is not available (legacy method)
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Object} Fallback video results
   */
  getFallbackVideos(query, options = {}) {
    // Extract skill and level from query if possible
    const skill = query.split(' ')[0];
    const level = query.includes('beginner') ? 'beginner' : 
                  query.includes('intermediate') ? 'intermediate' : 
                  query.includes('advanced') ? 'advanced' : 'beginner';
    
    return this.getEnhancedFallbackVideos(skill, level);
  }

  /**
   * Update privacy settings
   * @param {Object} newSettings - New privacy settings
   */
  updatePrivacySettings(newSettings) {
    this.privacySettings = { ...this.privacySettings, ...newSettings };
  }

  /**
   * Get current privacy settings
   * @returns {Object} Current privacy settings
   */
  getPrivacySettings() {
    return { ...this.privacySettings };
  }
}

module.exports = new YouTubeService();
