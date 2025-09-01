#!/bin/bash

# Concerto Deployment Script
echo "🎵 Deploying Concerto Music Player..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in the 'dist' folder"
    echo ""
    echo "🚀 Deployment options:"
    echo "1. Netlify: Drag and drop the 'dist' folder to netlify.com"
    echo "2. Vercel: Run 'npx vercel' in the project directory"
    echo "3. GitHub Pages: Run 'npm run deploy' (if configured)"
    echo "4. Firebase: Run 'firebase deploy' (if configured)"
    echo ""
    echo "🌐 For online music, the app uses Deezer API (free, no auth required)"
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
