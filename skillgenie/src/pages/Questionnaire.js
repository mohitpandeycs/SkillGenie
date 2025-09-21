import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Brain, 
  Code, 
  Palette, 
  TrendingUp,
  Users,
  Shield,
  Cloud,
  Smartphone,
  Lightbulb
} from 'lucide-react';
import toast from 'react-hot-toast';
import questionnaireService from '../services/questionnaireService';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    education: '',
    experience: '',
    currentSkills: [],
    interests: [],
    learningStyle: '',
    timeCommitment: '',
    careerGoals: '',
    preferredDomains: []
  });

  const steps = [
    {
      title: 'Education & Experience',
      subtitle: 'Tell us about your background'
    },
    {
      title: 'Current Skills',
      subtitle: 'What skills do you already have?'
    },
    {
      title: 'Interests & Goals',
      subtitle: 'What excites you most?'
    },
    {
      title: 'Learning Preferences',
      subtitle: 'How do you learn best?'
    },
    {
      title: 'Career Domains',
      subtitle: 'Which fields interest you?'
    }
  ];

  const educationOptions = [
    { value: 'high_school', label: 'High School' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'graduate', label: 'Graduate' },
    { value: 'professional', label: 'Working Professional' }
  ];

  const experienceOptions = [
    { value: 'beginner', label: 'Complete Beginner' },
    { value: 'some_experience', label: 'Some Experience (1-2 years)' },
    { value: 'experienced', label: 'Experienced (3-5 years)' },
    { value: 'expert', label: 'Expert (5+ years)' }
  ];

  const skillOptions = [
    'Programming', 'Data Analysis', 'Design', 'Marketing', 'Writing', 
    'Project Management', 'Communication', 'Leadership', 'Problem Solving'
  ];

  const learningStyles = [
    { 
      value: 'visual', 
      label: 'Visual Learner', 
      description: 'Videos, diagrams, and visual content',
      icon: <Palette className="w-6 h-6" />
    },
    { 
      value: 'practical', 
      label: 'Hands-on Learner', 
      description: 'Projects, exercises, and practice',
      icon: <Code className="w-6 h-6" />
    },
    { 
      value: 'reading', 
      label: 'Reading/Writing', 
      description: 'Articles, blogs, and documentation',
      icon: <Brain className="w-6 h-6" />
    },
    { 
      value: 'mixed', 
      label: 'Mixed Approach', 
      description: 'Combination of all methods',
      icon: <Lightbulb className="w-6 h-6" />
    }
  ];

  const careerDomains = [
    {
      value: 'ai_ml',
      label: 'AI & Machine Learning',
      description: 'Build intelligent systems and algorithms',
      icon: <Brain className="w-8 h-8" />,
      growth: '+35%',
      color: 'from-purple-500 to-pink-500'
    },
    {
      value: 'web_dev',
      label: 'Web Development',
      description: 'Create websites and web applications',
      icon: <Code className="w-8 h-8" />,
      growth: '+25%',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      value: 'data_science',
      label: 'Data Science',
      description: 'Analyze data to drive business decisions',
      icon: <TrendingUp className="w-8 h-8" />,
      growth: '+30%',
      color: 'from-green-500 to-emerald-500'
    },
    {
      value: 'cybersecurity',
      label: 'Cybersecurity',
      description: 'Protect systems and data from threats',
      icon: <Shield className="w-8 h-8" />,
      growth: '+40%',
      color: 'from-red-500 to-orange-500'
    },
    {
      value: 'cloud_computing',
      label: 'Cloud Computing',
      description: 'Build and manage cloud infrastructure',
      icon: <Cloud className="w-8 h-8" />,
      growth: '+28%',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      value: 'mobile_dev',
      label: 'Mobile Development',
      description: 'Create mobile apps for iOS and Android',
      icon: <Smartphone className="w-8 h-8" />,
      growth: '+22%',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      value: 'ui_ux',
      label: 'UI/UX Design',
      description: 'Design user-friendly interfaces',
      icon: <Palette className="w-8 h-8" />,
      growth: '+20%',
      color: 'from-pink-500 to-rose-500'
    },
    {
      value: 'product_management',
      label: 'Product Management',
      description: 'Lead product development and strategy',
      icon: <Users className="w-8 h-8" />,
      growth: '+18%',
      color: 'from-teal-500 to-green-500'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('📝 Submitting questionnaire data:', formData);
    
    // Save questionnaire data
    const savedData = questionnaireService.saveQuestionnaireData(formData);
    
    if (savedData) {
      toast.success('Analyzing your responses...');
      console.log('✅ Questionnaire data saved successfully');
      
      // Generate personalized recommendations
      const recommendations = questionnaireService.generatePersonalizedRecommendations();
      console.log('🎯 Generated recommendations:', recommendations);
      
      // Simulate AI processing
      setTimeout(() => {
        navigate('/analysis');
      }, 2000);
    } else {
      toast.error('Failed to save your responses. Please try again.');
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.education && formData.experience;
      case 1:
        return formData.currentSkills.length > 0;
      case 2:
        return formData.interests.length > 0 && formData.careerGoals;
      case 3:
        return formData.learningStyle && formData.timeCommitment;
      case 4:
        return formData.preferredDomains.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Header */}
      <header className="bg-dark-secondary/50 border-b border-white/10 p-6">
        <div className="container-max flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">New Learning Session</h1>
            <p className="text-gray-400">Step {currentStep + 1} of {steps.length}</p>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-dark-secondary/30 p-4">
        <div className="container-max">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-neon-blue text-white' : 'bg-gray-600 text-gray-400'
                }`}>
                  {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-neon-blue' : 'bg-gray-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
            <p className="text-gray-400">{steps[currentStep].subtitle}</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container-max p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {/* Step 0: Education & Experience */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="light-card p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Education Level</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {educationOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('education', option.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.education === option.value
                            ? 'border-neon-blue bg-blue-50 text-neon-blue'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="light-card p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Experience Level</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {experienceOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('experience', option.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.experience === option.value
                            ? 'border-neon-blue bg-blue-50 text-neon-blue'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Current Skills */}
            {currentStep === 1 && (
              <div className="light-card p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Select your current skills (choose all that apply)
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleArrayToggle('currentSkills', skill)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.currentSkills.includes(skill)
                          ? 'border-neon-blue bg-blue-50 text-neon-blue'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Interests & Goals */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="light-card p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    What interests you most? (select multiple)
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {['Technology', 'Business', 'Creative Arts', 'Science', 'Healthcare', 'Finance'].map((interest) => (
                      <button
                        key={interest}
                        onClick={() => handleArrayToggle('interests', interest)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.interests.includes(interest)
                            ? 'border-neon-blue bg-blue-50 text-neon-blue'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="light-card p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Career Goals</h3>
                  <textarea
                    value={formData.careerGoals}
                    onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                    placeholder="Describe your career aspirations and what you hope to achieve..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:border-neon-blue focus:outline-none resize-none"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Learning Preferences */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="light-card p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Learning Style</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {learningStyles.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => handleInputChange('learningStyle', style.value)}
                        className={`p-6 rounded-lg border-2 transition-all text-left ${
                          formData.learningStyle === style.value
                            ? 'border-neon-blue bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`p-2 rounded-lg ${
                            formData.learningStyle === style.value ? 'bg-neon-blue text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {style.icon}
                          </div>
                          <h4 className="font-semibold text-gray-800">{style.label}</h4>
                        </div>
                        <p className="text-gray-600">{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="light-card p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Time Commitment</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { value: '1-3', label: '1-3 hours/week' },
                      { value: '4-7', label: '4-7 hours/week' },
                      { value: '8-15', label: '8-15 hours/week' },
                      { value: '15+', label: '15+ hours/week' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('timeCommitment', option.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.timeCommitment === option.value
                            ? 'border-neon-blue bg-blue-50 text-neon-blue'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Career Domains */}
            {currentStep === 4 && (
              <div className="light-card p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Choose your preferred career domains (select up to 3)
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {careerDomains.map((domain) => (
                    <button
                      key={domain.value}
                      onClick={() => handleArrayToggle('preferredDomains', domain.value)}
                      disabled={!formData.preferredDomains.includes(domain.value) && formData.preferredDomains.length >= 3}
                      className={`p-6 rounded-lg border-2 transition-all text-left relative overflow-hidden ${
                        formData.preferredDomains.includes(domain.value)
                          ? 'border-neon-blue bg-blue-50'
                          : formData.preferredDomains.length >= 3
                          ? 'border-gray-200 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${domain.color} opacity-10 rounded-bl-full`}></div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${domain.color} text-white`}>
                          {domain.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{domain.label}</h4>
                          <span className="text-green-600 text-sm font-medium">{domain.growth} growth</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{domain.description}</p>
                    </button>
                  ))}
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  Selected: {formData.preferredDomains.length}/3
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12 max-w-4xl mx-auto">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? 'Generate Roadmap' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
