'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useEditorStore, Color } from '@/store/useEditorStore';
import { isValidHex, normalizeHex, getContrastColor } from '@/lib/colorUtils';

interface ColorPickerProps {
  color: Color;
  onUpdate: (updates: Partial<Color>) => void;
  onDelete?: () => void;
  showPosition?: boolean;
}

export function ColorPicker({ 
  color, 
  onUpdate, 
  onDelete, 
  showPosition = true 
}: ColorPickerProps) {
  const [tempHex, setTempHex] = useState(color.hex);
  const [isOpen, setIsOpen] = useState(false);

  const handleHexChange = (value: string) => {
    setTempHex(value);
    
    if (isValidHex(value)) {
      onUpdate({ hex: normalizeHex(value) });
    }
  };

  const handleHexBlur = () => {
    if (isValidHex(tempHex)) {
      onUpdate({ hex: normalizeHex(tempHex) });
    } else {
      setTempHex(color.hex);
    }
  };

  const predefinedColors = [
    '#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80',
    '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080',
    '#000000', '#404040', '#808080', '#c0c0c0', '#ffffff', '#8b4513',
    '#a0522d', '#daa520', '#556b2f', '#228b22', '#008080', '#4682b4',
    '#9932cc', '#b22222', '#dc143c', '#ff69b4'
  ];

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-12 h-12 p-0 border-2"
            style={{ 
              backgroundColor: color.hex,
              borderColor: getContrastColor(color.hex)
            }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-80 p-6 bg-gray-900 border-gray-700">
          <div className="space-y-6">
            <div>
              <Label htmlFor="hex-input" className="text-base">Hex Color</Label>
              <Input
                id="hex-input"
                value={tempHex}
                onChange={(e) => handleHexChange(e.target.value)}
                onBlur={handleHexBlur}
                placeholder="#ffffff"
                className="mt-2 h-12 text-base"
              />
            </div>
            
            <div>
              <Label className="text-base">Quick Colors</Label>
              <div className="grid grid-cols-6 gap-2 mt-3">
                {predefinedColors.map((hexColor) => (
                  <button
                    key={hexColor}
                    className="w-10 h-10 rounded border border-gray-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: hexColor }}
                    onClick={() => {
                      onUpdate({ hex: hexColor });
                      setTempHex(hexColor);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex-1 space-y-3">
        <Input
          value={tempHex}
          onChange={(e) => handleHexChange(e.target.value)}
          onBlur={handleHexBlur}
          className="text-base h-10"
          placeholder="#ffffff"
        />
        
        {showPosition && (
          <Input
            type="number"
            min="0"
            max="100"
            value={color.position}
            onChange={(e) => onUpdate({ position: parseInt(e.target.value) || 0 })}
            className="text-base h-10"
            placeholder="Position %"
          />
        )}
      </div>

      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="w-10 h-10 p-0 text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}

interface ColorPaletteManagerProps {
  className?: string;
}
export function ColorPaletteManager({ className = '' }: ColorPaletteManagerProps) {
  const { gradient, updateColor, removeColor, addColor } = useEditorStore();

  const handleAddColor = () => {
    // Add color at the midpoint between existing colors
    const positions = gradient.colors.map(c => c.position).sort((a, b) => a - b);
    let newPosition = 50;
    
    if (positions.length >= 2) {
      // Find the largest gap between consecutive colors
      let maxGap = 0;
      let gapPosition = 50;
      
      for (let i = 0; i < positions.length - 1; i++) {
        const gap = positions[i + 1] - positions[i];
        if (gap > maxGap) {
          maxGap = gap;
          gapPosition = positions[i] + gap / 2;
        }
      }
      
      newPosition = gapPosition;
    }
    
    addColor('#ffffff', newPosition);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between flex-shrink-0">
        <Label className="text-base font-medium">Color Palette</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddColor}
          className="h-10 px-4 text-base"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>
      
      <div className="space-y-4 mt-4 overflow-y-auto flex-1">
        {gradient.colors
          .sort((a, b) => a.position - b.position)
          .map((color) => (
          <ColorPicker
            key={color.id}
            color={color}
            onUpdate={(updates) => updateColor(color.id, updates)}
            onDelete={gradient.colors.length > 2 ? () => removeColor(color.id) : undefined}
            showPosition={true}
          />
        ))}
      </div>
    </div>
  );
}