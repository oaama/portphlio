# ⚡ Quick Start - البدء السريع

## 5 دقائق فقط! ⏱️

### الخطوة 1️⃣: التثبيت (1 دقيقة)

```bash
# 1. استخدم المشروع الموجود
cd e:/pro-angelo/test

# 2. ثبّت المكتبات
npm install

# 3. نسخ ملف البيئة
cp .env.local.example .env.local
```

### الخطوة 2️⃣: إعدادات Cloudinary (2 دقيقة)

1. اذهب إلى [cloudinary.com](https://cloudinary.com) → Sign Up
2. من Dashboard → اختر **Settings** > **API Keys**
3. انسخ هذه 3 قيم:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

4. أفتح `.env.local` وأكمل:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### الخطوة 3️⃣: التشغيل (1 دقيقة)

```bash
npm run dev
```

انتقل إلى: http://localhost:3000

### الخطوة 4️⃣: اختبار رفع صورة (1 دقيقة)

- ابحث عن **"Upload Image"** في الصفحة
- اختر صورة من جهازك
- انقر "Choose" → تظهر الصورة ✅

---

## في حالة عدم النجاح 🔧

### المشكلة: صفحة بيضاء / No dev server

```bash
# تحقق من Node.js version
node --version  # يجب أن يكون v18+

# امسح الـ cache وأعد التشغيل
rm -r node_modules .next
npm install
npm run dev
```

### المشكلة: "Cloudinary not configured"

```bash
# تحقق من المتغيرات
echo $NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# تأكد أنك أضفت في .env.local وليس .env
# وريّغل الـ dev server بعد التعديل
```

### المشكلة: الصورة لا تظهر بعد الرفع

```bash
# تحقق من Cloudinary Dashboard:
# 1. اذهب إلى Media Library
# 2. يجب أن ترى صور في "portfolio/projects" folder
```

---

## الأوامر المهمة لاحقاً

```bash
npm run dev         # تشغيل
npm run build       # بناء production
npm run start       # تشغيل production بعد البناء
npm run typecheck   # فحص أخطاء TypeScript
```

---

## الخطوة التالية: Deploy على Vercel 🚀

عندما تكون مستعد:
1. أنشئ حساب Vercel ([vercel.com](https://vercel.com))
2. اقرأ [VERCEL_SETUP.md](./VERCEL_SETUP.md)
3. Deploy في 2 دقيقة!

---

## أسئلة متكررة ❓

**س: كيف أحفظ الصورة في قاعدة البيانات؟**  
ج: الـ URL يرجعها الـ API - احفظ `result.url` و `result.publicId`

**س: كيف أحذف صورة قديمة؟**  
ج: استخدم `deleteImage(publicId)` من hook

**س: الـ API endpoints أين؟**  
ج: في `src/app/api/` - تشتغل automatic على Vercel!

**س: مين يحتاج بيانات اعتماد Cloudinary؟**  
ج: بتاعك انت بس - لا تشاركها مع أحد

---

## الخطوات التالية 📚

بعد النجاح في الـ quick start:

1. اقرأ [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) - تفاصيل Cloudinary
2. اقرأ [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md) - خريطة المشروع
3. اقرأ [SERVERLESS_API_README.md](./SERVERLESS_API_README.md) - توثيق API

---

## احتياج مساعدة؟ 🆘

اطّلع على:
- 📖 [Documentation](./docs/)
- 💻 [GitHub Issues](https://github.com) (إن وُجِد)
- 🔗 [Cloudinary Support](https://support.cloudinary.com)

---

**عاش!** ✨ المشروع الآن جاهز!
