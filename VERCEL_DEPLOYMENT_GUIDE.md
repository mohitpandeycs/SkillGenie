# 🚀 Vercel Deployment Guide for SkillGenie

This guide will help you deploy both the backend and frontend of SkillGenie to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Environment Variables**: Have your API keys ready
4. **Git Repository**: Code should be pushed to GitHub/GitLab

## 🔧 Step 1: Deploy Backend

### 1.1 Navigate to Backend Directory
```bash
cd backend
```

### 1.2 Login to Vercel
```bash
vercel login
```

### 1.3 Deploy Backend
```bash
vercel --prod
```

### 1.4 Set Environment Variables
In Vercel Dashboard for your backend project, add these environment variables:

**Required Variables:**
- `NODE_ENV` = `production`
- `GEMINI_API_KEY` = `your_gemini_api_key`
- `YOUTUBE_API_KEY` = `your_youtube_api_key`
- `JWT_SECRET` = `your_secure_jwt_secret`
- `FRONTEND_URL` = `https://your-frontend.vercel.app`

**Firebase Variables:**
- `FIREBASE_PROJECT_ID` = `your_project_id`
- `FIREBASE_DATABASE_URL` = `your_database_url`

**Optional Variables:**
- `OPENAI_API_KEY` = `your_openai_key`
- `RATE_LIMIT_WINDOW` = `15`
- `RATE_LIMIT_MAX_REQUESTS` = `100`

### 1.5 Note Your Backend URL
After deployment, note your backend URL (e.g., `https://skillgenie-backend.vercel.app`)

## 🎨 Step 2: Deploy Frontend

### 2.1 Navigate to Frontend Directory
```bash
cd ../skillgenie
```

### 2.2 Update API Configuration
Set environment variable in Vercel Dashboard:
- `REACT_APP_API_URL` = `https://your-backend.vercel.app`

### 2.3 Deploy Frontend
```bash
vercel --prod
```

### 2.4 Set Frontend Environment Variables
In Vercel Dashboard for your frontend project, add:

**Required Variables:**
- `REACT_APP_API_URL` = `https://your-backend.vercel.app`
- `REACT_APP_APP_NAME` = `SkillGenie`
- `REACT_APP_VERSION` = `1.0.0`
- `REACT_APP_ENVIRONMENT` = `production`

**Firebase Variables (if using):**
- `REACT_APP_FIREBASE_API_KEY` = `your_api_key`
- `REACT_APP_FIREBASE_AUTH_DOMAIN` = `your-project.firebaseapp.com`
- `REACT_APP_FIREBASE_PROJECT_ID` = `your_project_id`

## 🔄 Step 3: Update CORS

### 3.1 Update Backend CORS
After frontend deployment, update the `FRONTEND_URL` environment variable in your backend with the actual frontend URL.

### 3.2 Redeploy Backend
```bash
cd ../backend
vercel --prod
```

## 🧪 Step 4: Test Deployment

### 4.1 Test Backend Endpoints
```bash
curl https://your-backend.vercel.app/api/health
```

### 4.2 Test Frontend
Visit `https://your-frontend.vercel.app` and test:
- Dashboard loading
- API connections
- Chat functionality
- Roadmap generation

## 📋 Step 5: Domain Configuration (Optional)

### 5.1 Custom Domains
In Vercel Dashboard:
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 5.2 Update Environment Variables
If using custom domains, update:
- `FRONTEND_URL` in backend
- `REACT_APP_API_URL` in frontend

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is correctly set in backend
   - Check that both deployments are using HTTPS

2. **API Not Found**
   - Verify `REACT_APP_API_URL` in frontend environment variables
   - Ensure backend API routes are working

3. **Build Failures**
   - Check build logs in Vercel Dashboard
   - Ensure all dependencies are in `package.json`
   - Verify environment variables are set

4. **Function Timeout**
   - Backend functions have 30-second timeout (configured in vercel.json)
   - For longer operations, consider background jobs

### Vercel CLI Commands:
```bash
vercel --help                 # Show help
vercel list                   # List deployments
vercel logs <deployment-url>  # View logs
vercel env ls                 # List environment variables
vercel env add <name>         # Add environment variable
```

## 🎯 Quick Deployment Commands

### One-Command Deployment:
```bash
# Deploy both backend and frontend
cd backend && vercel --prod && cd ../skillgenie && vercel --prod
```

### Environment Variables Setup:
Use the Vercel Dashboard or CLI:
```bash
vercel env add GEMINI_API_KEY
vercel env add REACT_APP_API_URL
```

## 📱 Mobile Testing

After deployment, test on mobile devices:
- Responsive design
- API performance
- Touch interactions
- Progressive Web App features

## 🚀 Production Checklist

- [ ] Backend deployed and responding
- [ ] Frontend deployed and loading
- [ ] Environment variables configured
- [ ] CORS properly configured  
- [ ] API endpoints working
- [ ] Database connections established
- [ ] Error monitoring setup
- [ ] Performance testing completed
- [ ] Mobile responsiveness verified
- [ ] Analytics configured (if applicable)

## 📞 Support

If you encounter issues:
1. Check Vercel documentation
2. Review deployment logs
3. Test API endpoints individually
4. Verify environment variables

Your SkillGenie application should now be live on Vercel! 🎉
