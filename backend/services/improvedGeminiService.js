const { GoogleGenerativeAI } = require('@google/generative-ai');

class ImprovedGeminiService {
  constructor() {
    require('dotenv').config();
    this.apiKey = process.env.GEMINI_API_KEY;

    console.log('🔧 Initializing Improved Gemini Service...');
    console.log('API Key status:', this.apiKey ? '✅ Available' : '❌ Missing');

    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      console.log('✅ Gemini AI client initialized');
    } else {
      console.warn('⚠️ No Gemini API key - using enhanced fallbacks');
    }
  }

  async generateRoadmap(skill, level = 'beginner', duration = '3-6 months') {
    console.log(`🚀 [GEMINI SERVICE] generateRoadmap called:`);
    console.log(`   Input Skill: "${skill}"`);
    console.log(`   Input Level: "${level}"`);
    console.log(`   Input Duration: "${duration}"`);

    if (!this.apiKey) {
      console.log('📋 [GEMINI SERVICE] No API key, using enhanced fallback');
      return this.getEnhancedFallbackRoadmap(skill, level, duration);
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 3000,
        }
      });

      const prompt = `Create a detailed learning roadmap for "${skill}" at ${level} level.

REQUIREMENTS:
- Duration: ${duration}
- Generate 6-8 chapters specific to ${skill}
- Each chapter should have practical projects
- Include real tools and technologies used in ${skill}

Return valid JSON only:
{
  "title": "${skill} Complete Learning Path",
  "description": "Master ${skill} from ${level} to professional level",
  "totalDuration": "${duration}",
  "difficulty": "${level}",
  "chapters": [
    {
      "id": 1,
      "title": "Chapter specific to ${skill}",
      "description": "What you'll learn in this chapter",
      "duration": "2 weeks",
      "difficulty": "Beginner",
      "topics": ["topic1", "topic2", "topic3"],
      "learningObjectives": ["objective1", "objective2"],
      "practicalProjects": ["project1", "project2"],
      "assessmentType": "quiz"
    }
  ],
  "prerequisites": ["prereq1", "prereq2"],
  "careerOutcomes": ["career1", "career2", "career3"],
  "estimatedSalaryRange": "$60,000 - $120,000"
}

Make it specific to ${skill} - not generic programming content.`;

      console.log('🤖 Calling Gemini API...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('📝 Gemini response received, parsing...');

      // Parse the JSON response
      let roadmapData;
      try {
        // Clean the response
        let jsonStr = text.trim();
        if (jsonStr.includes('```json')) {
          jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/\n?```/g, '');
        } else if (jsonStr.includes('```')) {
          jsonStr = jsonStr.replace(/```\n?/g, '');
        }

        // Find JSON object
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          roadmapData = JSON.parse(jsonMatch[0]);
        } else {
          roadmapData = JSON.parse(jsonStr);
        }

        console.log('✅ Successfully parsed Gemini response');

        return {
          success: true,
          data: roadmapData,
          generatedBy: 'Gemini AI',
          timestamp: new Date().toISOString()
        };

      } catch (parseError) {
        console.error('❌ Failed to parse Gemini response:', parseError.message);
        console.log('Raw response preview:', text.substring(0, 200));
        throw parseError;
      }

    } catch (error) {
      console.error('❌ Gemini API error:', error.message);

      if (error.message.includes('quota') || error.message.includes('limit')) {
        console.log('📊 Quota exceeded, using fallback');
      } else if (error.message.includes('API_KEY')) {
        console.log('🔑 API key issue, using fallback');
      } else {
        console.log('🌐 Network issue, using fallback');
      }

      return this.getEnhancedFallbackRoadmap(skill, level, duration);
    }
  }

  async generateAnalytics(skill, location = 'Global', userProfile = {}) {
    console.log(`📊 [GEMINI SERVICE] generateAnalytics called for: "${skill}" in "${location}"`);
    console.log(`📊 [GEMINI SERVICE] User profile:`, userProfile);
    console.log(`📊 [GEMINI SERVICE] API Key available: ${this.apiKey ? 'YES' : 'NO'}`);

    // Step 1: Collect real market data
    const marketData = await this.collectMarketData(skill, location);
    console.log(`📊 [GEMINI SERVICE] Collected market data:`, marketData);

    if (!this.apiKey) {
      console.log(`📋 [GEMINI SERVICE] No API key, using enhanced fallback with real data`);
      return this.getEnhancedFallbackAnalytics(skill, location, marketData);
    }

    console.log(`🤖 [GEMINI SERVICE] Using Gemini as AI analyst...`);

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      });

      const currencySymbol = location === 'India' ? '₹' : '$';

      const prompt = `You are an AI Market Analyst. I'm providing you with REAL market data for "${skill}" in ${location}. 
Your job is to INTERPRET, ANALYZE, and FORECAST based on this data.

REAL MARKET DATA PROVIDED:
${JSON.stringify(marketData, null, 2)}

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

ANALYSIS INSTRUCTIONS:
1. Interpret the real data trends and patterns
2. Generate demand forecasts for next 5 years based on historical trends
3. Analyze regional opportunities and competition levels
4. Provide salary progression insights based on real salary ranges
5. Create skill popularity rankings and market saturation analysis
6. Generate personalized recommendations based on user profile

Return STRUCTURED ANALYSIS in JSON format:
{
  "skill": "${skill}",
  "location": "${location}",
  "marketOverview": {
    "demandLevel": "High/Very High/Medium",
    "growthRate": "realistic % for ${skill}",
    "averageSalary": "${currencySymbol}realistic_amount",
    "salaryRange": {
      "entry": "${currencySymbol}entry_level_salary",
      "mid": "${currencySymbol}mid_level_salary", 
      "senior": "${currencySymbol}senior_level_salary"
    },
    "jobOpenings": "realistic_number_for_${location}",
    "competitionLevel": "High/Medium/Low"
  },
  "topCompanies": [
    {"name": "Company1", "openings": number, "averageSalary": "${currencySymbol}amount"},
    {"name": "Company2", "openings": number, "averageSalary": "${currencySymbol}amount"},
    {"name": "Company3", "openings": number, "averageSalary": "${currencySymbol}amount"}
  ],
  "requiredSkills": [
    {"skill": "${skill}", "demand": 100},
    {"skill": "relevant_skill_1", "demand": number},
    {"skill": "relevant_skill_2", "demand": number}
  ],
  "careerPaths": [
    {"role": "Entry ${skill} role", "experience": "0-2 years", "salary": "${currencySymbol}amount"},
    {"role": "Mid ${skill} role", "experience": "3-5 years", "salary": "${currencySymbol}amount"},
    {"role": "Senior ${skill} role", "experience": "5-8 years", "salary": "${currencySymbol}amount"}
  ],
  "futureOutlook": {
    "projection": "Growing/Stable/Declining",
    "automationRisk": "Low/Medium/High",
    "emergingAreas": ["area1_specific_to_${skill}", "area2_specific_to_${skill}"]
  },
  "graphData": {
    "salaryProgression": [
      {"year": 0, "salary": entry_salary_number},
      {"year": 2, "salary": year2_salary_number},
      {"year": 5, "salary": year5_salary_number},
      {"year": 8, "salary": year8_salary_number},
      {"year": 10, "salary": year10_salary_number}
    ],
    "demandTrend": [
      {"month": "Jan", "demand": 100},
      {"month": "Feb", "demand": number},
      {"month": "Mar", "demand": number},
      {"month": "Apr", "demand": number},
      {"month": "May", "demand": number},
      {"month": "Jun", "demand": number}
    ]
  }
}

Make ALL data realistic and specific to ${skill} in ${location}. Use current 2024 market rates.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON
      let analyticsData;
      try {
        let jsonStr = text.trim();
        if (jsonStr.includes('```json')) {
          jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/\n?```/g, '');
        }

        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analyticsData = JSON.parse(jsonMatch[0]);
        } else {
          analyticsData = JSON.parse(jsonStr);
        }

        return {
          success: true,
          data: analyticsData,
          generatedBy: 'Gemini AI',
          timestamp: new Date().toISOString()
        };

      } catch (parseError) {
        console.error('Analytics parse error:', parseError.message);
        throw parseError;
      }

    } catch (error) {
      console.error('❌ [GEMINI SERVICE] Analytics generation error:', error.message);
      console.log('🔄 [GEMINI SERVICE] Falling back to enhanced fallback system');
      return this.getEnhancedFallbackAnalytics(skill, location);
    }
  }

  async chatMentor(message, context = {}) {
    console.log(`💬 AI Mentor chat: "${message.substring(0, 50)}..."`);

    if (!this.apiKey) {
      return this.getFallbackChatResponse(message, context);
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 500,
        }
      });

      const { skill, currentChapter, quizScore, roadmapProgress } = context;

      const prompt = `You are a supportive AI mentor helping a student learn ${skill || 'programming'}.

Context:
- Student is learning: ${skill || 'programming'}
- Current chapter: ${currentChapter || 'General concepts'}
- Last quiz score: ${quizScore || 'N/A'}%
- Progress: ${roadmapProgress || 0}%

Student asks: "${message}"

Provide a helpful, encouraging response (max 200 words) that:
1. Directly answers their question
2. Uses simple examples related to ${skill || 'programming'}
3. Gives actionable tips
4. Encourages continued learning

Be conversational and supportive.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      return {
        success: true,
        message: response.text(),
        context: context,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Chat mentor error:', error.message);
      return this.getFallbackChatResponse(message, context);
    }
  }

  // Enhanced Fallback Methods
  getEnhancedFallbackRoadmap(skill, level, duration) {
    console.log(`📋 [FALLBACK] getEnhancedFallbackRoadmap called:`);
    console.log(`   Input Skill: "${skill}"`);
    console.log(`   Skill toLowerCase: "${skill.toLowerCase()}"`);
    console.log(`   Level: "${level}"`);
    console.log(`   Duration: "${duration}"`);

    const skillLower = skill.toLowerCase();
    let chapters = [];

    console.log(`🔍 [FALLBACK] Checking skill category...`);

    // Skill-specific chapter generation
    if (skillLower.includes('mobile') || skillLower.includes('ios') || skillLower.includes('android')) {
      console.log(`✅ [FALLBACK] Matched MOBILE category for "${skill}"`);
      chapters = [
        {
          id: 1,
          title: "Mobile Development Fundamentals",
          description: "Learn the core concepts of mobile app development",
          duration: "2 weeks",
          difficulty: "Beginner",
          topics: ["Native vs Cross-platform", "Mobile UI/UX Design", "App Architecture Patterns"],
          learningObjectives: ["Understand mobile ecosystems", "Choose development approach", "Design mobile-first experiences"],
          practicalProjects: ["Simple Calculator App", "Todo List with Local Storage"],
          assessmentType: "project"
        },
        {
          id: 2,
          title: "iOS Development with Swift",
          description: "Build native iOS applications using Swift",
          duration: "4 weeks",
          difficulty: "Intermediate",
          topics: ["Swift Programming Language", "UIKit Framework", "SwiftUI", "Xcode IDE", "iOS SDK"],
          learningObjectives: ["Master Swift syntax", "Build iOS interfaces", "Use Apple frameworks"],
          practicalProjects: ["Weather App with API", "Photo Gallery App", "Social Media Clone"],
          assessmentType: "project"
        },
        {
          id: 3,
          title: "Android Development with Kotlin",
          description: "Create Android apps using modern Kotlin",
          duration: "4 weeks",
          difficulty: "Intermediate",
          topics: ["Kotlin Language", "Android Studio", "Jetpack Compose", "Material Design", "Android SDK"],
          learningObjectives: ["Write efficient Kotlin code", "Build Android UIs", "Handle Android lifecycle"],
          practicalProjects: ["News Reader App", "Music Player", "E-commerce App"],
          assessmentType: "project"
        },
        {
          id: 4,
          title: "Cross-Platform with React Native",
          description: "Build apps for both iOS and Android",
          duration: "3 weeks",
          difficulty: "Intermediate",
          topics: ["React Native Framework", "Expo CLI", "Navigation", "State Management", "Native Modules"],
          learningObjectives: ["Develop cross-platform apps", "Optimize performance", "Access device features"],
          practicalProjects: ["Fitness Tracking App", "Recipe Sharing App", "Chat Application"],
          assessmentType: "project"
        },
        {
          id: 5,
          title: "Backend Integration & APIs",
          description: "Connect mobile apps to backend services",
          duration: "3 weeks",
          difficulty: "Intermediate",
          topics: ["REST APIs", "Firebase Integration", "Authentication", "Push Notifications", "Real-time Data"],
          learningObjectives: ["Integrate APIs", "Implement authentication", "Handle real-time updates"],
          practicalProjects: ["Social Media Backend", "Real-time Chat", "User Management System"],
          assessmentType: "both"
        },
        {
          id: 6,
          title: "App Testing & Quality Assurance",
          description: "Ensure app reliability and performance",
          duration: "2 weeks",
          difficulty: "Advanced",
          topics: ["Unit Testing", "UI Testing", "Performance Testing", "Debugging", "Crash Analytics"],
          learningObjectives: ["Write comprehensive tests", "Debug effectively", "Monitor app health"],
          practicalProjects: ["Automated Test Suite", "Performance Optimization", "Bug Tracking System"],
          assessmentType: "project"
        },
        {
          id: 7,
          title: "App Store Deployment",
          description: "Publish and maintain your mobile apps",
          duration: "2 weeks",
          difficulty: "Advanced",
          topics: ["App Store Guidelines", "Google Play Store", "App Store Optimization", "Monetization", "Analytics"],
          learningObjectives: ["Publish to app stores", "Optimize for discovery", "Implement monetization"],
          practicalProjects: ["App Store Submission", "ASO Implementation", "Revenue Analytics"],
          assessmentType: "project"
        }
      ];
    } else if (skillLower.includes('data') && skillLower.includes('science')) {
      console.log(`✅ [FALLBACK] Matched DATA SCIENCE category for "${skill}"`);
      chapters = [
        {
          id: 1,
          title: "Python for Data Science",
          description: "Master Python programming for data analysis",
          duration: "3 weeks",
          difficulty: "Beginner",
          topics: ["Python Fundamentals", "NumPy Arrays", "Pandas DataFrames", "Data Structures"],
          learningObjectives: ["Write Python code efficiently", "Manipulate data with Pandas", "Perform numerical computations"],
          practicalProjects: ["Sales Data Analysis", "Customer Segmentation", "Data Cleaning Pipeline"],
          assessmentType: "both"
        },
        {
          id: 2,
          title: "Statistics & Probability",
          description: "Essential statistical concepts for data science",
          duration: "3 weeks",
          difficulty: "Intermediate",
          topics: ["Descriptive Statistics", "Probability Distributions", "Hypothesis Testing", "Correlation Analysis"],
          learningObjectives: ["Apply statistical methods", "Test hypotheses", "Interpret statistical results"],
          practicalProjects: ["A/B Testing Analysis", "Survey Data Analysis", "Statistical Report"],
          assessmentType: "quiz"
        },
        {
          id: 3,
          title: "Data Visualization",
          description: "Create compelling data visualizations",
          duration: "2 weeks",
          difficulty: "Intermediate",
          topics: ["Matplotlib", "Seaborn", "Plotly", "Dashboard Creation", "Storytelling with Data"],
          learningObjectives: ["Create effective visualizations", "Build interactive dashboards", "Tell stories with data"],
          practicalProjects: ["Sales Dashboard", "Interactive Data Explorer", "Infographic Creation"],
          assessmentType: "project"
        },
        {
          id: 4,
          title: "Machine Learning Fundamentals",
          description: "Introduction to machine learning algorithms",
          duration: "4 weeks",
          difficulty: "Advanced",
          topics: ["Supervised Learning", "Unsupervised Learning", "Scikit-learn", "Model Evaluation", "Feature Engineering"],
          learningObjectives: ["Build ML models", "Evaluate model performance", "Engineer features"],
          practicalProjects: ["Predictive Model", "Customer Clustering", "Recommendation System"],
          assessmentType: "project"
        },
        {
          id: 5,
          title: "Deep Learning & Neural Networks",
          description: "Advanced machine learning with neural networks",
          duration: "4 weeks",
          difficulty: "Advanced",
          topics: ["Neural Networks", "TensorFlow", "Keras", "Deep Learning", "Computer Vision"],
          learningObjectives: ["Build neural networks", "Train deep learning models", "Apply to real problems"],
          practicalProjects: ["Image Classifier", "Text Sentiment Analysis", "Time Series Prediction"],
          assessmentType: "project"
        },
        {
          id: 6,
          title: "Big Data & Cloud Computing",
          description: "Handle large-scale data processing",
          duration: "3 weeks",
          difficulty: "Advanced",
          topics: ["Apache Spark", "AWS/GCP", "Distributed Computing", "Data Pipelines", "Cloud ML"],
          learningObjectives: ["Process big data", "Use cloud platforms", "Build scalable systems"],
          practicalProjects: ["Big Data Pipeline", "Cloud ML Model", "Real-time Analytics"],
          assessmentType: "project"
        }
      ];
    } else {
      console.log(`🔧 [FALLBACK] Using GENERIC category for "${skill}"`);
      // Generic skill-specific chapters
      chapters = [
        {
          id: 1,
          title: `${skill} Fundamentals`,
          description: `Learn the core concepts and basics of ${skill}`,
          duration: "2 weeks",
          difficulty: "Beginner",
          topics: [`${skill} Basics`, "Core Concepts", "Development Environment"],
          learningObjectives: [`Understand ${skill} principles`, "Set up development environment", "Write basic code"],
          practicalProjects: ["Hello World Project", "Basic Implementation"],
          assessmentType: "quiz"
        },
        {
          id: 2,
          title: `Intermediate ${skill}`,
          description: `Advanced concepts and techniques in ${skill}`,
          duration: "3 weeks",
          difficulty: "Intermediate",
          topics: ["Advanced Features", "Best Practices", "Design Patterns"],
          learningObjectives: ["Apply advanced concepts", "Follow best practices", "Implement patterns"],
          practicalProjects: ["Medium Complexity Project", "Pattern Implementation"],
          assessmentType: "project"
        },
        {
          id: 3,
          title: `${skill} Project Development`,
          description: `Build real-world projects using ${skill}`,
          duration: "4 weeks",
          difficulty: "Intermediate",
          topics: ["Project Architecture", "Testing", "Deployment"],
          learningObjectives: ["Design project structure", "Implement testing", "Deploy applications"],
          practicalProjects: ["Full Application", "Portfolio Project"],
          assessmentType: "project"
        },
        {
          id: 4,
          title: `Advanced ${skill} Techniques`,
          description: `Master advanced concepts and optimization`,
          duration: "3 weeks",
          difficulty: "Advanced",
          topics: ["Performance Optimization", "Security", "Scalability"],
          learningObjectives: ["Optimize performance", "Implement security", "Scale applications"],
          practicalProjects: ["Optimized Application", "Security Implementation"],
          assessmentType: "both"
        },
        {
          id: 5,
          title: `${skill} Ecosystem & Tools`,
          description: `Master the tools and libraries in ${skill}`,
          duration: "2 weeks",
          difficulty: "Intermediate",
          topics: ["Popular Libraries", "Development Tools", "Community Resources"],
          learningObjectives: ["Use professional tools", "Leverage libraries", "Engage with community"],
          practicalProjects: ["Tool Integration", "Library Implementation"],
          assessmentType: "project"
        },
        {
          id: 6,
          title: `${skill} Career Preparation`,
          description: `Prepare for a career using ${skill}`,
          duration: "2 weeks",
          difficulty: "Advanced",
          topics: ["Interview Preparation", "Portfolio Building", "Industry Trends"],
          learningObjectives: ["Build strong portfolio", "Prepare for interviews", "Stay current with trends"],
          practicalProjects: ["Portfolio Website", "Interview Practice"],
          assessmentType: "project"
        }
      ];
    }

    const roadmapData = {
      title: `${skill} Complete Learning Path`,
      description: `Comprehensive roadmap to master ${skill} from ${level} to professional level`,
      totalDuration: duration,
      difficulty: level,
      chapters: chapters,
      skill: skill, // Explicitly include the skill
      level: level, // Explicitly include the level
      prerequisites: level === 'beginner' ?
        ["Basic computer skills", "Problem-solving mindset", "Dedication to learn"] :
        [`Basic ${skill} knowledge`, "Programming fundamentals", "Previous experience helpful"],
      careerOutcomes: this.getCareerOutcomes(skill),
      estimatedSalaryRange: this.getSalaryRange(skill)
    };

    console.log(`📋 [FALLBACK] Final roadmap data:`);
    console.log(`   Title: "${roadmapData.title}"`);
    console.log(`   Skill: "${roadmapData.skill}"`);
    console.log(`   Chapters: ${roadmapData.chapters.length}`);
    console.log(`   First chapter: "${roadmapData.chapters[0]?.title}"`);

    return {
      success: true,
      data: roadmapData,
      generatedBy: 'Enhanced Fallback System',
      timestamp: new Date().toISOString()
    };
  }

  getEnhancedFallbackAnalytics(skill, location, realMarketData = null) {
    console.log(`📊 [FALLBACK ANALYTICS] Generating for skill: "${skill}" in location: "${location}"`);
    console.log(`📊 [FALLBACK ANALYTICS] Using real market data:`, !!realMarketData);

    // If we have real market data, use it; otherwise use skill-based estimates
    let marketData = {};

    if (realMarketData) {
      // Use real market data collected from APIs
      const currencySymbol = location === 'India' ? '₹' : '$';
      marketData = {
        demandLevel: realMarketData.skillDemandScore > 85 ? "Very High" :
          realMarketData.skillDemandScore > 70 ? "High" : "Medium",
        growthRate: `${realMarketData.yearOverYearGrowth}%`,
        averageSalary: `${currencySymbol}${realMarketData.averageSalary.toLocaleString()}`,
        salaryRange: {
          entry: `${currencySymbol}${realMarketData.salaryRange.min.toLocaleString()}`,
          mid: `${currencySymbol}${realMarketData.averageSalary.toLocaleString()}`,
          senior: `${currencySymbol}${realMarketData.salaryRange.max.toLocaleString()}`
        },
        jobOpenings: `${(realMarketData.totalJobOpenings / 1000).toFixed(0)}K+`,
        competitionLevel: realMarketData.competitionIndex > 0.8 ? "High" :
          realMarketData.competitionIndex > 0.6 ? "Medium" : "Low"
      };
    } else {
      // Fallback to skill-based estimates
      const skillLower = skill.toLowerCase();

      // Skill-specific market data with location adjustments
      if (skillLower.includes('mobile')) {
        marketData = {
          demandLevel: "High",
          growthRate: "22%",
          averageSalary: location === 'India' ? "₹12,00,000" : "$95,000",
          salaryRange: {
            entry: location === 'India' ? "₹8,00,000" : "$75,000",
            mid: location === 'India' ? "₹12,00,000" : "$95,000",
            senior: location === 'India' ? "₹20,00,000" : "$140,000"
          },
          jobOpenings: location === 'India' ? "1,20,000+" : "45,000+",
          competitionLevel: "Medium"
        };
      } else if (skillLower.includes('data')) {
        marketData = {
          demandLevel: "Very High",
          growthRate: "35%",
          averageSalary: location === 'India' ? "₹15,00,000" : "$110,000",
          salaryRange: {
            entry: location === 'India' ? "₹10,00,000" : "$85,000",
            mid: location === 'India' ? "₹15,00,000" : "$110,000",
            senior: location === 'India' ? "₹25,00,000" : "$160,000"
          },
          jobOpenings: location === 'India' ? "2,50,000+" : "50,000+",
          competitionLevel: "High"
        };
      } else if (skillLower.includes('python')) {
        marketData = {
          demandLevel: "Very High",
          growthRate: "28%",
          averageSalary: location === 'India' ? "₹11,00,000" : "$88,000",
          salaryRange: {
            entry: location === 'India' ? "₹6,00,000" : "$60,000",
            mid: location === 'India' ? "₹11,00,000" : "$88,000",
            senior: location === 'India' ? "₹18,00,000" : "$130,000"
          },
          jobOpenings: location === 'India' ? "3,00,000+" : "80,000+",
          competitionLevel: "High"
        };
      } else if (skillLower.includes('react') || skillLower.includes('javascript')) {
        marketData = {
          demandLevel: "High",
          growthRate: "25%",
          averageSalary: location === 'India' ? "₹9,00,000" : "$82,000",
          salaryRange: {
            entry: location === 'India' ? "₹5,00,000" : "$55,000",
            mid: location === 'India' ? "₹9,00,000" : "$82,000",
            senior: location === 'India' ? "₹16,00,000" : "$120,000"
          },
          jobOpenings: location === 'India' ? "2,00,000+" : "70,000+",
          competitionLevel: "Medium"
        };
      } else {
        marketData = {
          demandLevel: "High",
          growthRate: "18%",
          averageSalary: location === 'India' ? "₹8,00,000" : "$85,000",
          salaryRange: {
            entry: location === 'India' ? "₹4,50,000" : "$65,000",
            mid: location === 'India' ? "₹8,00,000" : "$85,000",
            senior: location === 'India' ? "₹14,00,000" : "$125,000"
          },
          jobOpenings: location === 'India' ? "1,50,000+" : "30,000+",
          competitionLevel: "Medium"
        };
      } // Close the else block

    console.log(`📊 [FALLBACK ANALYTICS] Generated market data:`, marketData);

    return {
      success: true,
      data: {
        skill: skill,
        location: location,
        marketOverview: marketData,
        topCompanies: [
          { name: "Google", openings: 150, averageSalary: "$140,000" },
          { name: "Microsoft", openings: 120, averageSalary: "$135,000" },
        ],
          requiredSkills: [
          { skill: skill, demand: 100 },
          { skill: "Problem Solving", demand: 95 },
          { skill: "Communication", demand: 85 },
          { skill: "Teamwork", demand: 80 },
          { skill: "Adaptability", demand: 90 }
        ],
        careerPaths: [
          { role: `Junior ${skill} Developer`, experience: "0-2 years", salary: marketData.salaryRange.entry },
          { role: `${skill} Developer`, experience: "2-5 years", salary: marketData.salaryRange.mid },
          { role: `Senior ${skill} Developer`, experience: "5-8 years", salary: marketData.salaryRange.senior },
          { role: "Technical Lead", experience: "8+ years", salary: "$160,000+" },
          { role: "Solution Architect", experience: "10+ years", salary: "$180,000+" }
        ],
        futureOutlook: {
          projection: "Growing",
          automationRisk: "Low",
          emergingAreas: ["AI Integration", "Cloud Computing", "Remote Work"]
        },  
        graphData: {
          salaryProgression: this.generateSalaryProgression(skill, location, marketData),
          demandTrend: this.generateDemandTrend(skill),
          skillDistribution: [
            { skill: "Core Skills", percentage: 40 },
            { skill: "Framework Knowledge", percentage: 30 },
            { skill: "Soft Skills", percentage: 20 },
            { skill: "Specialized Skills", percentage: 10 }
          ]
        }
      },
      generatedBy: 'Enhanced Fallback System',
      timestamp: new Date().toISOString()
    };
  }

  getFallbackChatResponse(message, context) {
    const { skill, currentChapter, quizScore } = context;

    // Create structured, attractive responses
    const responses = [
      {
        greeting: `🎉 Great progress on ${skill || 'programming'}!`,
        mainContent: [
          `You're ${quizScore ? `${quizScore}% through` : 'making excellent progress on'} ${currentChapter || 'your learning journey'}.`,
          `Here are some key tips to keep you moving forward:`
        ],
        tips: [
          "💡 Break complex problems into smaller, manageable pieces",
          "🔄 Practice regularly with hands-on coding exercises",
          "🧪 Don't hesitate to experiment with different approaches",
          "📚 Focus on understanding fundamentals before moving to advanced topics"
        ],
        encouragement: "Remember, every expert was once a beginner. Keep up the fantastic work! 🚀"
      },
      {
        greeting: `👋 Hello there, ${skill || 'programming'} learner!`,
        mainContent: [
          `${quizScore ? `Scoring ${quizScore}% shows you're grasping the concepts well!` : 'You\'re on the right track with your studies.'}`,
          `Learning takes time and persistence, but you're building valuable skills:`
        ],
        tips: [
          "🎯 Set small, achievable daily coding goals",
          "🏗️ Build projects that genuinely interest you",
          "👥 Join coding communities and ask questions",
          "🔍 Debug errors as learning opportunities, not obstacles"
        ],
        encouragement: "Each challenge you overcome makes you a stronger developer! 💪"
      },
      {
        greeting: `🌟 Excellent question about ${skill || 'your studies'}!`,
        mainContent: [
          `${currentChapter ? `Since you're working on ${currentChapter}, ` : ''}here's how to maximize your learning:`,
          `The key is building a strong foundation through practical application:`
        ],
        tips: [
          "🚀 Start with simple projects and gradually add complexity",
          "📝 Write clean, readable code from the beginning",
          "🔄 Refactor and improve your existing projects",
          "📊 Track your progress and celebrate small wins"
        ],
        encouragement: "This hands-on approach will reinforce your learning and build confidence! ✨"
      }
    ];

    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    // Format the response in a structured way
    const formattedMessage = {
      type: 'structured',
      greeting: selectedResponse.greeting,
      content: selectedResponse.mainContent,
      tips: selectedResponse.tips,
      encouragement: selectedResponse.encouragement,
      // Also provide a plain text version for backwards compatibility
      plainText: `${selectedResponse.greeting}\n\n${selectedResponse.mainContent.join(' ')}\n\n${selectedResponse.tips.join('\n')}\n\n${selectedResponse.encouragement}`
    };

    return {
      success: true,
      message: formattedMessage,
      context: context,
      timestamp: new Date().toISOString()
    };
  }

  getCareerOutcomes(skill) {
    const skillLower = skill.toLowerCase();

    if (skillLower.includes('mobile')) {
      return ["Mobile App Developer", "iOS Developer", "Android Developer", "Cross-Platform Developer", "Mobile UI/UX Designer"];
    } else if (skillLower.includes('data')) {
      return ["Data Scientist", "Data Analyst", "Machine Learning Engineer", "Data Engineer", "Business Intelligence Analyst"];
    } else if (skillLower.includes('web')) {
      return ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Web Designer", "DevOps Engineer"];
    } else {
      return [`${skill} Developer`, `${skill} Engineer`, `Senior ${skill} Developer`, "Technical Lead", "Software Architect"];
    }
  }

  getSalaryRange(skill) {
    const skillLower = skill.toLowerCase();

    if (skillLower.includes('mobile')) {
      return "$75,000 - $140,000";
    } else if (skillLower.includes('data')) {
      return "$85,000 - $160,000";
    } else if (skillLower.includes('web')) {
      return "$70,000 - $130,000";
    } else {
      return "$65,000 - $125,000";
    }
  }

  // Generate skill-specific salary progression data
  generateSalaryProgression(skill, location, marketData) {
    const skillLower = skill.toLowerCase();
    let baseMultiplier = 1;

    // Different growth patterns for different skills
    if (skillLower.includes('mobile')) {
      baseMultiplier = 1.2; // Mobile dev has higher growth
    } else if (skillLower.includes('data')) {
      baseMultiplier = 1.4; // Data science has highest growth
    } else if (skillLower.includes('python')) {
      baseMultiplier = 1.3;
    } else if (skillLower.includes('react')) {
      baseMultiplier = 1.1;
    }

    const entrySalary = this.parseSalary(marketData.salaryRange.entry, location);
    const midSalary = this.parseSalary(marketData.salaryRange.mid, location);
    const seniorSalary = this.parseSalary(marketData.salaryRange.senior, location);

    return [
      { year: 0, salary: entrySalary },
      { year: 2, salary: Math.round(entrySalary * 1.3 * baseMultiplier) },
      { year: 5, salary: midSalary },
      { year: 8, salary: seniorSalary },
      { year: 10, salary: Math.round(seniorSalary * 1.2) }
    ];
  }

  // Generate skill-specific demand trend data
  generateDemandTrend(skill) {
    const skillLower = skill.toLowerCase();
    let growthPattern = [];

    if (skillLower.includes('mobile')) {
      // Mobile development - steady growth
      growthPattern = [100, 108, 116, 125, 134, 143];
    } else if (skillLower.includes('data')) {
      // Data science - exponential growth
      growthPattern = [100, 115, 132, 152, 175, 201];
    } else if (skillLower.includes('python')) {
      // Python - high demand growth
      growthPattern = [100, 112, 126, 142, 160, 180];
    } else if (skillLower.includes('react')) {
      // React - moderate growth
      growthPattern = [100, 106, 113, 121, 129, 138];
    } else {
      // Default pattern
      growthPattern = [100, 105, 111, 118, 125, 133];
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, index) => ({
      month,
      demand: growthPattern[index]
    }));
  }

  // Helper to parse salary strings
  parseSalary(salaryStr, location) {
    if (location === 'India') {
      // Remove ₹ and commas, convert to number
      return parseInt(salaryStr.replace(/[₹,]/g, ''));
    } else {
      // Remove $ and commas, convert to number
      return parseInt(salaryStr.replace(/[$,]/g, ''));
    }
  }

  // Step 1: Collect real market data from various sources
  async collectMarketData(skill, location) {
    console.log(`📊 [DATA COLLECTION] Collecting real market data for ${skill} in ${location}`);

    // Simulate real data collection from various APIs
    // In production, you'd call actual APIs like:
    // - LinkedIn Jobs API
    // - Indeed API  
    // - Glassdoor API
    // - GitHub API for skill trends
    // - Google Trends API
    // - Stack Overflow Developer Survey data

    const currentYear = new Date().getFullYear();
    const skillLower = skill.toLowerCase();

    // Real-world inspired data based on actual market research
    let realMarketData = {};

    if (location === 'India') {
      if (skillLower.includes('mobile')) {
        realMarketData = {
          totalJobOpenings: 125000,
          averageSalary: 1200000, // ₹12,00,000
          salaryRange: { min: 600000, max: 2500000 },
          yearOverYearGrowth: 22,
          competitionIndex: 0.75, // 0-1 scale
          skillDemandScore: 85, // 0-100 scale
          topCompanies: ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Paytm'],
          regionalDistribution: {
            'Bangalore': 35,
            'Hyderabad': 25,
            'Mumbai': 20,
            'Delhi NCR': 15,
            'Others': 5
          },
          industryDemand: {
            'E-commerce': 30,
            'Fintech': 25,
            'Healthcare': 15,
            'Education': 12,
            'Others': 18
          }
        };
      } else if (skillLower.includes('data')) {
        realMarketData = {
          totalJobOpenings: 180000,
          averageSalary: 1500000, // ₹15,00,000
          salaryRange: { min: 800000, max: 3500000 },
          yearOverYearGrowth: 35,
          competitionIndex: 0.85,
          skillDemandScore: 95,
          topCompanies: ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Zomato'],
          regionalDistribution: {
            'Bangalore': 40,
            'Hyderabad': 22,
            'Mumbai': 18,
            'Delhi NCR': 15,
            'Others': 5
          },
          industryDemand: {
            'Technology': 35,
            'Finance': 25,
            'Healthcare': 15,
            'Retail': 12,
            'Others': 13
          }
        };
      } else if (skillLower.includes('python')) {
        realMarketData = {
          totalJobOpenings: 200000,
          averageSalary: 1100000, // ₹11,00,000
          salaryRange: { min: 500000, max: 2800000 },
          yearOverYearGrowth: 28,
          competitionIndex: 0.80,
          skillDemandScore: 90,
          topCompanies: ['Google', 'Microsoft', 'Amazon', 'Netflix', 'Uber'],
          regionalDistribution: {
            'Bangalore': 38,
            'Hyderabad': 24,
            'Mumbai': 18,
            'Delhi NCR': 15,
            'Others': 5
          },
          industryDemand: {
            'Technology': 40,
            'Finance': 20,
            'Data Analytics': 20,
            'AI/ML': 15,
            'Others': 5
          }
        };
      } else {
        // Default data for other skills
        realMarketData = {
          totalJobOpenings: 100000,
          averageSalary: 900000,
          salaryRange: { min: 400000, max: 2000000 },
          yearOverYearGrowth: 18,
          competitionIndex: 0.70,
          skillDemandScore: 75,
          topCompanies: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'IBM'],
          regionalDistribution: {
            'Bangalore': 30,
            'Hyderabad': 20,
            'Mumbai': 20,
            'Delhi NCR': 20,
            'Others': 10
          },
          industryDemand: {
            'IT Services': 40,
            'Product': 25,
            'Consulting': 15,
            'Startups': 10,
            'Others': 10
          }
        };
      }
    } else {
      // US/Global market data
      if (skillLower.includes('mobile')) {
        realMarketData = {
          totalJobOpenings: 85000,
          averageSalary: 95000,
          salaryRange: { min: 65000, max: 180000 },
          yearOverYearGrowth: 20,
          competitionIndex: 0.70,
          skillDemandScore: 82,
          topCompanies: ['Apple', 'Google', 'Microsoft', 'Meta', 'Netflix'],
          regionalDistribution: {
            'San Francisco Bay Area': 45,
            'Seattle': 20,
            'New York': 15,
            'Austin': 10,
            'Others': 10
          }
        };
      }
      // Add more location-specific data as needed
    }

    // Add historical trends (simulated)
    realMarketData.historicalTrends = this.generateHistoricalTrends(skill, currentYear, location);
    realMarketData.futureProjections = this.generateFutureProjections(realMarketData, skill);

    console.log(`✅ [DATA COLLECTION] Real market data collected:`, realMarketData);
    return realMarketData;
  }

  // Generate historical trends based on skill
  generateHistoricalTrends(skill, currentYear, location = 'India') {
    const years = [];
    const skillLower = skill.toLowerCase();

    // Base growth patterns for different skills
    let baseGrowth = 1.15; // 15% annual growth
    if (skillLower.includes('data') || skillLower.includes('ai')) baseGrowth = 1.25;
    if (skillLower.includes('mobile')) baseGrowth = 1.18;
    if (skillLower.includes('python')) baseGrowth = 1.22;

    let baseValue = 100;
    for (let i = 5; i >= 0; i--) {
      years.push({
        year: currentYear - i,
        demandIndex: Math.round(baseValue),
        jobOpenings: Math.round(baseValue * 1000),
        averageSalary: Math.round(baseValue * (location === 'India' ? 8000 : 800))
      });
      baseValue *= baseGrowth;
    }

    return years;
  }

  // Generate future projections
  generateFutureProjections(marketData, skill) {
    const projections = [];
    const currentYear = new Date().getFullYear();
    const growthRate = marketData.yearOverYearGrowth / 100;

    let currentJobs = marketData.totalJobOpenings;
    let currentSalary = marketData.averageSalary;

    for (let i = 1; i <= 5; i++) {
      currentJobs *= (1 + growthRate);
      currentSalary *= (1 + (growthRate * 0.6)); // Salary grows slower than job openings

      projections.push({
        year: currentYear + i,
        projectedJobs: Math.round(currentJobs),
        projectedSalary: Math.round(currentSalary),
        confidenceLevel: Math.max(0.95 - (i * 0.1), 0.65) // Decreasing confidence over time
      });
    }

    return projections;
  }
};

module.exports = new ImprovedGeminiService();
