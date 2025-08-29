#!/bin/bash

# Concerto Music App Setup Script
# This script will help you set up the development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  Concerto Music App Setup${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
        
        if [ "$NODE_MAJOR" -ge 18 ]; then
            print_success "Node.js version $NODE_VERSION is compatible"
            return 0
        else
            print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
            return 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        return 1
    fi
}

# Function to check npm version
check_npm_version() {
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm version $NPM_VERSION is available"
        return 0
    else
        print_error "npm is not installed. Please install npm."
        return 1
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Function to create environment file
create_env_file() {
    if [ ! -f .env ]; then
        print_status "Creating .env file..."
        
        cat > .env << EOF
# Concerto Music App Environment Variables
# Copy this file to .env.local and modify as needed

# API Keys (optional for basic functionality)
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
VITE_LASTFM_API_KEY=your_lastfm_api_key_here
VITE_MUSICBRAINZ_API_KEY=your_musicbrainz_api_key_here

# App Configuration
VITE_APP_NAME=Concerto Music App
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=AI-Powered Music Streaming Platform

# Development Settings
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
VITE_ENABLE_ANALYTICS=false

# Audio Settings
VITE_DEFAULT_AUDIO_QUALITY=high
VITE_ENABLE_OFFLINE_MODE=true
VITE_MAX_OFFLINE_STORAGE=5GB

# Feature Flags
VITE_ENABLE_VOICE_SEARCH=true
VITE_ENABLE_AI_RECOMMENDATIONS=true
VITE_ENABLE_SOCIAL_FEATURES=true
VITE_ENABLE_ANALYTICS_DASHBOARD=true
EOF
        
        print_success ".env file created successfully"
        print_warning "Please review and modify the .env file with your actual API keys"
    else
        print_status ".env file already exists, skipping creation"
    fi
}

# Function to create .env.local file
create_env_local() {
    if [ ! -f .env.local ]; then
        print_status "Creating .env.local file for local overrides..."
        
        cat > .env.local << EOF
# Local environment overrides
# This file is not committed to version control
# Add your local API keys and settings here

# Example API Keys (replace with actual keys)
# VITE_YOUTUBE_API_KEY=your_actual_youtube_key
# VITE_LASTFM_API_KEY=your_actual_lastfm_key
# VITE_MUSICBRAINZ_API_KEY=your_actual_musicbrainz_key

# Local Development Settings
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
EOF
        
        print_success ".env.local file created successfully"
        print_warning "Add your actual API keys to .env.local"
    else
        print_status ".env.local file already exists, skipping creation"
    fi
}

# Function to check and create necessary directories
create_directories() {
    print_status "Checking and creating necessary directories..."
    
    # Create logs directory if it doesn't exist
    if [ ! -d "logs" ]; then
        mkdir -p logs
        print_success "Created logs directory"
    fi
    
    # Create build directory if it doesn't exist
    if [ ! -d "dist" ]; then
        mkdir -p dist
        print_success "Created dist directory"
    fi
    
    # Create .vscode directory for VS Code settings
    if [ ! -d ".vscode" ]; then
        mkdir -p .vscode
        print_success "Created .vscode directory"
    fi
}

# Function to create VS Code settings
create_vscode_settings() {
    if [ ! -f .vscode/settings.json ]; then
        print_status "Creating VS Code settings..."
        
        cat > .vscode/settings.json << EOF
{
    "typescript.preferences.importModuleSpecifier": "relative",
    "typescript.suggest.autoImports": true,
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "tailwindCSS.includeLanguages": {
        "typescript": "javascript",
        "typescriptreact": "javascript"
    },
    "tailwindCSS.experimental.classRegex": [
        ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
        ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
    ],
    "emmet.includeLanguages": {
        "typescript": "html",
        "typescriptreact": "html"
    }
}
EOF
        
        print_success "VS Code settings created"
    fi
}

# Function to create VS Code extensions recommendations
create_vscode_extensions() {
    if [ ! -f .vscode/extensions.json ]; then
        print_status "Creating VS Code extensions recommendations..."
        
        cat > .vscode/extensions.json << EOF
{
    "recommendations": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-typescript-next",
        "formulahendry.auto-rename-tag",
        "christian-kohler.path-intellisense",
        "ms-vscode.vscode-json",
        "ms-vscode.vscode-css-peek",
        "ms-vscode.vscode-htmlhint",
        "ms-vscode.vscode-css-validate"
    ]
}
EOF
        
        print_success "VS Code extensions recommendations created"
    fi
}

# Function to run type checking
run_type_check() {
    print_status "Running TypeScript type checking..."
    
    if npm run type-check 2>/dev/null || npx tsc --noEmit; then
        print_success "TypeScript type checking passed"
    else
        print_warning "TypeScript type checking failed - this is normal for initial setup"
    fi
}

# Function to run linting
run_linting() {
    print_status "Running ESLint..."
    
    if npm run lint 2>/dev/null || npx eslint src --ext .ts,.tsx; then
        print_success "ESLint passed"
    else
        print_warning "ESLint found some issues - this is normal for initial setup"
    fi
}

# Function to build the project
build_project() {
    print_status "Building the project..."
    
    if npm run build; then
        print_success "Project built successfully"
    else
        print_error "Failed to build project"
        exit 1
    fi
}

# Function to start development server
start_dev_server() {
    print_status "Starting development server..."
    print_success "Setup completed successfully! 🎉"
    echo
    echo -e "${CYAN}Next steps:${NC}"
    echo -e "1. Open your browser to ${GREEN}http://localhost:5173${NC}"
    echo -e "2. Start developing your music app!"
    echo -e "3. Check the README.md for more information"
    echo
    echo -e "${YELLOW}Note:${NC} The development server will start automatically."
    echo -e "Press ${GREEN}Ctrl+C${NC} to stop the server when you're done."
    echo
    
    # Start the development server
    npm run dev
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -s, --skip-dev Skip starting the development server"
    echo "  -f, --force    Force setup even if requirements are not met"
    echo "  -q, --quiet    Run in quiet mode (minimal output)"
    echo
    echo "Examples:"
    echo "  $0              # Full setup with dev server"
    echo "  $0 --skip-dev   # Setup without starting dev server"
    echo "  $0 --force      # Force setup (may fail if requirements not met)"
}

# Main setup function
main() {
    local SKIP_DEV=false
    local FORCE=false
    local QUIET=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -s|--skip-dev)
                SKIP_DEV=true
                shift
                ;;
            -f|--force)
                FORCE=true
                shift
                ;;
            -q|--quiet)
                QUIET=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Show header
    if [ "$QUIET" = false ]; then
        print_header
    fi
    
    # Check system requirements
    print_status "Checking system requirements..."
    
    if ! check_node_version; then
        if [ "$FORCE" = false ]; then
            print_error "System requirements not met. Use --force to continue anyway."
            exit 1
        else
            print_warning "Continuing despite system requirements not being met..."
        fi
    fi
    
    if ! check_npm_version; then
        if [ "$FORCE" = false ]; then
            print_error "System requirements not met. Use --force to continue anyway."
            exit 1
        else
            print_warning "Continuing despite system requirements not being met..."
        fi
    fi
    
    # Create necessary directories
    create_directories
    
    # Create VS Code configuration
    create_vscode_settings
    create_vscode_extensions
    
    # Install dependencies
    install_dependencies
    
    # Create environment files
    create_env_file
    create_env_local
    
    # Run checks
    run_type_check
    run_linting
    
    # Build project
    build_project
    
    # Start development server if not skipped
    if [ "$SKIP_DEV" = false ]; then
        start_dev_server
    else
        print_success "Setup completed successfully! 🎉"
        echo
        echo -e "${CYAN}To start the development server, run:${NC}"
        echo -e "  ${GREEN}npm run dev${NC}"
        echo
        echo -e "${CYAN}To build for production, run:${NC}"
        echo -e "  ${GREEN}npm run build${NC}"
    fi
}

# Run main function with all arguments
main "$@"
