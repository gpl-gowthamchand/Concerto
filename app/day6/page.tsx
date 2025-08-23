'use client'

import { useState } from 'react'
import AdvancedDiscovery from '../../components/AdvancedDiscovery'
import MusicProductionStudio from '../../components/MusicProductionStudio'

export default function Day6Page() {
  const [activeComponent, setActiveComponent] = useState('discovery')

  const components = [
    { id: 'discovery', name: 'AI Discovery', component: <AdvancedDiscovery /> },
    { id: 'studio', name: 'Production Studio', component: <MusicProductionStudio /> }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navigation */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-center space-x-1">
            {components.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setActiveComponent(comp.id)}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeComponent === comp.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                {comp.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Component Display */}
      <div>
        {components.find(comp => comp.id === activeComponent)?.component}
      </div>
    </div>
  )
}
