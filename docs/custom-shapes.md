# 커스텀 파티클

SVG Path를 사용하여 커스텀 모양의 파티클을 만들 수 있습니다.

## 기본 사용법

### createShape 함수

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

function MyComponent() {
  const { fire, createShape } = useConfetti()

  const heart = createShape({
    path: 'M5 2 C5 0.5 6 0 7 0 C8 0 9 1 9 2.5 C9 4 7.5 6 5 8 C2.5 6 1 4 1 2.5 C1 1 2 0 3 0 C4 0 5 0.5 5 2z',
  })

  return <button onClick={() => fire({ shapes: [heart], particleCount: 50 })}>하트 발사! ❤️</button>
}
```

---

## 예제 모양

### 하트

```tsx
const heart = createShape({
  path: 'M5 2 C5 0.5 6 0 7 0 C8 0 9 1 9 2.5 C9 4 7.5 6 5 8 C2.5 6 1 4 1 2.5 C1 1 2 0 3 0 C4 0 5 0.5 5 2z',
})
```

### 별 (6각)

```tsx
const star = createShape({
  path: 'M5 0 L6 3 L10 3 L7 5 L8 8 L5 6 L2 8 L3 5 L0 3 L4 3z',
})
```

### 호박

```tsx
const pumpkin = createShape({
  path: 'M449.4 142c-5 0-10 .3-15 1a183 183 0 0 0-66.9-19.1V87.5a17.5 17.5 0 1 0-35 0v36.4a183 183 0 0 0-67 19c-4.9-.6-9.9-1-14.8-1C170.3 142 105 219.6 105 315s65.3 173 145.7 173c5 0 10-.3 14.8-1a184.7 184.7 0 0 0 169 0c4.9.7 9.9 1 14.9 1 80.3 0 145.6-77.6 145.6-173s-65.3-173-145.7-173zm-220 138 27.4-40.4a11.6 11.6 0 0 1 16.4-2.7l54.7 40.3a11.3 11.3 0 0 1-7 20.3H239a11.3 11.3 0 0 1-9.6-17.5zM444 383.8l-43.7 17.5a17.7 17.7 0 0 1-13 0l-37.3-15-37.2 15a17.8 17.8 0 0 1-13 0L256 383.8a17.5 17.5 0 0 1 13-32.6l37.3 15 37.2-15c4.2-1.6 8.8-1.6 13 0l37.3 15 37.2-15a17.5 17.5 0 0 1 13 32.6zm17-86.3h-82a11.3 11.3 0 0 1-6.9-20.4l54.7-40.3a11.6 11.6 0 0 1 16.4 2.8l27.4 40.4a11.3 11.3 0 0 1-9.6 17.5z',
})
```

---

## Matrix를 사용한 최적화

복잡한 SVG Path는 transform matrix를 미리 계산하여 성능을 개선할 수 있습니다.

### 기본 사용법

```tsx
const optimizedPumpkin = createShape({
  path: 'M449.4 142c-5 0-10 .3-15 1a183 183 0 0 0-66.9-19.1V87.5...',
  matrix: [
    0.020491803278688523, 0, 0, 0.020491803278688523, -7.172131147540983, -5.9016393442622945,
  ],
})
```

### Matrix 계산 방법

Matrix는 SVG의 viewBox와 실제 크기를 기반으로 계산됩니다. canvas-confetti가 자동으로 계산하지만, 미리 계산하면 성능이 향상됩니다.

```tsx
// DOMMatrix 사용
const matrix = new DOMMatrix([scaleX, 0, 0, scaleY, translateX, translateY])
```

---

## 여러 모양 조합

기본 모양과 커스텀 모양을 함께 사용할 수 있습니다.

```tsx
const { fire, createShape } = useConfetti()

const heart = createShape({
  path: 'M5 2 C5 0.5 6 0 7 0 C8 0 9 1 9 2.5 C9 4 7.5 6 5 8 C2.5 6 1 4 1 2.5 C1 1 2 0 3 0 C4 0 5 0.5 5 2z',
})

const star = createShape({
  path: 'M5 0 L6 3 L10 3 L7 5 L8 8 L5 6 L2 8 L3 5 L0 3 L4 3z',
})

fire({
  shapes: [heart, star, 'circle', 'square'],
  particleCount: 100,
  colors: ['#ff0000', '#ffd700'],
})
```

---

## 주의사항

### Fill만 지원

모든 path는 **fill**로 처리됩니다. stroke는 지원되지 않습니다.

```tsx
// ❌ stroke 속성은 무시됨
<path d="..." stroke="#000" fill="none" />

// ✅ fill만 사용
<path d="..." fill="#000" />
```

### 단일 색상

각 파티클은 **단일 색상**만 지원합니다. 그라디언트나 여러 색상은 사용할 수 없습니다.

```tsx
// ✅ colors 옵션으로 여러 색상 사용 (랜덤하게 선택됨)
fire({
  shapes: [heart],
  colors: ['#ff0000', '#ff69b4', '#ff1493'],
})

// ❌ path 내부에 색상 지정 불가
```

### 좌표 범위

어떤 좌표 범위의 SVG path도 자동으로 적절한 크기로 렌더링됩니다.

```tsx
// ✅ 0-10 범위
createShape({ path: 'M5 0 L10 5 L5 10 L0 5z' })

// ✅ 0-1000 범위 (자동으로 스케일 조정됨)
createShape({ path: 'M500 0 L1000 500 L500 1000 L0 500z' })
```

---

## 다음 단계

- [API 레퍼런스](./api-reference.md) - createShape 함수 상세 설명
- [예제 모음](./examples.md) - 커스텀 파티클 사용 예제
