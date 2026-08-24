# YF E&C - Build & Deployment Instructions

## What This App Does

YF E&C Site Work & Cost Management Application - A complete system for tracking construction site work, costs, and worker records with:

- **Multi-language support** (English & 中文)
- **User authentication** (Login, Register, Password Reset)
- **Site work data entry** with automatic cost calculation
- **Rate management** for admins
- **Comprehensive reporting** with CSV export
- **Complete audit trails** (Edit & Delete history)
- **Role-based access control** (Admin & User)
- **Mobile-responsive design**

---

## 🏗️ Build Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Git

### Build Steps

```bash
# 1. Clone repository
git clone https://github.com/pandirevit1212-prog/YF.git
cd YF
git checkout cloudflare-migration

# 2. Install dependencies
npm install

# 3. Create .env.local file
echo 'VITE_SUPABASE_URL=https://your-project.supabase.co' > .env.local
echo 'VITE_SUPABASE_ANON_KEY=your-public-anon-key' >> .env.local

# 4. Build for production
npm run build

# 5. Output will be in 'dist/' directory
```

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-*.js (Main app bundle)
│   ├── vendor-*.js (React, Router dependencies)
│   ├── i18n-*.js (Translation files)
│   ├── supabase-*.js (Supabase client)
│   └── index-*.css (Styles)
└── _redirects (For Cloudflare routing)
```

**Total Size**: ~150-200KB (gzipped: ~50-60KB)

---

## 🌐 Deployment to Cloudflare Pages

### Option A: GitHub Auto-Deploy (Recommended)

1. **Repository is already pushed to GitHub**
   - URL: https://github.com/pandirevit1212-prog/YF
   - Branch: `cloudflare-migration`

2. **Go to Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com/
   - Login with your Cloudflare account

3. **Create Pages Project**
   - Click "Pages" in left sidebar
   - Click "Connect to Git"
   - Select GitHub account
   - Search for "pandirevit1212-prog/YF"
   - Select repository

4. **Configure Build Settings**
   - Branch: `cloudflare-migration`
   - Build command: `npm install && npm run build`
   - Build output directory: `dist`

5. **Add Environment Variables** (CRITICAL)
   - In Pages project settings → Environment Variables
   - Add `VITE_SUPABASE_URL` = Your Supabase Project URL
   - Add `VITE_SUPABASE_ANON_KEY` = Your Supabase public anon key
   - **DO NOT** use service_role_key

6. **Deploy**
   - Click "Save and Deploy"
   - Wait 2-5 minutes for deployment

### Option B: Manual Deploy with Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy dist folder to Cloudflare Pages
wrangler pages deploy dist --project-name yf-app

# Your app will be live at:
# https://yf-app.pages.dev
```

---

## 🔑 Supabase Configuration

### Get Your Credentials

1. Go to https://app.supabase.com
2. Select your project
3. Click "Settings" → "API"
4. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbG...` (PUBLIC KEY, not secret!)

### Configure Redirect URLs

1. In Supabase: Authentication → URL Configuration
2. Add under "Redirect URLs":
   ```
   https://yf-app.pages.dev
   https://yf-app.pages.dev/*
   ```
3. If using custom domain:
   ```
   https://your-domain.com
   https://your-domain.com/*
   ```

### Create Database Tables

In Supabase SQL Editor, run all SQL from `DEPLOYMENT.md`:

```sql
CREATE TABLE site_works (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site TEXT NOT NULL,
  work TEXT NOT NULL,
  date DATE NOT NULL,
  day INTEGER DEFAULT 1,
  worker_name TEXT NOT NULL,
  worker_id TEXT NOT NULL,
  site_engineer TEXT,
  area DECIMAL(10, 2) DEFAULT 0,
  rate_id UUID,
  cost DECIMAL(12, 2) DEFAULT 0,
  signature TEXT,
  remarks TEXT,
  created_by UUID NOT NULL,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  value DECIMAL(10, 2) NOT NULL,
  unit TEXT DEFAULT 'm²',
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE edit_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  record_id UUID NOT NULL,
  record_type TEXT NOT NULL,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  edited_by UUID NOT NULL,
  user_email TEXT NOT NULL,
  edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deleted_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  record_id UUID NOT NULL,
  record_type TEXT NOT NULL,
  data JSONB NOT NULL,
  deleted_by UUID NOT NULL,
  user_email TEXT NOT NULL,
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Testing

### Local Testing

```bash
# Development server with hot reload
npm run dev

# Open browser
# http://localhost:5173
```

### Test Checklist

- [ ] Login with test account
- [ ] Register new account
- [ ] Create site work entry
- [ ] Verify auto-cost calculation
- [ ] Switch language to Chinese (中文)
- [ ] Create rates (admin only)
- [ ] View admin report
- [ ] Export CSV
- [ ] Check edit history
- [ ] Check deleted history
- [ ] Test logout
- [ ] Responsive on mobile (press F12)

---

## 📦 APK / Mobile App

### Important Note
This is a **Progressive Web App (PWA)** - NOT an APK file for Android.

**Why?** 
- The app is already optimized for mobile browsers
- Works on iOS Safari, Android Chrome, all modern browsers
- No need for separate app store deployment
- Automatic updates via Cloudflare

### Access on Mobile

1. **On Android**
   - Open browser (Chrome preferred)
   - Go to: `https://yf-app.pages.dev` (your deployment URL)
   - Chrome will prompt: "Install app?"
   - Click install → App appears on home screen

2. **On iPhone**
   - Open Safari
   - Go to: `https://yf-app.pages.dev`
   - Tap Share → Add to Home Screen
   - App appears on home screen

3. **As Web App**
   - Simply visit the URL on any browser
   - Works offline on modern devices
   - No installation needed

---

## 📊 App Features & URLs

### Pages
- **Login** → `/login`
- **Register** → `/register`
- **Forgot Password** → `/forgot-password`
- **Dashboard** → `/` (protected)
- **Site Work Entry** → `/entry` (protected)
- **Rate Management** → `/rates` (admin only)
- **Admin Report** → `/reports` (admin only)
- **Edit History** → `/history` (protected)
- **Deleted History** → `/deleted` (protected)

### Languages
- **English** (default)
- **中文** (Simplified Chinese)
- Switched via button in header
- Preference saved to localStorage

### Data Persisted
- All user data in Supabase
- Language preference in browser localStorage
- Session via Supabase auth tokens

---

## 🔐 Security

✅ **Frontend Security:**
- Only public `anon_key` used (safe for browser)
- Private service_role_key NEVER exposed
- Environment variables used for secrets
- No hardcoded credentials

✅ **Backend Security (Supabase):**
- Row Level Security (RLS) enabled
- User can only access their own data
- Auth tokens required for all requests
- HTTPS enforced

✅ **Deployment Security:**
- Environment variables in Cloudflare only
- No secrets in GitHub
- SSL/TLS provided by Cloudflare
- DDoS protection included

---

## 🚀 Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| GitHub push | Done | ✅ Complete |
| Cloudflare Pages setup | 5 min | ⏳ Your turn |
| Build | 2-3 min | Automatic |
| Deploy | 1-2 min | Automatic |
| **Total to Live** | ~10 min | ⏱️ |

---

## 📝 File Structure

```
YF/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── lib/              # Supabase & Auth logic
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript types
│   ├── i18n/             # Translations (EN, ZH)
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Main app routing
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.ts        # Vite build config
├── tsconfig.json         # TypeScript config
├── .env.example          # Example env vars
├── wrangler.toml         # Cloudflare config
├── _redirects            # Cloudflare routing
├── DEPLOYMENT.md         # Full deployment guide
└── BUILD.md              # This file
```

---

## ⚠️ Common Issues & Fixes

### "Environment variables not found"
- Add them in Cloudflare Pages settings → Environment Variables
- Redeploy after adding
- Check variable names match exactly: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### "Cannot connect to Supabase"
- Verify project URL is correct (no trailing slash)
- Check anon key is PUBLIC key, not service_role_key
- Confirm redirect URLs added to Supabase
- Check network tab in browser DevTools

### "Login redirects to blank page"
- Add your domain to Supabase redirect URLs
- Wait 1-2 minutes for changes to propagate
- Clear browser cache

### "Database tables not found"
- Run SQL from DEPLOYMENT.md in Supabase SQL Editor
- Check table names are lowercase
- Verify RLS policies are created

### "Styles not loading"
- Check `_redirects` file exists in root
- Verify `dist/` folder created with CSS files
- Check browser console for 404 errors

---

## 📞 Support

- **GitHub Issues**: https://github.com/pandirevit1212-prog/YF/issues
- **Supabase Docs**: https://supabase.com/docs
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Vite Docs**: https://vitejs.dev/

---

## ✨ What's Included

✅ Complete React TypeScript app  
✅ Supabase backend integration  
✅ Multi-language support (EN, ZH)  
✅ Cloudflare Pages ready  
✅ Mobile responsive  
✅ Production-grade security  
✅ Role-based access control  
✅ Audit trails & history  
✅ CSV export functionality  
✅ Auto-cost calculation  
✅ Complete documentation  

---

## 🎯 Next Steps

1. ✅ Code is ready (you're here)
2. ⏳ **Go to Cloudflare Dashboard**
3. ⏳ **Create Pages project from GitHub**
4. ⏳ **Set environment variables**
5. ⏳ **Deploy**
6. ⏳ **Create database tables in Supabase**
7. ⏳ **Add redirect URLs to Supabase**
8. ✨ **App is live!**

---

**Your app is production-ready! 🎉**
