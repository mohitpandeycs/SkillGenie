# 🧞‍♂️ SkillGenie: AI-Powered Career & Skills Advisor

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.2.7-blue.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SkillGenie is an AI-driven career intelligence platform that designs adaptive learning roadmaps aligned with individual interests and industry demand. It recommends skills, careers, and curated resources while providing market analytics and 5-8 year growth projections for informed career decisions.

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
   git clone https://github.com/your-username/skillgenie.git
   cd skillgenie
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
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
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
- **Google Gemini AI**: Integrated for intelligent chat responses and career guidance
- **LangChain**: AI workflow orchestration
- **OpenAI API**: Additional AI capabilities (backup)
- **BigQuery ML**: Advanced analytics and predictions (planned)

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

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/github` - GitHub OAuth
- `POST /api/auth/verify` - Token verification

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/progress` - Get learning progress
- `GET /api/users/achievements` - Get user achievements

### Roadmaps
- `GET /api/roadmaps` - Get user roadmaps
- `POST /api/roadmaps/generate` - Generate new roadmap
- `GET /api/roadmaps/:id` - Get specific roadmap
- `PUT /api/roadmaps/:id/progress` - Update progress

### Chat System
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/conversations` - Get chat history
- `GET /api/chat/suggestions` - Get suggested questions

### Quizzes
- `GET /api/quizzes/chapter/:id` - Get chapter quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/history` - Get quiz history
- `GET /api/quizzes/leaderboard` - Get leaderboard

### Career Services
- `GET /api/careers/jobs` - Get job opportunities
- `GET /api/careers/freelance` - Get freelance gigs
- `GET /api/careers/internships` - Get internships
- `GET /api/careers/events` - Get events
- `POST /api/careers/apply` - Apply for opportunity

### Analytics
- `GET /api/analytics/market` - Market analysis
- `GET /api/analytics/user-progress` - Progress analytics
- `GET /api/analytics/skill-demand` - Skill demand data
- `GET /api/analytics/learning-insights` - AI insights

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet Security**: HTTP security headers
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Frontend (React)
```bash
# Build for production
npm run build

# Deploy to Netlify, Vercel, or Firebase Hosting
```

### Backend (Node.js)
```bash
# Set production environment
export NODE_ENV=production

# Start production server
npm start

# Deploy to Heroku, Railway, or Google Cloud Run
```

### Environment Variables
```env
# Backend Configuration
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secret-key
MONGODB_URI=your-database-url

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key

# AI Services
OPENAI_API_KEY=your-openai-key
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project
```

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

## 📞 Support

For support and questions:
- 📧 Email: support@skillgenie.app
- 💬 Discord: [SkillGenie Community](https://discord.gg/skillgenie)
- 📖 Documentation: [docs.skillgenie.app](https://docs.skillgenie.app)

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- ✅ Core UI/UX implementation
- ✅ Authentication system
- ✅ Basic roadmap functionality
- ✅ Quiz system
- ✅ Career opportunities

### Phase 2 (Next)
- ✅ Real AI integration (Google Gemini AI)
- 🔄 Database integration (MongoDB/PostgreSQL)
- 🔄 Real-time chat system
- 🔄 Advanced analytics dashboard

### Phase 3 (Future)
- 📅 Mobile app (React Native)
- 📅 Offline learning capabilities
- 📅 Peer-to-peer mentorship
- 📅 Corporate training modules
- 📅 Multi-language support

---

<div align="center">

**Built with ❤️ by the SkillGenie Team**

[Website](https://skillgenie.app) • [Documentation](https://docs.skillgenie.app) • [Community](https://discord.gg/skillgenie)

</div>
#   S k i l l G e n i e  
 