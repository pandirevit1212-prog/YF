# YF E&C Site Work & Cost Management App - Cloudflare Pages Deployment

## Quick Start

### Prerequisites
- Node.js 18+
- Git
- Cloudflare Pages account
- Supabase project (existing database)

### 1. Clone & Install
```bash
git clone https://github.com/pandirevit1212-prog/YF.git
cd YF
git checkout cloudflare-migration
npm install
```

### 2. Environment Setup

Create `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key-here
```

**Get your Supabase credentials:**
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy the `Project URL` and `anon public key`

### 3. Build Locally
```bash
npm run build
```

### 4. Deploy to Cloudflare Pages

#### Method A: Using Wrangler CLI (Recommended)
```bash
npm install -g wrangler
wrangler login
wrangler pages deploy dist --project-name yf-app
```

#### Method B: GitHub Integration (Easiest)
1. Push to GitHub (branch: `cloudflare-migration`)
2. Go to https://dash.cloudflare.com/
3. Select your domain → Pages → Connect to Git
4. Select repository: `pandirevit1212-prog/YF`
5. Branch: `cloudflare-migration`
6. Build command: `npm install && npm run build`
7. Build output directory: `dist`
8. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
9. Deploy

### 5. Supabase Configuration

Add Cloudflare Pages domain to Supabase redirect URLs:

1. Go to https://app.supabase.com → Your Project
2. Authentication → URL Configuration
3. Under "Redirect URLs" add:
   ```
   https://your-app-name.pages.dev/*
   ```
4. If using custom domain:
   ```
   https://your-domain.com/*
   ```

### 6. Database Setup (One-time)

Run these SQL commands in Supabase to create tables:

```sql
-- Site Works Table
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

-- Rates Table
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

-- Edit History Table
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

-- Deleted Records Table
CREATE TABLE deleted_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  record_id UUID NOT NULL,
  record_type TEXT NOT NULL,
  data JSONB NOT NULL,
  deleted_by UUID NOT NULL,
  user_email TEXT NOT NULL,
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE site_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE edit_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE deleted_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "site_works_select" ON site_works FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "site_works_insert" ON site_works FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "site_works_update" ON site_works FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "rates_select" ON rates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "edit_history_select" ON edit_history FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "deleted_records_select" ON deleted_records FOR SELECT USING (auth.role() = 'authenticated');
```

## Features

✅ **Authentication** - Login, Register, Password Reset via Supabase
✅ **Site Work Entry** - Record site work with auto-cost calculation
✅ **Rate Management** - Admin can create/edit/delete rates
✅ **Admin Report** - View all records with sticky table headers, export CSV
✅ **Edit History** - Track all modifications
✅ **Deleted History** - View all deleted records separately
✅ **Multi-Language** - English & 中文 (Simplified Chinese) with localStorage persistence
✅ **Responsive Design** - Mobile, Tablet, Desktop
✅ **Role-Based Access** - Admin & User roles
✅ **Zero Secrets in Frontend** - Uses public Supabase anon key

## Deployment URLs

**Your app will be deployed at:**
- Default: `https://yf-app.pages.dev`
- Custom domain: `https://your-domain.com`

## Language Switching

Click the language button in the top-right corner:
- **English** (default)
- **中文** (Simplified Chinese)

Language preference is saved to localStorage automatically.

## Troubleshooting

### "Supabase environment variables not found"
- Ensure `.env.local` is created with correct keys
- In Cloudflare, add variables in Pages → Settings → Environment Variables

### "Authentication fails"
- Check Supabase redirect URLs match your deployment domain
- Verify public anon key is in environment variables

### "Database tables not found"
- Run the SQL commands above in Supabase SQL editor
- Check table names match exactly (lowercase)

### "CORS errors"
- Already handled - Supabase public key allows browser requests
- Ensure domain is added to Supabase URL configuration

## Support

For issues:
1. Check GitHub Issues: https://github.com/pandirevit1212-prog/YF/issues
2. Supabase Docs: https://supabase.com/docs
3. Cloudflare Pages Docs: https://developers.cloudflare.com/pages/

## License

MIT
