#!/bin/bash

set -e
echo "Starting deployment..."

# Verify critical files exist
[ -f netlify.toml ] || { echo "❌ Missing netlify.toml"; exit 1; }
[ -d out ] && { echo "Cleaning previous build..."; rm -rf out; }

# Verify NETLIFY_AUTH_TOKEN
[ -z "$NETLIFY_AUTH_TOKEN" ] && { echo "❌ NETLIFY_AUTH_TOKEN not set"; exit 1; }
echo "NETLIFY_AUTH_TOKEN is set"

# Check npm installation
echo "Installing dependencies..."
npm ci || { echo "❌ npm ci failed"; exit 1; }

# Build and export
echo "Running build..."
npm run build || { echo "❌ Build failed"; exit 1; }
echo "Running export..."
npm run export || { echo "❌ Export failed"; exit 1; }

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod --dir=out || { echo "❌ Netlify deploy failed"; exit 1; }
echo "✅ Deployment complete"
