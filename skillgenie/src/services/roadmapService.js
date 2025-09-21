import { getApiUrl } from '../config/api';

class RoadmapService {
  /**
   * Generate dynamic roadmap using Gemini AI
   * @param {string} skill - Skill to generate roadmap for
   * @param {string} level - Skill level (beginner, intermediate, advanced)
   * @param {string} duration - Duration for the roadmap
   * @returns {Promise<Object>} Generated roadmap
   */
  async generateDynamicRoadmap(skill, level = 'beginner', duration = '3-6 months') {
    try {
      console.log(`🚀 Frontend: Generating roadmap for ${skill} at ${level} level`);
      
      const apiUrl = getApiUrl('');
      const url = `${apiUrl}/api/roadmaps/generate/dynamic`;
      
      console.log('API URL:', url);
      console.log('Request payload:', { skill, level, duration });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          skill: skill,
          level: level,
          duration: duration
        })
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: Failed to generate roadmap`);
      }
      
      return data;
    } catch (error) {
      console.error('Error generating roadmap:', error);
      throw error;
    }
  }

  /**
   * Generate dynamic analytics for a skill
   * @param {string} skill - Skill to analyze
   * @param {string} location - Location for market analysis
   * @param {Object} questionnaireData - User's questionnaire data for personalized analytics
   * @returns {Promise<Object>} Market analytics
   */
  async generateDynamicAnalytics(skill, location = 'Global', questionnaireData = null) {
    try {
      console.log(`📡 [Service] generateDynamicAnalytics called with:`, { skill, location, questionnaireData });
      
      const requestBody = {
        skill,
        location,
        userProfile: questionnaireData ? {
          education: questionnaireData.education,
          experience: questionnaireData.experience,
          skills: questionnaireData.currentSkills || [],
          interests: questionnaireData.interests || [],
          careerGoals: questionnaireData.careerGoals || '',
          preferredDomains: questionnaireData.preferredDomains || []
        } : null
      };
      
      const url = `${getApiUrl('')}/api/analytics/market/dynamic`;
      console.log(`📡 [Service] API URL:`, url);
      console.log(`📡 [Service] Request body:`, requestBody);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      
      console.log(`📡 [Service] Response received:`, {
        success: data.success,
        skill: data.data?.skill,
        location: data.data?.location,
        salary: data.data?.marketOverview?.averageSalary
      });
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate analytics');
      }
      
      return data;
    } catch (error) {
      console.error('Error generating analytics:', error);
      throw error;
    }
  }

  /**
   * Get existing roadmaps
   * @returns {Promise<Object>} User's roadmaps
   */
  async getRoadmaps() {
    try {
      const response = await fetch(`${getApiUrl('')}/api/roadmaps`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch roadmaps');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      throw error;
    }
  }

  /**
   * Get specific roadmap details
   * @param {string} id - Roadmap ID
   * @returns {Promise<Object>} Roadmap details
   */
  async getRoadmapDetails(id) {
    try {
      const response = await fetch(`${getApiUrl('')}/api/roadmaps/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch roadmap details');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching roadmap details:', error);
      throw error;
    }
  }

  /**
   * Update chapter progress
   * @param {string} roadmapId - Roadmap ID
   * @param {number} chapterId - Chapter ID
   * @param {number} progress - Progress percentage
   * @param {number} hoursSpent - Hours spent on chapter
   * @returns {Promise<Object>} Updated progress
   */
  async updateProgress(roadmapId, chapterId, progress, hoursSpent) {
    try {
      const response = await fetch(`${getApiUrl('')}/api/roadmaps/${roadmapId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chapterId,
          progress,
          hoursSpent
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update progress');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }
}

export default new RoadmapService();
