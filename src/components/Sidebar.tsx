'use client';

import React from 'react';
import { AVAILABLE_COMPONENTS } from '@/store/useCircuitStore';

// Tiny preview scale for sidebar thumbnails
const SIDEBAR_SCALES: Record<string, number> = {
  'wokwi-arduino-uno':         0.115,
  'wokwi-arduino-nano':        0.145,
  'wokwi-arduino-mega':        0.075,
  'wokwi-esp32-devkit-v1':     0.19,
  'wokwi-led':                 0.52,
  'wokwi-rgb-led':             0.52,
  'wokwi-resistor':            0.38,
  'wokwi-pushbutton':          0.42,
  'wokwi-potentiometer':       0.26,
  'wokwi-slide-potentiometer': 0.21,
  'wokwi-slide-switch':        0.42,
  'wokwi-photoresistor-sensor':0.21,
  'wokwi-pir-motion-sensor':   0.21,
  'wokwi-hc-sr04':             0.21,
  'wokwi-dht22':               0.24,
  'wokwi-servo':               0.19,
  'wokwi-stepper-motor':       0.14,
  'wokwi-membrane-keypad':     0.115,
  'wokwi-buzzer':              0.33,
  'wokwi-lcd1602':             0.145,
  'wokwi-ssd1306':             0.21,
  'wokwi-neopixel-matrix':     0.17,
};

export default function Sidebar() {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-52 bg-gray-900 border-r border-gray-800 flex flex-col py-4 px-3 gap-1.5 overflow-y-auto shrink-0">
      <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest px-1 mb-2">
        Components
      </p>

      {AVAILABLE_COMPONENTS.map((comp) => {
        const TagName = comp.type as any;
        const scale = SIDEBAR_SCALES[comp.type] ?? 0.18;

        return (
          <div
            key={comp.type}
            draggable
            onDragStart={(e) => handleDragStart(e, comp.type)}
            className="flex items-center gap-3 px-2 py-2 rounded-lg bg-gray-800 hover:bg-gray-750 border border-transparent hover:border-blue-500/30 cursor-grab active:cursor-grabbing transition-all group"
          >
            {/* Fixed 44×34 thumbnail box — clips overflowing web component */}
            <div
              className="flex-shrink-0 rounded bg-gray-900/60 overflow-hidden flex items-start justify-start"
              style={{ width: 44, height: 34 }}
            >
              <div
                className="pointer-events-none"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  lineHeight: 0,
                }}
              >
                <TagName color="red" value="1000" />
              </div>
            </div>

            <span className="text-xs text-gray-400 group-hover:text-gray-100 font-medium leading-tight transition-colors">
              {comp.label}
            </span>
          </div>
        );
      })}
    </aside>
  );
}
