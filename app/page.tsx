import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
            Concerto
          </h1>
          <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Where every note matters. Discover, play, and enjoy music without limits - completely free.
          </p>
          <div className="flex gap-4 justify-center mb-12">
            <button className="btn-primary text-lg px-8 py-3">
              Start Listening
            </button>
            <button className="btn-secondary text-lg px-8 py-3">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎵</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Unlimited Music</h3>
            <p className="text-gray-400">Access millions of songs across all genres, completely free.</p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎧</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">High Quality</h3>
            <p className="text-gray-400">Crystal clear audio quality for the best listening experience.</p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Cross Platform</h3>
            <p className="text-gray-400">Listen on any device, anywhere, anytime.</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Coming Soon</h2>
        <p className="text-xl text-gray-400 mb-8">
          We're building something amazing. Stay tuned for the full Concerto experience.
        </p>
        <div className="inline-block bg-primary-600 text-white px-6 py-3 rounded-full">
          🚀 Development in Progress
        </div>
      </div>
    </main>
  )
}
