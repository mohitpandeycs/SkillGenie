import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink,
  Filter,
  Search,
  Bookmark,
  TrendingUp,
  Users,
  Star,
  Building,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Career = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');

  const tabs = [
    { id: 'jobs', label: 'Job Opportunities', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'freelance', label: 'Freelance Gigs', icon: <Target className="w-4 h-4" /> },
    { id: 'internships', label: 'Internships', icon: <Users className="w-4 h-4" /> },
    { id: 'events', label: 'Events & Hackathons', icon: <Calendar className="w-4 h-4" /> }
  ];

  const jobOpportunities = [
    {
      id: 1,
      title: "Junior Data Scientist",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$85,000 - $110,000",
      experience: "1-2 years",
      skills: ["Python", "Machine Learning", "SQL", "Pandas"],
      description: "Join our data science team to build predictive models and analyze customer behavior data.",
      posted: "2 days ago",
      applicants: 45,
      matchScore: 92,
      logo: "https://via.placeholder.com/40x40/3B82F6/white?text=TC"
    },
    {
      id: 2,
      title: "Data Analyst",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      salary: "$70,000 - $90,000",
      experience: "0-1 years",
      skills: ["Python", "SQL", "Tableau", "Statistics"],
      description: "Analyze business metrics and create dashboards to drive data-driven decisions.",
      posted: "1 day ago",
      applicants: 23,
      matchScore: 88,
      logo: "https://via.placeholder.com/40x40/8B5CF6/white?text=SX"
    },
    {
      id: 3,
      title: "Machine Learning Engineer",
      company: "AI Solutions Ltd",
      location: "New York, NY",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      experience: "2-4 years",
      skills: ["Python", "TensorFlow", "MLOps", "Docker"],
      description: "Deploy and maintain ML models in production environments.",
      posted: "3 days ago",
      applicants: 67,
      matchScore: 75,
      logo: "https://via.placeholder.com/40x40/EC4899/white?text=AI"
    },
    {
      id: 4,
      title: "Business Intelligence Analyst",
      company: "DataFlow Corp",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$75,000 - $95,000",
      experience: "1-3 years",
      skills: ["SQL", "Power BI", "Python", "Excel"],
      description: "Create business intelligence solutions and reporting systems.",
      posted: "5 days ago",
      applicants: 34,
      matchScore: 82,
      logo: "https://via.placeholder.com/40x40/38B2AC/white?text=DF"
    }
  ];

  const freelanceGigs = [
    {
      id: 1,
      title: "Customer Churn Analysis Project",
      client: "E-commerce Startup",
      budget: "$2,000 - $3,500",
      duration: "2-3 weeks",
      skills: ["Python", "Machine Learning", "Data Visualization"],
      description: "Analyze customer data to identify churn patterns and build predictive model.",
      posted: "1 day ago",
      proposals: 12,
      matchScore: 90
    },
    {
      id: 2,
      title: "Sales Dashboard Development",
      client: "Marketing Agency",
      budget: "$1,500 - $2,500",
      duration: "1-2 weeks",
      skills: ["Python", "Tableau", "SQL"],
      description: "Create interactive sales dashboard with real-time data updates.",
      posted: "3 days ago",
      proposals: 8,
      matchScore: 85
    },
    {
      id: 3,
      title: "Market Research Data Analysis",
      client: "Consulting Firm",
      budget: "$1,000 - $2,000",
      duration: "1 week",
      skills: ["Python", "Statistics", "Data Visualization"],
      description: "Analyze survey data and create comprehensive market research report.",
      posted: "2 days ago",
      proposals: 15,
      matchScore: 78
    }
  ];

  const internships = [
    {
      id: 1,
      title: "Data Science Intern",
      company: "Google",
      location: "Mountain View, CA",
      duration: "3 months",
      stipend: "$7,000/month",
      skills: ["Python", "Machine Learning", "Statistics"],
      description: "Work on real-world ML projects with experienced data scientists.",
      posted: "1 week ago",
      applicants: 234,
      matchScore: 95
    },
    {
      id: 2,
      title: "Analytics Intern",
      company: "Netflix",
      location: "Los Gatos, CA",
      duration: "4 months",
      stipend: "$6,500/month",
      skills: ["Python", "SQL", "A/B Testing"],
      description: "Analyze user behavior and content performance metrics.",
      posted: "5 days ago",
      applicants: 189,
      matchScore: 88
    },
    {
      id: 3,
      title: "ML Research Intern",
      company: "Microsoft Research",
      location: "Redmond, WA",
      duration: "6 months",
      stipend: "$8,000/month",
      skills: ["Python", "Deep Learning", "Research"],
      description: "Contribute to cutting-edge AI research projects.",
      posted: "3 days ago",
      applicants: 156,
      matchScore: 82
    }
  ];

  const events = [
    {
      id: 1,
      title: "AI/ML Hackathon 2024",
      organizer: "TechEvents Inc",
      date: "March 15-17, 2024",
      location: "San Francisco, CA",
      type: "Hackathon",
      prize: "$50,000 total prizes",
      description: "48-hour hackathon focused on AI and machine learning solutions.",
      participants: 500,
      difficulty: "Intermediate"
    },
    {
      id: 2,
      title: "Data Science Conference",
      organizer: "DS Community",
      date: "April 5, 2024",
      location: "Virtual",
      type: "Conference",
      prize: "Free attendance",
      description: "Learn from industry experts about latest trends in data science.",
      participants: 1200,
      difficulty: "All levels"
    },
    {
      id: 3,
      title: "Kaggle Competition: Sales Forecasting",
      organizer: "Kaggle",
      date: "Ongoing - Ends May 1",
      location: "Online",
      type: "Competition",
      prize: "$25,000",
      description: "Predict sales for a retail chain using historical data.",
      participants: 2340,
      difficulty: "Advanced"
    }
  ];

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const renderJobCard = (job) => (
    <motion.div
      key={job.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="light-card p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-lg" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{job.title}</h3>
            <p className="text-gray-600 flex items-center gap-2">
              <Building className="w-4 h-4" />
              {job.company}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(job.matchScore)}`}>
            {job.matchScore}% match
          </span>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bookmark className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{job.description}</p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{job.experience}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{job.applicants} applicants</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-neon-blue/10 text-neon-blue text-xs rounded">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Posted {job.posted}</span>
        <button className="btn-primary flex items-center gap-2">
          Apply Now
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  const renderFreelanceCard = (gig) => (
    <motion.div
      key={gig.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="light-card p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{gig.title}</h3>
          <p className="text-gray-600">{gig.client}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(gig.matchScore)}`}>
          {gig.matchScore}% match
        </span>
      </div>

      <p className="text-gray-700 mb-4">{gig.description}</p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{gig.budget}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{gig.duration}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {gig.skills.map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{gig.proposals} proposals • Posted {gig.posted}</span>
        <button className="btn-primary flex items-center gap-2">
          Submit Proposal
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  const renderInternshipCard = (internship) => (
    <motion.div
      key={internship.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="light-card p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{internship.title}</h3>
          <p className="text-gray-600 flex items-center gap-2">
            <Building className="w-4 h-4" />
            {internship.company}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(internship.matchScore)}`}>
          {internship.matchScore}% match
        </span>
      </div>

      <p className="text-gray-700 mb-4">{internship.description}</p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{internship.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{internship.stipend}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{internship.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{internship.applicants} applicants</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {internship.skills.map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Posted {internship.posted}</span>
        <button className="btn-primary flex items-center gap-2">
          Apply Now
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  const renderEventCard = (event) => (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="light-card p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{event.title}</h3>
          <p className="text-gray-600">{event.organizer}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          event.difficulty === 'All levels' ? 'bg-green-100 text-green-700' :
          event.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {event.difficulty}
        </span>
      </div>

      <p className="text-gray-700 mb-4">{event.description}</p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Star className="w-4 h-4" />
          <span>{event.prize}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{event.participants} participants</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          event.type === 'Hackathon' ? 'bg-blue-100 text-blue-700' :
          event.type === 'Conference' ? 'bg-green-100 text-green-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {event.type}
        </span>
        <button className="btn-primary flex items-center gap-2">
          Join Event
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  const getCurrentData = () => {
    switch (activeTab) {
      case 'jobs': return jobOpportunities;
      case 'freelance': return freelanceGigs;
      case 'internships': return internships;
      case 'events': return events;
      default: return jobOpportunities;
    }
  };

  const renderCurrentCards = () => {
    const data = getCurrentData();
    switch (activeTab) {
      case 'jobs': return data.map(renderJobCard);
      case 'freelance': return data.map(renderFreelanceCard);
      case 'internships': return data.map(renderInternshipCard);
      case 'events': return data.map(renderEventCard);
      default: return data.map(renderJobCard);
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-dark-secondary/50 border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-neon-blue" />
                Career Opportunities
              </h1>
              <p className="text-gray-400">Discover jobs, freelance gigs, and events matched to your skills</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">92%</div>
                <div className="text-xs text-gray-400">Avg Match</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">156</div>
                <div className="text-xs text-gray-400">New Today</div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-neon-blue shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="light-card p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-neon-blue focus:outline-none"
                  />
                </div>
              </div>
              
              {activeTab === 'jobs' && (
                <>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-neon-blue focus:outline-none"
                  >
                    <option value="all">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="san-francisco">San Francisco</option>
                    <option value="new-york">New York</option>
                    <option value="austin">Austin</option>
                  </select>
                  
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-neon-blue focus:outline-none"
                  >
                    <option value="all">All Experience</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </>
              )}
              
              <button className="btn-secondary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="light-card p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50"
          >
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-neon-blue" />
              <h3 className="text-xl font-semibold text-gray-800">AI Recommendations</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Perfect Match</h4>
                <p className="text-sm text-gray-600 mb-3">Based on your Python and ML skills, you're a 92% match for Junior Data Scientist roles.</p>
                <button className="text-neon-blue hover:text-blue-600 text-sm font-medium">View Jobs →</button>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Skill Gap Analysis</h4>
                <p className="text-sm text-gray-600 mb-3">Learning TensorFlow will unlock 15 more ML Engineer positions.</p>
                <button className="text-neon-blue hover:text-blue-600 text-sm font-medium">Start Learning →</button>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Trending Opportunities</h4>
                <p className="text-sm text-gray-600 mb-3">Remote data analyst positions increased by 40% this week.</p>
                <button className="text-neon-blue hover:text-blue-600 text-sm font-medium">Explore →</button>
              </div>
            </div>
          </motion.div>

          {/* Opportunities Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {renderCurrentCards()}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="btn-secondary">
              Load More Opportunities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
