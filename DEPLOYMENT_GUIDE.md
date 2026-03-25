# Deployment Guide - Frontend + Backend on Vercel

This guide walks you through deploying your portfolio website and backend API to Vercel.

## Prerequisites

- GitHub account with your code pushed
- Vercel account (vercel.com)
- Firebase project with credentials

## Part 1: Deploy Backend to Vercel

### Step 1: Prepare Backend Repository

If you haven't already, push `cv-backend` to a GitHub repository:

```bash
cd cv-backend
git init
git add .
git commit -m "Initial backend setup"
git remote add origin https://github.com/YOUR_USERNAME/cv-backend.git
git push -u origin main
```

### Step 2: Create Vercel Project for Backend

1. Go to [vercel.com](https://vercel.com) and login
2. Click "Add New Project"
3. Import your `cv-backend` GitHub repository
4. Click "Deploy"

### Step 3: Configure Environment Variables

After import, before the deployment completes:

1. Go to "Environment Variables"
2. Add these variables (from your Firebase service account):

```
FIREBASE_PROJECT_ID = your-project-id
FIREBASE_PRIVATE_KEY = (paste full private key, including newlines)
FIREBASE_CLIENT_EMAIL = your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL = https://your-project.firebaseapp.com
NODE_ENV = production
FRONTEND_URL = https://your-frontend.vercel.app (add after frontend is deployed)
```

**How to get Firebase credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Copy the values from the downloaded JSON

4. Click the Redeploy button to apply environment variables

After deployment, your backend will be available at:
```
https://your-backend-project.vercel.app
```

**Save this URL**, you'll need it for the frontend deployment.

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Configuration

Update `.env.local` in your frontend project:

```env
# Your Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...

# Backend URL (from Step 1 above)
NEXT_PUBLIC_BACKEND_URL=https://your-backend-project.vercel.app
```

### Step 2: Push Frontend to GitHub

```bash
cd cv-main
git add .
git commit -m "Configure backend URL for production"
git push
```

### Step 3: Deploy Frontend

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your `cv-main` GitHub repository
4. Select the root directory as the project root
5. Click "Deploy"

### Step 4: Configure Frontend Environment Variables (Optional)

If your `.env.local` is in `.gitignore` (recommended), you need to add them in Vercel:

1. Go to your frontend project settings in Vercel
2. Click **Environment Variables**
3. Add all `NEXT_PUBLIC_*` variables

## Part 3: Complete Backend Configuration

Now that your frontend is deployed, update the backend's `FRONTEND_URL`:

1. Go to your backend project in Vercel
2. Go to **Settings** → **Environment Variables**
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL = https://your-frontend.vercel.app
   ```
4. Click **Redeploy** to apply the change

## Step 4: Test Connection

1. Visit your frontend at `https://your-frontend.vercel.app`
2. Navigate to the admin dashboard (`/dash-admin`)
3. Try creating a new project with an image
4. Verify:
   - Image uploads to Firebase Storage
   - Project appears in the portfolio
   - All CRUD operations work

## Troubleshooting

### Backend deployment fails

- Check that all environment variables are set correctly
- Verify Firebase service account has database access
- Check Vercel logs: Project → Deployments → Build log

### CORS error when calling backend from frontend

- Ensure `FRONTEND_URL` in backend environment matches deployed frontend URL
- Example: `FRONTEND_URL=https://your-frontend.vercel.app`
- Redeploy backend after updating this variable

### Image uploads fail

- Verify Firebase Storage bucket exists and is initialized
- Check Firebase Storage rules allow writes from the backend
- Verify `FIREBASE_PRIVATE_KEY` in backend `.env` includes newlines (not escaped)

### Frontend environment variables not loading

- Ensure variables start with `NEXT_PUBLIC_` to be visible in browser
- Redeploy frontend after adding environment variables
- Check `.env.local` exists in root directory during local testing

### Application shows outdated data

- Clear browser cache (Ctrl+Shift+Delete)
- Do a hard refresh (Ctrl+Shift+R)
- Check that `NEXT_PUBLIC_BACKEND_URL` points to the correct backend

## Local Development

To test locally before deploying:

### Terminal 1: Backend
```bash
cd cv-backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd cv-main
# Create .env.local with:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
# ... (Firebase config)

npm install
npm run dev
# Frontend runs on http://localhost:3000
```

Visit `http://localhost:3000/dash-admin` to test the full workflow.

## Production Checklist

- [ ] Backend `.env` has all Firebase credentials
- [ ] Backend `.env` has correct `FRONTEND_URL`
- [ ] Frontend `.env.local` has correct `NEXT_PUBLIC_BACKEND_URL`
- [ ] Firebase Firestore & Storage rules are configured
- [ ] Both projects are pushed to GitHub
- [ ] Backend deployed and working at its Vercel URL
- [ ] Frontend deployed with backend URL configured
- [ ] Create/Update/Delete operations work in `/dash-admin`
- [ ] Images display correctly in portfolio

## Additional Resources

- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

If you encounter issues, check:
1. Browser console for frontend errors (F12)
2. Vercel deployment logs for build errors
3. Backend environment variables are correctly set
4. Firebase project is properly initialized with Firestore and Storage
