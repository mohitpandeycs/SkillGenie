import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  MapPin, 
  Calendar, 
  ArrowRight,
  Brain,
  Target,
  Zap,
  CheckCircle,
  Search,
  Loader
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import Sidebar from '../components/Sidebar';
import roadmapService from '../services/roadmapService';
import questionnaireService from '../services/questionnaireService';

const AIAnalysis = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  // Dynamic state - Initialize with questionnaire data
  const [selectedSkill, setSelectedSkill] = useState(() => {
    return questionnaireService.getPrimarySkillRecommendation();
  });
  const [selectedLocation, setSelectedLocation] = useState('India');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [showQuestionnairePrompt, setShowQuestionnairePrompt] = useState(false);
  
  const popularSkills = [
    'Mobile Development', 'Data Science', 'Python', 'JavaScript', 'React',
    'Machine Learning', 'Web Development', 'iOS Development', 'Android Development',
    'Node.js', 'Java', 'C++', 'DevOps', 'Cloud Computing', 'Cybersecurity'
  ];
  
  const locations = ['USA', 'UK', 'Canada', 'Germany', 'India', 'Global'];

  // Mock data for analysis
  const demandData = [
    { year: '2024', demand: 100, supply: 80 },
    { year: '2025', demand: 125, supply: 85 },
    { year: '2026', demand: 155, supply: 95 },
    { year: '2027', demand: 190, supply: 110 },
    { year: '2028', demand: 235, supply: 125 },
    { year: '2029', demand: 285, supply: 145 },
    { year: '2030', demand: 340, supply: 170 }
  ];

  const salaryData = [
    { experience: 'Entry Level', salary: 65000, percentile90: 85000 },
    { experience: '2-4 Years', salary: 85000, percentile90: 110000 },
    { experience: '5-7 Years', salary: 120000, percentile90: 150000 },
    { experience: '8+ Years', salary: 160000, percentile90: 200000 }
  ];

  const regionData = [
    { region: 'North America', opportunities: 45, color: '#3B82F6' },
    { region: 'Europe', opportunities: 30, color: '#8B5CF6' },
    { region: 'Asia Pacific', opportunities: 35, color: '#EC4899' },
    { region: 'Others', opportunities: 15, color: '#38B2AC' }
  ];

  const skillTrends = [
    { skill: 'Python', trend: '+45%', difficulty: 'Medium', timeToLearn: '3-4 months' },
    { skill: 'Machine Learning', trend: '+60%', difficulty: 'Hard', timeToLearn: '6-8 months' },
    { skill: 'Data Visualization', trend: '+35%', difficulty: 'Easy', timeToLearn: '2-3 months' },
    { skill: 'Deep Learning', trend: '+70%', difficulty: 'Hard', timeToLearn: '8-12 months' },
    { skill: 'Statistics', trend: '+25%', difficulty: 'Medium', timeToLearn: '4-5 months' }
  ];

  const competitorAnalysis = {
    totalProfessionals: 2500000,
    yearlyGrowth: 15,
    averageExperience: 3.2,
    topSkills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization']
  };

  // Fetch dynamic analytics
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    console.log(`🔍 [REACT] Fetching analytics for: "${selectedSkill}" in "${selectedLocation}"`);
    console.log(`🔍 [REACT] Current analyticsData:`, analyticsData);
    
    try {
      const result = await roadmapService.generateDynamicAnalytics(selectedSkill, selectedLocation);
      console.log('🔍 [REACT] Analytics API result:', result);
      
      if (result.success && result.data) {
        console.log(`✅ [REACT] Setting new analytics data for: "${result.data.skill}"`);
        console.log(`✅ [REACT] New salary: ${result.data.marketOverview?.averageSalary}`);
        console.log(`✅ [REACT] New growth: ${result.data.marketOverview?.growthRate}`);
        
        setAnalyticsData(result.data);
        setAnalysisComplete(true);
      } else {
        console.error('❌ [REACT] Failed to fetch analytics:', result);
      }
    } catch (error) {
      console.error('❌ [REACT] Error fetching analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Check for questionnaire data on component mount
  useEffect(() => {
    const qData = questionnaireService.getQuestionnaireData();
    setQuestionnaireData(qData);
    
    if (!qData) {
      setShowQuestionnairePrompt(true);
      return;
    }
    
    // Get skill and location from questionnaire
    const primarySkill = questionnaireService.getPrimarySkillRecommendation();
    const primaryLocation = questionnaireService.getLocationRecommendation();
    
    console.log(`📊 [AIAnalysis] Using questionnaire data:`);
    console.log(`   Skill: ${primarySkill}`);
    console.log(`   Location: ${primaryLocation}`);
    console.log(`   Experience: ${qData.experience}`);
    console.log(`   Education: ${qData.education}`);
    console.log(`   Goals: ${qData.careerGoals}`);
    
    setSelectedSkill(primarySkill);
    setSelectedLocation(primaryLocation);
  }, []);

  useEffect(() => {
    // Fetch analytics on component mount and when skill/location changes
    console.log(`📊 [useEffect] Triggered for skill: "${selectedSkill}", location: "${selectedLocation}"`);
    
    const fetchData = async () => {
      setLoadingAnalytics(true);
      console.log(`🔍 [useEffect] Auto-generating analytics for: "${selectedSkill}" in "${selectedLocation}"`);
      
      try {
        // Fetch analytics with questionnaire data for personalization
        const analyticsResult = await roadmapService.generateDynamicAnalytics(
          selectedSkill, 
          selectedLocation,
          questionnaireData  // Pass questionnaire data for personalized insights
        );
        console.log('🔍 [useEffect] Analytics API result:', analyticsResult);
        
        if (analyticsResult.success && analyticsResult.data) {
          console.log(`✅ [useEffect] Received analytics for: "${analyticsResult.data.skill}"`);
          setAnalyticsData(analyticsResult.data);
        }

        setAnalysisComplete(true);
      } catch (error) {
        console.error('❌ [useEffect] Error:', error);
      } finally {
        setLoadingAnalytics(false);
      }
    };
    
    fetchData();
  }, [selectedSkill, selectedLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="gradient-bg w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">AI is analyzing your profile...</h2>
            <p className="text-gray-400 mb-8">Processing market data, career trends, and growth projections</p>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-neon-blue rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                <Brain className="w-8 h-8 text-neon-blue" />
                AI Career Analysis
                {analysisComplete && <CheckCircle className="w-6 h-6 text-green-500" />}
                {loadingAnalytics && <Loader className="w-6 h-6 text-blue-400 animate-spin" />}
              </h1>
              <p className="text-gray-400">
                {questionnaireData ? (
                  <>
                    <span className="text-green-400">📋 Based on your questionnaire: </span>
                    {analyticsData ? 
                      `${analyticsData.skill} Career Path in ${analyticsData.location}` :
                      `${selectedSkill} Career Path in ${selectedLocation}`
                    }
                  </>
                ) : (
                  <>
                    <span className="text-yellow-400">⚠️ Using default settings - </span>
                    {analyticsData ? 
                      `${analyticsData.skill} Career Path in ${analyticsData.location}` :
                      `${selectedSkill} Career Path in ${selectedLocation}`
                    }
                  </>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">
                {loadingAnalytics ? 'Generating...' : 'Auto-Generated'}
              </p>
              <p className="text-lg font-semibold text-green-400">
                {loadingAnalytics ? (
                  <><Loader className="w-4 h-4 animate-spin inline mr-2" />Processing</>
                ) : '✓ Complete'}
              </p>
            </div>
          </div>
        </header>

        {/* Questionnaire Prompt */}
        {showQuestionnairePrompt && (
          <div className="p-6 bg-yellow-500/10 border-b border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400">Get Personalized Analysis</h3>
                  <p className="text-gray-300">Complete our questionnaire to get analysis based on your preferences and goals</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuestionnairePrompt(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Skip for now
                </button>
                <button
                  onClick={() => navigate('/questionnaire')}
                  className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Take Questionnaire
                </button>
              </div>
            </div>
          </div>
        )}


        <div className="p-6 space-y-6">
          {/* Questionnaire-based Recommendations */}
          {questionnaireData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Personalized Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">Primary Focus</h4>
                  <p className="text-white">{questionnaireService.getPrimarySkillRecommendation()}</p>
                  <p className="text-sm text-gray-400 mt-1">Based on your interests</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Experience Level</h4>
                  <p className="text-white capitalize">{questionnaireService.getExperienceLevel()}</p>
                  <p className="text-sm text-gray-400 mt-1">From your background</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">Learning Style</h4>
                  <p className="text-white capitalize">{questionnaireData.learningStyle || 'Mixed'}</p>
                  <p className="text-sm text-gray-400 mt-1">Your preferred method</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Debug Info - Remove this after testing */}
          {analyticsData && (
            <div className="bg-gray-800/30 rounded-lg p-4 mb-6 text-xs">
              <h4 className="text-yellow-400 font-semibold mb-2">🔍 Debug Info (Remove after testing):</h4>
              <p className="text-gray-300">Skill: {analyticsData.skill}</p>
              <p className="text-gray-300">Location: {analyticsData.location}</p>
              <p className="text-gray-300">Salary: {analyticsData.marketOverview?.averageSalary}</p>
              <p className="text-gray-300">Growth: {analyticsData.marketOverview?.growthRate}</p>
              <p className="text-gray-300">Job Openings: {analyticsData.marketOverview?.jobOpenings}</p>
              <p className="text-gray-300">Generated by: {analyticsData.generatedBy || 'Unknown'}</p>
              <p className="text-gray-300">Timestamp: {analyticsData.timestamp}</p>
            </div>
          )}

          {/* Key Insights Cards */}
          <motion.div
            key={`insights-${selectedSkill}-${selectedLocation}-${analyticsData?.timestamp || Date.now()}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="light-card p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <span className="text-2xl font-bold text-green-600">
                  {analyticsData?.marketOverview?.growthRate || '+35%'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">5-Year Growth</h3>
              <p className="text-sm text-gray-600">
                Expected job market growth in {analyticsData?.skill || selectedSkill}
              </p>
            </div>

            <div className="light-card p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">
                  {analyticsData?.marketOverview?.averageSalary || '$120K'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Median Salary</h3>
              <p className="text-sm text-gray-600">Average salary for mid-level positions</p>
            </div>

            <div className="light-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-purple-500" />
                <span className="text-2xl font-bold text-purple-600">
                  {analyticsData?.marketOverview?.jobOpenings || '2.5M'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Job Openings</h3>
              <p className="text-sm text-gray-600">
                Available positions in {analyticsData?.location || selectedLocation}
              </p>
            </div>

            <div className="light-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-orange-500" />
                <span className="text-2xl font-bold text-orange-600">
                  {analyticsData?.marketOverview?.demandLevel === 'High' ? '85%' : 
                   analyticsData?.marketOverview?.demandLevel === 'Very High' ? '95%' : 
                   analyticsData?.marketOverview?.demandLevel === 'Medium' ? '75%' : '80%'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Market Score</h3>
              <p className="text-sm text-gray-600">
                Demand: {analyticsData?.marketOverview?.demandLevel || 'High'} | 
                Growth: {analyticsData?.marketOverview?.growthRate || '+35%'}
              </p>
            </div>
          </motion.div>

          {/* Main Analysis Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Demand vs Supply Forecast */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="light-card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Market Demand Forecast - {analyticsData?.skill || selectedSkill}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData?.graphData?.demandTrend ? 
                      analyticsData.graphData.demandTrend.map((item, index) => ({
                        year: `202${4 + index}`,
                        demand: item.demand + Math.random() * 50, // Add some variation
                        supply: Math.max(80, item.demand - 20 + Math.random() * 30)
                      })) : demandData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="year" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1C1C1E', 
                          border: '1px solid #3B82F6',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="demand" 
                        stackId="1"
                        stroke="#3B82F6" 
                        fill="#3B82F6"
                        fillOpacity={0.6}
                        name="Job Demand"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="supply" 
                        stackId="2"
                        stroke="#EC4899" 
                        fill="#EC4899"
                        fillOpacity={0.6}
                        name="Talent Supply"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>AI Insight:</strong> {analyticsData?.futureOutlook?.projection === 'Growing' ? 
                      `${analyticsData.skill} demand is ${analyticsData.marketOverview?.demandLevel?.toLowerCase()} with ${analyticsData.marketOverview?.growthRate} growth, creating excellent opportunities.` :
                      `Demand is growing 2.5x faster than supply, creating excellent opportunities for new entrants in ${selectedSkill}.`
                    }
                  </p>
                </div>
              </motion.div>

              {/* Salary Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="light-card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Salary Progression - {analyticsData?.skill || selectedSkill}
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData?.graphData?.salaryProgression ? 
                      analyticsData.graphData.salaryProgression.map((item, index) => ({
                        experience: index === 0 ? 'Entry Level' : 
                                   index === 1 ? '2-4 Years' : 
                                   index === 2 ? '5-7 Years' : '8+ Years',
                        salary: item.salary,
                        percentile90: item.salary * 1.3
                      })) : salaryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="experience" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1C1C1E', 
                          border: '1px solid #3B82F6',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value) => [`$${value.toLocaleString()}`, '']}
                      />
                      <Bar dataKey="salary" fill="#3B82F6" name="Median Salary" />
                      <Bar dataKey="percentile90" fill="#8B5CF6" name="90th Percentile" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Insights */}
            <div className="space-y-6">
              {/* Regional Opportunities */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="light-card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Regional Opportunities</h3>
                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        dataKey="opportunities"
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {regionData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: region.color }}
                        ></div>
                        <span className="text-sm text-gray-700">{region.region}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{region.opportunities}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Skill Trends */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="light-card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Trending Skills</h3>
                <div className="space-y-4">
                  {skillTrends.map((skill, index) => (
                    <div key={index} className="border-l-4 border-neon-blue pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-800">{skill.skill}</h4>
                        <span className="text-green-600 text-sm font-medium">{skill.trend}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded text-xs ${
                          skill.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          skill.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {skill.difficulty}
                        </span>
                        <span>{skill.timeToLearn}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Competition Analysis */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="light-card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Competition Landscape</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Professionals</span>
                    <span className="font-semibold text-gray-800">{competitorAnalysis.totalProfessionals.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Yearly Growth</span>
                    <span className="font-semibold text-green-600">+{competitorAnalysis.yearlyGrowth}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Avg. Experience</span>
                    <span className="font-semibold text-gray-800">{competitorAnalysis.averageExperience} years</span>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-800 mb-2">Most In-Demand Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {competitorAnalysis.topSkills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-neon-blue/10 text-neon-blue text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="light-card p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-800">AI Recommendations</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Optimal Learning Path</h4>
                <p className="text-gray-700 mb-4">
                  Based on your profile and market analysis, focus on Python and Machine Learning fundamentals first. 
                  This combination offers the highest ROI for career transition.
                </p>
                <div className="flex items-center gap-2 text-blue-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Estimated completion: 8-10 months</span>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Market Timing</h4>
                <p className="text-gray-700 mb-4">
                  Perfect timing to enter the field. Demand is at an all-time high with a projected 35% growth 
                  over the next 5 years, while talent supply remains limited.
                </p>
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Market opportunity score: 9.2/10</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Roadmap Preview Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20 text-center">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Target className="w-6 h-6 text-blue-400" />
                Your Learning Roadmap is Ready!
              </h3>
              <p className="text-gray-300 mb-6">
                Based on your questionnaire responses, we've created a personalized learning roadmap for {selectedSkill}.
              </p>
              <button
                onClick={() => navigate('/roadmap')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <Target className="w-5 h-5" />
                View Complete Roadmap
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
