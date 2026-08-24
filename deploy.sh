#!/usr/bin/env bash
set -e

echo "🚀 YF E&C App - Cloudflare Pages Deployment Script"
echo "================================================"

if [ ! -f .env.local ]; then
  echo "❌ Error: .env.local not found"
  echo "Please create .env.local with:"
  echo "VITE_SUPABASE_URL=your-url"
  echo "VITE_SUPABASE_ANON_KEY=your-key"
  exit 1
fi

echo "✅ Environment file found"
echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

echo "✅ Build complete!"
echo "📁 Output directory: dist/"
echo ""
echo "To deploy to Cloudflare Pages:"
echo "  npx wrangler pages deploy dist --project-name yf-app"
echo ""
echo "Or use GitHub integration:"
echo "  1. Push to GitHub"
echo "  2. Go to Cloudflare Dashboard"
echo "  3. Pages → Connect to Git"
echo "  4. Follow the wizard"
