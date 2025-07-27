#!/bin/bash

set -e
echo "Starting deployment at $(date)"

# Verify critical files exist
echo "Checking for critical files..."
[ -f netlify.toml ] || { echo "❌ Missing netlify.toml"; exit 1; }
[ -d out ] && { echo "Cleaning previous build..."; rm -rf out; }

# Verify NETLIFY_AUTH_TOKEN
[ -z "$NETLIFY_AUTH_TOKEN" ] && { echo "❌ NETLIFY_AUTH_TOKEN not set"; exit 1; }
echo "NETLIFY_AUTH_TOKEN is set"

# Check npm installation and version
echo "Verifying npm installation..."
npm_version=$(npm --version 2>/dev/null) || { echo "❌ npm not installed"; exit 1; }
echo "Using npm version $npm_version"
echo "Installing dependencies..."
npm ci || { echo "❌ npm ci failed"; exit 1; }

# Build and export
echo "Running build..."
npm run build || { echo "❌ Build failed"; exit 1; }
echo "Running export..."
npm run export || { echo "❌ Export failed"; exit 1; }

# Deploy to Netlify with retry mechanism
echo "Deploying to Netlify..."
max_attempts=3
attempt=1
while [ $attempt -le $max_attempts ]; do
    if netlify deploy --prod --dir=out; then
        echo "✅ Deployment complete at $(date)"
        exit 0
    else
        echo "❌ Netlify deploy failed (attempt $attempt/$max_attempts)"
        if [ $attempt -eq $max_attempts ]; then
            echo "❌ Max deployment attempts reached"
            exit 1
        fi
        sleep 5
        attempt=$((attempt + 1))
    fi
done
