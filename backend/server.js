const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://skillgenie-frontend.vercel.app', 'https://skillgenie.vercel.app']
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000', 
  'http://127.0.0.1:3000', 
  'http://127.0.0.1:55620',
  process.env.FRONTEND_URL,
  'https://skillgenie-frontend.vercel.app',
  'https://skillgenie-frontend-anant-4-codes-projects.vercel.app'
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const cleanGeminiService = require('./services/cleanGeminiService');
const quizRoutes = require('./routes/quizzes');
const chatRoutes = require('./routes/chat');
const careerRoutes = require('./routes/careers');
const analyticsRoutes = require('./routes/analytics');
const youtubeRoutes = require('./routes/youtube');
const aiMentorRoutes = require('./routes/aiMentor');
const roadmapRoutes = require('./routes/roadmaps');
const progressRoutes = require('./routes/progress');

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'SkillGenie Backend is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: allowedOrigins
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    corsEnabled: true
  });
});

// CORS preflight handler
app.options('*', cors());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/ai-mentor', aiMentorRoutes);
app.use('/api/progress', progressRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'SkillGenie API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SkillGenie API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error response
  let error = {
    message: 'Internal server error',
    status: 500
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.message = 'Validation error';
    error.status = 400;
    error.details = err.message;
  } else if (err.name === 'UnauthorizedError') {
    error.message = 'Unauthorized';
    error.status = 401;
  } else if (err.code === 11000) {
    error.message = 'Duplicate entry';
    error.status = 409;
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    delete error.details;
  }

  res.status(error.status).json(error);
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Handle chat messages
  socket.on('chat_message', (data) => {
    // Echo back or process the message
    socket.emit('chat_response', data);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Available ✅' : 'Missing ❌'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📈 Analytics endpoint: http://localhost:${PORT}/api/analytics/market/dynamic`);
  console.log(`🗺️ Roadmap endpoint: http://localhost:${PORT}/api/roadmaps/generate/dynamic`);
  console.log(`🔌 WebSocket server ready`);
});

module.exports = app;
