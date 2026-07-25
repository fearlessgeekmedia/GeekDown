# Agent Guidelines

## Note
Sciter.js migration was attempted but abandoned due to:
- CSS incompatibilities with w3.css
- Cannot resolve npm modules (Sciter uses different module system)
- Layout/rendering issues

## Tauri Migration (Complete)
- Uses native system WebViews (WebKitGTK, WebView2, WKWebView)
- Binary sizes: 3-5MB vs Electron's 150-200MB
- Memory usage: 50-100MB vs Electron's 200-500MB
- Requires Rust for backend

## Commands
- `npm run dev` - Start Vite dev server
- `npm run build` - Build frontend assets
- `npm run tauri dev` - Run Tauri dev (with WebKitGTK workarounds if needed)
- `npm run tauri build` - Build production Tauri binary

## WebKitGTK Workarounds (Linux)
If window appears blank or doesn't render:
1. `WEBKIT_DISABLE_DMABUF_RENDERER=1 npm run tauri dev`
2. `WEBKIT_DISABLE_DMABUF_RENDERER=1 WEBKIT_DISABLE_COMPOSITING_MODE=1 npm run tauri dev`
3. `WAYLAND_DISPLAY= WEBKIT_DISABLE_DMABUF_RENDERER=1 npm run tauri dev` (force X11)
