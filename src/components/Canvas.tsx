'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useCircuitStore, ComponentType } from '@/store/useCircuitStore';
import ComponentCard from './ComponentCard';
import { MousePointer2, Pencil, ZoomIn, ZoomOut } from 'lucide-react';

export default function Canvas() {
  const {
    components,
    wires,
    addComponent,
    updateComponentPosition,
    selectComponent,
    drawingWireStart,
    setDrawingWireStart,
    addWire,
  } = useCircuitStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [wireMode, setWireMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawingWireStart(null);
        setWireMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setDrawingWireStart]);

  const getCanvasCoords = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - pan.x) / scale;
    const y = (clientY - rect.top - pan.y) / scale;
    return { x, y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos(getCanvasCoords(e.clientX, e.clientY));
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (wireMode) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      if (drawingWireStart) {
        addWire(drawingWireStart, coords);
        setWireMode(false);
      } else {
        setDrawingWireStart(coords);
      }
    } else {
      selectComponent(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (wireMode) return;
    const newComponentType = e.dataTransfer.getData('componentType') as ComponentType;
    const existingComponentId = e.dataTransfer.getData('existingComponentId');

    if (newComponentType) {
      addComponent(newComponentType, getCanvasCoords(e.clientX, e.clientY));
    } else if (existingComponentId) {
      const offsetX = parseFloat(e.dataTransfer.getData('offsetX') || '0');
      const offsetY = parseFloat(e.dataTransfer.getData('offsetY') || '0');
      const { x, y } = getCanvasCoords(
        e.clientX - offsetX * scale,
        e.clientY - offsetY * scale,
      );
      updateComponentPosition(existingComponentId, { x, y });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const factor = 0.1;
      setScale(s => e.deltaY > 0 ? Math.max(0.2, s - factor) : Math.min(3, s + factor));
    }
  };

  const isEmpty = components.length === 0;

  return (
    <div
      className={`flex-1 bg-gray-950 overflow-hidden relative ${wireMode ? 'cursor-crosshair' : ''}`}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onWheel={handleWheel}
      ref={canvasRef}
    >
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)',
          backgroundSize: `${24 * scale}px ${24 * scale}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          opacity: 0.35,
        }}
      />

      {/* Empty-state hint */}
      {isEmpty && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none select-none z-10">
          <div className="text-4xl opacity-20">🔌</div>
          <p className="text-gray-600 text-sm font-medium">
            Drag components from the left panel onto the canvas
          </p>
        </div>
      )}

      {/* Toolbar — wire mode + zoom */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Wire toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setWireMode(m => !m);
            setDrawingWireStart(null);
          }}
          title="Draw Wire (W)"
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
            wireMode
              ? 'bg-lime-600 text-white border-lime-500 shadow-[0_0_12px_rgba(132,204,22,0.4)]'
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
          }`}
        >
          {wireMode ? <Pencil size={14} /> : <MousePointer2 size={14} />}
          {wireMode ? 'Drawing Wire…' : 'Draw Wire'}
        </button>

        {/* Zoom out */}
        <button
          onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(0.2, parseFloat((s - 0.1).toFixed(1)))); }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 transition-colors"
        >
          <ZoomOut size={14} />
        </button>

        {/* Zoom label */}
        <span className="text-xs text-gray-400 font-mono w-10 text-center">
          {Math.round(scale * 100)}%
        </span>

        {/* Zoom in */}
        <button
          onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(3, parseFloat((s + 0.1).toFixed(1)))); }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 transition-colors"
        >
          <ZoomIn size={14} />
        </button>
      </div>

      {/* Scalable canvas layer */}
      <div
        className="absolute origin-top-left w-full h-full"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
      >
        {/* Wires SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {wires.map(wire => (
            <line
              key={wire.id}
              x1={wire.start.x} y1={wire.start.y}
              x2={wire.end.x}   y2={wire.end.y}
              stroke="#84cc16"
              strokeWidth={2.5}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 3px #84cc16aa)' }}
            />
          ))}
          {drawingWireStart && (
            <line
              x1={drawingWireStart.x} y1={drawingWireStart.y}
              x2={mousePos.x}         y2={mousePos.y}
              stroke="#84cc16"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              strokeLinecap="round"
              opacity={0.7}
            />
          )}
        </svg>

        {/* Components */}
        {components.map(comp => (
          <ComponentCard key={comp.id} component={comp} />
        ))}
      </div>

      {/* Bottom-left status bar */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 text-[11px] text-gray-500 bg-gray-900/80 backdrop-blur border border-gray-800 rounded-lg px-3 py-1.5">
        <span className="font-mono">{Math.round(scale * 100)}%</span>
        <span className="text-gray-700">|</span>
        <span>Ctrl + Scroll to zoom</span>
        {wireMode && (
          <>
            <span className="text-gray-700">|</span>
            <span className="text-lime-400 font-medium">Wire mode — click to place points, Esc to cancel</span>
          </>
        )}
      </div>
    </div>
  );
}
