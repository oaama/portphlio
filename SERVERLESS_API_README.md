# Serverless Backend API Documentation

## Overview

This is a Next.js serverless backend deployed on Vercel with Cloudinary integration for image uploads. All API endpoints are serverless functions.

## Architecture

```
┌─────────────────────────────────────────────────┐
│         Vercel (Deployment)                     │
│  ┌─────────────────────────────────────────┐   │
│  │   Next.js App with API Routes           │   │
│  │  (Serverless Functions)                 │   │
│  │                                         │   │
│  │  /api/projects        (GET/POST)       │   │
│  │  /api/projects/[id]   (GET/PUT/DELETE) │   │
│  │  /api/upload          (POST/DELETE)    │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
          │                              │
          └──────────────┬───────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
   ┌────▼─────┐                   ┌──────▼───────┐
   │ Cloudinary│                  │  Your Data   │
   │  CDN      │                  │   Storage    │
   │(Images)   │                  │ (DB/Firebase)│
   └───────────┘                  └──────────────┘
```

## API Endpoints

### Projects Management

#### GET /api/projects
Get all projects (public endpoint, no authentication required)

```bash
curl https://your-app.vercel.app/api/projects
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "project-1",
      "name": "Project Name",
      "description": "Project description",
      "tech": ["Next.js", "React"],
      "image": "https://res.cloudinary.com/...",
      "demo": "https://example.com",
      "github": "https://github.com/...",
      "createdAt": "2024-03-24T10:00:00Z",
      "updatedAt": "2024-03-24T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### POST /api/projects
Create a new project (requires authentication)

```bash
curl -X POST https://your-app.vercel.app/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Project",
    "description": "Project description",
    "tech": ["Next.js", "TypeScript"],
    "image": "https://res.cloudinary.com/...",
    "demo": "https://example.com",
    "github": "https://github.com/..."
  }'
```

#### GET /api/projects/[id]
Get a specific project by ID

```bash
curl https://your-app.vercel.app/api/projects/project-1
```

#### PUT /api/projects/[id]
Update a project (requires authentication)

```bash
curl -X PUT https://your-app.vercel.app/api/projects/project-1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project",
    "description": "Updated description"
  }'
```

#### DELETE /api/projects/[id]
Delete a project (requires authentication)

```bash
curl -X DELETE https://your-app.vercel.app/api/projects/project-1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Image Upload

#### POST /api/upload
Upload an image to Cloudinary

```bash
curl -X POST https://your-app.vercel.app/api/upload \
  -F "file=@/path/to/image.jpg"
```

Response:
```json
{
  "success": true,
  "data": {
    "secure_url": "https://res.cloudinary.com/...",
    "public_id": "portfolio/projects/xyz123",
    "width": 1920,
    "height": 1080,
    "size": 245000
  }
}
```

#### DELETE /api/upload
Delete an image from Cloudinary

```bash
curl -X DELETE "https://your-app.vercel.app/api/upload?publicId=portfolio/projects/xyz123"
```

## Client-Side Usage

### Using the Hooks

```tsx
// Upload image
import { useImageUpload } from '@/hooks/use-image-upload';

export function MyComponent() {
  const { uploading, error, upload } = useImageUpload();

  const handleUpload = async (file: File) => {
    const result = await upload(file);
    
    if (result) {
      console.log('Image uploaded:', result.url);
    }
  };

  return (
    <input 
      type="file" 
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
      }}
    />
  );
}
```

```tsx
// Fetch and manage projects
import { useProjectsAPI } from '@/hooks/use-projects-api';

export function ProjectsList() {
  const { getProjects, loading } = useProjectsAPI();

  useEffect(() => {
    getProjects().then(data => {
      console.log('Projects:', data);
    });
  }, []);

  // ... rest of component
}
```

## Environment Variables

Required variables for Vercel deployment:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Local Development

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update with your Cloudinary credentials:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Install dependencies:
```bash
npm install
```

4. Run development server:
```bash
npm run dev
```

5. Test API endpoints at `http://localhost:3000/api/`

## Deployment to Vercel

### Method 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables when prompted
```

### Method 2: GitHub/GitLab Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Create new project and connect your repository
4. Add environment variables in project settings
5. Deploy automatically on push

## Database Integration (Optional)

### Replace In-Memory Store with Database

Current implementation uses in-memory storage. For production, integrate a database:

#### MongoDB Atlas Option:
```typescript
// Update src/app/api/projects/route.ts
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('portfolio');
const projects = db.collection('projects');
```

#### Firebase Firestore Option:
```typescript
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!))
});

const db = getFirestore(app);
```

#### Supabase Option:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
```

## Performance Optimization

### Image Optimization with Cloudinary

In your components, use the Cloudinary URL builder for optimized images:

```tsx
import { getCloudinaryUrl } from '@/lib/cloudinary-utils';

export function ProjectImage({ publicId }: { publicId: string }) {
  const imageUrl = getCloudinaryUrl(publicId, {
    width: 400,
    height: 300,
    quality: 'auto',
    format: 'webp'
  });

  return <Image src={imageUrl} alt="Project" width={400} height={300} />;
}
```

## Monitoring & Logs

Access logs in Vercel dashboard:
1. Go to your project
2. Click "Deployments"
3. Select deployment → "Logs"
4. View real-time logs or stream logs

## Troubleshooting

### Images not uploading
- Check Cloudinary credentials in Vercel environment variables
- Verify file size is less than 5MB
- Ensure file type is supported (JPEG, PNG, GIF, WebP)

### API returning 401 Unauthorized
- Check Authorization header format: `Bearer YOUR_TOKEN`
- Verify token is valid
- For development, any token is accepted

### Build fails on Vercel
- Check build logs for TypeScript errors
- Ensure all dependencies are in package.json
- Try rebuilding with `npm run build` locally

## Security Best Practices

1. **Authentication**: Implement proper token validation
2. **CORS**: Configure allowed origins
3. **Rate Limiting**: Add rate limiting for upload endpoint
4. **File Validation**: Validate file type and size
5. **Secrets**: Never commit `.env.local` to Git

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
