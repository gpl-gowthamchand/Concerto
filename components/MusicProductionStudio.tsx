'use client'

import { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Square, 
  Download, 
  Upload, 
  Save, 
  Trash2,
  Plus,
  Volume2,
  Music,
  Speaker,
  Circle,
  StopCircle,
  SkipBack
} from 'lucide-react'
import { SlideIn } from './PageTransition'

interface Track {
  id: string
  name: string
  type: 'drum' | 'bass' | 'melody' | 'vocal' | 'sample'
  volume: number
  pan: number
  muted: boolean
  solo: boolean
  clips: Clip[]
}

interface Clip {
  id: string
  name: string
  startTime: number
  duration: number
  sample: string
  volume: number
  pitch: number
  effects: AudioEffect[]
}

interface AudioEffect {
  id: string
  name: string
  type: 'reverb' | 'delay' | 'compression' | 'distortion'
  parameters: Record<string, number>
}

interface Sample {
  id: string
  name: string
  category: string
  duration: number
  bpm: number
  key: string
  tags: string[]
  audioUrl: string
}

interface MusicProductionStudioProps {
  onSave: (project: Record<string, unknown>) => void
  onExport: (format: string) => void
}

export default function MusicProductionStudio({
  onSave,
  onExport
}: MusicProductionStudioProps) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [samples, setSamples] = useState<Sample[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [projectLength, setProjectLength] = useState(120) // 2 minutes
  const [bpm, setBpm] = useState(120)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [showSampleLibrary, setShowSampleLibrary] = useState(false)
  const [showEffects, setShowEffects] = useState(false)
  const [recordingAudio, setRecordingAudio] = useState<MediaRecorder | null>(null)

  // Initialize with default tracks
  useEffect(() => {
    const defaultTracks: Track[] = [
      {
        id: '1',
        name: 'Drums',
        type: 'drum',
        volume: 0.8,
        pan: 0,
        muted: false,
        solo: false,
        clips: []
      },
      {
        id: '2',
        name: 'Bass',
        type: 'bass',
        volume: 0.7,
        pan: 0,
        muted: false,
        solo: false,
        clips: []
      },
      {
        id: '3',
        name: 'Melody',
        type: 'melody',
        volume: 0.6,
        pan: 0,
        muted: false,
        solo: false,
        clips: []
      },
      {
        id: '4',
        name: 'Vocals',
        type: 'vocal',
        volume: 0.8,
        pan: 0,
        muted: false,
        solo: false,
        clips: []
      }
    ]

    const defaultSamples: Sample[] = [
      {
        id: '1',
        name: 'Kick Drum',
        category: 'Drums',
        duration: 0.5,
        bpm: 120,
        key: 'C',
        tags: ['kick', 'drum', 'electronic'],
        audioUrl: '/samples/kick.mp3'
      },
      {
        id: '2',
        name: 'Snare Drum',
        category: 'Drums',
        duration: 0.3,
        bpm: 120,
        key: 'C',
        tags: ['snare', 'drum', 'electronic'],
        audioUrl: '/samples/snare.mp3'
      },
      {
        id: '3',
        name: 'Bass Line',
        category: 'Bass',
        duration: 2.0,
        bpm: 120,
        key: 'C',
        tags: ['bass', 'line', 'electronic'],
        audioUrl: '/samples/bass.mp3'
      }
    ]

    setTracks(defaultTracks)
    setSamples(defaultSamples)
  }, [])

  // Playback controls
  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    if (isPlaying) {
      // Stop playback
      setCurrentTime(0)
    }
  }

  const stopPlayback = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  // Recording controls
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        // Here you would typically save the recorded audio
        console.log('Recording saved:', url)
      }

      mediaRecorder.start()
      setRecordingAudio(mediaRecorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (recordingAudio) {
      recordingAudio.stop()
      recordingAudio.stream.getTracks().forEach(track => track.stop())
      setRecordingAudio(null)
      setIsRecording(false)
    }
  }

  // Track management
  const addTrack = () => {
    const newTrack: Track = {
      id: Date.now().toString(),
      name: `Track ${tracks.length + 1}`,
      type: 'sample',
      volume: 0.7,
      pan: 0,
      muted: false,
      solo: false,
      clips: []
    }
    setTracks([...tracks, newTrack])
  }

  const deleteTrack = (trackId: string) => {
    setTracks(tracks.filter(track => track.id !== trackId))
  }

  const updateTrack = (trackId: string, updates: Partial<Track>) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, ...updates } : track
    ))
  }

  // Sample management
  const addSampleToTrack = (trackId: string, sample: Sample, startTime: number) => {
    const newClip: Clip = {
      id: Date.now().toString(),
      name: sample.name,
      startTime,
      duration: sample.duration,
      sample: sample.audioUrl,
      volume: 1.0,
      pitch: 1.0,
      effects: []
    }

    setTracks(tracks.map(track => {
      if (track.id === trackId) {
        return {
          ...track,
          clips: [...track.clips, newClip]
        }
      }
      return track
    }))
  }

  // Timeline grid
  const timelineGrid = Array.from({ length: Math.ceil(projectLength / 4) }, (_, i) => i * 4)

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl">
              <Music className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Music Production Studio
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Create, record, and produce professional music with our comprehensive studio tools
          </p>
        </div>

        {/* Transport Controls */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Transport</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">BPM:</span>
                <input
                  type="number"
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value) || 120)}
                  className="w-20 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center"
                  min="60"
                  max="200"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Length:</span>
                <input
                  type="number"
                  value={projectLength}
                  onChange={(e) => setProjectLength(parseInt(e.target.value) || 120)}
                  className="w-20 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center"
                  min="30"
                  max="600"
                />
                <span className="text-gray-400">sec</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mb-6">
            <button className="p-3 text-gray-400 hover:text-white transition-colors">
              <SkipBack className="w-6 h-6" />
            </button>
            <button
              onClick={togglePlayback}
              className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </button>
            <button
              onClick={stopPlayback}
              className="p-3 text-gray-400 hover:text-white transition-colors"
            >
              <Square className="w-6 h-6" />
            </button>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
                              {isRecording ? <StopCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / projectLength) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(projectLength)}</span>
          </div>
        </div>

        {/* Main Studio Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Track List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Tracks</h3>
                <button
                  onClick={addTrack}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTrack === track.id
                        ? 'bg-blue-600/20 border border-blue-500'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedTrack(track.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{track.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTrack(track.id)
                        }}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-3 h-3 text-gray-400" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={track.volume}
                          onChange={(e) => updateTrack(track.id, { volume: parseFloat(e.target.value) })}
                          className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Speaker className="w-3 h-3 text-gray-400" />
                        <input
                          type="range"
                          min="-1"
                          max="1"
                          step="0.01"
                          value={track.pan}
                          onChange={(e) => updateTrack(track.id, { pan: parseFloat(e.target.value) })}
                          className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          updateTrack(track.id, { muted: !track.muted })
                        }}
                        className={`p-1 rounded text-xs ${
                          track.muted ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        M
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          updateTrack(track.id, { solo: !track.solo })
                        }}
                        className={`p-1 rounded text-xs ${
                          track.solo ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        S
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              {/* Timeline Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Timeline</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowSampleLibrary(!showSampleLibrary)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                    >
                      Sample Library
                    </button>
                    <button
                      onClick={() => setShowEffects(!showEffects)}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
                    >
                      Effects
                    </button>
                  </div>
                </div>
                
                {/* Time Markers */}
                <div className="flex mt-4 space-x-1">
                  {timelineGrid.map((time) => (
                    <div key={time} className="flex-1 text-center text-xs text-gray-400">
                      {formatTime(time)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Track Timeline */}
              <div className="p-4">
                <div className="space-y-4">
                  {tracks.map((track) => (
                    <div key={track.id} className="flex items-center space-x-4">
                      <div className="w-32 text-sm text-gray-400">{track.name}</div>
                      
                      {/* Timeline Grid */}
                      <div className="flex-1 bg-gray-700 rounded-lg p-2 relative h-16">
                        <div className="grid grid-cols-12 gap-1 h-full">
                          {Array.from({ length: 12 }, (_, i) => (
                            <div key={i} className="border border-gray-600 rounded"></div>
                          ))}
                        </div>
                        
                        {/* Clips */}
                        {track.clips.map((clip) => (
                          <div
                            key={clip.id}
                            className="absolute top-1 bottom-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded cursor-pointer hover:from-blue-400 hover:to-purple-500 transition-colors"
                            style={{
                              left: `${(clip.startTime / projectLength) * 100}%`,
                              width: `${(clip.duration / projectLength) * 100}%`
                            }}
                          >
                            <div className="p-1 text-xs text-white truncate">{clip.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Library */}
        {showSampleLibrary && (
          <SlideIn className="mt-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Sample Library</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {samples.map((sample) => (
                  <div
                    key={sample.id}
                    className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={() => {
                      if (selectedTrack) {
                        addSampleToTrack(selectedTrack, sample, currentTime)
                      }
                    }}
                  >
                    <div className="text-white font-medium mb-2">{sample.name}</div>
                    <div className="text-gray-400 text-sm space-y-1">
                      <div>Category: {sample.category}</div>
                      <div>Duration: {sample.duration}s</div>
                      <div>BPM: {sample.bpm}</div>
                      <div>Key: {sample.key}</div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sample.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SlideIn>
        )}

        {/* Effects Panel */}
        {showEffects && (
          <SlideIn className="mt-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Audio Effects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Reverb', 'Delay', 'Compression', 'Distortion', 'EQ', 'Chorus'].map((effect) => (
                  <div key={effect} className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
                    <div className="text-white font-medium mb-2">{effect}</div>
                    <div className="text-gray-400 text-sm">Add {effect.toLowerCase()} effect to selected track</div>
                  </div>
                ))}
              </div>
            </div>
          </SlideIn>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button
            onClick={() => onSave({ tracks, bpm, projectLength })}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Project</span>
          </button>
          
          <button
            onClick={() => onExport('wav')}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export WAV</span>
          </button>
          
          <button
            onClick={() => onExport('mp3')}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Export MP3</span>
          </button>
        </div>
      </div>
    </div>
  )
}
