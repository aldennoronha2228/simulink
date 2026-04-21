// @ts-nocheck
'use client';

import React, { useRef, useEffect } from 'react';
import { CircuitComponent, useCircuitStore } from '@/store/useCircuitStore';

interface ComponentCardProps {
  component: CircuitComponent;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  const { selectedComponentId, selectComponent, updateComponentPosition } = useCircuitStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const isSelected = selectedComponentId === component.id;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('existingComponentId', component.id);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      e.dataTransfer.setData('offsetX', (e.clientX - rect.left).toString());
      e.dataTransfer.setData('offsetY', (e.clientY - rect.top).toString());
    }
  };

  useEffect(() => {
    import('@wokwi/elements').catch(console.error);
  }, []);

  const handleDragEnd = (e: React.DragEvent) => {
    // The drop on canvas takes care of position updates usually,
    // but if we need, we can do logic here.
  };

  const VisualNode = () => {
    switch (component.type) {
      case 'ArduinoUno':
        return <wokwi-arduino-uno style={{ transform: 'scale(0.8)', transformOrigin: 'top left' }}></wokwi-arduino-uno>;
      case 'Breadboard':
        return (
          <div className="w-80 h-32 bg-gray-200 rounded-md shadow-xl flex items-center justify-center p-2">
            <div className="w-full h-full border border-gray-300 rounded flex flex-col gap-1 p-2">
               <div className="flex gap-1 border-b pb-1 border-red-300">
                 {Array.from({length: 30}).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />)}
               </div>
               <div className="flex gap-1 border-b pb-1 border-blue-300 mb-2">
                 {Array.from({length: 30}).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />)}
               </div>
               <div className="flex-1 flex flex-col justify-center gap-1 opacity-60">
                 <div className="flex gap-1">
                   {Array.from({length: 30}).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />)}
                 </div>
                 <div className="flex gap-1">
                   {Array.from({length: 30}).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />)}
                 </div>
               </div>
            </div>
          </div>
        );
      case 'LED':
        return <wokwi-led color="red"></wokwi-led>;
      case 'Resistor':
        return <wokwi-resistor value="1000"></wokwi-resistor>;
      case 'Button':
        return <wokwi-pushbutton></wokwi-pushbutton>;
      default:
        return <div className="p-4 bg-purple-600 rounded">{component.type}</div>;
    }
  };

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(component.id);
      }}
      className={`absolute cursor-move transition-transform active:scale-95 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 border-transparent rounded-lg z-50' : 'hover:ring-1 ring-blue-400/50 z-10'}`}
      style={{ left: component.position.x, top: component.position.y }}
    >
      <VisualNode />
    </div>
  );
}
