const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const admin = require('firebase-admin');

const router = express.Router();

// Mock user database (replace with actual database)
const users = [];

// Initialize Firebase Admin (add your service account key)
// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     clientId: process.env.FIREBASE_CLIENT_ID,
//   })
// });

// Validation middleware
const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists().withMessage('Password is required')
];

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validateRegister, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date(),
      profile: {
        education: '',
        experience: '',
        skills: [],
        interests: [],
        learningStyle: '',
        goals: ''
      },
      progress: {
        completedChapters: 0,
        totalPoints: 0,
        currentStreak: 0,
        roadmaps: []
      }
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// @route   POST /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required'
      });
    }

    // For demo purposes, we'll simulate Google auth
    // In production, verify the token with Firebase Admin SDK
    
    // Mock Google user data
    const googleUser = {
      id: 'google_' + Date.now(),
      email: 'demo@google.com',
      name: 'Demo Google User',
      picture: 'https://via.placeholder.com/150x150/4285F4/white?text=G',
      createdAt: new Date(),
      provider: 'google',
      profile: {
        education: '',
        experience: '',
        skills: [],
        interests: [],
        learningStyle: '',
        goals: ''
      },
      progress: {
        completedChapters: 0,
        totalPoints: 0,
        currentStreak: 0,
        roadmaps: []
      }
    };

    // Check if user exists
    let existingUser = users.find(user => user.email === googleUser.email);
    if (!existingUser) {
      users.push(googleUser);
      existingUser = googleUser;
    }

    // Generate token
    const token = generateToken(existingUser.id);

    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user: existingUser,
        token
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during Google authentication'
    });
  }
});

// @route   POST /api/auth/github
// @desc    GitHub OAuth login
// @access  Public
router.post('/github', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    // Mock GitHub user data
    const githubUser = {
      id: 'github_' + Date.now(),
      email: 'demo@github.com',
      name: 'Demo GitHub User',
      picture: 'https://via.placeholder.com/150x150/333/white?text=GH',
      createdAt: new Date(),
      provider: 'github',
      profile: {
        education: '',
        experience: '',
        skills: [],
        interests: [],
        learningStyle: '',
        goals: ''
      },
      progress: {
        completedChapters: 0,
        totalPoints: 0,
        currentStreak: 0,
        roadmaps: []
      }
    };

    // Check if user exists
    let existingUser = users.find(user => user.email === githubUser.email);
    if (!existingUser) {
      users.push(githubUser);
      existingUser = githubUser;
    }

    // Generate token
    const token = generateToken(existingUser.id);

    res.json({
      success: true,
      message: 'GitHub authentication successful',
      data: {
        user: existingUser,
        token
      }
    });

  } catch (error) {
    console.error('GitHub auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during GitHub authentication'
    });
  }
});

// @route   POST /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.post('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = users.find(user => user.id === decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // In production, you might want to implement token blacklisting
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
