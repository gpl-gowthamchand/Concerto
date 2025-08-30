# API Setup Guide for Concerto Music App

To enable real music streaming in your Concerto app, you'll need to set up API keys for various music services.

## Required API Keys

### 1. YouTube Data API v3
**Required for:** YouTube Music search and playback
- Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- Create a new project or select existing
- Enable YouTube Data API v3
- Create credentials (API Key)
- Add to your `.env` file:
```
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 2. Last.fm API
**Required for:** Music metadata and recommendations
- Go to [Last.fm API](https://www.last.fm/api/account/create)
- Create an account and get API key
- Add to your `.env` file:
```
REACT_APP_LASTFM_API_KEY=your_lastfm_api_key_here
```

### 3. Genius API
**Required for:** Lyrics
- Go to [Genius API](https://genius.com/api-clients)
- Create an API client
- Get access token
- Add to your `.env` file:
```
REACT_APP_GENIUS_ACCESS_TOKEN=your_genius_access_token_here
```

### 4. Musixmatch API
**Required for:** Lyrics (alternative to Genius)
- Go to [Musixmatch Developer](https://developer.musixmatch.com/)
- Sign up and get API key
- Add to your `.env` file:
```
REACT_APP_MUSIXMATCH_API_KEY=your_musixmatch_api_key_here
```

## Free APIs (No API Key Required)

### JioSaavn
- Uses unofficial API endpoints
- No API key required
- Provides Indian music content

### Deezer
- Uses public API
- No API key required
- Provides 30-second previews

### SoundCloud
- Uses public API
- No API key required
- Provides streaming URLs

## Setup Instructions

1. **Create `.env` file** in your project root:
```bash
cp .env.example .env
```

2. **Add your API keys** to the `.env` file

3. **Restart your development server**:
```bash
npm run dev
```

4. **Test the search** by searching for popular songs

## Troubleshooting

### "No results found" error
- Check if your API keys are correct
- Verify API quotas haven't been exceeded
- Try different search terms

### "Failed to play audio" error
- Some sources may have geo-restrictions
- Try different music sources
- Check browser console for CORS errors

### API quota exceeded
- YouTube API has daily limits
- Consider using multiple sources
- Implement caching for repeated searches

## Alternative Setup (No API Keys)

If you don't want to set up API keys, the app will still work with:
- Deezer (30-second previews)
- SoundCloud (public tracks)
- Mock data fallback

## Security Notes

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore`
- Use environment variables in production
- Monitor API usage to avoid unexpected charges

## Production Deployment

For Vercel deployment, add environment variables in:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each API key as a new variable
4. Redeploy your application

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify API keys are correct
3. Test API endpoints individually
4. Check API documentation for changes
