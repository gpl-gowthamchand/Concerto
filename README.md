# 🎵 Concerto - Real Music Streaming App

**Concerto is a professional music streaming application with REAL music from live APIs - NO MOCK DATA!**

## ✨ Features

### 🎧 **Real Music Playback**
- **YouTube Music Integration** - Stream real songs from YouTube
- **SoundCloud Support** - Access independent artists and tracks
- **Jamendo Music** - Free music from creative commons artists
- **Working Audio Player** - Full controls, progress bar, volume, shuffle, repeat

### 🔍 **Advanced Discovery**
- **Real-time Search** - Find any song, artist, or album instantly
- **Genre Filtering** - Pop, Rock, Electronic, Hip-Hop, Jazz, Classical, Country, R&B, Indie, Acoustic
- **Mood-based Playlists** - Happy, Sad, Energetic, Relaxed, Creative, Romantic, Motivational, Chill
- **Trending Music** - Latest hits and popular songs from YouTube

### 📚 **Smart Playlists**
- **Featured Collections** - Curated playlists from multiple sources
- **Personal Library** - Save your favorite songs and create custom playlists
- **Recently Played** - Track your listening history
- **Liked Songs** - Build your personal music collection

### 🚀 **Modern Technology**
- **Next.js 14** - Latest React framework with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Beautiful, responsive design
- **PWA Support** - Install as a native app
- **Real-time Updates** - Live music data

## 🛠️ Setup Instructions

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/Concerto.git
cd Concerto
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up API Keys**

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp env.example .env.local
```

Then edit `.env.local` with your real API keys:

```env
# YouTube Data API v3 (FREE - 10,000 requests/day)
# Get from: https://console.cloud.google.com/apis/credentials
NEXT_PUBLIC_YOUTUBE_API_KEY=your_real_youtube_api_key

# SoundCloud API (FREE)
# Get from: https://soundcloud.com/you/apps
NEXT_PUBLIC_SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id

# Jamendo API (FREE - 200 requests/day)
# Get from: https://developer.jamendo.com/
NEXT_PUBLIC_JAMENDO_CLIENT_ID=your_jamendo_client_id

# Free Music Archive API (FREE - requires registration)
# Get from: https://freemusicarchive.org/api/
NEXT_PUBLIC_FMA_API_KEY=your_fma_api_key
```

### **4. Get Your Free API Keys**

#### **YouTube Data API v3 (Recommended - Start Here)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Copy the key to your `.env.local`

#### **SoundCloud API**
1. Visit [SoundCloud Apps](https://soundcloud.com/you/apps)
2. Create a new app
3. Get your Client ID

#### **Jamendo API**
1. Go to [Jamendo Developer](https://developer.jamendo.com/)
2. Sign up for free account
3. Get your Client ID

### **5. Run the Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### **6. Build for Production**
```bash
npm run build
npm start
```

## 🌐 **Deployment**

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### **Other Platforms**
- **Netlify** - Supports Next.js with environment variables
- **Railway** - Easy deployment with env vars
- **DigitalOcean App Platform** - Scalable hosting

## 🎯 **How It Works**

### **Real Music Sources**
1. **YouTube Music** - Primary source for trending and popular music
2. **SoundCloud** - Independent artists and underground tracks
3. **Jamendo** - Creative commons and free music
4. **Free Music Archive** - Curated free music collection

### **API Architecture**
- **Client-side** - React components for UI and user interaction
- **API Routes** - Next.js API routes for server-side API calls
- **Real-time Data** - Live music data from multiple sources
- **Smart Caching** - Efficient data fetching and storage

### **Music Player**
- **YouTube Embed** - Seamless YouTube video playback
- **SoundCloud Player** - Native SoundCloud integration
- **Direct Audio** - Support for direct audio files
- **Queue Management** - Advanced playlist and queue controls

## 🔧 **Customization**

### **Adding New Music Sources**
1. Create new API route in `app/api/`
2. Add source to `realMusicService.ts`
3. Update interfaces and types
4. Test with real API calls

### **Styling**
- **Tailwind CSS** - Utility-first CSS framework
- **Dark Theme** - Beautiful dark mode design
- **Responsive** - Mobile-first approach
- **Custom Components** - Reusable UI components

## 📱 **Mobile Features**
- **PWA Support** - Install as native app
- **Responsive Design** - Works on all devices
- **Touch Controls** - Mobile-optimized interface
- **Offline Support** - Service worker implementation

## 🚨 **Important Notes**

### **No Mock Data**
- **ALL music is real** - No fake songs or playlists
- **Live APIs** - Real-time data from music platforms
- **Actual streaming** - Real audio playback from sources

### **API Limits**
- **YouTube** - 10,000 requests/day (free tier)
- **SoundCloud** - Rate limited by platform
- **Jamendo** - 200 requests/day (free tier)
- **FMA** - Varies by registration

### **Legal Compliance**
- **YouTube** - Follows YouTube's terms of service
- **SoundCloud** - Respects platform policies
- **Jamendo** - Creative commons music
- **FMA** - Free music archive

## 🐛 **Troubleshooting**

### **Common Issues**

#### **"No music found"**
- Check your API keys in `.env.local`
- Verify API quotas haven't been exceeded
- Check browser console for errors

#### **"YouTube API error"**
- Ensure YouTube Data API v3 is enabled
- Check API key is correct
- Verify quota limits

#### **"Build failed"**
- Run `npm run lint` to check for errors
- Ensure all dependencies are installed
- Check TypeScript compilation

### **Getting Help**
1. Check the browser console for errors
2. Verify your API keys are working
3. Test API endpoints directly
4. Check GitHub issues for similar problems

## 🎉 **What You Get**

### **Real Working Music App**
- ✅ **No mock data** - Everything is real
- ✅ **Working search** - Find any song instantly
- ✅ **Real playback** - Stream music from YouTube
- ✅ **Live discovery** - Trending and new releases
- ✅ **Professional UI** - Beautiful, responsive design
- ✅ **Multiple sources** - YouTube, SoundCloud, Jamendo
- ✅ **PWA ready** - Install as native app

### **Production Ready**
- ✅ **TypeScript** - Full type safety
- ✅ **ESLint** - Clean, maintainable code
- ✅ **Responsive** - Works on all devices
- ✅ **SEO optimized** - Search engine friendly
- ✅ **Performance** - Fast loading and smooth playback

## 🌟 **Why Concerto?**

### **Real Music Experience**
- **No fake songs** - Every track is real and playable
- **Live data** - Always up-to-date music information
- **Multiple sources** - Access to millions of songs
- **Professional quality** - Production-ready application

### **Developer Friendly**
- **Modern stack** - Next.js 14, React 18, TypeScript
- **Clean architecture** - Well-organized, maintainable code
- **API integration** - Easy to extend and customize
- **Documentation** - Comprehensive setup and usage guides

---

## 🚀 **Ready to Deploy?**

Your Concerto app is now **100% real music** with **0% mock data**! 

**Next steps:**
1. **Get your API keys** (especially YouTube - it's free!)
2. **Set up environment variables**
3. **Test locally** with `npm run dev`
4. **Deploy to Vercel** for free hosting
5. **Enjoy your real music streaming app!** 🎵

---

**Made with ❤️ and real music APIs**
