# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Confetti Editor is a React-based interactive editor for creating and testing confetti animations using the `canvas-confetti` library. It's built with React Router v7 and deployed to GitHub Pages as a client-side only (SPA) application.

## Development Commands

This project uses **pnpm** (version 10.13.1) as the package manager.

```bash
# Development
pnpm install          # Install dependencies
pnpm run dev          # Start development server at http://localhost:5173
pnpm run typecheck    # Run TypeScript type checking

# Production
pnpm run build        # Build for production (outputs to build/client and build/server)
```

## Coding Conventions

- **kebab-case** for file and folder names
- **PascalCase** for React component names
- **camelCase** for variables and functions (including React hooks)
- TypeScript is used throughout with strict typing

## Architecture

### React Router Configuration

- **SPA Mode**: The app runs in client-side only mode (`ssr: false` in react-router.config.ts)
- **Base Path**: Configured for GitHub Pages deployment with basename `/react-confetti-kit/`
- **Route Structure**: File-based routing defined in `app/routes.ts`
  - `/` - Main preview/editor page
  - `/example` - Example page

### Core State Management

The main application state lives in `app/pages/preview/index.tsx` (PreviewPage component) and manages:

1. **Confetti Options**: All canvas-confetti parameters (particleCount, spread, velocity, gravity, etc.)
2. **Custom Presets**: User-saved combinations of confetti effects (array of ConfettiOptions)
3. **Custom Color Presets**: User-defined color palettes
4. **Editing State**: Tracks which preset/effect is being edited

State flows down to three main child components:

- `PresetSection`: Built-in confetti presets
- `CustomPresetSection`: User-saved presets with multi-effect support
- `SettingsPanel`: Real-time parameter controls

### Confetti System

**Hook Architecture**: The `useConfetti` hook (app/components/use-confetti.ts) wraps canvas-confetti:

- Accepts single `ConfettiOptions` or array of options
- Arrays execute all effects sequentially
- All presets are arrays to support multi-effect animations

**Preset Structure**: Defined in `app/components/presets.ts`

```typescript
// Each preset is an array of ConfettiOptions
celebration: [
  { particleCount: 50, spread: 26, ... },
  { particleCount: 40, spread: 60, ... },
  // Multiple effects fire sequentially
]
```

**Custom Presets**: Users can:

- Build presets by adding current settings as new effects
- Edit individual effects within saved presets
- Load effects back to settings panel for modification
- Export as copy-paste code

### Configuration Files

- **react-router.config.ts**: Sets basename and disables SSR
- **vite.config.ts**: Sets base path and configures plugins (Tailwind, React Router, tsconfig-paths)
- Both files must have matching base/basename for GitHub Pages deployment

### Constants and Types

- **constants.ts**: Default values and OPTION_INFO with labels/descriptions/ranges
- **types.ts**: TypeScript interfaces for CustomPreset, CustomColorPreset, OptionInfo
