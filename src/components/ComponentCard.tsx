// @ts-nocheck
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { CircuitComponent, useCircuitStore } from '@/store/useCircuitStore';

interface ComponentCardProps {
  component: CircuitComponent;
}

// Medium sizes for canvas-placed components
const CANVAS_SCALES: { [key: string]: number } = {
  'wokwi-arduino-uno': 0.55,
  'wokwi-arduino-nano': 0.65,
  'wokwi-arduino-mega': 0.4,
  'wokwi-esp32-devkit-v1': 0.8,
  'wokwi-led': 2.2,
  'wokwi-rgb-led': 2.0,
  'wokwi-resistor': 1.6,
  'wokwi-pushbutton': 1.8,
  'wokwi-potentiometer': 1.1,
  'wokwi-slide-potentiometer': 0.9,
  'wokwi-slide-switch': 1.8,
  'wokwi-photoresistor-sensor': 0.9,
  'wokwi-pir-motion-sensor': 0.9,
  'wokwi-hc-sr04': 0.9,
  'wokwi-dht22': 1.0,
  'wokwi-servo': 0.85,
  'wokwi-stepper-motor': 0.65,
  'wokwi-membrane-keypad': 0.55,
  'wokwi-buzzer': 1.4,
  'wokwi-lcd1602': 0.65,
  'wokwi-ssd1306': 0.9,
  'wokwi-neopixel-matrix': 0.75,
};

export default function ComponentCard({ component }: ComponentCardProps) {
  const { selectedComponentId, selectComponent, updateComponentPosition } = useCircuitStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const isSelected = selectedComponentId === component.id;

  useEffect(() => {
    import('@wokwi/elements')
      .then(() => setLoaded(true))
      .catch(console.error);
  }, []);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('existingComponentId', component.id);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      e.dataTransfer.setData('offsetX', (e.clientX - rect.left).toString());
      e.dataTransfer.setData('offsetY', (e.clientY - rect.top).toString());
    }
  };

  const scale = CANVAS_SCALES[component.type] ?? 0.7;
  const TagName = component.type;

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(component.id);
      }}
      className={`absolute cursor-move transition-transform active:scale-95 ${
        isSelected
          ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 rounded-lg z-50'
          : 'hover:ring-1 ring-blue-400/50 z-10'
      }`}
      style={{ left: component.position.x, top: component.position.y }}
    >
      {loaded ? (
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            display: 'inline-flex',
          }}
        >
          <TagName color="red" value="1000" />
        </div>
      ) : (
        // Skeleton placeholder while loading
        <div className="w-16 h-16 bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-gray-500 text-xs">{component.type.replace('wokwi-', '')}</span>
        </div>
      )}
    </div>
  );
}
