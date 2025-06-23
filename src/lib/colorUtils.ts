export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const { r, g, b } = rgb;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return rgbToHex(
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  );
}

export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

export function normalizeHex(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  return `#${hex.toLowerCase()}`;
}

export function generateRandomHex(): string {
  return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
}

export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function lightenColor(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  
  const newL = Math.min(100, hsl.l + amount);
  return hslToHex(hsl.h, hsl.s, newL);
}

export function darkenColor(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  
  const newL = Math.max(0, hsl.l - amount);
  return hslToHex(hsl.h, hsl.s, newL);
}

export function saturateColor(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  
  const newS = Math.min(100, hsl.s + amount);
  return hslToHex(hsl.h, newS, hsl.l);
}

export function desaturateColor(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  
  const newS = Math.max(0, hsl.s - amount);
  return hslToHex(hsl.h, newS, hsl.l);
}

export function generateColorPalette(baseColor: string, count: number = 5): string[] {
  const hsl = hexToHsl(baseColor);
  if (!hsl) return [baseColor];
  
  const colors: string[] = [];
  const hueStep = 360 / count;
  
  for (let i = 0; i < count; i++) {
    const newHue = (hsl.h + hueStep * i) % 360;
    colors.push(hslToHex(newHue, hsl.s, hsl.l));
  }
  
  return colors;
}

export function generateAnalogousColors(baseColor: string, count: number = 3): string[] {
  const hsl = hexToHsl(baseColor);
  if (!hsl) return [baseColor];
  
  const colors: string[] = [baseColor];
  const hueStep = 30; // 30 degrees for analogous colors
  
  for (let i = 1; i < count; i++) {
    const direction = i % 2 === 1 ? 1 : -1;
    const steps = Math.ceil(i / 2);
    const newHue = (hsl.h + direction * hueStep * steps + 360) % 360;
    colors.push(hslToHex(newHue, hsl.s, hsl.l));
  }
  
  return colors;
}

export function generateComplementaryColors(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  if (!hsl) return [baseColor];
  
  const complementaryHue = (hsl.h + 180) % 360;
  return [
    baseColor,
    hslToHex(complementaryHue, hsl.s, hsl.l)
  ];
}

export function generateTriadicColors(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  if (!hsl) return [baseColor];
  
  return [
    baseColor,
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
  ];
}

// Predefined color palettes
export const POPULAR_PALETTES = {
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'],
  ocean: ['#0abde3', '#006ba6', '#0c2461', '#40407a'],
  forest: ['#27ae60', '#2ecc71', '#00d2d3', '#01a3a4'],
  fire: ['#e74c3c', '#c0392b', '#f39c12', '#e67e22'],
  lavender: ['#a29bfe', '#6c5ce7', '#fd79a8', '#fdcb6e'],
  mint: ['#00b894', '#00cec9', '#55a3ff', '#74b9ff'],
  coral: ['#ff7675', '#fd79a8', '#fdcb6e', '#e17055'],
  twilight: ['#2d3436', '#636e72', '#a29bfe', '#6c5ce7']
};

export function getPaletteColors(paletteName: keyof typeof POPULAR_PALETTES): string[] {
  return POPULAR_PALETTES[paletteName] || [];
} 