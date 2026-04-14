import type { ImageContent, TextContent } from '@/store/useEditorStore';

/** Hit region for text — matches CanvasGradientRenderer.renderText layout */
export function getTextHitBounds(
  textContent: TextContent,
  canvasWidth: number,
  canvasHeight: number
): { left: number; top: number; right: number; bottom: number } {
  const x = (textContent.positionX / 100) * canvasWidth;
  const y = (textContent.positionY / 100) * canvasHeight;
  const fontSize = textContent.fontSize;
  const lines = textContent.text.length ? textContent.text.split('\n') : [''];
  const lineHeight = fontSize * textContent.lineHeight;
  const totalHeight = lines.length * lineHeight;
  const startY = y - totalHeight / 2 + lineHeight / 2;

  const measureCanvas = document.createElement('canvas');
  const ctx = measureCanvas.getContext('2d');
  if (!ctx) {
    return { left: 0, top: 0, right: canvasWidth, bottom: canvasHeight };
  }

  const fontStyle = textContent.fontStyle === 'italic' ? 'italic ' : '';
  ctx.font = `${fontStyle}${textContent.fontWeight} ${fontSize}px ${textContent.fontFamily}`;
  ctx.textAlign = textContent.textAlign as CanvasTextAlign;
  ctx.textBaseline = 'middle';
  if (textContent.letterSpacing !== 0) {
    ctx.letterSpacing = `${textContent.letterSpacing}px`;
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineY = startY + i * lineHeight;
    const m = ctx.measureText(line);
    const ascent = m.actualBoundingBoxAscent ?? fontSize * 0.65;
    const descent = m.actualBoundingBoxDescent ?? fontSize * 0.35;
    minY = Math.min(minY, lineY - ascent);
    maxY = Math.max(maxY, lineY + descent);

    const w = m.width;
    let left: number;
    let right: number;
    if (textContent.textAlign === 'center') {
      left = x - w / 2;
      right = x + w / 2;
    } else if (textContent.textAlign === 'right') {
      left = x - w;
      right = x;
    } else {
      left = x;
      right = x + w;
    }
    minX = Math.min(minX, left);
    maxX = Math.max(maxX, right);
  }

  const pad = 10;
  return {
    left: minX - pad,
    right: maxX + pad,
    top: minY - pad,
    bottom: maxY + pad,
  };
}

export function getImageHitBounds(
  imageContent: ImageContent,
  canvasWidth: number,
  canvasHeight: number
): { left: number; top: number; right: number; bottom: number } {
  const cx = (imageContent.positionX / 100) * canvasWidth;
  const cy = (imageContent.positionY / 100) * canvasHeight;
  const w = imageContent.width;
  const h = imageContent.height;
  const left = cx - w / 2;
  const top = cy - h / 2;
  const pad = 8;
  return {
    left: left - pad,
    right: left + w + pad,
    top: top - pad,
    bottom: top + h + pad,
  };
}

export function clampPercent(v: number): number {
  return Math.max(0, Math.min(100, v));
}
