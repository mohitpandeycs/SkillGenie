@echo off
echo 🚀 SkillGenie Vercel Deployment Script
echo =====================================

echo.
echo 📋 Prerequisites Check:
echo - Vercel CLI installed? (npm i -g vercel)
echo - Logged into Vercel? (vercel login)
echo - Environment variables ready?
echo.

pause

echo.
echo 🔧 Step 1: Deploying Backend...
echo ==============================
cd backend
echo Current directory: %cd%
vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Backend deployment failed!
    pause
    exit /b 1
)
echo ✅ Backend deployed successfully!

echo.
echo 🎨 Step 2: Deploying Frontend...
echo ===============================
cd ..\skillgenie
echo Current directory: %cd%
vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Frontend deployment failed!
    pause
    exit /b 1
)
echo ✅ Frontend deployed successfully!

echo.
echo 🎉 Deployment Complete!
echo =====================
echo.
echo 📋 Next Steps:
echo 1. Set environment variables in Vercel Dashboard
echo 2. Update REACT_APP_API_URL with your backend URL
echo 3. Update FRONTEND_URL in backend with your frontend URL
echo 4. Test your applications
echo.
echo 📱 Access your apps:
echo - Backend: Check Vercel Dashboard for URL
echo - Frontend: Check Vercel Dashboard for URL
echo.

pause
