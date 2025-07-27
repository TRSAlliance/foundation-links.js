#!/bin/bash

# Fail immediately if any command fails
set -e

echo "🔧 Installing dependencies..."
npm install || exit 1

echo "🏗️ Building project..."
npm run build || { echo "❌ Build failed"; exit 1; }

echo "📦 Packaging files..."
mkdir -p out
cp foundation-links.js out/
cp sitemap.xml out/

echo "🚀 Deploying to Netlify..."
npx netlify deploy --prod --dir=out --site=trs-foundation-links || { 
  echo "❌ Deploy failed"; 
  exit 1; 
}

echo "✅ Deployment complete! TRS Foundation links are now live."
