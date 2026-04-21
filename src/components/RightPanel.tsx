'use client';

import React from 'react';
import { useCircuitStore } from '@/store/useCircuitStore';
import { Trash2, Info } from 'lucide-react';

const PIN_INFO: Record<string, string[]> = {
  'wokwi-arduino-uno':         ['D0–D13 (Digital)', 'A0–A5 (Analog)', '5V, 3.3V, GND', 'AREF, RESET'],
  'wokwi-arduino-nano':        ['D0–D13 (Digital)', 'A0–A7 (Analog)', '5V, 3.3V, GND', 'AREF, RESET'],
  'wokwi-arduino-mega':        ['D0–D53 (Digital)', 'A0–A15 (Analog)', '5V, 3.3V, GND'],
  'wokwi-esp32-devkit-v1':     ['GPIO0–GPIO39', '3.3V, GND', 'EN, BOOT'],
  'wokwi-led':                 ['A (Anode +)', 'K (Cathode −)'],
  'wokwi-rgb-led':             ['R, G, B, GND'],
  'wokwi-resistor':            ['Pin 1, Pin 2 (value: 1kΩ)'],
  'wokwi-pushbutton':          ['P1, P2 (normally open)'],
  'wokwi-potentiometer':       ['GND, SIG, VCC'],
  'wokwi-slide-potentiometer': ['GND, SIG, VCC'],
  'wokwi-slide-switch':        ['1, 2, 3'],
  'wokwi-photoresistor-sensor':['GND, SIG, VCC'],
  'wokwi-pir-motion-sensor':   ['GND, OUT, VCC'],
  'wokwi-hc-sr04':             ['VCC, TRIG, ECHO, GND'],
  'wokwi-dht22':               ['VCC, SDA, GND'],
  'wokwi-servo':               ['GND (brown), VCC (red), SIG (yellow)'],
  'wokwi-stepper-motor':       ['A+, A−, B+, B−, VCC, GND'],
  'wokwi-membrane-keypad':     ['C1–C4 (cols), R1–R4 (rows)'],
  'wokwi-buzzer':              ['1 (+), 2 (−)'],
  'wokwi-lcd1602':             ['VSS, VDD, V0, RS, RW, E', 'D0–D7, A, K'],
  'wokwi-ssd1306':             ['GND, VCC, SCL, SDA'],
  'wokwi-neopixel-matrix':     ['GND, VCC, DIN, DOUT'],
};

export default function RightPanel() {
  const { components, selectedComponentId, removeComponent } = useCircuitStore();
  const selected = components.find(c => c.id === selectedComponentId);
  const pins = selected ? (PIN_INFO[selected.type] ?? []) : [];

  return (
    <aside className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0">
      <div className="px-5 py-4 border-b border-gray-800">
        <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Properties</p>
      </div>

      {selected ? (
        <div className="flex flex-col gap-4 p-5 overflow-y-auto flex-1">
          {/* Name & type badge */}
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">Component</span>
            <span className="text-white font-semibold text-sm">{selected.name}</span>
            <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-blue-400 bg-blue-900/20 border border-blue-800/40 rounded-full px-2 py-0.5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
              {selected.type}
            </span>
          </div>

          {/* Position */}
          <div className="grid grid-cols-2 gap-2">
            {['X', 'Y'].map((axis) => (
              <div key={axis} className="bg-gray-800 rounded-lg px-3 py-2 border border-gray-700">
                <p className="text-gray-500 text-[10px] uppercase font-bold">{axis}</p>
                <p className="text-white text-sm font-mono mt-0.5">
                  {Math.round(axis === 'X' ? selected.position.x : selected.position.y)}px
                </p>
              </div>
            ))}
          </div>

          {/* Pins */}
          {pins.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Info size={13} />
                <span className="text-xs font-semibold uppercase tracking-wider">Pin Layout</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {pins.map((pin, i) => (
                  <div
                    key={i}
                    className="text-xs text-gray-300 bg-gray-800/60 border border-gray-700/60 rounded-lg px-3 py-1.5 font-mono"
                  >
                    {pin}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delete */}
          <button
            onClick={() => removeComponent(selected.id)}
            className="mt-auto flex items-center justify-center gap-2 w-full bg-red-950/50 text-red-400 hover:bg-red-900/50 hover:text-red-300 py-2.5 rounded-xl transition-colors border border-red-900/40 text-sm font-medium"
          >
            <Trash2 size={15} />
            Delete Component
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
            <Info size={20} className="text-gray-600" />
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Click any component on the canvas to view its properties and pin layout
          </p>
        </div>
      )}
    </aside>
  );
}
