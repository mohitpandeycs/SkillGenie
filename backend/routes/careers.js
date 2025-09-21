const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const googleSearchService = require('../services/googleSearchService');

// Mock middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  req.userId = 'mock-user-id';
  next();
};

// @route   GET /api/careers/search
// @desc    Search career opportunities using Google Custom Search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { skill, location = 'India', type = 'jobs' } = req.query;
    
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Skill parameter is required'
      });
    }
    
    console.log(`🔍 Searching ${type} for ${skill} in ${location}`);
    
    // Fetch opportunities using Google Custom Search
    const opportunities = await googleSearchService.fetchCareerOpportunities(skill, location, type);
    
    res.json({
      success: true,
      data: opportunities,
      generatedBy: 'Google Custom Search API'
    });
  } catch (error) {
    console.error('Career search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search opportunities',
      error: error.message
    });
  }
});

// @route   GET /api/careers/jobs
// @desc    Get job opportunities (legacy route with mock data)
// @access  Private
router.get('/jobs', authenticateToken, (req, res) => {
  try {
    const { location, experience, skills, page = 1, limit = 10 } = req.query;

    const jobs = [
      {
        id: 'job_1',
        title: 'Junior Data Scientist',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$85,000 - $110,000',
        experience: '1-2 years',
        skills: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
        description: 'Join our data science team to build predictive models and analyze customer behavior data.',
        requirements: [
          'Bachelor\'s degree in Computer Science, Statistics, or related field',
          '1-2 years of experience in data analysis or machine learning',
          'Proficiency in Python and SQL',
          'Experience with pandas, scikit-learn, and data visualization tools'
        ],
        benefits: ['Health insurance', 'Remote work options', 'Professional development budget'],
        posted: new Date(Date.now() - 172800000), // 2 days ago
        applicants: 45,
        matchScore: 92,
        logo: 'https://via.placeholder.com/40x40/3B82F6/white?text=TC',
        companySize: '500-1000 employees',
        industry: 'Technology'
      },
      {
        id: 'job_2',
        title: 'Data Analyst',
        company: 'StartupXYZ',
        location: 'Remote',
        type: 'Full-time',
        salary: '$70,000 - $90,000',
        experience: '0-1 years',
        skills: ['Python', 'SQL', 'Tableau', 'Statistics'],
        description: 'Analyze business metrics and create dashboards to drive data-driven decisions.',
        requirements: [
          'Bachelor\'s degree in relevant field',
          'Strong analytical and problem-solving skills',
          'Experience with SQL and data visualization tools',
          'Knowledge of statistical analysis'
        ],
        benefits: ['Flexible hours', 'Stock options', 'Learning stipend'],
        posted: new Date(Date.now() - 86400000), // 1 day ago
        applicants: 23,
        matchScore: 88,
        logo: 'https://via.placeholder.com/40x40/8B5CF6/white?text=SX',
        companySize: '50-100 employees',
        industry: 'Fintech'
      }
    ];

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(jobs.length / limit),
          totalJobs: jobs.length,
          limit: parseInt(limit)
        },
        filters: {
          location,
          experience,
          skills
        }
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/careers/freelance
// @desc    Get freelance opportunities
// @access  Private
router.get('/freelance', authenticateToken, (req, res) => {
  try {
    const { budget, duration, skills, page = 1, limit = 10 } = req.query;

    const gigs = [
      {
        id: 'gig_1',
        title: 'Customer Churn Analysis Project',
        client: 'E-commerce Startup',
        budget: '$2,000 - $3,500',
        duration: '2-3 weeks',
        skills: ['Python', 'Machine Learning', 'Data Visualization'],
        description: 'Analyze customer data to identify churn patterns and build predictive model.',
        requirements: [
          'Experience with customer analytics',
          'Proficiency in Python and ML libraries',
          'Ability to create clear visualizations and reports',
          'Previous experience with churn analysis preferred'
        ],
        deliverables: [
          'Exploratory data analysis report',
          'Churn prediction model',
          'Interactive dashboard',
          'Recommendations document'
        ],
        posted: new Date(Date.now() - 86400000),
        proposals: 12,
        matchScore: 90,
        clientRating: 4.8,
        clientReviews: 23,
        urgency: 'Medium'
      },
      {
        id: 'gig_2',
        title: 'Sales Dashboard Development',
        client: 'Marketing Agency',
        budget: '$1,500 - $2,500',
        duration: '1-2 weeks',
        skills: ['Python', 'Tableau', 'SQL'],
        description: 'Create interactive sales dashboard with real-time data updates.',
        requirements: [
          'Experience with dashboard development',
          'Knowledge of Tableau or similar tools',
          'SQL database experience',
          'Understanding of sales metrics'
        ],
        deliverables: [
          'Interactive Tableau dashboard',
          'Data pipeline setup',
          'User documentation',
          'Training session for client team'
        ],
        posted: new Date(Date.now() - 259200000),
        proposals: 8,
        matchScore: 85,
        clientRating: 4.6,
        clientReviews: 15,
        urgency: 'High'
      }
    ];

    res.json({
      success: true,
      data: {
        gigs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(gigs.length / limit),
          totalGigs: gigs.length,
          limit: parseInt(limit)
        },
        filters: {
          budget,
          duration,
          skills
        }
      }
    });
  } catch (error) {
    console.error('Get freelance gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/careers/internships
// @desc    Get internship opportunities
// @access  Private
router.get('/internships', authenticateToken, (req, res) => {
  try {
    const internships = [
      {
        id: 'intern_1',
        title: 'Data Science Intern',
        company: 'Google',
        location: 'Mountain View, CA',
        duration: '3 months',
        stipend: '$7,000/month',
        skills: ['Python', 'Machine Learning', 'Statistics'],
        description: 'Work on real-world ML projects with experienced data scientists.',
        requirements: [
          'Currently pursuing degree in Computer Science, Statistics, or related field',
          'Strong programming skills in Python',
          'Basic understanding of machine learning concepts',
          'Excellent problem-solving abilities'
        ],
        learningOutcomes: [
          'Hands-on experience with production ML systems',
          'Mentorship from senior data scientists',
          'Exposure to large-scale data processing',
          'Networking opportunities within Google'
        ],
        posted: new Date(Date.now() - 604800000), // 1 week ago
        applicants: 234,
        matchScore: 95,
        logo: 'https://via.placeholder.com/40x40/4285F4/white?text=G',
        applicationDeadline: new Date(Date.now() + 1209600000), // 2 weeks from now
        startDate: new Date(Date.now() + 2592000000) // 1 month from now
      },
      {
        id: 'intern_2',
        title: 'Analytics Intern',
        company: 'Netflix',
        location: 'Los Gatos, CA',
        duration: '4 months',
        stipend: '$6,500/month',
        skills: ['Python', 'SQL', 'A/B Testing'],
        description: 'Analyze user behavior and content performance metrics.',
        requirements: [
          'Junior or Senior in college',
          'Experience with data analysis and SQL',
          'Understanding of statistical concepts',
          'Interest in entertainment industry analytics'
        ],
        learningOutcomes: [
          'A/B testing methodology',
          'User behavior analysis',
          'Content recommendation systems',
          'Data storytelling skills'
        ],
        posted: new Date(Date.now() - 432000000), // 5 days ago
        applicants: 189,
        matchScore: 88,
        logo: 'https://via.placeholder.com/40x40/E50914/white?text=N',
        applicationDeadline: new Date(Date.now() + 864000000), // 10 days from now
        startDate: new Date(Date.now() + 2160000000) // 25 days from now
      }
    ];

    res.json({
      success: true,
      data: internships
    });
  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/careers/events
// @desc    Get career events and hackathons
// @access  Private
router.get('/events', authenticateToken, (req, res) => {
  try {
    const events = [
      {
        id: 'event_1',
        title: 'AI/ML Hackathon 2024',
        organizer: 'TechEvents Inc',
        date: new Date('2024-03-15'),
        endDate: new Date('2024-03-17'),
        location: 'San Francisco, CA',
        type: 'Hackathon',
        prize: '$50,000 total prizes',
        description: '48-hour hackathon focused on AI and machine learning solutions.',
        themes: ['Healthcare AI', 'Climate Tech', 'FinTech Innovation', 'EdTech Solutions'],
        requirements: [
          'Teams of 2-4 members',
          'Basic programming knowledge',
          'Passion for AI/ML applications'
        ],
        benefits: [
          'Networking with industry professionals',
          'Mentorship from experts',
          'Potential job opportunities',
          'Prizes and recognition'
        ],
        participants: 500,
        difficulty: 'Intermediate',
        registrationDeadline: new Date('2024-03-10'),
        website: 'https://aimlhackathon2024.com',
        tags: ['AI', 'Machine Learning', 'Innovation', 'Competition']
      },
      {
        id: 'event_2',
        title: 'Data Science Conference 2024',
        organizer: 'DS Community',
        date: new Date('2024-04-05'),
        endDate: new Date('2024-04-05'),
        location: 'Virtual',
        type: 'Conference',
        prize: 'Free attendance',
        description: 'Learn from industry experts about latest trends in data science.',
        speakers: [
          'Dr. Sarah Chen - Google AI',
          'Prof. Michael Rodriguez - Stanford',
          'Lisa Wang - Netflix Data Science'
        ],
        sessions: [
          'Future of Machine Learning',
          'Ethics in AI',
          'Career Panel Discussion',
          'Hands-on Workshop: MLOps'
        ],
        participants: 1200,
        difficulty: 'All levels',
        registrationDeadline: new Date('2024-04-01'),
        website: 'https://dsconf2024.com',
        tags: ['Data Science', 'Learning', 'Networking', 'Career']
      }
    ];

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/careers/apply
// @desc    Apply for a job/internship
// @access  Private
router.post('/apply', [
  authenticateToken,
  body('opportunityId').isString(),
  body('opportunityType').isIn(['job', 'internship', 'freelance']),
  body('coverLetter').optional().trim().isLength({ max: 2000 }),
  body('resume').optional().isString()
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

    const { opportunityId, opportunityType, coverLetter, resume } = req.body;

    const application = {
      id: `app_${Date.now()}`,
      userId: req.userId,
      opportunityId,
      opportunityType,
      coverLetter,
      resume,
      status: 'submitted',
      submittedAt: new Date(),
      trackingNumber: `TRK${Date.now().toString().slice(-8)}`
    };

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/careers/applications
// @desc    Get user's applications
// @access  Private
router.get('/applications', authenticateToken, (req, res) => {
  try {
    const applications = [
      {
        id: 'app_1',
        opportunityId: 'job_1',
        opportunityTitle: 'Junior Data Scientist',
        company: 'TechCorp Inc.',
        type: 'job',
        status: 'under_review',
        submittedAt: new Date(Date.now() - 259200000), // 3 days ago
        lastUpdated: new Date(Date.now() - 86400000), // 1 day ago
        trackingNumber: 'TRK12345678'
      },
      {
        id: 'app_2',
        opportunityId: 'intern_1',
        opportunityTitle: 'Data Science Intern',
        company: 'Google',
        type: 'internship',
        status: 'interview_scheduled',
        submittedAt: new Date(Date.now() - 604800000), // 1 week ago
        lastUpdated: new Date(Date.now() - 172800000), // 2 days ago
        trackingNumber: 'TRK87654321',
        interviewDate: new Date(Date.now() + 432000000) // 5 days from now
      }
    ];

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/careers/recommendations
// @desc    Get AI-powered career recommendations
// @access  Private
router.get('/recommendations', authenticateToken, (req, res) => {
  try {
    const recommendations = {
      jobMatches: [
        {
          id: 'job_1',
          title: 'Junior Data Scientist',
          company: 'TechCorp Inc.',
          matchScore: 92,
          reasons: [
            'Strong match for Python skills',
            'Experience level aligns perfectly',
            'Company culture fits your preferences'
          ]
        }
      ],
      skillGaps: [
        {
          skill: 'TensorFlow',
          importance: 'High',
          description: 'Learning TensorFlow will unlock 15 more ML Engineer positions',
          estimatedLearningTime: '2-3 months',
          resources: [
            'TensorFlow Developer Certificate',
            'Deep Learning Specialization'
          ]
        }
      ],
      trendingOpportunities: [
        {
          domain: 'MLOps',
          growth: '+45%',
          description: 'MLOps roles are growing rapidly as companies scale their ML operations',
          averageSalary: '$130,000',
          topSkills: ['Docker', 'Kubernetes', 'MLflow', 'AWS']
        }
      ],
      careerPath: {
        current: 'Data Analyst',
        next: 'Junior Data Scientist',
        timeline: '6-12 months',
        requiredSkills: ['Machine Learning', 'Statistical Modeling', 'Python'],
        salaryIncrease: '$15,000 - $25,000'
      }
    };

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
