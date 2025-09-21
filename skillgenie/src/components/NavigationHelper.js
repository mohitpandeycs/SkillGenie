import React from 'react';
import { motion } from 'framer-motion';
import { Target, BarChart2, MessageSquare, FileQuestion, ExternalLink } from 'lucide-react';

const NavigationHelper = () => {
  const dynamicPages = [
    {
      title: 'Dynamic Roadmap Generator',
      description: 'Generate unique roadmaps for any skill - Mobile Dev, Data Science, Python, etc.',
      url: '/dynamic-roadmap',
      icon: Target,
      status: 'Working ✅',
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Dynamic Analytics Dashboard',
      description: 'Get market insights for any skill and location',
      url: '/dynamic-analytics', 
      icon: BarChart2,
      status: 'Working ✅',
      color: 'from-green-500 to-blue-500'
    },
    {
      title: 'AI Chat Mentor',
      description: 'Context-aware AI mentor for learning guidance',
      url: '/chat',
      icon: MessageSquare,
      status: 'Available',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Dynamic Quiz Generator',
      description: 'Chapter-specific quizzes based on your learning',
      url: '/quiz',
      icon: FileQuestion,
      status: 'Available',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const staticPages = [
    {
      title: 'Static Analysis Page',
      description: 'Shows hardcoded Data Science content only',
      url: '/analysis',
      status: 'Static Demo ⚠️'
    },
    {
      title: 'Static Roadmap Page', 
      description: 'Shows predefined roadmap content',
      url: '/roadmap',
      status: 'Static Demo ⚠️'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            SkillGenie Navigation Guide
          </h1>
          <p className="text-gray-300 text-lg">
            Choose the right page for dynamic, skill-specific content
          </p>
        </motion.div>

        {/* Dynamic Pages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Dynamic Pages (Use These!)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dynamicPages.map((page, index) => (
              <motion.div
                key={page.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${page.color} flex items-center justify-center`}>
                    <page.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{page.title}</h3>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                        {page.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{page.description}</p>
                    <a
                      href={page.url}
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Go to {page.title}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Static Pages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            Static Demo Pages (Limited Functionality)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staticPages.map((page, index) => (
              <motion.div
                key={page.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (dynamicPages.length + index) * 0.1 }}
                className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/20 opacity-75"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-300">{page.title}</h3>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                    {page.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{page.description}</p>
                <a
                  href={page.url}
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-400 transition-colors"
                >
                  View Demo Page
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Test Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-blue-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4">🚀 Quick Test Instructions</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">1. Test Dynamic Roadmaps:</h3>
              <p>Go to <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">/dynamic-roadmap</code></p>
              <p>• Select "Mobile Development" → See iOS/Android chapters</p>
              <p>• Select "Data Science" → See Python/ML chapters</p>
              <p>• Each skill shows DIFFERENT content!</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-green-400 mb-2">2. Test Dynamic Analytics:</h3>
              <p>Go to <code className="bg-gray-800 px-2 py-1 rounded text-green-300">/dynamic-analytics</code></p>
              <p>• Select different skills and locations</p>
              <p>• See unique market data for each skill</p>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Important:</h3>
              <p>The page you were viewing (<code>/analysis</code>) shows static content.</p>
              <p>Use the dynamic pages above for skill-specific content generation!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NavigationHelper;
