# Environment Variables Configuration Guide

## Local Development (.env.local)

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Optional: Backend URL (defaults to /api)
# NEXT_PUBLIC_BACKEND_URL=/api
```

## Vercel Deployment (vercel.json or Project Settings)

### Step 1: Get Cloudinary Credentials
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Copy your `Cloud Name` from the top of the dashboard
4. In Settings > Security > API Keys, generate or copy your API Key
5. API Secret is also in Settings > Security

### Step 2: Add Environment Variables to Vercel

In your Vercel project dashboard:

1. Go to Settings → Environment Variables
2. Add these variables:

| Variable | Value | Type |
|----------|-------|------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your cloud name | Public |
| `CLOUDINARY_API_KEY` | Your API key | Secret |
| `CLOUDINARY_API_SECRET` | Your API secret | Secret |

### Step 3: Redeploy

Once environment variables are added:
1. Go to Deployments
2. Click the latest deployment
3. Click "Redeploy" to use the new environment variables

Or trigger a new deployment by pushing to your main branch.

## Database Setup (Optional but Recommended)

For production, replace the in-memory store with a database:

### Using MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
```

### Using Firebase Firestore:
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

### Using Supabase:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
```

## API Endpoints

All endpoints are accessible at `/api/`:

- **GET /api/projects** - Get all projects
- **POST /api/projects** - Create project (requires auth)
- **GET /api/projects/[id]** - Get specific project
- **PUT /api/projects/[id]** - Update project (requires auth)
- **DELETE /api/projects/[id]** - Delete project (requires auth)
- **POST /api/upload** - Upload image to Cloudinary
- **DELETE /api/upload** - Delete image from Cloudinary

## Authentication

For authenticated endpoints, include the Authorization header:

```javascript
Headers: {
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

Tokens can be generated from Firebase Auth or your authentication system.

## Vercel Deployment Checklist

- [ ] Create Vercel account and connect GitHub
- [ ] Create Cloudinary account
- [ ] Add all environment variables to Vercel
- [ ] Run `npm install` to add `cloudinary` package
- [ ] Push to main branch to trigger deployment
- [ ] Test API endpoints in Vercel dashboard
- [ ] Monitor logs for any errors
