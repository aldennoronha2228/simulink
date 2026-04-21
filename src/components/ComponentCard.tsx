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
    const TagName = component.type as any;
    
    // Auto-scale tiny components so they are usable on our Canvas
    let scale = 1;
    if (component.type.includes('arduino') || component.type.includes('esp32') || component.type.includes('membrane')) {
      scale = 0.8;
    } else if (
      component.type.includes('led') ||
      component.type.includes('resistor') ||
      component.type.includes('button') ||
      component.type.includes('switch') ||
      component.type.includes('potentiometer') ||
      component.type.includes('buzzer') ||
      component.type.includes('dht') ||
      component.type.includes('sensor') ||
      component.type.includes('hc-sr04')
    ) {
      scale = 3; // Make these smaller components 3x bigger
    } else {
      scale = 1.5; // Default for lcd, etc.
    }

    return (
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', display: 'flex' }}>
        {/* Pass some default properties so they don't look completely uninitialized if required */}
        <TagName 
          color="red" 
          value="1000" 
          pins="16"
        />
      </div>
    );
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
