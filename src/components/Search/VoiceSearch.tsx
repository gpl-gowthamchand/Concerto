import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X } from 'lucide-react';

interface VoiceSearchProps {
  onClose: () => void;
  onTranscript: (transcript: string) => void;
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceSearch({ onClose, onTranscript }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isListening) {
      startListening();
    }
  }, [isListening]);

  const startListening = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setError('Speech recognition is not supported in this browser');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setIsListening(false);
        onTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setIsListening(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Voice Search
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <MicOff className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Try using a different browser or check your microphone permissions.
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <button
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>
            
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {isListening ? 'Listening... Speak now!' : 'Click to start voice search'}
            </p>
            
            {transcript && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>You said:</strong> {transcript}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
