// Service to handle questionnaire data storage and retrieval

class QuestionnaireService {
  constructor() {
    this.storageKey = 'skillgenie_questionnaire_data';
  }

  // Save questionnaire responses to localStorage
  saveQuestionnaireData(data) {
    try {
      const enrichedData = {
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(enrichedData));
      console.log('📝 Questionnaire data saved:', enrichedData);
      return enrichedData;
    } catch (error) {
      console.error('Error saving questionnaire data:', error);
      return null;
    }
  }

  // Get questionnaire responses from localStorage
  getQuestionnaireData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        console.log('📖 Questionnaire data retrieved:', parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving questionnaire data:', error);
      return null;
    }
  }

  // Convert questionnaire domains to skill names for API calls
  mapDomainsToSkills(domains) {
    const domainSkillMap = {
      'ai_ml': 'Machine Learning',
      'web_dev': 'Web Development', 
      'data_science': 'Data Science',
      'cybersecurity': 'Cybersecurity',
      'cloud_computing': 'Cloud Computing',
      'mobile_dev': 'Mobile Development',
      'ui_ux': 'UI/UX Design',
      'product_management': 'Product Management'
    };

    return domains.map(domain => domainSkillMap[domain] || domain);
  }

  // Get primary skill recommendation based on questionnaire
  getPrimarySkillRecommendation() {
    const data = this.getQuestionnaireData();
    if (!data || !data.preferredDomains || data.preferredDomains.length === 0) {
      return 'Data Science'; // Default fallback
    }

    // Get the first preferred domain and map it to a skill
    const primaryDomain = data.preferredDomains[0];
    const skills = this.mapDomainsToSkills([primaryDomain]);
    return skills[0];
  }

  // Get user's experience level
  getExperienceLevel() {
    const data = this.getQuestionnaireData();
    if (!data || !data.experience) {
      return 'beginner';
    }

    // Map questionnaire experience to skill levels
    const experienceMap = {
      'beginner': 'beginner',
      'some_experience': 'intermediate', 
      'experienced': 'advanced',
      'expert': 'advanced'
    };

    return experienceMap[data.experience] || 'beginner';
  }

  // Get user's preferred location (can be enhanced later)
  getPreferredLocation() {
    // For now, return India as default. This can be enhanced to ask location in questionnaire
    return 'India';
  }

  // Get location-based recommendations (method that was missing)
  getLocationRecommendation() {
    const data = this.getQuestionnaireData();
    return data?.location || 'India'; // Return simple location string as expected
  }

  // Get detailed location-based recommendations (separate method for detailed data)
  getDetailedLocationRecommendations() {
    const data = this.getQuestionnaireData();
    const location = data?.location || 'India';
    
    // Return detailed location-based recommendations
    return {
      location: location,
      marketTrends: this.getMarketTrends(location),
      salaryRanges: this.getSalaryRanges(location),
      jobOpportunities: this.getJobOpportunities(location),
      recommendedSkills: this.getLocationBasedSkills(location)
    };
  }

  // Get market trends for location
  getMarketTrends(location) {
    // Mock data - can be enhanced with real API
    const trends = {
      'India': [
        'AI/ML skills are in high demand',
        'Full-stack development is growing rapidly',
        'DevOps and Cloud skills are essential',
        'Data Science remains popular'
      ],
      'USA': [
        'Machine Learning Engineers are highly sought',
        'React/Node.js developers in demand',
        'Cybersecurity skills are premium',
        'Mobile development is stable'
      ]
    };
    
    return trends[location] || trends['India'];
  }

  // Get salary ranges for location
  getSalaryRanges(location) {
    const salaries = {
      'India': {
        'Data Science': '₹8-25 LPA',
        'Web Development': '₹6-20 LPA',
        'Machine Learning': '₹10-30 LPA',
        'Mobile Development': '₹7-22 LPA'
      },
      'USA': {
        'Data Science': '$90K-180K',
        'Web Development': '$80K-160K',
        'Machine Learning': '$120K-250K',
        'Mobile Development': '$85K-170K'
      }
    };
    
    return salaries[location] || salaries['India'];
  }

  // Get job opportunities for location
  getJobOpportunities(location) {
    const opportunities = {
      'India': {
        'Data Science': 'High demand in Bangalore, Hyderabad, Pune',
        'Web Development': 'Excellent opportunities across all cities',
        'Machine Learning': 'Growing rapidly in tech hubs',
        'Mobile Development': 'Strong demand in startups and enterprises'
      },
      'USA': {
        'Data Science': 'High demand in Silicon Valley, New York, Seattle',
        'Web Development': 'Strong opportunities nationwide',
        'Machine Learning': 'Premium roles in tech giants',
        'Mobile Development': 'Stable demand across industries'
      }
    };
    
    return opportunities[location] || opportunities['India'];
  }

  // Get location-based skill recommendations
  getLocationBasedSkills(location) {
    const skills = {
      'India': [
        'Python for Data Science',
        'React.js for Web Development',
        'AWS/Azure for Cloud',
        'Machine Learning with TensorFlow'
      ],
      'USA': [
        'Advanced Machine Learning',
        'Full-Stack JavaScript',
        'DevOps and Kubernetes',
        'AI/ML Engineering'
      ]
    };
    
    return skills[location] || skills['India'];
  }

  // Get all preferred skills for roadmap generation
  getAllPreferredSkills() {
    const data = this.getQuestionnaireData();
    if (!data || !data.preferredDomains) {
      return ['Data Science'];
    }

    return this.mapDomainsToSkills(data.preferredDomains);
  }

  // Get learning preferences for customized content
  getLearningPreferences() {
    const data = this.getQuestionnaireData();
    return {
      learningStyle: data?.learningStyle || 'mixed',
      timeCommitment: data?.timeCommitment || 'moderate',
      currentSkills: data?.currentSkills || [],
      careerGoals: data?.careerGoals || ''
    };
  }

  // Check if user has completed questionnaire
  hasCompletedQuestionnaire() {
    const data = this.getQuestionnaireData();
    return data && data.preferredDomains && data.preferredDomains.length > 0;
  }

  // Clear questionnaire data (for testing or reset)
  clearQuestionnaireData() {
    localStorage.removeItem(this.storageKey);
    console.log('🗑️ Questionnaire data cleared');
  }

  // Generate personalized recommendations based on questionnaire
  generatePersonalizedRecommendations() {
    const data = this.getQuestionnaireData();
    if (!data) return null;

    const recommendations = {
      primarySkill: this.getPrimarySkillRecommendation(),
      experienceLevel: this.getExperienceLevel(),
      allSkills: this.getAllPreferredSkills(),
      learningPath: this.generateLearningPath(data),
      timeEstimate: this.estimateTimeToComplete(data),
      customizedTips: this.generateCustomizedTips(data)
    };

    console.log('🎯 Generated personalized recommendations:', recommendations);
    return recommendations;
  }

  // Generate learning path based on user preferences
  generateLearningPath(data) {
    const paths = [];
    
    if (data.preferredDomains.includes('mobile_dev')) {
      paths.push({
        skill: 'Mobile Development',
        reason: 'Based on your interest in mobile development',
        priority: 1
      });
    }
    
    if (data.preferredDomains.includes('data_science')) {
      paths.push({
        skill: 'Data Science', 
        reason: 'Based on your interest in data science',
        priority: 2
      });
    }

    if (data.preferredDomains.includes('ai_ml')) {
      paths.push({
        skill: 'Machine Learning',
        reason: 'Based on your interest in AI & ML',
        priority: 3
      });
    }

    return paths.length > 0 ? paths : [{
      skill: 'Web Development',
      reason: 'Great starting point for beginners',
      priority: 1
    }];
  }

  // Estimate time to complete based on user's time commitment
  estimateTimeToComplete(data) {
    const timeCommitmentMap = {
      'part_time': '6-8 months',
      'full_time': '3-4 months', 
      'weekend': '8-12 months',
      'intensive': '2-3 months'
    };

    return timeCommitmentMap[data.timeCommitment] || '4-6 months';
  }

  // Generate customized tips based on learning style
  generateCustomizedTips(data) {
    const tips = [];

    if (data.learningStyle === 'visual') {
      tips.push('Focus on video tutorials and visual diagrams');
      tips.push('Use mind maps and flowcharts for complex concepts');
    } else if (data.learningStyle === 'practical') {
      tips.push('Build projects while learning each concept');
      tips.push('Practice coding exercises daily');
    } else if (data.learningStyle === 'reading') {
      tips.push('Read documentation and technical blogs');
      tips.push('Take detailed notes and create summaries');
    } else {
      tips.push('Combine videos, projects, and reading for best results');
      tips.push('Adapt your learning method based on the topic');
    }

    return tips;
  }
}

export default new QuestionnaireService();
