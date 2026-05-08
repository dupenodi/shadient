# Shadient - Gradient Playground

A gradient design tool built with Next.js: real-time canvas preview, text and image overlays, and exports to CSS, SVG, and PNG.

## Features

### Design mode

- **Gradient types**: Linear and radial (mesh types exist in the data model for export tooling; the sidebar focuses on linear and radial).
- **Color palette**: Add, edit, and remove stops with the color picker.
- **Canvas preview**: Live rendering via HTML5 canvas (`CanvasGradientRenderer`).
- **Controls**: Angle (linear), center (radial), blur, saturation, glow, grain, contrast, brightness.
- **Content**: Optional text or image layers; drag to reposition on the canvas.
- **Random gradient**: One-click random palette and settings.

### Export mode

- **CSS**: Copy-ready gradient CSS.
- **SVG**: Download scalable vector output (includes mesh-style paths where applicable).
- **PNG**: Raster export at chosen dimensions (uses the canvas renderer).
- **MP4**: Placeholder in the UI (not implemented yet).

## Tech stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI**: ShadCN UI
- **State**: Zustand
- **Motion**: Framer Motion (light UI transitions)
- **TypeScript**

## Prerequisites

- **Node.js 20.x or 22.x** (matches `package.json` `engines`; avoids unintended major upgrades on hosts like Vercel)

## Local development

```bash
git clone <repository-url>
cd shadient
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build (local)

```bash
npm run build
npm start
```

## Deploy on Vercel

### Option A: Git integration (recommended)

1. Push this repo to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com) and sign in.
3. **Add New… → Project** and import the repository.
4. Vercel detects **Next.js** automatically. Defaults are fine:
   - **Framework Preset**: Next.js  
   - **Build Command**: `next build` (or `npm run build`)  
   - **Output**: handled by Next.js (no manual output directory).
5. **Root Directory**: If the app lives in a monorepo folder, set it to `shadient` (or your subfolder).
6. **Environment Variables**: None required for this project unless you add API keys later.
7. Click **Deploy**. Vercel runs `npm install` (or `npm ci`), then `npm run build`, and serves the production build.

### Option B: Vercel CLI

```bash
npm i -g vercel
cd shadient
vercel        # follow prompts (link project, confirm settings)
vercel --prod # production deployment
```

### Notes

- **Node version**: The repo declares `"engines": { "node": ">=20.9.0" }`. In Vercel → Project → **Settings → General → Node.js Version**, pick **20.x** (or newer if you prefer and it stays compatible).
- **No `vercel.json` is required** for a standard Next.js app; the platform runs the Next build automatically.

## Main components

| Component | Role |
|-----------|------|
| `GradientPlayground` | Shell layout: Design / Export tabs, sidebars, canvas area |
| `CanvasGradientRenderer` | Canvas-based gradient + text/image rendering and PNG export |
| `Sidebar` | Gradient type, colors, effects, content type |
| `ExportPanel` | CSS / SVG / PNG / MP4 (placeholder) flows |
| `ColorPicker` / `ColorPaletteManager` | Stop editing |

## State

Zustand holds gradient config, text/image content, and design vs export **mode** (`design` | `export`).

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the project  
2. Create a branch (`git checkout -b feature/your-feature`)  
3. Commit and push  
4. Open a Pull Request  

---

Built with Next.js.
