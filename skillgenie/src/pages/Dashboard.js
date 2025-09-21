import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Award, 
  Clock, 
  Target, 
  Zap, 
  BookOpen, 
  Users,
  Play,
  Plus,
  ArrowRight,
  Calendar,
  Trophy,
  Star,
  ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    currentStreak: 7,
    totalPoints: 2450,
    level: 'Intermediate'
  });

  const [stats] = useState({
    skillsCompleted: 3,
    totalSkills: 8,
    hoursLearned: 45,
    weeklyGoal: 10,
    currentChapter: 'Machine Learning Basics',
    progress: 65
  });

  const skillData = [
    { name: 'Python', value: 85, color: '#3B82F6' },
    { name: 'Data Analysis', value: 70, color: '#8B5CF6' },
    { name: 'ML Basics', value: 45, color: '#EC4899' },
    { name: 'Statistics', value: 60, color: '#38B2AC' }
  ];

  const progressData = [
    { week: 'Week 1', hours: 8 },
    { week: 'Week 2', hours: 12 },
    { week: 'Week 3', hours: 10 },
    { week: 'Week 4', hours: 15 },
    { week: 'Week 5', hours: 18 }
  ];

  const recentActivities = [
    { type: 'quiz', title: 'Completed Python Basics Quiz', score: 95, time: '2 hours ago' },
    { type: 'chapter', title: 'Finished Data Structures Chapter', time: '1 day ago' },
    { type: 'badge', title: 'Earned "Quick Learner" Badge', time: '2 days ago' },
    { type: 'milestone', title: 'Reached 50% Progress in Data Science', time: '3 days ago' }
  ];

  const aiSuggestions = [
    {
      type: 'focus',
      title: 'Focus on Chapter 3 Today',
      description: 'You\'re making great progress! Complete the Machine Learning Fundamentals chapter to stay on track.',
      action: 'Continue Learning',
      priority: 'high'
    },
    {
      type: 'quiz',
      title: 'Take a Quick Review Quiz',
      description: 'Test your knowledge on Python basics before moving to advanced topics.',
      action: 'Start Quiz',
      priority: 'medium'
    },
    {
      type: 'trend',
      title: 'Trending: Cloud Computing',
      description: 'Cloud skills are in high demand. Consider adding AWS fundamentals to your roadmap.',
      action: 'Explore',
      priority: 'low'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-primary flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-dark-secondary/50 border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Welcome back, {user.name}! 👋</h1>
              <p className="text-gray-400">Ready to continue your learning journey?</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/questionnaire')}
                className="btn-secondary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Session
              </button>
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-neon-blue"
                />
                <div className="text-right">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.level}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="light-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="gradient-bg w-12 h-12 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-800">{stats.progress}%</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Current Progress</h3>
              <p className="text-sm text-gray-600">{stats.currentChapter}</p>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-neon-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.progress}%` }}
                ></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="light-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="gradient-bg w-12 h-12 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-800">{user.currentStreak}</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Learning Streak</h3>
              <p className="text-sm text-gray-600">Days in a row</p>
              <div className="mt-3 flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-4 h-4 rounded ${i < user.currentStreak ? 'bg-neon-blue' : 'bg-gray-200'}`}
                  ></div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="light-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="gradient-bg w-12 h-12 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-800">{user.totalPoints}</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Total Points</h3>
              <p className="text-sm text-gray-600">Earned from quizzes</p>
              <div className="mt-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">Top 15% learner</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="light-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="gradient-bg w-12 h-12 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-800">{stats.hoursLearned}h</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Hours This Month</h3>
              <p className="text-sm text-gray-600">Goal: {stats.weeklyGoal}h/week</p>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((stats.hoursLearned / (stats.weeklyGoal * 4)) * 100, 100)}%` }}
                ></div>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Charts and Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Skills Progress Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="light-card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Skills Mastery</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={skillData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {skillData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {skillData.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: skill.color }}
                          ></div>
                          <span className="text-gray-700">{skill.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{skill.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Learning Progress Over Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="light-card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Learning Progress</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1C1C1E', 
                          border: '1px solid #3B82F6',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Right Column - AI Suggestions and Activities */}
            <div className="space-y-6">
              {/* AI Suggestions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="light-card p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="w-5 h-5 text-neon-blue" />
                  <h3 className="text-xl font-semibold text-gray-800">AI Suggestions</h3>
                </div>
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        suggestion.priority === 'high' ? 'border-red-500 bg-red-50' :
                        suggestion.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-800 mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                      <button className="text-neon-blue hover:text-blue-600 text-sm font-medium flex items-center gap-1">
                        {suggestion.action}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activities */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="light-card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'quiz' ? 'bg-green-100 text-green-600' :
                        activity.type === 'chapter' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'badge' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'quiz' && <Award className="w-4 h-4" />}
                        {activity.type === 'chapter' && <BookOpen className="w-4 h-4" />}
                        {activity.type === 'badge' && <Trophy className="w-4 h-4" />}
                        {activity.type === 'milestone' && <Target className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                        {activity.score && (
                          <p className="text-sm text-green-600">Score: {activity.score}%</p>
                        )}
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="light-card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/roadmap')}
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 rounded-lg hover:from-neon-blue/20 hover:to-neon-purple/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-neon-blue" />
                      <span className="text-gray-800">Continue Learning</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <button 
                    onClick={() => navigate('/quiz')}
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg hover:from-green-200 hover:to-emerald-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-green-600" />
                      <span className="text-gray-800">Take Quiz</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <button 
                    onClick={() => navigate('/chat')}
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-800">Ask AI Mentor</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
