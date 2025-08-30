import React, { useRef, useEffect, useState } from 'react';
import { useAudioStore } from '../../stores/audioStore';

interface AudioVisualizerProps {
  width?: number;
  height?: number;
  type?: 'bars' | 'waveform' | 'circle' | 'spectrum';
  audioData?: Uint8Array | null;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  width = 400, 
  height = 200, 
  type = 'bars',
  audioData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { isPlaying, currentTrack } = useAudioStore();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && window.AudioContext) {
      const context = new AudioContext();
      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 256;
      setAudioContext(context);
      setAnalyser(analyserNode);
      setDataArray(new Uint8Array(analyserNode.frequencyBinCount));
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !analyser || !isPlaying) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data as Uint8Array);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw based on type
      switch (type) {
        case 'bars':
          drawBars(ctx, data, width, height);
          break;
        case 'waveform':
          drawWaveform(ctx, data, width, height);
          break;
        case 'circle':
          drawCircle(ctx, data, width, height);
          break;
        case 'spectrum':
          drawSpectrum(ctx, data, width, height);
          break;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying, type, width, height]);

  // Use provided audioData if available
  useEffect(() => {
    if (audioData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw based on type
      switch (type) {
        case 'bars':
          drawBars(ctx, audioData, width, height);
          break;
        case 'waveform':
          drawWaveform(ctx, audioData, width, height);
          break;
        case 'circle':
          drawCircle(ctx, audioData, width, height);
          break;
        case 'spectrum':
          drawSpectrum(ctx, audioData, width, height);
          break;
      }
    }
  }, [audioData, type, width, height]);

  const drawBars = (ctx: CanvasRenderingContext2D, data: Uint8Array, width: number, height: number) => {
    const barWidth = width / data.length;
    const barSpacing = 2;

    data.forEach((value) => {
      const barHeight = (value / 255) * height;
      const x = (data.indexOf(value) * barWidth) + (data.indexOf(value) * barSpacing);
      const y = height - barHeight;

      const gradient = ctx.createLinearGradient(0, y, 0, height);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#1e40af');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - barSpacing, barHeight);
    });
  };

  const drawWaveform = (ctx: CanvasRenderingContext2D, data: Uint8Array, width: number, height: number) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const sliceWidth = width / data.length;
    let x = 0;

    data.forEach((value) => {
      const y = (value / 255) * height;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    });

    ctx.stroke();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, data: Uint8Array, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;

    data.forEach((value, index) => {
      const angle = (index / data.length) * 2 * Math.PI;
      const amplitude = (value / 255) * radius * 0.5;
      const x = centerX + Math.cos(angle) * (radius + amplitude);
      const y = centerY + Math.sin(angle) * (radius + amplitude);

      if (index === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.stroke();
  };

  const drawSpectrum = (ctx: CanvasRenderingContext2D, data: Uint8Array, width: number, height: number) => {
    const barHeight = height / data.length;

    data.forEach((value) => {
      const barWidth = (value / 255) * width;
      const y = data.indexOf(value) * barHeight;

      const gradient = ctx.createLinearGradient(0, y, barWidth, y);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#1e40af');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, y, barWidth, barHeight - 1);
    });
  };

  if (!isPlaying && !audioData) {
    return (
      <div className="flex items-center justify-center h-48 bg-dark-800 rounded-lg border border-dark-700">
        <p className="text-dark-400">No audio playing</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Audio Visualizer</h3>
        <div className="flex space-x-2">
          {['bars', 'waveform', 'circle', 'spectrum'].map((visualType) => (
            <button
              key={visualType}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                type === visualType
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
              }`}
            >
              {visualType.charAt(0).toUpperCase() + visualType.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto rounded-lg bg-dark-900"
      />
    </div>
  );
};

export default AudioVisualizer;
