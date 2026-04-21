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
    // Calculate offset so the component doesn't snap its top-left to the mouse
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      e.dataTransfer.setData('offsetX', (e.clientX - rect.left).toString());
      e.dataTransfer.setData('offsetY', (e.clientY - rect.top).toString());
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // The drop on canvas takes care of position updates usually,
    // but if we need, we can do logic here.
  };

  const VisualNode = () => {
    switch (component.type) {
      case 'ArduinoUno':
        return (
          <div className="w-48 h-64 bg-teal-800 rounded-lg border-2 border-teal-600 flex flex-col justify-between p-2 shadow-xl shadow-black/40">
            <div className="flex justify-between">
              <div className="w-6 h-6 bg-gray-400 border border-gray-500 rounded-full"></div>
              <div className="flex gap-1">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="w-3 h-3 bg-gray-900 rounded-sm" />)}
              </div>
            </div>
            <div className="text-teal-400 font-bold tracking-widest text-center self-center rotate-90 w-max translate-x-3 text-lg opacity-70">
              UNO
            </div>
            <div className="flex gap-1 justify-end">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="w-3 h-3 bg-gray-900 rounded-sm" />)}
            </div>
          </div>
        );
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
        return (
           <div className="w-12 h-16 flex flex-col items-center">
             <div className="w-8 h-10 bg-red-500 rounded-t-full shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
             <div className="flex gap-2">
               <div className="w-1 h-8 bg-gray-300"></div>
               <div className="w-1 h-6 bg-gray-300"></div>
             </div>
           </div>
        );
      case 'Resistor':
        return (
           <div className="w-20 h-6 flex items-center">
             <div className="w-4 h-1 bg-gray-400"></div>
             <div className="flex-1 h-5 bg-amber-200 rounded-full flex gap-1 justify-center items-center overflow-hidden">
               <div className="w-1 h-full bg-red-600"></div>
               <div className="w-1 h-full bg-black"></div>
               <div className="w-1 h-full bg-orange-600"></div>
               <div className="w-1 h-full bg-yellow-600"></div>
             </div>
             <div className="w-4 h-1 bg-gray-400"></div>
           </div>
        );
      case 'Button':
        return (
          <div className="w-10 h-10 bg-gray-800 rounded-md border-2 border-gray-600 flex items-center justify-center relative">
            <div className="w-6 h-6 bg-gray-300 rounded-full border border-gray-400 shadow-inner"></div>
            <div className="absolute top-0 -left-2 w-2 h-1 bg-gray-400"></div>
            <div className="absolute top-0 -right-2 w-2 h-1 bg-gray-400"></div>
            <div className="absolute bottom-0 -left-2 w-2 h-1 bg-gray-400"></div>
            <div className="absolute bottom-0 -right-2 w-2 h-1 bg-gray-400"></div>
          </div>
        );
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
