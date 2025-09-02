# Concerto Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Netlify (Recommended)
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder to deploy
   - Or connect your GitHub repository for automatic deployments

3. **Custom domain (optional):**
   - Add your custom domain in Netlify dashboard
   - Update DNS settings

### Option 2: Vercel
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts** to configure your deployment

### Option 3: GitHub Pages
1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts:**
   ```json
   "homepage": "https://yourusername.github.io/concerto",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### Option 4: Firebase Hosting
1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase:**
   ```bash
   firebase init hosting
   ```

3. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

## 🌐 Online Music API Setup

### Current Setup
The app uses the Deezer API (free, no authentication required) for online music streaming.

### To Enable Full Music Streaming:

1. **Get API Keys:**
   - **Deezer API**: Free, no key required for basic usage
   - **Spotify API**: Get from [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - **YouTube Music API**: Get from [Google Cloud Console](https://console.cloud.google.com/)

2. **Update API Configuration:**
   Edit `src/services/musicApi.ts` and add your API keys:
   ```typescript
   const SPOTIFY_CLIENT_ID = 'your_spotify_client_id';
   const SPOTIFY_CLIENT_SECRET = 'your_spotify_client_secret';
   ```

3. **Environment Variables:**
   Create `.env` file:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id
   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

## 🔧 Production Optimizations

### 1. Enable Compression
Add to `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
})
```

### 2. Add PWA Support
Install PWA plugin:
```bash
npm install vite-plugin-pwa -D
```

### 3. Enable HTTPS
Most hosting platforms provide HTTPS by default. For custom servers, use Let's Encrypt.

## 📱 Mobile App Deployment

### Option 1: Capacitor (Recommended)
1. **Install Capacitor:**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```

2. **Add platforms:**
   ```bash
   npm install @capacitor/android @capacitor/ios
   npx cap add android
   npx cap add ios
   ```

3. **Build and sync:**
   ```bash
   npm run build
   npx cap sync
   ```

### Option 2: Tauri (Desktop)
1. **Install Tauri:**
   ```bash
   npm install @tauri-apps/cli
   ```

2. **Initialize Tauri:**
   ```bash
   npx tauri init
   ```

3. **Build:**
   ```bash
   npx tauri build
   ```

## 🎵 Music API Integration

### Free APIs (No Authentication):
- **Deezer API**: 30-second previews
- **Jamendo API**: Free music with attribution
- **Freesound API**: Sound effects and samples

### Premium APIs (Requires Authentication):
- **Spotify Web API**: Full tracks with premium account
- **Apple Music API**: Full tracks with developer account
- **YouTube Music API**: Full tracks with API key

### Implementation Example:
```typescript
// Add to src/services/musicApi.ts
export const spotifyApi = {
  async getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
      },
      body: 'grant_type=client_credentials'
    });
    return response.json();
  }
};
```

## 🔒 Security Considerations

1. **API Keys**: Never expose API keys in client-side code
2. **CORS**: Configure CORS properly for your domain
3. **Rate Limiting**: Implement rate limiting for API calls
4. **HTTPS**: Always use HTTPS in production

## 📊 Analytics & Monitoring

### Add Analytics:
```bash
npm install @vercel/analytics
```

### Add Error Tracking:
```bash
npm install @sentry/react
```

## 🚀 Performance Tips

1. **Lazy Loading**: Implement lazy loading for routes
2. **Image Optimization**: Use WebP format for images
3. **Caching**: Implement proper caching strategies
4. **CDN**: Use a CDN for static assets

## 📞 Support

For deployment issues:
1. Check the browser console for errors
2. Verify API endpoints are accessible
3. Check CORS configuration
4. Ensure all environment variables are set

Happy deploying! 🎉

