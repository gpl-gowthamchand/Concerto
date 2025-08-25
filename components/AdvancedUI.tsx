'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Sparkles, 
  Zap, 
  Star, 
  Heart, 
  Play, 
  SkipForward,
  SkipBack,
  Volume2,
  Music,
  TrendingUp,
  Award
} from 'lucide-react'

interface AnimatedCard {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  color: string
  animation: string
}

export default function AdvancedUI() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [activeAnimation, setActiveAnimation] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const animatedCards: AnimatedCard[] = [
    {
      id: 'card1',
      title: 'Smooth Transitions',
      subtitle: 'Fluid animations between states',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      animation: 'bounce-in'
    },
    {
      id: 'card2',
      title: 'Micro Interactions',
      subtitle: 'Delightful hover effects',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      animation: 'slide-up'
    },
    {
      id: 'card3',
      title: 'Particle Effects',
      subtitle: 'Dynamic visual feedback',
      icon: <Star className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      animation: 'fade-in'
    },
    {
      id: 'card4',
      title: 'Gesture Support',
      subtitle: 'Touch and mouse interactions',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-red-500 to-orange-500',
      animation: 'scale-in'
    }
  ]

  // Particle system
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      color: string
    }> = []

    const createParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 2 + 1
      const colors = ['#0ea5e9', '#8b5cf6', '#ec4899', '#10b981']
      
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 0.02
        
        if (particle.life <= 0) {
          particles.splice(index, 1)
          return
        }

        ctx.save()
        ctx.globalAlpha = particle.life
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Create particles on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      if (Math.random() < 0.3) {
        createParticle(x, y)
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    return () => canvas.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleCardHover = (cardId: string) => {
    setHoveredCard(cardId)
    setActiveAnimation(cardId)
    
    // Add particles
  }

  const handleCardLeave = () => {
    setHoveredCard(null)
    setActiveAnimation('')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Advanced UI Components
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Experience smooth animations, micro-interactions, and delightful visual effects that make Concerto feel premium and responsive.
        </p>
      </div>

      {/* Animated Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {animatedCards.map((card, index) => (
          <div
            key={card.id}
            onMouseEnter={() => handleCardHover(card.id)}
            onMouseLeave={handleCardLeave}
            className={`
              relative overflow-hidden bg-dark-800 rounded-xl border border-dark-700 p-6
              transition-all duration-500 ease-out cursor-pointer
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              ${hoveredCard === card.id ? 'scale-105 shadow-2xl' : 'hover:scale-102'}
              ${activeAnimation === card.id ? 'ring-2 ring-primary-500/50' : ''}
            `}
            style={{
              animationDelay: `${index * 100}ms`,
              transform: hoveredCard === card.id ? 'rotateY(5deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity duration-300 ${
              hoveredCard === card.id ? 'opacity-10' : ''
            }`} />
            
            {/* Icon */}
            <div className={`relative w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 ${
              hoveredCard === card.id ? 'scale-110 rotate-12' : ''
            }`}>
              <div className="text-white">
                {card.icon}
              </div>
            </div>
            
            {/* Content */}
            <h3 className="relative text-xl font-semibold text-white mb-2 transition-colors duration-300">
              {card.title}
            </h3>
            <p className="relative text-gray-400 text-sm leading-relaxed">
              {card.subtitle}
            </p>
            
            {/* Hover Effect Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity duration-300 ${
              hoveredCard === card.id ? 'opacity-5' : ''
            }`} />
          </div>
        ))}
      </div>

      {/* Interactive Music Player Demo */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Interactive Music Player</h3>
        
        <div className="max-w-md mx-auto space-y-6">
          {/* Album Art */}
          <div className="relative group">
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
              <Music className="w-20 h-20 text-white" />
            </div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${10 + (i % 2) * 80}%`,
                    animationDelay: `${i * 200}ms`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Song Info */}
          <div className="text-center space-y-2">
            <h4 className="text-xl font-semibold text-white">Bohemian Rhapsody</h4>
            <p className="text-gray-400">Queen • A Night at the Opera</p>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>2:34</span>
              <span>5:55</span>
            </div>
            <div className="relative h-2 bg-dark-600 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-300 hover:scale-y-125" />
              <div className="absolute inset-y-0 left-0 w-2/5 h-full bg-gradient-to-r from-primary-400 to-purple-400 rounded-full blur-sm opacity-50" />
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center space-x-6">
            <button className="p-3 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12">
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary-500/25">
              <Play className="w-8 h-8 ml-1" />
            </button>
            
            <button className="p-3 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:-rotate-12">
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <Volume2 className="w-5 h-5 text-gray-400" />
            <div className="flex-1 h-2 bg-dark-600 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-300 hover:scale-y-125" />
            </div>
          </div>
        </div>
      </div>

      {/* Particle Canvas */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Interactive Particle System</h3>
        <p className="text-gray-400 text-center mb-4">Move your mouse over this area to create particles</p>
        
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-48 bg-dark-700 rounded-lg border border-dark-600 cursor-crosshair"
        />
      </div>

      {/* Achievement Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <TrendingUp className="w-8 h-8" />, title: 'Trending', color: 'from-green-500 to-emerald-500' },
          { icon: <Award className="w-8 h-8" />, title: 'Top Rated', color: 'from-yellow-500 to-orange-500' },
          { icon: <Heart className="w-8 h-8" />, title: 'Most Loved', color: 'from-red-500 to-pink-500' },
          { icon: <Star className="w-8 h-8" />, title: 'Featured', color: 'from-purple-500 to-indigo-500' }
        ].map((badge, index) => (
          <div
            key={badge.title}
            className={`
              bg-dark-800 rounded-xl border border-dark-700 p-6 text-center
              transition-all duration-500 ease-out cursor-pointer
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25
            `}
            style={{ animationDelay: `${(index + 4) * 100}ms` }}
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-12`}>
              <div className="text-white">
                {badge.icon}
              </div>
            </div>
            <h4 className="text-white font-semibold">{badge.title}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}
