/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CircuitComponent, useCircuitStore } from '@/store/useCircuitStore';

// ─── Canvas-pixel scale applied to each component ───────────────────────────
export const CANVAS_SCALES: Record<string, number> = {
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

interface Props {
  component: CircuitComponent;
  wireModeActive: boolean;
}

interface Pin { name: string; x: number; y: number }

export default function ComponentCard({ component, wireModeActive }: Props) {
  const {
    selectedComponentId,
    selectComponent,
    updateComponentPosition,
    wireInProgress,
    startWire,
    completeWire,
  } = useCircuitStore();

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedComponentId === component.id;
  const scale      = CANVAS_SCALES[component.type] ?? 0.70;
  const TagName    = component.type;

  // Read pinInfo from the rendered web-component instance
  const [pins, setPins] = useState<Pin[]>([]);
  useEffect(() => {
    const tryReadPins = () => {
      const el = innerRef.current?.firstElementChild as any;
      if (el && Array.isArray(el.pinInfo) && el.pinInfo.length > 0) {
        // pinInfo coords are in native pixels of the element at screen resolution.
        // We store them as-is and multiply by `scale` to position overlays.
        setPins(el.pinInfo.map((p: any) => ({ name: p.name, x: p.x, y: p.y })));
        return true;
      }
      return false;
    };

    // Elements might not be defined yet — retry a few times
    if (!tryReadPins()) {
      const timer = setInterval(() => { if (tryReadPins()) clearInterval(timer); }, 200);
      return () => clearInterval(timer);
    }
  }, []);

  // ── Drag handlers (for repositioning) ─────────────────────────────────────
  const handleDragStart = (e: React.DragEvent) => {
    if (wireModeActive) { e.preventDefault(); return; }
    e.dataTransfer.setData('existingComponentId', component.id);
    const rect = outerRef.current?.getBoundingClientRect();
    if (rect) {
      e.dataTransfer.setData('offsetX', String(e.clientX - rect.left));
      e.dataTransfer.setData('offsetY', String(e.clientY - rect.top));
    }
  };

  // ── Pin click ─────────────────────────────────────────────────────────────
  const handlePinClick = useCallback(
    (e: React.MouseEvent, pin: Pin) => {
      e.stopPropagation();
      const pinRef = {
        componentId: component.id,
        pinName: pin.name,
        x: component.position.x + pin.x * scale,
        y: component.position.y + pin.y * scale,
      };
      if (!wireInProgress) {
        startWire(pinRef);
      } else {
        completeWire(pinRef);
      }
    },
    [component, scale, wireInProgress, startWire, completeWire],
  );

  const isWireStart = wireInProgress?.componentId === component.id;

  return (
    <div
      ref={outerRef}
      draggable={!wireModeActive}
      onDragStart={handleDragStart}
      onClick={(e) => {
        if (wireModeActive) return;
        e.stopPropagation();
        selectComponent(component.id);
      }}
      className={`absolute select-none ${
        wireModeActive ? 'cursor-default' : 'cursor-move'
      } ${
        isSelected && !wireModeActive
          ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-950 rounded-xl z-50'
          : 'z-10'
      }`}
      style={{ left: component.position.x, top: component.position.y }}
    >
      {/* Component label when selected */}
      {isSelected && !wireModeActive && (
        <div className="absolute -top-6 left-0 text-[11px] text-blue-300 font-medium bg-gray-900/90 px-2 py-0.5 rounded whitespace-nowrap z-10">
          {component.name}
        </div>
      )}

      {/* The wokwi web component */}
      <div
        ref={innerRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          display: 'inline-flex',
          lineHeight: 0,
        }}
      >
        <TagName color="red" value="1000" />
      </div>

      {/* Pin dots overlay (wire mode only) */}
      {wireModeActive && pins.map((pin) => {
        const isActiveStart =
          isWireStart && wireInProgress?.pinName === pin.name;

        return (
          <button
            key={pin.name}
            title={pin.name}
            onClick={(e) => handlePinClick(e, pin)}
            className="absolute z-30 group"
            style={{
              left: pin.x * scale - 6,
              top:  pin.y * scale - 6,
              width: 12,
              height: 12,
            }}
          >
            {/* Dot */}
            <span
              className="block w-full h-full rounded-full border-2 border-white/70 transition-transform group-hover:scale-150"
              style={{
                background: isActiveStart ? '#84cc16' : '#f59e0b',
                boxShadow: isActiveStart
                  ? '0 0 8px #84cc16'
                  : '0 0 4px rgba(0,0,0,0.6)',
              }}
            />
            {/* Label — shows on hover */}
            <span
              className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white bg-gray-900/95 border border-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50"
            >
              {pin.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
