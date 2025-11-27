# API 레퍼런스

## useConfetti

confetti를 프로그래밍 방식으로 제어하는 React 훅입니다.

#### `fire`

confetti 효과를 실행하는 함수입니다.

**파라미터:**

- `options?: ConfettiOptions | ConfettiOptions[]` - confetti 옵션 (단일 또는 배열)

**예제:**

```tsx
const { fire } = useConfetti()

// 기본 옵션으로 실행
fire()

// 커스텀 옵션으로 실행
fire({ particleCount: 200, spread: 180 })

// 여러 효과를 배열로 실행 (순차적으로 실행됨)
fire([
  { particleCount: 100, angle: 60, origin: { x: 0 } },
  { particleCount: 100, angle: 120, origin: { x: 1 } },
])
```

#### `createShape`

SVG Path로부터 커스텀 파티클 모양을 생성합니다.

**파라미터:**

- `options: ShapeFromPathOptions`
  - `path: string` - SVG path 문자열
  - `matrix?: number[]` - 선택적 transform matrix (성능 최적화)

**반환:**

- `Shape` - canvas-confetti의 Shape 객체

**예제:**

```tsx
const { fire, createShape } = useConfetti()

const heart = createShape({
  path: 'M5 2 C5 0.5 6 0 7 0 C8 0 9 1 9 2.5 C9 4 7.5 6 5 8 C2.5 6 1 4 1 2.5 C1 1 2 0 3 0 C4 0 5 0.5 5 2z',
})

fire({ shapes: [heart], particleCount: 50 })
```

#### `setConfettiCanvasRef`

특정 canvas 요소에서만 confetti를 렌더링하도록 설정하는 ref setter 함수입니다.

**파라미터:**

- `canvas: HTMLCanvasElement | null` - canvas 요소 또는 null (전역 canvas로 복귀)

**예제:**

```tsx
const { fire, setConfettiCanvasRef } = useConfetti()

return (
  <div>
    <canvas ref={setConfettiCanvasRef} width={800} height={600} />
    <button onClick={() => fire()}>발사!</button>
  </div>
)
```

---

## ConfettiOptions

canvas-confetti의 모든 옵션을 지원합니다. 주요 옵션:

### 기본 옵션

| 옵션                      | 타입                       | 기본값                 | 설명                              |
| ------------------------- | -------------------------- | ---------------------- | --------------------------------- |
| `particleCount`           | `number`                   | `50`                   | 생성할 파티클 개수                |
| `angle`                   | `number`                   | `90`                   | 발사 각도 (도)                    |
| `spread`                  | `number`                   | `45`                   | 파티클 퍼짐 정도 (도)             |
| `startVelocity`           | `number`                   | `45`                   | 초기 속도 (픽셀/프레임)           |
| `decay`                   | `number`                   | `0.9`                  | 감속 비율 (0-1)                   |
| `gravity`                 | `number`                   | `1`                    | 중력 강도                         |
| `drift`                   | `number`                   | `0`                    | 좌우 이동 정도                    |
| `ticks`                   | `number`                   | `200`                  | 애니메이션 지속 시간 (프레임)     |
| `origin`                  | `{ x: number, y: number }` | `{ x: 0.5, y: 0.5 }`   | 발사 위치 (0-1)                   |
| `colors`                  | `string[]`                 | `undefined`            | 파티클 색상 배열 (hex)            |
| `shapes`                  | `(Shape \| string)[]`      | `['square', 'circle']` | 파티클 모양                       |
| `scalar`                  | `number`                   | `1`                    | 파티클 크기 배율                  |
| `zIndex`                  | `number`                   | `100`                  | z-index 값                        |
| `disableForReducedMotion` | `boolean`                  | `false`                | 접근성: 애니메이션 감소 모드 대응 |

### 전체 타입 정의

```typescript
import type { ConfettiOptions } from '~/shared/confetti/types'

// 또는 직접 import
import type { Options as ConfettiOptions } from 'canvas-confetti'
```

---

## 다음 단계

- [커스텀 파티클](./custom-shapes.md) - SVG 기반 커스텀 모양
- [예제 모음](./examples.md) - 실전 예제
