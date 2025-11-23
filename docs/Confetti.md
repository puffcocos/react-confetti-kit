# Confetti 컴포넌트 문서

canvas-confetti를 활용한 React 컴포넌트 라이브러리입니다.

## 목차

- [설치](#설치)
- [기본 사용법](#기본-사용법)
- [API 레퍼런스](#api-레퍼런스)
  - [Confetti 컴포넌트](#confetti-컴포넌트)
  - [useConfetti 훅](#useconfetti-훅)
  - [confettiPresets](#confettipresets)
- [고급 사용법](#고급-사용법)
- [예제](#예제)
- [옵션 가이드](#옵션-가이드)

---

## 설치

```bash
# pnpm
pnpm add canvas-confetti
pnpm add -D @types/canvas-confetti

# npm
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti

# yarn
yarn add canvas-confetti
yarn add -D @types/canvas-confetti
```

---

## 기본 사용법

### Confetti 컴포넌트

클릭 시 confetti 효과가 발생하는 가장 간단한 방법입니다.

```tsx
import { Confetti } from "./components/Confetti";

function App() {
  return (
    <Confetti>
      <button>클릭하세요!</button>
    </Confetti>
  );
}
```

### useConfetti 훅

프로그래밍 방식으로 confetti를 제어할 수 있습니다.

```tsx
import { useConfetti } from "./components/Confetti";

function App() {
  const fire = useConfetti();

  const handleSuccess = () => {
    fire({ particleCount: 100, spread: 70 });
  };

  return <button onClick={handleSuccess}>성공!</button>;
}
```

---

## API 레퍼런스

### Confetti 컴포넌트

#### Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `children` | `React.ReactNode` | 필수 | 트리거 요소 (클릭 시 confetti 실행) |
| `options` | `ConfettiOptions` | `{}` | canvas-confetti 커스터마이징 옵션 |
| `autoFire` | `boolean` | `false` | 자동으로 confetti 실행 여부 |
| `className` | `string` | `undefined` | 트리거 요소의 클래스명 |
| `onBeforeFire` | `() => void` | `undefined` | confetti 실행 전 콜백 |
| `onAfterFire` | `() => void` | `undefined` | confetti 실행 후 콜백 |

#### 사용 예제

```tsx
<Confetti
  options={{
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  }}
  onBeforeFire={() => console.log("발사 준비!")}
  onAfterFire={() => console.log("발사 완료!")}
>
  <button>축하합니다!</button>
</Confetti>
```

---

### useConfetti 훅

프로그래밍 방식으로 confetti를 제어하는 훅입니다.

#### 반환값

`(options?: ConfettiOptions) => void` - confetti 실행 함수

#### 사용 예제

```tsx
const fire = useConfetti();

// 기본 옵션으로 실행
fire();

// 커스텀 옵션으로 실행
fire({ particleCount: 200, spread: 180 });

// 여러 번 실행
const celebrate = () => {
  fire({ particleCount: 100, angle: 60, origin: { x: 0 } });
  fire({ particleCount: 100, angle: 120, origin: { x: 1 } });
};
```

---

### confettiPresets

미리 정의된 8가지 confetti 프리셋을 제공합니다.

#### 사용 가능한 프리셋

| 프리셋 | 설명 |
|--------|------|
| `default` | 기본 confetti 효과 |
| `explosion` | 폭발 효과 |
| `stars` | 별 모양 효과 |
| `snow` | 눈 내리는 효과 |
| `fireworks` | 불꽃놀이 효과 |
| `sides` | 양쪽에서 발사 |
| `school` | 학교 졸업식 스타일 |
| `random` | 랜덤 방향 |

#### 사용 예제

```tsx
import { Confetti, confettiPresets } from "./components/Confetti";

<Confetti options={confettiPresets.explosion}>
  <button>폭발!</button>
</Confetti>

<Confetti options={confettiPresets.stars}>
  <button>별!</button>
</Confetti>
```

---

## 고급 사용법

### 1. 자동 실행

페이지 로드 시 자동으로 confetti를 실행합니다.

```tsx
<Confetti autoFire options={confettiPresets.fireworks}>
  <div>환영합니다!</div>
</Confetti>
```

### 2. 여러 개의 confetti 동시 발사

```tsx
const fire = useConfetti();

const multipleConfetti = () => {
  const count = 200;
  const defaults = { origin: { y: 0.7 } };

  fire({
    ...defaults,
    particleCount: Math.floor(count * 0.25),
    spread: 26,
    startVelocity: 55,
  });

  fire({
    ...defaults,
    particleCount: Math.floor(count * 0.2),
    spread: 60,
  });

  fire({
    ...defaults,
    particleCount: Math.floor(count * 0.35),
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
};
```

### 3. 양쪽에서 발사

```tsx
const fire = useConfetti();

const fromSides = () => {
  // 왼쪽에서
  fire({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.6 },
  });

  // 오른쪽에서
  fire({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.6 },
  });
};
```

### 4. 연속 발사

```tsx
const fire = useConfetti();

const continuous = () => {
  const duration = 3 * 1000; // 3초
  const end = Date.now() + duration;

  const frame = () => {
    fire({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    fire({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};
```

### 5. 특정 위치에서 발사

```tsx
const fire = useConfetti();

const fromPosition = (x: number, y: number) => {
  fire({
    particleCount: 100,
    spread: 70,
    origin: { x, y },
  });
};

// 중앙에서 발사
fromPosition(0.5, 0.5);

// 왼쪽 상단에서 발사
fromPosition(0, 0);

// 오른쪽 하단에서 발사
fromPosition(1, 1);
```

---

## 예제

### 성공 메시지와 함께 사용

```tsx
function SuccessMessage() {
  const fire = useConfetti();
  const [showMessage, setShowMessage] = useState(false);

  const handleSuccess = () => {
    setShowMessage(true);
    fire({ particleCount: 150, spread: 180 });

    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div>
      <button onClick={handleSuccess}>제출</button>
      {showMessage && <p>성공적으로 완료되었습니다!</p>}
    </div>
  );
}
```

### 폼 제출 시 사용

```tsx
function Form() {
  const fire = useConfetti();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 제출 로직...

    // 성공 시 confetti
    fire(confettiPresets.fireworks);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" />
      <button type="submit">제출</button>
    </form>
  );
}
```

### 게임 클리어 시 사용

```tsx
function Game() {
  const fire = useConfetti();
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (score >= 100) {
      // 연속 발사
      const duration = 5000;
      const end = Date.now() + duration;

      const frame = () => {
        fire({
          particleCount: 3,
          angle: 60 + Math.random() * 60,
          spread: 55,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [score]);

  return (
    <div>
      <h1>점수: {score}</h1>
      <button onClick={() => setScore(score + 10)}>점수 올리기</button>
    </div>
  );
}
```

---

## 옵션 가이드

### ConfettiOptions

canvas-confetti의 모든 옵션을 지원합니다.

#### 주요 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `particleCount` | `number` | `50` | 발사할 파티클 개수 |
| `angle` | `number` | `90` | 발사 각도 (도 단위) |
| `spread` | `number` | `45` | 퍼짐 정도 (도 단위) |
| `startVelocity` | `number` | `45` | 시작 속도 |
| `decay` | `number` | `0.9` | 감속 비율 (0.0 ~ 1.0) |
| `gravity` | `number` | `1` | 중력 |
| `drift` | `number` | `0` | 좌우 흔들림 |
| `ticks` | `number` | `200` | 지속 시간 (프레임 수) |
| `origin` | `{x: number, y: number}` | `{x: 0.5, y: 0.5}` | 발사 위치 (0.0 ~ 1.0) |
| `colors` | `string[]` | 랜덤 색상 | 파티클 색상 (HEX 코드) |
| `shapes` | `string[]` | `['square', 'circle']` | 파티클 모양 |
| `scalar` | `number` | `1` | 파티클 크기 배율 |
| `zIndex` | `number` | `100` | z-index 값 |
| `disableForReducedMotion` | `boolean` | `false` | 움직임 감소 설정 시 비활성화 |

#### 색상 커스터마이징

```tsx
fire({
  particleCount: 100,
  colors: ['#ff0000', '#00ff00', '#0000ff']
});

// 파스텔 톤
fire({
  particleCount: 100,
  colors: ['#FFB6C1', '#FFC0CB', '#FFD1DC', '#FFE4E1']
});

// 금색
fire({
  particleCount: 100,
  colors: ['#FFD700', '#FFA500', '#FF8C00']
});
```

#### 모양 커스터마이징

```tsx
// 별 모양만
fire({
  particleCount: 50,
  shapes: ['star']
});

// 원형만
fire({
  particleCount: 50,
  shapes: ['circle']
});

// 혼합
fire({
  particleCount: 50,
  shapes: ['star', 'circle', 'square']
});
```

#### 위치 커스터마이징

```tsx
// 화면 상단 중앙
fire({ origin: { x: 0.5, y: 0 } });

// 화면 하단 중앙
fire({ origin: { x: 0.5, y: 1 } });

// 화면 왼쪽 중앙
fire({ origin: { x: 0, y: 0.5 } });

// 화면 오른쪽 중앙
fire({ origin: { x: 1, y: 0.5 } });

// 화면 중앙
fire({ origin: { x: 0.5, y: 0.5 } });
```

---

## 성능 최적화

### 1. 파티클 수 제한

모바일 디바이스에서는 파티클 수를 줄이는 것이 좋습니다.

```tsx
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

fire({
  particleCount: isMobile ? 50 : 100
});
```

### 2. useCallback 사용

```tsx
const fire = useConfetti();

const handleClick = useCallback(() => {
  fire({ particleCount: 100 });
}, [fire]);
```

### 3. 조건부 렌더링

필요할 때만 confetti를 발사합니다.

```tsx
const [shouldFire, setShouldFire] = useState(false);

useEffect(() => {
  if (shouldFire) {
    fire({ particleCount: 100 });
    setShouldFire(false);
  }
}, [shouldFire, fire]);
```

---

## 접근성 (Accessibility)

### 움직임 감소 설정 지원

일부 사용자는 과도한 애니메이션을 선호하지 않습니다.

```tsx
fire({
  particleCount: 100,
  disableForReducedMotion: true
});
```

### 키보드 접근성

```tsx
<Confetti>
  <button
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // confetti 발사
      }
    }}
  >
    클릭 또는 Enter/Space
  </button>
</Confetti>
```

---

## 트러블슈팅

### Q: Confetti가 보이지 않아요

A: 다음을 확인해보세요:
1. `particleCount`가 0보다 큰지 확인
2. `origin` 값이 화면 범위(0~1) 내에 있는지 확인
3. z-index 값이 다른 요소에 가려지지 않는지 확인

```tsx
fire({
  particleCount: 100, // 0보다 커야 함
  origin: { x: 0.5, y: 0.5 }, // 0~1 사이
  zIndex: 9999 // 충분히 높게
});
```

### Q: 성능이 느려요

A: 파티클 수를 줄이거나 `ticks` 값을 낮추세요.

```tsx
fire({
  particleCount: 50, // 100 → 50
  ticks: 100 // 200 → 100
});
```

### Q: 특정 버튼에서만 발사하고 싶어요

A: useConfetti 훅을 사용하세요.

```tsx
const fire = useConfetti();

<button onClick={() => fire()}>이 버튼만</button>
```

---

## 추가 리소스

- [canvas-confetti 공식 GitHub](https://github.com/catdad/canvas-confetti)
- [canvas-confetti 데모](https://www.kirilv.com/canvas-confetti/)
- [미리보기 페이지](/preview) - 실시간으로 옵션을 테스트해보세요

---

## 라이선스

이 컴포넌트는 canvas-confetti를 기반으로 합니다.
- canvas-confetti: ISC License
