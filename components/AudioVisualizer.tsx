'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePlayer } from '../contexts/PlayerContext'

// Type definition for webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

interface AudioVisualizerProps {
  className?: string
  type?: 'waveform' | 'spectrum' | 'bars' | 'circular' | '3d'
  height?: number
  color?: string
  audioElement?: HTMLAudioElement | null
}

export default function AudioVisualizer({ 
  className = '', 
  type = 'bars',
  height = 60,
  color = '#0ea5e9',
  audioElement
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const { playerState } = usePlayer()
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null)

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!playerState.currentSong || !playerState.isPlaying) return

    const initAudioContext = async () => {
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)()
        const analyserNode = context.createAnalyser()
        
        // Enhanced analyzer settings
        analyserNode.fftSize = 512 // Higher resolution
        analyserNode.smoothingTimeConstant = 0.6 // More responsive
        analyserNode.minDecibels = -90
        analyserNode.maxDecibels = -10
        
        const bufferLength = analyserNode.frequencyBinCount
        const data = new Uint8Array(bufferLength)
        
        setAudioContext(context)
        setAnalyser(analyserNode)
        setDataArray(data)
        
        // Connect to real audio source if available
        if (audioElement && context.state === 'running') {
          try {
            const source = context.createMediaElementSource(audioElement)
            source.connect(analyserNode)
            analyserNode.connect(context.destination)
          } catch {
            console.log('Audio source already connected or not available')
          }
        }
      } catch (error) {
        console.error('Audio context not supported:', error)
      }
    }

    initAudioContext()

    return () => {
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [playerState.currentSong, playerState.isPlaying, audioElement, audioContext])

  useEffect(() => {
    if (!canvasRef.current || !analyser || !dataArray) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const width = canvas.width
    const height = canvas.height

    const draw = () => {
      if (!analyser || !dataArray) return

      // Get frequency data
      if (dataArray) {
        analyser.getByteFrequencyData(dataArray)
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      if (type === 'bars') {
        drawBars(ctx, dataArray, width, height, color)
      } else if (type === 'waveform') {
        drawWaveform(ctx, dataArray, width, height, color)
      } else if (type === 'spectrum') {
        drawSpectrum(ctx, dataArray, width, height, color)
      } else if (type === 'circular') {
        drawCircular(ctx, dataArray, width, height, color)
      } else if (type === '3d') {
        draw3D(ctx, dataArray, width, height, color)
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [analyser, dataArray, type, color])

  const drawBars = (
    ctx: CanvasRenderingContext2D, 
    data: Uint8Array, 
    width: number, 
    height: number, 
    color: string
  ) => {
    const barWidth = width / data.length
    const barSpacing = 2

    data.forEach((value, index) => {
      const barHeight = (value / 255) * height
      const x = index * (barWidth + barSpacing)
      const y = height - barHeight

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, height)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, `${color}80`)

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)
    })
  }

  const drawWaveform = (
    ctx: CanvasRenderingContext2D, 
    data: Uint8Array, 
    width: number, 
    height: number, 
    color: string
  ) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    const sliceWidth = width / data.length
    let x = 0

    data.forEach((value, index) => {
      const y = (value / 255) * height
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      
      x += sliceWidth
    })

    ctx.stroke()
  }

  const drawSpectrum = (
    ctx: CanvasRenderingContext2D, 
    data: Uint8Array, 
    width: number, 
    height: number, 
    color: string
  ) => {
    const centerY = height / 2
    const sliceWidth = width / data.length

    data.forEach((value, index) => {
      const amplitude = (value / 255) * (height / 2)
      const x = index * sliceWidth
      
      // Top half
      ctx.fillStyle = color
      ctx.fillRect(x, centerY - amplitude, sliceWidth - 1, amplitude)
      
      // Bottom half (mirrored)
      ctx.fillRect(x, centerY, sliceWidth - 1, amplitude)
    })
  }

  const drawCircular = (
    ctx: CanvasRenderingContext2D, 
    data: Uint8Array, 
    width: number, 
    height: number, 
    color: string
  ) => {
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 3
    const barCount = data.length
    const angleStep = (2 * Math.PI) / barCount

    ctx.strokeStyle = color
    ctx.lineWidth = 2

    data.forEach((value, index) => {
      const angle = index * angleStep
      const amplitude = (value / 255) * radius * 0.5
      
      const x1 = centerX + Math.cos(angle) * radius
      const y1 = centerY + Math.sin(angle) * radius
      const x2 = centerX + Math.cos(angle) * (radius + amplitude)
      const y2 = centerY + Math.sin(angle) * (radius + amplitude)
      
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    })
  }

  const draw3D = (
    ctx: CanvasRenderingContext2D, 
    data: Uint8Array, 
    width: number, 
    height: number, 
    color: string
  ) => {
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) / 2.5

    // Create gradient for 3D effect
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.7, color + '80')
    gradient.addColorStop(1, color + '20')

    ctx.fillStyle = gradient

    data.forEach((value, index) => {
      const angle = (index / data.length) * 2 * Math.PI
      const amplitude = (value / 255) * maxRadius * 0.8
      
      const x = centerX + Math.cos(angle) * amplitude
      const y = centerY + Math.sin(angle) * amplitude
      
      // Draw 3D bars
      const barHeight = (value / 255) * 20
      ctx.fillRect(x - 2, y - barHeight / 2, 4, barHeight)
    })
  }

  // Generate mock data for demo when audio context is not available
  const generateMockData = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const width = canvas.width
    const height = canvas.height

    const mockData = new Uint8Array(64)
    for (let i = 0; i < mockData.length; i++) {
      mockData[i] = Math.random() * 255
    }

    if (type === 'bars') {
      drawBars(ctx, mockData, width, height, color)
    } else if (type === 'waveform') {
      drawWaveform(ctx, mockData, width, height, color)
    } else if (type === 'spectrum') {
      drawSpectrum(ctx, mockData, width, height, color)
    } else if (type === 'circular') {
      drawCircular(ctx, mockData, width, height, color)
    } else if (type === '3d') {
      draw3D(ctx, mockData, width, height, color)
    }
  }, [type, color])

  useEffect(() => {
    if (!audioContext && playerState.isPlaying) {
      // Use mock data when audio context is not available
      const interval = setInterval(generateMockData, 100)
      return () => clearInterval(interval)
    }
  }, [audioContext, playerState.isPlaying, generateMockData])

  return (
    <div className={`audio-visualizer ${className}`}>
      <canvas
        ref={canvasRef}
        width={300}
        height={height}
        className="w-full h-full"
        style={{ 
          background: 'transparent',
          borderRadius: '8px'
        }}
      />
    </div>
  )
}
