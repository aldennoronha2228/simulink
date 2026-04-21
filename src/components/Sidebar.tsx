'use client';

import React, { useEffect } from 'react';
import { AVAILABLE_COMPONENTS } from '@/store/useCircuitStore';

export default function Sidebar() {
  useEffect(() => {
    import('@wokwi/elements').catch(console.error);
  }, []);

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-6 px-4 gap-4 overflow-y-auto">
      <h2 className="text-gray-400 uppercase text-xs font-bold tracking-wider w-full mb-2">Components</h2>
      {AVAILABLE_COMPONENTS.map((comp) => {
        const TagName = comp.type as any;
        return (
          <div
            key={comp.type}
            draggable
            onDragStart={(e) => handleDragStart(e, comp.type)}
            className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center gap-4 cursor-grab active:cursor-grabbing transition-colors text-gray-200"
          >
            <div className="w-16 h-16 flex items-center justify-center overflow-visible pointer-events-none">
              <TagName style={{ transform: 'scale(0.8)' }} />
            </div>
            <span className="text-sm font-medium">{comp.label}</span>
          </div>
        );
      })}
    </div>
  );
}
