# Shadient - Gradient Playground

A powerful, modern gradient design tool built with Next.js, featuring real-time preview, animation controls, and multiple export formats.

## ✨ Features

### 🎨 Design Mode
- **Multiple Gradient Types**: Linear, Radial, and Mesh gradients
- **Interactive Color Palette**: Add, edit, and remove gradient colors with visual color picker
- **Real-time Preview**: See changes instantly on the canvas
- **Gradient Controls**: 
  - Angle adjustment for linear gradients
  - Center point control for radial gradients
  - Draggable mesh nodes for mesh gradients
- **Visual Effects**: Blur, saturation, and glow controls
- **Preset Palettes**: Popular color combinations (sunset, ocean, forest, etc.)

### 🎬 Animation Mode
- **Animation Controls**: Play, pause, and stop gradient animations
- **Configurable Settings**:
  - Duration (0.5s - 10s)
  - Speed multiplier (0.1x - 3x)
  - Direction (normal, reverse, alternate)
  - Loop options
- **Real-time Animation Preview**: See animations in the canvas

### 📤 Export Mode
- **Multiple Export Formats**:
  - **CSS**: Copy-ready gradient CSS code
  - **SVG**: Scalable vector graphics download
  - **PNG**: High-quality raster images (1080p, 4K, custom sizes)
  - **MP4**: Animated gradients (coming soon with ffmpeg.wasm)
- **Custom Export Settings**: Configure dimensions and quality
- **One-click Export**: Quick export buttons for common formats

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shadient
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating Gradients

1. **Choose Gradient Type**: Select from Linear, Radial, or Mesh in the left sidebar
2. **Adjust Colors**: Use the color palette manager to add, edit, or remove colors
3. **Fine-tune Settings**: 
   - For Linear: Adjust the angle
   - For Radial: Set the center position
   - For Mesh: Add nodes and drag them around the canvas
4. **Apply Effects**: Use blur, saturation, and glow sliders for additional effects

### Adding Animation

1. Switch to the **Animate** tab
2. Enable animation with the toggle
3. Adjust duration, speed, and direction
4. Use playback controls to preview
5. Enable looping for continuous animation

### Exporting

1. Switch to the **Export** tab
2. Choose your export format:
   - **CSS**: For web development
   - **SVG**: For scalable graphics
   - **PNG**: For raster images
3. Configure export settings (dimensions, quality)
4. Click export to download or copy

## 🎯 Key Components

- **`GradientCanvas`**: Main rendering component supporting both CSS and SVG gradients
- **`Sidebar`**: Design controls for gradient type and properties
- **`ColorPicker`**: Advanced color selection with presets and palette management
- **`AnimationControls`**: Animation configuration and playback controls
- **`ExportPanel`**: Export functionality with multiple format support

## 🔧 State Management

The app uses Zustand for global state management with the following key features:
- Gradient configuration (type, colors, properties)
- Animation settings (duration, direction, loop)
- UI state (current mode, playback status)
- Persistent state across tab switches

## 🎨 Design System

- **Dark Mode**: Optimized for dark theme with gray color palette
- **Responsive**: Mobile-friendly layout with collapsible sidebars
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized rendering with React hooks and memoization

## 🚀 Deployment

To build for production:

```bash
npm run build
npm start
```

The app can be deployed to any platform supporting Next.js:
- Vercel (recommended)
- Netlify
- Railway
- AWS/Google Cloud/Azure

## 🔮 Future Enhancements (V2)

- **AI-Powered Palettes**: Generate gradients from text prompts
- **User Authentication**: Save and share gradient presets
- **Public Gallery**: Browse community-created gradients
- **Advanced Animations**: More animation types and easing options
- **Video Export**: MP4/WebM export with ffmpeg.wasm
- **Collaboration**: Real-time collaborative editing
- **API Integration**: REST API for gradient generation

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ using Next.js and modern web technologies.
