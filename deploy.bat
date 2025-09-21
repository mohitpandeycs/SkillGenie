@echo off
echo 🚀 SkillGenie Vercel Deployment Script
echo =====================================

echo.
echo 📦 Step 1: Installing Vercel CLI (if not installed)
npm list -g vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
) else (
    echo Vercel CLI already installed ✅
)

echo.
echo 🔐 Step 2: Please login to Vercel if not already logged in
echo Run: vercel login
pause

echo.
echo 🖥️  Step 3: Deploying Backend...
cd "backend"
echo Current directory: %cd%
echo Deploying backend to Vercel...
vercel --prod

echo.
echo Please copy the backend URL from above and press any key to continue...
pause

echo.
echo 🌐 Step 4: Deploying Frontend...
cd "..\skillgenie"
echo Current directory: %cd%
echo Deploying frontend to Vercel...
vercel --prod

echo.
echo 🎉 Deployment Complete!
echo =====================
echo.
echo Next steps:
echo 1. Set environment variables in Vercel dashboard
echo 2. Update CORS settings if needed
echo 3. Test your deployed application
echo.
echo Backend Environment Variables to set:
echo - GEMINI_API_KEY: your-gemini-api-key-here
echo - NODE_ENV: production
echo - JWT_SECRET: [generate a secure secret]
echo.
echo Frontend Environment Variables to set:
echo - REACT_APP_API_URL: [your backend URL]
echo.
pause
