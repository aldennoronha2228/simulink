'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useCircuitStore, ComponentType } from '@/store/useCircuitStore';
import ComponentCard from './ComponentCard';
import { MousePointer2, Cable, ZoomIn, ZoomOut, X } from 'lucide-react';

export default function Canvas() {
  const {
    components,
    wires,
    addComponent,
    updateComponentPosition,
    selectComponent,
    wireInProgress,
    cancelWire,
  } = useCircuitStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom]       = useState(1);
  const [pan]                 = useState({ x: 0, y: 0 });
  const [mouseCanvas, setMouseCanvas] = useState({ x: 0, y: 0 });
  const [wireModeActive, setWireModeActive] = useState(false);

  // Cancel wire on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { cancelWire(); setWireModeActive(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cancelWire]);

  // If wire mode gets disabled, cancel any in-progress wire
  useEffect(() => {
    if (!wireModeActive) cancelWire();
  }, [wireModeActive, cancelWire]);

  const toCanvas = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top  - pan.y) / zoom,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) =>
    setMouseCanvas(toCanvas(e.clientX, e.clientY));

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!wireModeActive) { selectComponent(null); return; }
    // Clicked empty canvas while wiring → cancel
    cancelWire();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (wireModeActive) return;
    const newType  = e.dataTransfer.getData('componentType') as ComponentType;
    const existId  = e.dataTransfer.getData('existingComponentId');

    if (newType) {
      addComponent(newType, toCanvas(e.clientX, e.clientY));
    } else if (existId) {
      const ox = parseFloat(e.dataTransfer.getData('offsetX') || '0');
      const oy = parseFloat(e.dataTransfer.getData('offsetY') || '0');
      const { x, y } = toCanvas(e.clientX - ox * zoom, e.clientY - oy * zoom);
      updateComponentPosition(existId, { x, y });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    setZoom(z => e.deltaY > 0 ? Math.max(0.2, z - 0.1) : Math.min(3, z + 0.1));
  };

  const isEmpty = components.length === 0;

  return (
    <div
      className={`flex-1 bg-gray-950 overflow-hidden relative ${wireModeActive ? 'cursor-crosshair' : ''}`}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onWheel={handleWheel}
      ref={canvasRef}
    >
      {/* Dot-grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)',
          backgroundSize:  `${24 * zoom}px ${24 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          opacity: 0.35,
        }}
      />

      {/* Empty state */}
      {isEmpty && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none select-none z-10">
          <div className="text-4xl opacity-20">🔌</div>
          <p className="text-gray-600 text-sm">Drag components from the left panel onto the canvas</p>
        </div>
      )}

      {/* Top-right toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Wire mode toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setWireModeActive(m => !m); }}
          title="Draw Wire between pins"
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
            wireModeActive
              ? 'bg-lime-600 text-white border-lime-500 shadow-[0_0_12px_rgba(132,204,22,0.4)]'
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
          }`}
        >
          {wireModeActive ? <X size={14} /> : <Cable size={14} />}
          {wireModeActive ? 'Exit Wire Mode' : 'Wire Mode'}
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(0.2, +(z - 0.1).toFixed(1))); }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300"
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-xs text-gray-400 font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button
          onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(3, +(z + 0.1).toFixed(1))); }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300"
        >
          <ZoomIn size={14} />
        </button>
      </div>

      {/* Scalable canvas world */}
      <div
        className="absolute origin-top-left"
        style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, width: '100%', height: '100%' }}
      >
        {/* Wires SVG */}
        <svg className="absolute inset-0 overflow-visible pointer-events-none" style={{ width: '100%', height: '100%' }}>
          <defs>
            {wires.map(w => (
              <filter key={`glow-${w.id}`} id={`glow-${w.id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
          </defs>

          {/* Completed wires */}
          {wires.map(w => (
            <g key={w.id}>
              {/* Shadow */}
              <line
                x1={w.from.x} y1={w.from.y} x2={w.to.x} y2={w.to.y}
                stroke={w.color} strokeWidth={6} strokeLinecap="round" opacity={0.15}
              />
              {/* Main line */}
              <line
                x1={w.from.x} y1={w.from.y} x2={w.to.x} y2={w.to.y}
                stroke={w.color} strokeWidth={2.5} strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 3px ${w.color}88)` }}
              />
              {/* Endpoint dots */}
              <circle cx={w.from.x} cy={w.from.y} r={4} fill={w.color} />
              <circle cx={w.to.x}   cy={w.to.y}   r={4} fill={w.color} />
            </g>
          ))}

          {/* Live wire preview */}
          {wireModeActive && wireInProgress && (
            <>
              <line
                x1={wireInProgress.x} y1={wireInProgress.y}
                x2={mouseCanvas.x}    y2={mouseCanvas.y}
                stroke="#84cc16" strokeWidth={2} strokeDasharray="6 4"
                strokeLinecap="round" opacity={0.8}
              />
              <circle cx={wireInProgress.x} cy={wireInProgress.y} r={5} fill="#84cc16"
                style={{ filter: 'drop-shadow(0 0 5px #84cc16)' }}
              />
            </>
          )}
        </svg>

        {/* Components */}
        {components.map(comp => (
          <ComponentCard
            key={comp.id}
            component={comp}
            wireModeActive={wireModeActive}
          />
        ))}
      </div>

      {/* Status bar */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 text-[11px] text-gray-500 bg-gray-900/80 backdrop-blur border border-gray-800 rounded-lg px-3 py-1.5">
        <span className="font-mono">{Math.round(zoom * 100)}%</span>
        <span className="text-gray-700">|</span>
        <span className="flex items-center gap-1">
          <MousePointer2 size={10} /> Ctrl+Scroll to zoom
        </span>
        {wireModeActive && (
          <>
            <span className="text-gray-700">|</span>
            <span className="text-lime-400 font-medium">
              {wireInProgress
                ? `From: ${wireInProgress.pinName} — click another pin to connect`
                : 'Click a yellow pin dot to start a wire'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
