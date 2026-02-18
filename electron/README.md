# Electron Setup for TimeLedger

This folder contains Electron-specific files for the desktop application.

## Files

- **main.js** - Main Electron process: handles window creation, server lifecycle, and graceful shutdown
- **preload.js** - Secure bridge between Electron and React app (context isolation)
- **icon.ico** - Windows application icon (replace with your own)
- **icon.icns** - macOS application icon (replace with your own)
- **icon.png** - Linux application icon (replace with your own)

## How It Works

1. **One-Click Start**: Running `npm run electron:dev` starts both the Express server (port 5175) and Vite dev server (port 5173), then opens the Electron window.

2. **Data Persistence**: All data is saved to `src/utils/appData.json` via the Express server.

3. **Graceful Shutdown**: When you close the window:
   - The app signals React to save any pending data
   - Waits for save confirmation
   - Terminates all server processes
   - Closes the application cleanly

## Development

```bash
# Start everything (servers + Electron window)
npm run electron:dev

# Or run servers first, then Electron separately
npm run start          # Terminal 1: Start servers
npm run electron:dev   # Terminal 2: Start Electron
```

## Building for Distribution

```bash
# Build for current platform
npm run electron:build

# Build for specific platforms
npm run electron:build:win     # Windows (NSIS installer + portable)
npm run electron:build:mac     # macOS (DMG + ZIP)
npm run electron:build:linux   # Linux (AppImage + DEB)
```

Output will be in the `release/` folder.

## Icons

Replace the placeholder icons with your actual app icons:
- **icon.ico** - 256x256 or multi-size ICO for Windows
- **icon.icns** - macOS icon set
- **icon.png** - 512x512 PNG for Linux

## Notes

- For production builds, the app will need to bundle Node.js or use a different approach for the Express server
- Consider using `electron-store` for simpler config storage
- For auto-updates, add `electron-updater` package
