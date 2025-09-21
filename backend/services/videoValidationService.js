const axios = require('axios');

class VideoValidationService {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }

  /**
   * Check if a YouTube video is actually available
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<Object>} Validation result
   */
  async validateVideo(videoId) {
    try {
      if (!this.apiKey) {
        console.warn('⚠️ No YouTube API key - cannot validate videos');
        return { isValid: false, reason: 'no_api_key' };
      }

      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'status,snippet,contentDetails',
          id: videoId,
          key: this.apiKey
        }
      });

      if (response.data.items.length === 0) {
        return { 
          isValid: false, 
          reason: 'video_not_found',
          message: 'Video does not exist or has been deleted'
        };
      }

      const video = response.data.items[0];
      const status = video.status;

      // Check if video is available
      const isPublic = status.privacyStatus === 'public';
      const isProcessed = status.uploadStatus === 'processed';
      const isEmbeddable = status.embeddable !== false;
      const isNotBlocked = !status.blocked;

      const isValid = isPublic && isProcessed && isEmbeddable && isNotBlocked;

      return {
        isValid,
        reason: !isValid ? this.getFailureReason(status) : 'valid',
        videoData: isValid ? {
          id: videoId,
          title: video.snippet.title,
          description: video.snippet.description?.substring(0, 200),
          thumbnail: video.snippet.thumbnails.medium?.url,
          duration: video.contentDetails.duration,
          publishedAt: video.snippet.publishedAt,
          channelTitle: video.snippet.channelTitle
        } : null
      };

    } catch (error) {
      console.error(`Error validating video ${videoId}:`, error.message);
      return { 
        isValid: false, 
        reason: 'api_error',
        message: error.message 
      };
    }
  }

  /**
   * Get reason for validation failure
   * @param {Object} status - Video status object
   * @returns {string} Failure reason
   */
  getFailureReason(status) {
    if (status.privacyStatus !== 'public') return 'not_public';
    if (status.uploadStatus !== 'processed') return 'not_processed';
    if (status.embeddable === false) return 'not_embeddable';
    if (status.blocked) return 'blocked';
    return 'unknown';
  }

  /**
   * Search for fresh, available videos
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results with validated videos
   */
  async searchValidVideos(query, options = {}) {
    try {
      if (!this.apiKey) {
        return this.getFallbackSearchResults(query, options);
      }

      const maxResults = options.maxResults || 10;
      const publishedAfter = options.publishedAfter || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();

      // Search for videos
      const searchResponse = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: maxResults * 2, // Get more to account for invalid ones
          order: options.order || 'relevance',
          publishedAfter,
          safeSearch: 'strict',
          key: this.apiKey
        }
      });

      const searchResults = searchResponse.data.items;
      const validVideos = [];

      // Validate each video
      for (const item of searchResults) {
        if (validVideos.length >= maxResults) break;

        const validation = await this.validateVideo(item.id.videoId);
        if (validation.isValid) {
          validVideos.push({
            ...validation.videoData,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
            validated: true,
            validatedAt: new Date().toISOString()
          });
        }
      }

      return {
        success: true,
        data: {
          videos: validVideos,
          totalFound: validVideos.length,
          query: query,
          allValidated: true
        }
      };

    } catch (error) {
      console.error('Error searching for valid videos:', error.message);
      return this.getFallbackSearchResults(query, options);
    }
  }

  /**
   * Get skill-specific validated videos
   * @param {string} skill - Skill name
   * @param {string} level - Skill level
   * @returns {Promise<Object>} Validated skill videos
   */
  async getValidatedSkillVideos(skill, level = 'beginner') {
    const queries = [
      `${skill} ${level} tutorial 2024`,
      `${skill} ${level} course`,
      `learn ${skill} ${level} programming`,
      `${skill} ${level} guide complete`,
      `${skill} tutorial ${level} step by step`
    ];

    const allVideos = [];

    for (const query of queries) {
      try {
        const results = await this.searchValidVideos(query, { maxResults: 5 });
        if (results.success && results.data.videos) {
          allVideos.push(...results.data.videos);
        }
      } catch (error) {
        console.error(`Error with query "${query}":`, error.message);
      }
    }

    // Remove duplicates
    const uniqueVideos = this.removeDuplicates(allVideos);
    
    // Sort by relevance and recency
    const sortedVideos = uniqueVideos.sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return dateB - dateA; // Newer first
    });

    return {
      success: true,
      data: {
        skill,
        level,
        videos: sortedVideos.slice(0, 15), // Top 15
        totalFound: sortedVideos.length,
        allValidated: true,
        searchQueries: queries,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Remove duplicate videos
   * @param {Array} videos - Array of video objects
   * @returns {Array} Deduplicated videos
   */
  removeDuplicates(videos) {
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
   * Get fallback search results when API is not available
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Object} Fallback results
   */
  getFallbackSearchResults(query, options = {}) {
    const skill = query.split(' ')[0].toLowerCase();
    
    // Instead of fake video IDs, provide search suggestions
    const searchSuggestions = [
      {
        id: `search_${Date.now()}_1`,
        title: `${query} - Live Search Required`,
        description: `To find current, available videos for "${query}", please use the search suggestion below.`,
        thumbnail: null,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' 2024')}`,
        embedUrl: null,
        searchSuggestion: true,
        searchQuery: `${query} 2024`,
        message: "Click to search YouTube directly for current videos",
        fallbackMode: true
      },
      {
        id: `search_${Date.now()}_2`,
        title: `${skill} Tutorial - Search Recommended`,
        description: `For the latest ${skill} tutorials, we recommend searching directly on YouTube.`,
        thumbnail: null,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial 2024')}`,
        embedUrl: null,
        searchSuggestion: true,
        searchQuery: `${skill} tutorial 2024`,
        message: "Search for current tutorials",
        fallbackMode: true
      }
    ];

    return {
      success: true,
      data: {
        videos: searchSuggestions,
        totalFound: searchSuggestions.length,
        query: query,
        fallbackMode: true,
        message: "API unavailable. Using search suggestions for current content."
      }
    };
  }

  /**
   * Batch validate multiple video IDs
   * @param {Array} videoIds - Array of video IDs to validate
   * @returns {Promise<Object>} Batch validation results
   */
  async batchValidateVideos(videoIds) {
    const results = {
      valid: [],
      invalid: [],
      total: videoIds.length
    };

    for (const videoId of videoIds) {
      const validation = await this.validateVideo(videoId);
      if (validation.isValid) {
        results.valid.push({
          id: videoId,
          ...validation.videoData
        });
      } else {
        results.invalid.push({
          id: videoId,
          reason: validation.reason,
          message: validation.message
        });
      }
    }

    return results;
  }
}

module.exports = new VideoValidationService();
