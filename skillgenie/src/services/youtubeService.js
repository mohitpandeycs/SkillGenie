import { getApiUrl } from '../config/api';

class YouTubeService {
  /**
   * Search for videos based on query
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchVideos(query, options = {}) {
    try {
      const params = new URLSearchParams({
        q: query,
        maxResults: options.maxResults || 5,
        safeSearch: options.safeSearch || 'strict',
        order: options.order || 'relevance',
        ...options
      });

      const response = await fetch(`${getApiUrl('YOUTUBE_SEARCH')}?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search videos');
      }
      
      return data;
    } catch (error) {
      console.error('YouTube search error:', error);
      throw error;
    }
  }

  /**
   * Get skill-based video recommendations
   * @param {string} skill - Skill name
   * @param {string} level - Skill level (beginner, intermediate, advanced)
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Skill recommendations
   */
  async getSkillRecommendations(skill, level = 'beginner', options = {}) {
    try {
      const params = new URLSearchParams({
        level,
        safeSearch: options.safeSearch || 'strict',
        regionCode: options.regionCode || 'US',
        ...options
      });

      const response = await fetch(`${getApiUrl('YOUTUBE_SKILL_RECOMMENDATIONS')}/${encodeURIComponent(skill)}?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get skill recommendations');
      }
      
      return data;
    } catch (error) {
      console.error('Skill recommendations error:', error);
      throw error;
    }
  }

  /**
   * Get trending educational videos by category
   * @param {string} category - Category name
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Trending videos
   */
  async getTrendingVideos(category, options = {}) {
    try {
      const params = new URLSearchParams({
        safeSearch: options.safeSearch || 'strict',
        regionCode: options.regionCode || 'US',
        ...options
      });

      const response = await fetch(`${getApiUrl('YOUTUBE_TRENDING')}/${encodeURIComponent(category)}?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get trending videos');
      }
      
      return data;
    } catch (error) {
      console.error('Trending videos error:', error);
      throw error;
    }
  }

  /**
   * Get multiple skill recommendations at once
   * @param {Array} skills - Array of skill objects with skill and level
   * @param {Object} privacyOptions - Privacy options
   * @returns {Promise<Object>} Bulk recommendations
   */
  async getBulkRecommendations(skills, privacyOptions = {}) {
    try {
      const response = await fetch(`${getApiUrl('')}/api/youtube/bulk-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skills,
          privacyOptions: {
            safeSearch: 'strict',
            regionCode: 'US',
            ...privacyOptions
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get bulk recommendations');
      }
      
      return data;
    } catch (error) {
      console.error('Bulk recommendations error:', error);
      throw error;
    }
  }

  /**
   * Format video duration from ISO 8601 to readable format
   * @param {string} duration - ISO 8601 duration (PT15M30S)
   * @returns {string} Formatted duration (15m 30s)
   */
  formatDuration(duration) {
    if (!duration) return 'Unknown';
    
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 'Unknown';
    
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    
    let formatted = '';
    if (hours > 0) formatted += `${hours}h `;
    if (minutes > 0) formatted += `${minutes}m`;
    if (seconds > 0 && hours === 0) formatted += ` ${seconds}s`;
    
    return formatted.trim() || 'Unknown';
  }

  /**
   * Format view count to readable format
   * @param {string|number} viewCount - View count
   * @returns {string} Formatted view count (1.2M views)
   */
  formatViewCount(viewCount) {
    if (!viewCount) return '0 views';
    
    const count = parseInt(viewCount);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    } else {
      return `${count} views`;
    }
  }

  /**
   * Get video thumbnail URL with fallback
   * @param {Object} thumbnails - Thumbnail object from API
   * @param {string} quality - Preferred quality (high, medium, default)
   * @returns {string} Thumbnail URL
   */
  getThumbnailUrl(thumbnails, quality = 'medium') {
    if (!thumbnails) return '/placeholder-video.jpg';
    
    return thumbnails[quality]?.url || 
           thumbnails.high?.url || 
           thumbnails.medium?.url || 
           thumbnails.default?.url || 
           '/placeholder-video.jpg';
  }

  /**
   * Open YouTube video in new tab
   * @param {string} videoId - YouTube video ID
   */
  openVideo(videoId) {
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  }

  /**
   * Get embed URL for video
   * @param {string} videoId - YouTube video ID
   * @returns {string} Embed URL
   */
  getEmbedUrl(videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
}

export default new YouTubeService();
