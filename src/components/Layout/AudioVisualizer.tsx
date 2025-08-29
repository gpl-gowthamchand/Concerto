import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bars = 64;
    const barWidth = canvas.width / bars;
    let time = 0;

    const animate = () => {
      if (!isPlaying) {
        // Static visualization when not playing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < bars; i++) {
          const height = Math.random() * 20 + 5;
          const x = i * barWidth;
          const y = canvas.height - height;
          
          ctx.fillStyle = `hsl(${200 + i * 2}, 70%, 60%)`;
          ctx.fillRect(x, y, barWidth - 1, height);
        }
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Animated visualization when playing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < bars; i++) {
        const frequency = (i / bars) * 2 + 0.1;
        const amplitude = Math.sin(time * frequency) * 0.5 + 0.5;
        const height = amplitude * (canvas.height * 0.8) + 10;
        const x = i * barWidth;
        const y = canvas.height - height;
        
        // Create gradient effect
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
        gradient.addColorStop(0, `hsl(${200 + i * 2}, 70%, 60%)`);
        gradient.addColorStop(1, `hsl(${200 + i * 2}, 70%, 30%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 1, height);
        
        // Add glow effect
        ctx.shadowColor = `hsl(${200 + i * 2}, 70%, 60%)`;
        ctx.shadowBlur = 10;
        ctx.fillRect(x, y, barWidth - 1, height);
        ctx.shadowBlur = 0;
      }
      
      time += 0.05;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="bg-dark-900 p-4 border-t border-dark-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-dark-100 font-medium">Audio Visualizer</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-dark-700 text-dark-300 text-xs rounded hover:bg-dark-600 transition-colors">
            Waveform
          </button>
          <button className="px-3 py-1 bg-primary-600 text-white text-xs rounded">
            Bars
          </button>
          <button className="px-3 py-1 bg-dark-700 text-dark-300 text-xs rounded hover:bg-dark-600 transition-colors">
            Circle
          </button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={120}
        className="w-full h-30 rounded-lg bg-dark-800 border border-dark-700"
      />
      
      <div className="flex items-center justify-between mt-3 text-xs text-dark-400">
        <span>Frequency Spectrum</span>
        <span>Real-time Analysis</span>
      </div>
    </div>
  );
};

export default AudioVisualizer;
