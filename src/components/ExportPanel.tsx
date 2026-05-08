'use client';

import React, { useState, RefObject } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Image as ImageIcon, Code, FileImage, Film, Copy, Check } from 'lucide-react';
import { useEditorStore, ExportType } from '@/store/useEditorStore';
import { CanvasGradientRendererRef } from '@/components/CanvasGradientRenderer';
import { 
  exportGradientAsCSS,
  generateLinearGradientSVG,
  generateRadialGradientSVG,
  generateMeshGradientSVG
} from '@/lib/gradientUtils';

interface ExportPanelProps {
  className?: string;
  canvasRef: RefObject<CanvasGradientRendererRef | null>;
}

export function ExportPanel({ className = '', canvasRef }: ExportPanelProps) {
  const { gradient } = useEditorStore();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedExportType, setSelectedExportType] = useState<ExportType>('css');
  const [exportSize, setExportSize] = useState({ width: 1920, height: 1080 });
  const [copied, setCopied] = useState(false);

  const exportOptions: { type: ExportType; label: string; icon: React.ReactNode; description: string }[] = [
    { 
      type: 'css', 
      label: 'CSS Code', 
      icon: <Code className="w-4 h-4" />, 
      description: 'Copy CSS gradient code for your website'
    },
    { 
      type: 'svg', 
      label: 'SVG Vector', 
      icon: <FileImage className="w-4 h-4" />, 
      description: 'Download scalable vector graphics'
    },
    { 
      type: 'png', 
      label: 'PNG Image', 
      icon: <ImageIcon className="w-4 h-4" />, 
      description: 'Export as high-quality raster image'
    },
    { 
      type: 'mp4', 
      label: 'MP4 Video', 
      icon: <Film className="w-4 h-4" />, 
      description: 'Export animated gradient (coming soon)'
    },
  ];

  const generateExportContent = () => {
    const { width, height } = exportSize;
    
    switch (selectedExportType) {
      case 'css':
        return exportGradientAsCSS(gradient);
      
      case 'svg':
        if (gradient.type === 'linear') {
          return generateLinearGradientSVG(gradient, width, height);
        } else if (gradient.type === 'radial') {
          return generateRadialGradientSVG(gradient, width, height);
        } else if (gradient.type === 'mesh') {
          return generateMeshGradientSVG(gradient, width, height);
        }
        return '';
      
      default:
        return 'Export format not yet implemented';
    }
  };

  const handleExport = async () => {
    const content = generateExportContent();
    
    if (selectedExportType === 'css') {
      // Copy to clipboard
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (selectedExportType === 'svg') {
      // Download SVG file
      const blob = new Blob([content], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gradient-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (selectedExportType === 'png') {
      // Export PNG directly from canvas
      if (canvasRef.current) {
        try {
          const blob = await canvasRef.current.exportAsPNG(exportSize.width, exportSize.height);
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `gradient-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        } catch (error) {
          console.error('Failed to export PNG:', error);
        }
      }
    }
    
    setExportDialogOpen(false);
  };

  const handleQuickExport = (type: ExportType) => {
    setSelectedExportType(type);
    setExportDialogOpen(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Export Buttons */}
      <Card className="p-4 bg-gray-800 border-gray-700">
        <div className="space-y-4">
          <Label className="text-sm font-medium">Quick Export</Label>
          
          <div className="grid grid-cols-2 gap-2">
            {exportOptions.filter(option => ['css', 'svg'].includes(option.type)).map((option) => (
              <Button
                key={option.type}
                variant="outline"
                className="h-16 flex-col gap-1"
                onClick={() => handleQuickExport(option.type)}
              >
                {option.icon}
                <span className="text-xs">{option.label}</span>
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {exportOptions.filter(option => ['png', 'mp4'].includes(option.type)).map((option) => (
              <Button
                key={option.type}
                variant="outline"
                className="h-12 justify-start gap-2"
                onClick={() => handleQuickExport(option.type)}
                disabled={option.type === 'mp4'}
              >
                {option.icon}
                <div className="text-left">
                  <div className="text-sm">{option.label}</div>
                  <div className="text-xs text-gray-400">{option.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Export Settings */}
      <Card className="p-4 bg-gray-800 border-gray-700">
        <div className="space-y-4">
          <Label className="text-sm font-medium">Export Settings</Label>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-400">Image Dimensions</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Width"
                  value={exportSize.width}
                  onChange={(e) => setExportSize(prev => ({ ...prev, width: parseInt(e.target.value) || 1920 }))}
                  className="text-sm"
                />
                <Input
                  type="number"
                  placeholder="Height"
                  value={exportSize.height}
                  onChange={(e) => setExportSize(prev => ({ ...prev, height: parseInt(e.target.value) || 1080 }))}
                  className="text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportSize({ width: 1920, height: 1080 })}
              >
                1080p
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportSize({ width: 3840, height: 2160 })}
              >
                4K
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportSize({ width: 1080, height: 1080 })}
              >
                Square
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Gradient Info */}
      <Card className="p-4 bg-gray-800 border-gray-700">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Gradient Info</Label>
          
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="capitalize">{gradient.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Colors:</span>
              <span>{gradient.colors.length}</span>
            </div>
            {gradient.type === 'linear' && (
              <div className="flex justify-between">
                <span>Angle:</span>
                <span>{gradient.angle}°</span>
              </div>
            )}
            {gradient.type === 'mesh' && (
              <div className="flex justify-between">
                <span>Mesh Nodes:</span>
                <span>{gradient.meshNodes.length}</span>
              </div>
            )}
            {gradient.blur > 0 && (
              <div className="flex justify-between">
                <span>Blur:</span>
                <span>{gradient.blur}px</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export {exportOptions.find(o => o.type === selectedExportType)?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedExportType === 'css' && (
              <div className="space-y-3">
                <Label>CSS Code</Label>
                <div className="relative">
                  <pre className="p-3 bg-gray-800 rounded border border-gray-600 text-sm overflow-x-auto whitespace-pre-wrap">
                    <code className="text-gray-200">
                      {generateExportContent().split(';').join(';\n')}
                    </code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleExport}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            )}
            
            {selectedExportType === 'svg' && (
              <div className="space-y-3">
                <Label>SVG Export</Label>
                <p className="text-sm text-gray-400">
                  Export your gradient as a scalable vector graphic that can be used in web design, print, or any application that supports SVG.
                </p>
                <Button onClick={handleExport} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download SVG
                </Button>
              </div>
            )}
            
            {selectedExportType === 'png' && (
              <div className="space-y-3">
                <Label>PNG Export Settings</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-400">Width</Label>
                    <Input
                      type="number"
                      value={exportSize.width}
                      onChange={(e) => setExportSize(prev => ({ ...prev, width: parseInt(e.target.value) || 1920 }))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Height</Label>
                    <Input
                      type="number"
                      value={exportSize.height}
                      onChange={(e) => setExportSize(prev => ({ ...prev, height: parseInt(e.target.value) || 1080 }))}
                    />
                  </div>
                </div>
                <Button onClick={handleExport} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG ({exportSize.width}×{exportSize.height})
                </Button>
              </div>
            )}
            
            {selectedExportType === 'mp4' && (
              <div className="space-y-3">
                <div className="p-4 bg-gray-800 rounded border border-gray-600 text-center">
                  <Film className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">
                    MP4 export is coming soon!
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    This feature will use ffmpeg.wasm to render animated gradients.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}