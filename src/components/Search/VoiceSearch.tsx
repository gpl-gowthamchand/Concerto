import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Search, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VoiceSearchProps {
  onClose: () => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let maxConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            maxConfidence = Math.max(maxConfidence, confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
        setConfidence(maxConfidence);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        setError('Failed to start voice recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSearch = () => {
    if (transcript.trim()) {
      navigate(`/search?q=${encodeURIComponent(transcript.trim())}`);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-dark-100 text-lg font-medium">Voice Search</h3>
            <button
              onClick={onClose}
              className="text-dark-400 hover:text-dark-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center py-8">
            <MicOff className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <p className="text-dark-300 mb-2">Voice Search Not Supported</p>
            <p className="text-dark-400 text-sm">
              Your browser doesn't support speech recognition. Please use text search instead.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-dark-100 text-lg font-medium">Voice Search</h3>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-dark-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Voice Input Area */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isListening ? (
                <MicOff className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-white" />
              )}
            </button>
            
            {/* Ripple effect when listening */}
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping" />
            )}
          </div>
          
          <p className="text-dark-300 mt-4">
            {isListening ? 'Listening...' : 'Click to start voice search'}
          </p>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mb-6">
            <label className="block text-dark-300 text-sm font-medium mb-2">
              What you said:
            </label>
            <div className="bg-dark-700 rounded-lg p-3 border border-dark-600">
              <p className="text-dark-100 text-lg">{transcript}</p>
              {confidence > 0 && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-dark-400 text-sm">Confidence:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-dark-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-300"
                        style={{ width: `${confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-dark-400 text-sm">
                      {Math.round(confidence * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!transcript.trim()}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Search className="h-4 w-4" />
          <span>Search for "{transcript}"</span>
        </button>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-dark-400 text-sm mb-2">Voice Search Tips:</p>
          <ul className="text-dark-500 text-xs space-y-1">
            <li>• Speak clearly and at a normal pace</li>
            <li>• Try saying "play [song name]" or "search for [artist]"</li>
            <li>• Use natural language like "songs by [artist]"</li>
            <li>• You can also search by mood or genre</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceSearch;
