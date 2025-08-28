'use client'

import { useState } from 'react'
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, setTheme, isDark, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Bright and clean' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { value: 'auto', label: 'Auto', icon: Monitor, description: 'Follows system' }
  ]

  return (
    <div className="relative">
      {/* Quick Toggle Button */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200 group relative"
        title={`Current: ${themes.find(t => t.value === theme)?.label}. Click to toggle.`}
      >
        <Sun className={`w-5 h-5 transition-all duration-300 ${
          isDark ? 'text-gray-400 rotate-90 scale-75' : 'text-yellow-500 rotate-0 scale-100'
        }`} />
        <Moon className={`w-5 h-5 absolute inset-0 m-auto transition-all duration-300 ${
          isDark ? 'text-blue-400 rotate-0 scale-100' : 'text-gray-400 -rotate-90 scale-75'
        }`} />
        
        {/* Hover effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </button>

      {/* Theme Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200 flex items-center space-x-2"
          title="Choose theme"
        >
          <span className="text-sm text-gray-300 hidden sm:block">{themes.find(t => t.value === theme)?.label}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon
                const isActive = theme === themeOption.value
                
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value as 'light' | 'dark' | 'auto')
                      setIsOpen(false)
                    }}
                    className={`w-full p-3 flex items-center space-x-3 transition-all duration-200 hover:bg-gray-700 ${
                      isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      isActive ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{themeOption.label}</div>
                      <div className="text-xs text-gray-500">{themeOption.description}</div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
