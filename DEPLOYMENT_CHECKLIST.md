# 🚀 Serverless Deployment Checklist

## المرحلة 1: التطوير المحلي ✅

- [ ] Clone المشروع
- [ ] `npm install` - تثبيت المكتبات
- [ ] نسخ `.env.local.example` إلى `.env.local`
- [ ] ملء بيانات Cloudinary في `.env.local`
- [ ] تشغيل `npm run dev`
- [ ] اختبار رفع صورة من الواجهة
- [ ] التحقق من ظهور الصورة في Cloudinary

## المرحلة 2: إعداد Cloudinary ☁️

### على Cloudinary:
- [ ] إنشاء حساب Cloudinary ([cloudinary.com](https://cloudinary.com))
- [ ] الحصول على Cloud Name من Dashboard
- [ ] الذهاب إلى Settings > API Keys
- [ ] نسخ API Key و API Secret
- [ ] **لا تشاركها مع أحد!** 🔒

### في المشروع المحلي:
- [ ] ملء `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- [ ] ملء `CLOUDINARY_API_KEY`
- [ ] ملء `CLOUDINARY_API_SECRET`
- [ ] اختبار الرفع `npm run dev`

## المرحلة 3: بناء التطبيق 🏗️

- [ ] `npm run build` - بناء الـ production build
- [ ] `npm run typecheck` - التحقق من types (optional)
- [ ] التحقق من عدم وجود أخطاء في الـ build output

## المرحلة 4: إعداد Vercel 🌐

### على Vercel:
- [ ] إنشاء حساب Vercel ([vercel.com](https://vercel.com))
- [ ] ربط GitHub/GitLab account
- [ ] إنشاء project جديد وربطه بـ repository

### في Vercel Dashboard:
- [ ] الذهاب إلى Project Settings
- [ ] Environment Variables
- [ ] إضافة المتغيرات:
  - [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (Public)
  - [ ] `CLOUDINARY_API_KEY` (Sensitive)
  - [ ] `CLOUDINARY_API_SECRET` (Sensitive)
- [ ] Save المتغيرات

## المرحلة 5: Deployment 🚀

### الخيار A: من GitHub (الموصى به)
- [ ] `git add .`
- [ ] `git commit -m "chore: add serverless backend"`
- [ ] `git push origin main`
- [ ] انتظر Vercel يقوم بـ auto-deploy
- [ ] تحقق من Deployment في Vercel Dashboard

### الخيار B: من CLI (يدوي)
- [ ] `npm install -g vercel`
- [ ] `vercel`
- [ ] اختر project name
- [ ] اختر Environment variables
- [ ] Confirm الـ deployment

## المرحلة 6: التحقق من الـ Deployment ✔️

- [ ] افتح الـ URL من Vercel
- [ ] اختبر رفع صورة من الواجهة
- [ ] تحقق من الصورة في Cloudinary Dashboard
- [ ] تحقق من Vercel Logs - لا توجد أخطاء
- [ ] اختبر API endpoints:
  ```bash
  curl https://your-project.vercel.app/api/projects
  ```

## المرحلة 7: Monitoring 👀

### يومياً:
- [ ] تحقق من Vercel analytics
- [ ] تحقق من أي errors في logs

### أسبوعياً:
- [ ] راجع Cloudinary usage
- [ ] تحقق من Storage usage

### شهرياً:
- [ ] حدّث dependencies: `npm update`
- [ ] راجع الأداء
- [ ] احذف الصور غير المستخدمة

## الأوامر المهمة

```bash
# التطوير
npm run dev              # تشغيل development server

# البناء والاختبار
npm run build           # بناء production build
npm run start           # تشغيل production build local
npm run lint            # تشغيل linter
npm run typecheck       # التحقق من TypeScript types

# Vercel
vercel                  # deploy
vercel logs            # عرض الـ logs
vercel deployments     # عرض جميع الـ deployments
vercel rollback        # rollback إلى deployment سابق
```

## في حالة المشاكل

### الصورة لا ترفع
```bash
# 1. تأكد من المتغيرات
echo $NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY

# 2. اختبر الـ build محلياً
npm run build

# 3. شغّل الـ production build
npm run start
```

### خطأ على Vercel
```bash
# عرض الـ logs
vercel logs

# قد تكون المشكلة:
# - متغيرات البيئة لم تُعدّل بعد الـ push
# - build error - تحقق من `npm run build`
# - memory overflow - قلّل حجم الملفات
```

### صورة لا تظهر بعد الرفع
```
# تأكد أن:
1. الـ public_id صحيح
2. الـ URL من Cloudinary يعمل مباشرة
3. res.cloudinary.com مضاف في next.config.ts
```

## ملفات مهمة

| الملف | الوصف |
|------|--------|
| `vercel.json` | إعدادات Vercel |
| `.env.local` | متغيرات البيئة المحلية |
| `next.config.ts` | إعدادات Next.js |
| `src/app/api/upload/route.ts` | API endpoint |
| `src/lib/cloudinary-utils.ts` | Cloudinary utilities |

## الدعم والمراجع

📖 **التوثيق**:
- [Vercel Docs](https://vercel.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Next.js Docs](https://nextjs.org/docs)

💬 **المساعدة**:
- راجع `CLOUDINARY_SETUP.md`
- راجع `VERCEL_SETUP.md`
- تحقق من الـ logs

---

**آخر تحديث**: مارس 2026
**الحالة**: ✅ جاهز للإنتاج
