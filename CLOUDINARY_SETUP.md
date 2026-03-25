# إعداد Cloudinary للمشروع 🎯

## الخطوة 1: إنشاء حساب Cloudinary

1. اذهب إلى [cloudinary.com](https://cloudinary.com)
2. اضغط على **Sign Up** وأكمل التسجيل
3. ستحصل على **Cloud Name** تلقائياً

## الخطوة 2: الحصول على API Keys

1. من لوحة التحكم، اذهب إلى **Settings** > **API Keys**
2. ستجد:
   - **Cloud Name** (اسم السحابة العام)
   - **API Key** (المفتاح العام)
   - **API Secret** (السري - لا تشاركه)

## الخطوة 3: إضافة المتغيرات إلى المشروع

### محلياً (Local Development):

1. انسخ ملف البيئة:
```bash
cp .env.local.example .env.local
```

2. أكمل البيانات:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### على Vercel (Production):

1. اذهب إلى مشروعك على Vercel
2. **Settings** > **Environment Variables**
3. أضف المتغيرات الثلاثة:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

⚠️ **ملاحظة**: كل متغير يبدأ بـ `NEXT_PUBLIC_` سيكون متاحاً في الklient، لكن السر `API_SECRET` يجب أن يبقى على السرفر فقط.

## الخطوة 4: اختبار التوصيل

```bash
npm run dev
```

جرب رفع صورة من الواجهة. إذا رأيت الصورة تظهر بنجاح = ✅ كل شيء يعمل!

## مشاكل شائعة وحلولها

### المشكلة: "Cloudinary not configured"
**الحل**: تأكد من وجود المتغيرات في `.env.local` أو في Vercel settings

### المشكلة: "Invalid API credentials"
**الحل**: نسخ/لصق API Key و Secret بشكل صحيح من Cloudinary Dashboard

### المشكلة: الصورة توافقية بعد الرفع
**الحل**: تحقق من أن `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` مطابقة تماماً (حالة أحرف مهمة)

## البنية الحالية في المشروع

```
src/
├── app/api/upload/             # API Endpoint لرفع الصور
│   └── route.ts                # POST/DELETE endpoint
├── hooks/
│   └── use-image-upload.ts     # Hook للتعامل مع الرفع
├── lib/
│   └── cloudinary-utils.ts     # Utility functions
└── components/
    └── ImageUploadInput.tsx    # مكون الرفع
```

## الميزات الحالية

✅ رفع الصور إلى Cloudinary  
✅ حذف الصور  
✅ تحسين الصور تلقائياً  
✅ Control في صيغ الصور (WebP, etc)  
✅ معالجة الأخطاء والتحقق من الحجم  
✅ معاينة الصور قبل الرفع  

## التوثيق الكامل للـ API

### POST /api/upload
رفع صورة جديدة

**Request:**
```
Content-Type: multipart/form-data
Body: { file: File }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "secure_url": "https://res.cloudinary.com/...",
    "public_id": "portfolio/projects/xxx",
    "width": 1920,
    "height": 1080,
    "size": 150000
  }
}
```

### DELETE /api/upload?publicId=xxx
حذف صورة

**Response:**
```json
{
  "success": true,
  "data": { "result": "ok" }
}
```

## نصائح إضافية

🎨 **التحكم بالصور**: استخدم `getCloudinaryUrl()` لتطبيق تحويلات
```typescript
getCloudinaryUrl('portfolio/projects/abc123', {
  width: 400,
  height: 300,
  quality: 'auto',
  format: 'webp'
})
```

📁 **تنظيم الصور**: كل الصور ترفع إلى `portfolio/projects/` folder

⚡ **الأداء**: كل الصور تمر على:
- Auto quality
- Auto format (WebP للمتصفحات الحديثة)
- Compression

---

**هل تحتاج مساعدة؟** ✨
