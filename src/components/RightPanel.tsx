'use client';

import React from 'react';
import { useCircuitStore } from '@/store/useCircuitStore';
import { Trash2 } from 'lucide-react';

export default function RightPanel() {
  const { components, selectedComponentId, removeComponent } = useCircuitStore();
  
  const selectedComponent = components.find(c => c.id === selectedComponentId);

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 p-6 flex flex-col gap-6">
      <h2 className="text-gray-400 uppercase text-xs font-bold tracking-wider">Properties</h2>
      
      {selectedComponent ? (
        <div className="flex flex-col gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
              <span className="text-gray-400">Type</span>
              <span className="text-gray-100 font-medium">{selectedComponent.type}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
              <span className="text-gray-400">Name</span>
              <span className="text-gray-100 font-medium">{selectedComponent.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Position</span>
              <span className="text-gray-100 font-medium">x: {Math.round(selectedComponent.position.x)}, y: {Math.round(selectedComponent.position.y)}</span>
            </div>
          </div>
          
          <button 
            onClick={() => removeComponent(selectedComponent.id)}
            className="flex items-center justify-center gap-2 w-full bg-red-900/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 py-2.5 rounded-lg transition-colors border border-red-900/50"
          >
            <Trash2 size={18} />
            <span>Delete Component</span>
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-center text-sm p-4 border border-dashed border-gray-700 rounded-xl">
          Select a component on the canvas to view its properties
        </div>
      )}
    </div>
  );
}
