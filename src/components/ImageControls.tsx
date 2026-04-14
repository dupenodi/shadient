'use client';

import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, RotateCcw, Trash2, Lock, Unlock } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';

interface ImageControlsProps {
  className?: string;
}

export function ImageControls({ className = '' }: ImageControlsProps) {
  const { imageContent, updateImageContent, createImageContent, clearContent } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [originalAspectRatio, setOriginalAspectRatio] = useState<number | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        
        // Create temporary image to get dimensions
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          setOriginalAspectRatio(aspectRatio);
          
          // Calculate optimal size (max 400px on longest side)
          const maxSize = 400;
          let width, height;
          
          if (img.width > img.height) {
            width = Math.min(img.width, maxSize);
            height = width / aspectRatio;
          } else {
            height = Math.min(img.height, maxSize);
            width = height * aspectRatio;
          }
          
          createImageContent(src);
          // Update with proper dimensions after creation
          setTimeout(() => {
            updateImageContent({ width: Math.round(width), height: Math.round(height) });
          }, 100);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    if (url.trim()) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        setOriginalAspectRatio(aspectRatio);
        
        // Calculate optimal size
        const maxSize = 400;
        let width, height;
        
        if (img.width > img.height) {
          width = Math.min(img.width, maxSize);
          height = width / aspectRatio;
        } else {
          height = Math.min(img.height, maxSize);
          width = height * aspectRatio;
        }
        
        createImageContent(url);
        setTimeout(() => {
          updateImageContent({ width: Math.round(width), height: Math.round(height) });
        }, 100);
      };
      img.onerror = () => {
        alert('Failed to load image from URL. Please check the URL and try again.');
      };
      img.src = url;
    }
  };

  const handleWidthChange = (width: number) => {
    if (aspectRatioLocked && originalAspectRatio && imageContent) {
      const height = Math.round(width / originalAspectRatio);
      updateImageContent({ width, height });
    } else {
      updateImageContent({ width });
    }
  };

  const handleHeightChange = (height: number) => {
    if (aspectRatioLocked && originalAspectRatio && imageContent) {
      const width = Math.round(height * originalAspectRatio);
      updateImageContent({ width, height });
    } else {
      updateImageContent({ height });
    }
  };

  const resetToOriginalAspectRatio = () => {
    if (originalAspectRatio && imageContent) {
      const height = Math.round(imageContent.width / originalAspectRatio);
      updateImageContent({ height });
    }
  };

  if (!imageContent) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Image Upload */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="space-y-4">
            <Label className="text-base font-medium">Add Image</Label>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-16 text-base flex items-center gap-3"
              variant="outline"
            >
              <Upload className="w-6 h-6" />
              Upload Image File
            </Button>
            
            <div className="text-center text-sm text-gray-400">or</div>
            
            <div className="space-y-3">
              <Label className="text-sm text-gray-400">Image URL</Label>
              <div className="flex gap-3">
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 h-12 text-base"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleImageUrlChange(e.currentTarget.value);
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    handleImageUrlChange(input.value);
                  }}
                  className="h-12 px-6"
                >
                  Add
                </Button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Image Preview */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Image Preview</Label>
            <Button
              onClick={clearContent}
              variant="outline"
              className="h-10 px-4 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
          <div className="relative bg-gray-700 rounded-lg overflow-hidden">
            <img
              src={imageContent.src}
              alt="Uploaded"
              className="w-full h-32 object-cover"
              style={{
                opacity: imageContent.opacity / 100,
                filter: `
                  blur(${imageContent.blur}px)
                  brightness(${imageContent.brightness}%)
                  contrast(${imageContent.contrast}%)
                  saturate(${imageContent.saturation}%)
                `,
                transform: `rotate(${imageContent.rotation}deg)`
              }}
            />
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full h-12 text-base"
          >
            <Upload className="w-5 h-5 mr-2" />
            Change Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </Card>

      <Card className="p-4 bg-gray-800/80 border-gray-700 border-dashed">
        <p className="text-sm text-gray-400 leading-relaxed">
          Drag the image on the canvas to reposition it. The pointer becomes a hand when you are over the image.
        </p>
      </Card>

      {/* Dimensions */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Dimensions</Label>
            <Button
              onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
              variant={aspectRatioLocked ? "default" : "outline"}
              className="h-10 px-4 text-sm"
            >
              {aspectRatioLocked ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
              {aspectRatioLocked ? 'Locked' : 'Unlocked'}
            </Button>
          </div>
          
          {/* Width */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Width: {imageContent.width}px</Label>
            <Slider
              value={[imageContent.width]}
              onValueChange={([value]) => handleWidthChange(value)}
              min={50}
              max={800}
              step={10}
              className="w-full h-6"
            />
          </div>

          {/* Height */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Height: {imageContent.height}px</Label>
            <Slider
              value={[imageContent.height]}
              onValueChange={([value]) => handleHeightChange(value)}
              min={50}
              max={800}
              step={10}
              className="w-full h-6"
            />
          </div>

          {/* Reset to Original Aspect Ratio */}
          {originalAspectRatio && (
            <Button
              onClick={resetToOriginalAspectRatio}
              variant="outline"
              className="w-full h-10 text-sm"
            >
              Reset to Original Aspect Ratio
            </Button>
          )}
        </div>
      </Card>

      {/* Rotation */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="space-y-6">
          <Label className="text-base font-medium">Rotation</Label>
          
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Rotation: {imageContent.rotation}°</Label>
            <div className="flex gap-3">
              <Slider
                value={[imageContent.rotation]}
                onValueChange={([value]) => updateImageContent({ rotation: value })}
                min={0}
                max={360}
                step={1}
                className="flex-1 h-6"
              />
              <Button
                onClick={() => updateImageContent({ rotation: 0 })}
                variant="outline"
                className="h-12 px-3"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Image Effects */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="space-y-6">
          <Label className="text-base font-medium">Image Effects</Label>
          
          {/* Opacity */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Opacity: {imageContent.opacity}%</Label>
            <Slider
              value={[imageContent.opacity]}
              onValueChange={([value]) => updateImageContent({ opacity: value })}
              min={0}
              max={100}
              step={1}
              className="w-full h-6"
            />
          </div>

          {/* Blur */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Blur: {imageContent.blur}px</Label>
            <Slider
              value={[imageContent.blur]}
              onValueChange={([value]) => updateImageContent({ blur: value })}
              min={0}
              max={20}
              step={0.5}
              className="w-full h-6"
            />
          </div>

          {/* Brightness */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Brightness: {imageContent.brightness}%</Label>
            <Slider
              value={[imageContent.brightness]}
              onValueChange={([value]) => updateImageContent({ brightness: value })}
              min={0}
              max={200}
              step={1}
              className="w-full h-6"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Contrast: {imageContent.contrast}%</Label>
            <Slider
              value={[imageContent.contrast]}
              onValueChange={([value]) => updateImageContent({ contrast: value })}
              min={0}
              max={200}
              step={1}
              className="w-full h-6"
            />
          </div>

          {/* Saturation */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Saturation: {imageContent.saturation}%</Label>
            <Slider
              value={[imageContent.saturation]}
              onValueChange={([value]) => updateImageContent({ saturation: value })}
              min={0}
              max={200}
              step={1}
              className="w-full h-6"
            />
          </div>

          {/* Reset Effects */}
          <Button
            onClick={() => updateImageContent({
              opacity: 100,
              blur: 0,
              brightness: 100,
              contrast: 100,
              saturation: 100
            })}
            variant="outline"
            className="w-full h-10 text-sm"
          >
            Reset Effects
          </Button>
        </div>
      </Card>
    </div>
  );
} 