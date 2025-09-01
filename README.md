# Concerto - Modern Music Player

A beautiful, modern music player built with React, TypeScript, Redux Toolkit, and Tailwind CSS.

## Features

- 🎵 **Music Player** - Full-featured audio player with play/pause, skip, volume control
- 🎨 **Modern UI** - Beautiful, responsive design with dark theme
- 📱 **Responsive** - Works perfectly on desktop, tablet, and mobile
- 🎯 **Genre Discovery** - Browse music by different genres
- 📚 **Library Management** - Organize your music collection
- 🔍 **Search** - Find your favorite songs quickly
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: React Icons
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd concerto
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── MusicPlayer/    # Music player components
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── SongCard.tsx    # Song display card
│   └── SearchBar.tsx   # Search functionality
├── pages/              # Page components
│   ├── Home.tsx        # Home page
│   ├── Discover.tsx    # Music discovery
│   └── Library.tsx     # User library
├── redux/              # State management
│   ├── features/       # Redux slices
│   ├── hooks.ts        # Typed Redux hooks
│   └── store.ts        # Redux store
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Features Overview

### Music Player
- Play/pause functionality
- Skip to next/previous songs
- Volume control
- Progress bar with seeking
- Repeat and shuffle modes
- Real-time time display

### Navigation
- Responsive sidebar navigation
- Mobile-friendly hamburger menu
- Active route highlighting

### Pages
- **Home**: Featured songs and recently played
- **Discover**: Browse music by genre
- **Library**: Personal music collection with playlists and albums

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly controls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by modern music streaming platforms
- Built with the latest React and TypeScript best practices
- Uses Tailwind CSS for beautiful, utility-first styling
