'use client';

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import {
  getTextHitBounds,
  getImageHitBounds,
  clampPercent,
} from '@/lib/canvasContentBounds';

interface CanvasGradientRendererProps {
  width?: number;
  height?: number;
  className?: string;
}

export interface CanvasGradientRendererRef {
  exportAsPNG: (width: number, height: number) => Promise<Blob | null>;
  exportAsDataURL: (width: number, height: number) => Promise<string>;
}

export const CanvasGradientRenderer = forwardRef<CanvasGradientRendererRef, CanvasGradientRendererProps>(function CanvasGradientRenderer({ 
  width = 960, 
  height = 540, 
  className = '' 
}, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());
  const { gradient, textContent, imageContent, contentType } = useEditorStore();
  const dragRef = useRef<{
    kind: 'text' | 'image';
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const canvasPointerToInternal = (
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      px: (clientX - rect.left) * scaleX,
      py: (clientY - rect.top) * scaleY,
    };
  };

  const updateCanvasCursor = (
    canvas: HTMLCanvasElement | null,
    clientX: number,
    clientY: number
  ) => {
    if (!canvas) return;
    if (dragRef.current) {
      canvas.style.cursor = 'grabbing';
      return;
    }
    const { px, py } = canvasPointerToInternal(canvas, clientX, clientY);
    if (contentType === 'text' && textContent) {
      const b = getTextHitBounds(textContent, width, height);
      if (px >= b.left && px <= b.right && py >= b.top && py <= b.bottom) {
        canvas.style.cursor = 'grab';
        return;
      }
    } else if (contentType === 'image' && imageContent) {
      const b = getImageHitBounds(imageContent, width, height);
      if (px >= b.left && px <= b.right && py >= b.top && py <= b.bottom) {
        canvas.style.cursor = 'grab';
        return;
      }
    }
    canvas.style.cursor = 'default';
  };

  // Create noise texture for grain effect
  const createNoiseTexture = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number = 0.1) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity * 255;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
      // Keep original alpha
    }
    
    return imageData;
  };

  // Create linear gradient
  const createLinearGradient = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    const angle = (gradient.angle * Math.PI) / 180;
    const x1 = canvasWidth / 2 + Math.cos(angle + Math.PI / 2) * canvasWidth / 2;
    const y1 = canvasHeight / 2 + Math.sin(angle + Math.PI / 2) * canvasHeight / 2;
    const x2 = canvasWidth / 2 - Math.cos(angle + Math.PI / 2) * canvasWidth / 2;
    const y2 = canvasHeight / 2 - Math.sin(angle + Math.PI / 2) * canvasHeight / 2;
    
    const linearGradient = ctx.createLinearGradient(x1, y1, x2, y2);
    
    gradient.colors.forEach(color => {
      linearGradient.addColorStop(color.position / 100, color.hex);
    });
    
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  // Create radial gradient
  const createRadialGradient = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    const centerX = (gradient.centerX / 100) * canvasWidth;
    const centerY = (gradient.centerY / 100) * canvasHeight;
    const radius = Math.max(canvasWidth, canvasHeight) * 0.7;
    
    const radialGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    
    gradient.colors.forEach(color => {
      radialGradient.addColorStop(color.position / 100, color.hex);
    });
    
    ctx.fillStyle = radialGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  // Render text content
  const renderText = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    if (!textContent) return;
    
    const x = (textContent.positionX / 100) * canvasWidth;
    const y = (textContent.positionY / 100) * canvasHeight;
    
    // Save current context
    ctx.save();
    
    // Set up text properties
    const fontStyle = textContent.fontStyle === 'italic' ? 'italic ' : '';
    const fontWeight = textContent.fontWeight;
    const fontSize = textContent.fontSize;
    const fontFamily = textContent.fontFamily;
    
    ctx.font = `${fontStyle}${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = textContent.textAlign as CanvasTextAlign;
    ctx.textBaseline = 'middle';
    
    // Apply text decoration effects
    if (textContent.glow > 0) {
      ctx.shadowColor = textContent.color;
      ctx.shadowBlur = textContent.glow;
    }
    
    // Set text color and opacity
    const color = textContent.color;
    const alpha = Math.round((textContent.opacity / 100) * 255).toString(16).padStart(2, '0');
    ctx.fillStyle = color + alpha;
    
    // Handle line spacing for multi-line text
    const lines = textContent.text.split('\n');
    const lineHeight = fontSize * textContent.lineHeight;
    const totalHeight = lines.length * lineHeight;
    const startY = y - (totalHeight / 2) + (lineHeight / 2);
    
    // Set letter spacing
    if (textContent.letterSpacing !== 0) {
      ctx.letterSpacing = `${textContent.letterSpacing}px`;
    }
    
    lines.forEach((line, index) => {
      const lineY = startY + (index * lineHeight);
      
      // Render text with underline if needed
      ctx.fillText(line, x, lineY);
      
      if (textContent.textDecoration === 'underline') {
        const metrics = ctx.measureText(line);
        const underlineY = lineY + fontSize * 0.1;
        
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = Math.max(1, fontSize * 0.05);
        ctx.beginPath();
        
        let startX = x;
        if (textContent.textAlign === 'center') {
          startX = x - metrics.width / 2;
        } else if (textContent.textAlign === 'right') {
          startX = x - metrics.width;
        }
        
        ctx.moveTo(startX, underlineY);
        ctx.lineTo(startX + metrics.width, underlineY);
        ctx.stroke();
      }
    });
    
    // Restore context
    ctx.restore();
  };

  // Load and render image content
  const renderImage = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    if (!imageContent) return;
    
    const img = loadedImages.get(imageContent.src);
    if (!img) return;
    
    const x = (imageContent.positionX / 100) * canvasWidth - imageContent.width / 2;
    const y = (imageContent.positionY / 100) * canvasHeight - imageContent.height / 2;
    
    // Save current context
    ctx.save();
    
    // Apply rotation
    if (imageContent.rotation !== 0) {
      const centerX = x + imageContent.width / 2;
      const centerY = y + imageContent.height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((imageContent.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
    }
    
    // Apply image filters
    let filters = [];
    
    if (imageContent.blur > 0) {
      filters.push(`blur(${imageContent.blur}px)`);
    }
    
    if (imageContent.brightness !== 100) {
      filters.push(`brightness(${imageContent.brightness}%)`);
    }
    
    if (imageContent.contrast !== 100) {
      filters.push(`contrast(${imageContent.contrast}%)`);
    }
    
    if (imageContent.saturation !== 100) {
      filters.push(`saturate(${imageContent.saturation}%)`);
    }
    
    if (filters.length > 0) {
      ctx.filter = filters.join(' ');
    }
    
    // Apply opacity
    ctx.globalAlpha = imageContent.opacity / 100;
    
    // Draw the image
    ctx.drawImage(img, x, y, imageContent.width, imageContent.height);
    
    // Restore context
    ctx.restore();
  };

  // Apply effects (blur, grain, etc.)
  const applyEffects = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    // Build filter string for gradient effects
    let filters = [];
    
    if (gradient.blur > 0) {
      filters.push(`blur(${gradient.blur}px)`);
    }
    
    if (gradient.saturation !== 100) {
      filters.push(`saturate(${gradient.saturation}%)`);
    }
    
    if (gradient.contrast !== 100) {
      filters.push(`contrast(${gradient.contrast}%)`);
    }
    
    if (gradient.brightness !== 100) {
      filters.push(`brightness(${gradient.brightness}%)`);
    }
    
    // Apply all filters at once
    if (filters.length > 0) {
      ctx.filter = filters.join(' ');
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      ctx.filter = 'none';
      ctx.putImageData(imageData, 0, 0);
    }
    
    // Apply grain texture
    if (gradient.grain > 0) {
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = gradient.grain / 100 * 0.3;
      
      const noiseTexture = createNoiseTexture(ctx, canvasWidth, canvasHeight, gradient.grain / 100);
      ctx.putImageData(noiseTexture, 0, 0);
      
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    
    // Apply glow effect
    if (gradient.glow > 0) {
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = gradient.glow;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.1;
      
      // Redraw with glow
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      ctx.putImageData(imageData, 0, 0);
      
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  // Main render function
  const renderToCanvas = (canvas: HTMLCanvasElement, canvasWidth: number, canvasHeight: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Render gradient based on type
    switch (gradient.type) {
      case 'linear':
        createLinearGradient(ctx, canvasWidth, canvasHeight);
        break;
      case 'radial':
        createRadialGradient(ctx, canvasWidth, canvasHeight);
        break;
    }
    
    // Apply gradient effects
    applyEffects(ctx, canvasWidth, canvasHeight);
    
    // Render content on top
    renderImage(ctx, canvasWidth, canvasHeight);
    renderText(ctx, canvasWidth, canvasHeight);
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderToCanvas(canvas, width, height);
  };

  // Load images when imageContent changes
  useEffect(() => {
    if (imageContent && !loadedImages.has(imageContent.src)) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setLoadedImages(prev => new Map(prev).set(imageContent.src, img));
      };
      img.onerror = () => {
        console.error('Failed to load image:', imageContent.src);
      };
      img.src = imageContent.src;
    }
  }, [imageContent, loadedImages]);

  // Export methods
  useImperativeHandle(ref, () => ({
    exportAsPNG: async (exportWidth: number, exportHeight: number): Promise<Blob | null> => {
      return new Promise((resolve) => {
        const exportCanvas = document.createElement('canvas');
        renderToCanvas(exportCanvas, exportWidth, exportHeight);
        
        exportCanvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    },
    
    exportAsDataURL: async (exportWidth: number, exportHeight: number): Promise<string> => {
      const exportCanvas = document.createElement('canvas');
      renderToCanvas(exportCanvas, exportWidth, exportHeight);
      return exportCanvas.toDataURL('image/png', 1.0);
    }
  }));

  // Re-render when any content changes
  useEffect(() => {
    render();
  }, [gradient, textContent, imageContent, loadedImages, width, height]);

  // Initial render
  useEffect(() => {
    render();
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.button !== 0) return;
    const { px, py } = canvasPointerToInternal(canvas, e.clientX, e.clientY);

    if (contentType === 'text' && textContent) {
      const b = getTextHitBounds(textContent, width, height);
      if (px < b.left || px > b.right || py < b.top || py > b.bottom) return;
      const ax = (textContent.positionX / 100) * width;
      const ay = (textContent.positionY / 100) * height;
      dragRef.current = { kind: 'text', offsetX: px - ax, offsetY: py - ay };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
      e.preventDefault();
      return;
    }

    if (contentType === 'image' && imageContent) {
      const b = getImageHitBounds(imageContent, width, height);
      if (px < b.left || px > b.right || py < b.top || py > b.bottom) return;
      const ax = (imageContent.positionX / 100) * width;
      const ay = (imageContent.positionY / 100) * height;
      dragRef.current = { kind: 'image', offsetX: px - ax, offsetY: py - ay };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
      e.preventDefault();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { px, py } = canvasPointerToInternal(canvas, e.clientX, e.clientY);
    const d = dragRef.current;

    if (d) {
      const nx = px - d.offsetX;
      const ny = py - d.offsetY;
      useEditorStore.getState().setContentPosition(
        clampPercent((nx / width) * 100),
        clampPercent((ny / height) * 100)
      );
      e.preventDefault();
      return;
    }

    updateCanvasCursor(canvas, e.clientX, e.clientY);
  };

  const endDrag = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (dragRef.current && canvas?.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
    if (canvas) {
      updateCanvasCursor(canvas, e.clientX, e.clientY);
    }
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      suppressHydrationWarning
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg shadow-2xl border border-gray-700 touch-none select-none"
        style={{ width, height }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => {
          if (!dragRef.current && canvasRef.current) {
            canvasRef.current.style.cursor = 'default';
          }
        }}
      />
    </motion.div>
  );
});

CanvasGradientRenderer.displayName = 'CanvasGradientRenderer'; 