import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Users, 
  Award, 
  Zap,
  ArrowRight,
  Play,
  Star,
  CheckCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Roadmaps",
      description: "Get personalized learning paths tailored to your goals and learning style"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Market Analytics",
      description: "5-8 year growth projections and demand analysis for informed decisions"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Skill Matching",
      description: "AI matches your skills to trending careers and opportunities"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Learning",
      description: "Connect with peers and mentors in your field"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Data Scientist at Google",
      content: "SkillGenie helped me transition from marketing to AI/ML in just 8 months!",
      rating: 5
    },
    {
      name: "Raj Patel",
      role: "Full Stack Developer",
      content: "The personalized roadmap and AI mentor made learning so much more effective.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "UX Designer at Meta",
      content: "Amazing platform! The career insights helped me make the right choices.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-dark-primary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text">AI-Powered</span>
                <br />
                Career Roadmaps
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Design adaptive learning paths aligned with your interests and industry demand. 
                Get personalized skills recommendations with 5-8 year growth projections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/auth')}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="btn-secondary flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="light-card p-8 animate-float">
                <div className="gradient-bg h-4 rounded-full mb-6"></div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">AI Analysis Complete</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Roadmap Generated</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-700">Learning in Progress</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">
                    "Data Science shows 35% growth potential in your region"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-dark-secondary/50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Why Choose <span className="gradient-text">SkillGenie</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Leverage AI insights with industrial foresight for workforce readiness and sustainable career growth
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="light-card p-6 text-center hover:neon-glow transition-all duration-300"
              >
                <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Success <span className="gradient-text">Stories</span>
            </h2>
            <p className="text-xl text-gray-300">
              See how SkillGenie transformed careers
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="light-card p-6"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-neon-purple via-neon-blue to-neon-pink">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are building future-ready skills with AI guidance
            </p>
            <button 
              onClick={() => navigate('/auth')}
              className="bg-white text-neon-blue font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Start Your Journey Today
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
