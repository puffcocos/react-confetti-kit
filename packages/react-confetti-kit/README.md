# React Confetti Kit

A modern React confetti library built on canvas-confetti with TypeScript support.

## Features

- 🎨 Easy-to-use React hooks
- 🎯 TypeScript support
- 🎪 Custom shapes (SVG & Path)
- 🎬 Frame-based animations
- ⚡ Performance optimized with Web Workers
- 🎭 Custom canvas support

## Installation

```bash
npm install react-confetti-kit
# or
pnpm add react-confetti-kit
# or
yarn add react-confetti-kit
```

## Usage

```tsx
import { useConfetti } from 'react-confetti-kit'

function MyComponent() {
  const { fire } = useConfetti()

  return (
    <button onClick={() => fire({ particleCount: 100, spread: 70 })}>
      🎉 Celebrate!
    </button>
  )
}
```

## API

### `useConfetti()`

Returns an object with the following methods:

- `fire(options)` - Fire confetti with the given options
- `fireFrame(frame)` - Fire confetti using frame-based animation
- `createShape(options)` - Create custom shapes from SVG or Path
- `setConfettiCanvasRef(canvas)` - Set a custom canvas element

### Options

See the [types](./src/types.ts) file for all available options.

## License

MIT
