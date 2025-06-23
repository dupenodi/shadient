"use client";

import React, { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CanvasGradientRenderer,
  CanvasGradientRendererRef,
} from "@/components/CanvasGradientRenderer";
import { Sidebar } from "@/components/Sidebar";
import { ExportPanel } from "@/components/ExportPanel";
import { TextControls } from "@/components/TextControls";
import { ImageControls } from "@/components/ImageControls";
import { useEditorStore } from "@/store/useEditorStore";
import { Palette, Settings, Download, Sparkles, Type, Image } from "lucide-react";

export function GradientPlayground() {
  const { mode, setMode, contentType } = useEditorStore();
  const canvasRef = useRef<CanvasGradientRendererRef>(null);

  return (
    <div className="h-screen bg-gray-950 text-white overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Shadient</h1>
            <p className="text-xs text-gray-400">Gradient Playground</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Created with Next.js + ShadCN UI
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Gradient Controls */}
        <div className="w-96 h-full bg-gray-900 border-r border-gray-700 flex flex-col">
          {/* Tab Navigation */}
          <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4">
            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as "design" | "export")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-700 border-gray-600">
                <TabsTrigger value="design" className="flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="export" className="flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Export
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            <Tabs value={mode} className="h-full">
              <TabsContent value="design" className="h-full m-0">
                <div className="h-full overflow-y-auto">
                  <Sidebar />
                </div>
              </TabsContent>

              <TabsContent value="export" className="h-full m-0">
                <div className="h-full overflow-y-auto p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Download className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-semibold">Export Options</h3>
                  </div>
                  <ExportPanel canvasRef={canvasRef} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center p-6">
          <div className="relative">
            <CanvasGradientRenderer
              ref={canvasRef}
              className=""
            />
          </div>
        </div>

        {/* Right Sidebar - Content Controls */}
        {contentType !== 'none' && (
          <div className="w-96 h-full bg-gray-900 border-l border-gray-700 flex flex-col">
            {/* Header */}
            <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4">
              <div className="flex items-center gap-3">
                {contentType === 'text' && (
                  <>
                    <Type className="w-5 h-5 text-blue-400" />
                    <h3 className="text-base font-semibold">Text Controls</h3>
                  </>
                )}
                {contentType === 'image' && (
                  <>
                    <Image className="w-5 h-5 text-green-400" />
                    <h3 className="text-base font-semibold">Image Controls</h3>
                  </>
                )}
              </div>
            </div>

            {/* Content Controls */}
            <div className="flex-1 overflow-y-auto p-6">
              {contentType === 'text' && <TextControls />}
              {contentType === 'image' && <ImageControls />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
