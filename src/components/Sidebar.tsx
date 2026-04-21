'use client';

import React, { useEffect, useState } from 'react';
import { AVAILABLE_COMPONENTS } from '@/store/useCircuitStore';

// Scale config for sidebar thumbnails: these are the "natural" display scales for each family
const SIDEBAR_SCALES: { [key: string]: number } = {
  'wokwi-arduino-uno': 0.12,
  'wokwi-arduino-nano': 0.15,
  'wokwi-arduino-mega': 0.08,
  'wokwi-esp32-devkit-v1': 0.2,
  'wokwi-led': 0.55,
  'wokwi-rgb-led': 0.55,
  'wokwi-resistor': 0.4,
  'wokwi-pushbutton': 0.45,
  'wokwi-potentiometer': 0.28,
  'wokwi-slide-potentiometer': 0.22,
  'wokwi-slide-switch': 0.45,
  'wokwi-photoresistor-sensor': 0.22,
  'wokwi-pir-motion-sensor': 0.22,
  'wokwi-hc-sr04': 0.22,
  'wokwi-dht22': 0.25,
  'wokwi-servo': 0.2,
  'wokwi-stepper-motor': 0.15,
  'wokwi-membrane-keypad': 0.12,
  'wokwi-buzzer': 0.35,
  'wokwi-lcd1602': 0.15,
  'wokwi-ssd1306': 0.22,
  'wokwi-neopixel-matrix': 0.18,
};

export default function Sidebar() {
  const [elementsLoaded, setElementsLoaded] = useState(false);

  useEffect(() => {
    import('@wokwi/elements')
      .then(() => setElementsLoaded(true))
      .catch(console.error);
  }, []);

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col py-4 px-3 gap-2 overflow-y-auto">
      <h2 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-2 px-1">Components</h2>
      {AVAILABLE_COMPONENTS.map((comp) => {
        const TagName = comp.type as any;
        const scale = SIDEBAR_SCALES[comp.type] ?? 0.2;

        return (
          <div
            key={comp.type}
            draggable
            onDragStart={(e) => handleDragStart(e, comp.type)}
            className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 flex items-center gap-3 cursor-grab active:cursor-grabbing transition-all hover:border-blue-500/40 group"
          >
            {/* Tiny fixed-size preview box */}
            <div
              className="flex-shrink-0 rounded overflow-hidden bg-gray-900/50"
              style={{ width: 44, height: 36 }}
            >
              <div
                className="pointer-events-none"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: `${100 / scale}%`,
                }}
              >
                {elementsLoaded && <TagName color="red" value="1000" />}
              </div>
            </div>

            <span className="text-xs font-medium text-gray-300 group-hover:text-white leading-tight">
              {comp.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
