# 📋 Project Roadmap & Architecture

## البنية الحالية

```
PORT: 3000 (development)
STACK: Next.js 15 + React 19 + TypeScript
STYLING: Tailwind CSS
DEPLOYMENT: Vercel (Serverless)
IMAGE CDN: Cloudinary
```

---

## مسار المشروع 🛣️

### Phase 1: Infrastructure ✅ (مكتمل)

- ✅ Next.js setup
- ✅ Tailwind CSS configuration
- ✅ TypeScript setup
- ✅ Vercel deployment setup
- ✅ Cloudinary integration
- ✅ Image upload API (`/api/upload`)

### Phase 2: Core Features ✅ (مكتمل)

- ✅ Homepage with hero section
- ✅ Portfolio/Projects showcase
- ✅ Admin login page
- ✅ Image upload component
- ✅ Contact form
- ✅ Firebase authentication setup

### Phase 3: Backend APIs 🔄 (في التطوير)

- ✅ Project management API (`/api/projects`)
  - ✅ GET all projects
  - ✅ GET single project
  - ⏳ POST create project
  - ⏳ PUT update project
  - ⏳ DELETE project

- ✅ Image upload API (`/api/upload`)
  - ✅ POST upload
  - ✅ DELETE image

### Phase 4: Database Integration ⏭️ (قريباً)

- [ ] Choose database (Firebase Firestore / MongoDB / Supabase)
- [ ] Setup authentication
- [ ] Create data models
- [ ] Setup migrations (if needed)

### Phase 5: Advanced Features ⏭️

- [ ] Search functionality
- [ ] Filtering & sorting
- [ ] User profiles
- [ ] Comments/Reviews
- [ ] Analytics

---

## مسار الملفات الرئيسية

### صفحات (Pages)
```
src/app/
├── page.tsx              # الصفحة الرئيسية
├── admin/page.tsx        # لوحة التحكم
├── login/page.tsx        # صفحة تسجيل الدخول
├── privacy/page.tsx      # سياسة الخصوصية
└── terms/page.tsx        # الشروط والأحكام
```

### مكونات (Components)
```
src/components/
├── Navbar.tsx            # شريط التنقل
├── Hero.tsx              # القسم الأول
├── Projects.tsx          # عرض المشاريع
├── ProjectCard.tsx       # بطاقة المشروع
├── ImageUploadInput.tsx  # مدخل رفع الصور
├── AdminLogin.tsx        # نموذج دخول المسؤول
├── About.tsx             # قسم من نحن
├── Contact.tsx           # نموذج الاتصال
├── TechStack.tsx         # عرض التقنيات المستخدمة
└── ui/                   # مكونات UI قابلة لإعادة الاستخدام
```

### الواجهات البرمجية (API)
```
src/app/api/
├── projects/
│   ├── route.ts          # GET /api/projects, POST /api/projects
│   └── [id]/
│       └── route.ts      # GET/PUT/DELETE /api/projects/[id]
└── upload/
    └── route.ts          # POST/DELETE /api/upload
```

### الـ Hooks المخصصة
```
src/hooks/
├── use-image-upload.ts   # إدارة رفع الصور
├── use-projects-api.ts   # إدارة API المشاريع
├── use-toast.ts          # إدارة الإشعارات
└── use-mobile.tsx        # كشف الشاشات المحمولة
```

### Utilities و Libraries
```
src/lib/
├── cloudinary-utils.ts   # الدوال المساعدة لـ Cloudinary
├── utils.ts              # دوال عامة
├── placeholder-images.ts # صور افتراضية
└── project-store.ts      # إدارة حالة المشاريع
```

### Firebase
```
src/firebase/
├── config.ts             # إعدادات Firebase
├── client-provider.tsx   # Firebase provider
├── auth/
│   └── use-user.tsx      # التحقق من المستخدم
└── firestore/
    ├── use-collection.tsx # استرجاع mالمجموعات
    └── use-doc.tsx        # استرجاع الوثائق المفردة
```

---

## تدفق البيانات 📊

### رفع صورة
```
ImageUploadInput
    ↓
useImageUpload hook
    ↓
fetch('/api/upload') - POST
    ↓ (Server)
/api/upload/route.ts
    ↓
Cloudinary API
    ↓ (Response)
{ secure_url, public_id }
    ↓ (Client)
Save in component state
    ↓
Display preview
```

### استرجاع المشاريع
```
Projects Component
    ↓
useProjectsAPI hook
    ↓
fetch('/api/projects') - GET
    ↓ (Server)
/api/projects/route.ts
    ↓
Data store (Firestore/DB)
    ↓ (Response)
[ { project data } ]
    ↓ (Client)
Map over projects
    ↓
Display ProjectCard components
```

---

## المتغيرات البيئية المطلوبة

```env
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Firebase (optional)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx

# Database (future)
# MONGODB_URI=xxx
# SUPABASE_URL=xxx
# SUPABASE_KEY=xxx
```

---

## نسب الأداء المستهدفة 🎯

| المقياس | الهدف | الوضع الحالي |
|--------|------|------------|
| First Contentful Paint (FCP) | < 1.8s | ✅ |
| Largest Contentful Paint (LCP) | < 2.5s | ✅ |
| Cumulative Layout Shift (CLS) | < 0.1 | ✅ |
| Time to Interactive (TTI) | < 3.8s | ✅ |
| Time to First Byte (TTFB) | < 600ms | ✅ |

**تحسينات**:
- ✅ Image optimization via Cloudinary
- ✅ Code splitting
- ✅ Font optimization
- ⏳ Database query optimization
- ⏳ Redis caching (future)

---

## التعامل مع الأخطاء 🛡️

### Server-side
```typescript
// /api/upload
try {
  // process
} catch (error) {
  return NextResponse.json(
    { success: false, error: message },
    { status: 500 }
  );
}
```

### Client-side
```typescript
const { error, upload } = useImageUpload();

if (error) {
  // display error UI
}
```

---

## الأمان 🔐

### الميزات الحالية
- ✅ HTTPS only (Vercel)
- ✅ CORS configured
- ✅ Input validation
- ✅ File type validation
- ✅ File size limits (5MB)

### التحسينات المخطط لها
- [ ] Rate limiting
- [ ] API authentication (JWT)
- [ ] Request signing
- [ ] IP whitelisting

---

## التوسع المستقبلي 🚀

### قصير المدى (1-2 أسابيع)
- [ ] كمال API المشاريع
- [ ] ربط قاعدة بيانات
- [ ] المسح والتحديث

### متوسط المدى (1-3 أشهر)
- [ ] نظام tعليقات المستخدمين
- [ ] البحث والفلترة
- [ ] لوحة تحكم المسؤول الكاملة

### طويل المدى (3+ أشهر)
- [ ] نظام المتابعين
- [ ] إشعارات بالبريد الإلكتروني
- [ ] التحليلات المتقدمة
- [ ] Marketplace للمشاريع

---

## Stack التقنيات المستخدمة

| الطبقة | التقنية |
|--------|---------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS |
| **Components** | Radix UI (shadcn/ui) |
| **State** | React Hooks, Zustand (store) |
| **Forms** | React Hook Form |
| **Validation** | Zod |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **Backend** | Next.js API Routes |
| **Deployment** | Vercel (Serverless) |
| **Images** | Cloudinary CDN |
| **Auth** | Firebase |
| **Database** | Firebase Firestore (or alternative) |

---

## نصائح للمطورين 💡

### Local Development
```bash
# تشغيل مع Fast Refresh
npm run dev

# بناء production
npm run build

# اختبار production local
npm run start

# التحقق من الأخطاء
npm run typecheck
npm run lint
```

### Debugging
```bash
# في المتصفح
F12 → Network → filter by api
     → Console → عرض الأخطاء

# في Vercel
vercel logs src/app/api/upload/route.ts
```

### Best Practices
- استخدم TypeScript لكل الملفات
- أضف JSDoc comments
- اختبر محلياً قبل الـ push
- استخدم descriptive commit messages
- اكتب error handling واضح

---

## الروابط المهمة

- [GitHub Repo](https://github.com/yourname/yourrepo)
- [Live on Vercel](https://yourproject.vercel.app)
- [Cloudinary Dashboard](https://cloudinary.com/console)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Firebase Console](https://console.firebase.google.com)

---

**آخر تحديث**: مارس 2026
**المسؤول**: You
**الحالة**: 📈 في التطوير
