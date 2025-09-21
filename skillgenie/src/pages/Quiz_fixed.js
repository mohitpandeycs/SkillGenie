import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Award, 
  Clock, 
  CheckCircle, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Trophy,
  Star,
  Target,
  Zap,
  Brain,
  RotateCcw,
  Home,
  Loader,
  AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API_ENDPOINTS } from '../config/api';

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Get skill and chapter from navigation state or localStorage
  const getSkillAndChapter = () => {
    // Try to get from navigation state
    if (location.state?.skill && location.state?.chapter) {
      return {
        skill: location.state.skill,
        chapter: location.state.chapter || 1
      };
    }
    
    // Try to get from localStorage (for page refresh)
    const savedRoadmap = localStorage.getItem('currentRoadmap');
    if (savedRoadmap) {
      const roadmap = JSON.parse(savedRoadmap);
      return {
        skill: roadmap.skill || 'JavaScript',
        chapter: roadmap.currentChapter || 1
      };
    }
    
    // Default fallback
    return {
      skill: 'JavaScript',
      chapter: 1
    };
  };

  // Fetch quiz data from API
  const fetchQuizData = async () => {
    setLoading(true);
    setError(null);
    
    const { skill, chapter } = getSkillAndChapter();
    
    try {
      const response = await fetch(
        `${API_ENDPOINTS.QUIZ}/${chapter}?skill=${encodeURIComponent(skill)}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch quiz: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setQuizData({
          title: result.data.title || `${skill} Quiz - Chapter ${chapter}`,
          description: result.data.description || `Test your understanding of ${skill}`,
          totalQuestions: result.data.totalQuestions || 10,
          timeLimit: result.data.timeLimit || 600,
          passingScore: result.data.passingScore || 70,
          points: result.data.points || 150,
          skill: result.data.skill || skill,
          chapter: result.data.chapter || chapter
        });
        
        setQuestions(result.data.questions || []);
        setTimeLeft(result.data.timeLimit || 600);
      } else {
        throw new Error('Invalid quiz data received');
      }
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError(err.message);
      
      // Use fallback quiz data
      const { skill, chapter } = getSkillAndChapter();
      setQuizData({
        title: `${skill} Quiz - Chapter ${chapter}`,
        description: `Test your understanding of ${skill}`,
        totalQuestions: 10,
        timeLimit: 600,
        passingScore: 70,
        points: 150,
        skill: skill,
        chapter: chapter
      });
      
      // Generate fallback questions
      setQuestions(generateFallbackQuestions(skill, chapter));
    } finally {
      setLoading(false);
    }
  };

  // Generate fallback questions if API fails
  const generateFallbackQuestions = (skill, chapter) => {
    const skillQuestions = {
      'JavaScript': [
        {
          id: 1,
          question: "What is the correct way to declare a variable in JavaScript?",
          options: [
            "var myVariable = 5;",
            "variable myVariable = 5;",
            "v myVariable = 5;",
            "declare myVariable = 5;"
          ],
          correct: 0,
          explanation: "In JavaScript, variables are declared using var, let, or const keywords."
        },
        {
          id: 2,
          question: "Which of the following is NOT a JavaScript data type?",
          options: [
            "Number",
            "String",
            "Float",
            "Boolean"
          ],
          correct: 2,
          explanation: "JavaScript doesn't have a separate Float type. All numbers are of type Number."
        }
      ],
      'Python': [
        {
          id: 1,
          question: "How do you define a function in Python?",
          options: [
            "function myFunction():",
            "def myFunction():",
            "func myFunction():",
            "define myFunction():"
          ],
          correct: 1,
          explanation: "In Python, functions are defined using the 'def' keyword."
        },
        {
          id: 2,
          question: "Which of the following is used for comments in Python?",
          options: [
            "// This is a comment",
            "/* This is a comment */",
            "# This is a comment",
            "<!-- This is a comment -->"
          ],
          correct: 2,
          explanation: "Python uses the # symbol for single-line comments."
        }
      ],
      'React': [
        {
          id: 1,
          question: "What is JSX in React?",
          options: [
            "A JavaScript XML syntax extension",
            "A CSS framework",
            "A database query language",
            "A testing library"
          ],
          correct: 0,
          explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in React."
        },
        {
          id: 2,
          question: "What Hook is used to manage state in functional components?",
          options: [
            "useEffect",
            "useState",
            "useContext",
            "useReducer"
          ],
          correct: 1,
          explanation: "useState is the Hook used to add state to functional components in React."
        }
      ]
    };

    // Get questions for the specific skill or use generic questions
    const baseQuestions = skillQuestions[skill] || [
      {
        id: 1,
        question: `What is a fundamental concept in ${skill}?`,
        options: [
          "Core principles and best practices",
          "Random unrelated concepts",
          "Outdated techniques",
          "None of the above"
        ],
        correct: 0,
        explanation: `Understanding core principles is essential for mastering ${skill}.`
      }
    ];

    // Generate 10 questions by repeating and modifying base questions
    const questions = [];
    for (let i = 0; i < 10; i++) {
      const baseQuestion = baseQuestions[i % baseQuestions.length];
      questions.push({
        ...baseQuestion,
        id: i + 1,
        question: i < baseQuestions.length ? baseQuestion.question : 
          `${baseQuestion.question} (Question ${i + 1})`
      });
    }

    return questions;
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !showResult) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, showResult]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] ?? null);
      setShowExplanation(false);
    } else {
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] ?? null);
      setShowExplanation(false);
    }
  };

  const handleQuizComplete = () => {
    const finalAnswers = [...answers];
    if (selectedAnswer !== null) {
      finalAnswers[currentQuestion] = selectedAnswer;
    }
    setAnswers(finalAnswers);
    setShowResult(true);
  };

  const calculateScore = () => {
    if (questions.length === 0) return 0;
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index]?.correct) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return { message: "Excellent! Outstanding performance!", icon: <Trophy className="w-8 h-8 text-yellow-500" /> };
    if (score >= 70) return { message: "Great job! You passed the quiz!", icon: <Award className="w-8 h-8 text-blue-500" /> };
    if (score >= 50) return { message: "Good effort! Review the topics and try again.", icon: <Target className="w-8 h-8 text-yellow-500" /> };
    return { message: "Keep studying! You'll get it next time.", icon: <Brain className="w-8 h-8 text-red-500" /> };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-neon-blue animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !quizData) {
    return (
      <div className="min-h-screen bg-dark-primary flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Failed to load quiz</p>
            <button
              onClick={() => navigate('/roadmap')}
              className="btn-secondary"
            >
              Back to Roadmap
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-dark-primary flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {quizData?.title || 'Quiz'}
            </h1>
            <p className="text-gray-600 mb-8">
              {quizData?.description || 'Test your knowledge'}
            </p>
            
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-6">
                <p className="text-sm">Note: Using offline quiz data</p>
              </div>
            )}
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue mb-1">
                  {quizData?.totalQuestions || 10}
                </div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-purple mb-1">
                  {formatTime(quizData?.timeLimit || 600)}
                </div>
                <div className="text-sm text-gray-600">Time Limit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-pink mb-1">
                  {quizData?.points || 150}
                </div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <h3 className="font-semibold text-blue-800 mb-2">Quiz Instructions:</h3>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• You have {formatTime(quizData?.timeLimit || 600)} to complete all questions</li>
                <li>• You need {quizData?.passingScore || 70}% to pass this quiz</li>
                <li>• You can navigate between questions using the Previous/Next buttons</li>
                <li>• Your progress is automatically saved</li>
              </ul>
            </div>
            
            <button
              onClick={() => setQuizStarted(true)}
              className="btn-primary text-lg px-8 py-4 flex items-center gap-3 mx-auto"
            >
              <Zap className="w-6 h-6" />
              Start Quiz
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Rest of the component remains the same...
  // (showResult and quiz taking UI)

  if (showResult) {
    const score = calculateScore();
    const scoreData = getScoreMessage(score);
    const correctAnswers = answers.filter((answer, index) => answer === questions[index]?.correct).length;
    const earnedPoints = Math.round((score / 100) * (quizData?.points || 150));

    return (
      <div className="min-h-screen bg-dark-primary flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full"
          >
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {scoreData.icon}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
              <p className="text-gray-600 mb-6">{scoreData.message}</p>
              
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{score}%</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{correctAnswers}/{questions.length}</div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">{earnedPoints}</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {formatTime((quizData?.timeLimit || 600) - timeLeft)}
                  </div>
                  <div className="text-sm text-gray-600">Time Taken</div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setAnswers([]);
                    setShowResult(false);
                    setTimeLeft(quizData?.timeLimit || 600);
                    setQuizStarted(false);
                    fetchQuizData(); // Refresh quiz data
                  }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Quiz
                </button>
                <button
                  onClick={() => navigate('/roadmap')}
                  className="btn-primary flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Back to Roadmap
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Quiz taking UI
  const question = questions[currentQuestion];
  
  if (!question) {
    return (
      <div className="min-h-screen bg-dark-primary flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">No questions available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary flex">
      <Sidebar />
      <div className="flex-1">
        <header className="bg-dark-secondary/50 border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">{quizData?.title || 'Quiz'}</h1>
              <p className="text-gray-400">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-5 h-5" />
                <span className={`font-mono text-lg ${timeLeft < 60 ? 'text-red-500' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                onClick={handleQuizComplete}
                className="btn-secondary text-sm"
              >
                Finish Quiz
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-dark-secondary rounded-xl p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
              
              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? 'border-neon-blue bg-neon-blue/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index
                          ? 'border-neon-blue bg-neon-blue'
                          : 'border-gray-600'
                      }`}>
                        {selectedAnswer === index && (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {showExplanation && selectedAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20"
                >
                  <p className="text-sm text-gray-300">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentQuestion(index);
                      setSelectedAnswer(answers[index] ?? null);
                      setShowExplanation(false);
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      index === currentQuestion
                        ? 'bg-neon-blue text-white'
                        : answers[index] !== undefined
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-dark-primary text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                {selectedAnswer !== null && !showExplanation && (
                  <button
                    onClick={() => setShowExplanation(true)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Brain className="w-4 h-4" />
                    Show Explanation
                  </button>
                )}
                
                <button
                  onClick={currentQuestion === questions.length - 1 ? handleQuizComplete : handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
