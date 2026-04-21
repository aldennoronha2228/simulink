'use client';

import React from 'react';
import { Cpu, CircuitBoard, Lightbulb, Zap, ToggleLeft } from 'lucide-react';
import { ComponentType } from '@/store/useCircuitStore';

const AVAILABLE_COMPONENTS: { type: ComponentType; label: string; icon: React.ReactNode }[] = [
  { type: 'ArduinoUno', label: 'Arduino Uno', icon: <Cpu size={24} /> },
  { type: 'Breadboard', label: 'Breadboard', icon: <CircuitBoard size={24} /> },
  { type: 'LED', label: 'LED', icon: <Lightbulb size={24} /> },
  { type: 'Resistor', label: 'Resistor', icon: <Zap size={24} /> },
  { type: 'Button', label: 'Button', icon: <ToggleLeft size={24} /> },
];

export default function Sidebar() {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-6 px-4 gap-4 overflow-y-auto">
      <h2 className="text-gray-400 uppercase text-xs font-bold tracking-wider w-full mb-2">Components</h2>
      {AVAILABLE_COMPONENTS.map((comp) => (
        <div
          key={comp.type}
          draggable
          onDragStart={(e) => handleDragStart(e, comp.type)}
          className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing transition-colors text-gray-200"
        >
          <div className="text-blue-400">{comp.icon}</div>
          <span className="text-sm font-medium">{comp.label}</span>
        </div>
      ))}
    </div>
  );
}
