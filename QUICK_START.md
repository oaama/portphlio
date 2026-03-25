# 🚀 Quick Start Guide - Serverless Backend على Vercel

## خطوات التثبيت والنشر السريعة

### 1️⃣ التثبيت المحلي (Local Setup)

```bash
# تثبيت الحزم المطلوبة
npm install

# إنشاء ملف البيئة المحلي
cp .env.example .env.local
```

### 2️⃣ إعداد Cloudinary

1. اذهب إلى [cloudinary.com](https://cloudinary.com)
2. أنشئ حساب مجاني
3. انسخ بيانات الاعتماد من Dashboard:
   - **Cloud Name**: موجود في أعلى الصفحة
   - **API Key**: من Settings → Security → API Keys
   - **API Secret**: من نفس المكان

### 3️⃣ ربط البيانات المحلية

افتح `.env.local` وأضف:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4️⃣ تشغيل محلي

```bash
npm run dev
```

اختبر على: `http://localhost:3000/api/projects`

### 5️⃣ نشر على Vercel

#### الخيار A: من خلال CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel
# ستطلب عليك إدخال بيانات البيئة
```

#### الخيار B: من خلال GitHub

1. ادفع الكود إلى GitHub
2. اذهب إلى [vercel.com](https://vercel.com)
3. اختر "New Project"
4. ربط repository الخاص بك
5. في Environment Variables أضف:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = your-cloud-name
   CLOUDINARY_API_KEY = your-api-key
   CLOUDINARY_API_SECRET = your-api-secret
   ```
6. اضغط "Deploy"

## 📝 استخدام API

### تحميل صورة

```javascript
import { useImageUpload } from '@/hooks/use-image-upload';

export function MyComponent() {
  const { uploading, upload } = useImageUpload();

  const handleUpload = async (file: File) => {
    const result = await upload(file);
    if (result) {
      console.log('رابط الصورة:', result.url);
    }
  };

  return (
    <input 
      type="file" 
      onChange={(e) => handleUpload(e.target.files[0])} 
    />
  );
}
```

### استخدام مكون تحميل الصور الجاهز

```jsx
import { ImageUploadInput } from '@/components/ImageUploadInput';

export function MyForm() {
  return (
    <ImageUploadInput 
      onImageUpload={(url, id) => {
        console.log('تم التحميل:', url);
      }}
    />
  );
}
```

### الحصول على جميع المشاريع

```javascript
const response = await fetch('/api/projects');
const { data } = await response.json();
console.log(data);
```

### إنشاء مشروع جديد

```javascript
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    name: 'مشروعي',
    description: 'وصف المشروع',
    tech: ['Next.js', 'React'],
    image: 'https://res.cloudinary.com/...',
    demo: 'https://example.com'
  })
});
```

## 🌐 روابط مهمة

- **Dashboard المشروع**: `https://your-app.vercel.app`
- **API Base**: `https://your-app.vercel.app/api`
- **Cloudinary Dashboard**: `https://cloudinary.com/console`
- **Vercel Dashboard**: `https://vercel.com/dashboard`

## ✅ قائمة التحقق

- [ ] تثبيت Cloudinary
- [ ] نسخ بيانات Cloudinary المحلية
- [ ] تشغيل الخادم محليًا وتجربته
- [ ] إنشاء حساب على Vercel
- [ ] ربط GitHub
- [ ] إضافة متغيرات البيئة
- [ ] نشر المشروع
- [ ] اختبار API على الإنتاج

## 🐛 حل المشاكل الشائعة

### الصور لا تُحمّل
- تحقق من بيانات Cloudinary
- تأكد من أن حجم الملف < 5MB
- تحقق من صيغة الملف

### خطأ 401 Unauthorized
- أضف Authorization header بشكل صحيح
- تحقق من صلاحية Token

### Build يفشل على Vercel
- تحقق من السجلات (Logs)
- جرب `npm run build` محليًا أولاً
- تأكد من `node_modules` مثبتة

## 📚 مراجع إضافية

- [Vercel Docs](https://vercel.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## ✨ الميزات المتاحة

✅ تحميل الصور بسهولة على Cloudinary  
✅ API بدون خادم (Serverless)  
✅ توزيع CDN للصور  
✅ تحسين الأداء التلقائي  
✅ نشر فوري على Vercel  
✅ مكونات React جاهزة  

---

**احتاج مساعدة؟** اطلع على `SERVERLESS_API_README.md` للتفاصيل الكاملة.
