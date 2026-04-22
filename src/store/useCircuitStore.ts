import { create } from 'zustand';

export type Position = { x: number; y: number };
export type ComponentType = string;

export const AVAILABLE_COMPONENTS = [
  { type: 'wokwi-arduino-uno',         label: 'Arduino Uno' },
  { type: 'wokwi-arduino-nano',        label: 'Arduino Nano' },
  { type: 'wokwi-arduino-mega',        label: 'Arduino Mega' },
  { type: 'wokwi-esp32-devkit-v1',     label: 'ESP32 DevKit' },
  { type: 'wokwi-led',                 label: 'LED' },
  { type: 'wokwi-rgb-led',             label: 'RGB LED' },
  { type: 'wokwi-resistor',            label: 'Resistor' },
  { type: 'wokwi-pushbutton',          label: 'Button' },
  { type: 'wokwi-potentiometer',       label: 'Potentiometer' },
  { type: 'wokwi-slide-potentiometer', label: 'Slide Pot' },
  { type: 'wokwi-slide-switch',        label: 'Slide Switch' },
  { type: 'wokwi-photoresistor-sensor',label: 'Photoresistor' },
  { type: 'wokwi-pir-motion-sensor',   label: 'PIR Sensor' },
  { type: 'wokwi-hc-sr04',             label: 'Ultrasonic' },
  { type: 'wokwi-dht22',               label: 'DHT22' },
  { type: 'wokwi-servo',               label: 'Servo' },
  { type: 'wokwi-stepper-motor',       label: 'Stepper' },
  { type: 'wokwi-membrane-keypad',     label: 'Membrane Keypad' },
  { type: 'wokwi-buzzer',              label: 'Buzzer' },
  { type: 'wokwi-lcd1602',             label: 'LCD 16x2' },
  { type: 'wokwi-ssd1306',             label: 'OLED SSD1306' },
  { type: 'wokwi-neopixel-matrix',     label: 'NeoPixel Matrix' },
];

export interface PinRef {
  componentId: string;
  pinName:     string;
  /** Canvas position (unzoomed) */
  x: number;
  y: number;
}

export interface Wire {
  id:   string;
  from: PinRef;
  to:   PinRef;
  color: string;
}

export interface CircuitComponent {
  id:       string;
  type:     ComponentType;
  position: Position;
  name:     string;
}

interface CircuitStore {
  components:         CircuitComponent[];
  wires:              Wire[];
  selectedComponentId: string | null;
  wireInProgress:     PinRef | null;

  addComponent:           (type: ComponentType, position: Position) => void;
  updateComponentPosition:(id: string, position: Position) => void;
  selectComponent:        (id: string | null) => void;
  removeComponent:        (id: string) => void;
  clearCanvas:            () => void;

  startWire:    (from: PinRef) => void;
  completeWire: (to: PinRef)   => void;
  cancelWire:   ()             => void;
}

const WIRE_COLORS = ['#84cc16', '#38bdf8', '#f97316', '#a78bfa', '#fb7185', '#34d399'];
let colorIdx = 0;
const nextColor = () => WIRE_COLORS[colorIdx++ % WIRE_COLORS.length];

export const useCircuitStore = create<CircuitStore>((set, get) => ({
  components:          [],
  wires:               [],
  selectedComponentId: null,
  wireInProgress:      null,

  addComponent: (type, position) =>
    set((state) => {
      const id = `${type}-${Date.now()}`;
      const count = state.components.filter(c => c.type === type).length + 1;
      const name  = `${type.replace('wokwi-', '')} ${count}`;
      return {
        components: [...state.components, { id, type, position, name }],
        selectedComponentId: id,
      };
    }),

  updateComponentPosition: (id, position) =>
    set((state) => ({
      components: state.components.map(c => c.id === id ? { ...c, position } : c),
    })),

  selectComponent: (id) => set({ selectedComponentId: id }),

  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter(c => c.id !== id),
      wires:      state.wires.filter(w => w.from.componentId !== id && w.to.componentId !== id),
      selectedComponentId:
        state.selectedComponentId === id ? null : state.selectedComponentId,
    })),

  clearCanvas: () =>
    set({ components: [], wires: [], selectedComponentId: null, wireInProgress: null }),

  startWire: (from) => set({ wireInProgress: from }),

  completeWire: (to) => {
    const { wireInProgress } = get();
    if (!wireInProgress) return;
    if (
      wireInProgress.componentId === to.componentId &&
      wireInProgress.pinName === to.pinName
    ) return; // same pin — cancel
    set((state) => ({
      wires: [
        ...state.wires,
        { id: `wire-${Date.now()}`, from: wireInProgress, to, color: nextColor() },
      ],
      wireInProgress: null,
    }));
  },

  cancelWire: () => set({ wireInProgress: null }),
}));
