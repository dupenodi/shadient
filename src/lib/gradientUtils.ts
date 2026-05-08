import { GradientConfig, MeshNode } from '@/store/useEditorStore';

export function generateLinearGradientCSS(gradient: GradientConfig): string {
  const { angle, colors, blur, saturation, glow } = gradient;
  
  // Sort colors by position
  const sortedColors = [...colors].sort((a, b) => a.position - b.position);
  
  // Create color stops
  const colorStops = sortedColors.map(color => `${color.hex} ${color.position}%`).join(', ');
  
  let gradientCSS = `linear-gradient(${angle}deg, ${colorStops})`;
  
  // Apply effects
  if (blur > 0) {
    gradientCSS = `filter: blur(${blur}px); background: ${gradientCSS}`;
  }
  
  if (saturation !== 100) {
    const filterPrefix = blur > 0 ? '' : 'filter: ';
    const blurFilter = blur > 0 ? `blur(${blur}px) ` : '';
    gradientCSS = `${filterPrefix}${blurFilter}saturate(${saturation}%); background: linear-gradient(${angle}deg, ${colorStops})`;
  }
  
  if (glow > 0) {
    const glowIntensity = glow / 100;
    gradientCSS += `; box-shadow: 0 0 ${glow}px rgba(255, 255, 255, ${glowIntensity})`;
  }
  
  return gradientCSS;
}

export function generateRadialGradientCSS(gradient: GradientConfig): string {
  const { centerX, centerY, colors, blur, saturation, glow } = gradient;
  
  // Sort colors by position
  const sortedColors = [...colors].sort((a, b) => a.position - b.position);
  
  // Create color stops
  const colorStops = sortedColors.map(color => `${color.hex} ${color.position}%`).join(', ');
  
  let gradientCSS = `radial-gradient(circle at ${centerX}% ${centerY}%, ${colorStops})`;
  
  // Apply effects (similar to linear)
  if (blur > 0) {
    gradientCSS = `filter: blur(${blur}px); background: ${gradientCSS}`;
  }
  
  if (saturation !== 100) {
    const filterPrefix = blur > 0 ? '' : 'filter: ';
    const blurFilter = blur > 0 ? `blur(${blur}px) ` : '';
    gradientCSS = `${filterPrefix}${blurFilter}saturate(${saturation}%); background: radial-gradient(circle at ${centerX}% ${centerY}%, ${colorStops})`;
  }
  
  if (glow > 0) {
    const glowIntensity = glow / 100;
    gradientCSS += `; box-shadow: 0 0 ${glow}px rgba(255, 255, 255, ${glowIntensity})`;
  }
  
  return gradientCSS;
}

export function generateMeshGradientSVG(
  gradient: GradientConfig,
  width: number = 800,
  height: number = 600
): string {
  const { meshNodes, blur, saturation } = gradient;
  
  if (meshNodes.length === 0) {
    // Fallback to linear gradient if no mesh nodes
    return generateLinearGradientSVG(gradient, width, height);
  }
  
  // Create SVG with mesh gradient
  const gradientDefs = meshNodes.map((node: MeshNode, index: number) => {
    const x = (node.x / 100) * width;
    const y = (node.y / 100) * height;
    const r = (node.size / 100) * Math.min(width, height) * 0.5;
    
    return `
      <radialGradient id="mesh-${index}" cx="${x}" cy="${y}" r="${r}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${node.color}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${node.color}" stop-opacity="0"/>
      </radialGradient>
    `;
  }).join('');
  
  const meshCircles = meshNodes.map((node: MeshNode, index: number) => {
    const x = (node.x / 100) * width;
    const y = (node.y / 100) * height;
    const r = (node.size / 100) * Math.min(width, height) * 0.5;
    
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#mesh-${index})" />`;
  }).join('');
  
  // Apply filters
  let filters = '';
  if (blur > 0) {
    filters += `<feGaussianBlur stdDeviation="${blur}" />`;
  }
  if (saturation !== 100) {
    filters += `<feColorMatrix type="saturate" values="${saturation / 100}" />`;
  }
  
  const filterDef = filters ? `
    <filter id="effects">
      ${filters}
    </filter>
  ` : '';
  
  const filterAttr = filters ? 'filter="url(#effects)"' : '';
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${gradientDefs}
        ${filterDef}
      </defs>
      <rect width="100%" height="100%" fill="#000000" />
      <g ${filterAttr}>
        ${meshCircles}
      </g>
    </svg>
  `;
}

export function generateLinearGradientSVG(
  gradient: GradientConfig,
  width: number = 800,
  height: number = 600
): string {
  const { angle, colors, blur, saturation } = gradient;
  
  // Calculate gradient direction from angle
  const radians = (angle * Math.PI) / 180;
  const x1 = 50 + 50 * Math.cos(radians + Math.PI / 2);
  const y1 = 50 + 50 * Math.sin(radians + Math.PI / 2);
  const x2 = 50 - 50 * Math.cos(radians + Math.PI / 2);
  const y2 = 50 - 50 * Math.sin(radians + Math.PI / 2);
  
  // Sort colors by position
  const sortedColors = [...colors].sort((a, b) => a.position - b.position);
  
  const colorStops = sortedColors.map(color => 
    `<stop offset="${color.position}%" stop-color="${color.hex}" />`
  ).join('');
  
  // Apply filters
  let filters = '';
  if (blur > 0) {
    filters += `<feGaussianBlur stdDeviation="${blur}" />`;
  }
  if (saturation !== 100) {
    filters += `<feColorMatrix type="saturate" values="${saturation / 100}" />`;
  }
  
  const filterDef = filters ? `
    <filter id="effects">
      ${filters}
    </filter>
  ` : '';
  
  const filterAttr = filters ? 'filter="url(#effects)"' : '';
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          ${colorStops}
        </linearGradient>
        ${filterDef}
      </defs>
      <rect width="100%" height="100%" fill="url(#gradient)" ${filterAttr} />
    </svg>
  `;
}

export function generateRadialGradientSVG(
  gradient: GradientConfig,
  width: number = 800,
  height: number = 600
): string {
  const { centerX, centerY, colors, blur, saturation } = gradient;
  
  // Sort colors by position
  const sortedColors = [...colors].sort((a, b) => a.position - b.position);
  
  const colorStops = sortedColors.map(color => 
    `<stop offset="${color.position}%" stop-color="${color.hex}" />`
  ).join('');
  
  // Apply filters
  let filters = '';
  if (blur > 0) {
    filters += `<feGaussianBlur stdDeviation="${blur}" />`;
  }
  if (saturation !== 100) {
    filters += `<feColorMatrix type="saturate" values="${saturation / 100}" />`;
  }
  
  const filterDef = filters ? `
    <filter id="effects">
      ${filters}
    </filter>
  ` : '';
  
  const filterAttr = filters ? 'filter="url(#effects)"' : '';
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gradient" cx="${centerX}%" cy="${centerY}%" r="50%">
          ${colorStops}
        </radialGradient>
        ${filterDef}
      </defs>
      <rect width="100%" height="100%" fill="url(#gradient)" ${filterAttr} />
    </svg>
  `;
}

export function exportGradientAsCSS(gradient: GradientConfig): string {
  switch (gradient.type) {
    case 'linear':
      return `background: ${generateLinearGradientCSS(gradient)};`;
    case 'radial':
      return `background: ${generateRadialGradientCSS(gradient)};`;
    case 'mesh':
      return '/* Mesh gradients require SVG or Canvas rendering */';
    default:
      return '';
  }
}

export function interpolateColor(color1: string, color2: string, factor: number): string {
  // Simple hex color interpolation
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);
  
  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
} 