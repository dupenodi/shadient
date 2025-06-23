'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { 
  generateLinearGradientCSS, 
  generateRadialGradientCSS,
  generateLinearGradientSVG,
  generateRadialGradientSVG,
  generateMeshGradientSVG
} from '@/lib/gradientUtils';

interface GradientCanvasProps {
  className?: string;
  width?: number;
  height?: number;
}

export function GradientCanvas({ 
  className = '', 
  width = 800, 
  height = 600 
}: GradientCanvasProps) {
  const { gradient, animation, isPlaying } = useEditorStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  const renderCSSGradient = () => {
    if (gradient.type === 'mesh') return null;

    let gradientStyle = '';
    if (gradient.type === 'linear') {
      gradientStyle = generateLinearGradientCSS(gradient);
    } else if (gradient.type === 'radial') {
      gradientStyle = generateRadialGradientCSS(gradient);
    }

    // Parse the gradient style to extract background and filters
    const parts = gradientStyle.split(';').map(part => part.trim()).filter(Boolean);
    const backgroundPart = parts.find(part => part.startsWith('background:'));
    const filterPart = parts.find(part => part.startsWith('filter:'));
    const boxShadowPart = parts.find(part => part.startsWith('box-shadow:'));

    const style: React.CSSProperties = {};
    
    if (backgroundPart) {
      style.background = backgroundPart.replace('background:', '').trim();
    }
    if (filterPart) {
      style.filter = filterPart.replace('filter:', '').trim();
    }
    if (boxShadowPart) {
      style.boxShadow = boxShadowPart.replace('box-shadow:', '').trim();
    }

    return (
      <motion.div
        className="w-full h-full"
        style={style}
        animate={animation.enabled && isPlaying ? {
          filter: [
            style.filter || 'none',
            `${style.filter || ''} hue-rotate(360deg)`.trim(),
            style.filter || 'none'
          ]
        } : {}}
        transition={{
          duration: animation.duration / animation.speed,
          repeat: animation.loop ? Infinity : 0,
          repeatType: animation.direction as "loop" | "reverse" | "mirror",
        }}
      />
    );
  };

  const renderSVGGradient = () => {
    let svgContent = '';
    
    if (gradient.type === 'linear') {
      svgContent = generateLinearGradientSVG(gradient, width, height);
    } else if (gradient.type === 'radial') {
      svgContent = generateRadialGradientSVG(gradient, width, height);
    } else if (gradient.type === 'mesh') {
      svgContent = generateMeshGradientSVG(gradient, width, height);
    }

    return (
      <motion.div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        animate={animation.enabled && isPlaying ? {
          filter: [
            'hue-rotate(0deg)',
            'hue-rotate(360deg)',
            'hue-rotate(0deg)'
          ]
        } : {}}
        transition={{
          duration: animation.duration / animation.speed,
          repeat: animation.loop ? Infinity : 0,
          repeatType: animation.direction as "loop" | "reverse" | "mirror",
        }}
      />
    );
  };

  // Use SVG for mesh gradients, CSS for linear/radial
  const shouldUseSVG = gradient.type === 'mesh' || gradient.blur > 0 || gradient.glow > 0;

  return (
    <div 
      ref={canvasRef}
      className={`relative overflow-hidden bg-gray-900 ${className}`}
      style={{ width, height }}
    >
      {shouldUseSVG ? (
        <div ref={svgRef} className="w-full h-full">
          {renderSVGGradient()}
        </div>
      ) : (
        renderCSSGradient()
      )}
      
      {/* Mesh nodes overlay for editing */}
      {gradient.type === 'mesh' && gradient.meshNodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute w-4 h-4 border-2 border-white rounded-full bg-white/20 cursor-pointer"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          drag
          dragConstraints={canvasRef}
          onDrag={(e, info) => {
            if (canvasRef.current) {
              const rect = canvasRef.current.getBoundingClientRect();
              const x = ((info.point.x - rect.left) / rect.width) * 100;
              const y = ((info.point.y - rect.top) / rect.height) * 100;
              
              // Update node position in store
              useEditorStore.getState().updateMeshNode(node.id, { 
                x: Math.max(0, Math.min(100, x)), 
                y: Math.max(0, Math.min(100, y)) 
              });
            }
          }}
        />
      ))}
    </div>
  );
} 