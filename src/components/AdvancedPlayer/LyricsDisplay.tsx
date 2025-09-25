import React, { useState, useEffect } from 'react';

interface LyricsDisplayProps {
  lyrics: string;
  currentTime: number;
  onClose: () => void;
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({
  lyrics,
  currentTime,
  onClose,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');

  // Parse lyrics with timestamps (if available)
  const parseLyrics = (lyricsText: string) => {
    const lines = lyricsText.split('\n');
    const parsedLines = lines.map((line, index) => {
      // Simple parsing - in a real implementation, you'd parse actual timestamp formats
      const timestampMatch = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\]/);
      if (timestampMatch) {
        const minutes = parseInt(timestampMatch[1]);
        const seconds = parseInt(timestampMatch[2]);
        const centiseconds = parseInt(timestampMatch[3]);
        const timestamp = minutes * 60 + seconds + centiseconds / 100;
        return {
          text: line.replace(/^\[\d{2}:\d{2}\.\d{2}\]/, '').trim(),
          timestamp,
          index
        };
      }
      return {
        text: line,
        timestamp: null,
        index
      };
    });
    return parsedLines;
  };

  const parsedLyrics = parseLyrics(lyrics);

  // Find current line based on timestamp
  const getCurrentLine = () => {
    const currentLine = parsedLyrics.find((line, index) => {
      const nextLine = parsedLyrics[index + 1];
      if (line.timestamp !== null && line.timestamp <= currentTime) {
        if (!nextLine || nextLine.timestamp === null || nextLine.timestamp > currentTime) {
          return true;
        }
      }
      return false;
    });
    return currentLine;
  };

  const currentLine = getCurrentLine();
  const currentLineIndex = currentLine ? currentLine.index : -1;

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(Math.max(12, Math.min(24, newSize)));
  };

  const handleTextAlignChange = (align: 'left' | 'center' | 'right') => {
    setTextAlign(align);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!lyrics || lyrics.trim() === '') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Lyrics</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-center text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">No lyrics available</p>
            <p className="text-sm mt-2">Lyrics for this song are not available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-gray-900 rounded-lg ${isFullscreen ? 'w-full h-full rounded-none' : 'max-w-4xl w-full max-h-[80vh]'} flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-white text-lg font-semibold">Lyrics</h3>
          <div className="flex items-center space-x-4">
            {/* Font Size Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFontSizeChange(fontSize - 2)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Decrease font size"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-gray-400 text-sm">{fontSize}px</span>
              <button
                onClick={() => handleFontSizeChange(fontSize + 2)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Increase font size"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Text Alignment */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleTextAlignChange('left')}
                className={`p-1 rounded ${textAlign === 'left' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                title="Align left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </button>
              <button
                onClick={() => handleTextAlignChange('center')}
                className={`p-1 rounded ${textAlign === 'center' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                title="Align center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-8 6h8" />
                </svg>
              </button>
              <button
                onClick={() => handleTextAlignChange('right')}
                className={`p-1 rounded ${textAlign === 'right' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                title="Align right"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h12m-8 6h8" />
                </svg>
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleFullscreenToggle}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Close lyrics"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lyrics Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="text-white leading-relaxed"
            style={{
              fontSize: `${fontSize}px`,
              textAlign: textAlign,
              lineHeight: '1.8'
            }}
          >
            {parsedLyrics.map((line, index) => (
              <div
                key={index}
                className={`mb-2 transition-all duration-300 ${
                  index === currentLineIndex
                    ? 'text-yellow-400 font-semibold scale-105'
                    : index < currentLineIndex
                    ? 'text-gray-500'
                    : 'text-gray-300'
                }`}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
};

export default LyricsDisplay;
