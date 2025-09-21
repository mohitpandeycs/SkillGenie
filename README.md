# 🧞‍♂️ SkillGenie: AI-Powered Career & Skills Advisor

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.2.7-blue.svg)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI%20Powered-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Live Demo
**Frontend:** [SkillGenie Live](https://skillgenie-frontend.vercel.app)  
**Backend API:** [SkillGenie API](https://skillgenie-backend.vercel.app)

## 📖 Overview

SkillGenie is a cutting-edge AI-driven career intelligence platform that revolutionizes professional development by creating personalized learning roadmaps. Powered by **Google Gemini AI**, it analyzes individual skills, interests, and market trends to deliver intelligent career guidance, curated learning paths, and real-time industry insights.

### 🎯 What Makes SkillGenie Special?
- **AI-First Approach**: Deep integration with Google Gemini AI for intelligent analysis
- **Real-Time Market Intelligence**: Live job market analysis and salary projections
- **Personalized Learning**: Adaptive roadmaps based on individual learning patterns
- **Industry Partnerships**: Direct access to internships, jobs, and freelance opportunities
- **24/7 AI Mentor**: Your personal career coach available anytime

## 🌟 Features

### 🎯 Core Features
- **AI-Powered Roadmaps**: Personalized learning paths based on your goals and learning style
- **Market Analytics**: Real-time job market analysis with 5-8 year growth projections
- **Smart Skill Matching**: AI matches your skills to trending careers and opportunities
- **Interactive Learning**: Chapter-by-chapter guided learning with resource recommendations
- **Gamified Experience**: Points, badges, and leaderboards to keep you motivated
- **AI Chat Mentor**: 24/7 AI assistant for career guidance and technical questions

### 📊 Advanced Analytics
- **Progress Tracking**: Detailed analytics on learning patterns and skill development
- **Market Insights**: Industry demand analysis and salary projections
- **Career Forecasting**: AI-powered predictions for career growth and opportunities
- **Skill Gap Analysis**: Identify missing skills for your target roles

### 💼 Career Services
- **Job Matching**: AI-powered job recommendations with match scores
- **Freelance Opportunities**: Curated gigs based on your skill level
- **Internship Programs**: Access to top-tier internship opportunities
- **Events & Hackathons**: Discover relevant networking and competition events

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohitpandeycs/SkillGenie.git
   cd SkillGenie
   ```

2. **Install frontend dependencies**
   ```bash
   cd skillgenie
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**
   
   **Backend Configuration:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit the `.env` file with your API keys:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   
   # AI Services (Required)
   GEMINI_API_KEY=your-gemini-api-key-here
   YOUTUBE_API_KEY=your-youtube-api-key-here
   GOOGLE_SEARCH_API_KEY=your-google-search-api-key-here
   GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # Firebase Configuration (Optional)
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY=your-firebase-private-key
   ```
   
   **Frontend Configuration:**
   ```bash
   cd skillgenie
   cp .env.example .env.local
   ```
   
   Edit the `.env.local` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   ```

5. **Start the development servers**
   
   **Frontend (Terminal 1):**
   ```bash
   cd skillgenie
   npm start
   ```
   
   **Backend (Terminal 2):**
   ```bash
   cd backend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏗️ Project Structure

```
SkillGuieni/
├── skillgenie/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── Sidebar.js
│   │   ├── pages/             # Main application pages
│   │   │   ├── LandingPage.js
│   │   │   ├── Auth.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Questionnaire.js
│   │   │   ├── AIAnalysis.js
│   │   │   ├── Roadmap.js
│   │   │   ├── Chat.js
│   │   │   ├── Quiz.js
│   │   │   └── Career.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
├── backend/                   # Node.js Backend
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── roadmaps.js
│   │   ├── quizzes.js
│   │   ├── chat.js
│   │   ├── careers.js
│   │   └── analytics.js
│   ├── server.js            # Main server file
│   ├── .env.example         # Environment variables template
│   └── package.json
└── README.md
```

## 🎨 Design System

### Color Palette
- **Dark Theme**: Primary (#121212), Secondary (#1C1C1E)
- **Light Cards**: Primary (#F8F9FA), Secondary (#ECEFF1)
- **Accent Colors**: Neon Blue (#3B82F6), Purple (#8B5CF6), Pink (#EC4899)

### Typography
- **Primary Font**: Inter (clean, modern)
- **Secondary Font**: Poppins (headings)

### UI Components
- **Glass Cards**: Frosted glass effect with backdrop blur
- **Light Cards**: Clean white cards with subtle shadows
- **Gradient Elements**: Purple-blue-pink gradients for highlights
- **Animations**: Framer Motion for smooth transitions

## 🔧 Technology Stack

### Frontend
- **React 18.2.0**: Modern React with hooks and functional components
- **TailwindCSS 3.2.7**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions
- **Recharts**: Data visualization and charts
- **Formik + Yup**: Form handling and validation
- **React Router**: Client-side routing
- **Lucide React**: Modern icon library

### Backend
- **Node.js + Express**: RESTful API server
- **Firebase Admin**: Authentication and user management
- **JWT**: Secure token-based authentication
- **Express Validator**: Input validation and sanitization
- **CORS + Helmet**: Security middleware
- **Rate Limiting**: API protection

### AI/ML Integration
- **Google Gemini AI 1.5 Flash**: Primary AI engine for career analysis and guidance
- **YouTube Data API v3**: Content recommendation and educational resource curation
- **Google Search API**: Real-time market research and trend analysis
- **Custom AI Services**: Enhanced roadmap generation and personalized mentoring

## 📱 Key Pages & Features

### 1. Landing Page
- Hero section with value proposition
- Feature highlights with animations
- Success stories and testimonials
- Call-to-action for sign-up

### 2. Authentication
- Social login (Google, GitHub)
- Email/password authentication
- Onboarding tutorial
- Split-screen design with illustrations

### 3. Dashboard
- Progress overview with charts
- AI-powered suggestions
- Recent activity feed
- Quick action buttons
- Learning streak tracking

### 4. Questionnaire
- Multi-step form for user profiling
- Adaptive questions based on responses
- Career domain selection
- Learning style assessment
- Progress tracking

### 5. AI Analysis
- Market demand forecasting
- Salary progression analysis
- Regional opportunities
- Skill trend analysis
- AI recommendations

### 6. Roadmap
- Interactive timeline visualization
- Chapter-by-chapter breakdown
- Progress tracking
- Resource recommendations
- Adaptive learning paths

### 7. AI Chat
- 24/7 AI mentor assistance
- Context-aware responses
- Conversation history
- Suggested questions
- Feedback system

### 8. Quiz System
- AI-generated questions
- Timed assessments
- Detailed explanations
- Progress tracking
- Gamified scoring

### 9. Career Opportunities
- Job matching with AI scores
- Freelance project listings
- Internship opportunities
- Events and hackathons
- Application tracking

## 🔌 API Documentation

### 🌐 Base URL
- **Development:** `http://localhost:5000`
- **Production:** `https://skillgenie-backend.vercel.app`

### 🔐 Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### 📋 Core Endpoints

#### **Authentication**
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
POST /api/auth/verify
```

#### **AI Services**
```http
POST /api/ai/analyze               # AI career analysis
POST /api/ai/chat                  # Chat with AI mentor
POST /api/ai/roadmap/generate      # Generate learning roadmap
POST /api/ai/roadmap/enhance       # Enhance existing roadmap
GET  /api/ai/skills/trending       # Get trending skills
```

#### **User Management**
```http
GET  /api/users/profile            # Get user profile
PUT  /api/users/profile            # Update profile
GET  /api/users/progress           # Get learning progress
POST /api/users/questionnaire      # Submit user questionnaire
```

#### **Content & Resources**
```http
GET  /api/content/youtube          # Get YouTube recommendations
GET  /api/content/courses          # Get course recommendations
GET  /api/content/articles         # Get article recommendations
GET  /api/content/projects         # Get project ideas
```

#### **Analytics & Insights**
```http
GET  /api/analytics/market         # Market analysis data
GET  /api/analytics/salary         # Salary insights
GET  /api/analytics/demand         # Skill demand analytics
GET  /api/analytics/growth         # Career growth projections
```

### 📨 Example API Calls

#### Generate AI Roadmap
```javascript
const response = await fetch('/api/ai/roadmap/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    domain: 'Full Stack Development',
    experience: 'beginner',
    timeframe: '6 months',
    goals: ['Build web applications', 'Learn React', 'Master Node.js']
  })
});
```

#### Chat with AI Mentor
```javascript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    message: 'What should I learn to become a full-stack developer?',
    context: 'career_guidance'
  })
});
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet Security**: HTTP security headers
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### 🌐 Vercel Deployment (Recommended)

#### **Frontend Deployment**
```bash
cd skillgenie
npm run build
vercel --prod
```

#### **Backend Deployment**
```bash
cd backend
vercel --prod
```

#### **Environment Variables Setup**
In your Vercel dashboard, add these environment variables:

**Frontend Variables:**
```env
REACT_APP_API_URL=https://your-backend-domain.vercel.app
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
```

**Backend Variables:**
```env
NODE_ENV=production
GEMINI_API_KEY=your-gemini-api-key-here
YOUTUBE_API_KEY=your-youtube-api-key-here
GOOGLE_SEARCH_API_KEY=your-google-search-api-key-here
JWT_SECRET=your-super-secret-jwt-key-here
```

### 🔧 Alternative Deployment Options

#### **Netlify (Frontend)**
```bash
cd skillgenie
npm run build
# Upload dist folder to Netlify
```

#### **Heroku (Backend)**
```bash
cd backend
heroku create skillgenie-api
git push heroku main
heroku config:set GEMINI_API_KEY=your-key
```

#### **Railway (Full Stack)**
```bash
railway login
railway init
railway up
```

### 📦 Production Checklist
- [ ] All API keys configured
- [ ] CORS settings updated
- [ ] Environment variables set
- [ ] SSL certificates enabled
- [ ] Rate limiting configured
- [ ] Error monitoring setup

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks patterns
- Use TailwindCSS for styling (avoid custom CSS)
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **TailwindCSS** for the utility-first CSS approach
- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons
- **Recharts** for data visualization

## 👥 Team

### **Core Contributors**
- **[Mohit Pandey](https://github.com/mohitpandeycs)** - Lead Developer & AI Integration
- **[Anant Ray](https://github.com/Anant-4-code)** - Frontend Developer & UI/UX Designer

### **Project Lead**
**Mohit Pandey** - Full Stack Developer specializing in AI-powered applications
- 🎓 Experience in React, Node.js, and AI integration
- 🌟 Passionate about democratizing career guidance through technology

## 📞 Support & Contact

### **Get Help**
- 📧 **Email**: [code4mohit@gmail.com](mailto:code4mohit@gmail.com)
- 💬 **GitHub Issues**: [Report bugs or request features](https://github.com/mohitpandeycs/SkillGenie/issues)
- 📖 **Documentation**: Check our detailed setup guides in the repo

### **Connect With Us**
- 🐙 **GitHub**: [@mohitpandeycs](https://github.com/mohitpandeycs)
- 🐙 **GitHub**: [@Anant-4-code](https://github.com/Anant-4-code)
- 💼 **LinkedIn**: Connect for professional discussions

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- ✅ Core UI/UX implementation
- ✅ Authentication system
- ✅ Basic roadmap functionality
- ✅ Quiz system
- ✅ Career opportunities

### Phase 2 (In Progress) 🔄
- ✅ Real AI integration (Google Gemini AI)
- ✅ YouTube content integration
- ✅ Google Search API integration
- 🔄 Advanced analytics dashboard
- 🔄 Real-time progress tracking
- 🔄 Enhanced AI chat capabilities

### Phase 3 (Planned) 📅
- 📅 Mobile app (React Native)
- 📅 Database integration (MongoDB/PostgreSQL)
- 📅 Real-time collaboration features
- 📅 Peer-to-peer mentorship platform
- 📅 Corporate training modules
- 📅 Multi-language support
- 📅 Offline learning capabilities

### Phase 4 (Future Vision) 🚀
- 📅 VR/AR learning experiences
- 📅 Blockchain certification system
- 📅 AI-powered interview preparation
- 📅 Industry partnerships program
- 📅 Global skill marketplace

---

<div align="center">

## 🌟 **Built with ❤️ by the SkillGenie Team**

### *Empowering careers through AI-driven intelligence*

[![GitHub Repo](https://img.shields.io/badge/GitHub-SkillGenie-blue?style=for-the-badge&logo=github)](https://github.com/mohitpandeycs/SkillGenie) 
[![Contributors](https://img.shields.io/badge/Contributors-2-orange?style=for-the-badge)](https://github.com/mohitpandeycs/SkillGenie/graphs/contributors)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)

**[⭐ Star this repo](https://github.com/mohitpandeycs/SkillGenie) • [🐛 Report Bug](https://github.com/mohitpandeycs/SkillGenie/issues) • [💡 Request Feature](https://github.com/mohitpandeycs/SkillGenie/issues/new)**

</div>