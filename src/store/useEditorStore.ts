import { create } from 'zustand';

export type GradientType = 'linear' | 'radial' | 'mesh';
export type ExportType = 'png' | 'svg' | 'css' | 'mp4';
export type EditorMode = 'design' | 'export';
export type ContentType = 'text' | 'image' | 'none';

export interface Color {
  id: string;
  hex: string;
  position: number; // 0-100 for gradient stops
}

export interface TextContent {
  id: string;
  text: string;
  /** Anchor X on canvas, 0–100 (see textAlign for horizontal anchor) */
  positionX: number;
  /** Anchor Y on canvas, 0–100 (vertical center of the text block) */
  positionY: number;
  fontSize: number; // px
  fontFamily: string;
  fontWeight: number; // 100-900
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  letterSpacing: number; // px
  lineHeight: number; // multiplier
  color: string;
  opacity: number; // 0-100
  glow: number; // 0-100
}

export interface ImageContent {
  id: string;
  src: string;
  /** Center X on canvas, 0–100 */
  positionX: number;
  /** Center Y on canvas, 0–100 */
  positionY: number;
  width: number; // px
  height: number; // px
  opacity: number; // 0-100
  blur: number; // 0-100
  brightness: number; // 0-200
  contrast: number; // 0-200
  saturation: number; // 0-200
  rotation: number; // 0-360
}

export interface MeshNode {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface GradientConfig {
  type: GradientType;
  angle: number; // for linear gradients (0-360)
  centerX: number; // for radial gradients (0-100)
  centerY: number; // for radial gradients (0-100)
  colors: Color[];
  /** Used when type is `mesh`; empty otherwise */
  meshNodes: MeshNode[];
  blur: number; // global blur effect (0-100)
  saturation: number; // global saturation (0-200)
  glow: number; // global glow effect (0-100)
  grain: number; // grain/noise texture (0-100)
  contrast: number; // contrast adjustment (0-200)
  brightness: number; // brightness adjustment (0-200)
}

export interface EditorState {
  mode: EditorMode;
  gradient: GradientConfig;
  contentType: ContentType;
  textContent: TextContent | null;
  imageContent: ImageContent | null;
  
  // Actions
  setMode: (mode: EditorMode) => void;
  setGradientType: (type: GradientType) => void;
  setGradientAngle: (angle: number) => void;
  setRadialCenter: (x: number, y: number) => void;
  
  // Color management
  addColor: (hex: string, position?: number) => void;
  updateColor: (id: string, updates: Partial<Color>) => void;
  removeColor: (id: string) => void;
  
  // Global effects
  setBlur: (blur: number) => void;
  setSaturation: (saturation: number) => void;
  setGlow: (glow: number) => void;
  setGrain: (grain: number) => void;
  setContrast: (contrast: number) => void;
  setBrightness: (brightness: number) => void;
  
  // Content management
  setContentType: (type: ContentType) => void;
  createTextContent: (text: string) => void;
  updateTextContent: (updates: Partial<TextContent>) => void;
  createImageContent: (src: string) => void;
  updateImageContent: (updates: Partial<ImageContent>) => void;
  clearContent: () => void;
  
  /** Free position on canvas preview (0–100). Updated by dragging on the canvas. */
  setContentPosition: (positionX: number, positionY: number) => void;
  
  // Gradient generation
  generateRandomGradient: () => void;
}

let idCounter = 1;
const generateId = () => `generated-id-${idCounter++}`;

// Predefined color palettes for random generation
const colorPalettes = [
  ['#ff6b6b', '#4ecdc4', '#45b7d1'],
  ['#667eea', '#764ba2', '#f093fb'],
  ['#ffecd2', '#fcb69f', '#ff8a80'],
  ['#a8edea', '#fed6e3', '#ff9a9e'],
  ['#d299c2', '#fef9d7', '#89f7fe'],
  ['#667db6', '#0082c8', '#667db6'],
  ['#f093fb', '#f5576c', '#4facfe'],
  ['#43e97b', '#38f9d7', '#667eea'],
  ['#fa709a', '#fee140', '#f093fb'],
  ['#a8edea', '#fed6e3', '#667eea']
];

const getRandomPalette = () => {
  return colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
};

export const useEditorStore = create<EditorState>((set) => ({
  mode: 'design',
  gradient: {
    type: 'linear',
    angle: 135,
    centerX: 50,
    centerY: 50,
    colors: [
      { id: 'initial-color-1', hex: '#667eea', position: 0 },
      { id: 'initial-color-2', hex: '#764ba2', position: 50 },
      { id: 'initial-color-3', hex: '#f093fb', position: 100 }
    ],
    meshNodes: [],
    blur: 0,
    saturation: 110,
    glow: 5,
    grain: 25,
    contrast: 105,
    brightness: 100,
  },
  contentType: 'text',
  textContent: {
    id: 'default-text',
    text: 'wolpapor',
    positionX: 50,
    positionY: 50,
    fontSize: 72,
    fontFamily: 'Inter',
    fontWeight: 700,
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: 1.2,
    color: '#ffffff',
    opacity: 90,
    glow: 20,
  },
  imageContent: null,

  // Mode actions
  setMode: (mode) => set({ mode }),
  
  // Gradient actions
  setGradientType: (type) => set((state) => ({
    gradient: { ...state.gradient, type }
  })),
  
  setGradientAngle: (angle) => set((state) => ({
    gradient: { ...state.gradient, angle }
  })),
  
  setRadialCenter: (x, y) => set((state) => ({
    gradient: { ...state.gradient, centerX: x, centerY: y }
  })),

  // Color management
  addColor: (hex, position = 50) => set((state) => {
    const newColor: Color = {
      id: generateId(),
      hex,
      position,
    };
    return {
      gradient: {
        ...state.gradient,
        colors: [...state.gradient.colors, newColor].sort((a, b) => a.position - b.position)
      }
    };
  }),

  updateColor: (id, updates) => set((state) => ({
    gradient: {
      ...state.gradient,
      colors: state.gradient.colors.map(color =>
        color.id === id ? { ...color, ...updates } : color
      ).sort((a, b) => a.position - b.position)
    }
  })),

  removeColor: (id) => set((state) => {
    const colors = state.gradient.colors.filter(color => color.id !== id);
    // Ensure at least 2 colors remain
    if (colors.length < 2) return state;
    return {
      gradient: { ...state.gradient, colors }
    };
  }),

  // Global effects
  setBlur: (blur) => set((state) => ({
    gradient: { ...state.gradient, blur }
  })),

  setSaturation: (saturation) => set((state) => ({
    gradient: { ...state.gradient, saturation }
  })),

  setGlow: (glow) => set((state) => ({
    gradient: { ...state.gradient, glow }
  })),

  setGrain: (grain) => set((state) => ({
    gradient: { ...state.gradient, grain }
  })),

  setContrast: (contrast) => set((state) => ({
    gradient: { ...state.gradient, contrast }
  })),

  setBrightness: (brightness) => set((state) => ({
    gradient: { ...state.gradient, brightness }
  })),

  // Content management
  setContentType: (type) => set(() => {
    // Clear existing content when switching types
    if (type === 'none') {
      return { contentType: type, textContent: null, imageContent: null };
    } else if (type === 'text') {
      return { contentType: type, imageContent: null };
    } else if (type === 'image') {
      return { contentType: type, textContent: null };
    }
    return { contentType: type };
  }),

  createTextContent: (text) => set(() => {
    const newTextContent: TextContent = {
      id: generateId(),
      text,
      positionX: 50,
      positionY: 50,
      fontSize: 48,
      fontFamily: 'Inter',
      fontWeight: 600,
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
      color: '#ffffff',
      opacity: 100,
      glow: 0,
    };
    return {
      contentType: 'text' as ContentType,
      textContent: newTextContent,
      imageContent: null
    };
  }),

  updateTextContent: (updates) => set((state) => ({
    textContent: state.textContent ? { ...state.textContent, ...updates } : null
  })),

  createImageContent: (src) => set(() => {
    const newImageContent: ImageContent = {
      id: generateId(),
      src,
      positionX: 50,
      positionY: 50,
      width: 200,
      height: 200,
      opacity: 100,
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      rotation: 0,
    };
    return {
      contentType: 'image' as ContentType,
      imageContent: newImageContent,
      textContent: null
    };
  }),

  updateImageContent: (updates) => set((state) => ({
    imageContent: state.imageContent ? { ...state.imageContent, ...updates } : null
  })),

  clearContent: () => set({
    contentType: 'none',
    textContent: null,
    imageContent: null
  }),

  setContentPosition: (positionX, positionY) =>
    set((state) => {
      const x = Math.max(0, Math.min(100, positionX));
      const y = Math.max(0, Math.min(100, positionY));
      if (state.contentType === 'text' && state.textContent) {
        return { textContent: { ...state.textContent, positionX: x, positionY: y } };
      }
      if (state.contentType === 'image' && state.imageContent) {
        return { imageContent: { ...state.imageContent, positionX: x, positionY: y } };
      }
      return state;
    }),

  // Gradient generation
  generateRandomGradient: () => set(() => {
    const palette = getRandomPalette();
    const type = Math.random() > 0.5 ? 'linear' : 'radial';
    const angle = Math.floor(Math.random() * 360);
    const centerX = 30 + Math.random() * 40; // 30-70%
    const centerY = 30 + Math.random() * 40; // 30-70%
    
    const colors = palette.map((color, index) => ({
      id: generateId(),
      hex: color,
      position: (index / (palette.length - 1)) * 100
    }));
    
    // Add some random variation to positions (except first and last)
    colors.forEach((color, index) => {
      if (index > 0 && index < colors.length - 1) {
        color.position += (Math.random() - 0.5) * 20; // ±10%
        color.position = Math.max(5, Math.min(95, color.position));
      }
    });
    
    const newGradient: GradientConfig = {
      type,
      angle,
      centerX,
      centerY,
      colors: colors.sort((a, b) => a.position - b.position),
      meshNodes: [],
      blur: Math.random() * 3,
      saturation: 90 + Math.random() * 30,
      glow: Math.random() * 10,
      grain: Math.random() * 40,
      contrast: 95 + Math.random() * 20,
      brightness: 95 + Math.random() * 15,
    };
    
    return { gradient: newGradient };
  }),
})); 