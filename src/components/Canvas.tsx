'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useCircuitStore, ComponentType } from '@/store/useCircuitStore';
import ComponentCard from './ComponentCard';

export default function Canvas() {
  const { 
    components, 
    wires, 
    addComponent, 
    updateComponentPosition, 
    selectComponent, 
    drawingWireStart, 
    setDrawingWireStart, 
    addWire 
  } = useCircuitStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
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
        setWireMode(false); // Disable wire mode after connecting, or keep it true for continuous drawing
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
       const { x, y } = getCanvasCoords(e.clientX - offsetX * scale, e.clientY - offsetY * scale);
       
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
      const zoomFactor = 0.1;
      const newScale = e.deltaY > 0 ? Math.max(0.2, scale - zoomFactor) : Math.min(3, scale + zoomFactor);
      setScale(newScale);
    }
  };

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
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setWireMode(!wireMode);
            setDrawingWireStart(null);
          }}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            wireMode ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
          }`}
        >
          {wireMode ? 'Cancel Wire' : 'Draw Wire'}
        </button>
      </div>

      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
           backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
           backgroundSize: `${20 * scale}px ${20 * scale}px`,
           backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      />
      
      <div 
        className="absolute origin-top-left w-full h-full"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {wires.map((wire) => (
            <line
              key={wire.id}
              x1={wire.start.x}
              y1={wire.start.y}
              x2={wire.end.x}
              y2={wire.end.y}
              stroke="#bef264"
              strokeWidth={3}
              strokeLinecap="round"
            />
          ))}
          {drawingWireStart && (
            <line
              x1={drawingWireStart.x}
              y1={drawingWireStart.y}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="#bef264"
              strokeWidth={3}
              strokeDasharray="4 4"
              strokeLinecap="round"
              className="opacity-70"
            />
          )}
        </svg>

        {components.map((comp) => (
          <ComponentCard key={comp.id} component={comp} />
        ))}
      </div>

      <div className="absolute bottom-4 left-4 bg-gray-900 border border-gray-800 rounded-lg p-2 text-xs text-gray-400 flex items-center gap-4 z-10 shadow-lg">
        <span>Zoom: {Math.round(scale * 100)}%</span>
        <span>Ctrl + Scroll to zoom</span>
      </div>
    </div>
  );
}
