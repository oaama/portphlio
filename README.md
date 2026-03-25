# CV Portfolio - Next.js + Node.js Full Stack

A modern, full-stack portfolio website built with Next.js, React, TypeScript, Tailwind CSS, and Node.js backend with MongoDB.

## 🚀 Features

- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS
- **Dark Mode**: Fully styled dark theme
- **Admin Dashboard**: Manage projects and uploads with password protection
- **Project Management**: Create, read, update, and delete projects
- **Image Upload**: Upload project images with file validation
- **Responsive Design**: Mobile-first responsive design
- **Type Safe**: Full TypeScript support on both frontend and backend
- **API Protection**: Admin routes protected with JWT authentication

## 📦 Project Structure

```
├── src/                          # Frontend (Next.js)
│   ├── app/                      # Next.js app directory
│   │   ├── page.tsx             # Home page
│   │   ├── admin/               # Admin pages
│   │   ├── login/               # Admin login
│   │   ├── dash-admin/          # Admin dashboard
│   │   └── api/                 # API routes (if needed)
│   ├── components/              # React components
│   │   ├── ui/                  # UI component library
│   │   └── *.tsx               # Page components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities and helpers
│   └── firebase/                # Firebase integration
│
├── cv-backend/                  # Backend (Node.js)
│   ├── src/
│   │   ├── index.ts            # Express server entry
│   │   ├── routes/             # API routes
│   │   │   ├── projects.ts     # Projects endpoints
│   │   │   ├── upload.ts       # File upload endpoints
│   │   │   └── auth.ts         # Authentication endpoints
│   │   ├── models/             # MongoDB schemas
│   │   └── middleware/         # Express middleware
│   ├── uploads/                # Uploaded images directory
│   └── package.json
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Radix UI**: Component primitives
- **React Hook Form**: Form handling
- **Framer Motion**: Animations

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB ODM
- **Multer**: File uploads
- **Bcrypt**: Password hashing
- **CORS**: Cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB local or Atlas URI
- npm or yarn

### Installation

1. **Clone repository**
```bash
git clone <your-repo>
cd cv-main
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd cv-backend
npm install
cd ..
```

4. **Setup environment variables**

Create `.env.local` in the root:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Create `cv-backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cv-portfolio
ADMIN_PASSWORD=your-secure-password-here
FRONTEND_URL=http://localhost:9002
JWT_SECRET=your-jwt-secret-key-here
```

### Running Development

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:9002`

**Terminal 2 - Backend:**
```bash
cd cv-backend
npm run dev
```
Backend runs on `http://localhost:5000`

## 📝 API Documentation

### Authentication

**Login**
```
POST /api/auth/login
Body: { password: string }
Response: { success: boolean, token: string, message: string }
```

**Verify Token**
```
POST /api/auth/verify
Body: { token: string }
Response: { success: boolean, message: string }
```

### Projects

**Get all projects** (public)
```
GET /api/projects
Response: { success: boolean, data: Project[] }
```

**Get single project** (public)
```
GET /api/projects/:id
Response: { success: boolean, data: Project }
```

**Create project** (requires auth)
```
POST /api/projects
Headers: Authorization: Bearer <token>
Body: {
  name: string,
  description: string,
  tech: string[],
  image: string,
  demo?: string,
  github?: string,
  drive?: string
}
Response: { success: boolean, data: Project }
```

**Update project** (requires auth)
```
PUT /api/projects/:id
Headers: Authorization: Bearer <token>
Body: Partial<Project>
Response: { success: boolean, data: Project }
```

**Delete project** (requires auth)
```
DELETE /api/projects/:id
Headers: Authorization: Bearer <token>
Response: { success: boolean, message: string }
```

### Upload

**Upload image** (requires auth)
```
POST /api/upload/file
Headers: Authorization: Bearer <token>
Body: FormData with 'file' field
Response: { success: boolean, imageUrl: string }
```

## 🔒 Admin Dashboard

1. Go to `http://localhost:9002/login`
2. Enter your admin password (from `ADMIN_PASSWORD` env var)
3. Access dashboard at `http://localhost:9002/dash-admin`
4. Manage projects and upload images

## 📦 Building & Deployment

### Frontend
```bash
npm run build
npm run start
```

### Backend
```bash
cd cv-backend
npm run build
npm run start
```

## 🔐 Security Notes

- Store `ADMIN_PASSWORD` and `JWT_SECRET` safely in environment variables
- Never commit `.env.local` or `cv-backend/.env` to git
- Use HTTPS in production
- Implement rate limiting for production
- Validate all file uploads
- Sanitize user input

## 📄 License

ISC

## 👤 Author

Angelo