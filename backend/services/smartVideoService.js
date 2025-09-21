const axios = require('axios');

class SmartVideoService {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    this.quotaExceeded = false;
    this.lastQuotaCheck = null;
  }

  /**
   * Get working video recommendations for a skill
   * This method provides REAL, working solutions instead of broken links
   * @param {string} skill - Skill name
   * @param {string} level - Skill level
   * @returns {Object} Working video recommendations
   */
  async getWorkingSkillVideos(skill, level = 'beginner') {
    console.log(`🎯 Getting working videos for ${skill} (${level})...`);

    // First, try to get fresh videos if API is available
    if (this.apiKey && !this.quotaExceeded) {
      try {
        const freshVideos = await this.searchFreshVideos(skill, level);
        if (freshVideos.success && freshVideos.data.videos.length > 0) {
          console.log(`✅ Found ${freshVideos.data.videos.length} fresh videos`);
          return freshVideos;
        }
      } catch (error) {
        console.log('⚠️ Fresh video search failed, using curated content');
        if (error.response?.status === 403) {
          this.quotaExceeded = true;
          this.lastQuotaCheck = Date.now();
        }
      }
    }

    // If API fails or no API key, provide curated working content
    return this.getCuratedWorkingContent(skill, level);
  }

  /**
   * Search for fresh videos using YouTube API
   * @param {string} skill - Skill name
   * @param {string} level - Skill level
   * @returns {Promise<Object>} Fresh video results
   */
  async searchFreshVideos(skill, level) {
    const queries = [
      `${skill} ${level} tutorial 2024`,
      `${skill} complete course ${level}`,
      `learn ${skill} ${level} step by step`
    ];

    const allVideos = [];

    for (const query of queries.slice(0, 2)) { // Limit to 2 queries to save quota
      try {
        const response = await axios.get(`${this.baseUrl}/search`, {
          params: {
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: 5,
            order: 'relevance',
            publishedAfter: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // Last 6 months
            safeSearch: 'strict',
            key: this.apiKey
          }
        });

        const videos = response.data.items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description?.substring(0, 200),
          thumbnail: item.snippet.thumbnails.medium?.url,
          publishedAt: item.snippet.publishedAt,
          channelTitle: item.snippet.channelTitle,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
          fresh: true,
          searchQuery: query
        }));

        allVideos.push(...videos);
      } catch (error) {
        console.error(`Error with query "${query}":`, error.message);
        throw error;
      }
    }

    return {
      success: true,
      data: {
        skill,
        level,
        videos: allVideos.slice(0, 10), // Top 10
        source: 'youtube_api',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Get curated, working content when API is not available
   * These are REAL educational resources that actually work
   * @param {string} skill - Skill name
   * @param {string} level - Skill level
   * @returns {Object} Curated working content
   */
  getCuratedWorkingContent(skill, level) {
    console.log(`📚 Providing curated content for ${skill} (${level})`);

    const skillLower = skill.toLowerCase();
    
    // Curated working educational resources
    const workingResources = {
      javascript: {
        beginner: [
          {
            title: "JavaScript Fundamentals - MDN Web Docs",
            description: "Complete JavaScript guide from Mozilla Developer Network",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
            type: "documentation",
            duration: "Self-paced",
            provider: "MDN"
          },
          {
            title: "JavaScript Tutorial - W3Schools",
            description: "Interactive JavaScript tutorial with examples",
            url: "https://www.w3schools.com/js/",
            type: "interactive_tutorial",
            duration: "Self-paced",
            provider: "W3Schools"
          },
          {
            title: "JavaScript Course - freeCodeCamp",
            description: "Free comprehensive JavaScript course",
            url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
            type: "course",
            duration: "300 hours",
            provider: "freeCodeCamp"
          },
          {
            title: "Search YouTube: JavaScript Beginner Tutorial 2024",
            description: "Find current JavaScript tutorials on YouTube",
            url: "https://www.youtube.com/results?search_query=javascript+beginner+tutorial+2024",
            type: "video_search",
            searchQuery: "javascript beginner tutorial 2024",
            provider: "YouTube Search"
          }
        ],
        intermediate: [
          {
            title: "JavaScript Advanced Concepts - MDN",
            description: "Advanced JavaScript topics and patterns",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Advanced",
            type: "documentation",
            provider: "MDN"
          },
          {
            title: "JavaScript ES6+ Features",
            description: "Modern JavaScript features and syntax",
            url: "https://www.javascript.info/",
            type: "tutorial",
            provider: "JavaScript.info"
          }
        ]
      },
      python: {
        beginner: [
          {
            title: "Python Tutorial - Official Documentation",
            description: "Official Python tutorial from python.org",
            url: "https://docs.python.org/3/tutorial/",
            type: "documentation",
            provider: "Python.org"
          },
          {
            title: "Python Course - Codecademy",
            description: "Interactive Python learning platform",
            url: "https://www.codecademy.com/learn/learn-python-3",
            type: "interactive_course",
            provider: "Codecademy"
          },
          {
            title: "Python for Beginners - Real Python",
            description: "Comprehensive Python tutorials and guides",
            url: "https://realpython.com/python-basics/",
            type: "tutorial",
            provider: "Real Python"
          },
          {
            title: "Search YouTube: Python Beginner Course 2024",
            description: "Find current Python tutorials on YouTube",
            url: "https://www.youtube.com/results?search_query=python+beginner+course+2024",
            type: "video_search",
            searchQuery: "python beginner course 2024",
            provider: "YouTube Search"
          }
        ]
      },
      react: {
        beginner: [
          {
            title: "React Documentation - Getting Started",
            description: "Official React documentation and tutorial",
            url: "https://react.dev/learn",
            type: "documentation",
            provider: "React Team"
          },
          {
            title: "React Tutorial - freeCodeCamp",
            description: "Free React course with projects",
            url: "https://www.freecodecamp.org/learn/front-end-development-libraries/",
            type: "course",
            provider: "freeCodeCamp"
          }
        ]
      },
      html: {
        beginner: [
          {
            title: "HTML Tutorial - MDN Web Docs",
            description: "Complete HTML guide from Mozilla",
            url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
            type: "documentation",
            provider: "MDN"
          },
          {
            title: "HTML Course - W3Schools",
            description: "Interactive HTML tutorial with examples",
            url: "https://www.w3schools.com/html/",
            type: "interactive_tutorial",
            provider: "W3Schools"
          }
        ]
      },
      css: {
        beginner: [
          {
            title: "CSS Tutorial - MDN Web Docs",
            description: "Complete CSS guide and reference",
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
            type: "documentation",
            provider: "MDN"
          },
          {
            title: "CSS Grid and Flexbox - CSS Tricks",
            description: "Modern CSS layout techniques",
            url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
            type: "guide",
            provider: "CSS-Tricks"
          }
        ]
      }
    };

    // Get resources for the skill
    const skillResources = workingResources[skillLower]?.[level] || 
                          workingResources[skillLower]?.['beginner'] || 
                          this.getGenericResources(skill, level);

    // Convert to video-like format for compatibility
    const formattedResources = skillResources.map((resource, index) => ({
      id: `curated_${skillLower}_${level}_${index}`,
      title: resource.title,
      description: resource.description,
      url: resource.url,
      thumbnail: this.getResourceThumbnail(resource.type),
      type: resource.type,
      provider: resource.provider,
      duration: resource.duration || 'Varies',
      searchQuery: resource.searchQuery,
      working: true,
      curated: true,
      embedUrl: resource.type === 'video_search' ? null : resource.url
    }));

    return {
      success: true,
      data: {
        skill,
        level,
        videos: formattedResources,
        source: 'curated_content',
        message: "Curated working resources - no broken links!",
        totalFound: formattedResources.length,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Get generic resources for any skill
   * @param {string} skill - Skill name
   * @param {string} level - Skill level
   * @returns {Array} Generic resources
   */
  getGenericResources(skill, level) {
    return [
      {
        title: `${skill} Tutorial - Search YouTube`,
        description: `Find current ${skill} tutorials on YouTube`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' ' + level + ' tutorial 2024')}`,
        type: "video_search",
        searchQuery: `${skill} ${level} tutorial 2024`,
        provider: "YouTube Search"
      },
      {
        title: `${skill} Course - Search Coursera`,
        description: `Find ${skill} courses on Coursera`,
        url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
        type: "course_search",
        provider: "Coursera"
      },
      {
        title: `${skill} Documentation - Google Search`,
        description: `Find official ${skill} documentation`,
        url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' official documentation')}`,
        type: "documentation_search",
        provider: "Google Search"
      }
    ];
  }

  /**
   * Get thumbnail for resource type
   * @param {string} type - Resource type
   * @returns {string} Thumbnail URL
   */
  getResourceThumbnail(type) {
    const thumbnails = {
      documentation: 'https://via.placeholder.com/320x180/4285f4/ffffff?text=Documentation',
      tutorial: 'https://via.placeholder.com/320x180/34a853/ffffff?text=Tutorial',
      course: 'https://via.placeholder.com/320x180/ea4335/ffffff?text=Course',
      video_search: 'https://via.placeholder.com/320x180/ff0000/ffffff?text=YouTube',
      interactive_tutorial: 'https://via.placeholder.com/320x180/fbbc04/ffffff?text=Interactive',
      guide: 'https://via.placeholder.com/320x180/9c27b0/ffffff?text=Guide'
    };
    
    return thumbnails[type] || 'https://via.placeholder.com/320x180/666666/ffffff?text=Resource';
  }

  /**
   * Check if quota has been exceeded recently
   * @returns {boolean} Quota status
   */
  isQuotaExceeded() {
    if (!this.quotaExceeded) return false;
    
    // Reset quota check after 1 hour
    if (this.lastQuotaCheck && (Date.now() - this.lastQuotaCheck) > 3600000) {
      this.quotaExceeded = false;
      this.lastQuotaCheck = null;
      return false;
    }
    
    return true;
  }
}

module.exports = new SmartVideoService();
