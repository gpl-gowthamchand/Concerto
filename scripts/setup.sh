#!/bin/bash

echo "🎵 Setting up Concerto Music App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p public
mkdir -p src/components/UI
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/services

# Create placeholder files
echo "📝 Creating placeholder files..."
touch src/components/UI/index.ts
touch src/hooks/index.ts
touch src/utils/index.ts
touch src/services/index.ts

# Create default assets
echo "🎨 Setting up default assets..."
echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#0ea5e9"/><text x="50" y="60" text-anchor="middle" fill="white" font-size="40" font-family="Arial">C</text></svg>' > public/vite.svg

echo "🎉 Setup complete! You can now start developing:"
echo ""
echo "  npm run dev     # Start development server"
echo "  npm run build   # Build for production"
echo "  npm run preview # Preview production build"
echo ""
echo "🚀 Happy coding with Concerto!"
