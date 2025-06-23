'use client';

import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useEditorStore, gridToPercent } from '@/store/useEditorStore';
import { motion } from 'framer-motion';

interface GridPositionSelectorProps {
  className?: string;
}

export function GridPositionSelector({ className = '' }: GridPositionSelectorProps) {
  const { contentType, textContent, imageContent, setContentGridPosition } = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current grid position based on content type
  const getCurrentGridPosition = () => {
    if (contentType === 'text' && textContent) {
      return { gridX: textContent.gridX, gridY: textContent.gridY };
    } else if (contentType === 'image' && imageContent) {
      return { gridX: imageContent.gridX, gridY: imageContent.gridY };
    }
    return { gridX: 2, gridY: 1 }; // default center
  };

  const { gridX: currentGridX, gridY: currentGridY } = getCurrentGridPosition();

  // Calculate current position in pixels within the container
  const getCirclePosition = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const rect = containerRef.current.getBoundingClientRect();
    const { x: xPercent, y: yPercent } = gridToPercent(currentGridX, currentGridY);
    
    // Convert percentage to pixels within container
    const x = (xPercent / 100) * rect.width;
    const y = (yPercent / 100) * rect.height;
    
    return { x, y };
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    
    if (!snapToGrid || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Get drag position relative to container
    const relativeX = info.point.x - containerRect.left;
    const relativeY = info.point.y - containerRect.top;
    
    // Convert to percentage
    const xPercent = (relativeX / containerRect.width) * 100;
    const yPercent = (relativeY / containerRect.height) * 100;
    
    // Calculate nearest grid position (5x3 grid)
    const gridX = Math.round((xPercent / 100) * 4); // 0-4
    const gridY = Math.round((yPercent / 100) * 2); // 0-2
    
    // Clamp values
    const clampedX = Math.max(0, Math.min(4, gridX));
    const clampedY = Math.max(0, Math.min(2, gridY));
    
    setContentGridPosition(clampedX, clampedY);
  };

  const currentPosition = getCirclePosition();

  return (
    <Card className={`p-6 bg-gray-800 border-gray-700 ${className}`}>
      <div className="relative w-full flex flex-col gap-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <Label className="text-sm text-gray-400">Position</Label>
          <div className="flex items-center gap-2">
            <label 
              htmlFor="snap-grid" 
              className="text-xs text-gray-400 cursor-pointer"
            >
              Snap to Grid
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={snapToGrid}
              data-state={snapToGrid ? "checked" : "unchecked"}
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`
                peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent 
                transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
                focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50
                ${snapToGrid ? 'bg-blue-600' : 'bg-gray-600'}
              `}
              id="snap-grid"
            >
              <span
                data-state={snapToGrid ? "checked" : "unchecked"}
                className={`
                  pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform
                  ${snapToGrid ? 'translate-x-4' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Grid Container */}
        <div 
          ref={containerRef}
          className="relative rounded-xl bg-gray-900 border border-gray-700 mx-auto scale-95 hover:scale-100 transition-all duration-300 ease-[cubic-bezier(0.45, 0.05, 0.55, 0.95)] hover:border-gray-600 max-w-[280px]"
          style={{
            width: '100%',
            height: '157px', // 16:9 aspect ratio based on 280px width
            aspectRatio: '16 / 9',
            backgroundImage: 'radial-gradient(circle at center, rgba(156, 163, 175, 0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {/* Draggable Circle */}
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={containerRef}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            animate={{
              x: currentPosition.x,
              y: currentPosition.y
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`
              absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg
              ${isDragging ? 'cursor-grabbing shadow-blue-500/50' : 'cursor-grab'}
              ${!snapToGrid ? 'shadow-blue-500/30' : ''}
            `}
            style={{
              touchAction: 'none'
            }}
          />
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500 text-center">
          {snapToGrid ? `Grid: ${currentGridX + 1}, ${currentGridY + 1}` : 'Free positioning'}
        </div>
      </div>
    </Card>
  );
}