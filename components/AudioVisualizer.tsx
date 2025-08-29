'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface AudioVisualizerProps {
  width?: number
  height?: number
  barCount?: number
  barWidth?: number
  barGap?: number
  color?: string
  backgroundColor?: string
  animationSpeed?: number
  type?: 'bars' | 'waveform' | 'circular' | '3d'
}

export default function AudioVisualizer({
  width = 800,
  height = 200,
  barCount = 64,
  barWidth = 8,
  barGap = 2,
  color = '#8b5cf6',
  backgroundColor = 'transparent',
  animationSpeed = 50,
  type = 'bars'
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [isPlaying, setIsPlaying] = useState(false)

  // Generate mock audio data for visualization
  const generateMockData = useCallback(() => {
    const data = new Uint8Array(barCount)
    for (let i = 0; i < barCount; i++) {
      // Create a more realistic audio pattern
      const baseValue = Math.random() * 0.3
      const frequency = (i / barCount) * Math.PI * 2
      const time = Date.now() * 0.001
      const waveValue = Math.sin(frequency + time) * 0.2
      const noiseValue = Math.random() * 0.1
      
      data[i] = Math.floor((baseValue + waveValue + noiseValue) * 255)
    }
    return data
  }, [barCount])

  const drawBars = useCallback((ctx: CanvasRenderingContext2D, data: Uint8Array) => {
    const barHeight = height / 255
    const totalBarWidth = barWidth + barGap
    const startX = (width - (barCount * totalBarWidth - barGap)) / 2

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < barCount; i++) {
      const barHeightValue = (data[i] / 255) * height
      const x = startX + i * totalBarWidth
      const y = height - barHeightValue

      // Create gradient effect
      const gradient = ctx.createLinearGradient(x, y, x, height)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, color + '80')

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeightValue)

      // Add glow effect
      ctx.shadowColor = color
      ctx.shadowBlur = 10
      ctx.fillRect(x, y, barWidth, barHeightValue)
      ctx.shadowBlur = 0
    }
  }, [width, height, barCount, barWidth, barGap, color, backgroundColor])

  const drawWaveform = useCallback((ctx: CanvasRenderingContext2D, data: Uint8Array) => {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    const centerY = height / 2
    const stepX = width / barCount

    for (let i = 0; i < barCount; i++) {
      const value = (data[i] / 255) * (height / 2)
      const x = i * stepX
      const y = centerY + (i % 2 === 0 ? value : -value)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()
  }, [width, height, barCount, color, backgroundColor])

  const drawCircular = useCallback((ctx: CanvasRenderingContext2D, data: Uint8Array) => {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 3
    const angleStep = (Math.PI * 2) / barCount

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 3

    for (let i = 0; i < barCount; i++) {
      const value = (data[i] / 255) * radius * 0.5
      const angle = i * angleStep
      const x1 = centerX + Math.cos(angle) * radius
      const y1 = centerY + Math.sin(angle) * radius
      const x2 = centerX + Math.cos(angle) * (radius + value)
      const y2 = centerY + Math.sin(angle) * (radius + value)

      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
    }

    ctx.stroke()
  }, [width, height, barCount, color, backgroundColor])

  const draw3D = useCallback((ctx: CanvasRenderingContext2D, data: Uint8Array) => {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) / 3

    for (let i = 0; i < barCount; i++) {
      const value = (data[i] / 255) * maxRadius
      const angle = (i / barCount) * Math.PI * 2
      const radius = maxRadius - value

      // Create 3D effect with multiple layers
      for (let layer = 0; layer < 3; layer++) {
        const layerRadius = radius + layer * 10
        const alpha = 1 - (layer * 0.3)
        
        ctx.beginPath()
        ctx.arc(centerX, centerY, layerRadius, 0, Math.PI * 2)
        ctx.strokeStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }
  }, [width, height, barCount, color, backgroundColor])

  const animate = useCallback(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const data = generateMockData()

    switch (type) {
      case 'bars':
        drawBars(ctx, data)
        break
      case 'waveform':
        drawWaveform(ctx, data)
        break
      case 'circular':
        drawCircular(ctx, data)
        break
      case '3d':
        draw3D(ctx, data)
        break
      default:
        drawBars(ctx, data)
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [type, generateMockData, drawBars, drawWaveform, drawCircular, draw3D])

  useEffect(() => {
    if (isPlaying) {
      animate()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, animate])

  useEffect(() => {
    // Simulate playing state
    setIsPlaying(true)
  }, [])

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto rounded-lg"
        style={{ backgroundColor }}
      />
      
      <div className="mt-4 flex items-center justify-center space-x-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'} Visualization
        </button>
        
        <select
          value={type}
          onChange={(e) => {
            const newType = e.target.value as 'bars' | 'waveform' | 'circular' | '3d'
            // Reset animation when changing type
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current)
            }
            // Trigger re-render
            setIsPlaying(false)
            setTimeout(() => setIsPlaying(true), 100)
          }}
          className="px-3 py-2 bg-dark-700 text-white rounded-lg border border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="bars">Bars</option>
          <option value="waveform">Waveform</option>
          <option value="circular">Circular</option>
          <option value="3d">3D</option>
        </select>
      </div>
    </div>
  )
}
