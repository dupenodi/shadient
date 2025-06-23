'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Play, Pause, Square, ChevronDown, RotateCcw, Repeat, Timer } from 'lucide-react';
import { useEditorStore, AnimationConfig } from '@/store/useEditorStore';

interface AnimationControlsProps {
  className?: string;
}

export function AnimationControls({ className = '' }: AnimationControlsProps) {
  const {
    animation,
    isPlaying,
    setAnimationEnabled,
    setAnimationDuration,
    setAnimationDirection,
    setAnimationLoop,
    setAnimationSpeed,
    play,
    pause,
    stop
  } = useEditorStore();

  const directionOptions: { value: AnimationConfig['direction']; label: string; icon: React.ReactNode }[] = [
    { value: 'normal', label: 'Normal', icon: <Play className="w-4 h-4" /> },
    { value: 'reverse', label: 'Reverse', icon: <RotateCcw className="w-4 h-4" /> },
    { value: 'alternate', label: 'Alternate', icon: <Repeat className="w-4 h-4" /> },
  ];

  const currentDirection = directionOptions.find(d => d.value === animation.direction);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Animation Toggle */}
      <Card className="p-4 bg-gray-800 border-gray-700">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Animation</Label>
            <Button
              variant={animation.enabled ? "default" : "outline"}
              size="sm"
              onClick={() => setAnimationEnabled(!animation.enabled)}
            >
              {animation.enabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          
          {animation.enabled && (
            <p className="text-xs text-gray-400">
              Enable animation to add motion effects to your gradient.
            </p>
          )}
        </div>
      </Card>

      {/* Playback Controls */}
      {animation.enabled && (
        <Card className="p-4 bg-gray-800 border-gray-700">
          <div className="space-y-4">
            <Label className="text-sm font-medium">Playback</Label>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isPlaying ? pause : play}
                className="flex-1"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={stop}
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-xs text-gray-400 text-center">
              {isPlaying ? 'Animation playing...' : 'Animation paused'}
            </div>
          </div>
        </Card>
      )}

      {/* Animation Settings */}
      {animation.enabled && (
        <Card className="p-4 bg-gray-800 border-gray-700">
          <div className="space-y-4">
            <Label className="text-sm font-medium">Animation Settings</Label>
            
            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-400 flex items-center gap-1">
                <Timer className="w-3 h-3" />
                Duration: {animation.duration}s
              </Label>
              <Slider
                value={[animation.duration]}
                onValueChange={([value]) => setAnimationDuration(value)}
                min={0.5}
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Speed: {animation.speed}x</Label>
              <Slider
                value={[animation.speed]}
                onValueChange={([value]) => setAnimationSpeed(value)}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Direction */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Direction</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      {currentDirection?.icon}
                      {currentDirection?.label}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {directionOptions.map((direction) => (
                    <DropdownMenuItem
                      key={direction.value}
                      onClick={() => setAnimationDirection(direction.value)}
                      className="flex items-center gap-2"
                    >
                      {direction.icon}
                      {direction.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Loop */}
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-400">Loop Animation</Label>
              <Button
                variant={animation.loop ? "default" : "outline"}
                size="sm"
                onClick={() => setAnimationLoop(!animation.loop)}
              >
                {animation.loop ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Animation Types (Future Enhancement) */}
      {animation.enabled && (
        <Card className="p-4 bg-gray-800 border-gray-700">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Animation Type</Label>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                disabled
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-blue-500" />
                  Color Rotation
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                disabled
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                  Mesh Movement
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                disabled
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-t from-yellow-500 to-green-500" />
                  Angle Sweep
                </div>
              </Button>
            </div>
            
            <p className="text-xs text-gray-500">
              More animation types coming soon!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
} 