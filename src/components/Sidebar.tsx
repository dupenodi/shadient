'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Circle, Square, Type, Image, X, Shuffle } from 'lucide-react';
import { useEditorStore, GradientType, ContentType } from '@/store/useEditorStore';
import { ColorPaletteManager } from './ColorPicker';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const {
    gradient,
    contentType,
    setGradientType,
    setGradientAngle,
    setRadialCenter,
    setBlur,
    setSaturation,
    setGlow,
    setGrain,
    setContrast,
    setBrightness,
    setContentType,
    createTextContent,
    clearContent,
    generateRandomGradient
  } = useEditorStore();

  const gradientTypes: { value: GradientType; label: string; icon: React.ReactNode }[] = [
    { value: 'linear', label: 'Linear', icon: <Square className="w-5 h-5" /> },
    { value: 'radial', label: 'Radial', icon: <Circle className="w-5 h-5" /> },
  ];

  const contentTypes: { value: ContentType; label: string; icon: React.ReactNode }[] = [
    { value: 'none', label: 'None', icon: <X className="w-5 h-5" /> },
    { value: 'text', label: 'Text', icon: <Type className="w-5 h-5" /> },
    { value: 'image', label: 'Image', icon: <Image className="w-5 h-5" /> },
  ];

  const currentGradientType = gradientTypes.find(t => t.value === gradient.type);
  const currentContentType = contentTypes.find(t => t.value === contentType);

  const handleContentTypeChange = (type: ContentType) => {
    if (type === 'text') {
      createTextContent('Your Text Here');
    } else {
      setContentType(type);
    }
  };

  return (
    <div className={`w-96 h-full bg-gray-900 border-r border-gray-700 overflow-y-auto ${className}`}>
      <div className="p-6 space-y-8">
        {/* Gradient Type */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Gradient Type</Label>
              <Button
                onClick={generateRandomGradient}
                variant="outline"
                className="h-10 px-4 text-sm"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Random
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-12 text-base">
                  <div className="flex items-center gap-3">
                    {currentGradientType?.icon}
                    {currentGradientType?.label}
                  </div>
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {gradientTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => setGradientType(type.value)}
                    className="flex items-center gap-3 h-12 text-base"
                  >
                    {type.icon}
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        {/* Gradient Controls */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="space-y-6">
            <Label className="text-base font-medium">Gradient Settings</Label>
            
            {gradient.type === 'linear' && (
              <div className="space-y-3">
                <Label className="text-sm text-gray-400">Angle: {gradient.angle}°</Label>
                <Slider
                  value={[gradient.angle]}
                  onValueChange={([value]) => setGradientAngle(value)}
                  min={0}
                  max={360}
                  step={1}
                  className="w-full h-6"
                />
              </div>
            )}

            {gradient.type === 'radial' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm text-gray-400">Center X: {gradient.centerX}%</Label>
                  <Slider
                    value={[gradient.centerX]}
                    onValueChange={([value]) => setRadialCenter(value, gradient.centerY)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full h-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm text-gray-400">Center Y: {gradient.centerY}%</Label>
                  <Slider
                    value={[gradient.centerY]}
                    onValueChange={([value]) => setRadialCenter(gradient.centerX, value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full h-6"
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Color Palette */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <ColorPaletteManager />
        </Card>

        {/* Effects */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="space-y-6">
            <Label className="text-base font-medium">Effects</Label>
            
            <div className="space-y-3">
              <Label className="text-sm text-gray-400">Blur: {gradient.blur}px</Label>
              <Slider
                value={[gradient.blur]}
                onValueChange={([value]) => setBlur(value)}
                min={0}
                max={50}
                step={1}
                className="w-full h-6"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm text-gray-400">Saturation: {gradient.saturation}%</Label>
              <Slider
                value={[gradient.saturation]}
                onValueChange={([value]) => setSaturation(value)}
                min={0}
                max={200}
                step={1}
                className="w-full h-6"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm text-gray-400">Glow: {gradient.glow}px</Label>
              <Slider
                value={[gradient.glow]}
                onValueChange={([value]) => setGlow(value)}
                min={0}
                max={100}
                step={1}
                className="w-full h-6"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm text-gray-400">Grain: {gradient.grain}%</Label>
              <Slider
                value={[gradient.grain]}
                onValueChange={([value]) => setGrain(value)}
                min={0}
                max={100}
                step={1}
                className="w-full h-6"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm text-gray-400">Contrast: {gradient.contrast}%</Label>
              <Slider
                value={[gradient.contrast]}
                onValueChange={([value]) => setContrast(value)}
                min={0}
                max={200}
                step={1}
                className="w-full h-6"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm text-gray-400">Brightness: {gradient.brightness}%</Label>
              <Slider
                value={[gradient.brightness]}
                onValueChange={([value]) => setBrightness(value)}
                min={0}
                max={200}
                step={1}
                className="w-full h-6"
              />
            </div>
          </div>
        </Card>

        {/* Content Type */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="space-y-4">
            <Label className="text-base font-medium">Add Content</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-12 text-base">
                  <div className="flex items-center gap-3">
                    {currentContentType?.icon}
                    {currentContentType?.label}
                  </div>
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {contentTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => handleContentTypeChange(type.value)}
                    className="flex items-center gap-3 h-12 text-base"
                  >
                    {type.icon}
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {contentType !== 'none' && (
              <Button
                variant="outline"
                onClick={clearContent}
                className="w-full h-10 text-sm"
              >
                Clear Content
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 