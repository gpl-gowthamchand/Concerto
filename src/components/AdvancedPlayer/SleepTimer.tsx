import React, { useState } from 'react';

interface SleepTimerProps {
  sleepTimer: number;
  sleepTimerActive: boolean;
  onSleepTimerChange: (minutes: number) => void;
  onSleepTimerToggle: (active: boolean) => void;
}

const SleepTimer: React.FC<SleepTimerProps> = ({
  sleepTimer,
  sleepTimerActive,
  onSleepTimerChange,
  onSleepTimerToggle,
}) => {
  const [customMinutes, setCustomMinutes] = useState(30);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const presetTimes = [5, 10, 15, 30, 45, 60, 90, 120];

  const handlePresetTime = (minutes: number) => {
    onSleepTimerChange(minutes);
    onSleepTimerToggle(true);
  };

  const handleCustomTime = () => {
    if (customMinutes > 0) {
      onSleepTimerChange(customMinutes);
      onSleepTimerToggle(true);
      setShowCustomInput(false);
    }
  };

  const handleStopTimer = () => {
    onSleepTimerToggle(false);
    onSleepTimerChange(0);
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  const getTimeRemaining = (): string => {
    if (!sleepTimerActive || sleepTimer === 0) return '';
    
    const now = new Date();
    const endTime = new Date(now.getTime() + sleepTimer * 60000);
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Timer expired';
    
    const remainingMinutes = Math.ceil(diff / 60000);
    return formatTime(remainingMinutes);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-white font-medium">Sleep Timer</h4>
      
      {/* Timer Status */}
      {sleepTimerActive && (
        <div className="bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-300 text-sm font-medium">Timer Active</span>
            </div>
            <button
              onClick={handleStopTimer}
              className="text-blue-300 hover:text-blue-200 text-sm transition-colors"
            >
              Stop
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-1">
            Music will stop in {getTimeRemaining()}
          </p>
        </div>
      )}

      {/* Preset Times */}
      <div className="space-y-2">
        <label className="text-gray-300 text-sm">Quick Settings</label>
        <div className="grid grid-cols-4 gap-2">
          {presetTimes.map((minutes) => (
            <button
              key={minutes}
              onClick={() => handlePresetTime(minutes)}
              disabled={sleepTimerActive}
              className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                sleepTimerActive
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {formatTime(minutes)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Time */}
      <div className="space-y-2">
        <label className="text-gray-300 text-sm">Custom Time</label>
        {showCustomInput ? (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max="480"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 0)}
              className="flex-1 py-2 px-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter minutes"
            />
            <button
              onClick={handleCustomTime}
              disabled={customMinutes <= 0}
              className="py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Set
            </button>
            <button
              onClick={() => setShowCustomInput(false)}
              className="py-2 px-3 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            disabled={sleepTimerActive}
            className={`w-full py-2 px-3 rounded-lg text-sm transition-colors ${
              sleepTimerActive
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            Custom Time
          </button>
        )}
      </div>

      {/* Timer Info */}
      <div className="text-gray-500 text-xs space-y-1">
        <p>• Timer will automatically stop music</p>
        <p>• Timer resets when you change songs</p>
        <p>• Maximum timer: 8 hours (480 minutes)</p>
      </div>

      {/* Current Timer Display */}
      {sleepTimer > 0 && (
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Current Timer</span>
            <span className="text-white font-medium">{formatTime(sleepTimer)}</span>
          </div>
          {sleepTimerActive && (
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.max(0, Math.min(100, (sleepTimer / sleepTimer) * 100))}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SleepTimer;
