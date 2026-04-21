import { create } from 'zustand';

export type Position = { x: number; y: number };

export type ComponentType = 'ArduinoUno' | 'Breadboard' | 'LED' | 'Resistor' | 'Button';

export interface Wire {
  id: string;
  start: Position;
  end: Position;
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  position: Position;
  name: string;
}

interface CircuitStore {
  components: CircuitComponent[];
  wires: Wire[];
  selectedComponentId: string | null;
  drawingWireStart: Position | null;
  setDrawingWireStart: (pos: Position | null) => void;
  addWire: (start: Position, end: Position) => void;
  addComponent: (type: ComponentType, position: Position) => void;
  updateComponentPosition: (id: string, position: Position) => void;
  selectComponent: (id: string | null) => void;
  removeComponent: (id: string) => void;
  clearCanvas: () => void;
}

export const useCircuitStore = create<CircuitStore>((set) => ({
  components: [],
  wires: [],
  selectedComponentId: null,
  drawingWireStart: null,
  
  setDrawingWireStart: (pos) => set({ drawingWireStart: pos }),
  
  addWire: (start, end) => set((state) => ({
    wires: [...state.wires, { id: `wire-${Date.now()}`, start, end }],
    drawingWireStart: null
  })),
  
  addComponent: (type, position) => set((state) => {
    const id = `${type}-${Date.now()}`;
    const newComponent: CircuitComponent = {
      id,
      type,
      position,
      name: `${type} ${state.components.filter(c => c.type === type).length + 1}`
    };
    return { components: [...state.components, newComponent], selectedComponentId: id };
  }),
  
  updateComponentPosition: (id, position) => set((state) => ({
    components: state.components.map(c => 
      c.id === id ? { ...c, position } : c
    )
  })),
  
  selectComponent: (id) => set({ selectedComponentId: id }),
  
  removeComponent: (id) => set((state) => ({
    components: state.components.filter(c => c.id !== id),
    selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId
  })),

  clearCanvas: () => set({ components: [], wires: [], selectedComponentId: null, drawingWireStart: null })
}));
