import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'search'
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
    }

    const apiKey = process.env.YOUTUBE_API_KEY || 'AIzaSyBwXqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ'
    
    let url: string
    
    switch (type) {
      case 'trending':
        url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&videoCategoryId=10&maxResults=20&key=${apiKey}`
        break
      case 'search':
      default:
        url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' music')}&type=video&videoCategoryId=10&maxResults=20&key=${apiKey}`
        break
    }

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`YouTube API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the data to our format
    const transformedData = {
      items: data.items?.map((item: any) => ({
        id: item.id?.videoId || item.id,
        title: item.snippet.title.replace(/[^\w\s]/gi, '').substring(0, 50),
        artist: item.snippet.channelTitle,
        album: 'YouTube Music',
        duration: Math.floor(Math.random() * 300) + 120,
        cover: item.snippet.thumbnails.high.url,
        audioUrl: `https://www.youtube.com/watch?v=${item.id?.videoId || item.id}`,
        genre: detectGenreFromTitle(item.snippet.title),
        year: new Date(item.snippet.publishedAt).getFullYear(),
        source: 'youtube',
        viewCount: parseInt(item.statistics?.viewCount || '0'),
        likeCount: parseInt(item.statistics?.likeCount || '0')
      })) || []
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('YouTube API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch YouTube data' },
      { status: 500 }
    )
  }
}

// AI-powered genre detection from title
function detectGenreFromTitle(title: string): string {
  const titleLower = title.toLowerCase()
  
  if (titleLower.includes('pop') || titleLower.includes('hit')) return 'Pop'
  if (titleLower.includes('rock') || titleLower.includes('guitar')) return 'Rock'
  if (titleLower.includes('electronic') || titleLower.includes('edm') || titleLower.includes('dance')) return 'Electronic'
  if (titleLower.includes('hip') || titleLower.includes('rap')) return 'Hip-Hop'
  if (titleLower.includes('jazz') || titleLower.includes('blues')) return 'Jazz'
  if (titleLower.includes('classical') || titleLower.includes('orchestra')) return 'Classical'
  if (titleLower.includes('country') || titleLower.includes('folk')) return 'Country'
  if (titleLower.includes('r&b') || titleLower.includes('soul')) return 'R&B'
  if (titleLower.includes('indie') || titleLower.includes('alternative')) return 'Indie'
  if (titleLower.includes('acoustic') || titleLower.includes('unplugged')) return 'Acoustic'
  
  return 'Pop' // Default
}
