# 🚀 Vercel Deployment Instructions

## Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`

## Backend Deployment

### Step 1: Deploy Backend
```bash
cd "f:\Ongoing projects\SkillGuieni\backend"
vercel
```

**Follow these prompts:**
- Set up and deploy: `Y`
- Which scope: Select your account
- Link to existing project: `N`
- Project name: `skillgenie-backend`
- Directory: `.` (press Enter)
- Override settings: `N`

### Step 2: Add Environment Variables to Backend
```bash
vercel env add GEMINI_API_KEY
```
Enter: `your-gemini-api-key-here`

```bash
vercel env add NODE_ENV
```
Enter: `production`

```bash
vercel env add JWT_SECRET
```
Enter: `your-super-secret-jwt-key-here-make-it-long-and-random`

### Step 3: Deploy to Production
```bash
vercel --prod
```

**Copy the backend URL** (e.g., `https://skillgenie-backend.vercel.app`)

---

## Frontend Deployment

### Step 1: Add Backend URL to Frontend Environment
```bash
cd "f:\Ongoing projects\SkillGuieni\skillgenie"
vercel env add REACT_APP_API_URL
```
Enter the backend URL from above (e.g., `https://skillgenie-backend.vercel.app`)

### Step 2: Deploy Frontend
```bash
vercel
```

**Follow these prompts:**
- Set up and deploy: `Y`
- Which scope: Select your account
- Link to existing project: `N`
- Project name: `skillgenie-frontend`
- Directory: `.` (press Enter)
- Override settings: `N`

### Step 3: Deploy to Production
```bash
vercel --prod
```

---

## Final Steps

### 1. Update CORS in Backend (if needed)
If your frontend URL is different, update the CORS settings in `backend/server.js`:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://your-actual-frontend-url.vercel.app']
  : ['http://localhost:3000', 'http://127.0.0.1:3000'],
```

### 2. Redeploy Backend with Updated CORS
```bash
cd "f:\Ongoing projects\SkillGuieni\backend"
vercel --prod
```

### 3. Test Your Deployed Application
- Frontend: Visit your frontend Vercel URL
- Test the chat functionality
- Check browser console for any errors

---

## Environment Variables Summary

### Backend Environment Variables:
- `GEMINI_API_KEY`: `your-gemini-api-key-here`
- `NODE_ENV`: `production`
- `JWT_SECRET`: `your-super-secret-jwt-key-here-make-it-long-and-random`

### Frontend Environment Variables:
- `REACT_APP_API_URL`: Your backend Vercel URL

---

## Troubleshooting

### Common Issues:
1. **CORS Error**: Make sure frontend URL is added to CORS in backend
2. **API Not Found**: Check that `REACT_APP_API_URL` is set correctly
3. **Build Errors**: Make sure all dependencies are in package.json

### Useful Commands:
- Check deployment logs: `vercel logs`
- List deployments: `vercel ls`
- Remove deployment: `vercel rm [deployment-url]`

---

## Quick Deploy Commands (Run these in order):

```bash
# 1. Deploy Backend
cd "f:\Ongoing projects\SkillGuieni\backend"
vercel --prod

# 2. Deploy Frontend (after setting REACT_APP_API_URL)
cd "f:\Ongoing projects\SkillGuieni\skillgenie"
vercel --prod
```

Your SkillGenie app will be live! 🎉
