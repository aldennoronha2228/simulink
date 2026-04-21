/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';

import React, { useRef } from 'react';
import { CircuitComponent, useCircuitStore } from '@/store/useCircuitStore';

interface ComponentCardProps {
  component: CircuitComponent;
}

// How large each component appears when placed on canvas
const CANVAS_SCALES: Record<string, number> = {
  'wokwi-arduino-uno':         0.55,
  'wokwi-arduino-nano':        0.65,
  'wokwi-arduino-mega':        0.40,
  'wokwi-esp32-devkit-v1':     0.75,
  'wokwi-led':                 2.40,
  'wokwi-rgb-led':             2.00,
  'wokwi-resistor':            1.80,
  'wokwi-pushbutton':          1.60,
  'wokwi-potentiometer':       1.10,
  'wokwi-slide-potentiometer': 0.90,
  'wokwi-slide-switch':        1.80,
  'wokwi-photoresistor-sensor':0.90,
  'wokwi-pir-motion-sensor':   0.90,
  'wokwi-hc-sr04':             0.90,
  'wokwi-dht22':               1.00,
  'wokwi-servo':               0.85,
  'wokwi-stepper-motor':       0.65,
  'wokwi-membrane-keypad':     0.55,
  'wokwi-buzzer':              1.40,
  'wokwi-lcd1602':             0.65,
  'wokwi-ssd1306':             0.90,
  'wokwi-neopixel-matrix':     0.75,
};

export default function ComponentCard({ component }: ComponentCardProps) {
  const { selectedComponentId, selectComponent, updateComponentPosition } = useCircuitStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const isSelected = selectedComponentId === component.id;
  const scale = CANVAS_SCALES[component.type] ?? 0.70;
  const TagName = component.type;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('existingComponentId', component.id);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      e.dataTransfer.setData('offsetX', String(e.clientX - rect.left));
      e.dataTransfer.setData('offsetY', String(e.clientY - rect.top));
    }
  };

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(component.id);
      }}
      className={`absolute cursor-move select-none ${
        isSelected
          ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-950 rounded-xl z-50'
          : 'hover:ring-1 ring-blue-400/40 rounded-xl z-10'
      }`}
      style={{ left: component.position.x, top: component.position.y }}
    >
      {/* Label above component */}
      {isSelected && (
        <div className="absolute -top-6 left-0 text-[11px] text-blue-300 font-medium bg-gray-900/90 px-2 py-0.5 rounded whitespace-nowrap">
          {component.name}
        </div>
      )}

      {/* The actual Wokwi web component, scaled to medium size */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          display: 'inline-flex',
          lineHeight: 0,
        }}
      >
        <TagName color="red" value="1000" />
      </div>
    </div>
  );
}
