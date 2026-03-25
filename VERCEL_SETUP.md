# Vercel Deployment Guide 🚀

## الخطوة 1: التجهيز

### تثبيت Vercel CLI
```bash
npm install -g vercel
```

### تسجيل الدخول
```bash
vercel login
```

---

## الخطوة 2: إعداد المشروع

### أ. إعداد Cloudinary على Vercel

1. اذهب إلى كونسول جيت هاب الخاص بك: [Vercel](https://vercel.com)
2. اختر مشروعك
3. اضغط على **Settings** > **Environment Variables**
4. أضف هذه المتغيرات:

| Variable | Value | Type |
|----------|-------|------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | Public |
| `CLOUDINARY_API_KEY` | `your_api_key` | Sensitive |
| `CLOUDINARY_API_SECRET` | `your_api_secret` | Sensitive |

**ملاحظة**: اختر `Sensitive` للـ API Secret!

### ب. التحقق من الإعدادات

```bash
# تأكد من أن vercel.json موجود
cat vercel.json

# يجب أن يحتوي على:
# {
#   "buildCommand": "npm run build",
#   "devCommand": "npm run dev",
#   "outputDirectory": ".next",
#   "env": { ... }
# }
```

---

## الخطوة 3: Build و Deploy

### محلياً (Local):
```bash
# بناء
npm run build

# اختبار Build
npm run start
```

### على Vercel:
```bash
# Deploy من الـ CLI
vercel

# أو قم بـ Push على GitHub - Vercel سيترصد هذا
git push origin main
```

---

## الخطوة 4: التحقق

بعد الـ Deploy:

### ✅ تحقق من Function
```bash
vercel deployments
# اختر الـ deployment الحديث وتحقق من الـ functions
```

### ✅ اختبر API
```bash
# مثلاً: https://your-project.vercel.app/api/upload
curl -X POST https://your-project.vercel.app/api/upload \
  -F "file=@test.jpg"
```

### ✅ اختبر من الواجهة
- ادخل على موقعك
- جرب رفع صورة
- تحقق من ظهورها بنجاح

---

## Troubleshooting

### المشكلة: Deploy Fails

**الحل**:
```bash
# تحقق من الـ build محلياً
npm run build

# تحقق من الأخطاء
npm run lint

# تحقق من الـ types
npm run typecheck
```

### المشكلة: 500 Error في Production

**السبب**: متغيرات البيئة لم تُعيّن

**الحل**:
1. تحقق من Vercel Settings > Environment Variables
2. أعد الرفع (redeploy):
   ```bash
   vercel --prod
   ```

### المشكلة: صور لا تظهر

**السبب**: Cloudinary credentials خاطئة

**التحقق**:
```bash
# اختبر الـ API مباشرة
curl https://api.cloudinary.com/v1_1/{cloud_name}/resources/image \
  -u {api_key}:{api_secret}
```

---

## Vercel Analytics

بعد الـ Deploy، تحقق من:

1. **Deployments**: جميع الـ deploys السابقة
2. **Web Analytics**: زوار الموقع
3. **Real-Time Logs**: أخطاء وتنبيهات
4. **Function Status**: حالة الـ API functions

---

## الفروقات بين Local و Production

| الميزة | Local | Production |
|--------|-------|-----------|
| Build | `npm run build` | Vercel auto-builds |
| Environment | `.env.local` | Vercel Settings |
| Cold Start | ✅ None | ⏱️ ~1s (first request) |
| Caching | ❌ No | ✅ Yes (Vercel Edge) |
| Logs | Console | Vercel Logs |
| Domain | `localhost:3000` | `your-project.vercel.app` |

---

## Vercel Functions Configuration

الملف `vercel.json` يحتوي على:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

**ملاحظات**:
- `maxDuration: 30` = كل function تقدر تعمل 30 ثانية
- للملفات الأكبر، زيادة هذا الرقم
- Maximum allowed = 60 ثانية مع Vercel Pro

---

## التحديثات المستقبلية

### سيناريو: تحديث إضافة ميزة جديدة

```bash
# 1. عمل branch
git checkout -b feature/new-feature

# 2. عمل التطوير والتعديلات
npm run dev
# ... عمل الكود ...

# 3. اختبار محلياً
npm run build
npm run typecheck

# 4. Commit و Push
git add .
git commit -m "feat: إضافة ميزة جديدة"
git push origin feature/new-feature

# 5. Create Pull Request على GitHub
# 6. Vercel سينشئ Preview Deployment
# 7. بعد Merge → Production Deploy

# 8. Deploy نهائي
vercel --prod
```

---

## Monitor و Maintain

### Daily Checks:
```bash
# تحقق من الـ logs
vercel logs src/app/api/upload/route.ts

# تحقق من استخدام الموارد
vercel analytics
```

### Weekly:
- مراقبة Cloudinary usage
- تحقق من أي errors في Sentry (إن وُجِد)
- تحديث dependencies: `npm update`

### Monthly:
- تحليل الأداء
- تحديث CLI: `npm install -g vercel@latest`

---

## Rollback

إذا حدث مشكلة بعد Deploy:

```bash
# عرض جميع الـ deployments
vercel deployments

# اختر الـ old deployment ID وقم بـ Rollback
vercel rollback
```

---

## مشاركة مع الفريق

### إضافة collaborators:
```bash
vercel teams
```

### Environment Variables:
- كل team member قادر يستخدم نفس الـ env vars
- لكن API Secret يبقى محمي

---

## تكاليف

| الخدمة | الحد المجاني | السعر |
|--------|------------|-------|
| Vercel | 100 GB bandwidth | $0 |
| Cloudinary Functions | 무제한 | $0 |
| Serverless Functions | 100 GB/month | $0.50/GB |
| Extra Bandwidth | - | $0.15/GB |

**نصيحة**: استخدم الـ free tier - كافي للمشاريع الصغيرة!

---

## الخطوات التالية

✅ تم: Deploy على Vercel  
✅ تم: تكوين Cloudinary  
✅ تم: API endpoints  
⏭️ تالي: إضافة Database (Firebase, Supabase, etc)  
⏭️ تالي: قياس الأداء  
⏭️ تالي: إضافة مراقبة الأخطاء  

---

**هل تحتاج مزيد مساعدة؟** 💬
اتصل بـ support أو زر [documentation](https://vercel.com/docs)
