import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Lock, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink,
  Star,
  Award,
  Target,
  Calendar,
  Users,
  Zap,
  ChevronRight,
  ChevronDown,
  Settings,
  Loader
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import youtubeService from '../services/youtubeService';
import roadmapService from '../services/roadmapService';
import questionnaireService from '../services/questionnaireService';

const Roadmap = () => {
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(0);
  const [youtubeVideos, setYoutubeVideos] = useState({});
  const [loadingVideos, setLoadingVideos] = useState({});
  const [dynamicRoadmap, setDynamicRoadmap] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(() => {
    return questionnaireService.getPrimarySkillRecommendation();
  });

  // Default roadmap data (fallback)
  const defaultRoadmapData = {
    title: "Data Science & Machine Learning",
    totalDuration: "8-10 months",
    difficulty: "Intermediate",
    progress: 35,
    completedChapters: 2,
    totalChapters: 8,
    estimatedHours: 240,
    completedHours: 84
  };

  const roadmapData = dynamicRoadmap || defaultRoadmapData;

  // Auto-generate roadmap based on questionnaire data
  useEffect(() => {
    const generateRoadmap = async () => {
      console.log('🗺️ [ROADMAP PAGE] Auto-generating roadmap...');
      
      // Check for questionnaire data
      const qData = questionnaireService.getQuestionnaireData();
      setQuestionnaireData(qData);
      
      if (!qData) {
        console.log('⚠️ [ROADMAP PAGE] No questionnaire data found');
        setLoadingRoadmap(false);
        return;
      }
      
      const primarySkill = questionnaireService.getPrimarySkillRecommendation();
      const experienceLevel = questionnaireService.getExperienceLevel();
      
      console.log(`🎯 [ROADMAP PAGE] Generating roadmap for: "${primarySkill}" at "${experienceLevel}" level`);
      
      try {
        const result = await roadmapService.generateDynamicRoadmap(primarySkill, experienceLevel, '3-6 months');
        console.log('🗺️ [ROADMAP PAGE] Roadmap result:', result);
        
        if (result.success && result.data) {
          console.log(`✅ [ROADMAP PAGE] Roadmap generated: "${result.data.title}"`);
          console.log('🔍 [ROADMAP PAGE] Roadmap data structure:', result.data);
          
          // Ensure the roadmap has the required structure
          const processedRoadmap = {
            ...result.data,
            progress: result.data.progress || 0,
            completedChapters: result.data.completedChapters || 0,
            totalChapters: result.data.chapters?.length || 0,
            estimatedHours: result.data.estimatedHours || 240,
            completedHours: result.data.completedHours || 0,
            chapters: result.data.chapters || []
          };
          
          setDynamicRoadmap(processedRoadmap);
          setSelectedSkill(primarySkill);
        } else {
          console.error('❌ [ROADMAP PAGE] Failed to generate roadmap');
        }
      } catch (error) {
        console.error('❌ [ROADMAP PAGE] Error generating roadmap:', error);
      } finally {
        setLoadingRoadmap(false);
      }
    };
    
    generateRoadmap();
  }, []);

  // Use dynamic roadmap chapters if available, otherwise fallback to static
  const chapters = (dynamicRoadmap?.chapters && Array.isArray(dynamicRoadmap.chapters)) ? 
    dynamicRoadmap.chapters.map((chapter, index) => ({
      ...chapter,
      id: chapter.id || index + 1,
      status: index < 2 ? "completed" : index === 2 ? "current" : "locked",
      progress: index < 2 ? 100 : index === 2 ? 60 : 0,
      estimatedHours: chapter.estimatedHours || 20,
      completedHours: index < 2 ? (chapter.estimatedHours || 20) : index === 2 ? 12 : 0,
      subChapters: chapter.subChapters || [],
      resources: chapter.resources || []
    })) : [
    {
      id: 1,
      title: "Python Fundamentals",
      description: "Master Python programming basics and syntax",
      status: "completed",
      duration: "3 weeks",
      estimatedHours: 25,
      completedHours: 25,
      progress: 100,
      difficulty: "Beginner",
      subChapters: [
        { title: "Python Syntax & Variables", completed: true, duration: "2 days" },
        { title: "Data Types & Structures", completed: true, duration: "3 days" },
        { title: "Control Flow & Functions", completed: true, duration: "4 days" },
        { title: "Object-Oriented Programming", completed: true, duration: "5 days" },
        { title: "File Handling & Modules", completed: true, duration: "3 days" }
      ],
      resources: [
        { type: "video", title: "Python Crash Course", platform: "YouTube", duration: "4h 30m" },
        { type: "article", title: "Python Best Practices", platform: "Medium", readTime: "15 min" },
        { type: "practice", title: "Python Exercises", platform: "HackerRank", problems: 50 }
      ]
    },
    {
      id: 2,
      title: "Data Analysis with Pandas",
      description: "Learn data manipulation and analysis using Pandas",
      status: "completed",
      duration: "2 weeks",
      estimatedHours: 20,
      completedHours: 20,
      progress: 100,
      difficulty: "Beginner",
      subChapters: [
        { title: "Pandas Basics & DataFrames", completed: true, duration: "3 days" },
        { title: "Data Cleaning & Preprocessing", completed: true, duration: "4 days" },
        { title: "Data Aggregation & Grouping", completed: true, duration: "3 days" },
        { title: "Merging & Joining Data", completed: true, duration: "4 days" }
      ],
      resources: [
        { type: "video", title: "Pandas Tutorial Series", platform: "YouTube", duration: "6h 15m" },
        { type: "article", title: "Data Cleaning Guide", platform: "Towards Data Science", readTime: "20 min" },
        { type: "dataset", title: "Practice Datasets", platform: "Kaggle", count: 10 }
      ]
    },
    {
      id: 3,
      title: "Statistics & Probability",
      description: "Essential statistical concepts for data science",
      status: "in_progress",
      duration: "4 weeks",
      estimatedHours: 35,
      completedHours: 15,
      progress: 43,
      difficulty: "Medium",
      subChapters: [
        { title: "Descriptive Statistics", completed: true, duration: "5 days" },
        { title: "Probability Distributions", completed: true, duration: "6 days" },
        { title: "Hypothesis Testing", completed: false, duration: "7 days", current: true },
        { title: "Correlation & Regression", completed: false, duration: "6 days" }
      ],
      resources: [
        { type: "video", title: "Statistics for Data Science", platform: "Coursera", duration: "8h 45m" },
        { type: "book", title: "Think Stats", author: "Allen B. Downey", pages: 226 },
        { type: "practice", title: "Statistical Analysis Projects", platform: "DataCamp", projects: 5 }
      ]
    },
    {
      id: 4,
      title: "Data Visualization",
      description: "Create compelling visualizations with Matplotlib & Seaborn",
      status: "locked",
      duration: "2 weeks",
      estimatedHours: 18,
      completedHours: 0,
      progress: 0,
      difficulty: "Easy",
      subChapters: [
        { title: "Matplotlib Basics", completed: false, duration: "3 days" },
        { title: "Advanced Plotting Techniques", completed: false, duration: "4 days" },
        { title: "Seaborn for Statistical Plots", completed: false, duration: "4 days" },
        { title: "Interactive Visualizations", completed: false, duration: "3 days" }
      ],
      resources: [
        { type: "video", title: "Data Visualization Masterclass", platform: "YouTube", duration: "5h 20m" },
        { type: "article", title: "Visualization Best Practices", platform: "Medium", readTime: "12 min" },
        { type: "gallery", title: "Visualization Gallery", platform: "Python Graph Gallery", examples: 100 }
      ]
    },
    {
      id: 5,
      title: "Machine Learning Basics",
      description: "Introduction to ML algorithms and concepts",
      status: "locked",
      duration: "6 weeks",
      estimatedHours: 50,
      completedHours: 0,
      progress: 0,
      difficulty: "Hard",
      subChapters: [
        { title: "ML Fundamentals & Types", completed: false, duration: "5 days" },
        { title: "Supervised Learning Algorithms", completed: false, duration: "10 days" },
        { title: "Unsupervised Learning", completed: false, duration: "8 days" },
        { title: "Model Evaluation & Validation", completed: false, duration: "7 days" },
        { title: "Feature Engineering", completed: false, duration: "8 days" }
      ],
      resources: [
        { type: "course", title: "Machine Learning Course", platform: "Coursera", duration: "11 weeks" },
        { type: "book", title: "Hands-On Machine Learning", author: "Aurélien Géron", pages: 851 },
        { type: "practice", title: "ML Projects", platform: "Kaggle", competitions: 3 }
      ]
    },
    {
      id: 6,
      title: "Deep Learning Fundamentals",
      description: "Neural networks and deep learning concepts",
      status: "locked",
      duration: "8 weeks",
      estimatedHours: 65,
      completedHours: 0,
      progress: 0,
      difficulty: "Hard",
      subChapters: [
        { title: "Neural Network Basics", completed: false, duration: "7 days" },
        { title: "Deep Neural Networks", completed: false, duration: "10 days" },
        { title: "Convolutional Neural Networks", completed: false, duration: "12 days" },
        { title: "Recurrent Neural Networks", completed: false, duration: "10 days" },
        { title: "Advanced Architectures", completed: false, duration: "8 days" }
      ],
      resources: [
        { type: "course", title: "Deep Learning Specialization", platform: "Coursera", duration: "16 weeks" },
        { type: "book", title: "Deep Learning", author: "Ian Goodfellow", pages: 775 },
        { type: "framework", title: "TensorFlow & PyTorch", platform: "Official Docs", tutorials: 50 }
      ]
    },
    {
      id: 7,
      title: "MLOps & Deployment",
      description: "Deploy and manage ML models in production",
      status: "locked",
      duration: "4 weeks",
      estimatedHours: 32,
      completedHours: 0,
      progress: 0,
      difficulty: "Medium",
      subChapters: [
        { title: "Model Versioning & Tracking", completed: false, duration: "5 days" },
        { title: "Containerization with Docker", completed: false, duration: "6 days" },
        { title: "Cloud Deployment", completed: false, duration: "8 days" },
        { title: "Monitoring & Maintenance", completed: false, duration: "5 days" }
      ],
      resources: [
        { type: "course", title: "MLOps Fundamentals", platform: "Udacity", duration: "4 weeks" },
        { type: "article", title: "MLOps Best Practices", platform: "Towards Data Science", readTime: "25 min" },
        { type: "tool", title: "MLflow & Kubeflow", platform: "Documentation", guides: 20 }
      ]
    },
    {
      id: 8,
      title: "Capstone Project",
      description: "End-to-end data science project portfolio",
      status: "locked",
      duration: "3 weeks",
      estimatedHours: 40,
      completedHours: 0,
      progress: 0,
      difficulty: "Hard",
      subChapters: [
        { title: "Project Planning & Data Collection", completed: false, duration: "3 days" },
        { title: "Data Analysis & Modeling", completed: false, duration: "10 days" },
        { title: "Model Deployment", completed: false, duration: "5 days" },
        { title: "Documentation & Presentation", completed: false, duration: "3 days" }
      ],
      resources: [
        { type: "project", title: "Capstone Project Ideas", platform: "GitHub", repositories: 25 },
        { type: "template", title: "Project Templates", platform: "Cookiecutter", templates: 10 },
        { type: "showcase", title: "Portfolio Examples", platform: "GitHub Pages", examples: 50 }
      ]
    }
  ];

  // Save roadmap data to localStorage for quiz access
  useEffect(() => {
    if (dynamicRoadmap || roadmapData) {
      const dataToSave = {
        id: dynamicRoadmap?.id || roadmapData?.id || 'default',
        skill: dynamicRoadmap?.skill || roadmapData?.skill || 'JavaScript',
        currentChapter: expandedChapter + 1,
        chapters: chapters.map(chapter => ({
          ...chapter,
          // Ensure all chapter data is preserved
          topics: chapter.topics || [],
          subChapters: chapter.subChapters || [],
          resources: chapter.resources || []
        }))
      };
      localStorage.setItem('currentRoadmap', JSON.stringify(dataToSave));
    }
  }, [dynamicRoadmap, roadmapData, chapters, expandedChapter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in_progress':
        return <Play className="w-6 h-6 text-blue-500" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-400" />;
      default:
        return <Lock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
      case 'Easy':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Fetch YouTube videos for a chapter
  const fetchChapterVideos = async (chapterId, chapterTitle) => {
    if (youtubeVideos[chapterId] || loadingVideos[chapterId]) {
      return; // Already loaded or loading
    }

    setLoadingVideos(prev => ({ ...prev, [chapterId]: true }));

    try {
      // Extract skill level from chapter title and description
      const skillLevel = chapterId <= 2 ? 'beginner' : chapterId <= 5 ? 'intermediate' : 'advanced';
      
      // Get skill recommendations for the chapter topic
      const result = await youtubeService.getSkillRecommendations(chapterTitle, skillLevel, {
        safeSearch: 'strict',
        regionCode: 'US'
      });

      if (result.success && result.data.recommendations) {
        setYoutubeVideos(prev => ({
          ...prev,
          [chapterId]: result.data.recommendations.slice(0, 3) // Limit to 3 videos per chapter
        }));
      } else {
        // Fallback to search if skill recommendations fail
        const searchResult = await youtubeService.searchVideos(`${chapterTitle} tutorial`, {
          maxResults: 3,
          safeSearch: 'strict',
          order: 'relevance'
        });

        if (searchResult.success && searchResult.data.videos) {
          setYoutubeVideos(prev => ({
            ...prev,
            [chapterId]: searchResult.data.videos
          }));
        }
      }
    } catch (error) {
      console.error(`Error fetching videos for chapter ${chapterId}:`, error);
      // Set empty array to prevent retrying
      setYoutubeVideos(prev => ({ ...prev, [chapterId]: [] }));
    } finally {
      setLoadingVideos(prev => ({ ...prev, [chapterId]: false }));
    }
  };

  // Load videos when chapter is expanded
  useEffect(() => {
    if (expandedChapter >= 0 && chapters[expandedChapter]) {
      const chapter = chapters[expandedChapter];
      fetchChapterVideos(chapter.id, chapter.title);
    }
  }, [expandedChapter]);

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'book':
        return <BookOpen className="w-4 h-4" />;
      case 'practice':
        return <Target className="w-4 h-4" />;
      case 'course':
        return <Award className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  // Show loading state while generating roadmap
  if (loadingRoadmap) {
    return (
      <div className="min-h-screen bg-dark-primary flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Target className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Generating Your Personalized Roadmap</h2>
            <p className="text-gray-400 mb-8">
              Creating a learning path for {selectedSkill} based on your questionnaire responses...
            </p>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-dark-secondary/50 border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
                <Target className="w-8 h-8 text-neon-blue" />
                {dynamicRoadmap?.title || roadmapData.title}
                {questionnaireData && <span className="text-green-400 text-sm ml-2">✓ Personalized</span>}
              </h1>
              <p className="text-gray-400">
                {questionnaireData ? 
                  `Auto-generated based on your questionnaire responses` :
                  'Your personalized learning journey'
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn-secondary flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Customize
              </button>
              <button 
                onClick={() => navigate('/chat')}
                className="btn-primary flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Ask AI Mentor
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="light-card p-6 mb-6"
          >
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Overall Progress</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-neon-blue h-3 rounded-full transition-all duration-300"
                      style={{ width: `${roadmapData.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-gray-800">{roadmapData.progress}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Chapters Completed</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {roadmapData.completedChapters}/{roadmapData.totalChapters}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Hours Completed</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {roadmapData.completedHours}/{roadmapData.estimatedHours}h
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Estimated Duration</h3>
                <p className="text-2xl font-bold text-gray-800">{roadmapData.totalDuration}</p>
              </div>
            </div>
          </motion.div>

          {/* Roadmap Timeline */}
          <div className="space-y-4">
            {!chapters || chapters.length === 0 ? (
              <div className="light-card p-8 text-center">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Roadmap Available</h3>
                <p className="text-gray-600 mb-4">
                  {!questionnaireData ? 
                    'Please complete the questionnaire to generate your personalized roadmap.' :
                    'Unable to generate roadmap. Please try again later.'
                  }
                </p>
                {!questionnaireData && (
                  <button
                    onClick={() => navigate('/questionnaire')}
                    className="btn-primary"
                  >
                    Take Questionnaire
                  </button>
                )}
              </div>
            ) : (
              (chapters || []).map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`light-card transition-all duration-300 ${
                  chapter.status === 'locked' ? 'opacity-60' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(chapter.status)}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          Chapter {chapter.id}: {chapter.title}
                        </h3>
                        <p className="text-gray-600">{chapter.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(chapter.difficulty)}`}>
                        {chapter.difficulty}
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{chapter.duration}</p>
                        <p className="text-sm text-gray-600">{chapter.estimatedHours}h</p>
                      </div>
                      <button
                        onClick={() => setExpandedChapter(expandedChapter === index ? -1 : index)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {expandedChapter === index ? 
                          <ChevronDown className="w-5 h-5 text-gray-600" /> : 
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        }
                      </button>
                    </div>
                  </div>

                  {chapter.status !== 'locked' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-800">{chapter.progress}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            chapter.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${chapter.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {chapter.status !== 'locked' && (
                    <div className="flex items-center gap-4">
                      {chapter.status === 'in_progress' && (
                        <button 
                          onClick={() => navigate('/quiz', { 
                            state: { 
                              skill: roadmapData?.skill || 'JavaScript',
                              chapter: chapter.id || index + 1,
                              chapterData: chapter,
                              roadmapId: roadmapData?.id || 'default'
                            }
                          })}
                          className="btn-primary flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Continue Learning
                        </button>
                      )}
                      {chapter.status === 'completed' && (
                        <button 
                          onClick={() => navigate('/quiz', { 
                            state: { 
                              skill: roadmapData?.skill || 'JavaScript',
                              chapter: chapter.id || index + 1,
                              chapterData: chapter,
                              roadmapId: roadmapData?.id || 'default'
                            }
                          })}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <Award className="w-4 h-4" />
                          Review & Quiz
                        </button>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{chapter.completedHours}/{chapter.estimatedHours} hours</span>
                      </div>
                    </div>
                  )}

                  {/* Expanded Content */}
                  {expandedChapter === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-gray-200"
                    >
                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Sub-chapters */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-4">Sub-chapters</h4>
                          <div className="space-y-3">
                            {(chapter.subChapters || []).map((subChapter, subIndex) => (
                              <div key={subIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                {subChapter.completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : subChapter.current ? (
                                  <Play className="w-5 h-5 text-blue-500" />
                                ) : (
                                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                                )}
                                <div className="flex-1">
                                  <p className={`font-medium ${
                                    subChapter.completed ? 'text-gray-600' : 
                                    subChapter.current ? 'text-blue-600' : 'text-gray-800'
                                  }`}>
                                    {subChapter.title}
                                  </p>
                                  <p className="text-sm text-gray-500">{subChapter.duration}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-4">Recommended Resources</h4>
                          <div className="space-y-3">
                            {/* YouTube Videos */}
                            {loadingVideos[chapter.id] && (
                              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                                <Loader className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                                <span className="text-gray-600">Loading YouTube videos...</span>
                              </div>
                            )}
                            
                            {youtubeVideos[chapter.id] && youtubeVideos[chapter.id].map((video, videoIndex) => (
                              <div 
                                key={`youtube-${videoIndex}`} 
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => youtubeService.openVideo(video.id)}
                              >
                                <div className="relative">
                                  <img 
                                    src={youtubeService.getThumbnailUrl(video.thumbnail, 'medium')} 
                                    alt={video.title}
                                    className="w-16 h-12 object-cover rounded"
                                    onError={(e) => {
                                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA2NCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNiAzMkwyNiAxNkwzOCAyNEwyNiAzMloiIGZpbGw9IiM2QjczODAiLz4KPC9zdmc+';
                                    }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Play className="w-6 h-6 text-white drop-shadow-lg" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800 line-clamp-2">{video.title}</p>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    <Video className="w-3 h-3" />
                                    <span>YouTube</span>
                                    {video.duration && <span>• {youtubeService.formatDuration(video.duration)}</span>}
                                    {video.viewCount && <span>• {youtubeService.formatViewCount(video.viewCount)}</span>}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{video.channel?.title}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                              </div>
                            ))}

                            {/* Static Resources */}
                            {(chapter.resources || []).map((resource, resIndex) => (
                              <div key={`static-${resIndex}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                <div className="p-2 bg-white rounded-lg">
                                  {getResourceIcon(resource.type)}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">{resource.title}</p>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>{resource.platform}</span>
                                    {resource.duration && <span>• {resource.duration}</span>}
                                    {resource.readTime && <span>• {resource.readTime}</span>}
                                    {resource.pages && <span>• {resource.pages} pages</span>}
                                    {resource.problems && <span>• {resource.problems} problems</span>}
                                  </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
              ))
            )}
          </div>

          {/* Completion Milestone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 light-card p-8 text-center"
          >
            <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Roadmap Completion</h3>
            <p className="text-gray-600 mb-6">
              Upon completing this roadmap, you'll be ready for Data Science roles and have a strong portfolio to showcase your skills.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <Star className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-800">Certification</p>
                <p className="text-gray-600">Downloadable completion certificate</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-800">Portfolio</p>
                <p className="text-gray-600">5+ projects for your portfolio</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-800">Job Ready</p>
                <p className="text-gray-600">Ready for entry-level positions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
