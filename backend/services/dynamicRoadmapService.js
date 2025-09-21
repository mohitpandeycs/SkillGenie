const { GoogleGenerativeAI } = require('@google/generative-ai');
const youtubeService = require('./youtubeService');

class DynamicRoadmapService {
  constructor() {
    require('dotenv').config();
    this.apiKey = process.env.GEMINI_API_KEY;
    this.googleSearchApiKey = process.env.GOOGLE_SEARCH_API_KEY;
    
    console.log('🔑 Initializing Dynamic Roadmap Service...');
    console.log('Gemini API Key:', this.apiKey ? 'Available ✅' : 'Missing ❌');
    console.log('Google Search API Key:', this.googleSearchApiKey ? 'Available ✅' : 'Missing ❌');
    
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 4096,
        }
      });
      console.log('✅ Gemini AI model initialized successfully');
    } else {
      console.warn('⚠️ Gemini API key not found - will use enhanced fallback');
    }
  }

  async generateRoadmap(skill, level = 'beginner', duration = '3-6 months') {
    try {
      console.log(`🚀 Generating UNIQUE roadmap for ${skill} at ${level} level`);
      console.log('API Key available:', !!this.apiKey);

      const prompt = `
You are an expert career advisor. Generate a UNIQUE and SPECIFIC learning roadmap for "${skill}" at ${level} level.
This must be specifically tailored to ${skill} - not a generic template.
Duration: ${duration}

IMPORTANT: Create content that is SPECIFIC to ${skill}. For example:
- If ${skill} is "Mobile Development", include iOS/Android specific content
- If ${skill} is "Python", include Python-specific libraries and frameworks
- If ${skill} is "Data Science", include data science tools and techniques

Return ONLY valid JSON (no markdown, no extra text) in this exact format:
{
  "title": "${skill} Complete Learning Path",
  "description": "Master ${skill} from ${level} to professional level",
  "totalDuration": "${duration}",
  "difficulty": "${level}",
  "chapters": [
    {
      "id": 1,
      "title": "Introduction to ${skill}",
      "description": "Foundation concepts specific to ${skill}",
      "duration": "2 weeks",
      "difficulty": "Beginner",
      "topics": ["3-5 specific ${skill} topics"],
      "learningObjectives": ["2-3 specific objectives"],
      "practicalProjects": ["2 hands-on ${skill} projects"],
      "assessmentType": "quiz"
    }
  ],
  "prerequisites": ["2-3 prerequisites for ${skill}"],
  "careerOutcomes": ["3-4 career paths in ${skill}"],
  "estimatedSalaryRange": "$60,000 - $120,000"
}

Generate 6-8 chapters that are UNIQUE to ${skill}. Include real tools, frameworks, and concepts used in ${skill}.`;

      if (this.model && this.apiKey) {
        console.log('Using Gemini AI to generate content...');
        
        try {
          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          console.log('Gemini response received, length:', text.length);
          
          // Parse JSON from response
          let roadmapData;
          try {
            // Clean the response - remove markdown code blocks if present
            let jsonStr = text.trim();
            if (jsonStr.startsWith('```json')) {
              jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '');
            } else if (jsonStr.startsWith('```')) {
              jsonStr = jsonStr.replace(/```\n?/, '').replace(/\n?```$/, '');
            }
            
            roadmapData = JSON.parse(jsonStr);
            console.log('Successfully parsed Gemini response for', skill);
            
            // Ensure the roadmap is specific to the requested skill
            roadmapData.title = roadmapData.title || `${skill} Learning Path`;
            roadmapData.skill = skill;
            roadmapData.level = level;
            
          } catch (parseError) {
            console.error('Parse error:', parseError.message);
            console.log('Raw response:', text.substring(0, 500));
            // Try to extract JSON from the text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              roadmapData = JSON.parse(jsonMatch[0]);
            } else {
              throw parseError;
            }
          }

          // Add YouTube videos for each chapter
          await this.addYouTubeResources(roadmapData);

          return {
            success: true,
            data: roadmapData,
            generatedBy: 'Gemini AI',
            generatedAt: new Date().toISOString()
          };
        } catch (geminiError) {
          console.error('Gemini API error:', geminiError.message);
          console.log('Falling back to dynamic template for', skill);
          return this.generateDynamicFallback(skill, level, duration);
        }
      } else {
        console.log('No Gemini API available, using dynamic fallback for', skill);
        return this.generateDynamicFallback(skill, level, duration);
      }
    } catch (error) {
      console.error('Error generating roadmap:', error.message);
      return this.generateDynamicFallback(skill, level, duration);
    }
  }

  generateDynamicFallback(skill, level, duration) {
    console.log(`Generating dynamic fallback for ${skill}`);
    
    // Create skill-specific chapters based on the skill name
    const skillLower = skill.toLowerCase();
    let chapters = [];
    
    if (skillLower.includes('mobile') || skillLower.includes('ios') || skillLower.includes('android')) {
      chapters = [
        {
          id: 1,
          title: "Mobile Development Fundamentals",
          description: "Learn the basics of mobile app development",
          duration: "2 weeks",
          difficulty: "Beginner",
          topics: ["Native vs Cross-platform", "Mobile UI/UX", "App Architecture"],
          learningObjectives: ["Understand mobile ecosystems", "Choose development approach"],
          practicalProjects: ["Simple Calculator App", "To-Do List App"],
          assessmentType: "project"
        },
        {
          id: 2,
          title: "iOS Development with Swift",
          description: "Master iOS app development",
          duration: "4 weeks",
          difficulty: "Intermediate",
          topics: ["Swift Programming", "UIKit", "SwiftUI", "Xcode"],
          learningObjectives: ["Build iOS apps", "Use Apple frameworks"],
          practicalProjects: ["Weather App", "Social Media Clone"],
          assessmentType: "project"
        },
        {
          id: 3,
          title: "Android Development with Kotlin",
          description: "Master Android app development",
          duration: "4 weeks",
          difficulty: "Intermediate",
          topics: ["Kotlin", "Android Studio", "Jetpack Compose", "Material Design"],
          learningObjectives: ["Build Android apps", "Use Google services"],
          practicalProjects: ["News Reader App", "E-commerce App"],
          assessmentType: "project"
        },
        {
          id: 4,
          title: "Cross-Platform with React Native",
          description: "Build apps for both iOS and Android",
          duration: "3 weeks",
          difficulty: "Intermediate",
          topics: ["React Native", "Expo", "Navigation", "State Management"],
          learningObjectives: ["Write once, deploy everywhere", "Optimize performance"],
          practicalProjects: ["Fitness Tracker", "Recipe App"],
          assessmentType: "project"
        },
        {
          id: 5,
          title: "Backend & APIs",
          description: "Connect mobile apps to backend services",
          duration: "2 weeks",
          difficulty: "Intermediate",
          topics: ["REST APIs", "Firebase", "Authentication", "Push Notifications"],
          learningObjectives: ["Integrate APIs", "Handle data synchronization"],
          practicalProjects: ["Chat Application", "Cloud Storage App"],
          assessmentType: "both"
        },
        {
          id: 6,
          title: "App Deployment & Monetization",
          description: "Publish and monetize your apps",
          duration: "1 week",
          difficulty: "Advanced",
          topics: ["App Store", "Google Play", "Monetization", "Analytics"],
          learningObjectives: ["Deploy to stores", "Implement monetization"],
          practicalProjects: ["Publish Your App", "Add Ads/In-App Purchases"],
          assessmentType: "project"
        }
      ];
    } else if (skillLower.includes('python')) {
      chapters = [
        {
          id: 1,
          title: "Python Fundamentals",
          description: "Master Python basics and syntax",
          duration: "2 weeks",
          difficulty: "Beginner",
          topics: ["Variables & Data Types", "Control Flow", "Functions", "OOP"],
          learningObjectives: ["Write Python programs", "Understand Python syntax"],
          practicalProjects: ["Calculator", "Text-based Game"],
          assessmentType: "quiz"
        },
        {
          id: 2,
          title: "Data Structures & Algorithms",
          description: "Essential CS concepts in Python",
          duration: "3 weeks",
          difficulty: "Intermediate",
          topics: ["Lists, Tuples, Sets", "Dictionaries", "Sorting", "Searching"],
          learningObjectives: ["Implement algorithms", "Optimize code"],
          practicalProjects: ["Algorithm Visualizer", "Data Structure Library"],
          assessmentType: "both"
        },
        {
          id: 3,
          title: "Web Development with Django/Flask",
          description: "Build web applications with Python",
          duration: "4 weeks",
          difficulty: "Intermediate",
          topics: ["Django", "Flask", "REST APIs", "Databases"],
          learningObjectives: ["Create web apps", "Build APIs"],
          practicalProjects: ["Blog Platform", "E-commerce Site"],
          assessmentType: "project"
        },
        {
          id: 4,
          title: "Data Science Libraries",
          description: "NumPy, Pandas, and data analysis",
          duration: "3 weeks",
          difficulty: "Intermediate",
          topics: ["NumPy", "Pandas", "Matplotlib", "Seaborn"],
          learningObjectives: ["Analyze data", "Create visualizations"],
          practicalProjects: ["Data Analysis Project", "Dashboard Creation"],
          assessmentType: "project"
        },
        {
          id: 5,
          title: "Machine Learning with Python",
          description: "Introduction to ML with scikit-learn",
          duration: "4 weeks",
          difficulty: "Advanced",
          topics: ["Scikit-learn", "TensorFlow", "Classification", "Regression"],
          learningObjectives: ["Build ML models", "Evaluate performance"],
          practicalProjects: ["Predictive Model", "Image Classifier"],
          assessmentType: "project"
        },
        {
          id: 6,
          title: "Advanced Python & Best Practices",
          description: "Professional Python development",
          duration: "2 weeks",
          difficulty: "Advanced",
          topics: ["Testing", "Debugging", "Performance", "Design Patterns"],
          learningObjectives: ["Write production code", "Follow best practices"],
          practicalProjects: ["Open Source Contribution", "Complete Application"],
          assessmentType: "both"
        }
      ];
    } else {
      // Generic programming roadmap customized with skill name
      chapters = [
        {
          id: 1,
          title: `${skill} Fundamentals`,
          description: `Learn the basics of ${skill}`,
          duration: "2 weeks",
          difficulty: "Beginner",
          topics: [`${skill} Syntax`, "Core Concepts", "Development Environment"],
          learningObjectives: [`Master ${skill} basics`, "Set up environment"],
          practicalProjects: ["Hello World Project", "Simple Application"],
          assessmentType: "quiz"
        },
        {
          id: 2,
          title: `Intermediate ${skill}`,
          description: `Advanced concepts in ${skill}`,
          duration: "3 weeks",
          difficulty: "Intermediate",
          topics: ["Advanced Features", "Best Practices", "Common Patterns"],
          learningObjectives: ["Apply advanced concepts", "Write efficient code"],
          practicalProjects: ["Medium Complexity Project", "API Integration"],
          assessmentType: "project"
        },
        {
          id: 3,
          title: `${skill} Project Development`,
          description: `Build real-world ${skill} projects`,
          duration: "4 weeks",
          difficulty: "Intermediate",
          topics: ["Project Structure", "Architecture", "Testing"],
          learningObjectives: ["Build complete applications", "Follow industry standards"],
          practicalProjects: ["Full Application", "Portfolio Project"],
          assessmentType: "project"
        },
        {
          id: 4,
          title: `Advanced ${skill} Techniques`,
          description: `Master advanced ${skill} concepts`,
          duration: "3 weeks",
          difficulty: "Advanced",
          topics: ["Performance Optimization", "Security", "Scalability"],
          learningObjectives: ["Optimize applications", "Implement security"],
          practicalProjects: ["Performance Optimization", "Secure Application"],
          assessmentType: "both"
        },
        {
          id: 5,
          title: `${skill} Ecosystem & Tools`,
          description: `Master ${skill} tools and libraries`,
          duration: "2 weeks",
          difficulty: "Intermediate",
          topics: ["Popular Libraries", "Development Tools", "Deployment"],
          learningObjectives: ["Use professional tools", "Deploy applications"],
          practicalProjects: ["Tool Integration", "Deployment Pipeline"],
          assessmentType: "project"
        },
        {
          id: 6,
          title: `${skill} Career Preparation`,
          description: `Get job-ready with ${skill}`,
          duration: "2 weeks",
          difficulty: "Advanced",
          topics: ["Interview Prep", "Portfolio Building", "Industry Trends"],
          learningObjectives: ["Ace interviews", "Build portfolio"],
          practicalProjects: ["Portfolio Website", "Capstone Project"],
          assessmentType: "project"
        }
      ];
    }
    
    const roadmap = {
      title: `${skill} Complete Learning Path`,
      description: `Master ${skill} from ${level} to professional level`,
      totalDuration: duration,
      difficulty: level,
      chapters: chapters,
      prerequisites: level === 'beginner' ? 
        ["Basic computer skills", "Problem-solving mindset"] :
        [`Basic ${skill} knowledge`, "Programming fundamentals"],
      careerOutcomes: [
        `${skill} Developer`,
        `${skill} Engineer`,
        `Senior ${skill} Developer`,
        "Technical Lead"
      ],
      estimatedSalaryRange: "$70,000 - $150,000",
      skill: skill,
      level: level
    };

    return {
      success: true,
      data: roadmap,
      generatedBy: 'Dynamic Template',
      generatedAt: new Date().toISOString()
    };
  }

  async addYouTubeResources(roadmap) {
    try {
      // Add YouTube videos for each chapter
      for (const chapter of roadmap.chapters) {
        const searchQuery = `${chapter.title} ${roadmap.title} tutorial`;
        const videoResult = await youtubeService.searchVideos(searchQuery, { 
          maxResults: 3,
          safeSearch: 'strict'
        });
        
        if (videoResult.success && videoResult.data.videos) {
          chapter.youtubeVideos = videoResult.data.videos;
        } else {
          chapter.youtubeVideos = [];
        }
      }
    } catch (error) {
      console.error('Error adding YouTube resources:', error);
    }
  }

  getFallbackRoadmap(skill, level) {
    return {
      success: true,
      data: {
        title: `${skill} Learning Path`,
        description: `Master ${skill} from ${level} to advanced level`,
        totalDuration: "3-6 months",
        difficulty: level,
        chapters: [
          {
            id: 1,
            title: `${skill} Fundamentals`,
            description: `Learn the basics of ${skill}`,
            duration: "2 weeks",
            difficulty: "Beginner",
            topics: ["Introduction", "Core Concepts", "Basic Syntax"],
            learningObjectives: ["Understand basics", "Write simple programs"],
            practicalProjects: ["Hello World", "Simple Calculator"],
            assessmentType: "quiz"
          },
          {
            id: 2,
            title: `Intermediate ${skill}`,
            description: `Build on your foundation`,
            duration: "3 weeks",
            difficulty: "Intermediate",
            topics: ["Advanced Features", "Best Practices", "Design Patterns"],
            learningObjectives: ["Apply advanced concepts", "Build real projects"],
            practicalProjects: ["Todo App", "API Integration"],
            assessmentType: "project"
          },
          {
            id: 3,
            title: `Advanced ${skill}`,
            description: `Master complex concepts`,
            duration: "4 weeks",
            difficulty: "Advanced",
            topics: ["Architecture", "Performance", "Security"],
            learningObjectives: ["Design systems", "Optimize performance"],
            practicalProjects: ["Full-stack Application", "Open Source Contribution"],
            assessmentType: "both"
          },
          {
            id: 4,
            title: "Real-World Projects",
            description: "Apply your skills to real projects",
            duration: "3 weeks",
            difficulty: "Advanced",
            topics: ["Project Planning", "Development", "Deployment"],
            learningObjectives: ["Build portfolio", "Deploy applications"],
            practicalProjects: ["Portfolio Website", "SaaS Application"],
            assessmentType: "project"
          },
          {
            id: 5,
            title: "Industry Best Practices",
            description: "Learn professional workflows",
            duration: "2 weeks",
            difficulty: "Intermediate",
            topics: ["Version Control", "Testing", "Documentation"],
            learningObjectives: ["Work in teams", "Maintain code quality"],
            practicalProjects: ["Collaborative Project", "Open Source PR"],
            assessmentType: "both"
          },
          {
            id: 6,
            title: "Career Preparation",
            description: "Get job-ready",
            duration: "2 weeks",
            difficulty: "Intermediate",
            topics: ["Portfolio Building", "Interview Prep", "Networking"],
            learningObjectives: ["Create portfolio", "Ace interviews"],
            practicalProjects: ["Portfolio Website", "Technical Blog"],
            assessmentType: "project"
          }
        ],
        prerequisites: ["Basic computer skills", "Problem-solving mindset"],
        careerOutcomes: [`${skill} Developer`, "Software Engineer", "Technical Lead"],
        estimatedSalaryRange: "$60,000 - $120,000"
      },
      generatedAt: new Date().toISOString()
    };
  }

  async generateAnalytics(skill, location = 'Global') {
    try {
      console.log(`📊 Generating UNIQUE analytics for ${skill} in ${location}`);
      console.log('API Key available:', !!this.apiKey);

      const prompt = `
Generate job market analytics for "${skill}" in ${location}.

Provide a structured JSON response with:
{
  "skill": "${skill}",
  "location": "${location}",
  "marketOverview": {
    "demandLevel": "High/Medium/Low",
    "growthRate": "XX%",
    "averageSalary": "$XX,000",
    "salaryRange": {
      "entry": "$XX,000",
      "mid": "$XX,000",
      "senior": "$XX,000"
    },
    "jobOpenings": "XX,000+",
    "competitionLevel": "High/Medium/Low"
  },
  "topCompanies": [
    {"name": "Company", "openings": 100, "averageSalary": "$XX,000"}
  ],
  "requiredSkills": [
    {"skill": "Skill name", "demand": 95}
  ],
  "industryTrends": [
    {"trend": "Trend name", "impact": "High/Medium/Low", "description": "Brief description"}
  ],
  "careerPaths": [
    {"role": "Job Title", "experience": "X-Y years", "salary": "$XX,000"}
  ],
  "certifications": [
    {"name": "Certification", "provider": "Provider", "value": "High/Medium/Low"}
  ],
  "futureOutlook": {
    "projection": "Growing/Stable/Declining",
    "automationRisk": "Low/Medium/High",
    "emergingAreas": ["Area 1", "Area 2"]
  },
  "graphData": {
    "salaryProgression": [
      {"year": 0, "salary": 50000},
      {"year": 2, "salary": 65000},
      {"year": 5, "salary": 85000},
      {"year": 10, "salary": 120000}
    ],
    "demandTrend": [
      {"month": "Jan", "demand": 100},
      {"month": "Feb", "demand": 105},
      {"month": "Mar", "demand": 110}
    ],
    "skillDistribution": [
      {"skill": "Core", "percentage": 40},
      {"skill": "Advanced", "percentage": 30},
      {"skill": "Specialized", "percentage": 30}
    ]
  }
}

Provide realistic data based on current market trends for ${skill}.`;

      if (this.model) {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Parse JSON from response
        let analyticsData;
        try {
          const jsonMatch = text.match(/```json\n?(.*?)\n?```/s) || text.match(/\{.*\}/s);
          const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
          analyticsData = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error('Failed to parse analytics response:', parseError);
          return this.getFallbackAnalytics(skill, location);
        }

        return {
          success: true,
          data: analyticsData,
          generatedAt: new Date().toISOString()
        };
      } else {
        return this.getFallbackAnalytics(skill, location);
      }
    } catch (error) {
      console.error('Error generating analytics:', error);
      return this.getFallbackAnalytics(skill, location);
    }
  }

  getFallbackAnalytics(skill, location) {
    return {
      success: true,
      data: {
        skill: skill,
        location: location,
        marketOverview: {
          demandLevel: "High",
          growthRate: "15%",
          averageSalary: "$85,000",
          salaryRange: {
            entry: "$60,000",
            mid: "$85,000",
            senior: "$120,000"
          },
          jobOpenings: "25,000+",
          competitionLevel: "Medium"
        },
        topCompanies: [
          { name: "Google", openings: 150, averageSalary: "$140,000" },
          { name: "Microsoft", openings: 120, averageSalary: "$135,000" },
          { name: "Amazon", openings: 200, averageSalary: "$130,000" },
          { name: "Meta", openings: 100, averageSalary: "$145,000" },
          { name: "Apple", openings: 80, averageSalary: "$140,000" }
        ],
        requiredSkills: [
          { skill: skill, demand: 100 },
          { skill: "Problem Solving", demand: 95 },
          { skill: "Communication", demand: 85 },
          { skill: "Teamwork", demand: 80 },
          { skill: "Version Control", demand: 75 }
        ],
        industryTrends: [
          { 
            trend: "AI Integration", 
            impact: "High", 
            description: "Growing integration of AI in development workflows" 
          },
          { 
            trend: "Remote Work", 
            impact: "High", 
            description: "Increased opportunities for remote positions" 
          },
          { 
            trend: "Cloud Computing", 
            impact: "High", 
            description: "Shift towards cloud-based solutions" 
          }
        ],
        careerPaths: [
          { role: "Junior Developer", experience: "0-2 years", salary: "$60,000" },
          { role: "Mid-level Developer", experience: "2-5 years", salary: "$85,000" },
          { role: "Senior Developer", experience: "5-8 years", salary: "$110,000" },
          { role: "Tech Lead", experience: "8-10 years", salary: "$130,000" },
          { role: "Engineering Manager", experience: "10+ years", salary: "$150,000" }
        ],
        certifications: [
          { name: "AWS Certified", provider: "Amazon", value: "High" },
          { name: "Google Cloud Certified", provider: "Google", value: "High" },
          { name: "Microsoft Azure", provider: "Microsoft", value: "High" }
        ],
        futureOutlook: {
          projection: "Growing",
          automationRisk: "Low",
          emergingAreas: ["Machine Learning", "Cloud Architecture", "DevOps"]
        },
        graphData: {
          salaryProgression: [
            { year: 0, salary: 60000 },
            { year: 2, salary: 75000 },
            { year: 5, salary: 95000 },
            { year: 7, salary: 110000 },
            { year: 10, salary: 130000 }
          ],
          demandTrend: [
            { month: "Jan", demand: 100 },
            { month: "Feb", demand: 105 },
            { month: "Mar", demand: 108 },
            { month: "Apr", demand: 112 },
            { month: "May", demand: 115 },
            { month: "Jun", demand: 118 }
          ],
          skillDistribution: [
            { skill: "Core Skills", percentage: 40 },
            { skill: "Framework Knowledge", percentage: 30 },
            { skill: "Soft Skills", percentage: 20 },
            { skill: "Specialized Skills", percentage: 10 }
          ]
        }
      },
      generatedAt: new Date().toISOString()
    };
  }
}

module.exports = new DynamicRoadmapService();
