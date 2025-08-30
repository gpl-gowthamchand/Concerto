import React, { useRef, useEffect, useState } from 'react';
import { useAudioStore } from '../../stores/audioStore';

interface AudioVisualizerProps {
  width?: number;
  height?: number;
  type?: 'bars' | 'waveform' | 'circle' | 'spectrum';
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  width = 400, 
  height = 200, 
  type = 'bars' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { isPlaying, currentTrack } = useAudioStore();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      const context = new AudioContext();
      const analyserNode = context.createAnalyser();
      
      analyserNode.fftSize = 256;
      const bufferLength = analyserNode.frequencyBinCount;
      const data = new Uint8Array(bufferLength);
      
      setAudioContext(context);
      setAnalyser(analyserNode);
      setDataArray(data);
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || !analyser || !dataArray) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!analyser || !dataArray) return;

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      switch (type) {
        case 'bars':
          drawBars(ctx, dataArray, width, height);
          break;
        case 'waveform':
          drawWaveform(ctx, dataArray, width, height);
          break;
        case 'circle':
          drawCircle(ctx, dataArray, width, height);
          break;
        case 'spectrum':
          drawSpectrum(ctx, dataArray, width, height);
          break;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, analyser, dataArray, type, width, height]);

  const drawBars = (ctx: CanvasRenderingContext2D, data: Uint8Array, width: number, height: number) => {
    const barWidth = width / data.length;
    const barSpacing = 2;

    data.forEach((value, index) => {
      const barHeight = (value / 255) * height;
      const x = index * (barWidth + barSpacing);
      const y = height - barHeight;

      const gradient = ctx.createLinearGradient(0, y, 0, height);
      gradient.addColorStop(0, '#0ea5e9');
      gradient.addColorStop(1, '#d946ef');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
    });
  };

  const drawWaveform = (ctx: CanvasRenderingContext2D, data: Uint8Array, width: number, height: number) => {
    ctx.beginPath();
    ctx.moveTo(0, height / 2);

    const sliceWidth = width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, data: Uint8Array, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    const sliceAngle = (2 * Math.PI) / data.length;
    let angle = 0;

    data.forEach((value, index) => {
      const barLength = (value / 255) * radius * 0.5;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barLength);
      const y2 = centerY + Math.sin(angle) * (radius + barLength);

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, '#0ea5e9');
      gradient.addColorStop(1, '#d946ef');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      angle += sliceAngle;
    });
  };

  const drawSpectrum = (ctx: CanvasRenderingContext2D, data: Uint8Array, width: number, height: number) => {
    const barWidth = width / data.length;
    const barSpacing = 1;

    data.forEach((value, index) => {
      const barHeight = (value / 255) * height;
      const x = index * (barWidth + barSpacing);
      const y = height - barHeight;

      const hue = (index / data.length) * 360;
      const saturation = 80;
      const lightness = 50 + (value / 255) * 30;

      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.fillRect(x, y, barWidth, barHeight);
    });
  };

  if (!isPlaying) {
    return (
      <div className="flex items-center justify-center h-48 bg-dark-800 rounded-lg border border-dark-700">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-dark-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-dark-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-dark-400 text-sm">No audio playing</p>
        </div>
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
              onClick={() => {}}
              className={`px-2 py-1 text-xs rounded ${
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
        className="w-full h-48 bg-dark-900 rounded-lg"
      />
      
      {currentTrack && (
        <div className="mt-4 p-3 bg-dark-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <img
              src={currentTrack.artwork || '/default-artwork.png'}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{currentTrack.title}</p>
              <p className="text-dark-400 text-sm truncate">{currentTrack.artist}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;
