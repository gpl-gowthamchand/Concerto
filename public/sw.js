// Concerto Music App Service Worker
// Version: 1.0.0

const CACHE_NAME = 'concerto-v1.0.0'
const STATIC_CACHE = 'concerto-static-v1.0.0'
const DYNAMIC_CACHE = 'concerto-dynamic-v1.0.0'
const MUSIC_CACHE = 'concerto-music-v1.0.0'

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.ico'
]

// API endpoints to cache
const API_CACHE = [
  '/api/songs',
  '/api/playlists',
  '/api/recommendations',
  '/api/analytics'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Static files cached successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Error caching static files:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== MUSIC_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated successfully')
        return self.clients.claim()
      })
  )
})

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Handle different types of requests
  if (request.method === 'GET') {
    // Static files - cache first strategy
    if (isStaticFile(url.pathname)) {
      event.respondWith(cacheFirst(request, STATIC_CACHE))
      return
    }
    
    // API requests - network first with cache fallback
    if (isApiRequest(url.pathname)) {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE))
      return
    }
    
    // Music files - cache first with network fallback
    if (isMusicFile(url.pathname)) {
      event.respondWith(cacheFirst(request, MUSIC_CACHE))
      return
    }
    
    // HTML pages - network first with cache fallback
    if (request.headers.get('accept')?.includes('text/html')) {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE))
      return
    }
  }
  
  // Default: network only
  event.respondWith(fetch(request))
})

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Cache first strategy failed:', error)
    return new Response('Offline content not available', { status: 503 })
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline')
    }
    
    return new Response('Content not available offline', { status: 503 })
  }
}

// Helper functions
function isStaticFile(pathname) {
  return STATIC_FILES.some(file => pathname === file) ||
         pathname.startsWith('/_next/') ||
         pathname.startsWith('/static/') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.svg')
}

function isApiRequest(pathname) {
  return pathname.startsWith('/api/') ||
         pathname.includes('jsonplaceholder') ||
         pathname.includes('mockapi')
}

function isMusicFile(pathname) {
  return pathname.endsWith('.mp3') ||
         pathname.endsWith('.wav') ||
         pathname.endsWith('.ogg') ||
         pathname.endsWith('.m4a') ||
         pathname.includes('/music/') ||
         pathname.includes('/samples/')
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Sync offline playlists, likes, etc.
    console.log('Performing background sync...')
    
    // Get stored offline actions
    const offlineActions = await getOfflineActions()
    
    for (const action of offlineActions) {
      try {
        await performOfflineAction(action)
        await removeOfflineAction(action.id)
      } catch (error) {
        console.error('Failed to sync action:', action, error)
      }
    }
    
    console.log('Background sync completed')
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Handle offline actions storage
async function getOfflineActions() {
  // This would typically use IndexedDB
  // For now, return empty array
  return []
}

async function performOfflineAction(action) {
  // Perform the stored action when back online
  console.log('Performing offline action:', action)
}

async function removeOfflineAction(actionId) {
  // Remove the action after successful sync
  console.log('Removing offline action:', actionId)
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  const options = {
    body: event.data?.text() || 'New music available on Concerto!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icons/explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Concerto Music', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/discover')
    )
  } else {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_MUSIC') {
    event.waitUntil(cacheMusicFile(event.data.url))
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches())
  }
})

// Cache music file
async function cacheMusicFile(url) {
  try {
    const cache = await caches.open(MUSIC_CACHE)
    const response = await fetch(url)
    
    if (response.ok) {
      await cache.put(url, response.clone())
      console.log('Music file cached:', url)
      return true
    }
  } catch (error) {
    console.error('Failed to cache music file:', url, error)
    return false
  }
}

// Clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys()
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    )
    console.log('All caches cleared')
    return true
  } catch (error) {
    console.error('Failed to clear caches:', error)
    return false
  }
}

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    console.log('Periodic sync triggered:', event.tag)
    
    if (event.tag === 'music-updates') {
      event.waitUntil(checkForMusicUpdates())
    }
  })
}

async function checkForMusicUpdates() {
  try {
    console.log('Checking for music updates...')
    
    // Check for new releases, recommendations, etc.
    // This would typically call your music API
    
    // Show notification if updates found
    const options = {
      body: 'New music and recommendations available!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'music-updates'
    }
    
    await self.registration.showNotification('Concerto Updates', options)
  } catch (error) {
    console.error('Failed to check for updates:', error)
  }
}

console.log('Concerto Service Worker loaded successfully!')
