'use client';

import React from 'react';
import { Play, PlayCircle, RotateCcw, Monitor, FileDown } from 'lucide-react';
import { useCircuitStore } from '@/store/useCircuitStore';

export default function Navbar() {
  const { clearCanvas } = useCircuitStore();

  return (
    <nav className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 text-gray-200 z-10 w-full">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Monitor size={20} className="text-white" />
        </div>
        <h1 className="font-bold text-xl tracking-tight">Simu<span className="text-blue-500">Link</span></h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={clearCanvas}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors text-gray-300"
        >
          <RotateCcw size={16} />
          Clear Canvas
        </button>
        
        <button 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-800 border border-gray-700 rounded-lg opacity-50 cursor-not-allowed"
            disabled
        >
          <FileDown size={16} />
          Export JSON
        </button>
        
        <button 
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors opacity-50 cursor-not-allowed"
          disabled
        >
          <Play size={16} />
          Run Simulation
        </button>
      </div>
    </nav>
  );
}
