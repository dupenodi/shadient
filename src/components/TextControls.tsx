'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { GridPositionSelector } from './GridPositionSelector';

interface TextControlsProps {
  className?: string;
}

export function TextControls({ className = '' }: TextControlsProps) {
  const { textContent, updateTextContent } = useEditorStore();

  if (!textContent) return null;

  const fontFamilies = [
    'Inter',
    'Arial',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'Helvetica',
    'Verdana',
    'Trebuchet MS',
    'Impact',
    'Comic Sans MS'
  ];

  const fontWeights = [
    { value: 100, label: 'Thin' },
    { value: 200, label: 'Extra Light' },
    { value: 300, label: 'Light' },
    { value: 400, label: 'Regular' },
    { value: 500, label: 'Medium' },
    { value: 600, label: 'Semi Bold' },
    { value: 700, label: 'Bold' },
    { value: 800, label: 'Extra Bold' },
    { value: 900, label: 'Black' }
  ];

  const alignmentOptions = [
    { value: 'left', label: 'Left', icon: <AlignLeft className="w-5 h-5" /> },
    { value: 'center', label: 'Center', icon: <AlignCenter className="w-5 h-5" /> },
    { value: 'right', label: 'Right', icon: <AlignRight className="w-5 h-5" /> },
    { value: 'justify', label: 'Justify', icon: <AlignJustify className="w-5 h-5" /> }
  ];

  const currentFontFamily = fontFamilies.find(f => f === textContent.fontFamily) || fontFamilies[0];
  const currentFontWeight = fontWeights.find(w => w.value === textContent.fontWeight) || fontWeights[3];
  const currentAlignment = alignmentOptions.find(a => a.value === textContent.textAlign) || alignmentOptions[1];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Text Input */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="space-y-4">
          <Label className="text-base font-medium">Text Content</Label>
          <Input
            value={textContent.text}
            onChange={(e) => updateTextContent({ text: e.target.value })}
            className="text-base h-12"
            placeholder="Enter your text..."
          />
        </div>
      </Card>

      {/* Position */}
      <GridPositionSelector />

      {/* Typography */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="space-y-6">
          <Label className="text-base font-medium">Typography</Label>
          
          {/* Font Family */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Font Family</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-12 text-base">
                  <span style={{ fontFamily: currentFontFamily }}>{currentFontFamily}</span>
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                {fontFamilies.map((font) => (
                  <DropdownMenuItem
                    key={font}
                    onClick={() => updateTextContent({ fontFamily: font })}
                    className="h-12 text-base"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Font Size: {textContent.fontSize}px</Label>
            <Slider
              value={[textContent.fontSize]}
              onValueChange={([value]) => updateTextContent({ fontSize: value })}
              min={12}
              max={200}
              step={1}
              className="w-full h-6"
            />
          </div>

          {/* Font Weight */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Font Weight</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-12 text-base">
                  <span>{currentFontWeight.label}</span>
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {fontWeights.map((weight) => (
                  <DropdownMenuItem
                    key={weight.value}
                    onClick={() => updateTextContent({ fontWeight: weight.value })}
                    className="h-12 text-base"
                    style={{ fontWeight: weight.value }}
                  >
                    {weight.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Text Style */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="space-y-6">
          <Label className="text-base font-medium">Text Style</Label>
          
          {/* Style Toggles */}
          <div className="flex gap-3">
            <Button
              variant={textContent.fontStyle === 'italic' ? 'default' : 'outline'}
              onClick={() => updateTextContent({ 
                fontStyle: textContent.fontStyle === 'italic' ? 'normal' : 'italic' 
              })}
              className="flex-1 h-12"
            >
              <Italic className="w-5 h-5" />
            </Button>
            <Button
              variant={textContent.textDecoration === 'underline' ? 'default' : 'outline'}
              onClick={() => updateTextContent({ 
                textDecoration: textContent.textDecoration === 'underline' ? 'none' : 'underline' 
              })}
              className="flex-1 h-12"
            >
              <Underline className="w-5 h-5" />
            </Button>
          </div>

          {/* Text Alignment */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Text Alignment</Label>
            <div className="grid grid-cols-4 gap-2">
              {alignmentOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={textContent.textAlign === option.value ? 'default' : 'outline'}
                  onClick={() => updateTextContent({ textAlign: option.value as any })}
                  className="h-12"
                >
                  {option.icon}
                </Button>
              ))}
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Text Color</Label>
            <div className="flex gap-3">
              <Input
                type="color"
                value={textContent.color}
                onChange={(e) => updateTextContent({ color: e.target.value })}
                className="w-16 h-12 p-1 cursor-pointer"
              />
              <Input
                value={textContent.color}
                onChange={(e) => updateTextContent({ color: e.target.value })}
                className="flex-1 h-12 text-base"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Advanced Typography */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="space-y-6">
          <Label className="text-base font-medium">Advanced Typography</Label>
          
          {/* Letter Spacing */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Letter Spacing: {textContent.letterSpacing}px</Label>
            <Slider
              value={[textContent.letterSpacing]}
              onValueChange={([value]) => updateTextContent({ letterSpacing: value })}
              min={-5}
              max={20}
              step={0.1}
              className="w-full h-6"
            />
          </div>

          {/* Line Height */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Line Height: {textContent.lineHeight.toFixed(1)}</Label>
            <Slider
              value={[textContent.lineHeight]}
              onValueChange={([value]) => updateTextContent({ lineHeight: value })}
              min={0.5}
              max={3}
              step={0.1}
              className="w-full h-6"
            />
          </div>

          {/* Opacity */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Opacity: {textContent.opacity}%</Label>
            <Slider
              value={[textContent.opacity]}
              onValueChange={([value]) => updateTextContent({ opacity: value })}
              min={0}
              max={100}
              step={1}
              className="w-full h-6"
            />
          </div>

          {/* Glow */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Glow: {textContent.glow}px</Label>
            <Slider
              value={[textContent.glow]}
              onValueChange={([value]) => updateTextContent({ glow: value })}
              min={0}
              max={50}
              step={1}
              className="w-full h-6"
            />
          </div>
        </div>
      </Card>

    </div>
  );
} 