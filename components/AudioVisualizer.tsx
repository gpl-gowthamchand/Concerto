'use client'

import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../contexts/PlayerContext'

interface AudioVisualizerProps {
  className?: string
  type?: 'waveform' | 'spectrum' | 'bars'
  height?: number
  color?: string
}

export default function AudioVisualizer({ 
  className = '', 
  type = 'bars',
  height = 60,
  color = '#0ea5e9'
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const { playerState } = usePlayer()
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null)

  useEffect(() => {
    if (!playerState.currentSong || !playerState.isPlaying) return

    const initAudioContext = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)()
        const analyserNode = context.createAnalyser()
        
        analyserNode.fftSize = 256
        analyserNode.smoothingTimeConstant = 0.8
        
        const bufferLength = analyserNode.frequencyBinCount
        const data = new Uint8Array(bufferLength) as Uint8Array
        
        setAudioContext(context)
        setAnalyser(analyserNode)
        setDataArray(data)
        
        // Connect to audio source (mock for now)
        // In real app, connect to actual audio element
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
  }, [playerState.currentSong, playerState.isPlaying])

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
        analyser.getByteFrequencyData(dataArray as any)
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      if (type === 'bars') {
        drawBars(ctx, dataArray, width, height, color)
      } else if (type === 'waveform') {
        drawWaveform(ctx, dataArray, width, height, color)
      } else if (type === 'spectrum') {
        drawSpectrum(ctx, dataArray, width, height, color)
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

  // Generate mock data for demo when audio context is not available
  const generateMockData = () => {
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
    }
  }

  useEffect(() => {
    if (!audioContext && playerState.isPlaying) {
      // Use mock data when audio context is not available
      const interval = setInterval(generateMockData, 100)
      return () => clearInterval(interval)
    }
  }, [audioContext, playerState.isPlaying])

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
